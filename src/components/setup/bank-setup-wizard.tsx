/**
 * Bank Setup Wizard — multi-step configuration for first-boot.
 *
 * Steps:
 *   1. Identity  — bank name + slug
 *   2. Currency  — code, name, symbol, position
 *   3. Theme     — preset picker + accent hue slider + font selector
 *   4. ToS       — paste/edit Terms of Service text
 *   5. Review    — summary + optional branding + launch
 *
 * Collects all data in a single state object, then builds a complete
 * SiteConfig on submission with default modules generated from the
 * bank name.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/components/providers/auth-provider";
import { dataService } from "@/lib/data/data-service";
import { defaultModules } from "@/lib/data/mock-data";
import { THEME_PRESETS } from "@/lib/theme/presets";
import { applyThemeToDocument } from "@/lib/theme/theme-utils";
import { deriveAccentColors, extractHue } from "@/lib/theme/oklch-utils";
import { IdentityStep } from "./steps/identity-step";
import { CurrencyStep } from "./steps/currency-step";
import { ThemeStep } from "./steps/theme-step";
import { ReviewStep } from "./steps/review-step";
import { TosSetupStep, generateDefaultTos } from "./steps/tos-setup-step";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { SiteConfig, CurrencyConfig, ThemeConfig } from "@/lib/config/site-config-schema";
import type { ThemePreset } from "@/lib/theme/presets";

// ─── Setup Data Types ─────────────────────────────────────────

export interface SetupIdentity {
  bankName: string;
  bankSlug: string;
  gameBusinessName: string;
  verificationChannelName: string;
}

export type SetupCurrency = CurrencyConfig;

export interface SetupBranding {
  logoUrl: string;
  faviconUrl: string;
}

export interface SetupThemeCustomization {
  /** Selected preset ID — the starting point for theme customization. */
  presetId: string;
  /** Custom accent hue override. null = use the preset's default hue. */
  accentHue: number | null;
  /** Custom font overrides. null = use the preset's default fonts. */
  fonts: { heading: string; body: string } | null;
}

export interface SetupData {
  identity: SetupIdentity;
  currency: SetupCurrency;
  theme: SetupThemeCustomization;
  tosText: string;
  branding: SetupBranding;
}

type SetupStep = "identity" | "currency" | "theme" | "tos" | "review";

const STEPS: readonly SetupStep[] = ["identity", "currency", "theme", "tos", "review"];
const STEP_LABELS: Record<SetupStep, string> = {
  identity: "Bank Identity",
  currency: "Currency",
  theme: "Theme",
  tos: "Terms of Service",
  review: "Review & Launch",
};

// ─── Default Values ─────────────────────────────────────────

const DEFAULT_DATA: SetupData = {
  identity: { bankName: "", bankSlug: "", gameBusinessName: "", verificationChannelName: "#deposit-here" },
  currency: {
    code: "RED",
    name: "Redmont Dollars",
    symbol: "RED $",
    symbolPosition: "prefix",
  },
  theme: {
    presetId: "dark-fintech",
    accentHue: null,
    fonts: null,
  },
  tosText: "",
  branding: { logoUrl: "", faviconUrl: "" },
};

// ─── Component ──────────────────────────────────────────────

