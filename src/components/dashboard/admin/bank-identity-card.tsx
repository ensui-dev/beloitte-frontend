import { Copy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Bank, BankStatus } from "@/lib/data/types";

interface BankIdentityCardProps {
  readonly bank: Bank | undefined;
  readonly bankName: string;
  readonly bankSlug: string;
  readonly onBankNameChange: (name: string) => void;
  readonly onBankSlugChange: (slug: string) => void;
}

const STATUS_VARIANT: Record<BankStatus, "default" | "destructive"> = {
  active: "default",
  suspended: "destructive",
};

function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text).then(
    () => toast.success("Copied to clipboard"),
    () => toast.error("Failed to copy")
  );
}

export function BankIdentityCard({
  bank,
  bankName,
  bankSlug,
  onBankNameChange,
  onBankSlugChange,
}: BankIdentityCardProps): React.ReactElement {
  return (
    <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base">Bank Identity</CardTitle>
        <CardDescription>Core bank information and identifiers.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bank-name">Bank Name</Label>
            <Input
              id="bank-name"
              value={bankName}
              onChange={(e) => onBankNameChange(e.target.value)}
              placeholder="e.g. Reveille National Bank"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bank-slug">Bank Slug</Label>
            <Input
              id="bank-slug"
              value={bankSlug}
              onChange={(e) => onBankSlugChange(e.target.value)}
              placeholder="e.g. reveille"
            />
            <p className="text-xs text-muted-foreground">
              Used in URLs and API paths.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>BWIFT Code</Label>
            <div className="flex items-center gap-2">
              <div className="flex h-9 flex-1 items-center rounded-md border border-input bg-white/[0.02] px-3 text-sm font-mono">
                {bank?.bankCode ?? "—"}
              </div>
              {bank?.bankCode && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  onClick={() => copyToClipboard(bank.bankCode)}
                  aria-label="Copy BWIFT code"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Assigned by the BWIFT network. Cannot be changed.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Bank Status</Label>
            <div className="flex h-9 items-center">
              {bank ? (
                <Badge variant={STATUS_VARIANT[bank.status]} className="text-xs capitalize">
                  {bank.status}
                </Badge>
              ) : (
                <span className="text-sm text-muted-foreground">Loading...</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
