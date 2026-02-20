# Beloitte Banking Platform - API Endpoints

**Base URL:** `{VITE_API_URL}` (default: `http://localhost:3001/api`)

**Backend Stack:** Python + FastAPI + PostgreSQL

**Auth Method:** JWT Bearer token in `Authorization` header

---

## Overview

| Priority | Domain | Endpoints | Enables |
|----------|--------|-----------|---------|
| P0 | Site Config | 2 | Landing page, WYSIWYG editor |
| P1 | Auth | 4 | Login, sessions, role switching |
| P2 | Accounts | 2 | Player dashboard |
| P3 | Transactions | 1 | Transaction history |
| P4 | Transfers | 1 | Send money flow |
| P5 | Admin | 3 | Bank management dashboard |
| P6 | Assets | 1 | Logo/favicon upload (theme editor) |

**Total: 14 endpoints**

---

## Auth Levels

- **Public** - No auth required
- **User** - Requires valid JWT (any role)
- **Admin** - Requires valid JWT with `admin` role

---

## P0 - Site Config

These endpoints power the landing page and the admin WYSIWYG site editor. They are the first endpoints needed for production.

### GET /config/{bank_id}

Fetch the complete site configuration for a bank.

| Field | Value |
|-------|-------|
| Auth | Public |
| Params | `bank_id` (path) - The bank's unique identifier |
| Response | `SiteConfig` JSON (see schema below) |
| Caching | Recommended: `Cache-Control: public, max-age=300` |

**Response example:**

```json
{
  "bankId": "demo-bank-001",
  "bankName": "Reveille National Bank",
  "bankSlug": "reveille",
  "currency": {
    "code": "RED",
    "name": "Redmont Dollars",
    "symbol": "RED $",
    "symbolPosition": "prefix"
  },
  "modules": [
    {
      "id": "mod-hero",
      "type": "hero",
      "visible": true,
      "config": {
        "headline": "Banking built for DemocracyCraft",
        "subheadline": "Secure deposits, instant transfers...",
        "ctaText": "Open an Account",
        "ctaLink": "/login",
        "showDashboardPreview": true,
        "backgroundVariant": "gradient",
        "alignment": "center"
      }
    }
  ],
  "theme": {
    "mode": "dark",
    "preset": "dark-fintech",
    "colors": {
      "background": "oklch(0.11 0.025 255)",
      "foreground": "oklch(0.985 0 0)",
      "primary": "oklch(0.62 0.20 255)",
      "primaryForeground": "oklch(0.985 0 0)",
      "secondary": "oklch(0.19 0.025 255)",
      "secondaryForeground": "oklch(0.985 0 0)",
      "muted": "oklch(0.19 0.025 255)",
      "mutedForeground": "oklch(0.65 0.03 255)",
      "accent": "oklch(0.62 0.20 255)",
      "accentForeground": "oklch(0.985 0 0)",
      "destructive": "oklch(0.577 0.245 27.325)",
      "border": "oklch(0.62 0.20 255 / 12%)",
      "input": "oklch(1 0 0 / 12%)",
      "ring": "oklch(0.62 0.20 255)",
      "card": "oklch(0.15 0.025 255)",
      "cardForeground": "oklch(0.985 0 0)",
      "popover": "oklch(0.17 0.025 255)",
      "popoverForeground": "oklch(0.985 0 0)"
    },
    "fonts": {
      "heading": "General Sans",
      "body": "Plus Jakarta Sans"
    },
    "borderRadius": "0.625rem"
  },
  "branding": {
    "logoUrl": null,
    "faviconUrl": null,
    "socialIcons": ["discord"]
  },
  "nav": {
    "showLogin": true,
    "ctaText": "Open Account",
    "ctaLink": "/login",
    "links": [
      { "label": "Features", "href": "#features" },
      { "label": "FAQ", "href": "#faq" }
    ]
  }
}
```

**DB suggestion:** Store as JSONB in a `bank_configs` table with `bank_id` as the primary key.

---

### PUT /config/{bank_id}

Save updated site configuration. Called when an admin saves changes in the WYSIWYG editor.

| Field | Value |
|-------|-------|
| Auth | Admin |
| Params | `bank_id` (path) |
| Request Body | Full `SiteConfig` JSON (same shape as GET response) |
| Response | The saved `SiteConfig` JSON |
| Validation | Validate JSON structure with Pydantic before saving |

---

## P1 - Authentication

Discord OAuth2 flow. The frontend redirects to `/auth/discord`, Discord authenticates the user, then redirects back to the callback URL with an auth code.

### GET /auth/discord

Redirect the user to Discord's OAuth2 authorization page.

| Field | Value |
|-------|-------|
| Auth | Public |
| Query Params | `redirect_uri` (optional) - Where to redirect after login |
| Response | HTTP 302 redirect to Discord OAuth2 URL |

