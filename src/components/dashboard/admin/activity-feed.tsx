import {
  UserPlus,
  ArrowLeftRight,
  ArrowDownLeft,
  ArrowUpRight,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ActivityEvent, ActivityEventType } from "@/lib/data/types";

interface ActivityFeedProps {
  readonly events: readonly ActivityEvent[];
}

const EVENT_ICON: Record<ActivityEventType, React.ElementType> = {
  account_created: UserPlus,
  transfer: ArrowLeftRight,
  deposit: ArrowDownLeft,
  withdrawal: ArrowUpRight,
  config_change: Settings,
};

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ActivityFeed({ events }: ActivityFeedProps): React.ReactElement {
  return (
    <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {events.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No recent activity.
          </p>
        ) : (
          events.map((event) => {
            const Icon = EVENT_ICON[event.type];
            return (
              <div
                key={event.id}
                className="flex items-start gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-white/[0.02]"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.04]">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{event.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.actor} &middot; {formatRelativeTime(event.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

export function ActivityFeedSkeleton(): React.ReactElement {
  return (
    <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
      <CardHeader className="pb-3">
        <Skeleton className="h-4 w-28" />
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex items-start gap-3 px-2">
            <Skeleton className="h-7 w-7 rounded-md" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-56" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
