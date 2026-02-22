/**
 * Font selector — dual dropdowns for heading and body fonts.
 * Uses the curated Google Fonts catalog loaded in index.html.
 */
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Curated font catalog — must match the fonts loaded in index.html.
 * Each entry has the font family name and a short category tag.
 */
const FONT_CATALOG = [
  { family: "Inter", category: "Geometric Sans" },
  { family: "Plus Jakarta Sans", category: "Modern Sans" },
  { family: "DM Sans", category: "Clean Sans" },
  { family: "Manrope", category: "Rounded Sans" },
  { family: "Work Sans", category: "Neutral Sans" },
  { family: "Lato", category: "Classic Sans" },
  { family: "Nunito Sans", category: "Friendly Sans" },
  { family: "Syne", category: "Display" },
] as const;

interface FontSelectorProps {
  readonly headingFont: string;
  readonly bodyFont: string;
  readonly onHeadingChange: (font: string) => void;
  readonly onBodyChange: (font: string) => void;
}

export function FontSelector({
  headingFont,
  bodyFont,
  onHeadingChange,
  onBodyChange,
}: FontSelectorProps): React.ReactElement {
  return (
    <div className="space-y-5">
      <FontDropdown
        label="Heading Font"
        value={headingFont}
        onChange={onHeadingChange}
      />
      <FontDropdown
        label="Body Font"
        value={bodyFont}
        onChange={onBodyChange}
      />

      {/* Live preview */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground mb-2">Preview</p>
        <h3
          className="text-lg font-semibold"
          style={{ fontFamily: `"${headingFont}", system-ui, sans-serif` }}
        >
          The quick brown fox jumps over the lazy dog
        </h3>
        <p
          className="mt-1 text-sm text-muted-foreground"
          style={{ fontFamily: `"${bodyFont}", system-ui, sans-serif` }}
        >
          0123456789 — Banking made simple for DemocracyCraft citizens.
        </p>
      </div>
    </div>
  );
}

function FontDropdown({
  label,
  value,
  onChange,
}: {
  readonly label: string;
  readonly value: string;
  readonly onChange: (font: string) => void;
}): React.ReactElement {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FONT_CATALOG.map((font) => (
            <SelectItem key={font.family} value={font.family}>
              <span
                style={{
                  fontFamily: `"${font.family}", system-ui, sans-serif`,
                }}
              >
                {font.family}
              </span>
              <span className="ml-2 text-xs text-muted-foreground">
                {font.category}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
