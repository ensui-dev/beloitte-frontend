import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Banknote,
} from "lucide-react";
import type { Transaction, TransactionType, TransactionStatus } from "@/lib/data/types";
import type { CurrencyConfig } from "@/lib/config/site-config-schema";
import { formatCurrency } from "@/lib/config/currency-utils";

// ─── Helpers ────────────────────────────────────────────────

const TYPE_CONFIG: Record<TransactionType, { label: string; icon: React.ElementType; isIncome: boolean }> = {
  deposit: { label: "Deposit", icon: Banknote, isIncome: true },
  withdrawal: { label: "Withdrawal", icon: CreditCard, isIncome: false },
  transfer_in: { label: "Transfer In", icon: ArrowDownLeft, isIncome: true },
  transfer_out: { label: "Transfer Out", icon: ArrowUpRight, isIncome: false },
};

const STATUS_VARIANT: Record<TransactionStatus, "default" | "secondary" | "destructive"> = {
  completed: "default",
  pending: "secondary",
  failed: "destructive",
};

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Component ──────────────────────────────────────────────

interface TransactionTableProps {
  readonly transactions: readonly Transaction[];
  readonly currency: CurrencyConfig;
  /** Compact mode: relative dates, fewer columns. Used on Overview page. */
  readonly compact?: boolean;
}

export function TransactionTable({
  transactions,
  currency,
  compact = false,
}: TransactionTableProps): React.ReactElement {
  if (transactions.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        No transactions found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-white/[0.06] hover:bg-transparent">
          <TableHead className="w-[300px]">Description</TableHead>
          {!compact && <TableHead>Type</TableHead>}
          <TableHead className="text-right">Amount</TableHead>
          {!compact && <TableHead>Status</TableHead>}
          <TableHead className="text-right">{compact ? "" : "Date"}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => {
          const config = TYPE_CONFIG[tx.type];
          const Icon = config.icon;
          return (
            <TableRow key={tx.id} className="border-white/[0.06]">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{tx.description}</p>
                    {tx.counterparty && (
                      <p className="truncate text-xs text-muted-foreground">{tx.counterparty}</p>
                    )}
                  </div>
                </div>
              </TableCell>
              {!compact && (
                <TableCell>
                  <Badge variant="secondary" className="text-xs font-normal">
                    {config.label}
                  </Badge>
                </TableCell>
              )}
              <TableCell className="text-right">
                <span className={config.isIncome ? "text-emerald-400" : "text-foreground"}>
                  {config.isIncome ? "+" : "-"}
                  {formatCurrency(tx.amount, currency)}
                </span>
              </TableCell>
              {!compact && (
                <TableCell>
                  <Badge variant={STATUS_VARIANT[tx.status]} className="text-xs capitalize">
                    {tx.status}
                  </Badge>
                </TableCell>
              )}
              <TableCell className="text-right text-sm text-muted-foreground">
                {compact ? formatRelativeTime(tx.createdAt) : formatDate(tx.createdAt)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

// ─── Skeleton ───────────────────────────────────────────────

interface TransactionTableSkeletonProps {
  readonly rows?: number;
}

export function TransactionTableSkeleton({ rows = 5 }: TransactionTableSkeletonProps): React.ReactElement {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3 px-2 py-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}
