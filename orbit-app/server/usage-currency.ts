import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { join, resolve } from "node:path";
import { ECB_USAGE_CURRENCY_SEED, isUsageCurrencyReference, type UsageCurrencyQuote, type UsageCurrencyReference } from "../shared/usage-currency.ts";
import type { PriceList } from './prices.ts';

/** Legacy operator EUR lists are already euros; normalize only for USD accounting. */
export function usagePricesInUsd(prices: PriceList | null, currency: string, quote: UsageCurrencyReference | null): PriceList | null {
  if (!prices || currency === 'USD') return prices;
  if (currency !== 'EUR' || !quote) return null;
  return Object.fromEntries(Object.entries(prices).map(([model, price]) => [model, {
    inputPerMillion: price.inputPerMillion * quote.usdPerEur,
    outputPerMillion: price.outputPerMillion * quote.usdPerEur,
    ...(price.cachedInputPerMillion === undefined ? {} : { cachedInputPerMillion: price.cachedInputPerMillion * quote.usdPerEur }),
  }]));
}

export const ECB_USAGE_CURRENCY_URL = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
const REFRESH_MS = 60 * 60_000;
const RETRY_MS = 5 * 60_000;
const FETCH_TIMEOUT_MS = 5_000;
const MAX_XML_BYTES = 64 * 1024;
const states = new Map<string, { quote: UsageCurrencyReference | null; refreshAt: number; failed: boolean; pending?: Promise<UsageCurrencyQuote | null> }>();

