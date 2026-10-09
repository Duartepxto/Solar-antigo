import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ConfigStatus } from "@/state/store";
import { budgetTone, entitledTo, euroInput, priceRowsFrom, usdFromEuroInput, usdPriceFromRow, UsageBudgetCards, type BudgetState } from "./UsageBudget";
import { formatCost } from "@/lib/usage-currency";
import { ECB_USAGE_CURRENCY_SEED } from "../../shared/usage-currency";

const fixture = vi.hoisted(() => ({ config: null as ConfigStatus | null }));
vi.mock("@/state/store", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/state/store")>(),
  useStore: () => ({ state: { config: fixture.config }, dispatch: () => {} }),
}));
afterEach(() => vi.unstubAllGlobals());

function config(features: string[], extra: Partial<ConfigStatus> = {}): ConfigStatus {
  return {
    composio: { configured: false }, box: { configured: false }, vps: { configured: false, sshAlias: "" },
    rooms: { turnTimeoutMinutes: 30 }, localVm: { mode: "shared", maxInstances: 1 },
    edition: { edition: features.length ? "enterprise" : "oss", features },
    ...extra,
  } as ConfigStatus;
}

const budget: BudgetState = { month: "2026-09", monthlyUsd: 50, spentUsd: 42.5, percent: 85, warnAtPercent: 80, warn: true, exceeded: false };

describe("usage budget and prices cards", () => {
  it("render nothing at all on the open-source edition", () => {
    fixture.config = config([]);
    expect(renderToStaticMarkup(createElement(UsageBudgetCards, { budget }))).toBe("");
    expect(entitledTo(fixture.config, "budgets")).toBe(false);
  });

  it("show the cap, its warning state, and the price list only with their entitlements", () => {
    fixture.config = config(["budgets"], { budgets: { monthlyUsd: 50, warnAtPercent: 80 } });
    const budgetsOnly = renderToStaticMarkup(createElement(UsageBudgetCards, { budget }));
    expect(budgetsOnly).toContain("Monthly spend limit");
    expect(budgetsOnly).toContain("Nearing the limit");
    expect(budgetsOnly).toContain(`${formatCost(42.5)} of ${formatCost(50)} (85%)`);
    expect(budgetsOnly).toContain(`value="${euroInput(50)}"`);
    expect(budgetsOnly).toContain('aria-valuenow="85"');
    expect(budgetsOnly).not.toContain("Sell prices");

    fixture.config = config(["budgets", "billing"], { billing: { currency: "EUR", prices: { "claude-sonnet-5": { inputPerMillion: 4, outputPerMillion: 20 } } } });
    const both = renderToStaticMarkup(createElement(UsageBudgetCards, { budget: { ...budget, spentUsd: 50, percent: 100, exceeded: true } }));
    expect(both).toContain("Limit reached");
    expect(both).toContain("Sell prices");
    expect(both).toContain('value="claude-sonnet-5"');
    expect(both).toContain('value="EUR"');
  });

  it("says when no cap is set and tones the bar by state", () => {
    fixture.config = config(["budgets"]);
    expect(renderToStaticMarkup(createElement(UsageBudgetCards, { budget: null }))).toContain("No limit is set");
    expect(budgetTone(null)).toBe("quiet");
    expect(budgetTone(budget)).toBe("warning");
    expect(budgetTone({ ...budget, exceeded: true })).toBe("danger");
    expect(budgetTone({ ...budget, warn: false })).toBe("quiet");
  });

  it("converts an edited EUR cap to USD and preserves unchanged source precision", () => {
    const original = 123.456789123456;
    const displayed = euroInput(original);
    expect(Number(displayed)).toBeCloseTo(original / 1.1186, 8);
    expect(usdFromEuroInput(displayed, displayed, original)).toBe(original);
    expect(usdFromEuroInput("25", displayed, original)).toBeCloseTo(27.965, 10);
    expect(usdFromEuroInput("25,5", displayed, original)).toBeCloseTo(28.5243, 10);
    expect(usdFromEuroInput("", displayed, original)).toBe(0);
    expect(usdFromEuroInput("-1", displayed, original)).toBeNull();
  });

  it("keeps tiny USD prices visible in EUR and round-trips untouched canonical amounts", () => {
    const price = { inputPerMillion: 0.00000001567890123, outputPerMillion: 9.123456789123, cachedInputPerMillion: 0.00001 };
    const row = priceRowsFrom({ fixture: price })[0]!;
    expect(Number(row.input)).toBeGreaterThan(0);
    expect(usdPriceFromRow(row)).toEqual(price);
    expect(usdPriceFromRow({ ...row, output: "2", cached: "" })).toEqual({ inputPerMillion: price.inputPerMillion, outputPerMillion: 2.2372 });
  });

  it("treats saved EUR prices as euros already, then saves canonical USD", () => {
    const row = priceRowsFrom({ fixture: { inputPerMillion: 4, outputPerMillion: 20 } }, "EUR")[0]!;
    expect(row).toMatchObject({ input: "4", output: "20", cached: "" });
    expect(usdPriceFromRow(row)).toEqual({ inputPerMillion: 4.4744, outputPerMillion: 22.372 });
  });

  it("locks an unsupported currency and preserves its displayed amounts", () => {
    fixture.config = config(["billing"], { billing: { currency: "GBP", prices: { fixture: { inputPerMillion: 4, outputPerMillion: 20 } } } });
    const html = renderToStaticMarkup(createElement(UsageBudgetCards, { budget: null }));
    expect(html).toContain('value="GBP"');
    expect(html).toContain('value="4"');
    expect(html).toContain('role="alert"');
    expect(html).toContain('disabled=""');
    expect(priceRowsFrom(fixture.config.billing?.prices, "GBP")[0]?.input).toBe("4");
  });

  it("uses the supplied frozen draft quote for edited values after rate refresh", () => {
    const newer = { ...ECB_USAGE_CURRENCY_SEED, usdPerEur: 1.3 };
    const row = priceRowsFrom({ fixture: { inputPerMillion: 4, outputPerMillion: 20 } }, "USD", ECB_USAGE_CURRENCY_SEED)[0]!;
    expect(usdPriceFromRow({ ...row, input: "5" }, ECB_USAGE_CURRENCY_SEED)?.inputPerMillion).toBeCloseTo(5.593, 10);
    expect(usdPriceFromRow({ ...row, input: "5" }, newer)?.inputPerMillion).toBe(6.5);
  });
});
