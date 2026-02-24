import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";

export function TellerProcessWithdrawal(): React.ReactElement {
  const { data: config } = useSiteConfig();
  usePageTitle("Process Withdrawal", config?.bankName);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Process Withdrawal</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Withdraw funds from a customer&apos;s account on their behalf.
        </p>
      </div>
    </div>
  );
}
