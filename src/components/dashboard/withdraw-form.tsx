import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { dataService } from "@/lib/data/data-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Loader2, ArrowDownToLine, AlertCircle } from "lucide-react";
import type { Transaction, WithdrawRequest } from "@/lib/data/types";
import type { CurrencyConfig } from "@/lib/config/site-config-schema";
import { formatCurrency } from "@/lib/config/currency-utils";

// ─── Validation Schema ──────────────────────────────────────

const withdrawSchema = z.object({
  amount: z
    .number({ message: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  description: z.string().max(200, "Description is too long").optional(),
});

type WithdrawData = z.infer<typeof withdrawSchema>;

// ─── Component ──────────────────────────────────────────────

interface WithdrawFormProps {
  readonly accountId: number;
  readonly currency: CurrencyConfig;
  readonly balance?: number;
  /** When true, renders without the outer Card wrapper (for use inside a Dialog). */
  readonly compact?: boolean;
  /** Called after a successful withdrawal submission. */
  readonly onSuccess?: () => void;
}

interface FormErrors {
  readonly amount?: string;
  readonly description?: string;
}

export function WithdrawForm({
  accountId,
  currency,
  balance,
  compact = false,
  onSuccess,
}: WithdrawFormProps): React.ReactElement {
  const [amountStr, setAmountStr] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const mutation = useMutation<Transaction, Error, WithdrawRequest>({
    mutationFn: (withdrawal) => dataService.createWithdrawal(withdrawal),
    onSuccess: (tx) => {
      toast.success("Withdrawal submitted", {
        description: tx.referenceId ? `Ref: ${tx.referenceId}` : undefined,
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Withdrawal failed", { description: error.message });
    },
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setErrors({});

    const parsed = withdrawSchema.safeParse({
      amount: amountStr === "" ? undefined : Number(amountStr),
      description: description.trim() || undefined,
    });

    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormErrors, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof FormErrors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    const data: WithdrawData = parsed.data;

    // Client-side balance check
    if (balance !== undefined && data.amount > balance) {
      setErrors({ amount: "Insufficient funds" });
      return;
    }

    mutation.mutate({
      fromAccountId: accountId,
      amount: data.amount,
      currency: currency.code,
      description: data.description,
    });
  };

  const resetForm = (): void => {
    setAmountStr("");
    setDescription("");
    setErrors({});
    mutation.reset();
  };

  // ─── Success State ──────────────────────────────────────

  if (mutation.isSuccess) {
    const successContent = (
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">Withdrawal Submitted</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your withdrawal is being processed.
          </p>
          {mutation.data.referenceId != null && (
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              Ref: {mutation.data.referenceId}
            </p>
          )}
        </div>
        <Button variant="outline" onClick={resetForm} className="mt-2">
          Make Another Withdrawal
        </Button>
      </div>
    );

    if (compact) return successContent;

    return (
      <Card className="mx-auto max-w-lg border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <CardContent>{successContent}</CardContent>
      </Card>
    );
  }

  // ─── Form ───────────────────────────────────────────────

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Amount */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="withdraw-amount">Amount</Label>
          {balance !== undefined && (
            <span className="text-xs text-muted-foreground">
              Available: {formatCurrency(balance, currency)}
            </span>
          )}
        </div>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {currency.symbol}
          </span>
          <Input
            id="withdraw-amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            className="border-white/[0.06] bg-white/[0.02] pl-16"
            aria-invalid={!!errors.amount}
          />
        </div>
        {errors.amount && (
          <p className="text-xs text-destructive">{errors.amount}</p>
        )}
      </div>

      {/* Description (optional) */}
      <div className="space-y-2">
        <Label htmlFor="withdraw-description">
          Reference <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="withdraw-description"
          placeholder="What is this withdrawal for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-white/[0.06] bg-white/[0.02]"
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description}</p>
        )}
      </div>

      {/* API error */}
      {mutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {mutation.error.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Submit */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            Withdraw Funds
          </>
        )}
      </Button>
    </form>
  );

  if (compact) return formContent;

  return (
    <Card className="mx-auto max-w-lg border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Withdraw Funds</CardTitle>
        <CardDescription>
          Withdraw funds from your account.
        </CardDescription>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}
