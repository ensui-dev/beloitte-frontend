/**
 * Dynamic page title hook.
 *
 * Sets document.title based on the bank name from SiteConfig context
 * and a page-specific suffix. Falls back gracefully when config
 * isn't available yet (e.g., before SiteConfigProvider mounts).
 *
 * Usage:
 *   usePageTitle("Dashboard")       → "Reveille National Bank - Dashboard"
 *   usePageTitle()                   → "Reveille National Bank"
 *   usePageTitle("Sign In", false)   → "Sign In" (no bank name prefix)
 */
import { useEffect } from "react";

const FALLBACK_TITLE = "Banking";

/**
 * Sets the document title with the bank name as prefix.
 *
 * @param suffix   - Page-specific label (e.g., "Dashboard", "Sign In")
 * @param bankName - Bank name from config. Pass undefined if config isn't loaded yet.
 */
export function usePageTitle(suffix?: string, bankName?: string): void {
  useEffect(() => {
    const base = bankName ?? FALLBACK_TITLE;

    document.title = suffix ? `${base} - ${suffix}` : base;

    return () => {
      // Reset to fallback on unmount so stale titles don't linger
      // during route transitions before the next page sets its title
      document.title = bankName ?? FALLBACK_TITLE;
    };
  }, [suffix, bankName]);
}
