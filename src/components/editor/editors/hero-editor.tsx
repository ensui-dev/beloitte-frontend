/**
 * Editor form for the Hero module.
 * Renders fields for headline, CTA, background, and alignment settings.
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
import type { ModuleEditorProps } from "@/lib/config/module-registry";
import type { HeroConfig } from "@/lib/config/site-config-schema";

export function HeroEditor({
  config,
  onChange,
}: ModuleEditorProps<HeroConfig>): React.ReactElement {
  return (
    <div className="space-y-4">
      {/* Headline & Subheadline */}
      <div className="space-y-2">
        <Label htmlFor="hero-headline">Headline</Label>
        <Input
          id="hero-headline"
          value={config.headline}
          onChange={(e) => onChange({ ...config, headline: e.target.value })}
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hero-subheadline">Subheadline</Label>
        <Textarea
          id="hero-subheadline"
          value={config.subheadline}
          onChange={(e) => onChange({ ...config, subheadline: e.target.value })}
          className="border-white/[0.06] bg-white/[0.02]"
          rows={3}
        />
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Primary CTA */}
      <div className="space-y-2">
        <Label htmlFor="hero-cta-text">CTA Text</Label>
        <Input
          id="hero-cta-text"
          value={config.ctaText}
          onChange={(e) => onChange({ ...config, ctaText: e.target.value })}
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hero-cta-link">CTA Link</Label>
        <Input
          id="hero-cta-link"
          value={config.ctaLink}
          onChange={(e) => onChange({ ...config, ctaLink: e.target.value })}
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Secondary CTA */}
      <div className="space-y-2">
        <Label htmlFor="hero-secondary-cta-text">Secondary CTA Text</Label>
        <Input
          id="hero-secondary-cta-text"
          value={config.secondaryCtaText ?? ""}
          onChange={(e) =>
            onChange({
              ...config,
              secondaryCtaText: e.target.value || undefined,
            })
          }
          placeholder="Optional"
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hero-secondary-cta-link">Secondary CTA Link</Label>
        <Input
          id="hero-secondary-cta-link"
          value={config.secondaryCtaLink ?? ""}
          onChange={(e) =>
            onChange({
              ...config,
              secondaryCtaLink: e.target.value || undefined,
            })
          }
          placeholder="Optional"
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Display Options */}
      <div className="flex items-center justify-between">
        <Label htmlFor="hero-dashboard-preview">Show Dashboard Preview</Label>
        <Switch
          id="hero-dashboard-preview"
          checked={config.showDashboardPreview}
          onCheckedChange={(v) =>
            onChange({ ...config, showDashboardPreview: v })
          }
        />
      </div>

      <div className="space-y-2">
        <Label>Background Variant</Label>
        <Select
          value={config.backgroundVariant}
          onValueChange={(v) =>
            onChange({
              ...config,
              backgroundVariant: v as HeroConfig["backgroundVariant"],
            })
          }
        >
          <SelectTrigger className="border-white/[0.06] bg-white/[0.02]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gradient">Gradient</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="particles">Particles</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {config.backgroundVariant === "image" && (
        <div className="space-y-2">
          <Label htmlFor="hero-bg-image">Background Image URL</Label>
          <Input
            id="hero-bg-image"
            value={config.backgroundImage ?? ""}
            onChange={(e) =>
              onChange({
                ...config,
                backgroundImage: e.target.value || undefined,
              })
            }
            placeholder="https://..."
            className="border-white/[0.06] bg-white/[0.02]"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Alignment</Label>
        <Select
          value={config.alignment}
          onValueChange={(v) =>
            onChange({
              ...config,
              alignment: v as HeroConfig["alignment"],
            })
          }
        >
          <SelectTrigger className="border-white/[0.06] bg-white/[0.02]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
