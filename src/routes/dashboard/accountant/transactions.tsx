import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";

export function AccountantTransactionHistory(): React.ReactElement {
  const { data: config } = useSiteConfig();
  usePageTitle("Transaction History", config?.bankName);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Transaction History</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bank-wide transaction search and audit. Read-only.
        </p>
      </div>
    </div>
  );
}
