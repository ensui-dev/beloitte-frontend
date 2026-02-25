/**
 * Mock data for development mode.
 * Realistic DemocracyCraft banking data.
 *
 * WARNING: This data must NEVER appear in production.
 * The data-service.ts layer ensures this by checking VITE_MOCK_MODE.
 */
import type { ModuleInstance, SiteConfig } from "@/lib/config/site-config-schema";
import type { AccountAuthorizedUser, AccountBusinessSummary, AccountSearchFilters, AccountTypeSummary, AccountUserSummary, ActivityEvent, AdminStats, Bank, BankAccount, BankWideTransactionFilters, PaginatedResponse, Session, Transaction, TransactionAccountSummary, TransactionInitiator, TransactionTypeSummary, VolumeDataPoint } from "./types";

export const siteConfig: SiteConfig = {
  bankId: "demo-bank-001",
  bankName: "Beloitte Banking",
  bankSlug: "beloitte",
  currency: {
    code: "RED",
    name: "Redmont Dollars",
    symbol: "RED $",
    symbolPosition: "prefix",
  },
  modules: [
    {
      id: "mod-hero",
      type: "hero",
      visible: true,
      config: {
        headline: "Banking built for DemocracyCraft",
        subheadline:
          "Secure deposits, instant transfers, and full transparency. Your finances, modernized.",
        ctaText: "Get Started with Discord",
        ctaLink: "/login",
        secondaryCtaText: "For Businesses",
        secondaryCtaLink: "/login?intent=business",
        showDashboardPreview: true,
        backgroundVariant: "gradient",
        alignment: "center",
      },
    },
    {
      id: "mod-features",
      type: "features",
      visible: true,
      config: {
        heading: "Everything you need. Nothing you don't.",
        subheading:
          "Built from the ground up for the DemocracyCraft economy.",
        features: [
          {
            title: "Instant Transfers",
            description:
              "Send funds to any bank in the network instantly via the BWIFT system.",
            icon: "Zap",
          },
          {
            title: "Real-Time Balance",
            description:
              "See your balance update the moment a transaction completes. No waiting.",
            icon: "Activity",
          },
          {
            title: "Secure by Design",
            description:
              "Discord SSO authentication ensures only you can access your account.",
            icon: "Shield",
          },
          {
            title: "Transaction History",
            description:
              "Full audit trail of every deposit, withdrawal, and transfer.",
            icon: "FileText",
          },
          {
            title: "Multi-Bank Support",
            description:
              "Transfer between any bank in the DemocracyCraft network seamlessly.",
            icon: "Globe",
          },
          {
            title: "Dashboard Analytics",
            description:
              "Visual breakdowns of your spending, income, and account health.",
            icon: "BarChart3",
          },
        ],
        layout: "grid-3",
      },
    },
    {
      id: "mod-testimonials",
      type: "testimonials",
      visible: true,
      config: {
        heading: "Trusted by the community",
        testimonials: [
          {
            quote:
              "Beloitte made managing my business finances effortless. The transfers are instant.",
            author: "MarbleCorp",
            avatar: "https://media.licdn.com/dms/image/v2/D4E22AQFSMt_xcHSuOA/feedshare-shrink_800/B4EZbOp16CHIAo-/0/1747223798241?e=2147483647&v=beta&t=mzRhon8wKOxEjEANUiIhkSryi7O9PO6dAz3pQQ-A2eM",
            role: "Business Owner",
          },
          {
            quote:
              "Finally a bank that doesn't feel like it's from 2005. Clean, modern, and fast.",
            author: "SkyTrader_42",
            avatar: "https://i.pinimg.com/736x/18/88/db/1888dbfd156722944399fa530be519c9.jpg",
            role: "Frequent Trader",
          },
          {
            quote:
              "The dashboard gives me everything I need at a glance. Highly recommend.",
              author: "CityMayor_DC",
              avatar: "https://s.namemc.com/3d/skin/body.png?id=8019c1b57762fc6c&model=classic&width=308&height=308",
            role: "Government Official",
          },
        ],
      },
    },
    {
      id: "mod-faq",
      type: "faq",
      visible: true,
      config: {
        heading: "Frequently Asked Questions",
        items: [
          {
            question: "How do I create an account?",
            answer:
              "Click 'Get Started' and sign in. If you're new, your account is created automatically.",
          },
          {
            question: "Are inter-bank transfers supported?",
            answer:
              "Yes! We use the BWIFT network to transfer funds between any participating bank instantly.",
          },
          {
            question: "Is my money safe?",
            answer:
              "All transactions are logged and auditable. Your account is protected by Discord SSO authentication.",
          },
          {
            question: "What currencies do you support?",
            answer:
              "We support Redmont Dollars (RED $), the official DemocracyCraft currency.",
          }, 
        ],
      },
    },
    {
      id: "mod-cta",
      type: "cta",
      visible: true,
      config: {
        heading: "Ready to modernize your banking?",
        description:
          "Join thousands of DemocracyCraft citizens who bank with Beloitte.",
        buttonText: "Get Started",
        buttonLink: "/login",
        variant: "banner",
      },
    },
    {
      id: "mod-footer",
      type: "footer",
      visible: true,
      config: {
        brandName: "Beloitte Banking",
        tagline: "Modern banking for DemocracyCraft",
        copyrightYear: "2026",
        links: [
          { label: "Privacy Policy", url: "/privacy" },
          { label: "Terms of Service", url: "/terms" },
          { label: "Contact", url: "/contact" },
        ],
      },
    },
  ],
  theme: {
    mode: "dark",
    preset: "dark-fintech",
    colors: {
      background: "oklch(0.11 0.025 255)",
      foreground: "oklch(0.985 0 0)",
      primary: "oklch(0.62 0.20 255)",
      primaryForeground: "oklch(0.985 0 0)",
      secondary: "oklch(0.19 0.025 255)",
      secondaryForeground: "oklch(0.985 0 0)",
      muted: "oklch(0.19 0.025 255)",
      mutedForeground: "oklch(0.65 0.03 255)",
      accent: "oklch(0.62 0.20 255)",
      accentForeground: "oklch(0.985 0 0)",
      destructive: "oklch(0.577 0.245 27.325)",
      border: "oklch(0.62 0.20 255 / 12%)",
      input: "oklch(1 0 0 / 12%)",
      ring: "oklch(0.62 0.20 255)",
      card: "oklch(0.15 0.025 255)",
      cardForeground: "oklch(0.985 0 0)",
      popover: "oklch(0.17 0.025 255)",
      popoverForeground: "oklch(0.985 0 0)",
    },
    fonts: {
      heading: "Inter",
      body: "Plus Jakarta Sans",
    },
    borderRadius: "0.625rem",
  },
  branding: {
    logoUrl: undefined,
    faviconUrl: undefined,
    socialIcons: ["discord"],
  },
  nav: {
    showLogin: true,
    ctaText: "Sign up",
    ctaLink: "/login",
    links: [
      { label: "Business", href: "/login?intent=business" },
    ],
  },
  verificationChannelName: "#deposit-here",
  gameBusinessName: "Beloitte",
  tosText: "",
};

