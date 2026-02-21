import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";

export function AdminSettings(): React.ReactElement {
  const { data: config } = useSiteConfig();
  usePageTitle("Settings", config?.bankName);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Bank configuration and preferences.
      </p>
    </div>
  );
}
