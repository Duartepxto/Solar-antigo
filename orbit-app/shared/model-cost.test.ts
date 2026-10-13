import { expect, it } from "vitest";
import { estimateModelTokens, type ModelTokenPrice } from "./model-cost.ts";
const price: ModelTokenPrice = { inputPerMillion: 2, cachedInputPerMillion: 0.1, cacheWritePerMillion: 2.5,
  outputPerMillion: 10, source: "https://example.test/prices", asOf: "2026-10-10",
  longContext: { above: 272_000, inputPerMillion: 4, cachedInputPerMillion: 0.2, cacheWritePerMillion: 5, outputPerMillion: 15 } };
it("prices disjoint fresh, read and written input once, with billed output", () => {
  const cost = estimateModelTokens(price, { input: 100_000, cachedInput: 60_000, cacheWrite: 20_000, output: 10_000 });
  expect(cost).toMatchObject({ fresh: 0.04, cached: 0.006, written: 0.05, output: 0.1, longContext: false });
  expect("total" in cost && cost.total).toBeCloseTo(0.196);
});
it("applies long-context prices to the whole request only above the threshold", () => {
  expect(estimateModelTokens(price, { input: 272_000, cachedInput: 0, cacheWrite: 0, output: 1000 })).toMatchObject({ total: 0.554, longContext: false });
  expect(estimateModelTokens(price, { input: 273_000, cachedInput: 0, cacheWrite: 0, output: 1000 })).toMatchObject({ total: 1.107, longContext: true });
});
it.each([{ input: -1 }, { input: 0.5 }, { output: NaN }, { cachedInput: 10001 }, { cacheWrite: 9000, cachedInput: 2000 }])("rejects impossible token scenarios (%j)", override => {
  expect(estimateModelTokens(price, { input: 10_000, output: 1000, cachedInput: 0, cacheWrite: 0, ...override })).toEqual({ error: "invalid" });
});
it("does not invent a price for unknown cache rates or local models", () => {
  const basic = { inputPerMillion: 2, outputPerMillion: 10, source: price.source, asOf: price.asOf };
  const tokens = { input: 10000, output: 1000, cachedInput: 0, cacheWrite: 0 };
  expect(estimateModelTokens(null, tokens)).toEqual({ error: "unpriced" });
  expect(estimateModelTokens(basic, { ...tokens, cachedInput: 5000 })).toEqual({ error: "cache-read-unpriced" });
  expect(estimateModelTokens(basic, { ...tokens, cacheWrite: 5000 })).toEqual({ error: "cache-write-unpriced" });
  expect(estimateModelTokens({ ...basic, inputPerMillion: 0, outputPerMillion: 0 }, tokens)).toMatchObject({ total: 0 });
});
it("does not rank a cheap model whose known context cannot carry the request", () => {
  expect(estimateModelTokens(price, { input: 100_000, output: 10000, cachedInput: 0, cacheWrite: 0 }, 100_000)).toEqual({ error: "context-exceeded" });
  expect(estimateModelTokens(price, { input: 90_000, output: 10000, cachedInput: 0, cacheWrite: 0 }, 100_000)).toMatchObject({ total: 0.28 });
});