// ─── Reusable mock sub-objects ────────────────────────────────

const mockPersonalChecking: AccountTypeSummary = {
  id: 1,
  category: { id: 1, categoryName: "personal" },
  typeName: "personal_checking",
  interestRate: 0.01,
  minBalance: 0,
  monthlyFee: 0,
  withdrawalLimitDaily: 10000,
  transferLimitDaily: 25000,
  requiresBusinessEntity: false,
};

const mockBusiness_CHECKING: AccountTypeSummary = {
  id: 3,
  category: { id: 2, categoryName: "business" },
  typeName: "business_checking",
  interestRate: 0.005,
  minBalance: 100,
  monthlyFee: 5,
  withdrawalLimitDaily: 50000,
  transferLimitDaily: 100000,
  requiresBusinessEntity: true,
};

export const mockOwner: AccountUserSummary = {
  id: 1,
  discordId: "123456789012345678",
  discordUsername: "EnsuiDev",
  discordAvatar: null,
  displayName: "EnsuiDev",
  kycVerified: true,
  isActive: true,
  suspendedAt: null,
  suspensionReason: null,
};

export const mockBusiness: AccountBusinessSummary = {
  id: 1,
  businessName: "Ensui Enterprises",
  businessType: "LLC",
  docRegistered: true,
  registeredAt: "2025-07-20T00:00:00Z",
  isActive: true,
};

