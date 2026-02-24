import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";

export function AccountantAllAccounts(): React.ReactElement {
  const { data: config } = useSiteConfig();
  usePageTitle("All Accounts", config?.bankName);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">All Accounts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse all accounts across the bank. Read-only.
        </p>
      </div>
    </div>
  );
}
