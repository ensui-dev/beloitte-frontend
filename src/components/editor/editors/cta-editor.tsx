/**
 * Editor form for the CTA (Call to Action) module.
 * Renders fields for heading, description, button, and variant settings.
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
import { Textarea } from "@/components/ui/textarea";
import type { ModuleEditorProps } from "@/lib/config/module-registry";
import type { CtaConfig } from "@/lib/config/site-config-schema";

export function CtaEditor({
  config,
  onChange,
}: ModuleEditorProps<CtaConfig>): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cta-heading">Heading</Label>
        <Input
          id="cta-heading"
          value={config.heading}
          onChange={(e) => onChange({ ...config, heading: e.target.value })}
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cta-description">Description</Label>
        <Textarea
          id="cta-description"
          value={config.description ?? ""}
          onChange={(e) =>
            onChange({
              ...config,
              description: e.target.value || undefined,
            })
          }
          placeholder="Optional"
          className="border-white/[0.06] bg-white/[0.02]"
          rows={3}
        />
      </div>

      <Separator className="bg-white/[0.06]" />

      <div className="space-y-2">
        <Label htmlFor="cta-button-text">Button Text</Label>
        <Input
          id="cta-button-text"
          value={config.buttonText}
          onChange={(e) => onChange({ ...config, buttonText: e.target.value })}
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cta-button-link">Button Link</Label>
        <Input
          id="cta-button-link"
          value={config.buttonLink}
          onChange={(e) => onChange({ ...config, buttonLink: e.target.value })}
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>

      <Separator className="bg-white/[0.06]" />

      <div className="space-y-2">
        <Label>Variant</Label>
        <Select
          value={config.variant}
          onValueChange={(v) =>
            onChange({
              ...config,
              variant: v as CtaConfig["variant"],
            })
          }
        >
          <SelectTrigger className="border-white/[0.06] bg-white/[0.02]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="banner">Banner</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="fullwidth">Full Width</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
