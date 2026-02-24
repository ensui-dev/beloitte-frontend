import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Transaction } from "@/lib/data/types";
import type { CurrencyConfig } from "@/lib/config/site-config-schema";
import { formatCurrency } from "@/lib/config/currency-utils";

interface BalanceChartProps {
  readonly currentBalance: number;
  readonly transactions: readonly Transaction[];
  readonly currency: CurrencyConfig;
}

interface BalancePoint {
  readonly date: string;
  readonly balance: number;
}

const chartConfig = {
  balance: {
    label: "Balance",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

/**
 * Compute daily balance snapshots for the last 30 days.
 *
 * Walks backwards from today's balance, subtracting the net effect
 * of each transaction to reconstruct historical balances.
 */
function computeBalanceHistory(
  currentBalance: number,
  transactions: readonly Transaction[],
  days: number
): readonly BalancePoint[] {
  const now = new Date();

  // Build a map of date -> net change
  const dailyChanges = new Map<string, number>();

  for (const tx of transactions) {
    if (tx.status !== "posted") continue;

    const txDate = new Date(tx.transactedAt);
    const dateKey = txDate.toISOString().split("T")[0];

    const current = dailyChanges.get(dateKey) ?? 0;

    if (tx.transactionType.affectsBalance === "credit") {
      dailyChanges.set(dateKey, current + tx.amount);
    } else {
      dailyChanges.set(dateKey, current - tx.amount);
    }
  }

  // Walk backwards from current balance to build daily snapshots
  const points: BalancePoint[] = [];
  let balance = currentBalance;

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split("T")[0];

    points.unshift({
      date: dateKey,
      balance: Math.round(balance * 100) / 100,
    });

    // Undo today's change to get yesterday's closing balance
    const change = dailyChanges.get(dateKey) ?? 0;
    balance -= change;
  }

  return points;
}

export function BalanceChart({
  currentBalance,
  transactions,
  currency,
}: BalanceChartProps): React.ReactElement {
  const data = useMemo(
    () => computeBalanceHistory(currentBalance, transactions, 30),
    [currentBalance, transactions]
  );

  return (
    <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Balance Trend (30 days)
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={[...data]} margin={{ top: 8, right: 12, bottom: 0, left: 12 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => {
                const d = new Date(value + "T00:00:00");
                return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              }}
              interval="preserveStartEnd"
              minTickGap={50}
              className="text-xs text-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: number) => formatCurrency(value, currency)}
              width={100}
              className="text-xs text-muted-foreground"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatCurrency(Number(value), currency)}
                  labelFormatter={(label) => {
                    const d = new Date(String(label) + "T00:00:00");
                    return d.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Area
              dataKey="balance"
              type="monotone"
              fill="url(#balanceGradient)"
              stroke="var(--color-primary)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function BalanceChartSkeleton(): React.ReactElement {
  return (
    <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-40" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[250px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}
