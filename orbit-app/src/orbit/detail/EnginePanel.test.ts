import { Children, createElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, beforeEach, expect, it, vi } from "vitest";
import type { Bot, InstanceInfo } from "@/state/store";

const fixture = vi.hoisted(() => ({ instances: [] as InstanceInfo[], dispatch: vi.fn() }));
vi.mock("@/state/store", async (original) => ({
  ...await original<typeof import("@/state/store")>(),
  useStore: () => ({ state: { instances: fixture.instances }, dispatch: fixture.dispatch, refreshInstances: async () => {}, refreshModels: async () => {} }),
}));
vi.stubGlobal("localStorage", { getItem: () => null, setItem: () => {} });
vi.stubGlobal("window", {});
const { EnginePanel } = await import("./BotPanels");
const { ChipRow, List, Rows, Seg } = await import("./primitives");
afterAll(() => vi.unstubAllGlobals());

const claude: InstanceInfo = { instanceId: "claude", driverKind: "claudeAgent", displayName: "Claude", snapshot: { state: "available", authenticated: false }, models: { default: "opus", options: [{ id: "opus", label: "Opus" }] } };
const codex: InstanceInfo = { instanceId: "codex", driverKind: "codex", displayName: "Codex", snapshot: { state: "available", authenticated: true }, models: { default: "gpt", options: [{ id: "gpt", label: "GPT" }, { id: "gpt-mini", label: "GPT Mini" }] }, capabilities: { effortLevels: ["low", "high"] } };
const bot: Bot = { id: "fixture", threadId: "current", name: "Fixture", title: "", description: "", notifications: true, color: "green", unread: false, messages: [], modelSelection: { instanceId: "claude", model: "opus" }, tasks: [{ threadId: "current", title: "Current", createdAt: 1, modelSelection: { instanceId: "codex", model: "gpt", effort: "high" } }] };
type Node = ReactElement<Record<string, unknown> & { children?: ReactNode }>;
function nodes(value: ReactNode): Node[] {
  return Children.toArray(value).flatMap((child) => {
    if (!isValidElement(child)) return [];
    const node = child as Node;
    return [node, ...nodes(node.props.children)];
  });
}
function render(profile = bot) {
  let tree: ReactNode = null;
  function Capture() { tree = EnginePanel({ bot: profile, onBack: () => {}, open: () => {} }); return tree; }
  const html = renderToStaticMarkup(createElement(Capture));
  return { html, nodes: nodes(tree) };
}
beforeEach(() => { fixture.instances = [claude, codex]; fixture.dispatch.mockClear(); });

it("shows the effective Codex model in its header and separately identifies the Claude default", () => {
  const rendered = render();
  expect(rendered.html).toContain("Codex · GPT");
  expect(rendered.html).toContain("Claude · Opus");
  expect(rendered.nodes.find((node) => node.type === Seg)?.props.value).toBe("gpt");
  const effort = rendered.nodes.find((node) => node.type === ChipRow)?.props.chips as Array<{ active: boolean; onClick: () => void }>;
  expect(effort[2]?.active).toBe(true);
  effort[1]!.onClick();
  expect(fixture.dispatch).toHaveBeenCalledWith({ type: "setModel", botId: "fixture", threadId: "current", updateBotDefault: true, selection: { instanceId: "codex", model: "gpt", effort: "low" } });
});

it("updates the selected conversation model and default together, retaining the current effort", () => {
  const rendered = render();
  const segment = rendered.nodes.find((node) => node.type === Seg)!;
  (segment.props.onSelect as (model: string) => void)("gpt-mini");
  expect(fixture.dispatch).toHaveBeenCalledWith({ type: "setModel", botId: "fixture", threadId: "current", updateBotDefault: true, selection: { instanceId: "codex", model: "gpt-mini", effort: "high" } });
});

it("keeps the selected unavailable route visible and disables switching to a signed-out engine", () => {
  fixture.instances = [claude, { ...codex, snapshot: { state: "unavailable", reason: "Fixture engine missing" } }];
  const rendered = render();
  const list = rendered.nodes.find((node) => node.type === List)!;
  const items = list.props.items as Array<{ key: string; disabled?: boolean; meta?: string }>;
  expect(items.find((item) => item.key === "codex")).toMatchObject({ disabled: true, meta: "in use · Fixture engine missing" });
  expect(items.find((item) => item.key === "claude")).toMatchObject({ disabled: true, meta: "Sign-in required" });
  const rowNode = rendered.nodes.find((node) => node.type === Rows)!;
  const status = (rowNode.props.rows as Array<{ v: string }>)[0];
  expect(status?.v).toBe("Fixture engine missing");
  const segment = rendered.nodes.find((node) => node.type === Seg)!;
  (segment.props.onSelect as (model: string) => void)("gpt-mini");
  expect(fixture.dispatch).not.toHaveBeenCalled();
});

it("retains aggregate busy locks when another conversation is active", () => {
  const rendered = render({ ...bot, busy: true, tasks: [{ ...bot.tasks![0]!, busy: false, activity: "idle" }] });
  const segment = rendered.nodes.find((node) => node.type === Seg)!;
  expect((segment.props.options as Array<{ disabled: boolean }>).every((option) => option.disabled)).toBe(true);
  (segment.props.onSelect as (model: string) => void)("gpt-mini");
  expect(fixture.dispatch).not.toHaveBeenCalled();
});
