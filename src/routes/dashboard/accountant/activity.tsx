import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useActivityFeed } from "@/hooks/use-activity-feed";
import { ActivityFeed, ActivityFeedSkeleton } from "@/components/dashboard/admin/activity-feed";

export function AccountantActivityLog(): React.ReactElement {
  const { data: config } = useSiteConfig();
  const { data: activity, isLoading } = useActivityFeed(50);

  usePageTitle("Activity Log", config?.bankName);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Activity Log</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Full audit trail of all bank actions. Read-only.
        </p>
      </div>

      {isLoading || !activity ? (
        <ActivityFeedSkeleton />
      ) : (
        <ActivityFeed events={activity} />
      )}
    </div>
  );
}
