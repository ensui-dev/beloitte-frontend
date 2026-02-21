import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";

export function DashboardOverview(): React.ReactElement {
  const { data: config } = useSiteConfig();
  usePageTitle("Overview", config?.bankName);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Account overview and recent activity.
      </p>
    </div>
  );
}
