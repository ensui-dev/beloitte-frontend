/**
 * Zod schemas for the complete site configuration JSON.
 * This is the single source of truth for landing page structure,
 * theme, branding, and navigation.
 *
 * Types are derived from schemas via z.infer — never defined separately.
 */
import { z } from "zod";

// ─── Module Config Schemas ─────────────────────────────────────

export const heroConfigSchema = z.object({
  headline: z.string().min(1).default("Welcome to Your Bank"),
  subheadline: z.string().default("Modern banking, simplified."),
  ctaText: z.string().min(1).default("Get Started"),
  ctaLink: z.string().min(1).default("/login"),
  showDashboardPreview: z.boolean().default(true),
  backgroundVariant: z
    .enum(["gradient", "image", "particles"])
    .default("gradient"),
  backgroundImage: z.string().optional(),
  alignment: z.enum(["left", "center"]).default("left"),
});
export type HeroConfig = z.infer<typeof heroConfigSchema>;

export const featuresConfigSchema = z.object({
  heading: z.string().min(1).default("Everything you need"),
  subheading: z.string().optional(),
  features: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        icon: z.string().min(1),
      })
    )
    .default([]),
  layout: z.enum(["grid-3", "grid-2", "list"]).default("grid-3"),
});
export type FeaturesConfig = z.infer<typeof featuresConfigSchema>;

export const imageCarouselConfigSchema = z.object({
  images: z
    .array(
      z.object({
        src: z.string().min(1),
        alt: z.string().min(1),
        caption: z.string().optional(),
      })
    )
    .default([]),
  autoPlay: z.boolean().default(true),
  interval: z.number().min(1000).default(5000),
});
export type ImageCarouselConfig = z.infer<typeof imageCarouselConfigSchema>;

export const contactConfigSchema = z.object({
  heading: z.string().min(1).default("Get in Touch"),
  showForm: z.boolean().default(true),
  email: z.string().email().optional(),
  discordInvite: z.string().optional(),
});
export type ContactConfig = z.infer<typeof contactConfigSchema>;

export const testimonialsConfigSchema = z.object({
  heading: z.string().min(1).default("Trusted by players"),
  testimonials: z
    .array(
      z.object({
        quote: z.string().min(1),
        author: z.string().min(1),
        role: z.string().optional(),
        avatar: z.string().optional(),
      })
    )
    .default([]),
});
export type TestimonialsConfig = z.infer<typeof testimonialsConfigSchema>;

export const pricingConfigSchema = z.object({
  heading: z.string().min(1).default("Plans"),
  plans: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.string().min(1),
        features: z.array(z.string()),
        ctaText: z.string().min(1),
        highlighted: z.boolean().default(false),
      })
    )
    .default([]),
});
export type PricingConfig = z.infer<typeof pricingConfigSchema>;

export const faqConfigSchema = z.object({
  heading: z.string().min(1).default("Frequently Asked Questions"),
  items: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
      })
    )
    .default([]),
});
export type FaqConfig = z.infer<typeof faqConfigSchema>;

export const SOCIAL_PLATFORMS = [
  "discord",
  "twitter",
  "youtube",
  "github",
  "instagram",
] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const socialLinksConfigSchema = z.object({
  links: z
    .array(
      z.object({
        platform: z.enum(SOCIAL_PLATFORMS),
        url: z.string().url(),
      })
    )
    .default([]),
});
export type SocialLinksConfig = z.infer<typeof socialLinksConfigSchema>;

export const footerConfigSchema = z.object({
  brandName: z.string().min(1).default("Bank Name"),
  tagline: z.string().optional(),
  copyrightYear: z.string().optional(),
  links: z
    .array(
      z.object({
        label: z.string().min(1),
        url: z.string().min(1),
      })
    )
    .default([]),
});
export type FooterConfig = z.infer<typeof footerConfigSchema>;

export const dashboardPreviewConfigSchema = z.object({
  heading: z.string().min(1).default("See your finances at a glance"),
  description: z.string().optional(),
  screenshotUrl: z.string().optional(),
});
export type DashboardPreviewConfig = z.infer<
  typeof dashboardPreviewConfigSchema
>;

export const aboutConfigSchema = z.object({
  heading: z.string().min(1).default("About Us"),
  body: z.string().default(""),
  image: z.string().optional(),
});
export type AboutConfig = z.infer<typeof aboutConfigSchema>;

export const ctaConfigSchema = z.object({
  heading: z.string().min(1).default("Ready to get started?"),
  description: z.string().optional(),
  buttonText: z.string().min(1).default("Open an Account"),
  buttonLink: z.string().min(1).default("/login"),
  variant: z.enum(["banner", "card", "fullwidth"]).default("banner"),
});
export type CtaConfig = z.infer<typeof ctaConfigSchema>;

