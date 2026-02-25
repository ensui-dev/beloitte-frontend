import { useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useAllTransactions } from "@/hooks/use-all-transactions";
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
import { ArrowDownLeft, ArrowUpRight, Search } from "lucide-react";
import type { TransactionTypeCode, TransactionStatus } from "@/lib/data/types";

const TYPE_CONFIG: Record<TransactionTypeCode, { label: string; icon: React.ElementType; isIncome: boolean }> = {
  deposit: { label: "Deposit", icon: ArrowDownLeft, isIncome: true },
  withdrawal: { label: "Withdrawal", icon: ArrowUpRight, isIncome: false },
  transfer_in: { label: "Transfer In", icon: ArrowDownLeft, isIncome: true },
  transfer_out: { label: "Transfer Out", icon: ArrowUpRight, isIncome: false },
  wire_in: { label: "Wire In", icon: ArrowDownLeft, isIncome: true },
  wire_out: { label: "Wire Out", icon: ArrowUpRight, isIncome: false },
  fee: { label: "Fee", icon: ArrowUpRight, isIncome: false },
  interest: { label: "Interest", icon: ArrowDownLeft, isIncome: true },
  adjustment: { label: "Adjustment", icon: ArrowDownLeft, isIncome: true },
};

const STATUS_VARIANT: Record<TransactionStatus, "default" | "secondary" | "destructive" | "outline"> = {
  posted: "default",
  pending: "secondary",
  failed: "destructive",
  reversed: "outline",
};

export function AccountantTransactionHistory(): React.ReactElement {
  const { data: config } = useSiteConfig();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  usePageTitle("Transaction History", config?.bankName);

  const { data, isLoading } = useAllTransactions({
    query: query || undefined,
    transactionType: typeFilter !== "all" ? (typeFilter as TransactionTypeCode) : undefined,
    status: statusFilter !== "all" ? (statusFilter as TransactionStatus) : undefined,
    pageSize: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Transaction History</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bank-wide transaction search and audit. Read-only.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by description, IBAN, or username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-white/[0.06] bg-white/[0.02] pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px] border-white/[0.06] bg-white/[0.02]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="deposit">Deposit</SelectItem>
            <SelectItem value="withdrawal">Withdrawal</SelectItem>
            <SelectItem value="transfer_in">Transfer In</SelectItem>
            <SelectItem value="transfer_out">Transfer Out</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] border-white/[0.06] bg-white/[0.02]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="posted">Posted</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="reversed">Reversed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading || !config ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : !data || data.data.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          No transactions found.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto -mx-2 px-2">
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead className="w-[250px]">Description</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Initiated By</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((tx) => {
                  const typeCode = tx.transactionType.typeCode;
                  const tc = TYPE_CONFIG[typeCode];
                  const Icon = tc.icon;
                  return (
                    <TableRow key={tx.id} className="border-white/[0.06]">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="truncate text-sm">{tx.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {tx.account.nickname ?? "-"}
                        </span>
                        <br />
                        <span className="font-mono">
                          {tx.account.iban.slice(-8)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs font-normal">
                          {tc.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={tc.isIncome ? "text-emerald-400" : "text-foreground"}>
                          {tc.isIncome ? "+" : "-"}
                          {formatCurrency(tx.amount, config.currency)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[tx.status]} className="text-xs capitalize">
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {tx.initiatedBy.discordUsername}
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {new Date(tx.transactedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground">
            Showing {data.data.length} of {data.total} transactions
          </p>
        </>
      )}
    </div>
  );
}
