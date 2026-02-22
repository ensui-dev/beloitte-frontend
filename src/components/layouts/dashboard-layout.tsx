import { Outlet } from "react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { useSiteConfig } from "@/hooks/use-site-config";

export function DashboardLayout(): React.ReactElement {
  const { data: config } = useSiteConfig();

  const content = (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <div className="ambient-mesh" />
        <DashboardSidebar />
        <SidebarInset>
          <DashboardTopbar />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );

  // Apply saved theme to the dashboard. If config hasn't loaded yet,
  // render with CSS defaults — ThemeProvider will apply once data arrives.
  if (!config) return content;

  return <ThemeProvider theme={config.theme}>{content}</ThemeProvider>;
}
