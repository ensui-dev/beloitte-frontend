/**
 * Simple module editors — bundled together since each is a small form.
 * Covers: Contact, About, DashboardPreview, SocialLinks, ImageCarousel, Pricing.
 */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrayFieldEditor } from "@/components/editor/array-field-editor";
import type { ModuleEditorProps } from "@/lib/config/module-registry";
import type {
  ContactConfig,
  AboutConfig,
  DashboardPreviewConfig,
  SocialLinksConfig,
  ImageCarouselConfig,
  PricingConfig,
} from "@/lib/config/site-config-schema";
import { SOCIAL_PLATFORMS } from "@/lib/config/site-config-schema";

// ─── Contact ──────────────────────────────────────────────────

export function ContactEditor({
  config,
  onChange,
}: ModuleEditorProps<ContactConfig>): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="contact-heading">Heading</Label>
        <Input
          id="contact-heading"
          value={config.heading}
          onChange={(e) => onChange({ ...config, heading: e.target.value })}
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="contact-show-form">Show Contact Form</Label>
        <Switch
          id="contact-show-form"
          checked={config.showForm}
          onCheckedChange={(v) => onChange({ ...config, showForm: v })}
        />
      </div>

      <Separator className="bg-white/[0.06]" />

      <div className="space-y-2">
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          type="email"
          value={config.email ?? ""}
          onChange={(e) =>
            onChange({ ...config, email: e.target.value || undefined })
          }
          placeholder="Optional"
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-discord">Discord Invite</Label>
        <Input
          id="contact-discord"
          value={config.discordInvite ?? ""}
          onChange={(e) =>
            onChange({ ...config, discordInvite: e.target.value || undefined })
          }
          placeholder="https://discord.gg/..."
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>
    </div>
  );
}

// ─── About ────────────────────────────────────────────────────

export function AboutEditor({
  config,
  onChange,
}: ModuleEditorProps<AboutConfig>): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="about-heading">Heading</Label>
        <Input
          id="about-heading"
          value={config.heading}
          onChange={(e) => onChange({ ...config, heading: e.target.value })}
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="about-body">Body</Label>
        <Textarea
          id="about-body"
          value={config.body}
          onChange={(e) => onChange({ ...config, body: e.target.value })}
          className="border-white/[0.06] bg-white/[0.02]"
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="about-image">Image URL</Label>
        <Input
          id="about-image"
          value={config.image ?? ""}
          onChange={(e) =>
            onChange({ ...config, image: e.target.value || undefined })
          }
          placeholder="Optional"
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>
    </div>
  );
}

// ─── Dashboard Preview ────────────────────────────────────────

export function DashboardPreviewEditor({
  config,
  onChange,
}: ModuleEditorProps<DashboardPreviewConfig>): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="dp-heading">Heading</Label>
        <Input
          id="dp-heading"
          value={config.heading}
          onChange={(e) => onChange({ ...config, heading: e.target.value })}
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dp-description">Description</Label>
        <Textarea
          id="dp-description"
          value={config.description ?? ""}
          onChange={(e) =>
            onChange({ ...config, description: e.target.value || undefined })
          }
          placeholder="Optional"
          className="border-white/[0.06] bg-white/[0.02]"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dp-screenshot">Screenshot URL</Label>
        <Input
          id="dp-screenshot"
          value={config.screenshotUrl ?? ""}
          onChange={(e) =>
            onChange({
              ...config,
              screenshotUrl: e.target.value || undefined,
            })
          }
          placeholder="Optional"
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>
    </div>
  );
}

// ─── Social Links ─────────────────────────────────────────────

type SocialLinkItem = SocialLinksConfig["links"][number];

export function SocialLinksEditor({
  config,
  onChange,
}: ModuleEditorProps<SocialLinksConfig>): React.ReactElement {
  return (
    <ArrayFieldEditor<SocialLinkItem>
      label="Social Links"
      items={config.links}
      onAdd={() =>
        onChange({
          ...config,
          links: [...config.links, { platform: "discord", url: "" }],
        })
      }
      onRemove={(i) =>
        onChange({ ...config, links: config.links.filter((_, idx) => idx !== i) })
      }
      onUpdate={(i, item) =>
        onChange({
          ...config,
          links: config.links.map((l, idx) => (idx === i ? item : l)),
        })
      }
      renderItem={(item, _index, onItemChange) => (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Platform</Label>
            <Select
              value={item.platform}
              onValueChange={(v) =>
                onItemChange({
                  ...item,
                  platform: v as SocialLinkItem["platform"],
                })
              }
            >
              <SelectTrigger className="border-white/[0.06] bg-white/[0.02]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOCIAL_PLATFORMS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              value={item.url}
              onChange={(e) => onItemChange({ ...item, url: e.target.value })}
              placeholder="https://..."
              className="border-white/[0.06] bg-white/[0.02]"
            />
          </div>
        </div>
      )}
    />
  );
}

