import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";

export function AdminSiteEditor(): React.ReactElement {
  const { data: config } = useSiteConfig();
  usePageTitle("Site Editor", config?.bankName);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Site Editor</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Customize your bank's landing page.
      </p>
    </div>
  );
}
