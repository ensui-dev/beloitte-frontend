import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useAccount } from "@/hooks/use-account";
import { TransferForm } from "@/components/dashboard/transfer-form";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardTransfers(): React.ReactElement {
  const { data: config, isLoading: configLoading } = useSiteConfig();
  const { data: account, isLoading: accountLoading } = useAccount();

  usePageTitle("Transfers", config?.bankName);

  const isLoading = configLoading || accountLoading;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Transfers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Send funds to another account via the BWIFT network.
        </p>
      </div>

      {/* Transfer form */}
      {isLoading || !config || !account ? (
        <div className="mx-auto max-w-lg space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <TransferForm accountId={account.id} currency={config.currency} />
      )}
    </div>
  );
}
