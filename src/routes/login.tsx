/**
 * Login page — Discord SSO is the only authentication method.
 *
 * Unified flow: one "Continue with Discord" action handles both
 * login (existing accounts) and registration (new accounts).
 * The backend determines whether to create or retrieve an account
 * based on the Discord identity — no separate sign-up form needed.
 *
 * In VITE_MOCK_MODE, a "Dev Login" button bypasses Discord entirely
 * and authenticates with the mock session data — no backend needed.
 *
 * If the user is already authenticated, they're redirected to the dashboard.
 */
import { useState } from "react";
import { Link, Navigate, useLocation, useSearchParams } from "react-router";
import { useAuth } from "@/components/providers/auth-provider";
import { useSiteConfig } from "@/hooks/use-site-config";
import { usePageTitle } from "@/hooks/use-page-title";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { redirectToDiscordLogin } from "@/lib/auth/discord";
import { seedMockAccounts } from "@/lib/data/data-service";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogIn, Bug, Database, Shield, Zap, ArrowLeft } from "lucide-react";

const IS_MOCK_MODE = import.meta.env.VITE_MOCK_MODE === "true";

/** Mock token that triggers mock session fallback in data-service */
const MOCK_TOKEN = "mock-dev-token";

/** Discord brand color for the login button */
const DISCORD_COLOR = "#5865F2";

export function LoginPage(): React.ReactElement {
  const { state, handleLoginToken } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { data: config } = useSiteConfig();
  const [mockLoading, setMockLoading] = useState(false);
  const [mockError, setMockError] = useState<string | null>(null);

  const intent = searchParams.get("intent");

  usePageTitle("Sign In", config?.bankName);

  // If already authenticated, redirect appropriately
  if (state.status === "authenticated") {
    // New users (no accounts) always go to onboarding first
    if (!state.session.hasAccounts) {
      const onboardingUrl = intent ? `/onboarding?intent=${intent}` : "/onboarding";
      return <Navigate to={onboardingUrl} replace />;
    }
    // Existing users with a business intent go to add-account
    if (intent === "business") {
      return <Navigate to="/dashboard/accounts/new?type=business" replace />;
    }
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/dashboard";
    return <Navigate to={from} replace />;
  }

  // Mock login: skip Discord redirect, authenticate directly with mock token
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

  // Show loading skeleton while checking auth status
  if (state.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-sm space-y-6 px-6">
          <div className="text-center">
            <Skeleton className="mx-auto h-8 w-48" />
            <Skeleton className="mx-auto mt-3 h-4 w-64" />
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  const page = (
    <div className="relative flex min-h-screen items-center justify-center bg-background">
      {/* Atmospheric background glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-primary/[0.03] blur-[80px]" />
      </div>

      <div className="w-full max-w-sm px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          {config?.branding.logoUrl ? (
            <img
              src={config.branding.logoUrl}
              alt={config.bankName}
              className="mx-auto mb-6 h-10"
            />
          ) : (
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          )}
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome to {config?.bankName ?? "your bank"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in or create an account, all through Discord.
          </p>
        </div>

        {/* Main action */}
        <div className="space-y-3">
          <Button
            className="w-full text-white shadow-lg shadow-[#5865F2]/20 transition-shadow hover:shadow-[#5865F2]/30"
            size="lg"
            style={{ backgroundColor: DISCORD_COLOR }}
            onClick={() => redirectToDiscordLogin(intent ?? undefined)}
          >
            <LogIn className="mr-2 h-5 w-5" />
            Continue with Discord
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            New here? Your account will be created automatically.
          </p>
        </div>

        {/* Dev mode login */}
        {IS_MOCK_MODE && (
          <div className="mt-6 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Dev mode</span>
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
              onClick={async () => {
                setMockLoading(true);
                setMockError(null);
                try {
                  seedMockAccounts();
                  await handleLoginToken(MOCK_TOKEN);
                } catch {
                  setMockError("Mock login failed. Check console for details.");
                } finally {
                  setMockLoading(false);
                }
              }}
              disabled={mockLoading}
            >
              <Database className="mr-2 h-4 w-4" />
              {mockLoading ? "Signing in..." : "Dev Login (Seeded Data)"}
            </Button>

            <p className="text-center text-[10px] text-muted-foreground/60">
              Seeded skips onboarding with pre-populated accounts
            </p>

            {mockError && (
              <p className="text-center text-xs text-destructive">{mockError}</p>
            )}
          </div>
        )}

        {/* Trust signals */}
        <div className="mt-10 flex items-center justify-center gap-6 text-xs text-muted-foreground/60">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            <span>Secure login</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            <span>Instant access</span>
          </div>
        </div>

        {/* Back to landing */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );

  // Apply bank theme — login is outside DashboardLayout so needs its own ThemeProvider
  if (!config) return page;
  return <ThemeProvider theme={config.theme}>{page}</ThemeProvider>;
}
