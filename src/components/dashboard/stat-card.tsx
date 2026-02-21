import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  readonly label: string;
  readonly value: string;
  readonly change?: number;
}

function ChangeIndicator({ change }: { readonly change: number }): React.ReactElement {
  if (change > 0) {
    return (
      <span className="flex items-center gap-1 text-xs text-emerald-400">
        <TrendingUp className="h-3 w-3" />
        +{change.toFixed(1)}%
      </span>
    );
  }
  if (change < 0) {
    return (
      <span className="flex items-center gap-1 text-xs text-red-400">
        <TrendingDown className="h-3 w-3" />
        {change.toFixed(1)}%
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <Minus className="h-3 w-3" />
      0.0%
    </span>
  );
}

export function StatCard({ label, value, change }: StatCardProps): React.ReactElement {
  return (
    <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
      <CardContent className="p-5">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
        {change !== undefined && (
          <div className="mt-2">
            <ChangeIndicator change={change} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function StatCardSkeleton(): React.ReactElement {
  return (
    <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
      <CardContent className="p-5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-2 h-7 w-32" />
        <Skeleton className="mt-3 h-3 w-16" />
      </CardContent>
    </Card>
  );
}
