import { Activity, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBwiftHealth } from "@/hooks/use-bwift-health";
import { useBackendHealth } from "@/hooks/use-backend-health";
import type { BwiftStatus } from "@/lib/data/types";

const BWIFT_BADGE_VARIANT: Record<BwiftStatus, "default" | "secondary" | "destructive"> = {
  operational: "default",
  degraded: "secondary",
  outage: "destructive",
};

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
}

export function SystemHealth(): React.ReactElement {
  const { data: bwift, isLoading: bwiftLoading } = useBwiftHealth();
  const { data: backend, isLoading: backendLoading } = useBackendHealth();

  if (bwiftLoading || backendLoading) {
    return <SystemHealthSkeleton />;
  }

  return (
    <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* BWIFT Network */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">BWIFT Network</p>
            <p className="text-xs text-muted-foreground">
              {bwift ? `${bwift.latencyMs}ms latency` : "Unknown"}
            </p>
          </div>
          {bwift && (
            <Badge variant={BWIFT_BADGE_VARIANT[bwift.status]} className="text-xs capitalize">
              {bwift.status}
            </Badge>
          )}
        </div>

        {/* Backend */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
            <Server className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Backend API</p>
            <p className="text-xs text-muted-foreground">
              {backend?.version ? `v${backend.version}` : "Unknown"}
              {backend?.uptime != null && ` · ${formatUptime(backend.uptime)} uptime`}
            </p>
          </div>
          {backend && (
            <Badge
              variant={backend.status === "ok" ? "default" : "destructive"}
              className="text-xs capitalize"
            >
              {backend.status === "ok" ? "Healthy" : "Error"}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function SystemHealthSkeleton(): React.ReactElement {
  return (
    <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
      <CardHeader className="pb-3">
        <Skeleton className="h-4 w-28" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
