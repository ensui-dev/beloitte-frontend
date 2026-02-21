/**
 * React Query hook for the current user's bank account.
 * Wraps dataService.getMyAccount() with caching and loading states.
 */
import { useQuery } from "@tanstack/react-query";
import { dataService } from "@/lib/data/data-service";
import type { BankAccount } from "@/lib/data/types";

const MY_ACCOUNT_KEY = ["myAccount"] as const;

export function useAccount() {
  return useQuery<BankAccount>({
    queryKey: MY_ACCOUNT_KEY,
    queryFn: () => dataService.getMyAccount(),
  });
}
