/**
 * Setup page — first-boot wizard for configuring the bank.
 *
 * Two phases:
 *   1. Auth gate — unauthenticated users must log in first
 *   2. Wizard — authenticated users walk through bank configuration
 *
 * This page is rendered by <SetupGuard> when no SiteConfig exists.
 * It uses a hardcoded dark-fintech theme since no config is available
 * to feed into ThemeProvider.
 *
 * In mock mode, shows Dev Login buttons (same pattern as login.tsx).
 * "Dev Login (Seeded)" seeds config + accounts and reloads, bypassing
 * the wizard entirely.
 */
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { BankSetupWizard } from "@/components/setup/bank-setup-wizard";
import { redirectToDiscordLogin } from "@/lib/auth/discord";
import { seedMockSetup } from "@/lib/data/data-service";
import { Button } from "@/components/ui/button";
import { LogIn, Bug, Database, Landmark, ShieldAlert } from "lucide-react";

const IS_MOCK_MODE = import.meta.env.VITE_MOCK_MODE === "true";
const MOCK_TOKEN = "mock-dev-token";

export function SetupPage(): React.ReactElement {
  const { state, handleLoginToken, logout } = useAuth();
  const [mockLoading, setMockLoading] = useState(false);
  const [mockError, setMockError] = useState<string | null>(null);
  const tokenProcessedRef = useRef(false);

  // Handle Discord OAuth callback token.
  // SetupGuard blocks <App /> (and its /auth/callback route) when no config
  // exists, so the token from Discord's redirect lands here instead.
  // We detect it in the URL and process it directly.
  useEffect(() => {
    if (tokenProcessedRef.current) return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token || state.status === "authenticated") return;

    tokenProcessedRef.current = true;

    // Clean the token out of the URL immediately (don't leave JWTs in the address bar)
    window.history.replaceState({}, "", window.location.pathname);

    handleLoginToken(token).catch(() => {
      // Token was invalid — user can try Discord login again
    });
  }, [state.status, handleLoginToken]);

  const isAuthenticated = state.status === "authenticated";
  const isAdmin =
    state.status === "authenticated" &&
    state.session.user.roles.includes("admin");

  const handleMockLogin = async (): Promise<void> => {
    setMockLoading(true);
    setMockError(null);
    try {
      await handleLoginToken(MOCK_TOKEN);
    } catch {
      setMockError("Mock login failed. Check console for details.");
    } finally {
      setMockLoading(false);
    }
  };

  const handleSeededLogin = async (): Promise<void> => {
    setMockLoading(true);
    setMockError(null);
    try {
      seedMockSetup();
      await handleLoginToken(MOCK_TOKEN);
      // Config now exists in localStorage — reload to let SetupGuard pass through
      window.location.reload();
    } catch {
      setMockError("Mock login failed. Check console for details.");
    } finally {
      setMockLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[oklch(0.11_0.025_255)] text-[oklch(0.985_0_0)]">
      {/* Atmospheric background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.62_0.20_255_/_0.06)] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-[oklch(0.62_0.20_255_/_0.03)] blur-[80px]" />
      </div>

      <div className="w-full max-w-lg px-6">
        {!isAuthenticated ? (
          /* ── Auth Gate ─────────────────────────────────────── */
          <div className="mx-auto max-w-sm">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-[oklch(0.62_0.20_255_/_0.1)]">
                <Landmark className="h-7 w-7 text-[oklch(0.62_0.20_255)]" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome to Beloitte
              </h1>
              <p className="mt-2 text-sm text-[oklch(0.65_0.03_255)]">
                Authenticate with Discord to begin setting up your bank.
              </p>
            </div>

            {/* Discord login */}
            <div className="space-y-3">
              <Button
                className="w-full text-white shadow-lg shadow-[#5865F2]/20 transition-shadow hover:shadow-[#5865F2]/30"
                size="lg"
                style={{ backgroundColor: "#5865F2" }}
                onClick={() => redirectToDiscordLogin()}
              >
                <LogIn className="mr-2 h-5 w-5" />
                Continue with Discord
              </Button>
            </div>

            {/* Dev mode login */}
            {IS_MOCK_MODE && (
              <div className="mt-6 space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/[0.06]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[oklch(0.11_0.025_255)] px-2 text-[oklch(0.65_0.03_255)]">
                      Dev mode
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
                  size="lg"
                  onClick={handleMockLogin}
                  disabled={mockLoading}
                >
                  <Bug className="mr-2 h-5 w-5" />
                  {mockLoading ? "Signing in..." : "Dev Login"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-zinc-500/30 text-zinc-400 hover:bg-zinc-500/10 hover:text-zinc-300"
                  size="sm"
                  onClick={handleSeededLogin}
                  disabled={mockLoading}
                >
                  <Database className="mr-2 h-4 w-4" />
                  {mockLoading ? "Signing in..." : "Dev Login (Seeded Data)"}
                </Button>

                <p className="text-center text-[10px] text-[oklch(0.65_0.03_255_/_0.6)]">
                  Seeded skips setup wizard &amp; onboarding with pre-populated data
                </p>

                {mockError && (
                  <p className="text-center text-xs text-red-400">{mockError}</p>
                )}
              </div>
            )}
          </div>
        ) : !isAdmin ? (
          /* ── Access Denied (non-admin) ─────────────────────── */
          <div className="mx-auto max-w-sm text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10">
              <ShieldAlert className="h-7 w-7 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Access Denied
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[oklch(0.65_0.03_255)]">
              Only bank administrators can perform the initial setup.
              Contact your bank admin to configure this deployment.
            </p>
            <Button
              variant="outline"
              className="mt-6 border-white/[0.08] text-[oklch(0.65_0.03_255)] hover:bg-white/[0.04]"
              onClick={() => void logout()}
            >
              Sign out
            </Button>
          </div>
        ) : (
          /* ── Wizard ───────────────────────────────────────── */
          <BankSetupWizard />
        )}
      </div>
    </div>
  );
}