const mockAuthorizedUser: AccountAuthorizedUser = {
  id: 1,
  user: {
    id: 2,
    discordId: "987654321098765432",
    discordUsername: "NickTheDev",
    discordAvatar: null,
    displayName: "nick!",
    kycVerified: true,
    isActive: true,
    suspendedAt: null,
    suspensionReason: null,
  },
  permissionLevel: "transact",
  grantedAt: "2025-08-15T00:00:00Z",
  revokedAt: null,
};

// ─── Multi-account mock data ──────────────────────────────────
// The existing user has two accounts: a personal and a business.

export const bankAccounts: readonly BankAccount[] = [
  {
    id: 1,
    iban: "DC18BELT003819DZ5F57SI",
    accountType: mockPersonalChecking,
    user: mockOwner,
    business: null,
    authorizedUsers: [],
    balance: 15420.5,
    nickname: "EnsuiDev",
    status: "active",
    openedAt: "2025-06-15T00:00:00Z",
    closedAt: null,
  },
  {
    id: 2,
    iban: "DC06BELT006HIRYAVR9IHR",
    accountType: mockBusiness_CHECKING,
    user: null,
    business: mockBusiness,
    authorizedUsers: [mockAuthorizedUser],
    balance: 45000,
    nickname: "Ensui Enterprises",
    status: "active",
    openedAt: "2025-08-01T00:00:00Z",
    closedAt: null,
  },
] as const;

/** @deprecated Use bankAccounts[0] — kept for backward compat during migration. */
export const bankAccount: BankAccount = bankAccounts[0];

// ─── Bank-wide accounts (all customers) ──────────────────────
// Includes the current user's accounts + accounts from other customers.
// Used by accountant (read-only) and teller (operational) views.

const otherOwner1: AccountUserSummary = {
  id: 3,
  discordId: "111222333444555666",
  discordUsername: "SkyTrader_42",
  discordAvatar: null,
  displayName: "SkyTrader",
  kycVerified: true,
  isActive: true,
  suspendedAt: null,
  suspensionReason: null,
};

const otherOwner2: AccountUserSummary = {
  id: 4,
  discordId: "222333444555666777",
  discordUsername: "CityMayor_DC",
  discordAvatar: null,
  displayName: "Mayor Johnson",
  kycVerified: true,
  isActive: true,
  suspendedAt: null,
  suspensionReason: null,
};

const otherOwner3: AccountUserSummary = {
  id: 5,
  discordId: "333444555666777888",
  discordUsername: "RedmontRose",
  discordAvatar: null,
  displayName: "Rose",
  kycVerified: false,
  isActive: true,
  suspendedAt: null,
  suspensionReason: null,
};

const otherBusiness: AccountBusinessSummary = {
  id: 2,
  businessName: "MarbleCorp Industries",
  businessType: "corporation",
  docRegistered: true,
  registeredAt: "2025-03-10T00:00:00Z",
  isActive: true,
};

export const allBankAccounts: readonly BankAccount[] = [
  ...bankAccounts,
  {
    id: 3,
    iban: "DC94BELT00R4QFGY8KUXI2",
    accountType: mockPersonalChecking,
    user: otherOwner1,
    business: null,
    authorizedUsers: [],
    balance: 8234.75,
    nickname: "SkyTrader Main",
    status: "active",
    openedAt: "2025-07-20T00:00:00Z",
    closedAt: null,
  },
  {
    id: 4,
    iban: "DC79BELT00Y1KNTP6LVZR8",
    accountType: mockPersonalChecking,
    user: otherOwner2,
    business: null,
    authorizedUsers: [],
    balance: 32100.00,
    nickname: "Mayor's Account",
    status: "active",
    openedAt: "2025-05-01T00:00:00Z",
    closedAt: null,
  },
  {
    id: 5,
    iban: "DC54BELT00ZWA93HMXD7F1",
    accountType: mockBusiness_CHECKING,
    user: null,
    business: otherBusiness,
    authorizedUsers: [],
    balance: 125750.00,
    nickname: "MarbleCorp Ops",
    status: "active",
    openedAt: "2025-03-15T00:00:00Z",
    closedAt: null,
  },
  {
    id: 6,
    iban: "DC71BELT005E1P2K9NRVT4",
    accountType: mockPersonalChecking,
    user: otherOwner3,
    business: null,
    authorizedUsers: [],
    balance: 0,
    nickname: null,
    status: "frozen",
    openedAt: "2025-11-10T00:00:00Z",
    closedAt: null,
  },
  {
    id: 7,
    iban: "DC30BELT00M8HXJC3QWUY6",
    accountType: mockPersonalChecking,
    user: otherOwner1,
    business: null,
    authorizedUsers: [],
    balance: 1200.50,
    nickname: "Savings",
    status: "active",
    openedAt: "2025-09-01T00:00:00Z",
    closedAt: null,
  },
];

