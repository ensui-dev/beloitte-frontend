/**
 * Accent hue slider — single slider with rainbow gradient track.
 * Adjusts the primary accent color across the entire theme
 * by deriving 6 related color tokens from one hue value.
 *
 * Shows derived color chips below the slider so the user can see
 * which tokens are affected at a glance.
 */
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { buildOklch } from "@/lib/theme/oklch-utils";

interface AccentHueSliderProps {
  readonly hue: number;
  readonly onChange: (hue: number) => void;
  readonly mode: "dark" | "light";
}

/** Rainbow gradient sampled at 30° intervals for the track. */
const HUE_RAINBOW = `linear-gradient(to right, ${Array.from(
  { length: 13 },
  (_, i) => buildOklch({ l: 0.65, c: 0.2, h: i * 30 }),
).join(", ")})`;

/** Tokens derived from the accent hue slider. */
const DERIVED_TOKENS: ReadonlyArray<{
  label: string;
  getColor: (hue: number, mode: "dark" | "light") => string;
}> = [
  {
    label: "Primary",
    getColor: (h, mode) =>
      buildOklch({ l: mode === "dark" ? 0.62 : 0.5, c: 0.2, h }),
  },
  {
    label: "Accent",
    getColor: (h, mode) =>
      buildOklch({ l: mode === "dark" ? 0.62 : 0.5, c: 0.2, h }),
  },
  {
    label: "Ring",
    getColor: (h, mode) =>
      buildOklch({ l: mode === "dark" ? 0.62 : 0.5, c: 0.2, h }),
  },
  {
    label: "Border",
    getColor: (h, mode) =>
      mode === "dark"
        ? buildOklch({ l: 0.62, c: 0.2, h, alpha: 0.12 })
        : buildOklch({ l: 0.9, c: 0.01, h }),
  },
];

export function AccentHueSlider({
  hue,
  onChange,
  mode,
}: AccentHueSliderProps): React.ReactElement {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <Label className="text-sm">Accent Hue</Label>
        <span className="font-mono text-xs text-muted-foreground">
          {Math.round(hue)}°
        </span>
      </div>

      <div className="relative">
        {/* Rainbow gradient behind the slider */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center">
          <div
            className="h-2 w-full rounded-full"
            style={{ background: HUE_RAINBOW }}
          />
        </div>
        <Slider
          value={[hue]}
          min={0}
          max={360}
          step={1}
          onValueChange={([v]) => onChange(v)}
          className="[&_[data-slot=slider-range]]:bg-transparent [&_[data-slot=slider-track]]:bg-transparent [&_[data-slot=slider-track]]:h-2"
        />
      </div>

      {/* Derived color chips */}
      <div className="flex items-center gap-2">
        {DERIVED_TOKENS.map((token) => (
          <div key={token.label} className="flex items-center gap-1.5">
            <div
              className="size-4 rounded-sm border border-border/50"
              style={{ backgroundColor: token.getColor(hue, mode) }}
            />
            <span className="text-[10px] text-muted-foreground">
              {token.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
