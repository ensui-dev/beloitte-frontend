/**
 * Currency step — configure the in-game currency for the bank.
 *
 * Pre-filled with DemocracyCraft defaults (RED / Redmont Dollars / RED $).
 * All fields are editable for banks that use a different currency.
 * Shows a live preview of how amounts will be formatted.
 */
import { useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coins } from "lucide-react";
import type { SetupCurrency } from "../bank-setup-wizard";

interface CurrencyStepProps {
  readonly value: SetupCurrency;
  readonly onChange: (value: SetupCurrency) => void;
}

export function CurrencyStep({
  value,
  onChange,
}: CurrencyStepProps): React.ReactElement {
  const update = useCallback(
    (patch: Partial<SetupCurrency>): void => {
      onChange({ ...value, ...patch });
    },
    [onChange, value]
  );

  // Format a sample amount with current settings
  const preview = useMemo((): string => {
    const amount = "1,234.56";
    if (value.symbolPosition === "suffix") {
      return `${amount} ${value.symbol}`;
    }
    return `${value.symbol}${amount}`;
  }, [value.symbol, value.symbolPosition]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[oklch(0.62_0.20_255_/_0.1)]">
          <Coins className="h-5 w-5 text-[oklch(0.62_0.20_255)]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Currency Configuration</h2>
          <p className="text-sm text-[oklch(0.65_0.03_255)]">
            Set up how currency is displayed across your platform.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Currency Code */}
        <div className="space-y-2">
          <Label htmlFor="currency-code">Currency Code</Label>
          <Input
            id="currency-code"
            value={value.code}
            onChange={(e) => update({ code: e.target.value.toUpperCase() })}
            placeholder="RED"
            maxLength={6}
            className="border-white/[0.08] bg-white/[0.04]"
          />
        </div>

        {/* Symbol */}
        <div className="space-y-2">
          <Label htmlFor="currency-symbol">Symbol</Label>
          <Input
            id="currency-symbol"
            value={value.symbol}
            onChange={(e) => update({ symbol: e.target.value })}
            placeholder="RED $"
            className="border-white/[0.08] bg-white/[0.04]"
          />
        </div>
      </div>

      {/* Currency Name */}
      <div className="space-y-2">
        <Label htmlFor="currency-name">Display Name</Label>
        <Input
          id="currency-name"
          value={value.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Redmont Dollars"
          className="border-white/[0.08] bg-white/[0.04]"
        />
      </div>

      {/* Symbol Position */}
      <div className="space-y-2">
        <Label>Symbol Position</Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => update({ symbolPosition: "prefix" })}
            className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
              value.symbolPosition === "prefix"
                ? "border-[oklch(0.62_0.20_255)] bg-[oklch(0.62_0.20_255_/_0.1)] text-[oklch(0.62_0.20_255)]"
                : "border-white/[0.08] bg-white/[0.02] text-[oklch(0.65_0.03_255)] hover:bg-white/[0.04]"
            }`}
          >
            Prefix ({value.symbol}100)
          </button>
          <button
            type="button"
            onClick={() => update({ symbolPosition: "suffix" })}
            className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
              value.symbolPosition === "suffix"
                ? "border-[oklch(0.62_0.20_255)] bg-[oklch(0.62_0.20_255_/_0.1)] text-[oklch(0.62_0.20_255)]"
                : "border-white/[0.08] bg-white/[0.02] text-[oklch(0.65_0.03_255)] hover:bg-white/[0.04]"
            }`}
          >
            Suffix (100 {value.symbol})
          </button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-[oklch(0.65_0.03_255)]">
          Preview
        </p>
        <p className="mt-2 text-2xl font-bold tabular-nums">{preview}</p>
        <p className="mt-1 text-xs text-[oklch(0.65_0.03_255)]">
          {value.name} ({value.code})
        </p>
      </div>
    </div>
  );
}
