/**
 * Account setup wizard — orchestrates the multi-step account creation flow.
 *
 * Steps:
 *   1. Choose account type (personal / business)
 *   2. Fill in type-specific details + submit
 *   3. Success confirmation with account number
 *
 * Shared by the onboarding page (new users) and the add-account page (existing users).
 */
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountTypeSelector } from "./account-type-selector";
import { AccountDetailsForm } from "./account-details-form";
import type { AccountType, BankAccount } from "@/lib/data/types";

type WizardStep = "type" | "details" | "success";

interface AccountSetupWizardProps {
  /** Called when account creation is complete. */
  readonly onComplete: (account: BankAccount) => void;
  /** Optional heading override. */
  readonly title?: string;
  /** Optional subheading override. */
  readonly description?: string;
}

export function AccountSetupWizard({
  onComplete,
  title = "Set up your account",
  description = "Choose the type of account you'd like to open.",
}: AccountSetupWizardProps): React.ReactElement {
  const [step, setStep] = useState<WizardStep>("type");
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [createdAccount, setCreatedAccount] = useState<BankAccount | null>(null);

  // Step 1: Type selection
  if (step === "type") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>

        <AccountTypeSelector
          selected={accountType}
          onSelect={setAccountType}
        />

        <Button
          className="w-full"
          size="lg"
          disabled={accountType === null}
          onClick={() => setStep("details")}
        >
          Continue
        </Button>
      </div>
    );
  }

  // Step 2: Details form
  if (step === "details" && accountType !== null) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {accountType === "personal" ? "Personal Account Details" : "Business Account Details"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {accountType === "personal"
              ? "Tell us about yourself so we can set up your account."
              : "Tell us about your business so we can set up your account."}
          </p>
        </div>

        <AccountDetailsForm
          accountType={accountType}
          onSuccess={(account) => {
            setCreatedAccount(account);
            setStep("success");
          }}
          onBack={() => setStep("type")}
        />
      </div>
    );
  }

  // Step 3: Success
  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">Account Created</h2>
        <p className="text-sm text-muted-foreground">
          Your {createdAccount?.accountType === "business" ? "business" : "personal"} account
          {createdAccount?.accountName ? ` "${createdAccount.accountName}"` : ""} is ready.
        </p>
      </div>

      {createdAccount?.accountNumber && (
        <div className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="text-xs text-muted-foreground">Account Number (BWIFT IBAN)</p>
          <p className="mt-1 font-mono text-sm tracking-wider">
            {createdAccount.accountNumber}
          </p>
        </div>
      )}

      <Button
        className="w-full"
        size="lg"
        onClick={() => {
          if (createdAccount) {
            onComplete(createdAccount);
          }
        }}
      >
        Go to Dashboard
      </Button>
    </div>
  );
}
