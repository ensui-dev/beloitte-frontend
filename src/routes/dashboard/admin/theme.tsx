import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";
import { ThemeConfigurator } from "@/components/theme/theme-configurator";
import { ErrorBoundary } from "@/components/error-boundary";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminTheme(): React.ReactElement {
  const { data: config, isLoading } = useSiteConfig();
  usePageTitle("Theme", config?.bankName);

  if (isLoading || !config) {
    return <ThemeSkeleton />;
  }

  return (
    <ErrorBoundary>
      <ThemeConfigurator config={config} />
    </ErrorBoundary>
  );
}

function ThemeSkeleton(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-10 w-80" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    </div>
  );
}
