/**
 * React Query hook for BWIFT network health status.
 * Polls the backend health endpoint every 30 seconds.
 */
import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/lib/data/data-service";
import type { BwiftHealth } from "@/lib/data/types";

const BWIFT_HEALTH_KEY = ["bwiftHealth"] as const;
const POLL_INTERVAL_MS = 30_000;

export function useBwiftHealth() {
  return useQuery<BwiftHealth>({
    queryKey: BWIFT_HEALTH_KEY,
    queryFn: () => dataService.getBwiftHealth(),
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: POLL_INTERVAL_MS - 5_000,
  });
}
