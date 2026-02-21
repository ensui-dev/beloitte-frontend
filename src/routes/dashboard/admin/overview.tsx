import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";

export function AdminOverview(): React.ReactElement {
  const { data: config } = useSiteConfig();
  usePageTitle("Admin Overview", config?.bankName);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Admin Overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Bank administration dashboard.
      </p>
    </div>
  );
}
