/**
 * SortableModuleList — wraps the DndContext + SortableContext for module reordering.
 *
 * Provides smooth drag-and-drop with a DragOverlay ghost and
 * keyboard accessibility via sortableKeyboardCoordinates.
 */
import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { ModuleBlock } from "./module-block";
import { getModule } from "@/lib/config/module-registry";
import type { ModuleInstance } from "@/lib/config/site-config-schema";

interface SortableModuleListProps {
  readonly modules: readonly ModuleInstance[];
  readonly onReorder: (oldIndex: number, newIndex: number) => void;
  readonly onToggleVisibility: (moduleId: string) => void;
  readonly onEdit: (moduleId: string) => void;
  readonly onDelete: (moduleId: string) => void;
}

export function SortableModuleList({
  modules,
  onReorder,
  onToggleVisibility,
  onEdit,
  onDelete,
}: SortableModuleListProps): React.ReactElement {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent): void => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent): void => {
      setActiveId(null);
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = modules.findIndex((m) => m.id === active.id);
      const newIndex = modules.findIndex((m) => m.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(oldIndex, newIndex);
      }
    },
    [modules, onReorder]
  );

  const handleDragCancel = useCallback((): void => {
    setActiveId(null);
  }, []);

  const activeModule = activeId
    ? modules.find((m) => m.id === activeId)
    : null;
  const activeRegistration = activeModule
    ? getModule(activeModule.type)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={modules.map((m) => m.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {modules.map((mod) => {
            const registration = getModule(mod.type);
            if (!registration) return null;

            return (
              <ModuleBlock
                key={mod.id}
                module={mod}
                registration={registration}
                onToggleVisibility={() => onToggleVisibility(mod.id)}
                onEdit={() => onEdit(mod.id)}
                onDelete={() => onDelete(mod.id)}
              />
            );
          })}
        </div>
      </SortableContext>

      {/* Ghost overlay during drag */}
      <DragOverlay dropAnimation={null}>
        {activeModule && activeRegistration ? (
          <ModuleBlock
            module={activeModule}
            registration={activeRegistration}
            onToggleVisibility={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
            isOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
