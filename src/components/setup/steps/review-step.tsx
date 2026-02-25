/**
 * Review step — summary of all selections + optional branding + launch.
 *
 * Shows summary cards for bank name, currency, theme, and fonts.
 * Provides optional branding inputs (logo URL, favicon URL).
 * The "Launch Your Bank" button triggers the final submission.
 */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Rocket, AlertCircle, Landmark, Coins, Palette, Type, Image, FileText } from "lucide-react";
import type { SetupData, SetupBranding } from "../bank-setup-wizard";
import type { ThemePreset } from "@/lib/theme/presets";
import type { ThemeConfig } from "@/lib/config/site-config-schema";

interface ReviewStepProps {
  readonly data: SetupData;
  readonly preset: ThemePreset;
  /** The fully resolved theme (preset + accent hue + font overrides). */
  readonly effectiveTheme: ThemeConfig;
  readonly branding: SetupBranding;
  readonly onBrandingChange: (branding: SetupBranding) => void;
  readonly isSubmitting: boolean;
  readonly submitError: string | null;
  readonly onSubmit: () => void;
}

export function ReviewStep({
  data,
  preset,
  effectiveTheme,
  branding,
  onBrandingChange,
  isSubmitting,
  submitError,
  onSubmit,
}: ReviewStepProps): React.ReactElement {
  const currencyPreview =
    data.currency.symbolPosition === "suffix"
      ? `1,000 ${data.currency.symbol}`
      : `${data.currency.symbol}1,000`;

  const colors = effectiveTheme.colors;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[oklch(0.62_0.20_255_/_0.1)]">
          <Rocket className="h-5 w-5 text-[oklch(0.62_0.20_255)]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Review & Launch</h2>
          <p className="text-sm text-[oklch(0.65_0.03_255)]">
            Review your configuration and launch your bank.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Bank */}
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[oklch(0.65_0.03_255)]">
            <Landmark className="h-3.5 w-3.5" />
            Bank
          </div>
          <p className="text-sm font-medium">{data.identity.bankName}</p>
          <p className="text-xs text-[oklch(0.65_0.03_255)]">
            /{data.identity.bankSlug}
          </p>
        </div>

        {/* Currency */}
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[oklch(0.65_0.03_255)]">
            <Coins className="h-3.5 w-3.5" />
            Currency
          </div>
          <p className="text-sm font-medium">{currencyPreview}</p>
          <p className="text-xs text-[oklch(0.65_0.03_255)]">
            {data.currency.name} ({data.currency.code})
          </p>
        </div>

        {/* Theme */}
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[oklch(0.65_0.03_255)]">
            <Palette className="h-3.5 w-3.5" />
            Theme
          </div>
          <p className="text-sm font-medium">{preset.label}</p>
          <div className="mt-1 flex gap-0.5 overflow-hidden rounded">
            {[
              colors.background,
              colors.primary,
              colors.secondary,
              colors.accent,
              colors.muted,
            ].map((color, i) => (
              <div
                key={i}
                className="h-3 flex-1"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[oklch(0.65_0.03_255)]">
            <Type className="h-3.5 w-3.5" />
            Typography
          </div>
          <p className="text-sm font-medium">{effectiveTheme.fonts.heading}</p>
          <p className="text-xs text-[oklch(0.65_0.03_255)]">
            {effectiveTheme.fonts.body}
          </p>
        </div>

        {/* Terms of Service */}
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 sm:col-span-2">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[oklch(0.65_0.03_255)]">
            <FileText className="h-3.5 w-3.5" />
            Terms of Service
          </div>
          <p className="text-sm font-medium">
            {data.tosText.trim().length > 0 ? "Custom ToS configured" : "Using default template"}
          </p>
          <p className="text-xs text-[oklch(0.65_0.03_255)]">
            {data.tosText.trim().length > 0
              ? `${data.tosText.trim().length.toLocaleString()} characters`
              : "Editable later in admin settings"}
          </p>
        </div>
      </div>

      {/* Optional branding */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-[oklch(0.65_0.03_255)]">
          <Image className="h-4 w-4" />
          Branding (optional)
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="logo-url" className="text-xs">
              Logo URL
            </Label>
            <Input
              id="logo-url"
              value={branding.logoUrl}
              onChange={(e) =>
                onBrandingChange({ ...branding, logoUrl: e.target.value })
              }
              placeholder="https://example.com/logo.png"
              className="border-white/[0.08] bg-white/[0.04] text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="favicon-url" className="text-xs">
              Favicon URL
            </Label>
            <Input
              id="favicon-url"
              value={branding.faviconUrl}
              onChange={(e) =>
                onBrandingChange({ ...branding, faviconUrl: e.target.value })
              }
              placeholder="https://example.com/favicon.ico"
              className="border-white/[0.08] bg-white/[0.04] text-sm"
            />
          </div>
        </div>

        <p className="text-xs text-[oklch(0.65_0.03_255_/_0.6)]">
          You can configure these later in the admin settings.
        </p>
      </div>

      {/* Submit */}
      {submitError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {submitError}
        </div>
      )}

      <Button
        className="w-full bg-[oklch(0.62_0.20_255)] text-white shadow-lg shadow-[oklch(0.62_0.20_255_/_0.2)] hover:bg-[oklch(0.55_0.20_255)]"
        size="lg"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        <Rocket className="mr-2 h-5 w-5" />
        {isSubmitting ? "Launching..." : "Launch Your Bank"}
      </Button>
    </div>
  );
}
