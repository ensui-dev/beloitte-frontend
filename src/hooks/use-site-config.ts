/**
 * React Query hooks for site configuration CRUD.
 * In dev mode, falls back to mock data via the data service layer.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dataService } from "@/lib/data/data-service";
import type { SiteConfig } from "@/lib/config/site-config-schema";

const BANK_ID = import.meta.env.VITE_BANK_ID ?? "demo-bank-001";

const SITE_CONFIG_KEY = ["siteConfig", BANK_ID] as const;

export function useSiteConfig() {
  return useQuery({
    queryKey: SITE_CONFIG_KEY,
    queryFn: () => dataService.getSiteConfig(BANK_ID),
    // No retry — if config doesn't exist (setup required), retrying won't help.
    // Without this, there's a ~7s delay before SetupGuard shows the wizard.
    retry: false,
  });
}

export function useUpdateSiteConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (config: SiteConfig) =>
      dataService.updateSiteConfig(BANK_ID, config),
    onSuccess: (updatedConfig: SiteConfig) => {
      queryClient.setQueryData(SITE_CONFIG_KEY, updatedConfig);
    },
  });
}
