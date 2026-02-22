/**
 * Built-in theme presets.
 * Each preset provides a complete set of oklch color values for both
 * dark and light modes. The admin selects a preset as a starting point,
 * then can fine-tune individual colors.
 */
import type { ThemeConfig } from "./types";

export interface ThemePreset {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly theme: ThemeConfig;
}

/**
 * Dark Slate — neutral grey, pure achromatic.
 * The clean utility dashboard look with no hue.
 */
const darkSlate: ThemePreset = {
  id: "dark-slate",
  label: "Dark Slate",
  description: "Neutral grey. Clean and utilitarian.",
  theme: {
    mode: "dark",
    preset: "dark-slate",
    colors: {
      background: "oklch(0.145 0 0)",
      foreground: "oklch(0.985 0 0)",
      primary: "oklch(0.922 0 0)",
      primaryForeground: "oklch(0.205 0 0)",
      secondary: "oklch(0.269 0 0)",
      secondaryForeground: "oklch(0.985 0 0)",
      muted: "oklch(0.269 0 0)",
      mutedForeground: "oklch(0.708 0 0)",
      accent: "oklch(0.269 0 0)",
      accentForeground: "oklch(0.985 0 0)",
      destructive: "oklch(0.704 0.191 22.216)",
      border: "oklch(1 0 0 / 10%)",
      input: "oklch(1 0 0 / 15%)",
      ring: "oklch(0.556 0 0)",
      card: "oklch(0.205 0 0)",
      cardForeground: "oklch(0.985 0 0)",
      popover: "oklch(0.205 0 0)",
      popoverForeground: "oklch(0.985 0 0)",
    },
    fonts: { heading: "Inter", body: "Plus Jakarta Sans" },
    borderRadius: "0.625rem",
  },
};

/**
 * Dark Fintech — deep navy/black with teal accent.
 * Inspired by Cobalt's aesthetic.
 */
const darkFintech: ThemePreset = {
  id: "dark-fintech",
  label: "Dark Fintech",
  description: "Deep navy with cobalt blue accents. Modern and premium.",
  theme: {
    mode: "dark",
    preset: "dark-fintech",
    colors: {
      background: "oklch(0.11 0.025 255)",
      foreground: "oklch(0.985 0 0)",
      primary: "oklch(0.62 0.20 255)",
      primaryForeground: "oklch(0.985 0 0)",
      secondary: "oklch(0.19 0.025 255)",
      secondaryForeground: "oklch(0.985 0 0)",
      muted: "oklch(0.19 0.025 255)",
      mutedForeground: "oklch(0.65 0.03 255)",
      accent: "oklch(0.62 0.20 255)",
      accentForeground: "oklch(0.985 0 0)",
      destructive: "oklch(0.577 0.245 27.325)",
      border: "oklch(0.62 0.20 255 / 12%)",
      input: "oklch(1 0 0 / 12%)",
      ring: "oklch(0.62 0.20 255)",
      card: "oklch(0.15 0.025 255)",
      cardForeground: "oklch(0.985 0 0)",
      popover: "oklch(0.17 0.025 255)",
      popoverForeground: "oklch(0.985 0 0)",
    },
    fonts: { heading: "Inter", body: "Plus Jakarta Sans" },
    borderRadius: "0.625rem",
  },
};

/**
 * Dark Gold — black with warm gold accents.
 * Inspired by luxury banking brands like Reverie Reserve.
 */
const darkGold: ThemePreset = {
  id: "dark-gold",
  label: "Dark Gold",
  description: "Black with warm gold accents. Luxurious and bold.",
  theme: {
    mode: "dark",
    preset: "dark-gold",
    colors: {
      background: "oklch(0.10 0.01 60)",
      foreground: "oklch(0.95 0.01 90)",
      primary: "oklch(0.78 0.15 80)",
      primaryForeground: "oklch(0.10 0.01 60)",
      secondary: "oklch(0.20 0.01 60)",
      secondaryForeground: "oklch(0.95 0.01 90)",
      muted: "oklch(0.20 0.01 60)",
      mutedForeground: "oklch(0.60 0.03 60)",
      accent: "oklch(0.78 0.15 80)",
      accentForeground: "oklch(0.10 0.01 60)",
      destructive: "oklch(0.577 0.245 27.325)",
      border: "oklch(0.78 0.15 80 / 12%)",
      input: "oklch(1 0 0 / 10%)",
      ring: "oklch(0.78 0.15 80)",
      card: "oklch(0.14 0.01 60)",
      cardForeground: "oklch(0.95 0.01 90)",
      popover: "oklch(0.16 0.01 60)",
      popoverForeground: "oklch(0.95 0.01 90)",
    },
    fonts: { heading: "Syne", body: "DM Sans" },
    borderRadius: "0.5rem",
  },
};

