import { useCallback, useRef, useState } from "react";
import { Link } from "react-router";
import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useAccountContext } from "@/components/providers/account-provider";
import { useTransactions } from "@/hooks/use-transactions";
import { useBwiftHealth } from "@/hooks/use-bwift-health";
import { formatCurrency } from "@/lib/config/currency-utils";
import { BalanceChart, BalanceChartSkeleton } from "@/components/dashboard/balance-chart";
import {
  TransactionTable,
  TransactionTableSkeleton,
} from "@/components/dashboard/transaction-table";
import { TransferForm } from "@/components/dashboard/transfer-form";
import { WithdrawForm } from "@/components/dashboard/withdraw-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  Send,
  ArrowDownToLine,
  TrendingUp,
  TrendingDown,
  Wallet,
  User,
  Building2,
  Copy,
  Check,
} from "lucide-react";
import type { Transaction } from "@/lib/data/types";
import type { BwiftStatus } from "@/lib/data/types";
import { getAccountCategory, getAccountDisplayName } from "@/lib/data/types";

// ─── Monthly Stats ──────────────────────────────────────────

function computeMonthlyStats(
  transactions: readonly Transaction[]
): { income: number; expenses: number } {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let income = 0;
  let expenses = 0;

  for (const tx of transactions) {
    if (tx.status !== "posted") continue;

    const txDate = new Date(tx.transactedAt);
    if (txDate.getMonth() !== currentMonth || txDate.getFullYear() !== currentYear) continue;

    if (tx.transactionType.affectsBalance === "credit") {
      income += tx.amount;
    } else {
      expenses += tx.amount;
    }
  }

  return { income, expenses };
}

// ─── BWIFT Status Indicator ─────────────────────────────────

const BWIFT_STATUS_CONFIG: Record<BwiftStatus, { readonly color: string; readonly label: string }> = {
  operational: { color: "bg-emerald-400", label: "BWIFT Online" },
  degraded: { color: "bg-amber-400", label: "BWIFT Degraded" },
  outage: { color: "bg-red-400", label: "BWIFT Offline" },
};

function BwiftStatusIndicator(): React.ReactElement {
  const { data: health, isLoading } = useBwiftHealth();

  if (isLoading || !health) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/50" />
        Checking BWIFT...
      </div>
    );
  }

  const config = BWIFT_STATUS_CONFIG[health.status];

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className="relative flex h-2 w-2">
        {health.status === "operational" && (
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${config.color} opacity-75`} />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${config.color}`} />
      </div>
      {config.label}
      <span className="text-muted-foreground/60">
        {health.latencyMs}ms
      </span>
    </div>
  );
}

// ─── Skeleton for the top cards ─────────────────────────────

