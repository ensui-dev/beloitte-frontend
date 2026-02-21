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
import type { BankAccount, PaginatedResponse, Session, Transaction, TransactionFilters, TransferRequest } from "./types";

function isMockMode(): boolean {
  return import.meta.env.VITE_MOCK_MODE === "true";
}

// ─── Mock Persistence (localStorage) ──────────────────────────
// In mock mode, site config edits are persisted to localStorage so
// changes survive page reloads and are visible on the landing page.

const MOCK_CONFIG_KEY = "beloitte:mock-site-config";

function getMockSiteConfig(): SiteConfig {
  if (!isMockMode()) return mockData.siteConfig;

  try {
    const stored = localStorage.getItem(MOCK_CONFIG_KEY);
    if (stored) {
      return JSON.parse(stored) as SiteConfig;
    }
  } catch {
    // Corrupted data — fall through to default
  }
  return mockData.siteConfig;
}

function setMockSiteConfig(config: SiteConfig): void {
  if (!isMockMode()) return;

  try {
    localStorage.setItem(MOCK_CONFIG_KEY, JSON.stringify(config));
  } catch {
    // Storage full or unavailable — silently ignore
  }
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
      () => getMockSiteConfig(),
      "siteConfig"
    );
  },

  updateSiteConfig(bankId: string, config: SiteConfig): Promise<SiteConfig> {
    return fetchWithFallback(
      () => apiClient.put<SiteConfig>(`/config/${bankId}`, config),
      () => {
        setMockSiteConfig(config);
        return config;
      },
      "updateSiteConfig"
    );
  },

  // ─── Account ───────────────────────────────────────────────

  /** Get the current user's primary account. */
  getMyAccount(): Promise<BankAccount> {
    return fetchWithFallback(
      () => apiClient.get<BankAccount>("/accounts/me"),
      () => mockData.bankAccount,
      "myAccount"
    );
  },

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
    filters: TransactionFilters = {}
  ): Promise<PaginatedResponse<Transaction>> {
    const params = new URLSearchParams();
    if (filters.page) params.set("page", String(filters.page));
    if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
    if (filters.type) params.set("type", filters.type);
    if (filters.status) params.set("status", filters.status);
    const qs = params.toString();

    return fetchWithFallback(
      () =>
        apiClient.get<PaginatedResponse<Transaction>>(
          `/accounts/${accountId}/transactions${qs ? `?${qs}` : ""}`
        ),
      () => mockData.getFilteredTransactions(filters),
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
