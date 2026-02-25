import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useAllAccounts } from "@/hooks/use-all-accounts";
import { dataService } from "@/lib/data/data-service";
import { formatCurrency } from "@/lib/config/currency-utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Loader2, ArrowDownToLine, AlertCircle, Search } from "lucide-react";
import { getAccountDisplayName } from "@/lib/data/types";
import type { Transaction, DepositRequest, BankAccount } from "@/lib/data/types";

const depositSchema = z.object({
  amount: z.number({ message: "Amount must be a number" }).positive("Amount must be greater than 0"),
  description: z.string().max(200, "Description is too long").optional(),
});

export function TellerProcessDeposit(): React.ReactElement {
  const { data: config } = useSiteConfig();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [amountStr, setAmountStr] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ amount?: string; description?: string }>({});

  usePageTitle("Process Deposit", config?.bankName);

  const { data: searchResults, isLoading: searching } = useAllAccounts({
    query: searchQuery || undefined,
    status: "active",
    pageSize: 5,
  });

  const mutation = useMutation<Transaction, Error, DepositRequest>({
    mutationFn: (deposit) => dataService.createDeposit(deposit),
    onSuccess: () => {
      toast.success("Deposit processed", {
        description: `${formatCurrency(Number(amountStr), config!.currency)} deposited successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["allAccounts"] });
      queryClient.invalidateQueries({ queryKey: ["allTransactions"] });
    },
    onError: (error) => {
      toast.error("Deposit failed", { description: error.message });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!selectedAccount || !config) return;
    setErrors({});

    const parsed = depositSchema.safeParse({
      amount: amountStr === "" ? undefined : Number(amountStr),
      description: description.trim() || undefined,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0]);
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    mutation.mutate({
      toAccountId: selectedAccount.id,
      amount: parsed.data.amount,
      currency: config.currency.code,
      description: parsed.data.description,
    });
  };

  const resetForm = (): void => {
    setSelectedAccount(null);
    setSearchQuery("");
    setAmountStr("");
    setDescription("");
    setErrors({});
    mutation.reset();
  };

  if (mutation.isSuccess && config) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Process Deposit</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Deposit funds into a customer&apos;s account.
          </p>
        </div>
        <Card className="mx-auto max-w-lg border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">Deposit Processed</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatCurrency(Number(amountStr), config.currency)} deposited into{" "}
                  {selectedAccount ? getAccountDisplayName(selectedAccount) : "account"}.
                </p>
              </div>
              <Button variant="outline" onClick={resetForm} className="mt-2">
                Process Another Deposit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Process Deposit</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Deposit funds into a customer&apos;s account.
        </p>
      </div>

      <Card className="mx-auto max-w-lg border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">New Deposit</CardTitle>
          <CardDescription>
            Search for the customer&apos;s account, then enter the deposit amount.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Account selection */}
            {!selectedAccount ? (
              <div className="space-y-3">
                <Label>Customer Account</Label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, IBAN, or username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-white/[0.06] bg-white/[0.02] pl-9"
                    autoFocus
                  />
                </div>
                {searching && (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }, (_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                )}
                {searchQuery && searchResults && !searching && (
                  <div className="space-y-1">
                    {searchResults.data.length === 0 ? (
                      <p className="py-4 text-center text-sm text-muted-foreground">
                        No active accounts found.
                      </p>
                    ) : (
                      searchResults.data.map((acct) => (
                        <button
                          key={acct.id}
                          type="button"
                          onClick={() => setSelectedAccount(acct)}
                          className="flex w-full items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-left transition-colors hover:border-primary/30 hover:bg-white/[0.04]"
                        >
                          <div>
                            <p className="text-sm font-medium">{getAccountDisplayName(acct)}</p>
                            <p className="font-mono text-xs text-muted-foreground">
                              {acct.iban.replace(/(.{4})(?=.)/g, "$1 ")}
                            </p>
                          </div>
                          {config && (
                            <span className="text-sm text-muted-foreground">
                              {formatCurrency(acct.balance, config.currency)}
                            </span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Customer Account</Label>
                <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-3">
                  <div>
                    <p className="text-sm font-medium">{getAccountDisplayName(selectedAccount)}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {selectedAccount.iban.replace(/(.{4})(?=.)/g, "$1 ")}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedAccount(null)}
                  >
                    Change
                  </Button>
                </div>
              </div>
            )}

            {/* Amount */}
            {selectedAccount && config && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="deposit-amount">Amount</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      {config.currency.symbol}
                    </span>
                    <Input
                      id="deposit-amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={amountStr}
                      onChange={(e) => setAmountStr(e.target.value)}
                      className="border-white/[0.06] bg-white/[0.02] pl-16"
                      aria-invalid={!!errors.amount}
                      autoFocus
                    />
                  </div>
                  {errors.amount && (
                    <p className="text-xs text-destructive">{errors.amount}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deposit-desc">
                    Reference <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="deposit-desc"
                    placeholder="Deposit reason or reference"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border-white/[0.06] bg-white/[0.02]"
                  />
                </div>

                {mutation.isError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{mutation.error.message}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowDownToLine className="mr-2 h-4 w-4" />
                      Process Deposit
                    </>
                  )}
                </Button>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
