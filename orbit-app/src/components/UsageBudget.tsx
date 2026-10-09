// App settings → Usage → Budget and Prices: a monthly spend limit for the
// workspace and the operator's own sell prices per model. Both are
// enterprise entitlements (`budgets`, `billing`); the cards render only
// when the server reports them, and edit the same config the server reads.
import { useEffect, useRef, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { api, useStore, type ConfigStatus } from "@/state/store";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";
import { formatCost } from "@/lib/usage";
import { currentUsageCurrency, displayEuro, euroToUsd, useUsageCurrency } from "@/lib/usage-currency";
import type { UsageCurrencyQuote } from "../../shared/usage-currency";
import { Card } from "./SettingsPrimitives";

export interface BudgetState {
  month: string;
  monthlyUsd: number;
  spentUsd: number;
  percent: number;
  warnAtPercent: number;
  warn: boolean;
  exceeded: boolean;
}

export interface ModelPrice {
  inputPerMillion: number;
  outputPerMillion: number;
  cachedInputPerMillion?: number;
}

export function entitledTo(config: ConfigStatus | null | undefined, feature: string): boolean {
  return config?.edition?.features?.includes(feature) === true;
}

/** The bar's tone follows the state: quiet, warning at the threshold, danger at the cap. */
export function budgetTone(state: BudgetState | null): "quiet" | "warning" | "danger" {
  if (!state) return "quiet";
  return state.exceeded ? "danger" : state.warn ? "warning" : "quiet";
}

/** Keep tiny nonzero rates visible. Unchanged inputs retain their exact source
 * amount instead of feeding the display rounding back into accounting. */
export function euroInput(usd: number | undefined, quote = currentUsageCurrency()): string {
  if (usd === undefined) return "";
  const eur = displayEuro(usd, quote);
  return eur === null ? "" : String(Number(eur.toPrecision(12)));
}

export function usdFromEuroInput(value: string, initial: string, originalUsd: number | undefined, quote = currentUsageCurrency()): number | null {
  if (value === initial && originalUsd !== undefined) return originalUsd;
  if (value.trim() === "") return 0;
  const normalized = value.includes(",") && !value.includes(".") ? value.replace(",", ".") : value;
  return euroToUsd(Number(normalized), quote);
}

export function BudgetCard({ budget }: { budget: BudgetState | null }) {
  const { state, dispatch } = useStore();
  const saved = state.config?.budgets ?? {};
  const quote = useUsageCurrency();
  const dirty = useRef(false);
  const initial = useRef({ monthly: euroInput(saved.monthlyUsd, quote), originalUsd: saved.monthlyUsd, quote });
  const [monthly, setMonthly] = useState(initial.current.monthly);
  const [warnAt, setWarnAt] = useState(saved.warnAtPercent === undefined ? "80" : String(saved.warnAtPercent));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (dirty.current) return;
    initial.current = { monthly: euroInput(saved.monthlyUsd, quote), originalUsd: saved.monthlyUsd, quote };
    setMonthly(initial.current.monthly);
    setWarnAt(saved.warnAtPercent === undefined ? "80" : String(saved.warnAtPercent));
  }, [saved.monthlyUsd, saved.warnAtPercent, quote]);

  const save = async () => {
    if (saving || !quote) return;
    const monthlyUsd = usdFromEuroInput(monthly, initial.current.monthly, initial.current.originalUsd, initial.current.quote);
    const warnAtPercent = Number(warnAt);
    if (monthlyUsd === null || !Number.isFinite(monthlyUsd) || monthlyUsd < 0 || !Number.isInteger(warnAtPercent) || warnAtPercent < 1 || warnAtPercent > 100) {
      setError(t("usage.budget.invalid"));
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const status: ConfigStatus = await api("/api/config", { method: "PUT", body: JSON.stringify({ budgets: { monthlyUsd, warnAtPercent } }) });
      dirty.current = false;
      dispatch({ type: "configStatus", config: status });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setSaving(false);
    }
  };

  const tone = budgetTone(budget);
  return (
    <Card title={t("usage.budget.title")} subtitle={t("usage.budget.subtitle")}>
      {budget ? (
        <div className="mb-4">
          <div className="mb-1 flex items-baseline justify-between text-[13px]">
            <span className={cn(tone === "danger" ? "text-[#ff8a96]" : tone === "warning" ? "text-warning" : "text-ink")}>
              {budget.exceeded ? t("usage.budget.reached") : budget.warn ? t("usage.budget.nearing") : t("usage.budget.within")}
            </span>
            <span className="tabular-nums text-ink/55">{t("usage.budget.spent", { spent: formatCost(budget.spentUsd), cap: formatCost(budget.monthlyUsd), percent: String(budget.percent) })}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-ink/[0.04]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100, budget.percent)}>
            <div className={cn("h-full rounded-full", tone === "danger" ? "bg-[#ff5667]" : tone === "warning" ? "bg-warning" : "bg-ink")} style={{ width: `${Math.min(100, budget.percent)}%` }} />
          </div>
        </div>
      ) : (
        <p className="mb-4 text-[13px] text-ink/55">{t("usage.budget.none")}</p>
      )}
      <form className="flex flex-wrap items-end gap-3" onSubmit={(event) => { event.preventDefault(); void save(); }}>
        <label className="flex flex-col gap-1 text-[12px] text-ink/55">
          {t("usage.budget.monthly")}
          <input value={monthly} onChange={(e) => { dirty.current = true; setMonthly(e.target.value); }} inputMode="decimal" placeholder="0" aria-label={t("usage.budget.monthly")} disabled={saving || !quote} className="w-32 rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-3 py-2 text-[13px] tabular-nums text-ink focus:border-ink/[0.1] focus:outline-none disabled:opacity-50" />
        </label>
        <label className="flex flex-col gap-1 text-[12px] text-ink/55">
          {t("usage.budget.warnAt")}
          <input value={warnAt} onChange={(e) => { dirty.current = true; setWarnAt(e.target.value); }} inputMode="numeric" aria-label={t("usage.budget.warnAt")} disabled={saving || !quote} className="w-20 rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-3 py-2 text-[13px] tabular-nums text-ink focus:border-ink/[0.1] focus:outline-none disabled:opacity-50" />
        </label>
        <button type="submit" disabled={saving || !quote} className="flex items-center gap-1.5 rounded-lg bg-ink/[0.06] px-3 py-2 text-[12.5px] text-ink hover:bg-ink/[0.1] disabled:opacity-50">
          {saving && <Loader2 size={13} className="animate-spin" />}{t("common.save")}
        </button>
      </form>
      <p className="mt-2 text-[11.5px] leading-relaxed text-ink/55">{t("usage.budget.hint")}</p>
      {error && <p role="alert" className="mt-2 text-[12px] text-[#ff8a96]">{error}</p>}
    </Card>
  );
}

