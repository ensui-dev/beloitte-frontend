/**
 * ThemeProvider — applies bank theme configuration to the DOM.
 *
 * Dynamically injects CSS custom properties on :root based on the
 * bank's saved theme config. Also toggles the `dark` class on <html>
 * for shadcn's dark mode variant.
 */
import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import type { ThemeConfig } from "@/lib/theme/types";
import { applyThemeToDocument } from "@/lib/theme/theme-utils";

const ThemeContext = createContext<ThemeConfig | null>(null);

interface ThemeProviderProps {
  readonly theme: ThemeConfig;
  readonly children: ReactNode;
}

export function ThemeProvider({
  theme,
  children,
}: ThemeProviderProps): React.ReactElement {
  useEffect(() => {
    // Toggle dark/light mode class on the root element
    const root = document.documentElement;
    if (theme.mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Apply all CSS variable overrides
    const cleanup = applyThemeToDocument(
      theme.colors,
      theme.borderRadius,
      theme.fonts
    );

    return cleanup;
  }, [theme]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

/**
 * Hook to access the current theme config.
 * Returns null if used outside of ThemeProvider (e.g., before config loads).
 */
export function useThemeConfig(): ThemeConfig | null {
  return useContext(ThemeContext);
}
