/**
 * Module Registry — the core of the landing page module system.
 *
 * Each module is a self-contained unit registered here with:
 *   - A React component for rendering
 *   - A Zod schema for config validation
 *   - Default config values
 *   - Metadata (label, icon, description, max instances)
 *
 * The editor registry stores per-module editor forms separately so that
 * editor code is only imported in the admin dashboard, never on the
 * public landing page.
 */
import type { ComponentType } from "react";
import type { z } from "zod";
import type { ModuleType } from "./site-config-schema";

// ─── Module Registration ──────────────────────────────────────

export interface ModuleRegistration<TConfig = Record<string, unknown>> {
  readonly type: ModuleType;
  readonly label: string;
  readonly icon: string;
  readonly description?: string;
  readonly component: ComponentType<{ config: TConfig }>;
  readonly schema: z.ZodSchema<TConfig>;
  readonly defaultConfig: TConfig;
  readonly maxInstances: number;
}

const registry = new Map<ModuleType, ModuleRegistration>();

export function registerModule<TConfig>(
  registration: ModuleRegistration<TConfig>
): void {
  if (registry.has(registration.type)) {
    console.warn(
      `[ModuleRegistry] Module "${registration.type}" is already registered. Overwriting.`
    );
  }
  registry.set(
    registration.type,
    registration as unknown as ModuleRegistration
  );
}

export function getModule(
  type: ModuleType
): ModuleRegistration | undefined {
  return registry.get(type);
}

export function getAllModules(): readonly ModuleRegistration[] {
  return Array.from(registry.values());
}

export function isRegistered(type: string): type is ModuleType {
  return registry.has(type as ModuleType);
}

// ─── Editor Registration ──────────────────────────────────────

export interface ModuleEditorProps<TConfig> {
  readonly config: TConfig;
  readonly onChange: (config: TConfig) => void;
}

export interface EditorRegistration<TConfig = Record<string, unknown>> {
  readonly type: ModuleType;
  readonly editor: ComponentType<ModuleEditorProps<TConfig>>;
}

const editorRegistry = new Map<ModuleType, EditorRegistration>();

export function registerEditor<TConfig>(
  registration: EditorRegistration<TConfig>
): void {
  editorRegistry.set(
    registration.type,
    registration as unknown as EditorRegistration
  );
}

export function getEditor(
  type: ModuleType
): EditorRegistration | undefined {
  return editorRegistry.get(type);
}
