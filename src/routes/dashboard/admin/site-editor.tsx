import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";
import { SiteEditor } from "@/components/editor/site-editor";
import { Skeleton } from "@/components/ui/skeleton";

// Side-effect: register all per-module editor forms.
// Must run before the editor renders so getEditor() can find them.
import "@/components/editor/editors";

export function AdminSiteEditor(): React.ReactElement {
  const { data: config, isLoading } = useSiteConfig();
  usePageTitle("Site Editor", config?.bankName);

  if (isLoading || !config) {
    return <SiteEditorSkeleton />;
  }

  return <SiteEditor config={config} />;
}

function SiteEditorSkeleton(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