// ─── Module Types ──────────────────────────────────────────────

export const MODULE_TYPES = [
  "hero",
  "features",
  "image-carousel",
  "contact",
  "testimonials",
  "pricing",
  "faq",
  "social-links",
  "footer",
  "dashboard-preview",
  "about",
  "cta",
] as const;
export type ModuleType = (typeof MODULE_TYPES)[number];

/**
 * Maps module type strings to their config schema types.
 * Used for type-safe config access throughout the app.
 */
export interface ModuleConfigMap {
  hero: HeroConfig;
  features: FeaturesConfig;
  "image-carousel": ImageCarouselConfig;
  contact: ContactConfig;
  testimonials: TestimonialsConfig;
  pricing: PricingConfig;
  faq: FaqConfig;
  "social-links": SocialLinksConfig;
  footer: FooterConfig;
  "dashboard-preview": DashboardPreviewConfig;
  about: AboutConfig;
  cta: CtaConfig;
}

// ─── Module Instance ───────────────────────────────────────────

export const moduleInstanceSchema = z.object({
  id: z.string().min(1),
  type: z.enum(MODULE_TYPES),
  visible: z.boolean().default(true),
  config: z.record(z.string(), z.unknown()),
});
export type ModuleInstance = z.infer<typeof moduleInstanceSchema>;

// ─── Theme Config ──────────────────────────────────────────────

export const themeColorsSchema = z.object({
  background: z.string().min(1),
  foreground: z.string().min(1),
  primary: z.string().min(1),
  primaryForeground: z.string().min(1),
  secondary: z.string().min(1),
  secondaryForeground: z.string().min(1),
  muted: z.string().min(1),
  mutedForeground: z.string().min(1),
  accent: z.string().min(1),
  accentForeground: z.string().min(1),
  destructive: z.string().min(1),
  border: z.string().min(1),
  input: z.string().min(1),
  ring: z.string().min(1),
  card: z.string().min(1),
  cardForeground: z.string().min(1),
  popover: z.string().min(1),
  popoverForeground: z.string().min(1),
});
export type ThemeColors = z.infer<typeof themeColorsSchema>;

export const themeConfigSchema = z.object({
  mode: z.enum(["dark", "light"]).default("dark"),
  preset: z.string().optional(),
  colors: themeColorsSchema,
  fonts: z.object({
    heading: z.string().min(1).default("General Sans"),
    body: z.string().min(1).default("Plus Jakarta Sans"),
  }),
  borderRadius: z.string().min(1).default("0.625rem"),
});
export type ThemeConfig = z.infer<typeof themeConfigSchema>;

// ─── Branding ──────────────────────────────────────────────────

export const brandingSchema = z.object({
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  socialIcons: z.array(z.enum(SOCIAL_PLATFORMS)).default([]),
});
export type Branding = z.infer<typeof brandingSchema>;

// ─── Navigation ────────────────────────────────────────────────

export const navConfigSchema = z.object({
  showLogin: z.boolean().default(true),
  ctaText: z.string().min(1).default("Get Started"),
  ctaLink: z.string().min(1).default("/login"),
  links: z
    .array(
      z.object({
        label: z.string().min(1),
        href: z.string().min(1),
      })
    )
    .default([]),
});
export type NavConfig = z.infer<typeof navConfigSchema>;

// ─── Currency Config ────────────────────────────────────────────

export const currencyConfigSchema = z.object({
  /** Short code used in data records, e.g. "RED" */
  code: z.string().min(1).default("RED"),
  /** Display name, e.g. "Redmont Dollars" */
  name: z.string().min(1).default("Redmont Dollars"),
  /** Symbol shown before/after amounts, e.g. "RED $" or "$" */
  symbol: z.string().min(1).default("RED $"),
  /** Whether the symbol appears before (prefix) or after (suffix) the amount */
  symbolPosition: z.enum(["prefix", "suffix"]).default("prefix"),
});
export type CurrencyConfig = z.infer<typeof currencyConfigSchema>;

// ─── Complete Site Config ──────────────────────────────────────

export const siteConfigSchema = z.object({
  bankId: z.string().min(1),
  bankName: z.string().min(1),
  bankSlug: z.string().min(1),
  currency: currencyConfigSchema,
  modules: z.array(moduleInstanceSchema),
  theme: themeConfigSchema,
  branding: brandingSchema,
  nav: navConfigSchema,
});
export type SiteConfig = z.infer<typeof siteConfigSchema>;
