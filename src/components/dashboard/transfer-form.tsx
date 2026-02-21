import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { dataService } from "@/lib/data/data-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Loader2, Send, AlertCircle } from "lucide-react";
import type { Transaction, TransferRequest } from "@/lib/data/types";
import type { CurrencyConfig } from "@/lib/config/site-config-schema";

// ─── Validation Schema ──────────────────────────────────────

const transferSchema = z.object({
  toBankCode: z
    .string()
    .min(1, "Bank code is required")
    .max(10, "Bank code is too long")
    .regex(/^[A-Za-z0-9]+$/, "Bank code must be alphanumeric"),
  toAccountNumber: z
    .string()
    .min(1, "Account number is required")
    .max(30, "Account number is too long"),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  description: z.string().max(200, "Description is too long").optional(),
});

// ─── Component ──────────────────────────────────────────────

interface TransferFormProps {
  readonly accountId: string;
  readonly currency: CurrencyConfig;
}

interface FormErrors {
  readonly toBankCode?: string;
  readonly toAccountNumber?: string;
  readonly amount?: string;
  readonly description?: string;
}

export function TransferForm({ accountId, currency }: TransferFormProps): React.ReactElement {
  const [toBankCode, setToBankCode] = useState("");
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [amountStr, setAmountStr] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const mutation = useMutation<Transaction, Error, TransferRequest>({
    mutationFn: (transfer) => dataService.createTransfer(transfer),
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setErrors({});

    const parsed = transferSchema.safeParse({
      toBankCode: toBankCode.trim(),
      toAccountNumber: toAccountNumber.trim(),
      amount: amountStr === "" ? undefined : Number(amountStr),
      description: description.trim() || undefined,
    });

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

    mutation.mutate({
      fromAccountId: accountId,
      toBankCode: parsed.data.toBankCode,
      toAccountNumber: parsed.data.toAccountNumber,
      amount: parsed.data.amount,
      currency: currency.code,
      description: parsed.data.description,
    });
  };

  const resetForm = (): void => {
    setToBankCode("");
    setToAccountNumber("");
    setAmountStr("");
    setDescription("");
    setErrors({});
    mutation.reset();
  };

  // ─── Success State ──────────────────────────────────────

  if (mutation.isSuccess) {
    return (
      <Card className="mx-auto max-w-lg border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">Transfer Submitted</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your transfer is being processed.
            </p>
            {mutation.data.reference && (
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                Ref: {mutation.data.reference}
              </p>
            )}
          </div>
          <Button variant="outline" onClick={resetForm} className="mt-2">
            Send Another Transfer
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ─── Form ───────────────────────────────────────────────

  return (
    <Card className="mx-auto max-w-lg border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Send a Transfer</CardTitle>
        <CardDescription>
          Transfer funds to any account in the BWIFT network.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Recipient bank code */}
          <div className="space-y-2">
            <Label htmlFor="bankCode">Recipient bank code</Label>
            <Input
              id="bankCode"
              placeholder="e.g. RNB"
              value={toBankCode}
              onChange={(e) => setToBankCode(e.target.value)}
              className="border-white/[0.06] bg-white/[0.02]"
              aria-invalid={!!errors.toBankCode}
            />
            {errors.toBankCode && (
              <p className="text-xs text-destructive">{errors.toBankCode}</p>
            )}
          </div>

          {/* Recipient account number */}
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Recipient account number</Label>
            <Input
              id="accountNumber"
              placeholder="e.g. RNB-00012345"
              value={toAccountNumber}
              onChange={(e) => setToAccountNumber(e.target.value)}
              className="border-white/[0.06] bg-white/[0.02]"
              aria-invalid={!!errors.toAccountNumber}
            />
            {errors.toAccountNumber && (
              <p className="text-xs text-destructive">{errors.toAccountNumber}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({currency.symbol})</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              className="border-white/[0.06] bg-white/[0.02]"
              aria-invalid={!!errors.amount}
            />
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount}</p>
            )}
          </div>

          {/* Description (optional) */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="description"
              placeholder="What is this transfer for?"
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
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Transfer
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
