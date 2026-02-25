import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/lib/data/data-service";
import type { BankWideTransactionFilters } from "@/lib/data/types";

export function useAllTransactions(filters: BankWideTransactionFilters = {}) {
  return useQuery({
    queryKey: ["allTransactions", filters],
    queryFn: () => dataService.getAllTransactions(filters),
  });
}
