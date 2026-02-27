/**
 * Admin user management page.
 * Paginated table of all users in the bank with role/KYC/suspension controls.
 */
import { useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useUsers } from "@/hooks/use-users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  ShieldOff,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import type { AdminUserSummary } from "@/lib/data/types";
import { UserDetailDialog } from "@/components/dashboard/admin/user-detail-dialog";
import { SuspendDialog } from "@/components/dashboard/admin/suspend-dialog";
import { useSuspendUser, useUnsuspendUser, useUpdateKyc } from "@/hooks/use-user-mutations";

const PAGE_SIZE = 20;

function getInitials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

export function AdminUsers(): React.ReactElement {
  const { data: config } = useSiteConfig();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUsers(page, PAGE_SIZE);
  const [selectedUser, setSelectedUser] = useState<AdminUserSummary | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [suspendTarget, setSuspendTarget] = useState<AdminUserSummary | null>(null);

  const suspendMutation = useSuspendUser();
  const unsuspendMutation = useUnsuspendUser();
  const kycMutation = useUpdateKyc();

  usePageTitle("User Management", config?.bankName);

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  const openDetail = (user: AdminUserSummary): void => {
    setSelectedUser(user);
    setDetailOpen(true);
  };

  const handleSuspend = (reason: string): void => {
    if (!suspendTarget) return;
    suspendMutation.mutate(
      { userId: suspendTarget.id, reason },
      { onSuccess: () => setSuspendTarget(null) }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">User Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data ? `${data.total} registered user${data.total !== 1 ? "s" : ""}` : "Loading users..."}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="w-[280px]">User</TableHead>
              <TableHead>KYC</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }, (_, i) => (
                <TableRow key={i} className="border-white/[0.06]">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : data?.data.length === 0 ? (
              <TableRow className="border-white/[0.06]">
                <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((user: AdminUserSummary) => (
                <TableRow
                  key={user.id}
                  className="cursor-pointer border-white/[0.06] transition-colors hover:bg-white/[0.02]"
                  onClick={() => openDetail(user)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.discordAvatar ?? undefined} />
                        <AvatarFallback className="bg-primary/10 text-xs text-primary">
                          {getInitials(user.discordUsername)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {user.displayName ?? user.discordUsername}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          @{user.discordUsername}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.kycVerified ? (
                      <Badge variant="outline" className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 border-white/[0.06] text-muted-foreground">
                        <XCircle className="h-3 w-3" />
                        Unverified
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Suspended</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="border-white/[0.06] bg-popover/95 backdrop-blur-xl"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenuItem onClick={() => openDetail(user)}>
                          <UserCog className="mr-2 h-4 w-4" />
                          Manage User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            kycMutation.mutate({ userId: user.id, kycVerified: !user.kycVerified })
                          }
                        >
                          {user.kycVerified ? (
                            <>
                              <XCircle className="mr-2 h-4 w-4" />
                              Revoke KYC
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Verify KYC
                            </>
                          )}
                        </DropdownMenuItem>
                        {user.isActive ? (
                          <DropdownMenuItem
                            className="text-red-400 focus:text-red-400"
                            onClick={() => setSuspendTarget(user)}
                          >
                            <ShieldOff className="mr-2 h-4 w-4" />
                            Suspend User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="text-emerald-400 focus:text-emerald-400"
                            onClick={() => unsuspendMutation.mutate(user.id)}
                          >
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Unsuspend User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-white/[0.06]"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white/[0.06]"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail dialog */}
      <UserDetailDialog
        user={selectedUser}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      {/* Suspend confirmation dialog */}
      <SuspendDialog
        open={suspendTarget !== null}
        onOpenChange={(open) => { if (!open) setSuspendTarget(null); }}
        username={suspendTarget?.discordUsername ?? ""}
        isPending={suspendMutation.isPending}
        onConfirm={handleSuspend}
      />
    </div>
  );
}