---

### GET /auth/discord/callback

Handle the OAuth2 callback from Discord. Exchange the auth code for user info, create or find the user in the database, and return a JWT.

| Field | Value |
|-------|-------|
| Auth | Public |
| Query Params | `code` - OAuth2 authorization code from Discord |
| Response | HTTP 302 redirect to frontend with token |

The frontend expects to receive the JWT either via:
- Redirect to `/auth/callback?token={jwt}` (frontend extracts and stores it)
- Or a JSON response: `{ "accessToken": "...", "user": { ... } }`

---

### GET /auth/me

Return the currently authenticated user's profile and roles.

| Field | Value |
|-------|-------|
| Auth | User |
| Response | `Session` JSON |

**Response example:**

```json
{
  "user": {
    "id": "user-001",
    "discordId": "123456789012345678",
    "discordUsername": "EnsuiDev",
    "discordAvatar": "https://cdn.discordapp.com/avatars/...",
    "roles": ["player", "admin"]
  },
  "activeRole": "player",
  "bankId": "demo-bank-001",
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### POST /auth/logout

Invalidate the current session.

| Field | Value |
|-------|-------|
| Auth | User |
| Response | HTTP 204 No Content |

---

## P2 - Accounts

### GET /accounts/{account_id}

Fetch a specific bank account by ID.

| Field | Value |
|-------|-------|
| Auth | User (must own the account) |
| Params | `account_id` (path) |
| Response | `BankAccount` JSON |

**Response example:**

```json
{
  "id": "acc-001",
  "userId": "user-001",
  "bankId": "demo-bank-001",
  "accountNumber": "RNB-00042069",
  "balance": 15420.50,
  "currency": "RED",
  "status": "active",
  "createdAt": "2025-06-15T00:00:00Z"
}
```

**Enum values for `status`:** `active`, `frozen`, `closed`

---

### GET /accounts/me

Fetch the current user's account for this bank. Convenience endpoint so the frontend doesn't need to know the account ID upfront.

| Field | Value |
|-------|-------|
| Auth | User |
| Response | `BankAccount` JSON (same shape as above) |

---

## P3 - Transactions

### GET /accounts/{account_id}/transactions

Fetch paginated transaction history for an account.

| Field | Value |
|-------|-------|
| Auth | User (must own the account) |
| Params | `account_id` (path) |
| Query Params | `page` (default: 1), `pageSize` (default: 20), `type` (optional filter: `deposit`, `withdrawal`, `transfer_in`, `transfer_out`), `status` (optional filter: `completed`, `pending`, `failed`), `from` (optional ISO 8601 date), `to` (optional ISO 8601 date) |
| Response | `PaginatedResponse<Transaction>` |

**Response example:**

```json
{
  "data": [
    {
      "id": "tx-001",
      "accountId": "acc-001",
      "type": "deposit",
      "amount": 5000,
      "currency": "RED",
      "description": "Government salary",
      "counterparty": null,
      "reference": null,
      "status": "completed",
      "createdAt": "2026-02-15T14:30:00Z"
    },
    {
      "id": "tx-002",
      "accountId": "acc-001",
      "type": "transfer_out",
      "amount": 1200,
      "currency": "RED",
      "description": "Rent payment",
      "counterparty": "Reverie Reserve",
      "reference": "SWF-2026-00123",
      "status": "completed",
      "createdAt": "2026-02-14T09:15:00Z"
    }
  ],
  "total": 42,
  "page": 1,
  "pageSize": 20
}
```

**Enum values for `type`:** `deposit`, `withdrawal`, `transfer_in`, `transfer_out`

**Enum values for `status`:** `completed`, `pending`, `failed`

---

## P4 - Transfers

### POST /transfers

Create a new inter-bank or intra-bank transfer.

| Field | Value |
|-------|-------|
| Auth | User |
| Request Body | `TransferRequest` JSON |
| Response | The created `Transaction` JSON |

**Request example:**

```json
{
  "fromAccountId": "acc-001",
  "toBankCode": "RVR",
  "toAccountNumber": "RVR-00012345",
  "amount": 1200,
  "currency": "RED",
  "description": "Rent payment"
}
```

**Response:** A `Transaction` object with `status: "pending"` (same shape as in the transactions list above).

---

## P5 - Admin

These endpoints are used by bank administrators in the admin dashboard.

### GET /admin/bank

Fetch the current bank's details.

| Field | Value |
|-------|-------|
| Auth | Admin |
| Response | `Bank` JSON |

**Response example:**

```json
{
  "id": "demo-bank-001",
  "name": "Reveille National Bank",
  "slug": "reveille",
  "bankCode": "RNB",
  "status": "active",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

**Enum values for `status`:** `active`, `suspended`

---

### GET /admin/accounts

List all accounts in this bank (admin view).

| Field | Value |
|-------|-------|
| Auth | Admin |
| Query Params | `page` (default: 1), `pageSize` (default: 20) |
| Response | `PaginatedResponse<BankAccount>` |

---

### GET /admin/transactions

List all transactions across all accounts in this bank.

| Field | Value |
|-------|-------|
| Auth | Admin |
| Query Params | `page` (default: 1), `pageSize` (default: 20), `type` (optional), `status` (optional), `from` (optional ISO 8601), `to` (optional ISO 8601), `account_id` (optional — filter by specific account) |
| Response | `PaginatedResponse<Transaction>` |

---

## P6 - Assets

### POST /config/{bank_id}/assets

Upload a branding asset (logo or favicon). Used by the theme configurator.

| Field | Value |
|-------|-------|
| Auth | Admin |
| Params | `bank_id` (path) |
| Content-Type | `multipart/form-data` |
| Form Fields | `file` (image file, max 2MB), `type` (`logo` or `favicon`) |
| Response | `{ "url": "https://..." }` |
| Validation | Accept PNG, SVG, ICO, WEBP. Reject files > 2MB. |

**Response example:**

```json
{
  "url": "https://cdn.beloitte.com/reveille/logo.png"
}
```

**Storage suggestion:** Store in an S3-compatible bucket or local `uploads/` directory. Return the public URL. The frontend saves this URL into `SiteConfig.branding.logoUrl` or `faviconUrl` via `PUT /config/{bank_id}`.

---

## Error Responses

All error responses should use this format:

```json
{
  "statusCode": 400,
  "message": "Human-readable error description"
}
```

**Standard HTTP status codes used by the frontend:**

| Code | Meaning |
|------|---------|
| 200 | Success |
| 204 | Success, no body (used for logout) |
| 400 | Bad request / validation error |
| 401 | Not authenticated |
| 403 | Forbidden (wrong role) |
| 404 | Resource not found |
| 500 | Server error |

---

## JWT Token

The frontend sends the JWT as a Bearer token on every authenticated request:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Expected JWT payload:**

```json
{
  "sub": "user-001",
  "bank_id": "demo-bank-001",
  "roles": ["player", "admin"],
  "discord_id": "123456789012345678",
  "exp": 1740000000
}
```

---

## Database Schema (Suggested)

```sql
CREATE TABLE bank_configs (
  bank_id     TEXT PRIMARY KEY,
  config      JSONB NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now(),
  updated_by  TEXT
);

CREATE TABLE users (
  id                TEXT PRIMARY KEY,
  discord_id        TEXT UNIQUE NOT NULL,
  discord_username  TEXT NOT NULL,
  discord_avatar    TEXT,
  created_at        TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_roles (
  user_id   TEXT REFERENCES users(id),
  bank_id   TEXT REFERENCES bank_configs(bank_id),
  role      TEXT NOT NULL CHECK (role IN ('player', 'admin')),
  PRIMARY KEY (user_id, bank_id, role)
);

CREATE TABLE accounts (
  id              TEXT PRIMARY KEY,
  user_id         TEXT REFERENCES users(id),
  bank_id         TEXT REFERENCES bank_configs(bank_id),
  account_number  TEXT UNIQUE NOT NULL,
  balance         DECIMAL(15,2) NOT NULL DEFAULT 0,
  currency        TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active', 'frozen', 'closed')),
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE transactions (
  id            TEXT PRIMARY KEY,
  account_id    TEXT REFERENCES accounts(id),
  type          TEXT NOT NULL
                CHECK (type IN ('deposit', 'withdrawal', 'transfer_in', 'transfer_out')),
  amount        DECIMAL(15,2) NOT NULL,
  currency      TEXT NOT NULL,
  description   TEXT,
  counterparty  TEXT,
  reference     TEXT,
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('completed', 'pending', 'failed')),
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE banks (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  bank_code   TEXT UNIQUE NOT NULL,
  status      TEXT NOT NULL DEFAULT 'active'
              CHECK (status IN ('active', 'suspended')),
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

---

## CORS

The backend must allow CORS from the frontend origin:

```
Access-Control-Allow-Origin: https://{bank-slug}.beloitte.com
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

In development, allow `http://localhost:5173`.

---

## Notes

- All timestamps are ISO 8601 format (e.g. `2026-02-15T14:30:00Z`)
- All monetary amounts are numbers (not strings), with 2 decimal places
- The `currency` field on accounts/transactions carries the currency code (e.g. `"RED"`), matching `SiteConfig.currency.code`
- Pagination uses 1-based page numbers
- The frontend uses `camelCase` for JSON field names — FastAPI can handle this with Pydantic's `alias_generator` or `model_config = ConfigDict(alias_generator=to_camel)`
