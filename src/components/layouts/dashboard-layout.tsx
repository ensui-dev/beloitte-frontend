import { Outlet } from "react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AccountProvider } from "@/components/providers/account-provider";
import { SiteConfigProvider } from "@/components/providers/site-config-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { useSiteConfig } from "@/hooks/use-site-config";

export function DashboardLayout(): React.ReactElement {
  const { data: config } = useSiteConfig();

  const content = (
    <AccountProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background text-foreground">
          <div className="ambient-mesh" />
          <DashboardSidebar />
          <SidebarInset>
            <DashboardTopbar />
            <main className="flex-1 p-6">
              <ErrorBoundary label="Dashboard page">
                <Outlet />
              </ErrorBoundary>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AccountProvider>
  );

  // Apply saved theme to the dashboard. If config hasn't loaded yet,
  // render with CSS defaults — ThemeProvider will apply once data arrives.
  if (!config) return content;

  return (
    <SiteConfigProvider config={config}>
      <ThemeProvider theme={config.theme}>{content}</ThemeProvider>
    </SiteConfigProvider>
  );
}
