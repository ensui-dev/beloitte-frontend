import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardPreviewConfig } from "@/lib/config/site-config-schema";
import { useCurrencyConfig } from "@/components/providers/site-config-provider";
import { formatCurrency, formatCurrencySigned } from "@/lib/config/currency-utils";

interface DashboardPreviewSectionProps {
  readonly config: DashboardPreviewConfig;
}

export function DashboardPreviewSection({
  config,
}: DashboardPreviewSectionProps): React.ReactElement {
  const currency = useCurrencyConfig();
  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12 max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          {config.heading}
        </h2>
        {config.description && (
          <p className="mt-4 text-lg text-muted-foreground">
            {config.description}
          </p>
        )}
      </div>

      {config.screenshotUrl ? (
        <img
          src={config.screenshotUrl}
          alt="Dashboard preview"
          className="w-full rounded-xl border border-border/50 shadow-2xl shadow-primary/5"
        />
      ) : (
        /* Render a mock dashboard when no screenshot is provided */
        <Card className="overflow-hidden border-border/50 bg-card/50 shadow-2xl shadow-primary/5 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="grid grid-cols-12 divide-x divide-border/30">
              {/* Sidebar mock */}
              <div className="col-span-2 bg-muted/20 p-4">
                <div className="space-y-3">
                  {["Overview", "Transactions", "Transfers", "Settings"].map(
                    (item) => (
                      <div
                        key={item}
                        className="h-3 rounded bg-muted-foreground/10"
                        style={{
                          width: `${60 + Math.random() * 30}%`,
                        }}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Main content mock */}
              <div className="col-span-10 p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="border-border/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs text-muted-foreground">
                        Balance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatCurrency(15420, currency)}</div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs text-muted-foreground">
                        Income (Month)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-500">
                        {formatCurrencySigned(8200, currency)}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs text-muted-foreground">
                        Expenses (Month)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-400">
                        {formatCurrencySigned(-2450, currency)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
