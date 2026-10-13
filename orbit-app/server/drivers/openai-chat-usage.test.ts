import { afterEach, expect, it, vi } from "vitest";
import type { RuntimeEvent, ProviderInstance } from "../contracts.ts";
import { OpenAICompatDriver } from "./openai-compat.ts";

afterEach(() => vi.unstubAllGlobals());
const frame = (value: unknown) => `data: ${JSON.stringify(value)}\n\n`;
const usage = (input: number, cached?: number, cost?: number) => ({ prompt_tokens: input, completion_tokens: 5, ...(cached === undefined ? {} : { prompt_tokens_details: { cached_tokens: cached } }), ...(cost === undefined ? {} : { cost }) });
const final = (measurement?: unknown) => frame({ choices: [{ delta: { content: "Fixture answer" }, finish_reason: "stop" }], ...(measurement === undefined ? {} : { usage: measurement }) }) + "data: [DONE]\n\n";

async function fixture(bodies: Array<string | Response>, test: (instance: ProviderInstance, events: RuntimeEvent[]) => Promise<void>, url = "https://openrouter.ai/api/v1") {
  let requests = 0;
  vi.stubGlobal("fetch", vi.fn(async (input: unknown, init?: RequestInit) => {
    init?.signal?.throwIfAborted();
    if (String(input).endsWith("/models")) return new Response(JSON.stringify({ data: [] }), { headers: { "content-type": "application/json" } });
    const body = bodies[requests++];
    if (body === undefined) throw new Error("Unexpected fixture request");
    return typeof body === "string" ? new Response(body, { headers: { "content-type": "text/event-stream" } }) : body;
  }));
  const instance = await OpenAICompatDriver.create({ instanceId: "compat", displayName: "Fixture", enabled: true, config: OpenAICompatDriver.decodeConfig({ url, model: "fixture-model", apiKeyEnv: "FIXTURE_KEY" }), environment: { FIXTURE_KEY: "synthetic" } });
  const events: RuntimeEvent[] = [];
  instance.adapter.onEvent(event => events.push(event));
  try { await test(instance, events); }
  finally { await instance.dispose(); }
}

const settled = async (events: RuntimeEvent[]) => {
  await vi.waitFor(() => expect(events.some(event => event.type === "turn.completed")).toBe(true));
  return events.find(event => event.type === "turn.completed");
};

it("preserves cached input as a subset and the documented OpenRouter USD cost", () => fixture([final(usage(100, 80, 0.003))], async (instance, events) => {
  await instance.adapter.sendTurn({ threadId: "thread", text: "fixture" });
  expect(await settled(events)).toMatchObject({ ok: true, usage: { input: 100, output: 5, cachedInput: 80 }, cost: 0.003 });
}));

it("does not assign USD to arbitrary providers' cost extensions", () => fixture([final(usage(100, 80, 2))], async (instance, events) => {
  await instance.adapter.sendTurn({ threadId: "thread", text: "fixture" });
  expect(await settled(events)).toMatchObject({ usage: { input: 100, cachedInput: 80 }, cost: null });
}, "https://fixture.example/v1"));

it("replaces snapshots from one request instead of charging each frame", () => fixture([
  frame({ choices: [{ delta: { content: "Fixture" } }], usage: usage(100, 50, 0.002) }) + final(usage(120, 90, 0.003)),
], async (instance, events) => {
  await instance.adapter.sendTurn({ threadId: "thread", text: "fixture" });
  expect(await settled(events)).toMatchObject({ usage: { input: 120, output: 5, cachedInput: 90 }, cost: 0.003 });
  expect(events.filter(event => event.type === "thread.token-usage.updated")).toHaveLength(1);
}));

const ask = (measurement: unknown) => frame({ choices: [{ delta: { tool_calls: [{ index: 0, id: "ask-fixture", type: "function", function: { name: "ask_user", arguments: JSON.stringify({ questions: [{ question: "Fixture choice?" }] }) } }] }, finish_reason: "tool_calls" }], usage: measurement }) + "data: [DONE]\n\n";
const answerCard = async (instance: ProviderInstance, events: RuntimeEvent[]) => {
  await vi.waitFor(() => expect(events.some(event => event.type === "request.opened")).toBe(true));
  const request = events.find(event => event.type === "request.opened");
  if (!request || request.type !== "request.opened") throw new Error("Fixture question missing");
  await instance.adapter.respondToRequest("thread", request.requestId!, { behavior: "answer", message: "Fixture answer" });
};

