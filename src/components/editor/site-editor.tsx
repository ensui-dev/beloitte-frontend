/**
 * SiteEditor — the main WYSIWYG editor orchestrator.
 *
 * Composes the sortable module list, add/edit/delete dialogs,
 * and save/discard controls into a cohesive editor experience.
 */
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Undo2, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdateSiteConfig } from "@/hooks/use-site-config";
import { useSiteEditorState } from "@/hooks/use-site-editor-state";
import { getModule } from "@/lib/config/module-registry";
import { SortableModuleList } from "./sortable-module-list";
import { AddModuleDialog } from "./add-module-dialog";
import { ModuleEditorPanel } from "./module-editor-panel";
import { DeleteModuleDialog } from "./delete-module-dialog";
import type { SiteConfig, ModuleType } from "@/lib/config/site-config-schema";

interface SiteEditorProps {
  readonly config: SiteConfig;
}

export function SiteEditor({ config }: SiteEditorProps): React.ReactElement {
  const editor = useSiteEditorState(config);
  const updateConfig = useUpdateSiteConfig();

  // Dialog states
  const [addOpen, setAddOpen] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Resolve the module being edited
  const editingModule = editingModuleId
    ? editor.draftModules.find((m) => m.id === editingModuleId) ?? null
    : null;

  // ─── Handlers ──────────────────────────────────────────────

  const handleSave = useCallback((): void => {
    const draftConfig = editor.getDraftConfig();
    updateConfig.mutate(draftConfig, {
      onSuccess: () => {
        toast.success("Landing page saved successfully");
      },
      onError: (error) => {
        toast.error(`Failed to save: ${error.message}`);
      },
    });
  }, [editor, updateConfig]);

  const handleDiscard = useCallback((): void => {
    editor.discardChanges();
    toast.info("Changes discarded");
  }, [editor]);

  const handleAddModule = useCallback(
    (type: ModuleType): void => {
      editor.addModule(type);
    },
    [editor]
  );

  const handleEditSave = useCallback(
    (moduleId: string, newConfig: Record<string, unknown>): void => {
      editor.updateModuleConfig(moduleId, newConfig);
      setEditingModuleId(null);
    },
    [editor]
  );

  const handleDeleteRequest = useCallback(
    (moduleId: string): void => {
      const mod = editor.draftModules.find((m) => m.id === moduleId);
      if (!mod) return;
      const reg = getModule(mod.type);
      setDeleteTarget({
        id: moduleId,
        name: reg?.label ?? mod.type,
      });
    },
    [editor.draftModules]
  );

  const handleDeleteConfirm = useCallback((): void => {
    if (deleteTarget) {
      editor.removeModule(deleteTarget.id);
      setDeleteTarget(null);
    }
  }, [editor, deleteTarget]);

  // ─── Render ────────────────────────────────────────────────

  const AddButton = (
    <Button
      variant="outline"
      onClick={() => setAddOpen(true)}
      className="w-full gap-2 border-dashed border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]"
    >
      <Plus className="h-4 w-4" />
      Add Module
    </Button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Site Editor
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag to reorder, toggle visibility, or edit module content.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {editor.hasUnsavedChanges && (
            <Button
              variant="outline"
              onClick={handleDiscard}
              className="gap-2"
            >
              <Undo2 className="h-4 w-4" />
              Discard
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={!editor.hasUnsavedChanges || updateConfig.isPending}
            className="gap-2"
          >
            {updateConfig.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
                {editor.hasUnsavedChanges && (
                  <span className="ml-1 h-2 w-2 rounded-full bg-amber-400" />
                )}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Add button (top) */}
      {AddButton}

      {/* Sortable module list */}
      {editor.draftModules.length === 0 ? (
        <div className="rounded-lg border border-dashed border-white/[0.08] py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No modules yet. Click "Add Module" to start building your landing
            page.
          </p>
        </div>
      ) : (
        <SortableModuleList
          modules={editor.draftModules}
          onReorder={editor.reorderModule}
          onToggleVisibility={editor.toggleVisibility}
          onEdit={setEditingModuleId}
          onDelete={handleDeleteRequest}
        />
      )}

      {/* Add button (bottom) */}
      {AddButton}

      {/* Dialogs */}
      <AddModuleDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSelect={handleAddModule}
        countByType={editor.countByType}
      />

      <ModuleEditorPanel
        moduleInstance={editingModule}
        open={editingModuleId !== null}
        onOpenChange={(open) => {
          if (!open) setEditingModuleId(null);
        }}
        onSave={handleEditSave}
      />

      <DeleteModuleDialog
        moduleName={deleteTarget?.name ?? ""}
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
