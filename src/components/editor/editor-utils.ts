/**
 * Shared utilities for the WYSIWYG site editor.
 */
import type { ComponentType } from "react";
import { icons as lucideIconMap, type LucideProps } from "lucide-react";
import type { ModuleType } from "@/lib/config/site-config-schema";

/** Generate a unique module ID. */
export function generateModuleId(): string {
  return `mod-${crypto.randomUUID().slice(0, 8)}`;
}

/**
 * Resolve a Lucide icon by name string.
 * Falls back to the Box icon for unknown names.
 */
export function resolveIcon(
  iconName: string
): ComponentType<LucideProps> {
  const icon = lucideIconMap[iconName as keyof typeof lucideIconMap];
  return icon ?? lucideIconMap.Box;
}

/**
 * Generate a human-readable summary of a module's config
 * for the collapsible mini-preview in the module block.
 */
export function getModulePreviewText(
  type: ModuleType,
  config: Record<string, unknown>
): string {
  switch (type) {
    case "hero": {
      const headline = config.headline;
      return typeof headline === "string"
        ? truncate(headline, 60)
        : "No headline set";
    }
    case "features": {
      const features = config.features;
      const count = Array.isArray(features) ? features.length : 0;
      const layout = config.layout ?? "grid-3";
      return `${count} feature${count !== 1 ? "s" : ""}, ${String(layout)} layout`;
    }
    case "faq": {
      const items = config.items;
      const count = Array.isArray(items) ? items.length : 0;
      return `${count} question${count !== 1 ? "s" : ""}`;
    }
    case "testimonials": {
      const testimonials = config.testimonials;
      const count = Array.isArray(testimonials) ? testimonials.length : 0;
      return `${count} testimonial${count !== 1 ? "s" : ""}`;
    }
    case "pricing": {
      const plans = config.plans;
      const count = Array.isArray(plans) ? plans.length : 0;
      return `${count} plan${count !== 1 ? "s" : ""}`;
    }
    case "cta": {
      const heading = config.heading;
      const variant = config.variant ?? "banner";
      return typeof heading === "string"
        ? `${String(variant)} -- ${truncate(heading, 40)}`
        : `${String(variant)} variant`;
    }
    case "footer": {
      const brand = config.brandName;
      return typeof brand === "string" ? truncate(brand, 40) : "Footer";
    }
    case "about": {
      const heading = config.heading;
      return typeof heading === "string"
        ? truncate(heading, 50)
        : "About section";
    }
    case "contact": {
      const showForm = config.showForm;
      return showForm === true ? "Contact form enabled" : "Contact info only";
    }
    case "image-carousel": {
      const images = config.images;
      const count = Array.isArray(images) ? images.length : 0;
      return `${count} image${count !== 1 ? "s" : ""}`;
    }
    case "social-links": {
      const links = config.links;
      const count = Array.isArray(links) ? links.length : 0;
      return `${count} link${count !== 1 ? "s" : ""}`;
    }
    case "dashboard-preview": {
      const heading = config.heading;
      return typeof heading === "string"
        ? truncate(heading, 50)
        : "Dashboard preview";
    }
    default:
      return "";
  }
}

function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}