function TopCardsSkeleton(): React.ReactElement {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <CardContent className="p-6">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="mt-3 h-9 w-40" />
          <div className="mt-6 flex gap-8">
            <div>
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-1.5 h-5 w-24" />
            </div>
            <div>
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-1.5 h-5 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <CardContent className="flex flex-col justify-between p-6">
          <Skeleton className="h-3 w-24" />
          <div className="mt-4 flex gap-3">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
          <Skeleton className="mt-4 h-3 w-32" />
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Overview Page ──────────────────────────────────────────

export function DashboardOverview(): React.ReactElement {
  const { data: config } = useSiteConfig();
  const { selectedAccount: account, isLoading: accountLoading } = useAccountContext();
  const { data: txResponse, isLoading: txLoading } = useTransactions(account?.id, {
    pageSize: 100,
  });

  const [transferOpen, setTransferOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopyIban = useCallback((): void => {
    if (!account) return;
    void navigator.clipboard.writeText(account.iban);
    setCopied(true);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  }, [account]);

  usePageTitle("Overview", config?.bankName);

  const isLoading = accountLoading || txLoading;
  const transactions = txResponse?.data ?? [];
  const recentTransactions = transactions.slice(0, 5);
  const stats = computeMonthlyStats(transactions);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your account at a glance.
        </p>
      </div>

      {/* Top cards row: Balance + Quick Actions */}
      {isLoading || !config ? (
        <TopCardsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Balance Summary Card */}
          <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Wallet className="h-3.5 w-3.5" />
                  {account ? getAccountDisplayName(account) : "Balance"}
                </div>
                {account && (
                  <div className="flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {getAccountCategory(account) === "business" ? (
                      <Building2 className="h-3 w-3" />
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                    {getAccountCategory(account)}
                  </div>
                )}
              </div>
              <p className="mt-2 text-3xl font-semibold tracking-tight">
                {formatCurrency(account?.balance ?? 0, config.currency)}
              </p>

              {/* Monthly debit/credit breakdown */}
              <div className="mt-5 flex gap-8">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                    Credit this month
                  </div>
                  <p className="mt-1 text-sm font-medium text-emerald-400">
                    +{formatCurrency(stats.income, config.currency)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <TrendingDown className="h-3 w-3 text-red-400" />
                    Debit this month
                  </div>
                  <p className="mt-1 text-sm font-medium text-red-400">
                    -{formatCurrency(stats.expenses, config.currency)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            <CardContent className="flex h-full flex-col justify-between p-6">
              <div className="text-xs font-medium text-muted-foreground">
                Quick Actions
              </div>

              {/* Account number / IBAN */}
              {account && (
                <button
                  type="button"
                  className="mt-3 flex w-full items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-left transition-colors hover:bg-white/[0.04]"
                  onClick={handleCopyIban}
                  title="Click to copy"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {copied ? "Copied!" : "Account Number (BWIFT IBAN)"}
                    </p>
                    <p className="mt-0.5 truncate font-mono text-xs tracking-wider text-foreground">
                      {account.iban}
                    </p>
                  </div>
                  {copied ? (
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  )}
                </button>
              )}

              <div className="mt-3 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 gap-2 border-white/[0.06]"
                  onClick={() => setTransferOpen(true)}
                >
                  <Send className="h-4 w-4" />
                  Transfer
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2 border-white/[0.06]"
                  onClick={() => setWithdrawOpen(true)}
                >
                  <ArrowDownToLine className="h-4 w-4" />
                  Withdraw
                </Button>
              </div>

              <div className="mt-4">
                <BwiftStatusIndicator />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Balance chart */}
      {isLoading || !config ? (
        <BalanceChartSkeleton />
      ) : (
        <BalanceChart
          currentBalance={account?.balance ?? 0}
          transactions={transactions}
          currency={config.currency}
        />
      )}

      {/* Recent transactions */}
      <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Recent Transactions
          </CardTitle>
          <Link
            to="/dashboard/transactions"
            className="flex items-center gap-1 text-xs text-primary transition-colors hover:text-primary/80"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent className="px-0 pb-2">
          {isLoading || !config ? (
            <div className="px-4">
              <TransactionTableSkeleton rows={5} />
            </div>
          ) : (
            <TransactionTable
              transactions={recentTransactions}
              currency={config.currency}
              compact
            />
          )}
        </CardContent>
      </Card>

      {/* ─── Transfer Modal ─────────────────────────────────── */}
      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send a Transfer</DialogTitle>
            <DialogDescription>
              Transfer funds to any account via the BWIFT network.
            </DialogDescription>
          </DialogHeader>
          {config && account && (
            <TransferForm
              accountId={account.id}
              currency={config.currency}
              balance={account.balance}
              compact
              onSuccess={() => setTransferOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Withdraw Modal ─────────────────────────────────── */}
      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Funds</DialogTitle>
            <DialogDescription>
              Withdraw funds from your account.
            </DialogDescription>
          </DialogHeader>
          {config && account && (
            <WithdrawForm
              accountId={account.id}
              currency={config.currency}
              balance={account.balance}
              compact
              onSuccess={() => setWithdrawOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
