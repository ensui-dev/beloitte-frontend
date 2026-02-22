/**
 * Local draft state for the theme configurator.
 *
 * Mirrors the pattern from useSiteEditorState:
 *   - Draft copy of theme + branding from server config
 *   - Live preview via applyThemeToDocument on every draft change
 *   - Cleanup on unmount restores the server theme
 *   - Dirty checking via JSON.stringify snapshot
 */
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type {
  Branding,
  SiteConfig,
  ThemeConfig,
  ThemeColors,
} from "@/lib/config/site-config-schema";
import type { ThemePreset } from "@/lib/theme/presets";
import { applyThemeToDocument } from "@/lib/theme/theme-utils";
import { deriveAccentColors, extractHue } from "@/lib/theme/oklch-utils";

export interface ThemeEditorDraft {
  readonly theme: ThemeConfig;
  readonly branding: Branding;
}

export interface ThemeEditorState {
  /** Current draft theme (local, unsaved). */
  readonly draft: ThemeEditorDraft;
  /** Whether the draft differs from the server state. */
  readonly hasUnsavedChanges: boolean;
  /** Current accent hue extracted from the primary color. */
  readonly accentHue: number;

  // ─── Mutations ──────────────────────────────────────────────

  /** Apply a full preset (replaces theme entirely). */
  readonly applyPreset: (preset: ThemePreset) => void;
  /** Toggle between dark and light mode. */
  readonly toggleMode: () => void;
  /** Set the accent hue (derives primary, accent, ring, border). */
  readonly setAccentHue: (hue: number) => void;
  /** Update a single color token. */
  readonly updateColor: (key: keyof ThemeColors, value: string) => void;
  /** Update the heading or body font. */
  readonly updateFont: (target: "heading" | "body", fontName: string) => void;
  /** Update the border radius. */
  readonly updateBorderRadius: (value: string) => void;
  /** Update branding fields. */
  readonly updateBranding: (patch: Partial<Branding>) => void;
  /** Discard all changes, revert to server state. */
  readonly discardChanges: () => void;
  /** Build a full SiteConfig with draft theme/branding applied. */
  readonly getDraftConfig: () => SiteConfig;
}

export function useThemeEditorState(
  serverConfig: SiteConfig
): ThemeEditorState {
  const [draft, setDraft] = useState<ThemeEditorDraft>(() => ({
    theme: { ...serverConfig.theme },
    branding: { ...serverConfig.branding },
  }));

  // Snapshot of the server state for dirty checking.
  const serverSnapshot = useRef(
    JSON.stringify({ theme: serverConfig.theme, branding: serverConfig.branding })
  );

  // Keep a ref to the server config so the cleanup can restore it
  // even if the component has re-rendered with a new config.
  const serverConfigRef = useRef(serverConfig);
  serverConfigRef.current = serverConfig;

  // Reset draft when server config changes (e.g. after a save).
  useEffect(() => {
    const newSnapshot = JSON.stringify({
      theme: serverConfig.theme,
      branding: serverConfig.branding,
    });
    if (newSnapshot !== serverSnapshot.current) {
      serverSnapshot.current = newSnapshot;
      setDraft({
        theme: { ...serverConfig.theme },
        branding: { ...serverConfig.branding },
      });
    }
  }, [serverConfig.theme, serverConfig.branding]);

  // ─── Live preview ───────────────────────────────────────────
  // Apply draft theme to the DOM on every change.
  // On unmount, re-apply the server theme so ThemeProvider takes over.
  useEffect(() => {
    const root = document.documentElement;

    // Toggle dark/light class
    if (draft.theme.mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    const cleanup = applyThemeToDocument(
      draft.theme.colors,
      draft.theme.borderRadius,
      draft.theme.fonts
    );

    return () => {
      cleanup();
      // Restore the server theme so ThemeProvider's values are correct.
      const server = serverConfigRef.current.theme;
      if (server.mode === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      applyThemeToDocument(server.colors, server.borderRadius, server.fonts);
    };
  }, [draft.theme]);

  const hasUnsavedChanges = useMemo(
    () =>
      JSON.stringify({ theme: draft.theme, branding: draft.branding }) !==
      serverSnapshot.current,
    [draft]
  );

  const accentHue = useMemo(
    () => extractHue(draft.theme.colors.primary),
    [draft.theme.colors.primary]
  );

  // ─── Mutations ──────────────────────────────────────────────

  const applyPreset = useCallback((preset: ThemePreset): void => {
    setDraft((prev) => ({
      ...prev,
      theme: { ...preset.theme },
    }));
  }, []);

  const toggleMode = useCallback((): void => {
    setDraft((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        mode: prev.theme.mode === "dark" ? "light" : "dark",
      },
    }));
  }, []);

  const setAccentHue = useCallback((hue: number): void => {
    setDraft((prev) => {
      const derived = deriveAccentColors(hue, prev.theme.mode);
      return {
        ...prev,
        theme: {
          ...prev.theme,
          colors: { ...prev.theme.colors, ...derived },
        },
      };
    });
  }, []);

  const updateColor = useCallback(
    (key: keyof ThemeColors, value: string): void => {
      setDraft((prev) => ({
        ...prev,
        theme: {
          ...prev.theme,
          colors: { ...prev.theme.colors, [key]: value },
        },
      }));
    },
    []
  );

  const updateFont = useCallback(
    (target: "heading" | "body", fontName: string): void => {
      setDraft((prev) => ({
        ...prev,
        theme: {
          ...prev.theme,
          fonts: { ...prev.theme.fonts, [target]: fontName },
        },
      }));
    },
    []
  );

  const updateBorderRadius = useCallback((value: string): void => {
    setDraft((prev) => ({
      ...prev,
      theme: { ...prev.theme, borderRadius: value },
    }));
  }, []);

  const updateBranding = useCallback((patch: Partial<Branding>): void => {
    setDraft((prev) => ({
      ...prev,
      branding: { ...prev.branding, ...patch },
    }));
  }, []);

  const discardChanges = useCallback((): void => {
    setDraft({
      theme: { ...serverConfig.theme },
      branding: { ...serverConfig.branding },
    });
  }, [serverConfig.theme, serverConfig.branding]);

  const getDraftConfig = useCallback((): SiteConfig => {
    return {
      ...serverConfig,
      theme: draft.theme,
      branding: draft.branding,
    };
  }, [serverConfig, draft]);

  return {
    draft,
    hasUnsavedChanges,
    accentHue,
    applyPreset,
    toggleMode,
    setAccentHue,
    updateColor,
    updateFont,
    updateBorderRadius,
    updateBranding,
    discardChanges,
    getDraftConfig,
  };
}
