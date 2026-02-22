/**
 * Onboarding page — shown to new users after Discord OAuth.
 *
 * Full-page layout with atmospheric background (matching the login page aesthetic).
 * Not inside the dashboard layout — this is a standalone experience.
 *
 * Flow: Choose account type → Fill details → Success → Go to dashboard
 */
import { useNavigate } from "react-router";
import { useCallback } from "react";
import { useSiteConfig } from "@/hooks/use-site-config";
import { usePageTitle } from "@/hooks/use-page-title";
import { useSession } from "@/components/providers/auth-provider";
import { AccountSetupWizard } from "@/components/account/account-setup-wizard";
import { Shield } from "lucide-react";
import type { BankAccount } from "@/lib/data/types";

export function OnboardingPage(): React.ReactElement {
  const navigate = useNavigate();
  const { data: config } = useSiteConfig();
  const session = useSession();

  usePageTitle("Set Up Your Account", config?.bankName);

  const handleComplete = useCallback(
    (_account: BankAccount): void => {
      navigate("/dashboard", { replace: true });
    },
    [navigate]
  );

  return (
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
            Welcome{session?.user.discordUsername ? `, ${session.user.discordUsername}` : ""}!
            Let&apos;s get your account set up.
          </p>
        </div>

        {/* Wizard card */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
          <AccountSetupWizard
            onComplete={handleComplete}
            title="Open your first account"
            description="Choose between a personal or business account to get started."
          />
        </div>
      </div>
    </div>
  );
}
