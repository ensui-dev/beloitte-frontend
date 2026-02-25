import { useState } from "react";
import { usePageTitle } from "@/hooks/use-page-title";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useAllAccounts } from "@/hooks/use-all-accounts";
import { formatCurrency } from "@/lib/config/currency-utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, User, Building2 } from "lucide-react";
import { getAccountDisplayName, isBusinessAccount } from "@/lib/data/types";
import type { AccountStatus } from "@/lib/data/types";

const STATUS_VARIANT: Record<AccountStatus, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  frozen: "destructive",
  closed: "outline",
  pending_verification: "secondary",
};

export function TellerAccountLookup(): React.ReactElement {
  const { data: config } = useSiteConfig();
  const [query, setQuery] = useState("");

  usePageTitle("Account Lookup", config?.bankName);

  // Only search when there's a query
  const { data, isLoading } = useAllAccounts({
    query: query || undefined,
    pageSize: 20,
  });

  const hasQuery = query.trim().length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account Lookup</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search for customer accounts by name, IBAN, or username.
        </p>
      </div>

      {/* Search */}
      <div className="relative mx-auto max-w-lg">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Enter IBAN, account name, or Discord username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border-white/[0.06] bg-white/[0.02] pl-9 text-base"
          autoFocus
        />
      </div>

      {/* Results */}
      {!hasQuery ? (
        <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
          Type a name, IBAN, or username to search.
        </div>
      ) : isLoading || !config ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : !data || data.data.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          No accounts found matching &ldquo;{query}&rdquo;.
        </div>
      ) : (
        <div className="overflow-x-auto -mx-2 px-2">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead>Account</TableHead>
                <TableHead>IBAN</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((account) => {
                const isBiz = isBusinessAccount(account);
                return (
                  <TableRow key={account.id} className="border-white/[0.06]">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                          {isBiz ? (
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <User className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{getAccountDisplayName(account)}</p>
                          <p className="text-xs capitalize text-muted-foreground">
                            {account.accountType.typeName.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {account.iban.replace(/(.{4})(?=.)/g, "$1 ")}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {account.user?.discordUsername ?? account.business?.businessName ?? "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(account.balance, config.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[account.status]} className="text-xs capitalize">
                        {account.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {data.total > data.data.length && (
            <p className="mt-2 text-xs text-muted-foreground">
              Showing {data.data.length} of {data.total} matches
            </p>
          )}
        </div>
      )}
    </div>
  );
}
