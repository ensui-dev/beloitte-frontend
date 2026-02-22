/**
 * Preset selector — 2-column card grid showing built-in theme presets.
 * Each card shows a color swatch bar and the preset label.
 */
import { cn } from "@/lib/utils";
import { THEME_PRESETS, type ThemePreset } from "@/lib/theme/presets";

interface PresetSelectorProps {
  readonly activePresetId: string | undefined;
  readonly onSelect: (preset: ThemePreset) => void;
}

export function PresetSelector({
  activePresetId,
  onSelect,
}: PresetSelectorProps): React.ReactElement {
  return (
    <div className="grid grid-cols-2 gap-3">
      {THEME_PRESETS.map((preset) => {
        const isActive = activePresetId === preset.id;
        const { colors } = preset.theme;

        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset)}
            className={cn(
              "group relative flex flex-col gap-2 rounded-lg border p-3 text-left transition-all hover:border-primary/40",
              isActive
                ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                : "border-border bg-card"
            )}
          >
            {/* Color swatch bar */}
            <div className="flex h-5 w-full gap-0.5 overflow-hidden rounded-sm">
              <SwatchSegment color={colors.background} className="flex-[2]" />
              <SwatchSegment color={colors.primary} className="flex-[2]" />
              <SwatchSegment color={colors.accent} className="flex-[1]" />
              <SwatchSegment color={colors.card} className="flex-[1]" />
              <SwatchSegment color={colors.muted} className="flex-[1]" />
            </div>

            <div>
              <p className="text-sm font-medium">{preset.label}</p>
              <p className="text-xs text-muted-foreground">
                {preset.description}
              </p>
            </div>

            {/* Mode badge */}
            <span className="absolute right-2 top-2 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {preset.theme.mode}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SwatchSegment({
  color,
  className,
}: {
  readonly color: string;
  readonly className?: string;
}): React.ReactElement {
  return (
    <div className={className} style={{ backgroundColor: color }} />
  );
}
