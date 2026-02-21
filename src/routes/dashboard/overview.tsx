import { Link } from "react-router";
import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useAccount } from "@/hooks/use-account";
import { useTransactions } from "@/hooks/use-transactions";
import { formatCurrency } from "@/lib/config/currency-utils";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/stat-card";
import { BalanceChart, BalanceChartSkeleton } from "@/components/dashboard/balance-chart";
import {
  TransactionTable,
  TransactionTableSkeleton,
} from "@/components/dashboard/transaction-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { Transaction } from "@/lib/data/types";

/**
 * Compute income/expenses for the current month from transaction history.
 * Only counts completed transactions.
 */
function computeMonthlyStats(
  transactions: readonly Transaction[]
): { income: number; expenses: number } {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let income = 0;
  let expenses = 0;

  for (const tx of transactions) {
    if (tx.status !== "completed") continue;

    const txDate = new Date(tx.createdAt);
    if (txDate.getMonth() !== currentMonth || txDate.getFullYear() !== currentYear) continue;

    if (tx.type === "deposit" || tx.type === "transfer_in") {
      income += tx.amount;
    } else {
      expenses += tx.amount;
    }
  }

  return { income, expenses };
}

export function DashboardOverview(): React.ReactElement {
  const { data: config } = useSiteConfig();
  const { data: account, isLoading: accountLoading } = useAccount();
  const { data: txResponse, isLoading: txLoading } = useTransactions(account?.id, {
    pageSize: 100, // fetch enough for chart + stats computation
  });

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

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {isLoading || !config ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Balance"
              value={formatCurrency(account?.balance ?? 0, config.currency)}
            />
            <StatCard
              label="Income this month"
              value={formatCurrency(stats.income, config.currency)}
            />
            <StatCard
              label="Expenses this month"
              value={formatCurrency(stats.expenses, config.currency)}
            />
          </>
        )}
      </div>

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
    </div>
  );
}