export function BankSetupWizard(): React.ReactElement {
  const [step, setStep] = useState<SetupStep>("identity");
  const [data, setData] = useState<SetupData>(DEFAULT_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const session = useSession();

  const bankId =
    session?.bankId ??
    (import.meta.env.VITE_BANK_ID as string | undefined) ??
    "demo-bank-001";

  const currentIndex = STEPS.indexOf(step);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === STEPS.length - 1;

  // ─── Build the effective theme from preset + customizations ──
  const selectedPreset = THEME_PRESETS.find(
    (p) => p.id === data.theme.presetId
  );

  // Compute the effective ThemeConfig by layering customizations on the preset
  const effectiveTheme: ThemeConfig | null = useMemo(() => {
    if (!selectedPreset) return null;

    let colors = { ...selectedPreset.theme.colors };

    // If a custom accent hue is set, derive accent colors
    if (data.theme.accentHue !== null) {
      const derived = deriveAccentColors(
        data.theme.accentHue,
        selectedPreset.theme.mode
      );
      colors = { ...colors, ...derived };
    }

    // Use custom fonts if set, otherwise fall back to preset
    const fonts = data.theme.fonts ?? selectedPreset.theme.fonts;

    return {
      ...selectedPreset.theme,
      colors,
      fonts,
    };
  }, [selectedPreset, data.theme.accentHue, data.theme.fonts]);

  // The current accent hue — either the custom override or extracted from preset
  const currentAccentHue = useMemo((): number => {
    if (data.theme.accentHue !== null) return data.theme.accentHue;
    return selectedPreset
      ? extractHue(selectedPreset.theme.colors.primary)
      : 255;
  }, [data.theme.accentHue, selectedPreset]);

  // The current fonts — either custom or from preset
  const currentFonts = useMemo(
    () => data.theme.fonts ?? selectedPreset?.theme.fonts ?? { heading: "Inter", body: "Plus Jakarta Sans" },
    [data.theme.fonts, selectedPreset]
  );

  // Apply effective theme to the wizard page for live preview
  useEffect(() => {
    if (!effectiveTheme) return;
    const cleanup = applyThemeToDocument(
      effectiveTheme.colors,
      effectiveTheme.borderRadius,
      effectiveTheme.fonts
    );
    return cleanup;
  }, [effectiveTheme]);

  const goNext = useCallback((): void => {
    if (!isLast) setStep(STEPS[currentIndex + 1]);
  }, [currentIndex, isLast]);

  const goBack = useCallback((): void => {
    if (!isFirst) setStep(STEPS[currentIndex - 1]);
  }, [currentIndex, isFirst]);

  const updateIdentity = useCallback(
    (identity: SetupIdentity): void => {
      setData((prev) => {
        // Auto-generate default ToS when bank name changes and ToS is still empty/default
        const shouldUpdateTos =
          prev.tosText === "" ||
          prev.tosText === generateDefaultTos(prev.identity.bankName);
        return {
          ...prev,
          identity,
          tosText: shouldUpdateTos ? generateDefaultTos(identity.bankName) : prev.tosText,
        };
      });
    },
    []
  );

  const updateCurrency = useCallback(
    (currency: SetupCurrency): void => {
      setData((prev) => ({ ...prev, currency }));
    },
    []
  );

  // When switching presets, reset hue and font customizations
  const updatePresetId = useCallback(
    (presetId: string): void => {
      setData((prev) => ({
        ...prev,
        theme: { presetId, accentHue: null, fonts: null },
      }));
    },
    []
  );

  const updateAccentHue = useCallback(
    (hue: number): void => {
      setData((prev) => ({
        ...prev,
        theme: { ...prev.theme, accentHue: hue },
      }));
    },
    []
  );

  const updateFonts = useCallback(
    (target: "heading" | "body", fontName: string): void => {
      setData((prev) => {
        const baseFonts = prev.theme.fonts ??
          THEME_PRESETS.find((p) => p.id === prev.theme.presetId)?.theme.fonts ??
          { heading: "Inter", body: "Plus Jakarta Sans" };
        return {
          ...prev,
          theme: {
            ...prev.theme,
            fonts: { ...baseFonts, [target]: fontName },
          },
        };
      });
    },
    []
  );

  const updateTosText = useCallback(
    (tosText: string): void => {
      setData((prev) => ({ ...prev, tosText }));
    },
    []
  );

  const updateBranding = useCallback(
    (branding: SetupBranding): void => {
      setData((prev) => ({ ...prev, branding }));
    },
    []
  );

  // Check if the current step is valid for navigation
  const isStepValid = (): boolean => {
    switch (step) {
      case "identity":
        return (
          data.identity.bankName.trim().length > 0 &&
          data.identity.bankSlug.trim().length > 0 &&
          data.identity.gameBusinessName.trim().length > 0 &&
          data.identity.verificationChannelName.trim().length > 0
        );
      case "currency":
        return (
          data.currency.code.trim().length > 0 &&
          data.currency.name.trim().length > 0 &&
          data.currency.symbol.trim().length > 0
        );
      case "theme":
        return data.theme.presetId.length > 0;
      case "tos":
        return data.tosText.trim().length > 0;
      case "review":
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!effectiveTheme) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const config: SiteConfig = {
        bankId,
        bankName: data.identity.bankName.trim(),
        bankSlug: data.identity.bankSlug.trim(),
        currency: data.currency,
        modules: defaultModules(data.identity.bankName.trim()),
        theme: effectiveTheme,
        branding: {
          logoUrl: data.branding.logoUrl.trim() || undefined,
          faviconUrl: data.branding.faviconUrl.trim() || undefined,
          socialIcons: ["discord"],
        },
        nav: {
          showLogin: true,
          ctaText: "Get Started",
          ctaLink: "/login",
          links: [],
        },
        verificationChannelName: data.identity.verificationChannelName.trim() || "#deposit-here",
        gameBusinessName: data.identity.gameBusinessName.trim() || "Beloitte",
        tosText: data.tosText.trim(),
      };

      await dataService.updateSiteConfig(bankId, config);

      // Invalidate the site config query so SetupGuard re-evaluates
      await queryClient.invalidateQueries({ queryKey: ["siteConfig"] });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save configuration";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Progress indicator — CSS grid ensures equal columns */}
      <div className="relative mb-8" style={{ display: "grid", gridTemplateColumns: `repeat(${STEPS.length}, 1fr)` }}>
        {/* Connector lines — absolute layer, vertically centered on circles (h-8 = 2rem → top 1rem) */}
        {STEPS.slice(0, -1).map((s, i) => (
          <div
            key={`line-${s}`}
            className={`pointer-events-none absolute top-[calc(1rem)] h-px ${
              i < currentIndex
                ? "bg-[oklch(0.62_0.20_255_/_0.3)]"
                : "bg-white/[0.06]"
            }`}
            style={{
              left: `${((i + 0.5) / STEPS.length) * 100}%`,
              width: `${(1 / STEPS.length) * 100}%`,
            }}
          />
        ))}
        {/* Step circles + labels — one per grid cell, centered */}
        {STEPS.map((s, i) => {
          const isActive = i === currentIndex;
          const isCompleted = i < currentIndex;
          return (
            <div key={s} className="relative flex flex-col items-center">
              {/* Solid backdrop to mask connector lines behind inactive circles */}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[oklch(0.14_0.01_255)]">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[oklch(0.62_0.20_255)] text-white"
                      : isCompleted
                        ? "bg-[oklch(0.62_0.20_255_/_0.2)] text-[oklch(0.62_0.20_255)]"
                        : "bg-white/[0.06] text-[oklch(0.65_0.03_255)]"
                  }`}
                >
                  {i + 1}
                </div>
              </div>
              <span
                className={`mt-1.5 whitespace-nowrap text-[10px] font-medium ${
                  isActive
                    ? "text-[oklch(0.985_0_0)]"
                    : "text-[oklch(0.65_0.03_255)]"
                }`}
              >
                {STEP_LABELS[s]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
        {step === "identity" && (
          <IdentityStep
            value={data.identity}
            bankId={bankId}
            onChange={updateIdentity}
          />
        )}
        {step === "currency" && (
          <CurrencyStep value={data.currency} onChange={updateCurrency} />
        )}
        {step === "theme" && (
          <ThemeStep
            selectedPresetId={data.theme.presetId}
            onPresetChange={updatePresetId}
            accentHue={currentAccentHue}
            onAccentHueChange={updateAccentHue}
            themeMode={selectedPreset?.theme.mode ?? "dark"}
            headingFont={currentFonts.heading}
            bodyFont={currentFonts.body}
            onHeadingFontChange={(f) => updateFonts("heading", f)}
            onBodyFontChange={(f) => updateFonts("body", f)}
          />
        )}
        {step === "tos" && (
          <TosSetupStep
            value={data.tosText}
            bankName={data.identity.bankName}
            onChange={updateTosText}
          />
        )}
        {step === "review" && (
          <ReviewStep
            data={data}
            preset={selectedPreset as ThemePreset}
            effectiveTheme={effectiveTheme as ThemeConfig}
            branding={data.branding}
            onBrandingChange={updateBranding}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      {/* Navigation buttons */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="ghost"
          className="text-[oklch(0.65_0.03_255)] hover:text-[oklch(0.985_0_0)]"
          onClick={goBack}
          disabled={isFirst}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {!isLast ? (
          <Button
            className="bg-[oklch(0.62_0.20_255)] text-white hover:bg-[oklch(0.55_0.20_255)]"
            onClick={goNext}
            disabled={!isStepValid()}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          /* Submit button is inside ReviewStep */
          <div />
        )}
      </div>
    </div>
  );
}