// ─── Transaction Type Summaries (mirror backend transaction_types table) ──
const TX_DEPOSIT: TransactionTypeSummary = { id: 1, typeCode: "deposit", affectsBalance: "credit" };
const TX_WITHDRAWAL: TransactionTypeSummary = { id: 2, typeCode: "withdrawal", affectsBalance: "debit" };
const TX_TRANSFER_OUT: TransactionTypeSummary = { id: 3, typeCode: "transfer_out", affectsBalance: "debit" };
const TX_TRANSFER_IN: TransactionTypeSummary = { id: 4, typeCode: "transfer_in", affectsBalance: "credit" };

const MOCK_ACCOUNT: TransactionAccountSummary = { id: 1, iban: "DC18BELT003819DZ5F57SI", nickname: "EnsuiDev" };
const MOCK_INITIATOR: TransactionInitiator = { id: 1, discordId: "123456789012345678", discordUsername: "EnsuiDev" };

export const transactions: readonly Transaction[] = [
  {
    id: 1,
    account: MOCK_ACCOUNT,
    transactionType: TX_DEPOSIT,
    initiatedBy: MOCK_INITIATOR,
    amount: 5000,
    balanceBefore: 10420.50,
    balanceAfter: 15420.50,
    description: "Government salary",
    referenceId: null,
    status: "posted",
    transactedAt: "2026-02-21T14:30:00Z",
    postedAt: "2026-02-21T14:30:05Z",
  },
  {
    id: 2,
    account: MOCK_ACCOUNT,
    transactionType: TX_TRANSFER_OUT,
    initiatedBy: MOCK_INITIATOR,
    amount: 1200,
    balanceBefore: 11620.50,
    balanceAfter: 10420.50,
    description: "Rent payment — Reverie Reserve",
    referenceId: 123,
    status: "posted",
    transactedAt: "2026-02-19T09:15:00Z",
    postedAt: "2026-02-19T09:15:03Z",
  },
  {
    id: 3,
    account: MOCK_ACCOUNT,
    transactionType: TX_TRANSFER_IN,
    initiatedBy: MOCK_INITIATOR,
    amount: 3200,
    balanceBefore: 8420.50,
    balanceAfter: 11620.50,
    description: "Business income, MarbleCorp invoice",
    referenceId: 118,
    status: "posted",
    transactedAt: "2026-02-17T16:45:00Z",
    postedAt: "2026-02-17T16:45:02Z",
  },
  {
    id: 4,
    account: MOCK_ACCOUNT,
    transactionType: TX_WITHDRAWAL,
    initiatedBy: MOCK_INITIATOR,
    amount: 500,
    balanceBefore: 8920.50,
    balanceAfter: 8420.50,
    description: "Shop purchase, building supplies",
    referenceId: null,
    status: "posted",
    transactedAt: "2026-02-15T11:00:00Z",
    postedAt: "2026-02-15T11:00:01Z",
  },
  {
    id: 5,
    account: MOCK_ACCOUNT,
    transactionType: TX_DEPOSIT,
    initiatedBy: MOCK_INITIATOR,
    amount: 10000,
    balanceBefore: -1079.50,
    balanceAfter: 8920.50,
    description: "Property sale proceeds",
    referenceId: null,
    status: "posted",
    transactedAt: "2026-02-13T08:20:00Z",
    postedAt: "2026-02-13T08:20:04Z",
  },
  {
    id: 6,
    account: MOCK_ACCOUNT,
    transactionType: TX_TRANSFER_OUT,
    initiatedBy: MOCK_INITIATOR,
    amount: 750,
    balanceBefore: -329.50,
    balanceAfter: -1079.50,
    description: "Utility payment, DemocracyCraft Power Co",
    referenceId: 99,
    status: "pending",
    transactedAt: "2026-02-12T13:10:00Z",
    postedAt: null,
  },
  {
    id: 7,
    account: MOCK_ACCOUNT,
    transactionType: TX_DEPOSIT,
    initiatedBy: MOCK_INITIATOR,
    amount: 2500,
    balanceBefore: -2829.50,
    balanceAfter: -329.50,
    description: "Freelance payment, SkyTrader_42",
    referenceId: null,
    status: "posted",
    transactedAt: "2026-02-10T10:00:00Z",
    postedAt: "2026-02-10T10:00:02Z",
  },
  {
    id: 8,
    account: MOCK_ACCOUNT,
    transactionType: TX_TRANSFER_OUT,
    initiatedBy: MOCK_INITIATOR,
    amount: 300,
    balanceBefore: -2529.50,
    balanceAfter: -2829.50,
    description: "Market purchase, building materials",
    referenceId: 85,
    status: "posted",
    transactedAt: "2026-02-08T15:30:00Z",
    postedAt: "2026-02-08T15:30:01Z",
  },
  {
    id: 9,
    account: MOCK_ACCOUNT,
    transactionType: TX_TRANSFER_IN,
    initiatedBy: MOCK_INITIATOR,
    amount: 1800,
    balanceBefore: -4329.50,
    balanceAfter: -2529.50,
    description: "Tax refund — DC Treasury",
    referenceId: 72,
    status: "posted",
    transactedAt: "2026-02-05T09:45:00Z",
    postedAt: "2026-02-05T09:45:03Z",
  },
  {
    id: 10,
    account: MOCK_ACCOUNT,
    transactionType: TX_WITHDRAWAL,
    initiatedBy: MOCK_INITIATOR,
    amount: 150,
    balanceBefore: -4179.50,
    balanceAfter: -4329.50,
    description: "Donation to DC Community Fund",
    referenceId: null,
    status: "posted",
    transactedAt: "2026-02-03T14:20:00Z",
    postedAt: "2026-02-03T14:20:01Z",
  },
  {
    id: 11,
    account: MOCK_ACCOUNT,
    transactionType: TX_DEPOSIT,
    initiatedBy: MOCK_INITIATOR,
    amount: 5000,
    balanceBefore: -9179.50,
    balanceAfter: -4179.50,
    description: "Government salary",
    referenceId: null,
    status: "posted",
    transactedAt: "2026-02-01T14:30:00Z",
    postedAt: "2026-02-01T14:30:02Z",
  },
  {
    id: 12,
    account: MOCK_ACCOUNT,
    transactionType: TX_TRANSFER_OUT,
    initiatedBy: MOCK_INITIATOR,
    amount: 2000,
    balanceBefore: -7179.50,
    balanceAfter: -9179.50,
    description: "Business supplies, CityMayor_DC",
    referenceId: 55,
    status: "posted",
    transactedAt: "2026-01-30T11:15:00Z",
    postedAt: "2026-01-30T11:15:04Z",
  },
  {
    id: 13,
    account: MOCK_ACCOUNT,
    transactionType: TX_TRANSFER_IN,
    initiatedBy: MOCK_INITIATOR,
    amount: 4500,
    balanceBefore: -11679.50,
    balanceAfter: -7179.50,
    description: "Contract payment, city renovation project",
    referenceId: 48,
    status: "posted",
    transactedAt: "2026-01-27T16:00:00Z",
    postedAt: "2026-01-27T16:00:03Z",
  },
  {
    id: 14,
    account: MOCK_ACCOUNT,
    transactionType: TX_WITHDRAWAL,
    initiatedBy: MOCK_INITIATOR,
    amount: 800,
    balanceBefore: -11679.50,
    balanceAfter: -11679.50,
    description: "Plot purchase payment",
    referenceId: null,
    status: "failed",
    transactedAt: "2026-01-25T10:30:00Z",
    postedAt: null,
  },
  {
    id: 15,
    account: MOCK_ACCOUNT,
    transactionType: TX_DEPOSIT,
    initiatedBy: MOCK_INITIATOR,
    amount: 1500,
    balanceBefore: -13179.50,
    balanceAfter: -11679.50,
    description: "Auction proceeds, rare items",
    referenceId: null,
    status: "posted",
    transactedAt: "2026-01-23T13:45:00Z",
    postedAt: "2026-01-23T13:45:02Z",
  },
];

