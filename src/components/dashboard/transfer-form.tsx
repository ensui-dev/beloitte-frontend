import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
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
 * BWIFT IBAN format: 2 letters (country) + 2 digits (check) + 4 letters (bank) + 14 alphanumeric (account)
 * The account portion is a snowflake ID encoded in base-36, zero-padded to 14 characters.
 * Example: DC45BELT0000DVVNQO2AM6
 * Display: DC45 BELT 0000 DVVN QO2A M6
 */
const BWIFT_IBAN_REGEX = /^[A-Z]{2}\d{2}[A-Z]{4}[A-Z0-9]{14}$/;
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

/**
 * Validate BWIFT IBAN check digits using ISO 13616 mod-97-10.
 *
 * 1. Rearrange: move the first 4 chars (country + check) to the end
 * 2. Convert letters → numbers (A=10 ... Z=35)
 * 3. Compute mod 97 — a valid IBAN always gives remainder 1
 */
function validateIbanChecksum(iban: string): boolean {
  const clean = stripIban(iban);
  if (clean.length !== BWIFT_IBAN_LENGTH) return false;
  if (!BWIFT_IBAN_REGEX.test(clean)) return false;

  // Rearrange: bank code + account + country code + check digits
  const rearranged = clean.slice(4) + clean.slice(0, 4);

  // Convert letters to their numeric equivalents
  let numericStr = "";
  for (const ch of rearranged) {
    const code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      numericStr += String(code - 55); // A=10, B=11, ...
    } else {
      numericStr += ch;
    }
  }

  // Compute mod 97 in chunks to avoid BigInt overhead
  let remainder = 0;
  for (const digit of numericStr) {
    remainder = (remainder * 10 + Number(digit)) % 97;
  }

  return remainder === 1;
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
        .refine(validateIbanChecksum, "Invalid IBAN - check digits do not match")
    ),
  amount: z
    .number({ message: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  description: z.string().max(200, "Description is too long").optional(),
});

// ─── Component ──────────────────────────────────────────────

interface TransferFormProps {
  readonly accountId: number;
  readonly currency: CurrencyConfig;
  readonly balance?: number;
  /** When true, renders without the outer Card wrapper (for use inside a Dialog). */
  readonly compact?: boolean;
  /** Called after a successful transfer submission. */
  readonly onSuccess?: () => void;
}

interface FormErrors {
  readonly toIban?: string;
  readonly amount?: string;
  readonly description?: string;
}

type TransferData = z.infer<typeof transferSchema>;

export function TransferForm({ accountId, currency, balance, compact = false, onSuccess }: TransferFormProps): React.ReactElement {
  const [ibanRaw, setIbanRaw] = useState("");
  const [amountStr, setAmountStr] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const mutation = useMutation<Transaction, Error, TransferRequest>({
    mutationFn: (transfer) => dataService.createTransfer(transfer),
    onSuccess: (tx) => {
      toast.success("Transfer submitted", {
        description: tx.referenceId ? `Ref: ${tx.referenceId}` : undefined,
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Transfer failed", { description: error.message });
    },
  });

  // Derive parsed state from raw input
  const cleanIban = stripIban(ibanRaw);
  const ibanFormatValid = BWIFT_IBAN_REGEX.test(cleanIban);
  const ibanChecksumValid = ibanFormatValid && validateIbanChecksum(cleanIban);
  const parsedBankCode = ibanChecksumValid ? extractBankCode(cleanIban) : null;

  const ibanRef = useRef<HTMLInputElement>(null);

  const handleIbanChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const input = e.target;
    const raw = input.value;
    const cursorPos = input.selectionStart ?? raw.length;

    // Allow only alphanumeric and spaces, cap at IBAN length + spaces
    const filtered = raw.replace(/[^a-zA-Z0-9\s]/g, "");
    const clean = stripIban(filtered);
    if (clean.length > BWIFT_IBAN_LENGTH) return;

    // Count how many "real" (non-space) characters are before the cursor
    let realCharsBefore = 0;
    for (let i = 0; i < cursorPos && i < raw.length; i++) {
      if (raw[i] !== " ") realCharsBefore++;
    }

    const formatted = formatIban(clean);
    setIbanRaw(formatted);

    // Map the real-char count back to a position in the formatted string
    let newCursor = 0;
    let counted = 0;
    while (counted < realCharsBefore && newCursor < formatted.length) {
      if (formatted[newCursor] !== " ") counted++;
      newCursor++;
    }

    // Restore cursor on next frame (after React commits the value)
    requestAnimationFrame(() => {
      ibanRef.current?.setSelectionRange(newCursor, newCursor);
    });
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

    const data: TransferData = parsed.data;
    mutation.mutate({
      fromAccountId: accountId,
      toIban: data.toIban,
      amount: data.amount,
      currency: currency.code,
      description: data.description,
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
    const successContent = (
      <div className="flex flex-col items-center gap-4 py-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">Transfer Submitted</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your transfer is being processed.
          </p>
          {mutation.data.referenceId != null && (
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              Ref: {mutation.data.referenceId}
            </p>
          )}
        </div>
        <Button variant="outline" onClick={resetForm} className="mt-2">
          Send Another Transfer
        </Button>
      </div>
    );

    if (compact) return successContent;

    return (
      <Card className="mx-auto max-w-lg border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <CardContent className="py-12">{successContent}</CardContent>
      </Card>
    );
  }

  // ─── Form ───────────────────────────────────────────────

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Recipient IBAN */}
      <div className="space-y-2">
        <Label htmlFor="iban">Recipient IBAN</Label>
        <div className="relative">
          {/* Ghost text — persistent IBAN template visible behind input */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center px-3 font-mono text-sm tracking-wider text-muted-foreground/30"
          >
            DC00 XXXX 0000 XXXX XXXX XX
          </div>
          <Input
            ref={ibanRef}
            id="iban"
            value={ibanRaw}
            onChange={handleIbanChange}
            className="relative border-white/[0.06] bg-transparent font-mono tracking-wider"
            aria-invalid={!!errors.toIban}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        {errors.toIban && (
          <p className="text-xs text-destructive">{errors.toIban}</p>
        )}
        {!errors.toIban && ibanFormatValid && !ibanChecksumValid && (
          <div className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="h-3 w-3" />
            Invalid IBAN - check digits do not match
          </div>
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
  );

  if (compact) return formContent;

  return (
    <Card className="mx-auto max-w-lg border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Send a Transfer</CardTitle>
        <CardDescription>
          Transfer funds to any account in the BWIFT network.
        </CardDescription>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}
