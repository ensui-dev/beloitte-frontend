/**
 * SetupGuard — top-level wrapper that detects unconfigured state.
 *
 * Wraps the entire <App /> in main.tsx. Queries site config:
 *   - Loading → full-page skeleton
 *   - Error (no config) → renders <SetupPage />
 *   - Success (config exists) → renders children (normal app)
 *
 * This is the gatekeeper for the first-boot setup wizard.
 * The setup page uses a hardcoded dark theme since no SiteConfig
 * exists yet to provide one.
 */
import type { ReactNode } from "react";
import { useSiteConfig } from "@/hooks/use-site-config";
import { SetupPage } from "@/routes/setup";
import { Skeleton } from "@/components/ui/skeleton";

interface SetupGuardProps {
  readonly children: ReactNode;
}

export function SetupGuard({ children }: SetupGuardProps): React.ReactElement {
  const { data: config, isLoading, isError } = useSiteConfig();

  // Still loading — show a full-page skeleton
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.11_0.025_255)]">
        <div className="w-full max-w-sm space-y-6 px-6">
          <div className="text-center">
            <Skeleton className="mx-auto h-12 w-12 rounded-xl bg-white/[0.06]" />
            <Skeleton className="mx-auto mt-4 h-6 w-48 bg-white/[0.06]" />
            <Skeleton className="mx-auto mt-2 h-4 w-64 bg-white/[0.06]" />
          </div>
        </div>
      </div>
    );
  }

  // No config found — show setup wizard
  if (isError || !config) {
    return <SetupPage />;
  }

  // Config exists — render the normal app
  return <>{children}</>;
}