export const session: Session = {
  user: {
    id: "user-001",
    discordId: "123456789012345678",
    discordUsername: "EnsuiDev",
    discordAvatar:
      "https://cdn.discordapp.com/embed/avatars/0.png",
    roles: ["customer", "teller", "accountant", "admin"],
  },
  activeRole: "customer",
  bankId: "demo-bank-001",
  accessToken: "mock-jwt-token-for-development",
  hasAccounts: true,
  hasVerifiedAccounts: true,
};

/** Session for a brand-new user who hasn't set up any accounts yet. */
export const newUserSession: Session = {
  user: {
    id: "user-002",
    discordId: "987654321098765432",
    discordUsername: "NewPlayer",
    discordAvatar:
      "https://cdn.discordapp.com/embed/avatars/1.png",
    roles: ["customer"],
  },
  activeRole: "customer",
  bankId: "demo-bank-001",
  accessToken: "mock-jwt-token-new-user",
  hasAccounts: false,
  hasVerifiedAccounts: false,
};

export const pendingTransaction: Transaction = {
  id: 9001,
  account: MOCK_ACCOUNT,
  transactionType: TX_TRANSFER_OUT,
  initiatedBy: MOCK_INITIATOR,
  amount: 0,
  balanceBefore: 0,
  balanceAfter: 0,
  description: "Pending transfer",
  referenceId: null,
  status: "pending",
  transactedAt: new Date().toISOString(),
  postedAt: null,
};

