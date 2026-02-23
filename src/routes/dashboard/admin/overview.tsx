import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useAdminStats } from "@/hooks/use-admin-stats";
import { useVolumeHistory } from "@/hooks/use-volume-history";
import { useActivityFeed } from "@/hooks/use-activity-feed";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/stat-card";
import { VolumeChart, VolumeChartSkeleton } from "@/components/dashboard/admin/volume-chart";
import { ActivityFeed, ActivityFeedSkeleton } from "@/components/dashboard/admin/activity-feed";
import { SystemHealth, SystemHealthSkeleton } from "@/components/dashboard/admin/system-health";
import { formatCurrency } from "@/lib/config/currency-utils";

export function AdminOverview(): React.ReactElement {
  const { data: config } = useSiteConfig();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: volume, isLoading: volumeLoading } = useVolumeHistory();
  const { data: activity, isLoading: activityLoading } = useActivityFeed();

  usePageTitle("Admin Overview", config?.bankName);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bank administration dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      {statsLoading || !stats || !config ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Accounts"
            value={stats.totalAccounts.toLocaleString()}
            change={stats.activeAccountsChange}
          />
          <StatCard
            label="Total Balance"
            value={formatCurrency(stats.totalBalance, config.currency)}
            change={stats.balanceChange}
          />
          <StatCard
            label="Total Transactions"
            value={stats.totalTransactions.toLocaleString()}
            change={stats.transactionsChange}
          />
          <StatCard
            label="Avg. Balance"
            value={formatCurrency(
              stats.totalAccounts > 0
                ? stats.totalBalance / stats.totalAccounts
                : 0,
              config.currency
            )}
          />
        </div>
      )}

      {/* Volume Chart */}
      {volumeLoading || !volume || !config ? (
        <VolumeChartSkeleton />
      ) : (
        <VolumeChart data={volume} currency={config.currency} />
      )}

      {/* Activity Feed + System Health */}
      <div className="grid gap-4 lg:grid-cols-2">
        {activityLoading || !activity ? (
          <ActivityFeedSkeleton />
        ) : (
          <ActivityFeed events={activity} />
        )}
        <SystemHealth />
      </div>
    </div>
  );
}
