/**
 * Core data types for the banking frontend.
 * These represent the domain model — users, accounts, transactions.
 * All types are strict: no `any`, no optional where required.
 */

// ─── User & Auth ───────────────────────────────────────────────

export const USER_ROLES = ["player", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface User {
  readonly id: string;
  readonly discordId: string;
  readonly discordUsername: string;
  readonly discordAvatar: string;
  readonly roles: readonly UserRole[];
}

export interface Session {
  readonly user: User;
  readonly activeRole: UserRole;
  readonly bankId: string;
  readonly accessToken: string;
  readonly hasAccounts: boolean;
}

// ─── Banking ───────────────────────────────────────────────────

export const ACCOUNT_TYPES = ["personal", "business"] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const ACCOUNT_STATUSES = ["active", "frozen", "closed"] as const;
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export interface BankAccount {
  readonly id: string;
  readonly userId: string;
  readonly bankId: string;
  readonly accountNumber: string;
  readonly balance: number;
  readonly currency: string;
  readonly status: AccountStatus;
  readonly createdAt: string;
  readonly accountType: AccountType;
  readonly accountName: string;       // in-game name (personal) or business entity name (business)
  readonly initialDeposit: number;
  readonly netWorth?: number;         // personal accounts only: total cash balance
  readonly companyCapital?: number;   // business accounts only: company capital
}

export interface AccountCreationRequest {
  readonly bankId: string;
  readonly accountType: AccountType;
  readonly accountName: string;
  readonly initialDeposit: number;
  readonly netWorth?: number;
  readonly companyCapital?: number;
}

export const TRANSACTION_TYPES = [
  "deposit",
  "withdrawal",
  "transfer_in",
  "transfer_out",
] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const TRANSACTION_STATUSES = ["completed", "pending", "failed"] as const;
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

export interface Transaction {
  readonly id: string;
  readonly accountId: string;
  readonly type: TransactionType;
  readonly amount: number;
  readonly currency: string;
  readonly description: string;
  readonly counterparty?: string;
  readonly reference?: string;
  readonly status: TransactionStatus;
  readonly createdAt: string;
}

export interface TransferRequest {
  readonly fromAccountId: string;
  readonly toIban: string;
  readonly amount: number;
  readonly currency: string;
  readonly description?: string;
}

export interface WithdrawRequest {
  readonly fromAccountId: string;
  readonly amount: number;
  readonly currency: string;
  readonly description?: string;
}

// ─── BWIFT Network ────────────────────────────────────────────

export const BWIFT_STATUSES = ["operational", "degraded", "outage"] as const;
export type BwiftStatus = (typeof BWIFT_STATUSES)[number];

export interface BwiftHealth {
  readonly status: BwiftStatus;
  readonly latencyMs: number;
  readonly lastChecked: string;
}

// ─── Backend Health ───────────────────────────────────────────

export interface BackendHealth {
  readonly status: "ok" | "error";
  readonly version?: string;
  readonly uptime?: number;
}

export interface TransactionFilters {
  readonly type?: TransactionType;
  readonly status?: TransactionStatus;
  readonly page?: number;
  readonly pageSize?: number;
}

// ─── Bank (admin) ──────────────────────────────────────────────

export const BANK_STATUSES = ["active", "suspended"] as const;
export type BankStatus = (typeof BANK_STATUSES)[number];

export interface Bank {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly bankCode: string;
  readonly status: BankStatus;
  readonly createdAt: string;
}

// ─── Admin Stats ──────────────────────────────────────────────

export interface AdminStats {
  readonly totalAccounts: number;
  readonly totalBalance: number;
  readonly totalTransactions: number;
  readonly activeAccountsChange: number;
  readonly balanceChange: number;
  readonly transactionsChange: number;
}

export interface VolumeDataPoint {
  readonly date: string;
  readonly deposits: number;
  readonly withdrawals: number;
  readonly transfers: number;
}

export const ACTIVITY_EVENT_TYPES = [
  "account_created",
  "transfer",
  "deposit",
  "withdrawal",
  "config_change",
] as const;
export type ActivityEventType = (typeof ACTIVITY_EVENT_TYPES)[number];

export interface ActivityEvent {
  readonly id: string;
  readonly type: ActivityEventType;
  readonly description: string;
  readonly actor: string;
  readonly createdAt: string;
}

// ─── Paginated Response ────────────────────────────────────────

export interface PaginatedResponse<T> {
  readonly data: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

// ─── API Error ─────────────────────────────────────────────────

export class ApiError extends Error {
  readonly statusCode: number;
  readonly body: string;

  constructor(statusCode: number, body: string) {
    super(`API Error ${statusCode}: ${body}`);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.body = body;
  }
}
