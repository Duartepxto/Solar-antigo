/** Provider accounting remains in USD. This dated ECB quote converts its display. */
export interface UsageCurrencyQuote {
  currency: "EUR";
  /** ECB quotes USD for one euro; convert USD by dividing by this value. */
  usdPerEur: number;
  date: string;
  source: "ECB";
  cached: boolean;
  /** An earlier reference day or a failed refresh; always retain the quote's date. */
  stale: boolean;
}

export type UsageCurrencyReference = Omit<UsageCurrencyQuote, "cached" | "stale">;

/** Verified against the official ECB daily XML on 2026-10-08.
 * https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml
 * A dated offline starting point, never an assumed one-to-one conversion. */
export const ECB_USAGE_CURRENCY_SEED: Readonly<UsageCurrencyQuote> = Object.freeze({
  currency: "EUR", usdPerEur: 1.1186, date: "2026-10-08", source: "ECB", cached: true, stale: true,
});

/** Valid calendar date, positive finite rate, no future reference dates. */
export function isUsageCurrencyReference(value: unknown, now = new Date()): value is UsageCurrencyReference {
  if (!value || typeof value !== "object") return false;
  const quote = value as Partial<UsageCurrencyReference>;
  if (quote.currency !== "EUR" || quote.source !== "ECB" || typeof quote.usdPerEur !== "number" || !Number.isFinite(quote.usdPerEur) || quote.usdPerEur <= 0) return false;
  if (typeof quote.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(quote.date) || !Number.isFinite(now.getTime())) return false;
  const day = new Date(`${quote.date}T00:00:00.000Z`);
  return Number.isFinite(day.getTime()) && day.toISOString().slice(0, 10) === quote.date && quote.date <= now.toISOString().slice(0, 10);
}

/** Preserve unknown costs; never turn missing usage or a missing rate into zero. */
export function usdToEur(usd: number | null | undefined, quote: UsageCurrencyReference | null | undefined): number | null {
  if (typeof usd !== "number" || !Number.isFinite(usd) || usd < 0 || !quote || quote.currency !== "EUR" || quote.source !== "ECB" || !Number.isFinite(quote.usdPerEur) || quote.usdPerEur <= 0) return null;
  const euros = usd / quote.usdPerEur;
  return Number.isFinite(euros) ? euros : null;
}
