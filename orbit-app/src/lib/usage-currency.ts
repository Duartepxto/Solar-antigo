import { useEffect, useSyncExternalStore } from 'react';
import { ECB_USAGE_CURRENCY_SEED, usdToEur, isUsageCurrencyReference, type UsageCurrencyQuote } from '../../shared/usage-currency';
import { activeLocale, t } from './i18n';

let quote: UsageCurrencyQuote | null = { ...ECB_USAGE_CURRENCY_SEED, cached: true, stale: true };
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
const snapshot = () => quote;
let pending: Promise<void> | undefined;

export function currentUsageCurrency() { return quote; }
export function setUsageCurrency(next: UsageCurrencyQuote | null) {
  if (!isUsageCurrencyReference(next) || (quote && next.date < quote.date)) return;
  quote = next;
  for (const listener of listeners) listener();
}

async function refresh() {
  if (pending) return pending;
  pending = (async () => {
    try {
      const response = await fetch('/api/usage/currency', { signal: AbortSignal.timeout(8_000) });
      if (response.ok) setUsageCurrency(await response.json());
    } catch { /* Retain the dated reference rate when offline. */ }
  })().finally(() => { pending = undefined; });
  return pending;
}

/** Subscribers update every cost surface when the reference quote changes. */
export function useUsageCurrency() { return useSyncExternalStore(subscribe, snapshot, snapshot); }
export function useUsageCurrencyRefresh() {
  useUsageCurrency();
  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => { void refresh(); }, 30 * 60_000);
    const focus = () => { void refresh(); };
    window.addEventListener('focus', focus);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', focus); };
  }, []);
}

export function displayEuro(usd: number, exchange = quote): number | null { return exchange ? usdToEur(usd, exchange) : null; }
export function euroToUsd(eur: number, exchange = quote): number | null {
  return exchange && Number.isFinite(eur) && eur >= 0 ? eur * exchange.usdPerEur : null;
}
export function formatEuro(eur: number): string {
  if (!Number.isFinite(eur) || eur < 0) return '—';
  const options = { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: eur > 0 && eur < .01 ? 4 : 2 } as const;
  if (eur > 0 && eur < .0001) return `<${new Intl.NumberFormat(activeLocale(), { ...options, maximumFractionDigits: 4 }).format(.0001)}`;
  return new Intl.NumberFormat(activeLocale(), options).format(eur);
}
/** Inputs remain provider USD; the interface consistently displays converted euros. */
export function formatCost(usd: number): string {
  const eur = displayEuro(usd);
  return eur === null ? '—' : formatEuro(eur);
}
export function usageCurrencyNote(exchange = quote): string {
  return exchange ? t(exchange.stale ? 'usage.currency.cached' : 'usage.currency.reference', { rate: String(exchange.usdPerEur), date: exchange.date }) : t('usage.currency.unavailable');
}
