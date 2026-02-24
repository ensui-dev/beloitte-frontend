/**
 * Theme step — pick a color preset, tweak accent hue, and choose fonts.
 *
 * Layout:
 *   1. Preset grid (3×2) — pick a base theme
 *   2. Accent hue slider — fine-tune the primary color
 *   3. Font selector — choose heading and body fonts
 *
 * The wizard page applies all changes live via applyThemeToDocument(),
 * so the admin sees immediate visual feedback.
 */
import { THEME_PRESETS } from "@/lib/theme/presets";
import { AccentHueSlider } from "@/components/theme/accent-hue-slider";
import { FontSelector } from "@/components/theme/font-selector";
import { Check, Palette } from "lucide-react";

interface ThemeStepProps {
  readonly selectedPresetId: string;
  readonly onPresetChange: (presetId: string) => void;
  readonly accentHue: number;
  readonly onAccentHueChange: (hue: number) => void;
  readonly themeMode: "dark" | "light";
  readonly headingFont: string;
  readonly bodyFont: string;
  readonly onHeadingFontChange: (font: string) => void;
  readonly onBodyFontChange: (font: string) => void;
}

export function ThemeStep({
  selectedPresetId,
  onPresetChange,
  accentHue,
  onAccentHueChange,
  themeMode,
  headingFont,
  bodyFont,
  onHeadingFontChange,
  onBodyFontChange,
}: ThemeStepProps): React.ReactElement {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[oklch(0.62_0.20_255_/_0.1)]">
          <Palette className="h-5 w-5 text-[oklch(0.62_0.20_255)]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Choose a Theme</h2>
          <p className="text-sm text-[oklch(0.65_0.03_255)]">
            Pick a color palette, adjust the accent color, and choose your fonts.
          </p>
        </div>
      </div>

      {/* ─── Preset Grid ─────────────────────────────────────── */}
      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[oklch(0.65_0.03_255)]">
          Color Preset
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {THEME_PRESETS.map((preset) => {
            const isSelected = preset.id === selectedPresetId;
            const colors = preset.theme.colors;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onPresetChange(preset.id)}
                className={`group relative rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-[oklch(0.62_0.20_255)] bg-[oklch(0.62_0.20_255_/_0.06)] ring-1 ring-[oklch(0.62_0.20_255_/_0.3)]"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.04]"
                }`}
              >
                {/* Selected check */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[oklch(0.62_0.20_255)]">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}

                {/* Color swatch strip */}
                <div className="mb-3 flex gap-1 overflow-hidden rounded-md">
                  {[
                    colors.background,
                    colors.primary,
                    colors.secondary,
                    colors.accent,
                    colors.muted,
                  ].map((color, i) => (
                    <div
                      key={i}
                      className="h-6 flex-1"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Label + description */}
                <p className="text-sm font-medium">{preset.label}</p>
                <p className="mt-0.5 text-xs text-[oklch(0.65_0.03_255)] leading-relaxed">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Accent Hue Slider ───────────────────────────────── */}
      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[oklch(0.65_0.03_255)]">
          Accent Color
        </h3>
        <AccentHueSlider
          hue={accentHue}
          onChange={onAccentHueChange}
          mode={themeMode}
        />
      </div>

      {/* ─── Font Selector ───────────────────────────────────── */}
      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-[oklch(0.65_0.03_255)]">
          Typography
        </h3>
        <FontSelector
          headingFont={headingFont}
          bodyFont={bodyFont}
          onHeadingChange={onHeadingFontChange}
          onBodyChange={onBodyFontChange}
        />
      </div>
    </div>
  );
}
