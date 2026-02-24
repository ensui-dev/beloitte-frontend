import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useAccountContext } from "@/components/providers/account-provider";
import { useTransactions } from "@/hooks/use-transactions";
import {
  TransactionTable,
  TransactionTableSkeleton,
} from "@/components/dashboard/transaction-table";
import {
  TransactionFilters,
  useTransactionFilterParams,
} from "@/components/dashboard/transaction-filters";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function DashboardTransactions(): React.ReactElement {
  const { data: config } = useSiteConfig();
  const { selectedAccount: account } = useAccountContext();
  const { type, status, page, setType, setStatus, setPage } = useTransactionFilterParams();

  const { data: txResponse, isLoading } = useTransactions(account?.id, {
    transactionType: type,
    status,
    page,
    pageSize: 10,
  });

  usePageTitle("Transactions", config?.bankName);

  const transactions = txResponse?.data ?? [];
  const total = txResponse?.total ?? 0;
  const pageSize = txResponse?.pageSize ?? 10;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View and filter your transaction history.
        </p>
      </div>

      {/* Filter bar */}
      <TransactionFilters
        onTypeChange={setType}
        onStatusChange={setStatus}
        currentType={type}
        currentStatus={status}
      />

      {/* Transaction table */}
      {isLoading || !config ? (
        <TransactionTableSkeleton rows={8} />
      ) : (
        <TransactionTable transactions={transactions} currency={config.currency} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} ({total} transactions)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="border-white/[0.06]"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="border-white/[0.06]"
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
