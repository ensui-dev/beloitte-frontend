/**
 * React Query hook for backend API health status.
 * Polls every 30 seconds and exposes manual refetch for the refresh button.
 */
import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/lib/data/data-service";
import type { BackendHealth } from "@/lib/data/types";

const BACKEND_HEALTH_KEY = ["backendHealth"] as const;
const POLL_INTERVAL_MS = 30_000;

export function useBackendHealth() {
  return useQuery<BackendHealth>({
    queryKey: BACKEND_HEALTH_KEY,
    queryFn: () => dataService.getBackendHealth(),
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: POLL_INTERVAL_MS - 5_000,
    retry: 1,
  });
}
