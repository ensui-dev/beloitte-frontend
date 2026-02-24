import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";

export function TellerTransactionLog(): React.ReactElement {
  const { data: config } = useSiteConfig();
  usePageTitle("Transaction Log", config?.bankName);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Transaction Log</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bank-wide recent transactions across all accounts.
        </p>
      </div>
    </div>
  );
}
