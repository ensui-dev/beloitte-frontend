/**
 * Editor form for the Testimonials module.
 * Renders a heading field and an array of testimonial items.
 */
import { ArrayFieldEditor } from "@/components/editor/array-field-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { ModuleEditorProps } from "@/lib/config/module-registry";
import type { TestimonialsConfig } from "@/lib/config/site-config-schema";

type TestimonialItem = TestimonialsConfig["testimonials"][number];

export function TestimonialsEditor({
  config,
  onChange,
}: ModuleEditorProps<TestimonialsConfig>): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="testimonials-heading">Heading</Label>
        <Input
          id="testimonials-heading"
          value={config.heading}
          onChange={(e) => onChange({ ...config, heading: e.target.value })}
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>

      <Separator className="bg-white/[0.06]" />

      <ArrayFieldEditor<TestimonialItem>
        label="Testimonials"
        items={config.testimonials}
        onAdd={() =>
          onChange({
            ...config,
            testimonials: [
              ...config.testimonials,
              { quote: "", author: "" },
            ],
          })
        }
        onRemove={(index) =>
          onChange({
            ...config,
            testimonials: config.testimonials.filter((_, i) => i !== index),
          })
        }
        onUpdate={(index, item) =>
          onChange({
            ...config,
            testimonials: config.testimonials.map((t, i) =>
              i === index ? item : t
            ),
          })
        }
        renderItem={(item, _index, onItemChange) => (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Quote</Label>
              <Textarea
                value={item.quote}
                onChange={(e) =>
                  onItemChange({ ...item, quote: e.target.value })
                }
                className="border-white/[0.06] bg-white/[0.02]"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Author</Label>
              <Input
                value={item.author}
                onChange={(e) =>
                  onItemChange({ ...item, author: e.target.value })
                }
                className="border-white/[0.06] bg-white/[0.02]"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                value={item.role ?? ""}
                onChange={(e) =>
                  onItemChange({
                    ...item,
                    role: e.target.value || undefined,
                  })
                }
                placeholder="Optional"
                className="border-white/[0.06] bg-white/[0.02]"
              />
            </div>
            <div className="space-y-2">
              <Label>Avatar URL</Label>
              <Input
                value={item.avatar ?? ""}
                onChange={(e) =>
                  onItemChange({
                    ...item,
                    avatar: e.target.value || undefined,
                  })
                }
                placeholder="https://..."
                className="border-white/[0.06] bg-white/[0.02]"
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
