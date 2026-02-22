import { useState, useEffect, useCallback } from "react";
import { useBackendHealth } from "@/hooks/use-backend-health";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Format a timestamp into a human-readable "X sec/min ago" string.
 */
function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function ConnectionStatus(): React.ReactElement {
  const { data, isLoading, isFetching, isError, dataUpdatedAt } = useBackendHealth();
  const queryClient = useQueryClient();
  const [, setTick] = useState(0);

  // Tick every second to update the "X ago" display
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1_000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback((): void => {
    void queryClient.invalidateQueries({ queryKey: ["backendHealth"] });
  }, [queryClient]);

  // ─── Loading (initial) ─────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/50" />
        <span>Connecting...</span>
      </div>
    );
  }

  // ─── Error state ───────────────────────────────────────
  if (isError || !data) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <div className="h-2 w-2 rounded-full bg-red-400" />
        <span className="text-red-400">Disconnected</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 text-muted-foreground hover:text-foreground"
          onClick={handleRefresh}
          disabled={isFetching}
        >
          <RefreshCw className={`h-3 w-3 ${isFetching ? "animate-spin" : ""}`} />
        </Button>
      </div>
    );
  }

  // ─── Refreshing ────────────────────────────────────────
  if (isFetching) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Refreshing...</span>
      </div>
    );
  }

  // ─── Connected ─────────────────────────────────────────
  const timeAgo = dataUpdatedAt ? formatTimeAgo(dataUpdatedAt) : "unknown";

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </div>
      <span>
        Connected
        <span className="text-muted-foreground/60">{" · "}{timeAgo}</span>
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 text-muted-foreground hover:text-foreground"
        onClick={handleRefresh}
      >
        <RefreshCw className="h-3 w-3" />
      </Button>
    </div>
  );
}
