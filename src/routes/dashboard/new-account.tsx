/**
 * Add account page — accessible from the dashboard sidebar.
 *
 * Uses the same AccountSetupWizard as onboarding, but rendered inside
 * the dashboard layout. On completion, selects the new account and
 * navigates to the overview page.
 */
import { useNavigate, useSearchParams } from "react-router";
import { useCallback } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { useAccountContext } from "@/components/providers/account-provider";
import { useSiteConfigContext } from "@/components/providers/site-config-provider";
import { AccountSetupWizard } from "@/components/account/account-setup-wizard";
import type { BankAccount } from "@/lib/data/types";

export function NewAccountPage(): React.ReactElement {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { selectAccount } = useAccountContext();
  const config = useSiteConfigContext();

  // ?type=business pre-selects business account creation (e.g. from "For Business" CTA)
  const isBusiness = searchParams.get("type") === "business";

  usePageTitle("New Account");

  const handleComplete = useCallback(
    (account: BankAccount): void => {
      selectAccount(account.id);
      navigate("/dashboard/overview", { replace: true });
    },
    [navigate, selectAccount]
  );

  return (
    <div className="mx-auto max-w-lg py-8">
      <AccountSetupWizard
        onComplete={handleComplete}
        title={isBusiness ? "Open a business account" : "Open a new account"}
        description={
          isBusiness
            ? "Tell us about your business to get started."
            : "Add another personal or business account to your profile."
        }
        initialAccountType={isBusiness ? "business" : undefined}
        verificationChannelName={config.verificationChannelName}
        gameBusinessName={config.gameBusinessName}
        tosText={config.tosText}
      />
    </div>
  );
}
