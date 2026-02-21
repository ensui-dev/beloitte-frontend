# Phase 7: Player Dashboard Design

## Overview

Build out the three player-facing dashboard pages: Overview (stats + chart + recent activity), Transactions (filterable table with pagination), and Transfers (full-page form with Zod validation).

## Copy Guidelines

- No em dashes in user-facing text. Rephrase to use commas, periods, or shorter sentences instead.
- Keep copy concise and direct.

## Overview Page

**Layout** (top to bottom):
1. **Stats row** (3 cards): Balance, Income this month, Expenses this month. Each shows formatted currency value + percentage change indicator.
2. **Balance trend chart**: shadcn Chart (Recharts area chart) showing balance over the last 30 days. Running balance computed from transaction history. Glass card container.
3. **Recent transactions**: Compact list of the 5 most recent transactions. Each row: type icon, description, counterparty, relative time, formatted amount (green for income). "View all" link navigates to `/dashboard/transactions`.

**Data hooks:**
- `useAccount(accountId)` wrapping `dataService.getAccount()`
- `useTransactions(accountId, filters)` wrapping `dataService.getTransactions()`

## Transactions Page

**Layout:**
1. **Page header** with title + subtitle
2. **Filter bar**: transaction type dropdown (All / Deposit / Withdrawal / Transfer In / Transfer Out), status dropdown (All / Completed / Pending / Failed). Filter state in URL search params.
3. **Transaction table**: shadcn Table with columns: Date, Description, Type (Badge), Amount (colored), Status (Badge). Sorted by date descending.
4. **Pagination**: Prev/next buttons driven by `PaginatedResponse` shape.

**Shared components:**
- `TransactionTable` reused by both Transactions page (with filters/pagination) and Overview page (compact, no filters)
- `TransactionFilters` manages filter state via URL search params

## Transfers Page

Full-page form following iPad Settings aesthetic.

**Form fields:**
- Recipient bank code (text input, e.g. "RNB")
- Recipient account number (text input)
- Amount (number input with currency prefix from config)
- Description (optional text input)

**Note:** The BWIFT system may evolve to use IBAN-style identifiers. The form fields are generic enough that swapping from bank code + account number to a single BWIFT identifier is a field change, not an architectural one.

**Validation:** Zod schema. All required except description. Amount > 0.

**Flow:** Submit -> `dataService.createTransfer()` -> success state inline (green checkmark + reference number + "Send another" link). React Query mutation with loading/error on the button.

## Skeleton Loading States

Every data-dependent section gets a matching skeleton:
- Stats cards: 3 pulsing rectangles for value/label
- Chart: skeleton rectangle matching chart aspect ratio
- Transaction table: 5-6 skeleton rows
- Transfer form: no skeleton needed (not data-fetched)

## New Files

| File | Purpose |
|---|---|
| `src/hooks/use-account.ts` | React Query hook for `getAccount()` |
| `src/hooks/use-transactions.ts` | React Query hook for `getTransactions()` with filters |
| `src/components/dashboard/stat-card.tsx` | Reusable stat card |
| `src/components/dashboard/balance-chart.tsx` | Area chart for balance trend |
| `src/components/dashboard/transaction-table.tsx` | Reusable transaction table |
| `src/components/dashboard/transaction-filters.tsx` | Filter bar |
| `src/components/dashboard/transfer-form.tsx` | Transfer form with Zod validation |
| `src/routes/dashboard/overview.tsx` | Full overview page |
| `src/routes/dashboard/transactions.tsx` | Full transactions page |
| `src/routes/dashboard/transfers.tsx` | Full transfers page |

## shadcn Components to Install

- Table
- Badge
- Chart (Recharts)

## Mock Data Changes

Expand transactions from 6 to ~15 entries spanning 30 days for meaningful chart data.
