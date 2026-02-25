/**
 * ToS setup step for the bank setup wizard.
 *
 * Lets the admin paste or edit the Terms of Service text that will
 * be shown to customers during account creation. Pre-filled with a
 * template that uses the bank name.
 */
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TosSetupStepProps {
  readonly value: string;
  readonly bankName: string;
  readonly onChange: (text: string) => void;
}

/**
 * Generate a default ToS template with the bank name injected.
 */
export function generateDefaultTos(bankName: string): string {
  const name = bankName || "this financial institution";
  return `TERMS OF SERVICE

By opening an account with ${name}, you agree to the following terms and conditions:

1. ACCOUNT ELIGIBILITY
You must be an active citizen of DemocracyCraft to open and maintain an account. Accounts found to be held by inactive or banned players may be frozen or closed at the bank's discretion.

2. DEPOSITS & WITHDRAWALS
All deposits must be made through approved channels (Discord bot command or in-game deposit). ${name} reserves the right to hold deposits for verification purposes. Withdrawal limits may apply based on your account type.

3. TRANSFERS
Internal transfers between accounts at ${name} are processed instantly. Inter-bank transfers via the BWIFT network may take up to 24 hours to settle. Transfer fees may apply based on your account type and the transfer method.

4. ACCOUNT VERIFICATION
New accounts require a minimum verification deposit. This deposit will be credited to your account balance. Accounts that are not verified within 7 days may be automatically closed.

5. PRIVACY & DATA
Your Discord username and in-game identity are stored for account identification purposes. Transaction records are maintained indefinitely for audit compliance. ${name} will not share your information with third parties except as required by DemocracyCraft law.

6. ACCOUNT CLOSURE
You may close your account at any time by contacting bank administration. Any remaining balance will be returned via in-game transfer. ${name} reserves the right to close accounts that violate these terms.

7. LIABILITY
${name} is not responsible for losses resulting from unauthorized access to your Discord account. You are responsible for maintaining the security of your Discord credentials. Report any suspicious activity immediately.

8. CHANGES TO TERMS
${name} reserves the right to modify these terms at any time. Continued use of your account after changes constitutes acceptance of the new terms.

By typing the confirmation phrase below, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.`;
}

export function TosSetupStep({
  value,
  bankName,
  onChange,
}: TosSetupStepProps): React.ReactElement {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Terms of Service</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Customize the Terms of Service shown to customers when they open an account.
          A template has been pre-filled using your bank name.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="setup-tos">ToS Content</Label>
        <Textarea
          id="setup-tos"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter your bank's Terms of Service...`}
          rows={12}
          className="field-sizing-fixed resize-y border-white/[0.06] bg-white/[0.02] font-mono text-xs leading-relaxed"
        />
        <p className="text-xs text-muted-foreground">
          {value.length > 0
            ? `${value.length.toLocaleString()} characters`
            : `Pre-filled with template for "${bankName || "your bank"}"`}
        </p>
      </div>
    </div>
  );
}
