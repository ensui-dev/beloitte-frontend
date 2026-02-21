import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";

export function DashboardTransactions(): React.ReactElement {
  const { data: config } = useSiteConfig();
  usePageTitle("Transactions", config?.bankName);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        View your transaction history.
      </p>
    </div>
  );
}
