/**
 * Currency formatting utilities.
 *
 * All currency display in the app should go through `formatCurrency()`
 * to ensure consistent formatting based on the bank's configured currency.
 */
import type { CurrencyConfig } from "./site-config-schema";

/**
 * Format a numeric amount using the bank's currency configuration.
 *
 * @example
 * formatCurrency(15420.5, { code: "RED", name: "Redmont Dollars", symbol: "RED $", symbolPosition: "prefix" })
 * // => "RED $15,420.50"
 *
 * formatCurrency(15420.5, { code: "Kr", name: "Krunas", symbol: "Kr", symbolPosition: "suffix" })
 * // => "15,420.50 Kr"
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyConfig
): string {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  const sign = amount < 0 ? "-" : "";

  if (currency.symbolPosition === "suffix") {
    return `${sign}${formatted} ${currency.symbol}`;
  }

  return `${sign}${currency.symbol}${formatted}`;
}

/**
 * Format with an explicit sign (+/-) for income/expense display.
 *
 * @example
 * formatCurrencySigned(8200, config) // => "+RED $8,200.00"
 * formatCurrencySigned(-2450, config) // => "-RED $2,450.00"
 */
export function formatCurrencySigned(
  amount: number,
  currency: CurrencyConfig
): string {
  const base = formatCurrency(amount, currency);

  if (amount > 0) {
    return `+${base}`;
  }

  return base;
}
