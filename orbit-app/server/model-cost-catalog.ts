import type { ModelCatalog } from "./contracts.ts";
import { listPriceDetailsFor, listPriceFor } from "./model-prices.ts";
import { usdToEur, type UsageCurrencyQuote } from "../shared/usage-currency.ts";
import type { ModelTokenPrice, TokenRates } from "../shared/model-cost.ts";

export interface PricingInstance { instanceId: string; displayName: string; models: ModelCatalog; available: boolean }
export interface ModelCostRow { key: string; instanceId: string; engine: string; model: string; label: string; available: boolean; default: boolean; contextWindow?: number; price: ModelTokenPrice | null }

/** A display conversion only: source accounting and historical ledger remain USD. */
export function euroModelCosts(instances: readonly PricingInstance[], quote: UsageCurrencyQuote | null, now = new Date()): ModelCostRow[] {
  const convert = (rates: TokenRates): TokenRates | null => {
    const input = usdToEur(rates.inputPerMillion, quote);
    const output = usdToEur(rates.outputPerMillion, quote);
    if (input === null || output === null) return null;
    return { inputPerMillion: input, outputPerMillion: output,
      ...(rates.cachedInputPerMillion === undefined ? {} : { cachedInputPerMillion: usdToEur(rates.cachedInputPerMillion, quote) ?? undefined }),
      ...(rates.cacheWritePerMillion === undefined ? {} : { cacheWritePerMillion: usdToEur(rates.cacheWritePerMillion, quote) ?? undefined }),
    };
  };
  return instances.flatMap(instance => instance.models.options.map(model => {
    // Only the official provider's qualification may be unwrapped. A local
    // provider serving a familiar slug does not inherit the cloud's price.
    const id = model.id.replace(/^openai::/, "");
    const listed = listPriceDetailsFor(id);
    const unit = listPriceFor(id, now);
    const usd: ModelTokenPrice | null = model.pricing ?? (listed && unit ? { ...listed, ...unit } : null);
    const base = usd && convert(usd);
    const long = usd?.longContext && convert(usd.longContext);
    const price: ModelTokenPrice | null = usd && base ? { ...base, source: usd.source, asOf: usd.asOf,
      ...(long && usd.longContext ? { longContext: { ...long, above: usd.longContext.above } } : {}),
    } : null;
    return { key: JSON.stringify([instance.instanceId, model.id]), instanceId: instance.instanceId, engine: instance.displayName,
      model: model.id, label: model.label, available: instance.available, default: model.id === instance.models.default,
      contextWindow: model.contextWindow, price };
  }));
}