export const pendingWithdrawal: Transaction = {
  id: 9002,
  account: MOCK_ACCOUNT,
  transactionType: TX_WITHDRAWAL,
  initiatedBy: MOCK_INITIATOR,
  amount: 0,
  balanceBefore: 0,
  balanceAfter: 0,
  description: "Pending withdrawal",
  referenceId: null,
  status: "pending",
  transactedAt: new Date().toISOString(),
  postedAt: null,
};

export const bwiftHealth: import("./types").BwiftHealth = {
  status: "operational",
  latencyMs: 42,
  lastChecked: new Date().toISOString(),
};

export const backendHealth: import("./types").BackendHealth = {
  status: "ok",
  version: "1.0.0-mock",
  uptime: 86400,
};

/** Apply filters to mock transactions (simulates server-side filtering). */
export function getFilteredTransactions(
  filters: import("./types").TransactionFilters
): PaginatedResponse<Transaction> {
  const pageSize = filters.pageSize ?? 10;
  const page = filters.page ?? 1;

  let filtered: readonly Transaction[] = transactions;

  if (filters.transactionType) {
    filtered = filtered.filter((tx) => tx.transactionType.typeCode === filters.transactionType);
  }
  if (filters.status) {
    filtered = filtered.filter((tx) => tx.status === filters.status);
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, pageSize };
}

// ─── Bank-wide transactions (all accounts) ──────────────────
// Merges the current user's transactions with transactions from other accounts.

const ACCT_SKY: TransactionAccountSummary = { id: 3, iban: "DC94BELT00R4QFGY8KUXI2", nickname: "SkyTrader Main" };
const ACCT_MAYOR: TransactionAccountSummary = { id: 4, iban: "DC79BELT00Y1KNTP6LVZR8", nickname: "Mayor's Account" };
const ACCT_MARBLE: TransactionAccountSummary = { id: 5, iban: "DC54BELT00ZWA93HMXD7F1", nickname: "MarbleCorp Ops" };
const INIT_SKY: TransactionInitiator = { id: 3, discordId: "111222333444555666", discordUsername: "SkyTrader_42" };
const INIT_MAYOR: TransactionInitiator = { id: 4, discordId: "222333444555666777", discordUsername: "CityMayor_DC" };

