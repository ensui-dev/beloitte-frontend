/**
 * Compact color swatch with popover editor.
 *
 * Shows a color preview square + token label. Click to open a
 * Popover containing the full OklchColorEditor (L/C/H sliders + input).
 *
 * Uses a checkerboard background behind the swatch to visualise
 * semi-transparent colors (e.g., border and input tokens with alpha).
 */
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { OklchColorEditor } from "./oklch-color-editor";

interface ColorSwatchEditorProps {
  /** Display label for the token (e.g., "Primary"). */
  readonly label: string;
  /** Current oklch() CSS string value. */
  readonly value: string;
  /** Callback when the value changes. */
  readonly onChange: (value: string) => void;
  /** Show alpha slider in the editor. */
  readonly showAlpha?: boolean;
}

export function ColorSwatchEditor({
  label,
  value,
  onChange,
  showAlpha = false,
}: ColorSwatchEditorProps): React.ReactElement {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-md border border-border/50 bg-card/50 px-2.5 py-2 text-left transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {/* Color swatch with checkerboard for transparency */}
          <div className="relative size-7 shrink-0 overflow-hidden rounded-sm border border-border">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "repeating-conic-gradient(oklch(0.5 0 0) 0% 25%, oklch(0.35 0 0) 0% 50%) 50% / 8px 8px",
              }}
            />
            <div
              className="absolute inset-0"
              style={{ backgroundColor: value }}
            />
          </div>

          {/* Label */}
          <span className="truncate text-xs font-medium text-foreground">
            {label}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-3"
        side="right"
        align="start"
        sideOffset={8}
      >
        <OklchColorEditor
          label={label}
          value={value}
          onChange={onChange}
          showAlpha={showAlpha}
        />
      </PopoverContent>
    </Popover>
  );
}
