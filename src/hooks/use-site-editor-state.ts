/**
 * Local draft state management for the WYSIWYG site editor.
 *
 * Holds a mutable copy of the module list from the server config.
 * All edits happen on the draft; nothing touches the server until
 * the admin explicitly saves.
 */
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import type {
  ModuleInstance,
  ModuleType,
  SiteConfig,
} from "@/lib/config/site-config-schema";
import { getModule } from "@/lib/config/module-registry";
import { generateModuleId } from "@/components/editor/editor-utils";

export interface SiteEditorState {
  /** The current draft modules (local, unsaved). */
  readonly draftModules: readonly ModuleInstance[];
  /** Whether the draft differs from the server state. */
  readonly hasUnsavedChanges: boolean;
  /** Reorder a module from oldIndex to newIndex. */
  readonly reorderModule: (oldIndex: number, newIndex: number) => void;
  /** Toggle a module's visibility flag. */
  readonly toggleVisibility: (moduleId: string) => void;
  /** Replace a module's config by ID. */
  readonly updateModuleConfig: (
    moduleId: string,
    config: Record<string, unknown>
  ) => void;
  /** Add a new module of the given type with default config. */
  readonly addModule: (type: ModuleType) => void;
  /** Remove a module by ID. */
  readonly removeModule: (moduleId: string) => void;
  /** Discard all changes, revert to server state. */
  readonly discardChanges: () => void;
  /** Build a full SiteConfig with draft modules applied. */
  readonly getDraftConfig: () => SiteConfig;
  /** Count how many instances of a given type exist in the draft. */
  readonly countByType: (type: ModuleType) => number;
}

export function useSiteEditorState(
  serverConfig: SiteConfig
): SiteEditorState {
  const [draftModules, setDraftModules] = useState<ModuleInstance[]>(
    () => [...serverConfig.modules]
  );

  // Snapshot of the server state for dirty checking.
  const serverSnapshot = useRef(JSON.stringify(serverConfig.modules));

  // Reset draft when server config changes (e.g. after a save).
  useEffect(() => {
    const newSnapshot = JSON.stringify(serverConfig.modules);
    if (newSnapshot !== serverSnapshot.current) {
      serverSnapshot.current = newSnapshot;
      setDraftModules([...serverConfig.modules]);
    }
  }, [serverConfig.modules]);

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(draftModules) !== serverSnapshot.current,
    [draftModules]
  );

  const reorderModule = useCallback(
    (oldIndex: number, newIndex: number): void => {
      setDraftModules((prev) => arrayMove([...prev], oldIndex, newIndex));
    },
    []
  );

  const toggleVisibility = useCallback((moduleId: string): void => {
    setDraftModules((prev) =>
      prev.map((m) =>
        m.id === moduleId ? { ...m, visible: !m.visible } : m
      )
    );
  }, []);

  const updateModuleConfig = useCallback(
    (moduleId: string, config: Record<string, unknown>): void => {
      setDraftModules((prev) =>
        prev.map((m) => (m.id === moduleId ? { ...m, config } : m))
      );
    },
    []
  );

  const addModule = useCallback((type: ModuleType): void => {
    const registration = getModule(type);
    if (!registration) return;

    const newModule: ModuleInstance = {
      id: generateModuleId(),
      type,
      visible: true,
      config: registration.defaultConfig as Record<string, unknown>,
    };
    setDraftModules((prev) => [...prev, newModule]);
  }, []);

  const removeModule = useCallback((moduleId: string): void => {
    setDraftModules((prev) => prev.filter((m) => m.id !== moduleId));
  }, []);

  const discardChanges = useCallback((): void => {
    setDraftModules([...serverConfig.modules]);
  }, [serverConfig.modules]);

  const getDraftConfig = useCallback((): SiteConfig => {
    return { ...serverConfig, modules: draftModules };
  }, [serverConfig, draftModules]);

  const countByType = useCallback(
    (type: ModuleType): number => {
      return draftModules.filter((m) => m.type === type).length;
    },
    [draftModules]
  );

  return {
    draftModules,
    hasUnsavedChanges,
    reorderModule,
    toggleVisibility,
    updateModuleConfig,
    addModule,
    removeModule,
    discardChanges,
    getDraftConfig,
    countByType,
  };
}
