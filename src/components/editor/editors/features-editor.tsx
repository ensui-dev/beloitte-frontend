/**
 * Editor form for the Features module.
 * Renders fields for heading, layout, and an array of feature items.
 */
import { ArrayFieldEditor } from "@/components/editor/array-field-editor";
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
import type { FeaturesConfig } from "@/lib/config/site-config-schema";

type FeatureItem = FeaturesConfig["features"][number];

export function FeaturesEditor({
  config,
  onChange,
}: ModuleEditorProps<FeaturesConfig>): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="features-heading">Heading</Label>
        <Input
          id="features-heading"
          value={config.heading}
          onChange={(e) => onChange({ ...config, heading: e.target.value })}
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="features-subheading">Subheading</Label>
        <Input
          id="features-subheading"
          value={config.subheading ?? ""}
          onChange={(e) =>
            onChange({
              ...config,
              subheading: e.target.value || undefined,
            })
          }
          placeholder="Optional"
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>

      <div className="space-y-2">
        <Label>Layout</Label>
        <Select
          value={config.layout}
          onValueChange={(v) =>
            onChange({
              ...config,
              layout: v as FeaturesConfig["layout"],
            })
          }
        >
          <SelectTrigger className="border-white/[0.06] bg-white/[0.02]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid-3">3-Column Grid</SelectItem>
            <SelectItem value="grid-2">2-Column Grid</SelectItem>
            <SelectItem value="list">List</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-white/[0.06]" />

      <ArrayFieldEditor<FeatureItem>
        label="Features"
        items={config.features}
        onAdd={() =>
          onChange({
            ...config,
            features: [
              ...config.features,
              { title: "", description: "", icon: "Zap" },
            ],
          })
        }
        onRemove={(index) =>
          onChange({
            ...config,
            features: config.features.filter((_, i) => i !== index),
          })
        }
        onUpdate={(index, item) =>
          onChange({
            ...config,
            features: config.features.map((f, i) => (i === index ? item : f)),
          })
        }
        renderItem={(item, _index, onItemChange) => (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={item.title}
                onChange={(e) =>
                  onItemChange({ ...item, title: e.target.value })
                }
                className="border-white/[0.06] bg-white/[0.02]"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={item.description}
                onChange={(e) =>
                  onItemChange({ ...item, description: e.target.value })
                }
                className="border-white/[0.06] bg-white/[0.02]"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <Input
                value={item.icon}
                onChange={(e) =>
                  onItemChange({ ...item, icon: e.target.value })
                }
                placeholder="Lucide icon name, e.g. Zap"
                className="border-white/[0.06] bg-white/[0.02]"
              />
              <p className="text-xs text-muted-foreground">
                Lucide icon name, e.g. Zap, Shield, TrendingUp
              </p>
            </div>
          </div>
        )}
      />
    </div>
  );
}
