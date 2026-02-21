import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth, useSession, useIsAdmin } from "@/components/providers/auth-provider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import type { UserRole } from "@/lib/data/types";

function getInitials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

/** Role label displayed under the username */
const ROLE_LABELS: Record<UserRole, string> = {
  player: "Player",
  admin: "Administrator",
};

/** Route to navigate to after switching roles */
const ROLE_HOME: Record<UserRole, string> = {
  player: "/dashboard/overview",
  admin: "/dashboard/admin",
};

export function ProfilePopover(): React.ReactElement | null {
  const session = useSession();
  const { switchRole, logout } = useAuth();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!session) return null;

  const { user, activeRole } = session;

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
            <AvatarImage src={user.discordAvatar} alt={user.discordUsername} />
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
        {/* User info */}
        <div className="flex items-center gap-3 p-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.discordAvatar} alt={user.discordUsername} />
            <AvatarFallback className="bg-primary/10 text-sm text-primary">
              {getInitials(user.discordUsername)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{user.discordUsername}</div>
            <div className="text-xs text-muted-foreground">{ROLE_LABELS[activeRole]}</div>
          </div>
        </div>

        {/* Role switcher — only show if user has admin role */}
        {isAdmin && (
          <>
            <Separator className="bg-white/[0.06]" />
            <div className="p-4">
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Switch role
              </div>
              <RadioGroup
                value={activeRole}
                onValueChange={(value: string) => handleRoleSwitch(value as UserRole)}
                className="gap-2"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="player" id="role-player" />
                  <Label htmlFor="role-player" className="cursor-pointer text-sm">
                    Player
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="admin" id="role-admin" />
                  <Label htmlFor="role-admin" className="cursor-pointer text-sm">
                    Administrator
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </>
        )}

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
