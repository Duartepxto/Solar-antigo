import type { UsageCurrencyQuote } from "../../shared/usage-currency.ts";
import { euroModelCosts, type PricingInstance } from "../model-cost-catalog.ts";
import { PASS, type RouteHandler } from "./table.ts";

export function createModelCostRoutes(deps: { instances(): Promise<PricingInstance[]>; quote(): Promise<UsageCurrencyQuote | null> }): RouteHandler {
  return async ({ path, method, res, json }) => {
    if (path !== "/api/usage/models" || method !== "GET") return PASS;
    const [instances, quote] = await Promise.all([deps.instances(), deps.quote()]);
    res.setHeader("cache-control", "no-store");
    return json(res, 200, { currency: "EUR", quote, models: euroModelCosts(instances, quote) });
  };
}
