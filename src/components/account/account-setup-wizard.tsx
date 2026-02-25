/**
 * Account setup wizard — orchestrates the multi-step account creation flow.
 *
 * Steps:
 *   1. Choose account type (personal / business)
 *   2. Fill in nickname
 *   3. Accept Terms of Service (type confirmation phrase)
 *   4. Account created → verification deposit (Discord Pay or In-Game)
 *
 * Account creation happens after ToS acceptance. The account starts
 * with status "pending_verification" until the verification deposit
 * is confirmed.
 *
 * Shared by the onboarding page (new users) and the add-account page (existing users).
 */
import { useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { AccountTypeSelector } from "./account-type-selector";
import { AccountDetailsForm } from "./account-details-form";
import { TosStep } from "./tos-step";
import { VerificationStep } from "./verification-step";
import { useCreateAccount } from "@/hooks/use-account";
import { dataService } from "@/lib/data/data-service";
import type { AccountCategory, BankAccount } from "@/lib/data/types";

type WizardStep = "type" | "details" | "tos" | "creating" | "verification";

interface AccountSetupWizardProps {
  /** Called when the full flow is complete (account created + verified). */
  readonly onComplete: (account: BankAccount) => void;
  /** Optional heading override. */
  readonly title?: string;
  /** Optional subheading override. */
  readonly description?: string;
  /** Pre-select account category and skip the type-selection step. */
  readonly initialAccountType?: AccountCategory;
  /** Discord channel name for verification (from site config). */
  readonly verificationChannelName?: string;
  /** In-game registered business entity name used in /pay and /db commands. */
  readonly gameBusinessName?: string;
  /** Custom ToS from bank config. Empty/undefined = use built-in default. */
  readonly tosText?: string;
}

/** Generate a short random verification slug (6 uppercase alphanumeric chars). */
function generateVerificationSlug(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let slug = "";
  for (let i = 0; i < 6; i++) {
    slug += chars[Math.floor(Math.random() * chars.length)];
  }
  return slug;
}

export function AccountSetupWizard({
  onComplete,
  title = "Set up your account",
  description = "Choose the type of account you'd like to open.",
  initialAccountType,
  verificationChannelName = "#deposit-here",
  gameBusinessName = "Beloitte",
  tosText,
}: AccountSetupWizardProps): React.ReactElement {
  const [step, setStep] = useState<WizardStep>(initialAccountType ? "details" : "type");
  const [accountType, setAccountType] = useState<AccountCategory | null>(initialAccountType ?? null);
  const [nickname, setNickname] = useState("");
  const [createdAccount, setCreatedAccount] = useState<BankAccount | null>(null);
  const [verificationSlug] = useState(generateVerificationSlug);
  const [createError, setCreateError] = useState<string | null>(null);

  const createMutation = useCreateAccount();

  // After ToS acceptance, create the account and move to verification
  const handleTosAccept = useCallback((): void => {
    if (!accountType) return;
    setStep("creating");
    setCreateError(null);

    const accountTypeName = accountType === "personal"
      ? "personal_checking" as const
      : "business_checking" as const;

    createMutation.mutate(
      {
        accountType: accountTypeName,
        nickname: nickname || undefined,
      },
      {
        onSuccess: (account) => {
          setCreatedAccount(account);
          setStep("verification");
        },
        onError: (error) => {
          setCreateError(error.message);
          // Go back to ToS so user can retry
          setStep("tos");
        },
      }
    );
  }, [accountType, nickname, createMutation]);

  // Mock mode: always returns true. Production: calls backend verification endpoint.
  const handleCheckVerification = useCallback(async (): Promise<boolean> => {
    if (!createdAccount) return false;
    return dataService.verifyAccount(createdAccount.id);
  }, [createdAccount]);

  const handleVerified = useCallback((): void => {
    if (createdAccount) {
      onComplete(createdAccount);
    }
  }, [createdAccount, onComplete]);

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
          onSubmit={(name) => {
            setNickname(name);
            setStep("tos");
          }}
          onBack={() => setStep("type")}
          initialNickname={nickname}
        />
      </div>
    );
  }

  // Step 3: Terms of Service
  if (step === "tos") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Terms of Service</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Please read and accept the Terms of Service to continue.
          </p>
        </div>

        {createError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Account creation failed: {createError}. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <TosStep
          onAccept={handleTosAccept}
          onBack={() => setStep("details")}
          tosText={tosText}
        />
      </div>
    );
  }

  // Step 3.5: Creating account (loading state between ToS and verification)
  if (step === "creating") {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Creating your account…</p>
      </div>
    );
  }

  // Step 4: Verification
  return (
    <VerificationStep
      channelName={verificationChannelName}
      gameBusinessName={gameBusinessName}
      verificationSlug={verificationSlug}
      onVerified={handleVerified}
      onCheckVerification={handleCheckVerification}
    />
  );
}
