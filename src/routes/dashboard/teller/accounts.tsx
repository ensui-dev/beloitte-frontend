import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";

export function TellerAccountManagement(): React.ReactElement {
  const { data: config } = useSiteConfig();
  usePageTitle("Account Management", config?.bankName);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Freeze, unfreeze, or close customer accounts.
        </p>
      </div>
    </div>
  );
}
