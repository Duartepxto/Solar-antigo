import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ECB_USAGE_CURRENCY_SEED, isUsageCurrencyReference, usdToEur } from "../shared/usage-currency.ts";
import { cachedUsageCurrency, ECB_USAGE_CURRENCY_URL, getUsageCurrency, parseEcbUsageCurrency, usageCurrencyFile, usagePricesInUsd } from "./usage-currency.ts";

const NOW = new Date("2026-10-08T18:00:00.000Z");
it('normalizes legacy EUR sell prices once and refuses unsupported conversions', () => {
  const prices = { default: { inputPerMillion: 1, cachedInputPerMillion: .1, outputPerMillion: 2 } };
  expect(usagePricesInUsd(prices, 'USD', null)).toBe(prices);
  const normalized = usagePricesInUsd(prices, 'EUR', ECB_USAGE_CURRENCY_SEED)!;
  expect(normalized.default.inputPerMillion).toBe(1.1186);
  expect(normalized.default.outputPerMillion).toBe(2.2372);
  expect(normalized.default.cachedInputPerMillion).toBeCloseTo(.11186);
  expect(usdToEur(normalized.default.inputPerMillion, ECB_USAGE_CURRENCY_SEED)).toBe(1);
  expect(usagePricesInUsd(prices, 'GBP', ECB_USAGE_CURRENCY_SEED)).toBeNull();
  expect(usagePricesInUsd(prices, 'EUR', null)).toBeNull();
});
const xml = (date = "2026-10-08", rate = "1.1186") => `<?xml version="1.0"?><gesmes:Envelope xmlns="http://www.ecb.int/vocabulary/2002-08-01/eurofxref"><Cube><Cube time='${date}'><Cube currency='USD' rate='${rate}'/><Cube currency='GBP' rate='0.84698'/></Cube></Cube></gesmes:Envelope>`;
const directories: string[] = [];
async function fixture() { const dir = await mkdtemp(join(tmpdir(), "solar-currency-")); directories.push(dir); return dir; }
const fetchXml = (body = xml()) => vi.fn<typeof fetch>(async () => new Response(body, { status: 200, headers: { "content-type": "text/xml" } }));
const offline = () => vi.fn<typeof fetch>(async () => { throw new Error("offline"); });
afterEach(async () => { await Promise.all(directories.splice(0).map((dir) => rm(dir, { recursive: true, force: true }))); });

describe("ECB display conversion", () => {
  it("reads the dated USD-per-euro quote and divides canonical USD", () => {
    const quote = parseEcbUsageCurrency(xml(), NOW);
    expect(quote).toEqual({ currency: "EUR", source: "ECB", date: "2026-10-08", usdPerEur: 1.1186 });
    expect(usdToEur(1.1186, quote)).toBe(1);
    expect(usdToEur(0, quote)).toBe(0);
    expect(usdToEur(null, quote)).toBeNull();
    expect(usdToEur(3, null)).toBeNull();
    expect(usdToEur(-1, quote)).toBeNull();
    expect(usdToEur(Infinity, quote)).toBeNull();
    expect(Object.isFrozen(ECB_USAGE_CURRENCY_SEED)).toBe(true);
    expect(ECB_USAGE_CURRENCY_SEED).toMatchObject({ cached: true, stale: true });
  });

  it.each(["0", "-1", "NaN", "Infinity", "1e3", "1,1186", "1.2 trailing", "9".repeat(320)])("rejects invalid rate %s", (rate) => {
    expect(parseEcbUsageCurrency(xml("2026-10-08", rate), NOW)).toBeNull();
  });

  it.each(["2026-10-09", "2026-02-30", "2026-13-01", "2026-1-02", "not-a-date"])("rejects future or invalid day %s", (date) => {
    expect(parseEcbUsageCurrency(xml(date), NOW)).toBeNull();
  });

  it("rejects non-ECB, duplicate, entity and oversized documents", () => {
    expect(parseEcbUsageCurrency(xml().replace("http://www.ecb.int/vocabulary/2002-08-01/eurofxref", "other"), NOW)).toBeNull();
    expect(parseEcbUsageCurrency(xml().replace("<Cube currency='GBP'", "<Cube currency='USD'"), NOW)).toBeNull();
    expect(parseEcbUsageCurrency(`<!DOCTYPE Envelope [<!ENTITY rate '1.1'>]>${xml()}`, NOW)).toBeNull();
    expect(parseEcbUsageCurrency(" ".repeat(65 * 1024) + xml(), NOW)).toBeNull();
    expect(isUsageCurrencyReference({ ...ECB_USAGE_CURRENCY_SEED, date: "2026-02-30" }, NOW)).toBe(false);
  });
});

