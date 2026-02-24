import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";

export function TellerProcessDeposit(): React.ReactElement {
  const { data: config } = useSiteConfig();
  usePageTitle("Process Deposit", config?.bankName);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Process Deposit</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Deposit funds into a customer&apos;s account.
        </p>
      </div>
    </div>
  );
}
