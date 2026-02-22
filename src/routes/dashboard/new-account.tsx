/**
 * Add account page — accessible from the dashboard sidebar.
 *
 * Uses the same AccountSetupWizard as onboarding, but rendered inside
 * the dashboard layout. On completion, selects the new account and
 * navigates to the overview page.
 */
import { useNavigate } from "react-router";
import { useCallback } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { useAccountContext } from "@/components/providers/account-provider";
import { AccountSetupWizard } from "@/components/account/account-setup-wizard";
import type { BankAccount } from "@/lib/data/types";

export function NewAccountPage(): React.ReactElement {
  const navigate = useNavigate();
  const { selectAccount } = useAccountContext();

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
        title="Open a new account"
        description="Add another personal or business account to your profile."
      />
    </div>
  );
}
