/**
 * Dynamic web app manifest injector.
 *
 * The manifest can't be a static JSON file because bank name, theme color,
 * and short name are configured per-deployment via the setup wizard.
 * Instead, we generate it at runtime from SiteConfig and inject it as a
 * blob URL <link rel="manifest"> in the document head.
 *
 * This component renders nothing — it's a side-effect-only injector.
 */
import { useEffect } from "react";
import { useSiteConfig } from "@/hooks/use-site-config";

export function ManifestInjector(): null {
  const { data: config } = useSiteConfig();

  useEffect(() => {
    if (!config) return;

    const manifest = {
      name: config.bankName,
      short_name: config.bankSlug.toUpperCase(),
      description: `${config.bankName} — Online Banking`,
      start_url: "/dashboard",
      scope: "/",
      display: "standalone" as const,
      background_color: config.theme.colors.background,
      theme_color: config.theme.colors.primary,
      icons: [
        {
          src: "/web-app-manifest-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "/web-app-manifest-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/favicon.svg",
          type: "image/svg+xml",
          sizes: "any",
        },
      ],
    };

    const blob = new Blob([JSON.stringify(manifest)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    // Replace any existing manifest link (e.g. from a previous config load)
    const existing = document.querySelector('link[rel="manifest"]');
    if (existing) existing.remove();

    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = url;
    document.head.appendChild(link);

    return () => {
      URL.revokeObjectURL(url);
      link.remove();
    };
  }, [config]);

  return null;
}
