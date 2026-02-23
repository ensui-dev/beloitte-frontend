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
import type { AccountCreationRequest, ActivityEvent, AdminStats, BackendHealth, Bank, BankAccount, BwiftHealth, PaginatedResponse, Session, Transaction, TransactionFilters, TransferRequest, VolumeDataPoint, WithdrawRequest } from "./types";

function isMockMode(): boolean {
  return import.meta.env.VITE_MOCK_MODE === "true";
}

// ─── Mock Persistence (localStorage) ──────────────────────────
// In mock mode, site config edits are persisted to localStorage so
// changes survive page reloads and are visible on the landing page.
//
// A version key tracks mock-data.ts changes. When the default mock
// data changes (e.g. new preset names, fixed CTA text), stale
// localStorage is automatically discarded so users see fresh defaults.

const MOCK_CONFIG_KEY = "beloitte:mock-site-config";
const MOCK_VERSION_KEY = "beloitte:mock-version";

/**
 * Bump this any time mock-data.ts defaults change in a way that
 * should invalidate users' saved localStorage state.
 */
const MOCK_DATA_VERSION = "7";

function getMockSiteConfig(): SiteConfig {
  if (!isMockMode()) return mockData.siteConfig;

  try {
    const storedVersion = localStorage.getItem(MOCK_VERSION_KEY);
    if (storedVersion !== MOCK_DATA_VERSION) {
      // Stale data from an older mock version — discard all mock state
      localStorage.removeItem(MOCK_CONFIG_KEY);
      localStorage.removeItem(MOCK_ACCOUNTS_KEY);
      localStorage.setItem(MOCK_VERSION_KEY, MOCK_DATA_VERSION);
      return mockData.siteConfig;
    }

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
    localStorage.setItem(MOCK_VERSION_KEY, MOCK_DATA_VERSION);
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

// ─── Mock Account Persistence (localStorage) ─────────────────
// Accounts are stored separately from site config because they're
// user-scoped (site config is bank-scoped).
//
// Fresh localStorage = no accounts = onboarding flow, just like
// production after a first Discord OAuth login. Once the user
// creates accounts through the wizard, they persist here.

const MOCK_ACCOUNTS_KEY = "beloitte:mock-accounts";

/**
 * Seed mock accounts into localStorage from the built-in mock data.
 * Called by "Dev Login (Seeded)" to skip onboarding and jump
 * straight to a populated dashboard for testing.
 */
export function seedMockAccounts(): void {
  if (!isMockMode()) return;
  setMockAccounts([...mockData.bankAccounts]);
}

function getMockAccounts(): BankAccount[] {
  if (!isMockMode()) return [...mockData.bankAccounts];

  try {
    const stored = localStorage.getItem(MOCK_ACCOUNTS_KEY);
    if (stored) return JSON.parse(stored) as BankAccount[];
  } catch { /* fall through */ }
  // Fresh state: no accounts — mirrors production for a new user
  return [];
}

function setMockAccounts(accounts: BankAccount[]): void {
  if (!isMockMode()) return;
  try {
    localStorage.setItem(MOCK_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch { /* storage full — ignore */ }
}

function generateMockIban(): string {
  const digits = Array.from({ length: 14 }, () => Math.floor(Math.random() * 10)).join("");
  return `DC12RVNB${digits}`;
}

function getMockSession(): Session {
  const accounts = getMockAccounts();
  return { ...mockData.session, hasAccounts: accounts.length > 0 };
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

  // ─── Accounts ──────────────────────────────────────────────

  /** Get all accounts for the current user. */
  getMyAccounts(): Promise<BankAccount[]> {
    return fetchWithFallback(
      () => apiClient.get<BankAccount[]>("/accounts/me/all"),
      () => getMockAccounts(),
      "myAccounts"
    );
  },

  /** @deprecated Use getMyAccounts() — kept for backward compat. */
  getMyAccount(): Promise<BankAccount> {
    return fetchWithFallback(
      () => apiClient.get<BankAccount>("/accounts/me"),
      () => {
        const accounts = getMockAccounts();
        return accounts[0] ?? mockData.bankAccount;
      },
      "myAccount"
    );
  },

  getAccount(accountId: string): Promise<BankAccount> {
    return fetchWithFallback(
      () => apiClient.get<BankAccount>(`/accounts/${accountId}`),
      () => {
        const accounts = getMockAccounts();
        return accounts.find((a) => a.id === accountId) ?? accounts[0] ?? mockData.bankAccount;
      },
      "account"
    );
  },

  /** Create a new account (personal or business). */
  createAccount(request: AccountCreationRequest): Promise<BankAccount> {
    return fetchWithFallback(
      () => apiClient.post<BankAccount>("/accounts", request),
      () => {
        const newAccount: BankAccount = {
          id: `acc-${crypto.randomUUID().slice(0, 8)}`,
          userId: mockData.session.user.id,
          bankId: request.bankId,
          accountNumber: generateMockIban(),
          balance: request.initialDeposit,
          currency: mockData.siteConfig.currency.code,
          status: "active",
          createdAt: new Date().toISOString(),
          accountType: request.accountType,
          accountName: request.accountName,
          initialDeposit: request.initialDeposit,
          netWorth: request.netWorth,
          companyCapital: request.companyCapital,
        };
        const accounts = getMockAccounts();
        accounts.push(newAccount);
        setMockAccounts(accounts);
        return newAccount;
      },
      "createAccount"
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

  // ─── Withdrawals ────────────────────────────────────────────

  createWithdrawal(withdrawal: WithdrawRequest): Promise<Transaction> {
    return fetchWithFallback(
      () => apiClient.post<Transaction>("/withdrawals", withdrawal),
      () => mockData.pendingWithdrawal,
      "createWithdrawal"
    );
  },

  // ─── BWIFT Network ──────────────────────────────────────────

  getBwiftHealth(): Promise<BwiftHealth> {
    return fetchWithFallback(
      () => apiClient.get<BwiftHealth>("/bwift/health"),
      () => mockData.bwiftHealth,
      "bwiftHealth"
    );
  },

  // ─── Backend Health ──────────────────────────────────────────

  getBackendHealth(): Promise<BackendHealth> {
    return fetchWithFallback(
      () => apiClient.get<BackendHealth>("/health"),
      () => mockData.backendHealth,
      "backendHealth"
    );
  },

  // ─── Auth ─────────────────────────────────────────────────

  getSession(): Promise<Session> {
    return fetchWithFallback(
      () => apiClient.get<Session>("/auth/me"),
      () => getMockSession(),
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

  // ─── Admin ──────────────────────────────────────────────────

  getAdminStats(): Promise<AdminStats> {
    return fetchWithFallback(
      () => apiClient.get<AdminStats>("/admin/stats"),
      () => mockData.adminStats,
      "adminStats"
    );
  },

  getVolumeHistory(days = 30): Promise<readonly VolumeDataPoint[]> {
    return fetchWithFallback(
      () => apiClient.get<readonly VolumeDataPoint[]>(`/admin/volume?days=${days}`),
      () => mockData.volumeHistory.slice(-days),
      "volumeHistory"
    );
  },

  getActivityFeed(limit = 10): Promise<readonly ActivityEvent[]> {
    return fetchWithFallback(
      () => apiClient.get<readonly ActivityEvent[]>(`/admin/activity?limit=${limit}`),
      () => mockData.activityFeed.slice(0, limit),
      "activityFeed"
    );
  },

  getBank(): Promise<Bank> {
    return fetchWithFallback(
      () => apiClient.get<Bank>("/admin/bank"),
      () => mockData.bank,
      "bank"
    );
  },
} as const;
