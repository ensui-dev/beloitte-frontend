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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useActiveRole } from "@/components/providers/auth-provider";
import { useAccountContext } from "@/components/providers/account-provider";
import {
  LayoutDashboard,
  ArrowLeftRight,
  ArrowDownToLine,
  Receipt,
  Globe,
  Palette,
  Settings,
  BarChart3,
  User,
  Building2,
  Plus,
  ChevronsUpDown,
  Check,
} from "lucide-react";

interface NavItem {
  readonly label: string;
  readonly href: string;
  readonly icon: React.ComponentType<{ className?: string }>;
}

const USER_NAV: readonly NavItem[] = [
  { label: "Overview", href: "/dashboard/overview", icon: LayoutDashboard },
  { label: "Transactions", href: "/dashboard/transactions", icon: Receipt },
  { label: "Transfers", href: "/dashboard/transfers", icon: ArrowLeftRight },
  { label: "Withdrawals", href: "/dashboard/withdrawals", icon: ArrowDownToLine },
];

const ADMIN_NAV: readonly NavItem[] = [
  { label: "Overview", href: "/dashboard/admin", icon: BarChart3 },
  { label: "Site Editor", href: "/dashboard/admin/site-editor", icon: Globe },
  { label: "Theme", href: "/dashboard/admin/theme", icon: Palette },
  { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

export function DashboardSidebar(): React.ReactElement {
  const { data: config } = useSiteConfig();
  const activeRole = useActiveRole();
  const { accounts, selectedAccount, selectAccount } = useAccountContext();
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
        {activeRole === "admin" ? (
          /* ─── Admin view: only admin navigation ─── */
          renderNavGroup("Administration", ADMIN_NAV)
        ) : (
          /* ─── User view: account switcher + user navigation ─── */
          <>
            {/* Account switcher dropdown */}
            {selectedAccount && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Account
                </SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                          className="w-full bg-white/[0.02] hover:bg-white/[0.05] data-[state=open]:bg-white/[0.05]"
                          tooltip={selectedAccount.accountName}
                        >
                          {selectedAccount.accountType === "business" ? (
                            <Building2 className="h-4 w-4 shrink-0" />
                          ) : (
                            <User className="h-4 w-4 shrink-0" />
                          )}
                          <div className="flex min-w-0 flex-1 flex-col">
                            <span className="truncate text-sm font-medium">
                              {selectedAccount.accountName}
                            </span>
                            <span className="truncate text-[10px] text-muted-foreground">
                              {selectedAccount.accountNumber.slice(-8)}
                            </span>
                          </div>
                          <ChevronsUpDown className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        side="right"
                        align="start"
                        className="w-56 border-white/[0.06] bg-popover/90 backdrop-blur-xl"
                      >
                        {accounts.map((account) => {
                          const isSelected = account.id === selectedAccount.id;
                          return (
                            <DropdownMenuItem
                              key={account.id}
                              onClick={() => selectAccount(account.id)}
                              className="flex items-center gap-3"
                            >
                              {account.accountType === "business" ? (
                                <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                              ) : (
                                <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm">{account.accountName}</div>
                                <div className="truncate text-[10px] text-muted-foreground">
                                  {account.accountNumber.slice(-8)}
                                </div>
                              </div>
                              {isSelected && (
                                <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                              )}
                            </DropdownMenuItem>
                          );
                        })}
                        <DropdownMenuSeparator className="bg-white/[0.06]" />
                        <DropdownMenuItem
                          onClick={() => navigate("/dashboard/accounts/new")}
                          className="flex items-center gap-3"
                        >
                          <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="text-sm">New Account</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            )}

            <SidebarSeparator className="bg-white/[0.06]" />

            {renderNavGroup("Navigation", USER_NAV)}
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