export type PriceRow = { key: string; input: string; output: string; cached: string; initial?: { input: string; output: string; cached: string; usd: ModelPrice } };

export function priceRowsFrom(prices: Record<string, ModelPrice> | undefined, currency = "USD", quote = currentUsageCurrency()): PriceRow[] {
  const rows = Object.entries(prices ?? {}).map(([key, price]) => {
    const inEuros = currency === "EUR";
    const value = (amount: number | undefined) => amount === undefined ? "" : currency !== "USD" ? String(amount) : euroInput(amount, quote);
    const fields = { input: value(price.inputPerMillion), output: value(price.outputPerMillion), cached: value(price.cachedInputPerMillion) };
    const usd = inEuros ? {
      inputPerMillion: euroToUsd(price.inputPerMillion, quote) ?? NaN,
      outputPerMillion: euroToUsd(price.outputPerMillion, quote) ?? NaN,
      ...(price.cachedInputPerMillion === undefined ? {} : { cachedInputPerMillion: euroToUsd(price.cachedInputPerMillion, quote) ?? NaN }),
    } : price;
    return { key, ...fields, initial: { ...fields, usd } };
  });
  return rows.length ? rows : [{ key: "default", input: "", output: "", cached: "" }];
}

export function usdPriceFromRow(row: PriceRow, quote: UsageCurrencyQuote | null = currentUsageCurrency()): ModelPrice | null {
  const inputPerMillion = usdFromEuroInput(row.input, row.initial?.input ?? "", row.initial?.usd.inputPerMillion, quote);
  const outputPerMillion = usdFromEuroInput(row.output, row.initial?.output ?? "", row.initial?.usd.outputPerMillion, quote);
  const cachedInputPerMillion = row.cached.trim() === "" ? undefined : usdFromEuroInput(row.cached, row.initial?.cached ?? "", row.initial?.usd.cachedInputPerMillion, quote);
  if (inputPerMillion === null || outputPerMillion === null || cachedInputPerMillion === null || !Number.isFinite(inputPerMillion) || !Number.isFinite(outputPerMillion) || inputPerMillion < 0 || outputPerMillion < 0 || (cachedInputPerMillion !== undefined && (!Number.isFinite(cachedInputPerMillion) || cachedInputPerMillion < 0))) return null;
  return { inputPerMillion, outputPerMillion, ...(cachedInputPerMillion === undefined ? {} : { cachedInputPerMillion }) };
}

