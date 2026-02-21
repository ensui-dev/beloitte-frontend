/**
 * Editor form for the Footer module.
 * Renders fields for brand name, tagline, copyright year, and footer links.
 */
import { ArrayFieldEditor } from "@/components/editor/array-field-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { ModuleEditorProps } from "@/lib/config/module-registry";
import type { FooterConfig } from "@/lib/config/site-config-schema";

type FooterLink = FooterConfig["links"][number];

export function FooterEditor({
  config,
  onChange,
}: ModuleEditorProps<FooterConfig>): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="footer-brand-name">Brand Name</Label>
        <Input
          id="footer-brand-name"
          value={config.brandName}
          onChange={(e) => onChange({ ...config, brandName: e.target.value })}
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="footer-tagline">Tagline</Label>
        <Input
          id="footer-tagline"
          value={config.tagline ?? ""}
          onChange={(e) =>
            onChange({
              ...config,
              tagline: e.target.value || undefined,
            })
          }
          placeholder="Optional"
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="footer-copyright-year">Copyright Year</Label>
        <Input
          id="footer-copyright-year"
          value={config.copyrightYear ?? ""}
          onChange={(e) =>
            onChange({
              ...config,
              copyrightYear: e.target.value || undefined,
            })
          }
          placeholder="e.g. 2026"
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>

      <Separator className="bg-white/[0.06]" />

      <ArrayFieldEditor<FooterLink>
        label="Links"
        items={config.links}
        onAdd={() =>
          onChange({
            ...config,
            links: [...config.links, { label: "", url: "" }],
          })
        }
        onRemove={(index) =>
          onChange({
            ...config,
            links: config.links.filter((_, i) => i !== index),
          })
        }
        onUpdate={(index, item) =>
          onChange({
            ...config,
            links: config.links.map((l, i) => (i === index ? item : l)),
          })
        }
        renderItem={(item, _index, onItemChange) => (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                value={item.label}
                onChange={(e) =>
                  onItemChange({ ...item, label: e.target.value })
                }
                className="border-white/[0.06] bg-white/[0.02]"
              />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={item.url}
                onChange={(e) =>
                  onItemChange({ ...item, url: e.target.value })
                }
                placeholder="/about or https://..."
                className="border-white/[0.06] bg-white/[0.02]"
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
