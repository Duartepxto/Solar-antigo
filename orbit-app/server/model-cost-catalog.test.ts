import { expect, it } from "vitest";
import { euroModelCosts, type PricingInstance } from "./model-cost-catalog.ts";
import { estimateModelTokens } from "../shared/model-cost.ts";
const quote = { currency: "EUR" as const, source: "ECB" as const, usdPerEur: 2, date: "2026-10-09", cached: false, stale: false };
const instance: PricingInstance = { instanceId: "fixture", displayName: "Fixture", available: true, models: { default: "gpt-6.1-sol", options: [
  { id: "gpt-6.1-sol", label: "Sol" }, { id: "local::gpt-6.1-sol", label: "Local" },
  { id: "vendor/new", label: "New", pricing: { inputPerMillion: 3, outputPerMillion: 12, cachedInputPerMillion: 1, cacheWritePerMillion: 4,
    asOf: "2026-10-10", source: "https://example.test/prices" } },
] } };
it("converts current and live model rates and long-context tiers to euros without touching the catalog", () => {
  const before = JSON.stringify(instance);
  const rows = euroModelCosts([instance], quote);
  expect(rows).toHaveLength(3);
  expect(rows[0].price).toMatchObject({ inputPerMillion: 1, cachedInputPerMillion: 0.05, cacheWritePerMillion: 1.25, outputPerMillion: 5,
    longContext: { inputPerMillion: 2, cacheWritePerMillion: 2.5, outputPerMillion: 7.5 } });
  expect(rows[1].price).toBeNull();
  expect(rows[2].price).toMatchObject({ inputPerMillion: 1.5, outputPerMillion: 6, cacheWritePerMillion: 2 });
  const cost = estimateModelTokens(rows[0].price, { input: 100000, cachedInput: 60000, cacheWrite: 20000, output: 10000 });
  expect("total" in cost && cost.total).toBeCloseTo(0.098);
  expect(JSON.stringify(instance)).toBe(before);
});
it("retains every model while exchange rates are unavailable and isolates instance identities", () => {
  const rows = euroModelCosts([instance, { ...instance, instanceId: "second" }], null);
  expect(rows.every(row => row.price === null)).toBe(true);
  expect(new Set(rows.map(row => row.key)).size).toBe(6);
});
