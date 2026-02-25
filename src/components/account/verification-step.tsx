/**
 * Account verification step — shows two options for verifying a new account.
 *
 * Option A: Discord Pay — run /pay in a specific Discord channel
 * Option B: In-Game — run /db deposit with a LINK- verification slug
 *
 * The verification deposit (minimum $1) counts toward the account balance,
 * so overpayment is fine and credited in full.
 *
 * In mock mode, clicking "Verify Transaction" immediately succeeds.
 * In production, the backend checks for the matching deposit.
 */
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface VerificationStepProps {
  /** The bank's configured Discord verification channel name (e.g. "#deposit-here"). */
  readonly channelName: string;
  /** The bank entity name used in /pay and /db commands (e.g. "Beloitte"). */
  readonly gameBusinessName: string;
  /** A unique slug for in-game deposit verification (e.g. "A3F9K2"). */
  readonly verificationSlug: string;
  /** Called when verification is confirmed. */
  readonly onVerified: () => void;
  /** Called to trigger the verification check. Returns true if verified. */
  readonly onCheckVerification: () => Promise<boolean>;
}

export function VerificationStep({
  channelName,
  gameBusinessName,
  verificationSlug,
  onVerified,
  onCheckVerification,
}: VerificationStepProps): React.ReactElement {
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (): Promise<void> => {
    setChecking(true);
    setError(null);

    try {
      const verified = await onCheckVerification();
      if (verified) {
        toast.success("Account verified", {
          description: "Your deposit has been confirmed. Welcome aboard!",
        });
        onVerified();
      } else {
        setError("No matching deposit found yet. Please complete the payment and try again.");
      }
    } catch {
      setError("Verification check failed. Please try again in a moment.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold uppercase tracking-widest">
          Account Verification
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Required before accessing the Treasury
        </p>
      </div>

      {/* Progress indicator: step 1 (done) → step 2 (current) */}
      <div className="flex items-center justify-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-primary bg-primary/20 text-xs font-semibold text-primary">
          1
        </div>
        <div className="h-px w-16 bg-primary/40" />
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-primary text-xs font-semibold text-primary">
          2
        </div>
      </div>

      {/* Two-column options */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Option A: Discord Pay */}
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
          <h3 className="mb-2 text-center text-sm font-semibold text-primary">
            Option A: Discord Pay
          </h3>
          <p className="mb-3 text-center text-xs text-muted-foreground">
            Use the server bot in {channelName} on the Discord
          </p>
          <div className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-center">
            <code className="text-xs text-primary">
              /pay amount: 1 business: {gameBusinessName}
            </code>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground italic">
            (Easiest method)
          </p>
        </div>

        {/* Option B: In-Game */}
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
          <h3 className="mb-2 text-center text-sm font-semibold text-primary">
            Option B: In-Game
          </h3>
          <p className="mb-3 text-center text-xs text-muted-foreground">
            Or without Discord
          </p>
          <div className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-center">
            <code className="text-xs text-primary">
              /db deposit {gameBusinessName} 1 LINK-{verificationSlug}
            </code>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        After completing Option A or B:
      </p>

      {/* Error alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Verify button */}
      <Button
        className="w-full"
        size="lg"
        onClick={handleVerify}
        disabled={checking}
      >
        {checking ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking…
          </>
        ) : (
          "Verify Transaction"
        )}
      </Button>
    </div>
  );
}
