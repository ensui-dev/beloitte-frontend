/**
 * Reusable array field editor for module config forms.
 * Renders a list of items with add/remove controls.
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";

interface ArrayFieldEditorProps<T> {
  readonly label: string;
  readonly items: readonly T[];
  readonly onAdd: () => void;
  readonly onRemove: (index: number) => void;
  readonly onUpdate: (index: number, item: T) => void;
  readonly renderItem: (
    item: T,
    index: number,
    onChange: (updated: T) => void
  ) => React.ReactElement;
  readonly maxItems?: number;
}

export function ArrayFieldEditor<T>({
  label,
  items,
  onAdd,
  onRemove,
  onUpdate,
  renderItem,
  maxItems,
}: ArrayFieldEditorProps<T>): React.ReactElement {
  const canAdd = maxItems === undefined || items.length < maxItems;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          disabled={!canAdd}
          className="h-7 gap-1 text-xs"
        >
          <Plus className="h-3 w-3" />
          Add
        </Button>
      </div>

      {items.length === 0 && (
        <p className="py-4 text-center text-xs text-muted-foreground">
          No items yet. Click Add to create one.
        </p>
      )}

      {items.map((item, index) => (
        <Card
          key={index}
          className="border-white/[0.06] bg-white/[0.02]"
        >
          <CardContent className="space-y-3 pt-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                #{index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(index)}
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <Separator className="bg-white/[0.06]" />
            {renderItem(item, index, (updated) => onUpdate(index, updated))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
