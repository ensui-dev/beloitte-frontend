/**
 * Core data types for the banking frontend.
 * These represent the domain model — users, accounts, transactions.
 * All types are strict: no `any`, no optional where required.
 */

// ─── User & Auth ───────────────────────────────────────────────

export const USER_ROLES = ["customer", "teller", "accountant", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface User {
  readonly id: string;
  readonly discordId: string;
  readonly discordUsername: string;
  readonly discordAvatar: string | null;
  readonly roles: readonly UserRole[];
  readonly isSuperadmin: boolean;
}

export interface Session {
  readonly user: User;
  readonly activeRole: UserRole;
  readonly bankId: string;
  readonly accessToken: string;
  readonly hasAccounts: boolean;
  /** True when at least one account has status "active" (passed verification). */
  readonly hasVerifiedAccounts: boolean;
}

// ─── Admin User Management ────────────────────────────────────────

/** User summary returned by the admin GET /users endpoint. */
export interface AdminUserSummary {
  readonly id: string;
  readonly discordId: string;
  readonly discordUsername: string;
  readonly discordAvatar: string | null;
  readonly displayName: string | null;
  readonly kycVerified: boolean;
  readonly isActive: boolean;
  readonly suspendedAt: string | null;
  readonly suspensionReason: string | null;
}

/** A single active role assignment returned by GET /users/:id/roles. */
export interface AdminUserRoleAssignment {
  readonly id: number;
  readonly roleName: string;
  readonly description: string | null;
  readonly assignedAt: string;
}

// ─── Banking ───────────────────────────────────────────────────

export const ACCOUNT_CATEGORIES = ["personal", "business"] as const;
export type AccountCategory = (typeof ACCOUNT_CATEGORIES)[number];

export const ACCOUNT_TYPE_NAMES = [
  "personal_checking",
  "personal_savings",
  "business_checking",
  "business_savings",
] as const;
export type AccountTypeName = (typeof ACCOUNT_TYPE_NAMES)[number];

export const ACCOUNT_STATUSES = ["active", "frozen", "closed", "pending_verification"] as const;
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

// ─── Nested sub-objects matching backend Account schema ──────

export interface AccountCategorySummary {
  readonly id: number;
  readonly categoryName: AccountCategory;
}

export interface AccountTypeSummary {
  readonly id: number;
  readonly category: AccountCategorySummary;
  readonly typeName: AccountTypeName;
  readonly interestRate: number;        // Annual % (e.g. 0.03 = 3%)
  readonly minBalance: number;
  readonly monthlyFee: number;
  readonly withdrawalLimitDaily: number | null;
  readonly transferLimitDaily: number | null;
  readonly requiresBusinessEntity: boolean;
}

export interface AccountUserSummary {
  readonly id: number;
  readonly discordId: string;
  readonly discordUsername: string;
  readonly discordAvatar: string | null;
  readonly displayName: string | null;
  readonly kycVerified: boolean;
  readonly isActive: boolean;
  readonly suspendedAt: string | null;
  readonly suspensionReason: string | null;
}

export interface AccountBusinessSummary {
  readonly id: number;
  readonly businessName: string;
  readonly businessType: string;
  readonly docRegistered: boolean;
  readonly registeredAt: string | null;
  readonly isActive: boolean;
}

export const PERMISSION_LEVELS = ["view", "transact", "admin"] as const;
export type PermissionLevel = (typeof PERMISSION_LEVELS)[number];

export interface AccountAuthorizedUser {
  readonly id: number;
  readonly user: AccountUserSummary;
  readonly permissionLevel: PermissionLevel;
  readonly grantedAt: string;
  readonly revokedAt: string | null;
}

// ─── Main Account interface (matches backend Account schema) ──

export interface BankAccount {
  readonly id: number;
  readonly iban: string;
  readonly accountType: AccountTypeSummary;
  readonly user: AccountUserSummary | null;       // Set for personal accounts
  readonly business: AccountBusinessSummary | null; // Set for business accounts
  readonly authorizedUsers: readonly AccountAuthorizedUser[];
  readonly balance: number;
  readonly nickname: string | null;
  readonly status: AccountStatus;
  readonly openedAt: string;
  readonly closedAt: string | null;
}

// ─── Account helpers ─────────────────────────────────────────

/** Get the account category ("personal" | "business") from a nested account. */
export function getAccountCategory(account: BankAccount): AccountCategory {
  return account.accountType.category.categoryName;
}

/** Get a display name for an account (nickname, owner name, or IBAN suffix). */
export function getAccountDisplayName(account: BankAccount): string {
  if (account.nickname) return account.nickname;
  if (account.user) return account.user.displayName ?? account.user.discordUsername;
  if (account.business) return account.business.businessName;
  return account.iban.slice(-8);
}

/** Check if an account is a business account. */
export function isBusinessAccount(account: BankAccount): boolean {
  return account.accountType.category.categoryName === "business";
}

// ─── Account creation request (matches backend CreateAccountRequest) ──

export interface AccountCreationRequest {
  readonly accountType: AccountTypeName;
  readonly businessId?: number;
  readonly nickname?: string;
}

// Transaction type codes — matches backend transaction_types table
export const TRANSACTION_TYPE_CODES = [
  "deposit",
  "withdrawal",
  "transfer_out",
  "transfer_in",
  "wire_out",
  "wire_in",
  "fee",
  "interest",
  "adjustment",
] as const;
export type TransactionTypeCode = (typeof TRANSACTION_TYPE_CODES)[number];

// Transaction status — matches backend Transaction.status column
export const TRANSACTION_STATUSES = ["pending", "posted", "reversed", "failed"] as const;
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

// Nested sub-objects matching backend TransactionSchema
export interface TransactionAccountSummary {
  readonly id: number;
  readonly iban: string;
  readonly nickname: string | null;
}

export interface TransactionTypeSummary {
  readonly id: number;
  readonly typeCode: TransactionTypeCode;
  readonly affectsBalance: "credit" | "debit";
}

export interface TransactionInitiator {
  readonly id: number;
  readonly discordId: string;
  readonly discordUsername: string;
}

export interface Transaction {
  readonly id: number;
  readonly account: TransactionAccountSummary;
  readonly transactionType: TransactionTypeSummary;
  readonly initiatedBy: TransactionInitiator;
  readonly amount: number;
  readonly balanceBefore: number;
  readonly balanceAfter: number;
  readonly description: string | null;
  readonly referenceId: number | null;
  readonly status: TransactionStatus;
  readonly transactedAt: string;
  readonly postedAt: string | null;
}

export interface TransferRequest {
  readonly fromAccountId: number;
  readonly toIban: string;
  readonly amount: number;
  readonly currency: string;
  readonly description?: string;
}

export interface WithdrawRequest {
  readonly fromAccountId: number;
  readonly amount: number;
  readonly currency: string;
  readonly description?: string;
}

// ─── Staff Operations (teller/accountant) ─────────────────────

export interface DepositRequest {
  readonly toAccountId: number;
  readonly amount: number;
  readonly currency: string;
  readonly description?: string;
}

export interface AccountSearchFilters {
  readonly query?: string;  // IBAN, name, or username search
  readonly status?: AccountStatus;
  readonly category?: AccountCategory;
  readonly page?: number;
  readonly pageSize?: number;
}

export interface BankWideTransactionFilters {
  readonly query?: string;  // description or IBAN search
  readonly transactionType?: TransactionTypeCode;
  readonly status?: TransactionStatus;
  readonly page?: number;
  readonly pageSize?: number;
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
  readonly transactionType?: TransactionTypeCode;
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
