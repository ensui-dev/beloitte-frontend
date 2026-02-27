/**
 * User detail dialog — admin view of a single user.
 * Shows profile info, KYC status, roles, and suspension controls.
 */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShieldCheck, ShieldOff, X, Plus, CheckCircle, XCircle } from "lucide-react";
import type { AdminUserSummary, AdminUserRoleAssignment, UserRole } from "@/lib/data/types";
import { USER_ROLES } from "@/lib/data/types";
import { useUserRoles } from "@/hooks/use-users";
import {
  useSuspendUser,
  useUnsuspendUser,
  useUpdateKyc,
  useAssignRole,
  useRevokeRole,
} from "@/hooks/use-user-mutations";
import { SuspendDialog } from "./suspend-dialog";

interface UserDetailDialogProps {
  readonly user: AdminUserSummary | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

const ROLE_COLORS: Record<string, string> = {
  customer: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  teller: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  accountant: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  admin: "bg-amber-500/15 text-amber-400 border-amber-500/20",
};

function getInitials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

export function UserDetailDialog({
  user,
  open,
  onOpenChange,
}: UserDetailDialogProps): React.ReactElement {
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [addingRole, setAddingRole] = useState(false);

  const { data: roles } = useUserRoles(user?.id ?? null);
  const suspendMutation = useSuspendUser();
  const unsuspendMutation = useUnsuspendUser();
  const kycMutation = useUpdateKyc();
  const assignMutation = useAssignRole();
  const revokeMutation = useRevokeRole();

  if (!user) return <></>;

  const assignedRoleNames = new Set((roles ?? []).map((r: AdminUserRoleAssignment) => r.roleName));
  const availableRoles = USER_ROLES.filter((r) => !assignedRoleNames.has(r));

  const handleSuspend = (reason: string): void => {
    suspendMutation.mutate(
      { userId: user.id, reason },
      { onSuccess: () => setSuspendOpen(false) }
    );
  };

  const handleUnsuspend = (): void => {
    unsuspendMutation.mutate(user.id);
  };

  const handleKycToggle = (): void => {
    kycMutation.mutate({ userId: user.id, kycVerified: !user.kycVerified });
  };

  const handleAssignRole = (roleName: string): void => {
    assignMutation.mutate(
      { userId: user.id, roleName },
      { onSuccess: () => setAddingRole(false) }
    );
  };

  const handleRevokeRole = (assignment: AdminUserRoleAssignment): void => {
    revokeMutation.mutate({ userId: user.id, assignmentId: assignment.id });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md border-white/[0.06] bg-popover/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="sr-only">User Details</DialogTitle>
          </DialogHeader>

          {/* User header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.discordAvatar ?? undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(user.discordUsername)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-lg font-semibold">
                {user.displayName ?? user.discordUsername}
              </div>
              <div className="text-sm text-muted-foreground">
                @{user.discordUsername}
              </div>
            </div>
            {!user.isActive && (
              <Badge variant="destructive" className="shrink-0">Suspended</Badge>
            )}
          </div>

          <Separator className="bg-white/[0.06]" />

          {/* KYC Status */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">KYC Verification</div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                {user.kycVerified ? (
                  <>
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    Verified
                  </>
                ) : (
                  <>
                    <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    Not verified
                  </>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-white/[0.06]"
              onClick={handleKycToggle}
              disabled={kycMutation.isPending}
            >
              {user.kycVerified ? "Revoke KYC" : "Verify KYC"}
            </Button>
          </div>

          <Separator className="bg-white/[0.06]" />

          {/* Roles */}
          <div>
            <div className="mb-3 text-sm font-medium">Roles</div>
            <div className="flex flex-wrap gap-2">
              {roles?.map((assignment: AdminUserRoleAssignment) => (
                <Badge
                  key={assignment.id}
                  variant="outline"
                  className={`gap-1 ${ROLE_COLORS[assignment.roleName] ?? ""}`}
                >
                  {assignment.roleName}
                  <button
                    onClick={() => handleRevokeRole(assignment)}
                    disabled={revokeMutation.isPending}
                    className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-white/10"
                    aria-label={`Remove ${assignment.roleName} role`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {addingRole ? (
                <Select onValueChange={handleAssignRole}>
                  <SelectTrigger className="h-7 w-36 border-white/[0.06] bg-white/[0.02] text-xs">
                    <SelectValue placeholder="Select role..." />
                  </SelectTrigger>
                  <SelectContent className="border-white/[0.06] bg-popover/95 backdrop-blur-xl">
                    {availableRoles.map((role: UserRole) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : availableRoles.length > 0 ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 gap-1 border-dashed border-white/[0.06] text-xs text-muted-foreground"
                  onClick={() => setAddingRole(true)}
                  disabled={assignMutation.isPending}
                >
                  <Plus className="h-3 w-3" />
                  Add Role
                </Button>
              ) : null}
            </div>
          </div>

          <Separator className="bg-white/[0.06]" />

          {/* Suspension */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Account Status</div>
              {user.suspensionReason && (
                <div className="mt-1 text-xs text-muted-foreground">
                  Reason: {user.suspensionReason}
                </div>
              )}
            </div>
            {user.isActive ? (
              <Button
                variant="outline"
                size="sm"
                className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                onClick={() => setSuspendOpen(true)}
              >
                <ShieldOff className="mr-1.5 h-3.5 w-3.5" />
                Suspend
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                onClick={handleUnsuspend}
                disabled={unsuspendMutation.isPending}
              >
                <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                {unsuspendMutation.isPending ? "Unsuspending..." : "Unsuspend"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <SuspendDialog
        open={suspendOpen}
        onOpenChange={setSuspendOpen}
        username={user.discordUsername}
        isPending={suspendMutation.isPending}
        onConfirm={handleSuspend}
      />
    </>
  );
}
