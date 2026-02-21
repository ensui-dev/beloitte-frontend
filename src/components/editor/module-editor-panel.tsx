/**
 * ModuleEditorPanel — a right-side Sheet that renders the per-module editor form.
 *
 * Holds its own local config copy. Changes only propagate to the parent draft
 * on explicit "Save". Validates with the module's Zod schema before saving.
 * Falls back to a raw JSON editor when no editor component is registered.
 */
import { useState, useEffect, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Save } from "lucide-react";
import { getModule, getEditor } from "@/lib/config/module-registry";
import { resolveIcon } from "./editor-utils";
import type { ModuleInstance } from "@/lib/config/site-config-schema";

interface ModuleEditorPanelProps {
  readonly moduleInstance: ModuleInstance | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSave: (moduleId: string, config: Record<string, unknown>) => void;
}

export function ModuleEditorPanel({
  moduleInstance,
  open,
  onOpenChange,
  onSave,
}: ModuleEditorPanelProps): React.ReactElement {
  const [localConfig, setLocalConfig] = useState<Record<string, unknown>>({});
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reset local config when a new module is opened.
  useEffect(() => {
    if (moduleInstance) {
      setLocalConfig({ ...(moduleInstance.config as Record<string, unknown>) });
      setValidationError(null);
    }
  }, [moduleInstance]);

  const registration = moduleInstance
    ? getModule(moduleInstance.type)
    : undefined;
  const editorReg = moduleInstance
    ? getEditor(moduleInstance.type)
    : undefined;

  const handleSave = useCallback((): void => {
    if (!moduleInstance || !registration) return;

    // Validate with the module's Zod schema.
    const result = registration.schema.safeParse(localConfig);
    if (!result.success) {
      const firstError = result.error.issues[0];
      setValidationError(
        firstError
          ? `${firstError.path.join(".")}: ${firstError.message}`
          : "Validation failed"
      );
      return;
    }

    setValidationError(null);
    onSave(moduleInstance.id, result.data as Record<string, unknown>);
    onOpenChange(false);
  }, [moduleInstance, registration, localConfig, onSave, onOpenChange]);

  const Icon = registration ? resolveIcon(registration.icon) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
            Edit {registration?.label ?? "Module"}
          </SheetTitle>
          <SheetDescription>
            {registration?.description ?? "Configure this module's settings."}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-4 py-4">
            {validationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}

            {editorReg ? (
              <EditorComponentRenderer
                editor={editorReg.editor}
                config={localConfig}
                onChange={setLocalConfig}
              />
            ) : (
              <FallbackJsonEditor
                config={localConfig}
                onChange={setLocalConfig}
              />
            )}
          </div>
        </ScrollArea>

        <SheetFooter className="flex-row gap-2 pt-4 border-t border-white/[0.06]">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 gap-2">
            <Save className="h-4 w-4" />
            Apply
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ─── Internal Components ──────────────────────────────────────

/**
 * Renders the registered editor component.
 * Separated to avoid re-creating the component on every config change.
 */
function EditorComponentRenderer({
  editor: EditorComponent,
  config,
  onChange,
}: {
  readonly editor: React.ComponentType<{
    config: Record<string, unknown>;
    onChange: (config: Record<string, unknown>) => void;
  }>;
  readonly config: Record<string, unknown>;
  readonly onChange: (config: Record<string, unknown>) => void;
}): React.ReactElement {
  return <EditorComponent config={config} onChange={onChange} />;
}

/** Raw JSON fallback for modules without a registered editor. */
function FallbackJsonEditor({
  config,
  onChange,
}: {
  readonly config: Record<string, unknown>;
  readonly onChange: (config: Record<string, unknown>) => void;
}): React.ReactElement {
  const [jsonText, setJsonText] = useState(() =>
    JSON.stringify(config, null, 2)
  );
  const [parseError, setParseError] = useState<string | null>(null);

  // Sync from parent when config changes externally.
  useEffect(() => {
    setJsonText(JSON.stringify(config, null, 2));
  }, [config]);

  const handleBlur = (): void => {
    try {
      const parsed = JSON.parse(jsonText) as Record<string, unknown>;
      setParseError(null);
      onChange(parsed);
    } catch {
      setParseError("Invalid JSON");
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        No visual editor available. Edit the raw JSON config below.
      </p>
      <Textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        onBlur={handleBlur}
        rows={16}
        className="font-mono text-xs border-white/[0.06] bg-white/[0.02]"
        spellCheck={false}
      />
      {parseError && (
        <p className="text-xs text-destructive">{parseError}</p>
      )}
    </div>
  );
}