/**
 * Light Professional — clean white with blue primary.
 * Classic banking aesthetic.
 */
const lightProfessional: ThemePreset = {
  id: "light-professional",
  label: "Light Professional",
  description: "Clean white with blue accents. Classic and trustworthy.",
  theme: {
    mode: "light",
    preset: "light-professional",
    colors: {
      background: "oklch(0.99 0 0)",
      foreground: "oklch(0.15 0.02 265)",
      primary: "oklch(0.50 0.20 260)",
      primaryForeground: "oklch(0.99 0 0)",
      secondary: "oklch(0.96 0.01 260)",
      secondaryForeground: "oklch(0.15 0.02 265)",
      muted: "oklch(0.96 0.01 260)",
      mutedForeground: "oklch(0.50 0.02 265)",
      accent: "oklch(0.50 0.20 260)",
      accentForeground: "oklch(0.99 0 0)",
      destructive: "oklch(0.577 0.245 27.325)",
      border: "oklch(0.90 0.01 265)",
      input: "oklch(0.90 0.01 265)",
      ring: "oklch(0.50 0.20 260)",
      card: "oklch(1 0 0)",
      cardForeground: "oklch(0.15 0.02 265)",
      popover: "oklch(1 0 0)",
      popoverForeground: "oklch(0.15 0.02 265)",
    },
    fonts: { heading: "Inter", body: "Plus Jakarta Sans" },
    borderRadius: "0.75rem",
  },
};

/**
 * Light Minimal — off-white, muted tones, refined.
 */
const lightMinimal: ThemePreset = {
  id: "light-minimal",
  label: "Light Minimal",
  description: "Soft off-white with understated tones. Elegant and clean.",
  theme: {
    mode: "light",
    preset: "light-minimal",
    colors: {
      background: "oklch(0.98 0.005 90)",
      foreground: "oklch(0.20 0.01 60)",
      primary: "oklch(0.25 0.01 60)",
      primaryForeground: "oklch(0.98 0.005 90)",
      secondary: "oklch(0.94 0.005 90)",
      secondaryForeground: "oklch(0.25 0.01 60)",
      muted: "oklch(0.94 0.005 90)",
      mutedForeground: "oklch(0.55 0.01 60)",
      accent: "oklch(0.94 0.005 90)",
      accentForeground: "oklch(0.25 0.01 60)",
      destructive: "oklch(0.577 0.245 27.325)",
      border: "oklch(0.88 0.005 90)",
      input: "oklch(0.88 0.005 90)",
      ring: "oklch(0.55 0.01 60)",
      card: "oklch(1 0 0)",
      cardForeground: "oklch(0.20 0.01 60)",
      popover: "oklch(1 0 0)",
      popoverForeground: "oklch(0.20 0.01 60)",
    },
    fonts: { heading: "Manrope", body: "DM Sans" },
    borderRadius: "0.5rem",
  },
};

/**
 * Light Banking — white with emerald green accents.
 * Classic banking green — trustworthy, institutional, familiar.
 */
const lightBanking: ThemePreset = {
  id: "light-banking",
  label: "Light Banking",
  description: "White with emerald green accents. Classic and institutional.",
  theme: {
    mode: "light",
    preset: "light-banking",
    colors: {
      background: "oklch(0.99 0 0)",
      foreground: "oklch(0.17 0.02 160)",
      primary: "oklch(0.52 0.17 160)",
      primaryForeground: "oklch(0.99 0 0)",
      secondary: "oklch(0.96 0.01 160)",
      secondaryForeground: "oklch(0.17 0.02 160)",
      muted: "oklch(0.96 0.01 160)",
      mutedForeground: "oklch(0.50 0.02 160)",
      accent: "oklch(0.52 0.17 160)",
      accentForeground: "oklch(0.99 0 0)",
      destructive: "oklch(0.577 0.245 27.325)",
      border: "oklch(0.90 0.01 160)",
      input: "oklch(0.90 0.01 160)",
      ring: "oklch(0.52 0.17 160)",
      card: "oklch(1 0 0)",
      cardForeground: "oklch(0.17 0.02 160)",
      popover: "oklch(1 0 0)",
      popoverForeground: "oklch(0.17 0.02 160)",
    },
    fonts: { heading: "Inter", body: "DM Sans" },
    borderRadius: "0.625rem",
  },
};

export const THEME_PRESETS: readonly ThemePreset[] = [
  darkSlate,
  darkFintech,
  darkGold,
  lightProfessional,
  lightMinimal,
  lightBanking,
] as const;

export function getPreset(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find((p) => p.id === id);
}