describe("workspace currency cache", () => {
  it("coalesces concurrent calls, persists reference metadata only and caches subsequent reads", async () => {
    const dir = await fixture();
    const fetcher = fetchXml();
    const options = { fetch: fetcher, now: () => NOW };
    const quotes = await Promise.all([getUsageCurrency(dir, options), getUsageCurrency(dir, options), getUsageCurrency(dir, options)]);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher.mock.calls[0][0]).toBe(ECB_USAGE_CURRENCY_URL);
    expect(quotes[0]).toMatchObject({ usdPerEur: 1.1186, cached: false, stale: false });
    expect(quotes[1]).toEqual(quotes[0]);
    const persisted = JSON.parse(await readFile(usageCurrencyFile(dir), "utf8"));
    expect(persisted).toEqual({ currency: "EUR", source: "ECB", date: "2026-10-08", usdPerEur: 1.1186 });
    expect(await getUsageCurrency(dir, options)).toMatchObject({ cached: true, stale: false });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("keeps a valid saved quote offline with its date and explicit stale status", async () => {
    const dir = await fixture();
    await mkdir(join(dir, "usage"));
    await writeFile(usageCurrencyFile(dir), JSON.stringify({ currency: "EUR", source: "ECB", date: "2026-10-07", usdPerEur: 1.11 }));
    const quote = await getUsageCurrency(dir, { fetch: offline(), now: () => NOW, seed: null });
    expect(quote).toEqual({ currency: "EUR", source: "ECB", date: "2026-10-07", usdPerEur: 1.11, cached: true, stale: true });
  });

  it("uses the verified dated seed offline and ignores invalid or future saved quotes", async () => {
    const dir = await fixture();
    await mkdir(join(dir, "usage"));
    await writeFile(usageCurrencyFile(dir), JSON.stringify({ ...ECB_USAGE_CURRENCY_SEED, date: "2026-10-09", usdPerEur: 500 }));
    expect(await getUsageCurrency(dir, { fetch: offline(), now: () => NOW })).toMatchObject({ date: "2026-10-08", usdPerEur: 1.1186, cached: true, stale: true });
  });

  it("keeps the newer saved quote when an upstream response goes backwards", async () => {
    const dir = await fixture();
    await mkdir(join(dir, "usage"));
    await writeFile(usageCurrencyFile(dir), JSON.stringify({ currency: "EUR", source: "ECB", date: "2026-10-08", usdPerEur: 1.12 }));
    expect(await getUsageCurrency(dir, { fetch: fetchXml(xml("2026-10-07", "1.10")), now: () => NOW, seed: null })).toMatchObject({ date: "2026-10-08", usdPerEur: 1.12, cached: true, stale: true });
  });

  it("refreshes later and never shares rates across workspace directories", async () => {
    const first = await fixture();
    const second = await fixture();
    const fetcher = fetchXml();
    await getUsageCurrency(first, { fetch: fetcher, now: () => NOW, seed: null });
    await getUsageCurrency(second, { fetch: fetcher, now: () => NOW, seed: null });
    expect(fetcher).toHaveBeenCalledTimes(2);
    const tomorrow = new Date("2026-10-09T18:00:00Z");
    const newer = fetchXml(xml("2026-10-09", "1.125"));
    expect(await getUsageCurrency(first, { fetch: newer, now: () => tomorrow })).toMatchObject({ date: "2026-10-09", usdPerEur: 1.125, cached: false, stale: false });
    expect(cachedUsageCurrency(first)).toMatchObject({ date: "2026-10-09", usdPerEur: 1.125 });
    expect(usagePricesInUsd({ fixture: { inputPerMillion: 2, outputPerMillion: 4 } }, "EUR", cachedUsageCurrency(first)))
      .toEqual({ fixture: { inputPerMillion: 2.25, outputPerMillion: 4.5 } });
  });

  it("bounds even an unresponsive transport and avoids inventing a rate without a cache", async () => {
    const dir = await fixture();
    const never = vi.fn<typeof fetch>(() => new Promise<Response>(() => undefined));
    const start = Date.now();
    expect(await getUsageCurrency(dir, { fetch: never, timeoutMs: 20, now: () => NOW, seed: null })).toBeNull();
    expect(Date.now() - start).toBeLessThan(2_000);
    expect(await getUsageCurrency(dir, { fetch: offline(), now: () => NOW, seed: null })).toBeNull();
  });

  it("rejects an oversized response and leaves an earlier reference stale", async () => {
    const dir = await fixture();
    const fetcher = fetchXml(" ".repeat(65 * 1024) + xml());
    expect(await getUsageCurrency(dir, { fetch: fetcher, now: () => NOW })).toMatchObject({ usdPerEur: 1.1186, cached: true, stale: true });
  });
});
