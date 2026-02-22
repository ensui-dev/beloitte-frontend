import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useAccountContext } from "@/components/providers/account-provider";
import { WithdrawForm } from "@/components/dashboard/withdraw-form";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardWithdrawals(): React.ReactElement {
  const { data: config, isLoading: configLoading } = useSiteConfig();
  const { selectedAccount: account, isLoading: accountLoading } = useAccountContext();

  usePageTitle("Withdrawals", config?.bankName);

  const isLoading = configLoading || accountLoading;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Withdrawals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Withdraw funds from your account.
        </p>
      </div>

      {/* Withdraw form */}
      {isLoading || !config || !account ? (
        <div className="mx-auto max-w-lg space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <WithdrawForm accountId={account.id} currency={config.currency} balance={account.balance} />
      )}
    </div>
  );
}
