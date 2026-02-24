/**
 * Account details form — renders different fields based on account category.
 *
 * Personal:  Nickname (In-Game Name), Initial Deposit
 * Business:  Nickname (Business Entity Name), Initial Deposit
 *
 * The form collects what the backend's CreateAccountRequest expects:
 *   accountType (e.g. "personal_checking"), nickname, initialDeposit, businessId
 *
 * Follows the same manual useState + Zod safeParse pattern as TransferForm.
 */
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCreateAccount } from "@/hooks/use-account";
import { getAccountDisplayName, type AccountCategory, type BankAccount } from "@/lib/data/types";

// ─── Validation Schemas ─────────────────────────────────────

const personalSchema = z.object({
  nickname: z.string().min(1, "In-game name is required").max(32, "Name must be 32 characters or less"),
  initialDeposit: z.number({ message: "Must be a number" }).positive("Initial deposit must be greater than 0"),
});

const businessSchema = z.object({
  nickname: z.string().min(1, "Business entity name is required").max(64, "Name must be 64 characters or less"),
  initialDeposit: z.number({ message: "Must be a number" }).positive("Initial deposit must be greater than 0"),
});

interface FormErrors {
  nickname?: string;
  initialDeposit?: string;
}

interface AccountDetailsFormProps {
  readonly accountType: AccountCategory;
  readonly onSuccess: (account: BankAccount) => void;
  readonly onBack: () => void;
}

export function AccountDetailsForm({
  accountType,
  onSuccess,
  onBack,
}: AccountDetailsFormProps): React.ReactElement {
  const mutation = useCreateAccount();

  const [nickname, setNickname] = useState("");
  const [initialDeposit, setInitialDeposit] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const isPersonal = accountType === "personal";

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setErrors({});

    const schema = isPersonal ? personalSchema : businessSchema;

    const raw = {
      nickname,
      initialDeposit: initialDeposit === "" ? undefined : Number(initialDeposit),
    };

    const parsed = schema.safeParse(raw);

    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof FormErrors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    // Map category to a concrete account type name for the backend
    const accountTypeName = isPersonal ? "personal_checking" as const : "business_checking" as const;

    mutation.mutate(
      {
        accountType: accountTypeName,
        nickname: parsed.data.nickname,
        initialDeposit: parsed.data.initialDeposit,
      },
      {
        onSuccess: (account) => {
          const displayName = getAccountDisplayName(account);
          toast.success("Account created", {
            description: displayName
              ? `"${displayName}" is ready to use.`
              : undefined,
          });
          onSuccess(account);
        },
        onError: (error) => {
          toast.error("Account creation failed", { description: error.message });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Account nickname */}
      <div className="space-y-2">
        <Label htmlFor="account-name">
          {isPersonal ? "In-Game Name" : "Business Entity Name"}
        </Label>
        <Input
          id="account-name"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder={isPersonal ? "Your Minecraft username" : "e.g. MarbleCorp Industries"}
          className="border-white/[0.06] bg-white/[0.02]"
          autoFocus
        />
        {errors.nickname && (
          <p className="text-xs text-destructive">{errors.nickname}</p>
        )}
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Initial deposit */}
      <div className="space-y-2">
        <Label htmlFor="initial-deposit">Initial Deposit</Label>
        <p className="text-xs text-muted-foreground">
          The amount to deposit into your new account. This will be your starting balance.
        </p>
        <Input
          id="initial-deposit"
          type="number"
          value={initialDeposit}
          onChange={(e) => setInitialDeposit(e.target.value)}
          placeholder="0.00"
          min={0}
          step="0.01"
          className="border-white/[0.06] bg-white/[0.02]"
        />
        {errors.initialDeposit && (
          <p className="text-xs text-destructive">{errors.initialDeposit}</p>
        )}
      </div>

      {/* API error */}
      {mutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{mutation.error.message}</AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="border-white/[0.06]"
          disabled={mutation.isPending}
        >
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account…
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </div>
    </form>
  );
}
