/**
 * Mock data for development mode.
 * Realistic DemocracyCraft banking data.
 *
 * WARNING: This data must NEVER appear in production.
 * The data-service.ts layer ensures this by checking VITE_MOCK_MODE.
 */
import type { SiteConfig } from "@/lib/config/site-config-schema";
import type { BankAccount, Session, Transaction } from "./types";

export const siteConfig: SiteConfig = {
  bankId: "demo-bank-001",
  bankName: "Reveille National Bank",
  bankSlug: "reveille",
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
        ctaText: "Open an Account",
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
              "RNB made managing my business finances effortless. The transfers are instant.",
            author: "MarbleCorp",
            role: "Business Owner",
          },
          {
            quote:
              "Finally a bank that doesn't feel like it's from 2005. Clean, modern, and fast.",
            author: "SkyTrader_42",
            role: "Frequent Trader",
          },
          {
            quote:
              "The dashboard gives me everything I need at a glance. Highly recommend.",
            author: "CityMayor_DC",
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
            question: "How do I open an account?",
            answer:
              "Click 'Open an Account' and sign in with your Discord. Your account is created automatically.",
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
          "Join thousands of DemocracyCraft citizens who trust Reveille National Bank.",
        buttonText: "Get Started Today",
        buttonLink: "/login",
        variant: "banner",
      },
    },
    {
      id: "mod-footer",
      type: "footer",
      visible: true,
      config: {
        brandName: "Reveille National Bank",
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
      heading: "General Sans",
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
    ctaText: "Open Account",
    ctaLink: "/login",
    links: [
      { label: "Features", href: "#features" },
      { label: "FAQ", href: "#faq" },
    ],
  },
};

export const bankAccount: BankAccount = {
  id: "acc-001",
  userId: "user-001",
  bankId: "demo-bank-001",
  accountNumber: "RNB-00042069",
  balance: 15420.5,
  currency: siteConfig.currency.code,
  status: "active",
  createdAt: "2025-06-15T00:00:00Z",
};

export const transactions: readonly Transaction[] = [
  {
    id: "tx-001",
    accountId: "acc-001",
    type: "deposit",
    amount: 5000,
    currency: siteConfig.currency.code,
    description: "Government salary",
    status: "completed",
    createdAt: "2026-02-15T14:30:00Z",
  },
  {
    id: "tx-002",
    accountId: "acc-001",
    type: "transfer_out",
    amount: 1200,
    currency: siteConfig.currency.code,
    description: "Rent payment",
    counterparty: "Reverie Reserve",
    reference: "SWF-2026-00123",
    status: "completed",
    createdAt: "2026-02-14T09:15:00Z",
  },
  {
    id: "tx-003",
    accountId: "acc-001",
    type: "transfer_in",
    amount: 3200,
    currency: siteConfig.currency.code,
    description: "Business income - MarbleCorp invoice",
    counterparty: "First National DC",
    reference: "SWF-2026-00118",
    status: "completed",
    createdAt: "2026-02-13T16:45:00Z",
  },
  {
    id: "tx-004",
    accountId: "acc-001",
    type: "withdrawal",
    amount: 500,
    currency: siteConfig.currency.code,
    description: "ATM withdrawal",
    status: "completed",
    createdAt: "2026-02-12T11:00:00Z",
  },
  {
    id: "tx-005",
    accountId: "acc-001",
    type: "deposit",
    amount: 10000,
    currency: siteConfig.currency.code,
    description: "Property sale proceeds",
    status: "completed",
    createdAt: "2026-02-10T08:20:00Z",
  },
  {
    id: "tx-006",
    accountId: "acc-001",
    type: "transfer_out",
    amount: 750,
    currency: siteConfig.currency.code,
    description: "Utility payment - DemocracyCraft Power Co",
    counterparty: "DC Utilities Bank",
    reference: "SWF-2026-00099",
    status: "pending",
    createdAt: "2026-02-09T13:10:00Z",
  },
] as const;

export const session: Session = {
  user: {
    id: "user-001",
    discordId: "123456789012345678",
    discordUsername: "EnsuiDev",
    discordAvatar:
      "https://cdn.discordapp.com/embed/avatars/0.png",
    roles: ["player", "admin"],
  },
  activeRole: "player",
  bankId: "demo-bank-001",
  accessToken: "mock-jwt-token-for-development",
};

export const pendingTransaction: Transaction = {
  id: "tx-pending-001",
  accountId: "acc-001",
  type: "transfer_out",
  amount: 0,
  currency: siteConfig.currency.code,
  description: "Pending transfer",
  status: "pending",
  createdAt: new Date().toISOString(),
};
