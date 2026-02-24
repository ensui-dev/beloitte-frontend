import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";

export function TellerDashboard(): React.ReactElement {
  const { data: config } = useSiteConfig();
  usePageTitle("Teller Dashboard", config?.bankName);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Teller Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Daily operations overview and quick actions.
        </p>
      </div>
    </div>
  );
}