it("sums separate tool rounds once and includes their reported cache and price", () => fixture([ask(usage(100, 80, 0.003)), final(usage(150, 120, 0.004))], async (instance, events) => {
  await instance.adapter.sendTurn({ threadId: "thread", text: "fixture", approvalMode: "full" });
  await answerCard(instance, events);
  expect(await settled(events)).toMatchObject({ ok: true, usage: { input: 250, output: 10, cachedInput: 200 }, cost: 0.007 });
  expect(events.filter(event => event.type === "turn.completed")).toHaveLength(1);
}));

it("does not present partial cache or partial reported price as a complete turn", () => fixture([ask(usage(100, 80, 0.003)), final(usage(150))], async (instance, events) => {
  await instance.adapter.sendTurn({ threadId: "thread", text: "fixture" });
  await answerCard(instance, events);
  const done = await settled(events);
  expect(done).toMatchObject({ usage: { input: 250, output: 10 }, cost: null });
  expect(done?.type === "turn.completed" && done.usage).not.toHaveProperty("cachedInput");
}));

it.each([{}, { prompt_tokens: "100", completion_tokens: -5 }])("keeps invalid or absent measurements unknown (%j)", measurement => fixture([final(measurement)], async (instance, events) => {
  await instance.adapter.sendTurn({ threadId: "thread", text: "fixture" });
  const done = await settled(events);
  expect(done).toMatchObject({ ok: true, cost: null });
  expect(done).not.toHaveProperty("usage");
}));

it("retains usage observed before a protocol error instead of losing billed work", () => fixture([
  frame({ choices: [{ delta: { content: "Fixture" } }], usage: usage(100, 80, 0.003) }) + frame({ error: { message: "synthetic upstream failure" } }),
], async (instance, events) => {
  await instance.adapter.sendTurn({ threadId: "thread", text: "fixture" });
  expect(await settled(events)).toMatchObject({ ok: false, usage: { input: 100, output: 5, cachedInput: 80 }, cost: 0.003 });
}));

it("retains the completed first round's usage after cancellation at a question", () => fixture([ask(usage(100, 80, 0.003))], async (instance, events) => {
  await instance.adapter.sendTurn({ threadId: "thread", text: "fixture" });
  await vi.waitFor(() => expect(events.some(event => event.type === "request.opened")).toBe(true));
  await instance.adapter.interruptTurn("thread");
  expect(await settled(events)).toMatchObject({ ok: false, stopReason: "interrupted", usage: { input: 100, output: 5, cachedInput: 80 }, cost: 0.003 });
}));

it("records explicit zero provider cost as reported, without inventing it for unmeasured calls", () => fixture([final(usage(0, 0, 0))], async (instance, events) => {
  await instance.adapter.sendTurn({ threadId: "thread", text: "fixture" });
  expect(await settled(events)).toMatchObject({ cost: 0, usage: { input: 0, output: 5, cachedInput: 0 } });
}));

it("does not mistake output-only usage for measured zero input or cache coverage", () => fixture([final({ completion_tokens: 5 })], async (instance, events) => {
  await instance.adapter.sendTurn({ threadId: "thread", text: "fixture" });
  const done = await settled(events);
  expect(done).toMatchObject({ usage: { input: 0, output: 5 }, cost: null });
  expect(done?.type === "turn.completed" && done.usage).not.toHaveProperty("cachedInput");
}));

it("retains measured fields when a late usage frame is empty or partial", () => fixture([
  frame({ choices: [{ delta: { content: "Fixture" } }], usage: usage(100, 80, 0.003) }) +
  frame({ choices: [], usage: { completion_tokens: 7 } }) + final({}),
], async (instance, events) => {
  await instance.adapter.sendTurn({ threadId: "thread", text: "fixture" });
  expect(await settled(events)).toMatchObject({ usage: { input: 100, output: 7, cachedInput: 80 }, cost: null });
}));

it("invalidates inherited cache and price when a newer prompt snapshot omits them", () => fixture([
  frame({ choices: [{ delta: { content: "Fixture" } }], usage: usage(100, 80, 0.003) }) + final({ prompt_tokens: 200, completion_tokens: 5 }),
], async (instance, events) => {
  await instance.adapter.sendTurn({ threadId: "thread", text: "fixture" });
  const done = await settled(events);
  expect(done).toMatchObject({ usage: { input: 200, output: 5 }, cost: null });
  expect(done?.type === "turn.completed" && done.usage).not.toHaveProperty("cachedInput");
}));
