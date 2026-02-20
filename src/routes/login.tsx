/**
 * Login page — Discord SSO is the only authentication method.
 *
 * This is intentionally simple: a centered card with a Discord login button.
 * No email/password forms, no other OAuth providers, no sign-up flow.
 * The button triggers a redirect to the backend's Discord OAuth endpoint.
 *
 * In VITE_MOCK_MODE, a "Dev Login" button bypasses Discord entirely
 * and authenticates with the mock session data — no backend needed.
 *
 * If the user is already authenticated, they're redirected to the dashboard.
 */
import { useState } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/components/providers/auth-provider";
import { useSiteConfig } from "@/hooks/use-site-config";
import { usePageTitle } from "@/hooks/use-page-title";
import { redirectToDiscordLogin } from "@/lib/auth/discord";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LogIn, Bug } from "lucide-react";

const IS_MOCK_MODE = import.meta.env.VITE_MOCK_MODE === "true";

/** Mock token that triggers mock session fallback in data-service */
const MOCK_TOKEN = "mock-dev-token";

/** Discord brand color for the login button */
const DISCORD_COLOR = "#5865F2";

export function LoginPage(): React.ReactElement {
  const { state, handleLoginToken } = useAuth();
  const location = useLocation();
  const { data: config } = useSiteConfig();
  const [mockLoading, setMockLoading] = useState(false);
  const [mockError, setMockError] = useState<string | null>(null);

  usePageTitle("Sign In", config?.bankName);

  // If already authenticated, redirect to dashboard (or the page they came from)
  if (state.status === "authenticated") {
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
      setMockError("Mock login failed — check console for details.");
    } finally {
      setMockLoading(false);
    }
  };

  // Show loading skeleton while checking auth status
  if (state.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-sm border-border/50">
          <CardHeader className="text-center">
            <Skeleton className="mx-auto h-8 w-32" />
            <Skeleton className="mx-auto mt-2 h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-11 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      {/* Subtle background glow — matches hero gradient aesthetic */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Card className="w-full max-w-sm border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription>
            Sign in with your Discord account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full text-white"
            size="lg"
            style={{ backgroundColor: DISCORD_COLOR }}
            onClick={redirectToDiscordLogin}
          >
            <LogIn className="mr-2 h-5 w-5" />
            Continue with Discord
          </Button>

          {IS_MOCK_MODE && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Dev mode</span>
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
                {mockLoading ? "Signing in..." : "Dev Login (Mock User)"}
              </Button>

              {mockError && (
                <p className="text-center text-xs text-destructive">{mockError}</p>
              )}
            </>
          )}

          <p className="text-center text-xs text-muted-foreground">
            Discord is the only supported authentication method.
            <br />
            You&apos;ll be redirected to Discord to verify your identity.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
