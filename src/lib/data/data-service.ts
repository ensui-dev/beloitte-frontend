/**
 * Data service layer — the single point of access for all data fetching.
 *
 * In development (VITE_MOCK_MODE=true):
 *   Tries the real API first. If it fails, falls back to mock data silently.
 *
 * In production (VITE_MOCK_MODE=false):
 *   API only. Failures propagate as errors — never returns mock data.
 *   UI handles errors with proper error states and skeleton UIs.
 */
import { apiClient } from "./api-client";
import * as mockData from "./mock-data";
import type { SiteConfig } from "@/lib/config/site-config-schema";
import type { BankAccount, PaginatedResponse, Session, Transaction, TransferRequest } from "./types";

function isMockMode(): boolean {
  return import.meta.env.VITE_MOCK_MODE === "true";
}

/**
 * Wraps an API call with mock data fallback in dev mode.
 * In production, the API call must succeed or the error propagates.
 */
async function fetchWithFallback<T>(
  apiFn: () => Promise<T>,
  mockFn: () => T,
  resourceName: string
): Promise<T> {
  if (isMockMode()) {
    try {
      return await apiFn();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(
        `[DEV] API call failed for "${resourceName}", using mock data. Reason: ${message}`
      );
      return mockFn();
    }
  }

  return apiFn();
}

export const dataService = {
  // ─── Site Config ───────────────────────────────────────────

  getSiteConfig(bankId: string): Promise<SiteConfig> {
    return fetchWithFallback(
      () => apiClient.get<SiteConfig>(`/config/${bankId}`),
      () => mockData.siteConfig,
      "siteConfig"
    );
  },

  updateSiteConfig(bankId: string, config: SiteConfig): Promise<SiteConfig> {
    return fetchWithFallback(
      () => apiClient.put<SiteConfig>(`/config/${bankId}`, config),
      () => config,
      "updateSiteConfig"
    );
  },

  // ─── Account ───────────────────────────────────────────────

  getAccount(accountId: string): Promise<BankAccount> {
    return fetchWithFallback(
      () => apiClient.get<BankAccount>(`/accounts/${accountId}`),
      () => mockData.bankAccount,
      "account"
    );
  },

  // ─── Transactions ──────────────────────────────────────────

  getTransactions(
    accountId: string,
    page = 1
  ): Promise<PaginatedResponse<Transaction>> {
    return fetchWithFallback(
      () =>
        apiClient.get<PaginatedResponse<Transaction>>(
          `/accounts/${accountId}/transactions?page=${page}`
        ),
      () => ({
        data: mockData.transactions,
        total: mockData.transactions.length,
        page: 1,
        pageSize: 20,
      }),
      "transactions"
    );
  },

  // ─── Transfers ─────────────────────────────────────────────

  createTransfer(transfer: TransferRequest): Promise<Transaction> {
    return fetchWithFallback(
      () => apiClient.post<Transaction>("/transfers", transfer),
      () => mockData.pendingTransaction,
      "createTransfer"
    );
  },

  // ─── Auth ─────────────────────────────────────────────────

  getSession(): Promise<Session> {
    return fetchWithFallback(
      () => apiClient.get<Session>("/auth/me"),
      () => mockData.session,
      "session"
    );
  },

  logout(): Promise<void> {
    return fetchWithFallback(
      () => apiClient.post<void>("/auth/logout", {}),
      () => undefined,
      "logout"
    );
  },
} as const;
