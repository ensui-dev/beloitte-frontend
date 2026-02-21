import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";

export function DashboardTransfers(): React.ReactElement {
  const { data: config } = useSiteConfig();
  usePageTitle("Transfers", config?.bankName);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Transfers</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Send funds to another account.
      </p>
    </div>
  );
}
