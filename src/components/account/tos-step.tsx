/**
 * Terms of Service acceptance step.
 *
 * Displays the bank's ToS in a scrollable textbox and requires the user
 * to type "I agree with the Terms of Service" exactly to proceed.
 * The label text remains visible as a placeholder-style hint while typing.
 *
 * The Next button is disabled (greyed out) until the confirmation phrase matches.
 */
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const REQUIRED_PHRASE = "I agree with the Terms of Service";

/**
 * Default ToS text used when the bank admin hasn't configured custom ToS.
 */
const DEFAULT_TOS_TEXT = `TERMS OF SERVICE

By opening an account with this financial institution, you agree to the following terms and conditions:

1. ACCOUNT ELIGIBILITY
You must be an active citizen of DemocracyCraft to open and maintain an account. Accounts found to be held by inactive or banned players may be frozen or closed at the bank's discretion.

2. DEPOSITS & WITHDRAWALS
All deposits must be made through approved channels (Discord bot command or in-game deposit). The bank reserves the right to hold deposits for verification purposes. Withdrawal limits may apply based on your account type.

3. TRANSFERS
Internal transfers between accounts at this bank are processed instantly. Inter-bank transfers via the BWIFT network may take up to 24 hours to settle. Transfer fees may apply based on your account type and the transfer method.

4. ACCOUNT VERIFICATION
New accounts require a minimum verification deposit. This deposit will be credited to your account balance. Accounts that are not verified within 7 days may be automatically closed.

5. PRIVACY & DATA
Your Discord username and in-game identity are stored for account identification purposes. Transaction records are maintained indefinitely for audit compliance. The bank will not share your information with third parties except as required by DemocracyCraft law.

6. ACCOUNT CLOSURE
You may close your account at any time by contacting bank administration. Any remaining balance will be returned via in-game transfer. The bank reserves the right to close accounts that violate these terms.

7. LIABILITY
The bank is not responsible for losses resulting from unauthorized access to your Discord account. You are responsible for maintaining the security of your Discord credentials. Report any suspicious activity immediately.

8. CHANGES TO TERMS
The bank reserves the right to modify these terms at any time. Continued use of your account after changes constitutes acceptance of the new terms.

By typing the confirmation phrase below, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.`;

interface TosStepProps {
  readonly onAccept: () => void;
  readonly onBack: () => void;
  /** Custom ToS from bank config. Empty/undefined = use built-in default. */
  readonly tosText?: string;
}

export function TosStep({ onAccept, onBack, tosText }: TosStepProps): React.ReactElement {
  const displayText = tosText && tosText.trim().length > 0 ? tosText : DEFAULT_TOS_TEXT;
  const [input, setInput] = useState("");

  const isMatch = useMemo(
    () => input.trim().toLowerCase() === REQUIRED_PHRASE.toLowerCase(),
    [input]
  );

  return (
    <div className="space-y-5">
      {/* ToS content in a scrollable area */}
      <ScrollArea className="h-64 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
        <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-muted-foreground">
          {displayText}
        </pre>
      </ScrollArea>

      {/* Confirmation input with persistent ghost label */}
      <div className="space-y-2">
        <Label htmlFor="tos-confirm" className="text-sm font-medium">
          Type the phrase below to continue
        </Label>
        <div className="relative">
          {/* Ghost text — always visible behind the input */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center px-3 text-sm text-muted-foreground/40"
          >
            {REQUIRED_PHRASE}
          </div>
          <Input
            id="tos-confirm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="relative border-white/[0.06] bg-transparent text-sm"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="border-white/[0.06]"
        >
          Back
        </Button>
        <Button
          className="flex-1"
          disabled={!isMatch}
          onClick={onAccept}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
