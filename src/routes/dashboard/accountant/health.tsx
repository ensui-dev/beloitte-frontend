import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";
import { SystemHealth } from "@/components/dashboard/admin/system-health";

export function AccountantSystemHealth(): React.ReactElement {
  const { data: config } = useSiteConfig();
  usePageTitle("System Status", config?.bankName);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">System Status</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          BWIFT network and backend health status. Read-only.
        </p>
      </div>

      <SystemHealth />
    </div>
  );
}
