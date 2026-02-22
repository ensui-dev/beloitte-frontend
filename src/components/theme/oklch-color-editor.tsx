/**
 * OKLCH color editor — popover-ready panel with a large swatch preview,
 * L/C/H sliders with gradient tracks, optional alpha, and raw text input.
 *
 * Designed to fit inside a shadcn Popover (~280px wide).
 * Reuses the same slider approach as the original oklch-color-picker
 * but with a more prominent color preview and compact layout.
 */
import { useCallback, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  parseOklch,
  buildOklch,
  type OklchComponents,
} from "@/lib/theme/oklch-utils";

interface OklchColorEditorProps {
  /** Display label for the color token (e.g., "Primary"). */
  readonly label: string;
  /** Current oklch() CSS string value. */
  readonly value: string;
  /** Callback when the value changes. */
  readonly onChange: (value: string) => void;
  /** Show alpha slider (for border/input tokens with transparency). */
  readonly showAlpha?: boolean;
}

export function OklchColorEditor({
  label,
  value,
  onChange,
  showAlpha = false,
}: OklchColorEditorProps): React.ReactElement {
  const parsed = useMemo(() => parseOklch(value), [value]);

  const components: OklchComponents = parsed ?? {
    l: 0.5,
    c: 0.1,
    h: 0,
    alpha: undefined,
  };

  const updateComponent = useCallback(
    (key: keyof OklchComponents, numValue: number): void => {
      onChange(buildOklch({ ...components, [key]: numValue }));
    },
    [components, onChange],
  );

  return (
    <div className="w-[280px] space-y-3">
      {/* Large color swatch preview */}
      <div className="relative h-16 w-full overflow-hidden rounded-lg border border-border">
        {/* Checkerboard for transparent colors */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "repeating-conic-gradient(oklch(0.5 0 0) 0% 25%, oklch(0.35 0 0) 0% 50%) 50% / 12px 12px",
          }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: value }} />
        <span className="absolute bottom-1.5 left-2 rounded bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-white/80 backdrop-blur-sm">
          {label}
        </span>
      </div>

      {/* L slider — Lightness */}
      <SliderRow
        label="L"
        value={components.l}
        min={0}
        max={1}
        step={0.01}
        onChange={(v) => updateComponent("l", v)}
        trackStyle={buildGradient(
          (t) => buildOklch({ ...components, l: t }),
          5,
        )}
      />

      {/* C slider — Chroma */}
      <SliderRow
        label="C"
        value={components.c}
        min={0}
        max={0.4}
        step={0.005}
        onChange={(v) => updateComponent("c", v)}
        trackStyle={buildGradient(
          (t) => buildOklch({ ...components, c: t * 0.4 }),
          5,
        )}
      />

      {/* H slider — Hue */}
      <SliderRow
        label="H"
        value={components.h}
        min={0}
        max={360}
        step={1}
        onChange={(v) => updateComponent("h", v)}
        trackStyle={HUE_GRADIENT}
      />

      {/* Optional alpha slider */}
      {showAlpha && (
        <SliderRow
          label="A"
          value={Math.round((components.alpha ?? 1) * 100)}
          min={0}
          max={100}
          step={1}
          onChange={(v) => updateComponent("alpha", v / 100)}
          trackStyle={buildAlphaGradient(components)}
        />
      )}

      {/* Raw oklch() input */}
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 font-mono text-xs"
        aria-label={`${label} oklch value`}
      />
    </div>
  );
}

// ─── Internal Components ─────────────────────────────────────

interface SliderRowProps {
  readonly label: string;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly onChange: (value: number) => void;
  readonly trackStyle: string;
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  trackStyle,
}: SliderRowProps): React.ReactElement {
  return (
    <div className="flex items-center gap-2">
      <span className="w-3 text-[10px] font-medium text-muted-foreground">
        {label}
      </span>
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center">
          <div
            className="h-1.5 w-full rounded-full"
            style={{ background: trackStyle }}
          />
        </div>
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={([v]) => onChange(v)}
          className="[&_[data-slot=slider-range]]:bg-transparent [&_[data-slot=slider-track]]:bg-transparent"
        />
      </div>
      <span className="w-10 text-right font-mono text-[10px] text-muted-foreground">
        {formatValue(value, max)}
      </span>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────

/** Precomputed rainbow gradient for the hue slider. */
const HUE_GRADIENT = `linear-gradient(to right, ${Array.from(
  { length: 13 },
  (_, i) => `oklch(0.7 0.15 ${i * 30})`,
).join(", ")})`;

/** Sample a color function at N+1 evenly spaced points to build a gradient. */
function buildGradient(fn: (t: number) => string, steps: number): string {
  const stops = Array.from({ length: steps + 1 }, (_, i) => fn(i / steps));
  return `linear-gradient(to right, ${stops.join(", ")})`;
}

/** Build a transparency gradient for the alpha slider. */
function buildAlphaGradient(components: OklchComponents): string {
  const transparent = buildOklch({ ...components, alpha: 0 });
  const opaque = buildOklch({ ...components, alpha: undefined });
  return `linear-gradient(to right, ${transparent}, ${opaque})`;
}

/** Format a slider value for display. */
function formatValue(value: number, max: number): string {
  if (max <= 1) return value.toFixed(2);
  if (max <= 10) return value.toFixed(3);
  return String(Math.round(value));
}
