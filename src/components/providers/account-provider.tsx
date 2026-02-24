/**
 * Account selection context — tracks which account is active in the dashboard.
 *
 * Wraps the dashboard layout. Provides:
 *   - accounts:        all accounts for the current user
 *   - selectedAccount: the currently active account (or null during loading)
 *   - selectAccount:   switch to a different account by ID
 *   - isLoading:       whether accounts are still being fetched
 *
 * Selection persists to localStorage so the user's last-viewed account
 * survives page reloads.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAccounts } from "@/hooks/use-account";
import type { BankAccount } from "@/lib/data/types";

const SELECTED_ACCOUNT_KEY = "beloitte:selected-account";

interface AccountContextValue {
  readonly accounts: readonly BankAccount[];
  readonly selectedAccount: BankAccount | null;
  readonly selectAccount: (accountId: number) => void;
  readonly isLoading: boolean;
}

const AccountContext = createContext<AccountContextValue | null>(null);

interface AccountProviderProps {
  readonly children: ReactNode;
}

export function AccountProvider({ children }: AccountProviderProps): React.ReactElement {
  const { data: accounts = [], isLoading } = useAccounts();
  const [selectedId, setSelectedId] = useState<number | null>(() => {
    try {
      const stored = localStorage.getItem(SELECTED_ACCOUNT_KEY);
      return stored !== null ? Number(stored) : null;
    } catch {
      return null;
    }
  });

  // Auto-select: if no selection or stored ID isn't in the list, pick the first account
  useEffect(() => {
    if (accounts.length === 0) return;

    const current = accounts.find((a) => a.id === selectedId);
    if (!current) {
      setSelectedId(accounts[0].id);
    }
  }, [accounts, selectedId]);

  // Persist selection to localStorage
  useEffect(() => {
    if (selectedId === null) return;
    try {
      localStorage.setItem(SELECTED_ACCOUNT_KEY, String(selectedId));
    } catch { /* ignore */ }
  }, [selectedId]);

  const selectAccount = useCallback((accountId: number): void => {
    setSelectedId(accountId);
  }, []);

  const selectedAccount = useMemo(
    () => accounts.find((a) => a.id === selectedId) ?? accounts[0] ?? null,
    [accounts, selectedId]
  );

  const value = useMemo<AccountContextValue>(
    () => ({ accounts, selectedAccount, selectAccount, isLoading }),
    [accounts, selectedAccount, selectAccount, isLoading]
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

/**
 * Access the account context. Must be used within AccountProvider.
 */
export function useAccountContext(): AccountContextValue {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccountContext must be used within an AccountProvider.");
  }
  return context;
}
