import { useLocation, useNavigate } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useIsAdmin } from "@/components/providers/auth-provider";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Receipt,
  Globe,
  Palette,
  Settings,
  BarChart3,
} from "lucide-react";

interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly icon: React.ComponentType<{ className?: string }>;
}

const PLAYER_NAV: readonly NavItem[] = [
  { label: "Overview", href: "/dashboard/overview", icon: LayoutDashboard },
  { label: "Transactions", href: "/dashboard/transactions", icon: Receipt },
  { label: "Transfers", href: "/dashboard/transfers", icon: ArrowLeftRight },
];

const ADMIN_NAV: readonly NavItem[] = [
  { label: "Overview", href: "/dashboard/admin", icon: BarChart3 },
  { label: "Site Editor", href: "/dashboard/admin/site-editor", icon: Globe },
  { label: "Theme", href: "/dashboard/admin/theme", icon: Palette },
  { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

export function DashboardSidebar(): React.ReactElement {
  const { data: config } = useSiteConfig();
  const isAdmin = useIsAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href: string): boolean => location.pathname === href;

  const renderNavGroup = (
    label: string,
    items: readonly NavItem[]
  ): React.ReactElement => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              isActive={isActive(item.href)}
              onClick={() => navigate(item.href)}
              tooltip={item.label}
              className={
                isActive(item.href)
                  ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-white/[0.06]">
      <SidebarHeader className="p-4">
        <span className="truncate text-sm font-semibold">
          {config?.bankName ?? "Dashboard"}
        </span>
      </SidebarHeader>

      <SidebarContent>
        {renderNavGroup("Account", PLAYER_NAV)}

        {isAdmin && (
          <>
            <SidebarSeparator className="bg-white/[0.06]" />
            {renderNavGroup("Administration", ADMIN_NAV)}
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
