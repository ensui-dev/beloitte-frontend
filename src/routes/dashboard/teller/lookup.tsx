import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";

export function TellerAccountLookup(): React.ReactElement {
  const { data: config } = useSiteConfig();
  usePageTitle("Account Lookup", config?.bankName);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account Lookup</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search for customer accounts by name, IBAN, or account number.
        </p>
      </div>
    </div>
  );
}
