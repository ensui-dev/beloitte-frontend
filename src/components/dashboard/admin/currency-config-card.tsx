import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CurrencyConfig } from "@/lib/config/site-config-schema";

interface CurrencyConfigCardProps {
  readonly currency: CurrencyConfig;
  readonly onUpdate: (patch: Partial<CurrencyConfig>) => void;
}

export function CurrencyConfigCard({
  currency,
  onUpdate,
}: CurrencyConfigCardProps): React.ReactElement {
  return (
    <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base">Currency</CardTitle>
        <CardDescription>Configure the currency used across the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currency-code">Currency Code</Label>
            <Input
              id="currency-code"
              value={currency.code}
              onChange={(e) => onUpdate({ code: e.target.value })}
              placeholder="e.g. RED"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency-name">Currency Name</Label>
            <Input
              id="currency-name"
              value={currency.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="e.g. Redmont Dollars"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency-symbol">Symbol</Label>
            <Input
              id="currency-symbol"
              value={currency.symbol}
              onChange={(e) => onUpdate({ symbol: e.target.value })}
              placeholder="e.g. RED $"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency-position">Symbol Position</Label>
            <Select
              value={currency.symbolPosition}
              onValueChange={(value: "prefix" | "suffix") =>
                onUpdate({ symbolPosition: value })
              }
            >
              <SelectTrigger id="currency-position">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prefix">Prefix (e.g. $100)</SelectItem>
                <SelectItem value="suffix">Suffix (e.g. 100$)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
