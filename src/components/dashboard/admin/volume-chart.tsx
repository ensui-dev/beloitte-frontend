import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { VolumeDataPoint } from "@/lib/data/types";
import type { CurrencyConfig } from "@/lib/config/site-config-schema";
import { formatCurrency } from "@/lib/config/currency-utils";

interface VolumeChartProps {
  readonly data: readonly VolumeDataPoint[];
  readonly currency: CurrencyConfig;
}

const chartConfig = {
  deposits: {
    label: "Deposits",
    color: "oklch(0.765 0.177 163.223)",
  },
  withdrawals: {
    label: "Withdrawals",
    color: "oklch(0.637 0.237 25.331)",
  },
  transfers: {
    label: "Transfers",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

export function VolumeChart({
  data,
  currency,
}: VolumeChartProps): React.ReactElement {
  return (
    <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Transaction Volume (30 days)
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <BarChart data={[...data]} margin={{ top: 8, right: 12, bottom: 0, left: 12 }}>
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
            <Bar dataKey="deposits" stackId="volume" fill="var(--color-deposits)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="withdrawals" stackId="volume" fill="var(--color-withdrawals)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="transfers" stackId="volume" fill="var(--color-transfers)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function VolumeChartSkeleton(): React.ReactElement {
  return (
    <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[280px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}
