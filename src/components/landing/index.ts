/**
 * Module Registration — registers all landing page modules into the registry.
 *
 * TO ADD A NEW MODULE:
 * 1. Create the component in ./modules/my-section.tsx
 * 2. Add its Zod config schema in @/lib/config/site-config-schema.ts
 * 3. Add its type to MODULE_TYPES and ModuleConfigMap in the schema file
 * 4. Import and register it below
 *
 * The ModuleRenderer, WYSIWYG editor, and live preview all read from
 * this registry — no other files need changes.
 */
import { registerModule } from "@/lib/config/module-registry";

import { HeroSection } from "./modules/hero-section";
import { FeaturesSection } from "./modules/features-section";
import { ImageCarouselSection } from "./modules/image-carousel-section";
import { ContactSection } from "./modules/contact-section";
import { TestimonialsSection } from "./modules/testimonials-section";
import { PricingSection } from "./modules/pricing-section";
import { FaqSection } from "./modules/faq-section";
import { SocialLinksSection } from "./modules/social-links-section";
import { FooterSection } from "./modules/footer-section";
import { DashboardPreviewSection } from "./modules/dashboard-preview-section";
import { AboutSection } from "./modules/about-section";
import { CtaSection } from "./modules/cta-section";

import {
  heroConfigSchema,
  featuresConfigSchema,
  imageCarouselConfigSchema,
  contactConfigSchema,
  testimonialsConfigSchema,
  pricingConfigSchema,
  faqConfigSchema,
  socialLinksConfigSchema,
  footerConfigSchema,
  dashboardPreviewConfigSchema,
  aboutConfigSchema,
  ctaConfigSchema,
} from "@/lib/config/site-config-schema";

// ─── Register all modules ──────────────────────────────────────

registerModule({
  type: "hero",
  label: "Hero Section",
  icon: "Sparkles",
  component: HeroSection,
  schema: heroConfigSchema,
  defaultConfig: heroConfigSchema.parse({}),
  maxInstances: 1,
});

registerModule({
  type: "features",
  label: "Features",
  icon: "LayoutGrid",
  component: FeaturesSection,
  schema: featuresConfigSchema,
  defaultConfig: featuresConfigSchema.parse({}),
  maxInstances: 1,
});

registerModule({
  type: "image-carousel",
  label: "Image Carousel",
  icon: "Images",
  component: ImageCarouselSection,
  schema: imageCarouselConfigSchema,
  defaultConfig: imageCarouselConfigSchema.parse({}),
  maxInstances: 3,
});

registerModule({
  type: "contact",
  label: "Contact",
  icon: "Mail",
  component: ContactSection,
  schema: contactConfigSchema,
  defaultConfig: contactConfigSchema.parse({}),
  maxInstances: 1,
});

registerModule({
  type: "testimonials",
  label: "Testimonials",
  icon: "Quote",
  component: TestimonialsSection,
  schema: testimonialsConfigSchema,
  defaultConfig: testimonialsConfigSchema.parse({}),
  maxInstances: 1,
});

registerModule({
  type: "pricing",
  label: "Pricing",
  icon: "CreditCard",
  component: PricingSection,
  schema: pricingConfigSchema,
  defaultConfig: pricingConfigSchema.parse({}),
  maxInstances: 1,
});

registerModule({
  type: "faq",
  label: "FAQ",
  icon: "HelpCircle",
  component: FaqSection,
  schema: faqConfigSchema,
  defaultConfig: faqConfigSchema.parse({}),
  maxInstances: 1,
});

registerModule({
  type: "social-links",
  label: "Social Links",
  icon: "Share2",
  component: SocialLinksSection,
  schema: socialLinksConfigSchema,
  defaultConfig: socialLinksConfigSchema.parse({}),
  maxInstances: 1,
});

registerModule({
  type: "footer",
  label: "Footer",
  icon: "PanelBottom",
  component: FooterSection,
  schema: footerConfigSchema,
  defaultConfig: footerConfigSchema.parse({}),
  maxInstances: 1,
});

registerModule({
  type: "dashboard-preview",
  label: "Dashboard Preview",
  icon: "Monitor",
  component: DashboardPreviewSection,
  schema: dashboardPreviewConfigSchema,
  defaultConfig: dashboardPreviewConfigSchema.parse({}),
  maxInstances: 1,
});

registerModule({
  type: "about",
  label: "About",
  icon: "Info",
  component: AboutSection,
  schema: aboutConfigSchema,
  defaultConfig: aboutConfigSchema.parse({}),
  maxInstances: 1,
});

registerModule({
  type: "cta",
  label: "Call to Action",
  icon: "Megaphone",
  component: CtaSection,
  schema: ctaConfigSchema,
  defaultConfig: ctaConfigSchema.parse({}),
  maxInstances: 5,
});
