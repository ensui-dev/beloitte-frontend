import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { dataService } from "@/lib/data/data-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Loader2, Send, AlertCircle, Building2 } from "lucide-react";
import type { Transaction, TransferRequest } from "@/lib/data/types";
import type { CurrencyConfig } from "@/lib/config/site-config-schema";
import { formatCurrency } from "@/lib/config/currency-utils";

// ─── BWIFT IBAN Utilities ───────────────────────────────────

/**
 * BWIFT IBAN format: 2 letters (server) + 2 digits (check) + 4 letters (bank) + 14 digits (account)
 * Example: DC12RVNB00000000042069
 * Display: DC12 RVNB 0000 0000 0420 69
 */
const BWIFT_IBAN_REGEX = /^[A-Z]{2}\d{2}[A-Z]{4}\d{14}$/;
const BWIFT_IBAN_LENGTH = 22;

/** Strip all spaces from an IBAN string. */
function stripIban(value: string): string {
  return value.replace(/\s/g, "").toUpperCase();
}

/** Format a raw IBAN into groups of 4 for display. */
function formatIban(raw: string): string {
  const clean = stripIban(raw);
  return clean.replace(/(.{4})(?=.)/g, "$1 ");
}

/** Extract the 4-letter bank identifier from a valid IBAN. */
function extractBankCode(iban: string): string {
  return stripIban(iban).slice(4, 8);
}

// ─── Validation Schema ──────────────────────────────────────

const transferSchema = z.object({
  toIban: z
    .string()
    .min(1, "Recipient IBAN is required")
    .transform(stripIban)
    .pipe(
      z
        .string()
        .length(BWIFT_IBAN_LENGTH, `IBAN must be exactly ${BWIFT_IBAN_LENGTH} characters`)
        .regex(BWIFT_IBAN_REGEX, "Invalid BWIFT IBAN format")
    ),
  amount: z
    .number({ message: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  description: z.string().max(200, "Description is too long").optional(),
});

// ─── Component ──────────────────────────────────────────────

interface TransferFormProps {
  readonly accountId: string;
  readonly currency: CurrencyConfig;
  readonly balance?: number;
}

interface FormErrors {
  toIban?: string;
  amount?: string;
  description?: string;
}

export function TransferForm({ accountId, currency, balance }: TransferFormProps): React.ReactElement {
  const [ibanRaw, setIbanRaw] = useState("");
  const [amountStr, setAmountStr] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const mutation = useMutation<Transaction, Error, TransferRequest>({
    mutationFn: (transfer) => dataService.createTransfer(transfer),
  });

  // Derive parsed state from raw input
  const cleanIban = stripIban(ibanRaw);
  const ibanValid = BWIFT_IBAN_REGEX.test(cleanIban);
  const parsedBankCode = ibanValid ? extractBankCode(cleanIban) : null;

  const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const raw = e.target.value;
    // Allow only alphanumeric and spaces, cap at IBAN length + spaces
    const filtered = raw.replace(/[^a-zA-Z0-9\s]/g, "");
    const clean = stripIban(filtered);
    if (clean.length <= BWIFT_IBAN_LENGTH) {
      setIbanRaw(formatIban(clean));
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setErrors({});

    const parsed = transferSchema.safeParse({
      toIban: ibanRaw,
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
      toIban: parsed.data.toIban as string,
      amount: parsed.data.amount as number,
      currency: currency.code,
      description: parsed.data.description as string | undefined,
    });
  };

  const resetForm = (): void => {
    setIbanRaw("");
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
          {/* Recipient IBAN */}
          <div className="space-y-2">
            <Label htmlFor="iban">Recipient IBAN</Label>
            <Input
              id="iban"
              placeholder="DC00 XXXX 0000 0000 0000 00"
              value={ibanRaw}
              onChange={handleIbanChange}
              className="border-white/[0.06] bg-white/[0.02] font-mono tracking-wider"
              aria-invalid={!!errors.toIban}
              autoComplete="off"
              spellCheck={false}
            />
            {errors.toIban && (
              <p className="text-xs text-destructive">{errors.toIban}</p>
            )}
            {parsedBankCode && !errors.toIban && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <Building2 className="h-3 w-3" />
                Bank identified: {parsedBankCode}
              </div>
            )}
          </div>

          <Separator className="bg-white/[0.06]" />

          {/* Amount */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="amount">Amount</Label>
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
                id="amount"
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
            <Label htmlFor="description">
              Reference <span className="text-muted-foreground">(optional)</span>
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
