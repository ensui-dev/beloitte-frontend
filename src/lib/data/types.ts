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
}

// ─── Banking ───────────────────────────────────────────────────

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
