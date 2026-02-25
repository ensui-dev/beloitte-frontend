/**
 * Onboarding page — shown to new users after Discord OAuth.
 *
 * Full-page layout with atmospheric background (matching the login page aesthetic).
 * Not inside the dashboard layout — this is a standalone experience.
 *
 * Two modes:
 *   1. Full wizard — user has no accounts → type → details → ToS → verification
 *   2. Verification only — user has accounts but none verified (re-login after ToS)
 */
import { useNavigate, useSearchParams } from "react-router";
import { useCallback, useMemo, useState } from "react";
import { useSiteConfig } from "@/hooks/use-site-config";
import { usePageTitle } from "@/hooks/use-page-title";
import { useAuth, useSession } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AccountSetupWizard } from "@/components/account/account-setup-wizard";
import { VerificationStep } from "@/components/account/verification-step";
import { Shield } from "lucide-react";
import { dataService } from "@/lib/data/data-service";
import { useAccounts } from "@/hooks/use-account";
import type { BankAccount } from "@/lib/data/types";

export function OnboardingPage(): React.ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: config } = useSiteConfig();
  const { refreshSession } = useAuth();
  const session = useSession();
  const { data: accounts } = useAccounts();

  // ?intent=business skips type selection and goes straight to business details
  const isBusiness = searchParams.get("intent") === "business";

  usePageTitle("Set Up Your Account", config?.bankName);

  // Determine if we should show verification-only mode
  // (user has accounts but none are active/verified — returning after ToS acceptance)
  const pendingAccount = useMemo((): BankAccount | null => {
    if (!accounts || accounts.length === 0) return null;
    return accounts.find((a) => a.status === "pending_verification") ?? null;
  }, [accounts]);

  const showVerificationOnly = session?.hasAccounts && !session.hasVerifiedAccounts && pendingAccount !== null;

  // Stable verification slug for verification-only mode
  const [verificationSlug] = useState(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let slug = "";
    for (let i = 0; i < 6; i++) {
      slug += chars[Math.floor(Math.random() * chars.length)];
    }
    return slug;
  });

  const handleComplete = useCallback(
    async (_account: BankAccount): Promise<void> => {
      // Refresh session so AuthGuard sees hasVerifiedAccounts: true
      await refreshSession();
      navigate("/dashboard", { replace: true });
    },
    [navigate, refreshSession]
  );

  const handleCheckVerification = useCallback(async (): Promise<boolean> => {
    if (!pendingAccount) return false;
    return dataService.verifyAccount(pendingAccount.id);
  }, [pendingAccount]);

  const handleVerified = useCallback(async (): Promise<void> => {
    await refreshSession();
    navigate("/dashboard", { replace: true });
  }, [navigate, refreshSession]);

  const gameBusinessName = config?.gameBusinessName ?? "Beloitte";
  const channelName = config?.verificationChannelName ?? "#deposit-here";

  const page = (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-6 py-12">
      {/* Atmospheric background glow — same style as the login page */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-primary/[0.03] blur-[80px]" />
      </div>

      <div className="w-full max-w-lg">
        {/* Bank branding header */}
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
          <p className="text-sm text-muted-foreground">
            {showVerificationOnly
              ? "Complete your account verification to get started."
              : `Welcome${session?.user.discordUsername ? `, ${session.user.discordUsername}` : ""}! Let\u2019s get your account set up.`}
          </p>
        </div>

        {/* Content card */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
          {showVerificationOnly ? (
            <VerificationStep
              channelName={channelName}
              gameBusinessName={gameBusinessName}
              verificationSlug={verificationSlug}
              onVerified={handleVerified}
              onCheckVerification={handleCheckVerification}
            />
          ) : (
            <AccountSetupWizard
              onComplete={handleComplete}
              title={isBusiness ? "Open a business account" : "Open your first account"}
              description={
                isBusiness
                  ? "Tell us about your business to get started."
                  : "Choose between a personal or business account to get started."
              }
              initialAccountType={isBusiness ? "business" : undefined}
              verificationChannelName={channelName}
              gameBusinessName={gameBusinessName}
              tosText={config?.tosText}
            />
          )}
        </div>
      </div>
    </div>
  );

  // Apply bank theme — onboarding is outside DashboardLayout so needs its own ThemeProvider
  if (!config) return page;
  return <ThemeProvider theme={config.theme}>{page}</ThemeProvider>;
}