const otherTransactions: readonly Transaction[] = [
  {
    id: 101,
    account: ACCT_SKY,
    transactionType: TX_DEPOSIT,
    initiatedBy: INIT_SKY,
    amount: 2500,
    balanceBefore: 5734.75,
    balanceAfter: 8234.75,
    description: "Market stall income",
    referenceId: null,
    status: "posted",
    transactedAt: "2026-02-22T10:15:00Z",
    postedAt: "2026-02-22T10:15:02Z",
  },
  {
    id: 102,
    account: ACCT_MAYOR,
    transactionType: TX_TRANSFER_OUT,
    initiatedBy: INIT_MAYOR,
    amount: 5000,
    balanceBefore: 37100.00,
    balanceAfter: 32100.00,
    description: "City infrastructure payment",
    referenceId: 201,
    status: "posted",
    transactedAt: "2026-02-21T09:00:00Z",
    postedAt: "2026-02-21T09:00:04Z",
  },
  {
    id: 103,
    account: ACCT_MARBLE,
    transactionType: TX_DEPOSIT,
    initiatedBy: INIT_SKY,
    amount: 15000,
    balanceBefore: 110750.00,
    balanceAfter: 125750.00,
    description: "Quarterly revenue deposit",
    referenceId: null,
    status: "posted",
    transactedAt: "2026-02-20T14:00:00Z",
    postedAt: "2026-02-20T14:00:01Z",
  },
  {
    id: 104,
    account: ACCT_SKY,
    transactionType: TX_WITHDRAWAL,
    initiatedBy: INIT_SKY,
    amount: 400,
    balanceBefore: 6134.75,
    balanceAfter: 5734.75,
    description: "Supply purchase, redwood planks",
    referenceId: null,
    status: "posted",
    transactedAt: "2026-02-18T11:30:00Z",
    postedAt: "2026-02-18T11:30:01Z",
  },
  {
    id: 105,
    account: ACCT_MAYOR,
    transactionType: TX_DEPOSIT,
    initiatedBy: INIT_MAYOR,
    amount: 12000,
    balanceBefore: 25100.00,
    balanceAfter: 37100.00,
    description: "Government salary",
    referenceId: null,
    status: "posted",
    transactedAt: "2026-02-15T14:30:00Z",
    postedAt: "2026-02-15T14:30:03Z",
  },
  {
    id: 106,
    account: ACCT_MARBLE,
    transactionType: TX_TRANSFER_OUT,
    initiatedBy: INIT_SKY,
    amount: 8000,
    balanceBefore: 118750.00,
    balanceAfter: 110750.00,
    description: "Payroll disbursement",
    referenceId: 195,
    status: "posted",
    transactedAt: "2026-02-14T16:00:00Z",
    postedAt: "2026-02-14T16:00:02Z",
  },
];

export const allBankTransactions: readonly Transaction[] = [
  ...transactions,
  ...otherTransactions,
].sort((a, b) => new Date(b.transactedAt).getTime() - new Date(a.transactedAt).getTime());

/** Filter bank-wide accounts with search and pagination. */
export function getFilteredAccounts(
  filters: AccountSearchFilters
): PaginatedResponse<BankAccount> {
  const pageSize = filters.pageSize ?? 10;
  const page = filters.page ?? 1;
  let filtered: readonly BankAccount[] = allBankAccounts;

  if (filters.query) {
    const q = filters.query.toLowerCase();
    filtered = filtered.filter(
      (a) =>
        a.iban.toLowerCase().includes(q) ||
        (a.nickname?.toLowerCase().includes(q) ?? false) ||
        (a.user?.discordUsername.toLowerCase().includes(q) ?? false) ||
        (a.user?.displayName?.toLowerCase().includes(q) ?? false) ||
        (a.business?.businessName.toLowerCase().includes(q) ?? false)
    );
  }
  if (filters.status) {
    filtered = filtered.filter((a) => a.status === filters.status);
  }
  if (filters.category) {
    filtered = filtered.filter(
      (a) => a.accountType.category.categoryName === filters.category
    );
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);
  return { data, total, page, pageSize };
}

/** Filter bank-wide transactions with search and pagination. */
export function getFilteredBankTransactions(
  filters: BankWideTransactionFilters
): PaginatedResponse<Transaction> {
  const pageSize = filters.pageSize ?? 10;
  const page = filters.page ?? 1;
  let filtered: readonly Transaction[] = allBankTransactions;

  if (filters.query) {
    const q = filters.query.toLowerCase();
    filtered = filtered.filter(
      (tx) =>
        (tx.description?.toLowerCase().includes(q) ?? false) ||
        tx.account.iban.toLowerCase().includes(q) ||
        (tx.account.nickname?.toLowerCase().includes(q) ?? false) ||
        tx.initiatedBy.discordUsername.toLowerCase().includes(q)
    );
  }
  if (filters.transactionType) {
    filtered = filtered.filter((tx) => tx.transactionType.typeCode === filters.transactionType);
  }
  if (filters.status) {
    filtered = filtered.filter((tx) => tx.status === filters.status);
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);
  return { data, total, page, pageSize };
}

// ─── Default Module Templates ─────────────────────────────────
// Used by the setup wizard to generate a functional landing page
// with the bank's name injected into module content.

/**
 * Generate default landing page modules for a newly configured bank.
 * Creates hero + features + footer with the bank name woven in.
 */
