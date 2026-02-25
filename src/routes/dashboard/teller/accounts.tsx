import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useAllAccounts } from "@/hooks/use-all-accounts";
import { dataService } from "@/lib/data/data-service";
import { formatCurrency } from "@/lib/config/currency-utils";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, ShieldAlert, ShieldCheck, XCircle } from "lucide-react";
import { getAccountDisplayName } from "@/lib/data/types";
import type { AccountStatus, BankAccount } from "@/lib/data/types";

const STATUS_VARIANT: Record<AccountStatus, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  frozen: "destructive",
  closed: "outline",
  pending_verification: "secondary",
};

type StatusAction = "active" | "frozen" | "closed";

const ACTION_CONFIG: Record<StatusAction, { label: string; description: string; icon: React.ElementType; variant: "default" | "destructive" | "outline" }> = {
  frozen: { label: "Freeze Account", description: "This will prevent all transactions on this account.", icon: ShieldAlert, variant: "destructive" },
  active: { label: "Unfreeze Account", description: "This will restore normal access to this account.", icon: ShieldCheck, variant: "default" },
  closed: { label: "Close Account", description: "This will permanently close this account. This cannot be undone.", icon: XCircle, variant: "destructive" },
};

export function TellerAccountManagement(): React.ReactElement {
  const { data: config } = useSiteConfig();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [confirmAction, setConfirmAction] = useState<{ account: BankAccount; action: StatusAction } | null>(null);

  usePageTitle("Account Management", config?.bankName);

  const { data, isLoading } = useAllAccounts({
    query: query || undefined,
    status: statusFilter !== "all" ? (statusFilter as AccountStatus) : undefined,
    pageSize: 50,
  });

  const mutation = useMutation({
    mutationFn: ({ accountId, status }: { accountId: number; status: StatusAction }) =>
      dataService.updateAccountStatus(accountId, status),
    onSuccess: (_, { status }) => {
      const label = status === "active" ? "unfrozen" : status === "frozen" ? "frozen" : "closed";
      toast.success(`Account ${label}`, {
        description: `The account has been ${label} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["allAccounts"] });
      setConfirmAction(null);
    },
    onError: (error: Error) => {
      toast.error("Action failed", { description: error.message });
    },
  });

  const handleAction = (): void => {
    if (!confirmAction) return;
    mutation.mutate({
      accountId: confirmAction.account.id,
      status: confirmAction.action,
    });
  };

  const getAvailableActions = (account: BankAccount): StatusAction[] => {
    switch (account.status) {
      case "active":
        return ["frozen", "closed"];
      case "frozen":
        return ["active", "closed"];
      case "pending_verification":
        return ["closed"];
      case "closed":
        return [];
      default:
        return [];
    }
  };

  const actionConfig = confirmAction ? ACTION_CONFIG[confirmAction.action] : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Freeze, unfreeze, or close customer accounts.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, IBAN, or username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-white/[0.06] bg-white/[0.02] pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] border-white/[0.06] bg-white/[0.02]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="frozen">Frozen</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="pending_verification">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading || !config ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !data || data.data.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          No accounts found.
        </div>
      ) : (
        <div className="overflow-x-auto -mx-2 px-2">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead>Account</TableHead>
                <TableHead>IBAN</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((account) => {
                const actions = getAvailableActions(account);
                return (
                  <TableRow key={account.id} className="border-white/[0.06]">
                    <TableCell className="font-medium">
                      {getAccountDisplayName(account)}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {account.user?.discordUsername ?? account.business?.businessName ?? "-"}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {account.iban.replace(/(.{4})(?=.)/g, "$1 ")}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(account.balance, config.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[account.status]} className="text-xs capitalize">
                        {account.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {actions.includes("frozen") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-amber-400 hover:text-amber-300"
                            onClick={() => setConfirmAction({ account, action: "frozen" })}
                          >
                            <ShieldAlert className="mr-1 h-3 w-3" />
                            Freeze
                          </Button>
                        )}
                        {actions.includes("active") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-emerald-400 hover:text-emerald-300"
                            onClick={() => setConfirmAction({ account, action: "active" })}
                          >
                            <ShieldCheck className="mr-1 h-3 w-3" />
                            Unfreeze
                          </Button>
                        )}
                        {actions.includes("closed") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive/80"
                            onClick={() => setConfirmAction({ account, action: "closed" })}
                          >
                            <XCircle className="mr-1 h-3 w-3" />
                            Close
                          </Button>
                        )}
                        {actions.length === 0 && (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{actionConfig?.label}</AlertDialogTitle>
            <AlertDialogDescription>
              {actionConfig?.description}
              {confirmAction && (
                <>
                  <br /><br />
                  <strong>Account:</strong> {getAccountDisplayName(confirmAction.account)}
                  <br />
                  <strong>IBAN:</strong>{" "}
                  <span className="font-mono">
                    {confirmAction.account.iban.replace(/(.{4})(?=.)/g, "$1 ")}
                  </span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={
                confirmAction?.action === "active"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-destructive hover:bg-destructive/90"
              }
            >
              {mutation.isPending ? "Processing..." : actionConfig?.label}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
