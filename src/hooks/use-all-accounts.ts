import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/lib/data/data-service";
import type { AccountSearchFilters } from "@/lib/data/types";

export function useAllAccounts(filters: AccountSearchFilters = {}) {
  return useQuery({
    queryKey: ["allAccounts", filters],
    queryFn: () => dataService.getAllAccounts(filters),
  });
}
