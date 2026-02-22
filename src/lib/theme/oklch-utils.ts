/**
 * oklch color utilities for the theme editor.
 *
 * oklch(L C H) where:
 *   L = lightness  [0, 1]
 *   C = chroma     [0, 0.4]  (practical max for sRGB gamut)
 *   H = hue        [0, 360)
 *
 * Some tokens include an alpha channel: oklch(L C H / α%)
 */
import type { ThemeColors } from "./types";

export interface OklchComponents {
  readonly l: number;
  readonly c: number;
  readonly h: number;
  /** Alpha as a fraction [0, 1]. undefined = fully opaque. */
  readonly alpha?: number;
}

/**
 * Regex matching oklch functional notation.
 * Captures L, C, H, and optional alpha (with or without %).
 */
const OKLCH_RE =
  /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+)(%?))?\s*\)/;

/**
 * Parse an oklch(...) CSS string into its numeric components.
 * Returns null if the string doesn't match.
 */
export function parseOklch(value: string): OklchComponents | null {
  const match = OKLCH_RE.exec(value);
  if (!match) return null;

  const l = Number(match[1]);
  const c = Number(match[2]);
  const h = Number(match[3]);

  if (Number.isNaN(l) || Number.isNaN(c) || Number.isNaN(h)) return null;

  let alpha: number | undefined;
  if (match[4] !== undefined) {
    const rawAlpha = Number(match[4]);
    if (Number.isNaN(rawAlpha)) return null;
    // If followed by %, it's a percentage (e.g., 12% → 0.12)
    alpha = match[5] === "%" ? rawAlpha / 100 : rawAlpha;
  }

  return { l, c, h, alpha };
}

/**
 * Build an oklch(...) CSS string from components.
 * Rounds values to avoid floating-point noise in CSS output.
 */
export function buildOklch(components: OklchComponents): string {
  const l = roundTo(components.l, 3);
  const c = roundTo(components.c, 4);
  const h = roundTo(components.h, 2);

  if (components.alpha !== undefined && components.alpha < 1) {
    const alphaPercent = roundTo(components.alpha * 100, 1);
    return `oklch(${l} ${c} ${h} / ${alphaPercent}%)`;
  }

  return `oklch(${l} ${c} ${h})`;
}

/**
 * Derive accent-related color tokens from a single hue angle.
 * This powers the "accent hue slider" — one slider that harmoniously
 * adjusts primary, accent, ring, and border colors.
 *
 * The lightness/chroma values differ between dark and light modes
 * to maintain readable contrast ratios.
 */
export function deriveAccentColors(
  hue: number,
  mode: "dark" | "light"
): Partial<ThemeColors> {
  const h = normalizeHue(hue);

  if (mode === "dark") {
    return {
      primary: buildOklch({ l: 0.62, c: 0.2, h }),
      primaryForeground: "oklch(0.985 0 0)",
      accent: buildOklch({ l: 0.62, c: 0.2, h }),
      accentForeground: "oklch(0.985 0 0)",
      ring: buildOklch({ l: 0.62, c: 0.2, h }),
      border: buildOklch({ l: 0.62, c: 0.2, h, alpha: 0.12 }),
    };
  }

  // Light mode: darker primary for readability on white
  return {
    primary: buildOklch({ l: 0.5, c: 0.2, h }),
    primaryForeground: "oklch(0.99 0 0)",
    accent: buildOklch({ l: 0.5, c: 0.2, h }),
    accentForeground: "oklch(0.99 0 0)",
    ring: buildOklch({ l: 0.5, c: 0.2, h }),
    border: buildOklch({ l: 0.9, c: 0.01, h }),
  };
}

/**
 * Extract the hue angle from a primary color token.
 * Returns 0 if the value can't be parsed (achromatic).
 */
export function extractHue(oklchValue: string): number {
  const parsed = parseOklch(oklchValue);
  return parsed?.h ?? 0;
}

// ─── Helpers ────────────────────────────────────────────────────

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function normalizeHue(hue: number): number {
  return ((hue % 360) + 360) % 360;
}
