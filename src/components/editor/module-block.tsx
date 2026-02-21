/**
 * ModuleBlock — a sortable card representing a single module in the editor list.
 *
 * Features: drag handle, dynamic icon, label, visibility toggle, edit/delete buttons.
 * Uses @dnd-kit/sortable for drag-and-drop integration.
 */
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { resolveIcon, getModulePreviewText } from "./editor-utils";
import type { ModuleInstance } from "@/lib/config/site-config-schema";
import type { ModuleRegistration } from "@/lib/config/module-registry";
import { useState } from "react";

interface ModuleBlockProps {
  readonly module: ModuleInstance;
  readonly registration: ModuleRegistration;
  readonly onToggleVisibility: () => void;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
  /** When true, renders without drag functionality (for DragOverlay). */
  readonly isOverlay?: boolean;
}

export function ModuleBlock({
  module,
  registration,
  onToggleVisibility,
  onEdit,
  onDelete,
  isOverlay = false,
}: ModuleBlockProps): React.ReactElement {
  const [expanded, setExpanded] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: module.id,
    disabled: isOverlay,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = resolveIcon(registration.icon);
  const previewText = getModulePreviewText(
    module.type,
    module.config as Record<string, unknown>
  );

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <div
        ref={isOverlay ? undefined : setNodeRef}
        style={isOverlay ? undefined : style}
        className={cn(
          "rounded-lg border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm",
          "transition-colors",
          isDragging && "z-50 opacity-50",
          isOverlay && "shadow-xl shadow-black/20 border-primary/20 bg-white/[0.04]",
          !module.visible && "opacity-50"
        )}
      >
        {/* Main row */}
        <div className="flex items-center gap-2 px-3 py-2.5">
          {/* Drag handle */}
          <button
            type="button"
            className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing"
            {...(isOverlay ? {} : { ...attributes, ...listeners })}
            tabIndex={isOverlay ? -1 : 0}
          >
            <GripVertical className="h-4 w-4" />
          </button>

          {/* Icon + Label */}
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate text-sm font-medium">
              {registration.label}
            </span>
          </div>

          {/* Visibility toggle */}
          <Switch
            checked={module.visible}
            onCheckedChange={onToggleVisibility}
            className="scale-75"
            aria-label={`Toggle ${registration.label} visibility`}
          />

          {/* Edit */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            aria-label={`Edit ${registration.label}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>

          {/* Delete */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            aria-label={`Delete ${registration.label}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>

          {/* Expand chevron */}
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground"
              aria-label="Toggle preview"
            >
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  expanded && "rotate-180"
                )}
              />
            </Button>
          </CollapsibleTrigger>
        </div>

        {/* Collapsible preview */}
        <CollapsibleContent>
          <div className="border-t border-white/[0.04] px-4 py-2">
            <p className="text-xs text-muted-foreground">{previewText}</p>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
