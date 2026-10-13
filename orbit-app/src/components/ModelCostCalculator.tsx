import { useEffect, useId, useState } from "react";
import { api } from "@/state/store";
import { t } from "@/lib/i18n";
import { formatEuro, usageCurrencyNote } from "@/lib/usage-currency";
import { estimateModelTokens, type ModelTokenPrice, type TokenScenario } from "../../shared/model-cost";
import type { UsageCurrencyQuote } from "../../shared/usage-currency";
import { Card } from "./SettingsPrimitives";

interface CostModel { key: string; label: string; model: string; engine: string; available: boolean; default?: boolean; contextWindow?: number; price: ModelTokenPrice | null }
interface CostCatalog { currency: "EUR"; quote: UsageCurrencyQuote | null; models: CostModel[] }
const fields = ["input", "output", "cachedInput", "cacheWrite"] as const;
const fieldKeys = { input: "usage.calculator.input", output: "usage.calculator.output", cachedInput: "usage.calculator.cached", cacheWrite: "usage.calculator.written" } as const;
const control = "w-full rounded-md border border-ink/15 bg-control px-3 py-2 text-[13px] text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

export function ModelCostCalculator() {
  const id = useId();
  const [catalog, setCatalog] = useState<CostCatalog | null>(null);
  const [failed, setFailed] = useState(false);
  const [reload, setReload] = useState(0);
  const [selected, setSelected] = useState("");
  const [counts, setCounts] = useState({ input: "10000", output: "1000", cachedInput: "0", cacheWrite: "0" });
  const [compare, setCompare] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setFailed(false);
    void api<CostCatalog>("/api/usage/models", { signal: controller.signal, timeoutMs: 15_000 }).then(data => {
      if (controller.signal.aborted) return;
      if (data?.currency !== "EUR" || !Array.isArray(data.models) || data.models.some(row =>
        !row || typeof row.key !== "string" || typeof row.label !== "string" || typeof row.engine !== "string")) {
        throw new Error("Invalid model cost catalog");
      }
      setCatalog(data);
      setSelected(current => data.models.some(model => model.key === current) ? current
        : (data.models.find(model => model.available && model.default && model.price)
          ?? data.models.find(model => model.available && model.price) ?? data.models[0])?.key ?? "");
    }).catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => controller.abort();
  }, [reload]);
  const model = catalog?.models.find(row => row.key === selected);
  const tokens: TokenScenario = { input: Number(counts.input), output: Number(counts.output),
    cachedInput: Number(counts.cachedInput), cacheWrite: Number(counts.cacheWrite) };
  const estimate = estimateModelTokens(model?.price ?? null, tokens, model?.contextWindow);
  const rows = compare ? catalog?.models.map(row => ({ ...row, estimate: estimateModelTokens(row.price, tokens, row.contextWindow) }))
    .sort((a, b) => ("total" in a.estimate ? a.estimate.total : Infinity) - ("total" in b.estimate ? b.estimate.total : Infinity)) : undefined;
  return <Card title={t("usage.calculator.title")} subtitle={t("usage.calculator.subtitle")}>
    {failed ? <div role="alert" className="text-[13px] text-ink/70">
      {t("usage.calculator.failed")} <button type="button" className="underline underline-offset-4" onClick={() => setReload(value => value + 1)}>{t("usage.calculator.retry")}</button>
    </div> : !catalog ? <p role="status" className="text-[13px] text-ink/60">{t("usage.calculator.loading")}</p>
      : catalog.models.length === 0 ? <p className="text-[13px] text-ink/60">{t("usage.calculator.empty")}</p> : <div className="flex min-w-0 flex-col gap-4">
        <label htmlFor={`${id}-model`} className="flex flex-col gap-1.5 text-[12px] text-ink/70">
          {t("usage.calculator.model")}
          <select id={`${id}-model`} className={control} value={selected} onChange={event => setSelected(event.target.value)}>
            {catalog.models.map(row => <option key={row.key} value={row.key}>{row.label} · {row.engine}{row.price ? "" : ` · ${t("usage.calculator.unpriced")}`}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {fields.map(field => <label key={field} htmlFor={`${id}-${field}`} className="flex min-w-0 flex-col gap-1.5 text-[12px] text-ink/70">
            {t(fieldKeys[field])}<input id={`${id}-${field}`} type="number" min="0" step="1" inputMode="numeric" className={control}
              value={counts[field]} onChange={event => setCounts(current => ({ ...current, [field]: event.target.value }))} />
          </label>)}
        </div>
        <p className="text-[12px] leading-relaxed text-ink/55">{t("usage.calculator.inputHint")}</p>
        <div aria-live="polite" aria-atomic="true" className="border-y border-ink/10 py-3">
          {"error" in estimate ? <p className="text-[13px] text-ink/70">{t(`usage.calculator.${estimate.error}`)}</p> : <>
            <div className="flex items-baseline justify-between gap-3 text-[14px] font-medium text-ink">
              <span>{t("usage.calculator.total")}</span><output className="tabular-nums">~ {formatEuro(estimate.total)}</output>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-ink/60">{t("usage.calculator.breakdown", {
              input: formatEuro(estimate.fresh), cached: formatEuro(estimate.cached), written: formatEuro(estimate.written), output: formatEuro(estimate.output),
            })}</p>
            {estimate.longContext && <p className="mt-2 text-[12px] text-ink/70">{t("usage.calculator.longContext")}</p>}
          </>}
        </div>
        {model?.price && <p className="text-[12px] leading-relaxed text-ink/60">
          {t("usage.calculator.rates", { input: formatEuro(model.price.inputPerMillion), output: formatEuro(model.price.outputPerMillion), cached: model.price.cachedInputPerMillion === undefined ? "—" : formatEuro(model.price.cachedInputPerMillion) })}
          {" "}<a className="underline underline-offset-4" href={model.price.source} target="_blank" rel="noreferrer">{t("usage.calculator.source", { date: model.price.asOf })}</a>
        </p>}
        <p className="text-[12px] leading-relaxed text-ink/55">{usageCurrencyNote(catalog.quote)} {t("usage.calculator.limit")}</p>
        <button type="button" aria-expanded={compare} aria-controls={`${id}-comparison`} onClick={() => setCompare(value => !value)}
          className="self-start text-[13px] text-ink underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2">{t(compare ? "usage.calculator.hideCompare" : "usage.calculator.compare")}</button>
        {compare && <div id={`${id}-comparison`} className="max-h-80 overflow-auto">
          <table className="w-full text-left text-[12px]">
            <caption className="sr-only">{t("usage.calculator.compare")}</caption>
            <thead><tr className="border-b border-ink/15"><th scope="col" className="py-2 font-medium">{t("usage.calculator.model")}</th><th scope="col" className="py-2 text-right font-medium">{t("usage.calculator.total")}</th></tr></thead>
            <tbody>{rows?.map(row => <tr key={row.key} className="border-b border-ink/10">
              <td className="py-2 pr-3 text-ink">{row.label}<span className="block text-ink/55">{row.engine}{row.available ? "" : ` · ${t("usage.calculator.unavailable")}`}</span></td>
              <td className="py-2 text-right tabular-nums text-ink">{"total" in row.estimate ? `~ ${formatEuro(row.estimate.total)}` : t(`usage.calculator.${row.estimate.error}`)}</td>
            </tr>)}</tbody>
          </table>
        </div>}
      </div>}
  </Card>;
}
