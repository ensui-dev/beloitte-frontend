import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth, useSession } from "@/components/providers/auth-provider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronsUpDown, Check, ShieldCheck } from "lucide-react";
import type { UserRole } from "@/lib/data/types";
import { getEffectiveRoles } from "@/lib/auth/roles";

function getInitials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

const ROLE_LABELS: Record<UserRole, string> = {
  customer: "Customer",
  teller: "Teller",
  accountant: "Accountant",
  admin: "Administrator",
};

const ROLE_HOME: Record<UserRole, string> = {
  customer: "/dashboard/overview",
  teller: "/dashboard/teller",
  accountant: "/dashboard/accountant",
  admin: "/dashboard/admin",
};

export function ProfilePopover(): React.ReactElement | null {
  const session = useSession();
  const { switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!session) return null;

  const { user, activeRole } = session;
  const effectiveRoles = getEffectiveRoles(user.roles, user.isSuperadmin);
  const hasMultipleRoles = effectiveRoles.length > 1;

  const handleRoleSwitch = (role: UserRole): void => {
    if (role === activeRole) return;
    switchRole(role);
    setOpen(false);
    navigate(ROLE_HOME[role]);
  };

  const handleLogout = async (): Promise<void> => {
    setOpen(false);
    await logout();
    navigate("/login");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-full outline-none ring-ring focus-visible:ring-2"
          aria-label="Profile menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.discordAvatar ?? undefined} alt={user.discordUsername} />
            <AvatarFallback className="bg-primary/10 text-xs text-primary">
              {getInitials(user.discordUsername)}
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-64 border-white/[0.06] bg-popover/80 p-0 backdrop-blur-xl"
      >
        {/* User info + inline role switcher */}
        <div className="flex items-center gap-3 p-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.discordAvatar ?? undefined} alt={user.discordUsername} />
            <AvatarFallback className="bg-primary/10 text-sm text-primary">
              {getInitials(user.discordUsername)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 truncate text-sm font-medium">
              {user.discordUsername}
              {user.isSuperadmin && (
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-amber-400" />
              )}
            </div>
            {hasMultipleRoles ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
                    {ROLE_LABELS[activeRole]}
                    <ChevronsUpDown className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-48 border-white/[0.06] bg-popover/90 backdrop-blur-xl"
                >
                  {effectiveRoles.map((role) => (
                    <DropdownMenuItem
                      key={role}
                      onClick={() => handleRoleSwitch(role)}
                      className="flex items-center justify-between"
                    >
                      {ROLE_LABELS[role]}
                      {activeRole === role && <Check className="h-3.5 w-3.5 text-primary" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="text-xs text-muted-foreground">{ROLE_LABELS[activeRole]}</div>
            )}
          </div>
        </div>

        <Separator className="bg-white/[0.06]" />

        {/* Actions */}
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-sm text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
