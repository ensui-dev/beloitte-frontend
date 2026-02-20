/**
 * SiteConfigProvider — makes the bank's site configuration available
 * to any descendant component via context.
 *
 * This avoids prop-drilling config values (like currency) through
 * the module registry. Any module can call `useSiteConfigContext()`
 * to access bank-level settings.
 */
import { createContext, useContext, type ReactNode } from "react";
import type { SiteConfig, CurrencyConfig } from "@/lib/config/site-config-schema";

const SiteConfigContext = createContext<SiteConfig | null>(null);

interface SiteConfigProviderProps {
  readonly config: SiteConfig;
  readonly children: ReactNode;
}

export function SiteConfigProvider({
  config,
  children,
}: SiteConfigProviderProps): React.ReactElement {
  return (
    <SiteConfigContext.Provider value={config}>
      {children}
    </SiteConfigContext.Provider>
  );
}

/**
 * Access the full site config from context.
 * Throws if used outside of SiteConfigProvider — this is intentional
 * as a defensive programming measure to catch misuse early.
 */
export function useSiteConfigContext(): SiteConfig {
  const config = useContext(SiteConfigContext);
  if (!config) {
    throw new Error(
      "useSiteConfigContext must be used within a SiteConfigProvider. " +
        "Ensure the component is rendered inside a route that provides site config."
    );
  }
  return config;
}

/**
 * Convenience hook to access just the currency configuration.
 * Used by modules that display monetary amounts.
 */
export function useCurrencyConfig(): CurrencyConfig {
  const config = useSiteConfigContext();
  return config.currency;
}
