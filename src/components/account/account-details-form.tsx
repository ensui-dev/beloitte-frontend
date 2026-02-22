/**
 * Account details form — renders different fields based on account type.
 *
 * Personal:  In-Game Name, Total Cash Balance / Net Worth, Initial Deposit
 * Business:  Business Entity Name, Company Capital, Initial Deposit
 *
 * Follows the same manual useState + Zod safeParse pattern as TransferForm.
 */
import { useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCreateAccount } from "@/hooks/use-account";
import { useSession } from "@/components/providers/auth-provider";
import type { AccountType, BankAccount } from "@/lib/data/types";

// ─── Validation Schemas ─────────────────────────────────────

const personalSchema = z.object({
  accountName: z.string().min(1, "In-game name is required").max(32, "Name must be 32 characters or less"),
  netWorth: z.number({ message: "Must be a number" }).nonnegative("Must be zero or positive"),
  initialDeposit: z.number({ message: "Must be a number" }).positive("Initial deposit must be greater than 0"),
});

const businessSchema = z.object({
  accountName: z.string().min(1, "Business entity name is required").max(64, "Name must be 64 characters or less"),
  companyCapital: z.number({ message: "Must be a number" }).nonnegative("Must be zero or positive"),
  initialDeposit: z.number({ message: "Must be a number" }).positive("Initial deposit must be greater than 0"),
});

interface FormErrors {
  accountName?: string;
  netWorth?: string;
  companyCapital?: string;
  initialDeposit?: string;
}

interface AccountDetailsFormProps {
  readonly accountType: AccountType;
  readonly onSuccess: (account: BankAccount) => void;
  readonly onBack: () => void;
}

export function AccountDetailsForm({
  accountType,
  onSuccess,
  onBack,
}: AccountDetailsFormProps): React.ReactElement {
  const session = useSession();
  const mutation = useCreateAccount();

  const [accountName, setAccountName] = useState("");
  const [amountField, setAmountField] = useState(""); // net worth (personal) or company capital (business)
  const [initialDeposit, setInitialDeposit] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const isPersonal = accountType === "personal";

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setErrors({});

    const schema = isPersonal ? personalSchema : businessSchema;

    const raw = isPersonal
      ? {
          accountName,
          netWorth: amountField === "" ? undefined : Number(amountField),
          initialDeposit: initialDeposit === "" ? undefined : Number(initialDeposit),
        }
      : {
          accountName,
          companyCapital: amountField === "" ? undefined : Number(amountField),
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

    mutation.mutate(
      {
        bankId: session?.bankId ?? "demo-bank-001",
        accountType,
        accountName: parsed.data.accountName,
        initialDeposit: parsed.data.initialDeposit,
        netWorth: isPersonal ? (parsed.data as z.infer<typeof personalSchema>).netWorth : undefined,
        companyCapital: !isPersonal ? (parsed.data as z.infer<typeof businessSchema>).companyCapital : undefined,
      },
      {
        onSuccess: (account) => {
          onSuccess(account);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Account name */}
      <div className="space-y-2">
        <Label htmlFor="account-name">
          {isPersonal ? "In-Game Name" : "Business Entity Name"}
        </Label>
        <Input
          id="account-name"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder={isPersonal ? "Your Minecraft username" : "e.g. MarbleCorp Industries"}
          className="border-white/[0.06] bg-white/[0.02]"
          autoFocus
        />
        {errors.accountName && (
          <p className="text-xs text-destructive">{errors.accountName}</p>
        )}
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Type-specific amount field */}
      <div className="space-y-2">
        <Label htmlFor="amount-field">
          {isPersonal ? "Total Cash Balance / Net Worth" : "Company Capital"}
        </Label>
        <p className="text-xs text-muted-foreground">
          {isPersonal
            ? "Your current total in-game wealth. This is for our records — it won't affect your account balance."
            : "Total capital of the business entity. This is for our records — it won't affect your account balance."}
        </p>
        <Input
          id="amount-field"
          type="number"
          value={amountField}
          onChange={(e) => setAmountField(e.target.value)}
          placeholder="0.00"
          min={0}
          step="0.01"
          className="border-white/[0.06] bg-white/[0.02]"
        />
        {(isPersonal ? errors.netWorth : errors.companyCapital) && (
          <p className="text-xs text-destructive">
            {isPersonal ? errors.netWorth : errors.companyCapital}
          </p>
        )}
      </div>

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
