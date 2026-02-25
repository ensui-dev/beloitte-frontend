import { Link } from "react-router";
import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useAdminStats } from "@/hooks/use-admin-stats";
import { useAllTransactions } from "@/hooks/use-all-transactions";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/stat-card";
import { TransactionTable, TransactionTableSkeleton } from "@/components/dashboard/transaction-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/config/currency-utils";
import {
  Search,
  ArrowDownToLine,
  ArrowUpFromLine,
  ShieldAlert,
  FileText,
} from "lucide-react";

const QUICK_ACTIONS = [
  { label: "Account Lookup", icon: Search, href: "/dashboard/teller/lookup" },
  { label: "Process Deposit", icon: ArrowDownToLine, href: "/dashboard/teller/deposit" },
  { label: "Process Withdrawal", icon: ArrowUpFromLine, href: "/dashboard/teller/withdrawal" },
  { label: "Account Management", icon: ShieldAlert, href: "/dashboard/teller/accounts" },
  { label: "Transaction Log", icon: FileText, href: "/dashboard/teller/transactions" },
] as const;

export function TellerDashboard(): React.ReactElement {
  const { data: config } = useSiteConfig();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: recentTx, isLoading: txLoading } = useAllTransactions({ pageSize: 5 });

  usePageTitle("Teller Dashboard", config?.bankName);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Teller Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Daily operations overview and quick actions.
        </p>
      </div>

      {/* Stats */}
      {statsLoading || !stats || !config ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total Accounts"
            value={stats.totalAccounts.toLocaleString()}
            change={stats.activeAccountsChange}
          />
          <StatCard
            label="Total Balance"
            value={formatCurrency(stats.totalBalance, config.currency)}
            change={stats.balanceChange}
          />
          <StatCard
            label="Transactions Today"
            value={stats.totalTransactions.toLocaleString()}
            change={stats.transactionsChange}
          />
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.href} to={action.href}>
              <Card className="border-white/[0.06] bg-white/[0.02] transition-colors hover:border-primary/30 hover:bg-white/[0.04]">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <action.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Recent Bank Activity</CardTitle>
          <Link
            to="/dashboard/teller/transactions"
            className="text-xs text-primary hover:underline"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {txLoading || !config ? (
            <TransactionTableSkeleton rows={5} />
          ) : recentTx ? (
            <TransactionTable transactions={recentTx.data} currency={config.currency} compact />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