export function defaultModules(bankName: string): ModuleInstance[] {
  return [
    {
      id: "mod-hero",
      type: "hero",
      visible: true,
      config: {
        headline: `Welcome to ${bankName}`,
        subheadline:
          "Secure deposits, instant transfers, and full transparency. Your finances, modernized.",
        ctaText: "Get Started with Discord",
        ctaLink: "/login",
        showDashboardPreview: true,
        backgroundVariant: "gradient",
        alignment: "center",
      },
    },
    {
      id: "mod-features",
      type: "features",
      visible: true,
      config: {
        heading: "Everything you need. Nothing you don't.",
        subheading: "Built from the ground up for the DemocracyCraft economy.",
        features: [
          {
            title: "Instant Transfers",
            description:
              "Send funds to any bank in the network instantly via the BWIFT system.",
            icon: "Zap",
          },
          {
            title: "Real-Time Balance",
            description:
              "See your balance update the moment a transaction completes. No waiting.",
            icon: "Activity",
          },
          {
            title: "Secure by Design",
            description:
              "Discord SSO authentication ensures only you can access your account.",
            icon: "Shield",
          },
        ],
        layout: "grid-3",
      },
    },
    {
      id: "mod-footer",
      type: "footer",
      visible: true,
      config: {
        brandName: bankName,
        tagline: `Modern banking powered by ${bankName}`,
        copyrightYear: new Date().getFullYear().toString(),
        links: [
          { label: "Privacy Policy", url: "/privacy" },
          { label: "Terms of Service", url: "/terms" },
        ],
      },
    },
  ];
}

// ─── Admin Data ──────────────────────────────────────────────

export const bank: Bank = {
  id: "demo-bank-001",
  name: "Beloitte Banking",
  slug: "beloitte",
  bankCode: "BELT",
  status: "active",
  createdAt: "2025-01-01T00:00:00Z",
};

export const adminStats: AdminStats = {
  totalAccounts: 247,
  totalBalance: 1_843_290.5,
  totalTransactions: 12_847,
  activeAccountsChange: 8.3,
  balanceChange: 12.7,
  transactionsChange: -2.1,
};

/** 30 days of mock transaction volume data. */
export const volumeHistory: readonly VolumeDataPoint[] = (() => {
  const points: VolumeDataPoint[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split("T")[0];

    // Weekdays get more volume, weekends less
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const base = isWeekend ? 0.5 : 1;

    points.push({
      date: dateKey,
      deposits: Math.round((3000 + Math.random() * 5000) * base),
      withdrawals: Math.round((1500 + Math.random() * 3000) * base),
      transfers: Math.round((2000 + Math.random() * 4000) * base),
    });
  }

  return points;
})();

export const activityFeed: readonly ActivityEvent[] = [
  {
    id: "evt-001",
    type: "account_created",
    description: "New business account opened: MarbleCorp Trading",
    actor: "MarbleCorp",
    createdAt: "2026-02-23T09:15:00Z",
  },
  {
    id: "evt-002",
    type: "transfer",
    description: "Large transfer: RED $25,000 to First National DC",
    actor: "EnsuiDev",
    createdAt: "2026-02-23T08:42:00Z",
  },
  {
    id: "evt-003",
    type: "deposit",
    description: "Government payroll batch: 15 deposits processed",
    actor: "System",
    createdAt: "2026-02-22T14:00:00Z",
  },
  {
    id: "evt-004",
    type: "config_change",
    description: "Site theme updated to dark-fintech preset",
    actor: "EnsuiDev",
    createdAt: "2026-02-22T11:30:00Z",
  },
  {
    id: "evt-005",
    type: "account_created",
    description: "New personal account opened",
    actor: "SkyTrader_42",
    createdAt: "2026-02-21T16:20:00Z",
  },
  {
    id: "evt-006",
    type: "withdrawal",
    description: "Withdrawal: RED $5,000 from Ensui Enterprises",
    actor: "EnsuiDev",
    createdAt: "2026-02-21T10:05:00Z",
  },
  {
    id: "evt-007",
    type: "transfer",
    description: "Inter-bank transfer via BWIFT: RED $8,500",
    actor: "CityMayor_DC",
    createdAt: "2026-02-20T15:45:00Z",
  },
  {
    id: "evt-008",
    type: "config_change",
    description: "Navigation links updated",
    actor: "EnsuiDev",
    createdAt: "2026-02-20T09:00:00Z",
  },
];