/** Small constrained parser for the ECB's daily XML, without DTD/entity expansion. */
export function parseEcbUsageCurrency(xml: string, now = new Date()): UsageCurrencyReference | null {
  if (Buffer.byteLength(xml, "utf8") > MAX_XML_BYTES || /<!DOCTYPE|<!ENTITY/i.test(xml) || !xml.includes("http://www.ecb.int/vocabulary/2002-08-01/eurofxref")) return null;
  const days = [...xml.matchAll(/<Cube\b[^>]*\btime\s*=\s*(['"])(\d{4}-\d{2}-\d{2})\1[^>]*>([\s\S]*?)<\/Cube\s*>/g)];
  if (days.length !== 1) return null;
  const usdTags = [...days[0][3].matchAll(/<Cube\b[^>]*\bcurrency\s*=\s*(['"])USD\1[^>]*\/\s*>/g)];
  if (usdTags.length !== 1) return null;
  const rate = /\brate\s*=\s*(['"])(\d+(?:\.\d+)?)\1/.exec(usdTags[0][0]);
  if (!rate) return null;
  const quote: UsageCurrencyReference = { currency: "EUR", usdPerEur: Number(rate[2]), date: days[0][2], source: "ECB" };
  return isUsageCurrencyReference(quote, now) ? quote : null;
}

export function usageCurrencyFile(dataDir: string): string {
  return join(dataDir, "usage", "currency-ecb.json");
}

interface UsageCurrencyOptions {
  fetch?: typeof globalThis.fetch;
  now?: () => Date;
  /** Tests may disable the verified starting quote. */
  seed?: UsageCurrencyReference | null;
  timeoutMs?: number;
}

function displayQuote(quote: UsageCurrencyReference | null, now: Date, cached: boolean, failed: boolean): UsageCurrencyQuote | null {
  if (!isUsageCurrencyReference(quote, now)) return null;
  return { ...quote, cached, stale: failed || quote.date < now.toISOString().slice(0, 10) };
}

async function readSavedQuote(dataDir: string, now: Date): Promise<UsageCurrencyReference | null> {
  try {
    const value: unknown = JSON.parse(await readFile(usageCurrencyFile(dataDir), "utf8"));
    if (!isUsageCurrencyReference(value, now)) return null;
    return { currency: "EUR", usdPerEur: value.usdPerEur, date: value.date, source: "ECB" };
  } catch { return null; }
}

async function saveQuote(dataDir: string, quote: UsageCurrencyReference): Promise<void> {
  const file = usageCurrencyFile(dataDir);
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    await mkdir(join(dataDir, "usage"), { recursive: true, mode: 0o700 });
    await writeFile(temporary, JSON.stringify(quote) + "\n", { mode: 0o600 });
    await rename(temporary, file);
  } catch {
    // Currency display must still work if local persistence is unavailable.
    await unlink(temporary).catch(() => undefined);
  }
}

async function fetchQuote(fetcher: typeof globalThis.fetch, now: Date, timeoutMs: number): Promise<UsageCurrencyReference> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => { controller.abort(); reject(new Error("ECB quote timeout")); }, timeoutMs);
  });
  try {
    return await Promise.race([timeout, (async () => {
      const response = await fetcher(ECB_USAGE_CURRENCY_URL, { signal: controller.signal, redirect: "error", headers: { accept: "application/xml, text/xml" } });
      if (!response.ok) throw new Error("ECB quote unavailable");
      const advertisedBytes = Number(response.headers.get("content-length"));
      if (advertisedBytes > MAX_XML_BYTES) throw new Error("ECB quote too large");
      if (!response.body) throw new Error("ECB quote empty");
      const reader = response.body.getReader();
      const parts: Uint8Array[] = [];
      let size = 0;
      try {
        while (true) {
          const next = await reader.read();
          if (next.done) break;
          size += next.value.byteLength;
          if (size > MAX_XML_BYTES) { await reader.cancel(); throw new Error("ECB quote too large"); }
          parts.push(next.value);
        }
      } finally { reader.releaseLock(); }
      const quote = parseEcbUsageCurrency(Buffer.concat(parts).toString("utf8"), now);
      if (!quote) throw new Error("Invalid ECB quote");
      return quote;
    })()]);
  } finally { if (timer) clearTimeout(timer); }
}

/** One bounded refresh per workspace; dated saved/seeded quotes remain usable offline. */
export async function getUsageCurrency(dataDir: string, options: UsageCurrencyOptions = {}): Promise<UsageCurrencyQuote | null> {
  const key = resolve(dataDir);
  const now = (options.now ?? (() => new Date()))();
  if (!Number.isFinite(now.getTime())) return null;
  let state = states.get(key);
  if (state?.pending) return state.pending;
  if (state && state.refreshAt > now.getTime()) return displayQuote(state.quote, now, true, state.failed);
  state ??= { quote: null, refreshAt: 0, failed: false };
  states.set(key, state);
  const current = state;
  const operation = (async (): Promise<UsageCurrencyQuote | null> => {
    const saved = await readSavedQuote(key, now);
    const seed = options.seed === undefined ? ECB_USAGE_CURRENCY_SEED : options.seed;
    for (const candidate of [saved, seed]) {
      if (isUsageCurrencyReference(candidate, now) && (!current.quote || candidate.date > current.quote.date)) {
        current.quote = { currency: "EUR", source: "ECB", date: candidate.date, usdPerEur: candidate.usdPerEur };
      }
    }
    try {
      const timeout = options.timeoutMs ?? FETCH_TIMEOUT_MS;
      const quote = await fetchQuote(options.fetch ?? globalThis.fetch, now, Number.isFinite(timeout) && timeout > 0 ? Math.min(timeout, FETCH_TIMEOUT_MS) : FETCH_TIMEOUT_MS);
      // A proxy or stale publication must never replace the newest reference day.
      if (current.quote && quote.date < current.quote.date) throw new Error("ECB quote went backwards");
      current.quote = quote;
      current.failed = false;
      current.refreshAt = now.getTime() + REFRESH_MS;
      await saveQuote(key, quote);
      return displayQuote(quote, now, false, false);
    } catch {
      current.failed = true;
      current.refreshAt = now.getTime() + RETRY_MS;
      // Persist a verified offline seed too, so a later update keeps its latest rate.
      if (isUsageCurrencyReference(current.quote, now)) await saveQuote(key, current.quote);
      return displayQuote(current.quote, now, true, true);
    }
  })();
  current.pending = operation;
  try { return await operation; } finally { if (current.pending === operation) delete current.pending; }
}
