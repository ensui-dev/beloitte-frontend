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
import type { AccountCreationRequest, AccountSearchFilters, ActivityEvent, AdminStats, AdminUserRoleAssignment, AdminUserSummary, BackendHealth, Bank, BankAccount, BankWideTransactionFilters, BwiftHealth, DepositRequest, PaginatedResponse, Session, Transaction, TransactionFilters, TransferRequest, VolumeDataPoint, WithdrawRequest } from "./types";

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
const MOCK_DATA_VERSION = "9";

/**
 * Ensure localStorage mock state matches the current code version.
 * Idempotent — safe to call from any mock reader. On version mismatch,
 * all persisted mock state is discarded so users see fresh defaults.
 */
function ensureMockVersion(): void {
  if (!isMockMode()) return;

  try {
    const storedVersion = localStorage.getItem(MOCK_VERSION_KEY);
    if (storedVersion !== MOCK_DATA_VERSION) {
      localStorage.removeItem(MOCK_CONFIG_KEY);
      localStorage.removeItem(MOCK_ACCOUNTS_KEY);
      localStorage.setItem(MOCK_VERSION_KEY, MOCK_DATA_VERSION);
    }
  } catch {
    // Storage unavailable — ignore
  }
}

function getMockSiteConfig(): SiteConfig {
  if (!isMockMode()) return mockData.siteConfig;

  ensureMockVersion();

  try {
    const stored = localStorage.getItem(MOCK_CONFIG_KEY);
    if (stored) {
      return JSON.parse(stored) as SiteConfig;
    }
  } catch {
    // Corrupted data — fall through to "no config" state
  }

  // Fresh localStorage = no config = setup wizard should trigger.
  // Throwing here lets fetchWithFallback propagate the error so
  // useSiteConfig() enters error state, which SetupGuard detects.
  throw new Error("No site config found — setup required");
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

/**
 * Seed both site config AND accounts into localStorage.
 * Called by "Dev Login (Seeded)" to skip the setup wizard AND
 * onboarding entirely — go straight to a populated dashboard.
 */
export function seedMockSetup(): void {
  if (!isMockMode()) return;
  setMockSiteConfig(mockData.siteConfig);
  setMockAccounts([...mockData.bankAccounts]);
}

function getMockAccounts(): BankAccount[] {
  if (!isMockMode()) return [...mockData.bankAccounts];

  ensureMockVersion();

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

/**
 * Generate a realistic BWIFT IBAN from a mock snowflake ID.
 *
 * Algorithm:
 * 1. Generate a random 18-digit snowflake
 * 2. Convert snowflake to base-36, zero-pad to 14 chars
 * 3. Prepend bank code (BELT)
 * 4. Calculate ISO 13616 check digits
 * 5. Assemble: DC{check}{bankCode}{accountBase36}
 */
function generateMockIban(): string {
  const bankCode = "BELT";

  // Generate a random 18-digit snowflake ID
  const snowflake = BigInt(Math.floor(Math.random() * 9e17) + 1e17);

  // Convert to base-36 and zero-pad to 14 characters
  const base36 = snowflake.toString(36).toUpperCase().padStart(14, "0");

  // Calculate ISO 13616 check digits:
  // Rearrange: {bankCode}{account}DC00
  const rearranged = `${bankCode}${base36}DC00`;

  // Convert letters to numbers (A=10 ... Z=35), digits stay as-is
  let numericStr = "";
  for (const ch of rearranged) {
    const code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      numericStr += String(code - 55); // A=10, B=11, ...
    } else {
      numericStr += ch;
    }
  }

  // Compute mod 97 on the large number (process in chunks to avoid overflow)
  let remainder = 0;
  for (const digit of numericStr) {
    remainder = (remainder * 10 + Number(digit)) % 97;
  }
  const check = (98 - remainder).toString().padStart(2, "0");

  return `DC${check}${bankCode}${base36}`;
}

function getMockSession(): Session {
  const accounts = getMockAccounts();
  return {
    ...mockData.session,
    hasAccounts: accounts.length > 0,
    hasVerifiedAccounts: accounts.some((a) => a.status === "active"),
  };
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
      () => apiClient.get<BankAccount[]>("/accounts"),
      () => getMockAccounts(),
      "myAccounts"
    );
  },

  getAccount(accountId: number): Promise<BankAccount> {
    return fetchWithFallback(
      () => apiClient.get<BankAccount>(`/accounts/${accountId}`),
      () => {
        const accounts = getMockAccounts();
        return accounts.find((a) => a.id === accountId) ?? accounts[0] ?? mockData.bankAccount;
      },
      "account"
    );
  },

  /** Create a new account (personal or business). Starts as pending_verification. */
  createAccount(request: AccountCreationRequest): Promise<BankAccount> {
    return fetchWithFallback(
      () => apiClient.post<BankAccount>("/accounts", request),
      () => {
        const accounts = getMockAccounts();
        const nextId = accounts.reduce((max, a) => Math.max(max, a.id), 0) + 1;
        const isBusinessType = request.accountType.startsWith("business");

        const newAccount: BankAccount = {
          id: nextId,
          iban: generateMockIban(),
          accountType: isBusinessType
            ? { id: 3, category: { id: 2, categoryName: "business" }, typeName: request.accountType, interestRate: 0.005, minBalance: 100, monthlyFee: 5, withdrawalLimitDaily: 50000, transferLimitDaily: 100000, requiresBusinessEntity: true }
            : { id: 1, category: { id: 1, categoryName: "personal" }, typeName: request.accountType, interestRate: 0.01, minBalance: 0, monthlyFee: 0, withdrawalLimitDaily: 10000, transferLimitDaily: 25000, requiresBusinessEntity: false },
          user: isBusinessType ? null : mockData.mockOwner,
          business: isBusinessType ? mockData.mockBusiness : null,
          authorizedUsers: [],
          balance: 0,
          nickname: request.nickname ?? null,
          status: "pending_verification",
          openedAt: new Date().toISOString(),
          closedAt: null,
        };
        accounts.push(newAccount);
        setMockAccounts(accounts);
        return newAccount;
      },
      "createAccount"
    );
  },

  /**
   * Verify an account's deposit. In mock mode, always succeeds and
   * flips the account status from pending_verification to active.
   * In production, the backend checks for a matching deposit.
   */
  verifyAccount(accountId: number): Promise<boolean> {
    return fetchWithFallback(
      async () => {
        const result = await apiClient.post<{ verified: boolean }>(
          `/accounts/${accountId}/verify`,
          {}
        );
        return result.verified;
      },
      () => {
        // Mock mode: always succeeds — update the account status in localStorage
        const accounts = getMockAccounts();
        const account = accounts.find((a) => a.id === accountId);
        if (account && account.status === "pending_verification") {
          // Mutate in place since we're about to persist
          (account as { status: string }).status = "active";
          setMockAccounts(accounts);
        }
        return true;
      },
      "verifyAccount"
    );
  },

  // ─── Transactions ──────────────────────────────────────────

  getTransactions(
    accountId: number,
    filters: TransactionFilters = {}
  ): Promise<PaginatedResponse<Transaction>> {
    const params = new URLSearchParams();
    if (filters.page) params.set("page", String(filters.page));
    if (filters.pageSize) params.set("page_size", String(filters.pageSize));
    if (filters.transactionType) params.set("transaction_type", filters.transactionType);
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
      async () => {
        // Backend /auth/me returns everything except account-derived fields.
        // We derive hasAccounts and hasVerifiedAccounts client-side.
        const raw = await apiClient.get<Omit<Session, "hasAccounts" | "hasVerifiedAccounts">>("/auth/me");

        let hasAccounts = true; // safe default: don't force onboarding on failure
        let hasVerifiedAccounts = true; // safe default: don't force verification
        try {
          const accounts = await apiClient.get<BankAccount[]>("/accounts");
          hasAccounts = Array.isArray(accounts) && accounts.length > 0;
          hasVerifiedAccounts = Array.isArray(accounts) && accounts.some((a) => a.status === "active");
        } catch {
          // Accounts endpoint unreachable — assume user has accounts to avoid
          // incorrectly redirecting to onboarding. The dashboard will show
          // its own error state if accounts truly can't be loaded.
        }

        return { ...raw, hasAccounts, hasVerifiedAccounts };
      },
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
      () => apiClient.get<AdminStats>("/stats/"),
      () => mockData.adminStats,
      "adminStats"
    );
  },

  getVolumeHistory(days = 30): Promise<readonly VolumeDataPoint[]> {
    return fetchWithFallback(
      () => apiClient.get<readonly VolumeDataPoint[]>(`/stats/volume?days=${days}`),
      () => mockData.volumeHistory.slice(-days),
      "volumeHistory"
    );
  },

  getActivityFeed(limit = 10): Promise<readonly ActivityEvent[]> {
    return fetchWithFallback(
      () => apiClient.get<readonly ActivityEvent[]>(`/stats/activity?limit=${limit}`),
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

  // ─── Staff Operations (teller/accountant) ─────────────────────

  /** Get all accounts across the bank (staff-only). */
  getAllAccounts(filters: AccountSearchFilters = {}): Promise<PaginatedResponse<BankAccount>> {
    const params = new URLSearchParams();
    if (filters.query) params.set("q", filters.query);
    if (filters.status) params.set("status", filters.status);
    if (filters.category) params.set("category", filters.category);
    if (filters.page) params.set("page", String(filters.page));
    if (filters.pageSize) params.set("page_size", String(filters.pageSize));
    const qs = params.toString();

    return fetchWithFallback(
      () => apiClient.get<PaginatedResponse<BankAccount>>(`/admin/accounts${qs ? `?${qs}` : ""}`),
      () => mockData.getFilteredAccounts(filters),
      "allAccounts"
    );
  },

  /** Get bank-wide transactions across all accounts (staff-only). */
  getAllTransactions(filters: BankWideTransactionFilters = {}): Promise<PaginatedResponse<Transaction>> {
    const params = new URLSearchParams();
    if (filters.query) params.set("q", filters.query);
    if (filters.transactionType) params.set("transaction_type", filters.transactionType);
    if (filters.status) params.set("status", filters.status);
    if (filters.page) params.set("page", String(filters.page));
    if (filters.pageSize) params.set("page_size", String(filters.pageSize));
    const qs = params.toString();

    return fetchWithFallback(
      () => apiClient.get<PaginatedResponse<Transaction>>(`/admin/transactions${qs ? `?${qs}` : ""}`),
      () => mockData.getFilteredBankTransactions(filters),
      "allTransactions"
    );
  },

  /** Process a deposit into any account (teller-only). */
  createDeposit(deposit: DepositRequest): Promise<Transaction> {
    return fetchWithFallback(
      () => apiClient.post<Transaction>("/deposits", deposit),
      () => ({
        ...mockData.pendingTransaction,
        id: Date.now(),
        account: { id: deposit.toAccountId, iban: "UNKNOWN", nickname: null },
        transactionType: { id: 1, typeCode: "deposit" as const, affectsBalance: "credit" as const },
        amount: deposit.amount,
        description: deposit.description ?? "Teller deposit",
        status: "posted" as const,
        transactedAt: new Date().toISOString(),
        postedAt: new Date().toISOString(),
      }),
      "createDeposit"
    );
  },

  /** Update an account's status (freeze, unfreeze, close). Teller/admin only. */
  updateAccountStatus(accountId: number, status: "active" | "frozen" | "closed"): Promise<BankAccount> {
    return fetchWithFallback(
      () => apiClient.post<BankAccount>(`/accounts/${accountId}/status`, { status }),
      () => {
        const accounts = getMockAccounts();
        const account = accounts.find((a) => a.id === accountId);
        if (account) {
          (account as { status: string }).status = status;
          setMockAccounts(accounts);
          return account;
        }
        // Fall back to allBankAccounts (other customers' accounts in mock data)
        const allAcct = mockData.allBankAccounts.find((a) => a.id === accountId);
        if (allAcct) return { ...allAcct, status };
        throw new Error(`Account ${accountId} not found`);
      },
      "updateAccountStatus"
    );
  },

  // ─── Admin: User Management ──────────────────────────────────

  /** Paginated list of all users in this bank (admin only). */
  getUsers(page = 1, pageSize = 20): Promise<PaginatedResponse<AdminUserSummary>> {
    return fetchWithFallback(
      () => apiClient.get<PaginatedResponse<AdminUserSummary>>(
        `/users?page=${page}&page_size=${pageSize}`
      ),
      () => mockData.getFilteredUsers(page, pageSize),
      "users"
    );
  },

  /** Suspend a user (admin only). */
  suspendUser(userId: string, reason: string): Promise<AdminUserSummary> {
    return fetchWithFallback(
      () => apiClient.post<AdminUserSummary>(`/users/${userId}/suspend`, { reason }),
      () => { throw new Error("Mock suspend not supported"); },
      "suspendUser"
    );
  },

  /** Unsuspend a user (admin only). */
  unsuspendUser(userId: string): Promise<AdminUserSummary> {
    return fetchWithFallback(
      () => apiClient.delete<AdminUserSummary>(`/users/${userId}/suspend`),
      () => { throw new Error("Mock unsuspend not supported"); },
      "unsuspendUser"
    );
  },

  /** Update a user's KYC verification status (admin only). */
  updateUserKyc(userId: string, kycVerified: boolean): Promise<AdminUserSummary> {
    return fetchWithFallback(
      () => apiClient.patch<AdminUserSummary>(`/users/${userId}/kyc`, { kycVerified }),
      () => { throw new Error("Mock KYC update not supported"); },
      "updateKyc"
    );
  },

  /** Get active role assignments for a user (admin only). */
  getUserRoles(userId: string): Promise<readonly AdminUserRoleAssignment[]> {
    return fetchWithFallback(
      () => apiClient.get<AdminUserRoleAssignment[]>(`/users/${userId}/roles`),
      () => [],
      "userRoles"
    );
  },

  /** Assign a role to a user (admin only). */
  assignUserRole(userId: string, roleName: string): Promise<AdminUserRoleAssignment> {
    return fetchWithFallback(
      () => apiClient.post<AdminUserRoleAssignment>(`/users/${userId}/roles`, { roleName }),
      () => { throw new Error("Mock role assign not supported"); },
      "assignRole"
    );
  },

  /** Revoke a role assignment (admin only). */
  revokeUserRole(userId: string, assignmentId: number): Promise<AdminUserRoleAssignment> {
    return fetchWithFallback(
      () => apiClient.delete<AdminUserRoleAssignment>(`/users/${userId}/roles/${assignmentId}`),
      () => { throw new Error("Mock role revoke not supported"); },
      "revokeRole"
    );
  },
} as const;
