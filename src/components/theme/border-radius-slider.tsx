/**
 * Border radius slider with visual preview shapes.
 * Adjusts the --radius CSS variable that shadcn uses for all components.
 */
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface BorderRadiusSliderProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

/** Parse a rem string to a number (e.g. "0.625rem" → 0.625). */
function parseRem(value: string): number {
  const num = parseFloat(value);
  return Number.isNaN(num) ? 0.625 : num;
}

export function BorderRadiusSlider({
  value,
  onChange,
}: BorderRadiusSliderProps): React.ReactElement {
  const numValue = parseRem(value);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm">Border Radius</Label>
        <span className="font-mono text-xs text-muted-foreground">
          {numValue.toFixed(3)}rem
        </span>
      </div>

      <Slider
        value={[numValue]}
        min={0}
        max={2}
        step={0.125}
        onValueChange={([v]) => onChange(`${v}rem`)}
      />

      {/* Visual preview row */}
      <div className="flex items-end gap-3 pt-2">
        <PreviewShape radius={value} size="size-10" label="sm" />
        <PreviewShape radius={value} size="size-14" label="md" />
        <PreviewShape radius={value} size="h-10 w-24" label="button" />
        <PreviewShape radius={value} size="size-8" label="badge" />
      </div>
    </div>
  );
}

function PreviewShape({
  radius,
  size,
  label,
}: {
  readonly radius: string;
  readonly size: string;
  readonly label: string;
}): React.ReactElement {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`${size} border border-border bg-primary/20`}
        style={{ borderRadius: radius }}
      />
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}
