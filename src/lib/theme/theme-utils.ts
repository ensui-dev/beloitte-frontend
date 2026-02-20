/**
 * Theme utilities — maps ThemeConfig to CSS custom properties.
 * These are the actual variables shadcn/ui reads from :root.
 */
import type { ThemeColors } from "./types";

/**
 * Converts a ThemeColors object to a Record of CSS variable name → oklch value.
 * Keys match the shadcn convention (e.g., --primary, --card-foreground).
 */
export function themeColorsToCssVars(
  colors: ThemeColors
): Record<string, string> {
  return {
    "--background": colors.background,
    "--foreground": colors.foreground,
    "--primary": colors.primary,
    "--primary-foreground": colors.primaryForeground,
    "--secondary": colors.secondary,
    "--secondary-foreground": colors.secondaryForeground,
    "--muted": colors.muted,
    "--muted-foreground": colors.mutedForeground,
    "--accent": colors.accent,
    "--accent-foreground": colors.accentForeground,
    "--destructive": colors.destructive,
    "--border": colors.border,
    "--input": colors.input,
    "--ring": colors.ring,
    "--card": colors.card,
    "--card-foreground": colors.cardForeground,
    "--popover": colors.popover,
    "--popover-foreground": colors.popoverForeground,
  };
}

/**
 * Applies theme CSS variables to the document root element.
 * Returns a cleanup function that removes the overrides.
 */
export function applyThemeToDocument(
  colors: ThemeColors,
  borderRadius: string,
  fonts: { heading: string; body: string }
): () => void {
  const root = document.documentElement;
  const vars = themeColorsToCssVars(colors);
  const allKeys: string[] = [];

  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
    allKeys.push(key);
  }

  root.style.setProperty("--radius", borderRadius);
  allKeys.push("--radius");

  root.style.setProperty("--font-heading", fonts.heading);
  root.style.setProperty("--font-body", fonts.body);
  allKeys.push("--font-heading", "--font-body");

  return () => {
    for (const key of allKeys) {
      root.style.removeProperty(key);
    }
  };
}
