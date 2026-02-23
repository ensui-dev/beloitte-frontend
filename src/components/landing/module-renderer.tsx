/**
 * ModuleRenderer — renders an ordered list of landing page modules from config.
 * Only renders visible modules. Skips unregistered types with a warning.
 */
import { getModule, isRegistered } from "@/lib/config/module-registry";
import { ErrorBoundary } from "@/components/error-boundary";
import type { ModuleInstance } from "@/lib/config/site-config-schema";

interface ModuleRendererProps {
  readonly modules: readonly ModuleInstance[];
}

export function ModuleRenderer({
  modules,
}: ModuleRendererProps): React.ReactElement {
  return (
    <>
      {modules
        .filter((m) => m.visible)
        .map((moduleInstance) => {
          if (!isRegistered(moduleInstance.type)) {
            console.warn(
              `[ModuleRenderer] Unknown module type: "${moduleInstance.type}". Skipping.`
            );
            return null;
          }

          const registration = getModule(moduleInstance.type);
          if (!registration) {
            return null;
          }

          const Component = registration.component;
          return (
            <section
              key={moduleInstance.id}
              id={`section-${moduleInstance.type}`}
            >
              <ErrorBoundary label={`${moduleInstance.type} section`}>
                <Component config={moduleInstance.config} />
              </ErrorBoundary>
            </section>
          );
        })}
    </>
  );
}
