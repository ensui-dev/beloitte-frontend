/**
 * Editor Registration — registers all per-module editor forms.
 *
 * This file is a side-effect import: importing it triggers all
 * registerEditor() calls. Only import this in the admin route
 * to keep editor code out of the public landing page bundle.
 */
import { registerEditor } from "@/lib/config/module-registry";

import { HeroEditor } from "./hero-editor";
import { FeaturesEditor } from "./features-editor";
import { FaqEditor } from "./faq-editor";
import { TestimonialsEditor } from "./testimonials-editor";
import { CtaEditor } from "./cta-editor";
import { FooterEditor } from "./footer-editor";
import {
  ContactEditor,
  AboutEditor,
  DashboardPreviewEditor,
  SocialLinksEditor,
  ImageCarouselEditor,
  PricingEditor,
} from "./simple-editors";

registerEditor({ type: "hero", editor: HeroEditor });
registerEditor({ type: "features", editor: FeaturesEditor });
registerEditor({ type: "faq", editor: FaqEditor });
registerEditor({ type: "testimonials", editor: TestimonialsEditor });
registerEditor({ type: "cta", editor: CtaEditor });
registerEditor({ type: "footer", editor: FooterEditor });
registerEditor({ type: "contact", editor: ContactEditor });
registerEditor({ type: "about", editor: AboutEditor });
registerEditor({ type: "dashboard-preview", editor: DashboardPreviewEditor });
registerEditor({ type: "social-links", editor: SocialLinksEditor });
registerEditor({ type: "image-carousel", editor: ImageCarouselEditor });
registerEditor({ type: "pricing", editor: PricingEditor });