// ─── Image Carousel ───────────────────────────────────────────

type CarouselImage = ImageCarouselConfig["images"][number];

export function ImageCarouselEditor({
  config,
  onChange,
}: ModuleEditorProps<ImageCarouselConfig>): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="carousel-autoplay">Auto-play</Label>
        <Switch
          id="carousel-autoplay"
          checked={config.autoPlay}
          onCheckedChange={(v) => onChange({ ...config, autoPlay: v })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="carousel-interval">Interval (ms)</Label>
        <Input
          id="carousel-interval"
          type="number"
          min={1000}
          step={500}
          value={config.interval}
          onChange={(e) =>
            onChange({ ...config, interval: Number(e.target.value) || 5000 })
          }
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>

      <Separator className="bg-white/[0.06]" />

      <ArrayFieldEditor<CarouselImage>
        label="Images"
        items={config.images}
        onAdd={() =>
          onChange({
            ...config,
            images: [...config.images, { src: "", alt: "" }],
          })
        }
        onRemove={(i) =>
          onChange({
            ...config,
            images: config.images.filter((_, idx) => idx !== i),
          })
        }
        onUpdate={(i, item) =>
          onChange({
            ...config,
            images: config.images.map((img, idx) => (idx === i ? item : img)),
          })
        }
        renderItem={(item, _index, onItemChange) => (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={item.src}
                onChange={(e) =>
                  onItemChange({ ...item, src: e.target.value })
                }
                placeholder="https://..."
                className="border-white/[0.06] bg-white/[0.02]"
              />
            </div>
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                value={item.alt}
                onChange={(e) =>
                  onItemChange({ ...item, alt: e.target.value })
                }
                className="border-white/[0.06] bg-white/[0.02]"
              />
            </div>
            <div className="space-y-2">
              <Label>Caption</Label>
              <Input
                value={item.caption ?? ""}
                onChange={(e) =>
                  onItemChange({
                    ...item,
                    caption: e.target.value || undefined,
                  })
                }
                placeholder="Optional"
                className="border-white/[0.06] bg-white/[0.02]"
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}

// ─── Pricing ──────────────────────────────────────────────────

type PricingPlan = PricingConfig["plans"][number];

export function PricingEditor({
  config,
  onChange,
}: ModuleEditorProps<PricingConfig>): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pricing-heading">Heading</Label>
        <Input
          id="pricing-heading"
          value={config.heading}
          onChange={(e) => onChange({ ...config, heading: e.target.value })}
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>

      <Separator className="bg-white/[0.06]" />

      <ArrayFieldEditor<PricingPlan>
        label="Plans"
        items={config.plans}
        onAdd={() =>
          onChange({
            ...config,
            plans: [
              ...config.plans,
              {
                name: "",
                price: "",
                features: [],
                ctaText: "Get Started",
                highlighted: false,
              },
            ],
          })
        }
        onRemove={(i) =>
          onChange({
            ...config,
            plans: config.plans.filter((_, idx) => idx !== i),
          })
        }
        onUpdate={(i, item) =>
          onChange({
            ...config,
            plans: config.plans.map((p, idx) => (idx === i ? item : p)),
          })
        }
        renderItem={(item, _index, onItemChange) => (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Plan Name</Label>
              <Input
                value={item.name}
                onChange={(e) =>
                  onItemChange({ ...item, name: e.target.value })
                }
                className="border-white/[0.06] bg-white/[0.02]"
              />
            </div>
            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                value={item.price}
                onChange={(e) =>
                  onItemChange({ ...item, price: e.target.value })
                }
                placeholder="e.g. RED $50/mo"
                className="border-white/[0.06] bg-white/[0.02]"
              />
            </div>
            <div className="space-y-2">
              <Label>CTA Text</Label>
              <Input
                value={item.ctaText}
                onChange={(e) =>
                  onItemChange({ ...item, ctaText: e.target.value })
                }
                className="border-white/[0.06] bg-white/[0.02]"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Highlighted</Label>
              <Switch
                checked={item.highlighted}
                onCheckedChange={(v) =>
                  onItemChange({ ...item, highlighted: v })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Features (one per line)</Label>
              <Textarea
                value={item.features.join("\n")}
                onChange={(e) =>
                  onItemChange({
                    ...item,
                    features: e.target.value
                      .split("\n")
                      .filter((f) => f.trim().length > 0),
                  })
                }
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                className="border-white/[0.06] bg-white/[0.02]"
                rows={4}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
