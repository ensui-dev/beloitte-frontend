/**
 * Editor form for the FAQ module.
 * Renders a heading field and an array of question/answer items.
 */
import { ArrayFieldEditor } from "@/components/editor/array-field-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { ModuleEditorProps } from "@/lib/config/module-registry";
import type { FaqConfig } from "@/lib/config/site-config-schema";

type FaqItem = FaqConfig["items"][number];

export function FaqEditor({
  config,
  onChange,
}: ModuleEditorProps<FaqConfig>): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="faq-heading">Heading</Label>
        <Input
          id="faq-heading"
          value={config.heading}
          onChange={(e) => onChange({ ...config, heading: e.target.value })}
          className="border-white/[0.06] bg-white/[0.02]"
        />
      </div>

      <Separator className="bg-white/[0.06]" />

      <ArrayFieldEditor<FaqItem>
        label="Questions"
        items={config.items}
        onAdd={() =>
          onChange({
            ...config,
            items: [...config.items, { question: "", answer: "" }],
          })
        }
        onRemove={(index) =>
          onChange({
            ...config,
            items: config.items.filter((_, i) => i !== index),
          })
        }
        onUpdate={(index, item) =>
          onChange({
            ...config,
            items: config.items.map((q, i) => (i === index ? item : q)),
          })
        }
        renderItem={(item, _index, onItemChange) => (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Question</Label>
              <Input
                value={item.question}
                onChange={(e) =>
                  onItemChange({ ...item, question: e.target.value })
                }
                className="border-white/[0.06] bg-white/[0.02]"
              />
            </div>
            <div className="space-y-2">
              <Label>Answer</Label>
              <Textarea
                value={item.answer}
                onChange={(e) =>
                  onItemChange({ ...item, answer: e.target.value })
                }
                className="border-white/[0.06] bg-white/[0.02]"
                rows={3}
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
