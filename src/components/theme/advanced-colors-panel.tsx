/**
 * Colors panel — all 18 color tokens displayed as a compact swatch grid,
 * grouped into clearly separated sections. Click any swatch to open a
 * popover with the full L/C/H editor.
 *
 * Replaces the old collapsible list of 72 sliders with a visual grid
 * that lets users see the full palette at a glance and edit one at a time.
 */
import { ColorSwatchEditor } from "./color-swatch-editor";
import type { ThemeColors } from "@/lib/config/site-config-schema";

interface ColorsPanelProps {
  readonly colors: ThemeColors;
  readonly onColorChange: (key: keyof ThemeColors, value: string) => void;
}

/** Color tokens grouped by semantic role. */
const COLOR_GROUPS: ReadonlyArray<{
  label: string;
  description: string;
  tokens: ReadonlyArray<{
    key: keyof ThemeColors;
    label: string;
    alpha?: boolean;
  }>;
}> = [
  {
    label: "Surfaces",
    description: "Page, card, and popover backgrounds with their text colors",
    tokens: [
      { key: "background", label: "Background" },
      { key: "foreground", label: "Foreground" },
      { key: "card", label: "Card" },
      { key: "cardForeground", label: "Card Text" },
      { key: "popover", label: "Popover" },
      { key: "popoverForeground", label: "Popover Text" },
    ],
  },
  {
    label: "Primary & Accent",
    description: "Main action colors for buttons and links",
    tokens: [
      { key: "primary", label: "Primary" },
      { key: "primaryForeground", label: "Primary Text" },
      { key: "accent", label: "Accent" },
      { key: "accentForeground", label: "Accent Text" },
    ],
  },
  {
    label: "Secondary & Muted",
    description: "Softer alternatives and disabled states",
    tokens: [
      { key: "secondary", label: "Secondary" },
      { key: "secondaryForeground", label: "Secondary Text" },
      { key: "muted", label: "Muted" },
      { key: "mutedForeground", label: "Muted Text" },
    ],
  },
  {
    label: "Borders & System",
    description: "Dividers, form inputs, focus rings, and error states",
    tokens: [
      { key: "border", label: "Border", alpha: true },
      { key: "input", label: "Input", alpha: true },
      { key: "ring", label: "Focus Ring" },
      { key: "destructive", label: "Destructive" },
    ],
  },
];

export function ColorsPanel({
  colors,
  onColorChange,
}: ColorsPanelProps): React.ReactElement {
  return (
    <div className="space-y-4">
      {COLOR_GROUPS.map((group) => (
        <div
          key={group.label}
          className="rounded-lg border border-border/50 bg-card/30 p-3"
        >
          {/* Section header */}
          <div className="mb-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
              {group.label}
            </h4>
            <p className="mt-0.5 text-[10px] text-muted-foreground/60">
              {group.description}
            </p>
          </div>

          {/* Swatch grid — 2 columns for pairs (bg+fg), 3 for system tokens */}
          <div className="grid grid-cols-2 gap-1.5">
            {group.tokens.map((token) => (
              <ColorSwatchEditor
                key={token.key}
                label={token.label}
                value={colors[token.key]}
                onChange={(v) => onColorChange(token.key, v)}
                showAlpha={token.alpha}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
