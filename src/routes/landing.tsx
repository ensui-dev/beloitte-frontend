import { PublicLayout } from "@/components/layouts/public-layout";
import { ModuleRenderer } from "@/components/landing/module-renderer";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SiteConfigProvider } from "@/components/providers/site-config-provider";
import { useSiteConfig } from "@/hooks/use-site-config";
import { usePageTitle } from "@/hooks/use-page-title";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function LandingPage(): React.ReactElement {
  const { data: config, isLoading, error } = useSiteConfig();

  // Landing page title: "Reveille National Bank" (no suffix for the home page)
  usePageTitle(undefined, config?.bankName);

  if (isLoading) {
    // Minimal skeleton WITHOUT PublicLayout chrome — avoids flashing
    // fallback text like "Bank" and "Get Started" before config loads.
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
          <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <Skeleton className="h-6 w-40" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-8 w-28 rounded-md" />
            </div>
          </nav>
        </header>
        <main className="flex flex-col gap-8 p-8">
          <Skeleton className="h-[60vh] w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <PublicLayout>
        <div className="flex min-h-[60vh] items-center justify-center p-8">
          <Alert variant="destructive" className="max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Failed to load site configuration</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "An unexpected error occurred. Please try again later."}
            </AlertDescription>
          </Alert>
        </div>
      </PublicLayout>
    );
  }

  if (!config) {
    return (
      <PublicLayout>
        <div className="flex min-h-[60vh] items-center justify-center p-8">
          <Alert variant="destructive" className="max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No configuration found</AlertTitle>
            <AlertDescription>
              Site configuration is missing. Please contact the bank administrator.
            </AlertDescription>
          </Alert>
        </div>
      </PublicLayout>
    );
  }

  return (
    <SiteConfigProvider config={config}>
      <ThemeProvider theme={config.theme}>
        <PublicLayout config={config}>
          <ModuleRenderer modules={config.modules} />
        </PublicLayout>
      </ThemeProvider>
    </SiteConfigProvider>
  );
}