export function PricesCard() {
  const { state, dispatch } = useStore();
  const saved = state.config?.billing;
  const quote = useUsageCurrency();
  const currency = saved?.currency ?? "USD";
  const supported = currency === "USD" || currency === "EUR";
  const dirty = useRef(false);
  const draftQuote = useRef(quote);
  const [rows, setRows] = useState<PriceRow[]>(priceRowsFrom(saved?.prices, currency, quote));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const locked = saving || !supported || !quote;
  useEffect(() => {
    if (dirty.current) return;
    draftQuote.current = quote;
    setRows(priceRowsFrom(saved?.prices, currency, quote));
  }, [saved, currency, quote]);

  const update = (index: number, patch: Partial<PriceRow>) => { dirty.current = true; setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row))); };

  const save = async () => {
    if (saving || !supported || !draftQuote.current) return;
    const prices: Record<string, ModelPrice> = {};
    for (const row of rows) {
      const key = row.key.trim();
      if (!key) continue;
      const price = usdPriceFromRow(row, draftQuote.current);
      if (!price) {
        setError(t("usage.prices.invalid", { model: key }));
        return;
      }
      prices[key] = price;
    }
    setSaving(true);
    setError(null);
    try {
      const status: ConfigStatus = await api("/api/config", { method: "PUT", body: JSON.stringify({ billing: { currency: "USD", prices } }) });
      dirty.current = false;
      dispatch({ type: "configStatus", config: status });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setSaving(false);
    }
  };

  const cell = "w-full rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-2 py-1.5 text-[12.5px] tabular-nums text-ink focus:border-ink/[0.1] focus:outline-none disabled:opacity-50";
  return (
    <Card title={t("usage.prices.title")} subtitle={t("usage.prices.subtitle")}>
      <div className="mb-3 flex items-center gap-2 text-[12px] text-ink/55">
        <label className="flex items-center gap-2">
          {t("usage.prices.currency")}
          <input value={supported ? "EUR" : currency} readOnly maxLength={3} aria-label={t("usage.prices.currency")} className="w-16 rounded-lg border border-ink/[0.1] bg-ink/[0.04] px-2 py-1.5 text-[12.5px] uppercase text-ink focus:border-ink/[0.1] focus:outline-none" />
        </label>
      </div>
      {!supported && <p role="alert" className="mb-3 text-[12px] text-[#ffb454]">{t("usage.prices.unsupported", { currency })}</p>}
      <div className="grid grid-cols-[1fr_5rem_5rem_5rem_auto] items-center gap-x-2 gap-y-1.5 text-[11.5px] font-medium uppercase tracking-wide text-ink/55">
        <span>{t("usage.prices.colModel")}</span>
        <span>{t("usage.prices.colInput")}</span>
        <span>{t("usage.prices.colOutput")}</span>
        <span>{t("usage.prices.colCached")}</span>
        <span />
        {rows.map((row, index) => (
          <div key={index} className="contents">
            <input value={row.key} onChange={(e) => update(index, { key: e.target.value })} placeholder={t("usage.prices.modelPlaceholder")} aria-label={t("usage.prices.colModel")} disabled={locked} className={cn(cell, "font-mono normal-case tracking-normal")} />
            <input value={row.input} onChange={(e) => update(index, { input: e.target.value })} inputMode="decimal" aria-label={t("usage.prices.colInput")} disabled={locked} className={cell} />
            <input value={row.output} onChange={(e) => update(index, { output: e.target.value })} inputMode="decimal" aria-label={t("usage.prices.colOutput")} disabled={locked} className={cell} />
            <input value={row.cached} onChange={(e) => update(index, { cached: e.target.value })} inputMode="decimal" placeholder="—" aria-label={t("usage.prices.colCached")} disabled={locked} className={cell} />
            <button type="button" onClick={() => { dirty.current = true; setRows((current) => current.filter((_, i) => i !== index)); }} aria-label={t("usage.prices.remove")} disabled={locked} className="rounded-md p-1.5 text-ink/55 hover:bg-ink/[0.05] hover:text-[#ff8a96] disabled:opacity-50"><Trash2 size={13} /></button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => { dirty.current = true; setRows((current) => [...current, { key: "", input: "", output: "", cached: "" }]); }} disabled={locked} className="flex items-center gap-1.5 rounded-lg border border-ink/[0.1] px-3 py-1.5 text-[12px] text-ink/55 hover:bg-ink/[0.06] hover:text-ink disabled:opacity-50"><Plus size={13} />{t("usage.prices.add")}</button>
        <button type="button" onClick={() => void save()} disabled={locked} className="ml-auto flex items-center gap-1.5 rounded-lg bg-ink/[0.06] px-3 py-1.5 text-[12.5px] text-ink hover:bg-ink/[0.1] disabled:opacity-50">
          {saving && <Loader2 size={13} className="animate-spin" />}{t("common.save")}
        </button>
      </div>
      <p className="mt-2 text-[11.5px] leading-relaxed text-ink/55">{t("usage.prices.hint")}</p>
      {supported && <p className="mt-2 text-[11.5px] leading-relaxed text-ink/55">{t("usage.prices.currencyReference")}</p>}
      {error && <p role="alert" className="mt-2 text-[12px] text-[#ff8a96]">{error}</p>}
    </Card>
  );
}

/** Both cards, each only when the server is entitled to it. */
export function UsageBudgetCards({ budget }: { budget: BudgetState | null }) {
  const { state } = useStore();
  const budgets = entitledTo(state.config, "budgets");
  const billing = entitledTo(state.config, "billing");
  if (!budgets && !billing) return null;
  return (
    <>
      {budgets && <BudgetCard budget={budget} />}
      {billing && <PricesCard />}
    </>
  );
}
