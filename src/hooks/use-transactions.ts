/**
 * React Query hook for paginated, filterable transactions.
 * Wraps dataService.getTransactions() with filter-aware cache keys.
 *
 * The filters object is included in the query key, so changing
 * filters automatically triggers a refetch with cached results
 * for previously-seen filter combinations.
 */
import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/lib/data/data-service";
import type { PaginatedResponse, Transaction, TransactionFilters } from "@/lib/data/types";

export function useTransactions(accountId: string | undefined, filters: TransactionFilters = {}) {
  return useQuery<PaginatedResponse<Transaction>>({
    queryKey: ["transactions", accountId, filters],
    queryFn: () => dataService.getTransactions(accountId!, filters),
    enabled: !!accountId,
  });
}
