import { Children, createElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { ConfigStatus } from "@/state/store";
import { ECB_USAGE_CURRENCY_SEED } from "../../shared/usage-currency";
import { t } from "@/lib/i18n";

const fixture = vi.hoisted(() => ({ config: {} as ConfigStatus, values: [] as unknown[], index: 0, effects: [] as Array<() => void>, api: vi.fn() }));
vi.mock("react", async (original) => ({
  ...await original<typeof import("react")>(),
  useState: (initial: unknown) => {
    const index = fixture.index++;
    if (!(index in fixture.values)) fixture.values[index] = typeof initial === "function" ? initial() : initial;
    return [fixture.values[index], (next: unknown) => { fixture.values[index] = typeof next === "function" ? next(fixture.values[index]) : next; }];
  },
  useRef: (initial: unknown) => {
    const index = fixture.index++;
    if (!(index in fixture.values)) fixture.values[index] = { current: initial };
    return fixture.values[index];
  },
  useEffect: (effect: () => void) => { fixture.effects.push(effect); },
}));
vi.mock("@/state/store", async (original) => ({
  ...await original<typeof import("@/state/store")>(),
  api: (...args: unknown[]) => fixture.api(...args),
  useStore: () => ({ state: { config: fixture.config }, dispatch: (action: { config: ConfigStatus }) => { fixture.config = action.config; } }),
}));
const { BudgetCard, PricesCard, euroInput } = await import("./UsageBudget");
const { setUsageCurrency } = await import("@/lib/usage-currency");
type Node = ReactElement<Record<string, unknown> & { children?: ReactNode }>;
function nodes(value: ReactNode): Node[] {
  return Children.toArray(value).flatMap((child) => {
    if (!isValidElement(child)) return [];
    const node = child as Node;
    return [node, ...nodes(node.props.children)];
  });
}
function render(kind: "budget" | "prices") {
  let tree: ReactNode = null;
  function Capture() { fixture.index = 0; tree = kind === "budget" ? BudgetCard({ budget: null }) : PricesCard(); return tree; }
  const html = renderToStaticMarkup(createElement(Capture));
  for (const effect of fixture.effects.splice(0)) effect();
  return { html, nodes: nodes(tree) };
}
function edit(rendered: ReturnType<typeof render>, name: string, value: string) {
  const node = rendered.nodes.find((item) => item.type === "input" && item.props["aria-label"] === name)!;
  (node.props.onChange as (event: { target: { value: string } }) => void)({ target: { value } });
}
function save(rendered: ReturnType<typeof render>, kind: "budget" | "prices") {
  if (kind === "budget") (rendered.nodes.find((item) => item.type === "form")!.props.onSubmit as (event: { preventDefault: () => void }) => void)({ preventDefault: () => {} });
  else (rendered.nodes.filter((item) => item.type === "button").at(-1)!.props.onClick as () => void)();
}
beforeEach(() => {
  setUsageCurrency({ ...ECB_USAGE_CURRENCY_SEED });
  fixture.values = []; fixture.effects = []; fixture.index = 0;
  fixture.config = { box: { configured: false }, vps: { configured: false, sshAlias: "" }, rooms: { turnTimeoutMinutes: 30 }, localVm: { mode: "shared", maxInstances: 1 }, budgets: { monthlyUsd: 50.123456789123, warnAtPercent: 80 }, billing: { currency: "USD", prices: { fixture: { inputPerMillion: 0.000000123456789123, outputPerMillion: 20 } } } } as ConfigStatus;
  fixture.api.mockReset();
  fixture.api.mockImplementation(async (_path: string, request: { body: string }) => ({ ...fixture.config, ...JSON.parse(request.body) }));
});
afterEach(() => setUsageCurrency({ ...ECB_USAGE_CURRENCY_SEED }));

it("saves an unchanged EUR budget display without rounding its original USD cap", async () => {
  const original = fixture.config.budgets!.monthlyUsd;
  const rendered = render("budget");
  expect(rendered.html).toContain(`value="${euroInput(original)}"`);
  save(rendered, "budget");
  await Promise.resolve(); await Promise.resolve();
  expect(JSON.parse(fixture.api.mock.calls[0]![1].body)).toEqual({ budgets: { monthlyUsd: original, warnAtPercent: 80 } });
});

it("keeps an edited cap and its conversion rate through quote/config refresh before saving", async () => {
  edit(render("budget"), t("usage.budget.monthly"), "25");
  setUsageCurrency({ ...ECB_USAGE_CURRENCY_SEED, usdPerEur: 1.3 });
  fixture.config = { ...fixture.config, budgets: { monthlyUsd: 100, warnAtPercent: 90 } };
  const refreshed = render("budget");
  expect(refreshed.html).toContain('value="25"');
  save(refreshed, "budget");
  await Promise.resolve(); await Promise.resolve();
  expect(JSON.parse(fixture.api.mock.calls[0]![1].body)).toEqual({ budgets: { monthlyUsd: 27.965, warnAtPercent: 80 } });
});

it("submits edited EUR prices in USD while preserving untouched tiny prices and dirty drafts", async () => {
  const tiny = fixture.config.billing!.prices!.fixture!.inputPerMillion;
  edit(render("prices"), t("usage.prices.colOutput"), "2");
  setUsageCurrency({ ...ECB_USAGE_CURRENCY_SEED, usdPerEur: 1.3 });
  fixture.config = { ...fixture.config, billing: { currency: "USD", prices: { fixture: { inputPerMillion: 7, outputPerMillion: 90 } } } };
  const refreshed = render("prices");
  expect(refreshed.html).toContain('value="2"');
  save(refreshed, "prices");
  await Promise.resolve(); await Promise.resolve();
  expect(JSON.parse(fixture.api.mock.calls[0]![1].body)).toEqual({ billing: { currency: "USD", prices: { fixture: { inputPerMillion: tiny, outputPerMillion: 2.2372 } } } });
});

it("never submits unsupported legacy price currencies", () => {
  fixture.config = { ...fixture.config, billing: { currency: "GBP", prices: { fixture: { inputPerMillion: 4, outputPerMillion: 20 } } } };
  const rendered = render("prices");
  expect(rendered.nodes.filter((item) => item.type === "input" && !item.props.readOnly).every((item) => item.props.disabled)).toBe(true);
  save(rendered, "prices");
  expect(fixture.api).not.toHaveBeenCalled();
});
