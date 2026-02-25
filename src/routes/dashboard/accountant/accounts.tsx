import { useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useAllAccounts } from "@/hooks/use-all-accounts";
import { formatCurrency } from "@/lib/config/currency-utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Search } from "lucide-react";
import { getAccountDisplayName } from "@/lib/data/types";
import type { AccountStatus } from "@/lib/data/types";

const STATUS_VARIANT: Record<AccountStatus, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  frozen: "destructive",
  closed: "outline",
  pending_verification: "secondary",
};

export function AccountantAllAccounts(): React.ReactElement {
  const { data: config } = useSiteConfig();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  usePageTitle("All Accounts", config?.bankName);

  const { data, isLoading } = useAllAccounts({
    query: query || undefined,
    status: statusFilter !== "all" ? (statusFilter as AccountStatus) : undefined,
    pageSize: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">All Accounts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse all accounts across the bank. Read-only.
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
        <>
          <div className="overflow-x-auto -mx-2 px-2">
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead>Account</TableHead>
                  <TableHead>IBAN</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Opened</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((account) => (
                  <TableRow key={account.id} className="border-white/[0.06]">
                    <TableCell className="font-medium">
                      {getAccountDisplayName(account)}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {account.iban.replace(/(.{4})(?=.)/g, "$1 ")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {account.accountType.category.categoryName}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(account.balance, config.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[account.status]} className="text-xs capitalize">
                        {account.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(account.openedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground">
            Showing {data.data.length} of {data.total} accounts
          </p>
        </>
      )}
    </div>
  );
}
