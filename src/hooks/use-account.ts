/**
 * React Query hooks for bank accounts.
 *
 * useAccounts()      — fetches all accounts for the current user
 * useCreateAccount() — mutation to create a new personal/business account
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dataService } from "@/lib/data/data-service";
import type { AccountCreationRequest, BankAccount } from "@/lib/data/types";

export const ACCOUNTS_QUERY_KEY = ["myAccounts"] as const;

/** Fetches all accounts for the current user. */
export function useAccounts() {
  return useQuery<BankAccount[]>({
    queryKey: ACCOUNTS_QUERY_KEY,
    queryFn: () => dataService.getMyAccounts(),
  });
}

/** Mutation hook for creating a new account. Invalidates the accounts cache on success. */
export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation<BankAccount, Error, AccountCreationRequest>({
    mutationFn: (request) => dataService.createAccount(request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
  });
}

