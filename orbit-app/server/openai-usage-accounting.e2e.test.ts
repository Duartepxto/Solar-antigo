import { createServer } from "node:http";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";
import { launchVerificationServer, runControlOrbit, type VerificationServer } from "../scripts/control-orbit.ts";
import { readUsage } from "./usage-ledger.ts";
import { removeTempDir } from "./testing/cleanup.ts";

it("books multi-round cache, billed failed streams and unknown usage through the real API and cap", async () => {
  let calls = 0;
  let mode: "tools" | "error" | "unknown" = "tools";
  const frame = (body: unknown) => `data: ${JSON.stringify(body)}\n\n`;
  const measurement = (input: number, cached: number) => ({ prompt_tokens: input, completion_tokens: 5, prompt_tokens_details: { cached_tokens: cached }, cost: 99 });
  const provider = createServer(async (request, response) => {
    if (request.url?.endsWith("/models")) { response.setHeader("content-type", "application/json"); response.end(JSON.stringify({ data: [] })); return; }
    let raw = "";
    for await (const chunk of request) raw += chunk;
    const body = JSON.parse(raw);
    calls++;
    response.setHeader("content-type", "text/event-stream");
    if (mode === "error") {
      response.end(frame({ choices: [{ delta: { content: "Synthetic billed partial reply" } }], usage: measurement(100, 80) }) + frame({ error: { message: "Synthetic provider failure" } }));
    } else if (mode === "unknown") {
      response.end(frame({ choices: [{ delta: { content: "Synthetic answer" }, finish_reason: "stop" }], usage: {} }) + "data: [DONE]\n\n");
    } else if (!body.messages.some((message: { role: string }) => message.role === "tool")) {
      response.end(frame({ choices: [{ delta: { tool_calls: [{ index: 0, id: "fixture-ask", type: "function", function: { name: "ask_user", arguments: JSON.stringify({ questions: [{ question: "Fixture choice?" }] }) } }] }, finish_reason: "tool_calls" }], usage: measurement(100, 80) }) + "data: [DONE]\n\n");
    } else {
      response.end(frame({ choices: [{ delta: { content: "Synthetic final answer" }, finish_reason: "stop" }], usage: measurement(150, 120) }) + "data: [DONE]\n\n");
    }
  });
  await new Promise<void>(resolve => provider.listen(0, "127.0.0.1", resolve));
  const address = provider.address();
  if (!address || typeof address === "string") throw new Error("Fixture address missing");
  const layer = mkdtempSync(join(tmpdir(), "solar-accounting-layer-"));
  mkdirSync(join(layer, "server"));
  writeFileSync(join(layer, "server", "index.js"), 'export async function register() { return { customer: "Fixture", features: ["budgets"], expiresAt: "2099-01-01" }; }\n');
  let session: VerificationServer | undefined;
  try {
    session = await launchVerificationServer(process.env, undefined, undefined, undefined, { dir: layer, licenseKey: "fixture-key" });
    const fixture = session;
    const json = (body: unknown, method = "POST"): RequestInit => ({ method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const api = (path: string, init?: RequestInit) => fetch(`${fixture.info.url}${path}`, init);
    const control = (args: string[]) => runControlOrbit([...args, "--url", fixture.info.url]) as Promise<any>;
    expect((await api("/api/config", json({ openaiCompat: { key: "synthetic-fixture-key", url: `http://127.0.0.1:${address.port}/v1`, model: "gpt-6-luna" }, budgets: { monthlyUsd: 0.00001 } }, "PUT"))).status).toBe(200);
    const { bot } = await control(["new-bot", "--name", "Accounting probe"]);
    await control(["set-model", "--bot", bot.id, "--instance", "openaiCompat", "--model", "gpt-6-luna"]);
    const rows = () => readUsage(fixture.info.dataDir, { from: new Date(Date.now() - 86_400_000), to: new Date() }).filter(row => row.botId === bot.id);
    await control(["send", "--bot", bot.id, "--text", "Synthetic fixture request"]);
    expect((await control(["wait", "--bot", bot.id, "--timeout", "30"])).status).toBe("needs-user");
    const state = await (await api("/api/bots")).json() as any;
    const active = state.bots.find((candidate: any) => candidate.id === bot.id);
    const request = active.messages.find((message: any) => message.card?.requestId && !message.card.answered)?.card;
    expect(request?.requestId).toBeTruthy();
    expect((await api(`/api/bots/${bot.id}/respond`, json({ threadId: bot.threadId, requestId: request.requestId, behavior: "answer", message: "Fixture answer" }))).status).toBe(200);
    expect((await control(["wait", "--bot", bot.id, "--timeout", "30"])).status).toBe("settled");
    await expect.poll(rows).toHaveLength(1);
    const cost = (50 * 0.1 + 200 * 0.01 + 10 * 0.5) / 1_000_000;
    expect(rows()[0]).toMatchObject({ input: 250, output: 10, cachedInput: 200, costSource: "estimated", trigger: { kind: "owner" } });
    expect(rows()[0].costUsd).toBeCloseTo(cost, 12);
    // Arbitrary loopback usage.cost has no USD contract and must not become $198.
    expect(calls).toBe(2);
    const refused = await api(`/api/bots/${bot.id}/messages`, json({ text: "Synthetic next request" }));
    expect(refused.status).toBe(409);
    expect(await refused.json()).toMatchObject({ code: "spend_cap" });
    expect(calls).toBe(2);
    expect((await api("/api/config", json({ budgets: { monthlyUsd: 0.001 } }, "PUT"))).status).toBe(200);
    mode = "error";
    await control(["send", "--bot", bot.id, "--text", "Synthetic failure request"]);
    expect((await control(["wait", "--bot", bot.id, "--timeout", "30"])).status).toBe("failed");
    await expect.poll(rows).toHaveLength(2);
    expect(rows()[1]).toMatchObject({ input: 100, output: 5, cachedInput: 80, costSource: "estimated" });
    mode = "unknown";
    await control(["send", "--bot", bot.id, "--text", "Synthetic unknown request"]);
    expect((await control(["wait", "--bot", bot.id, "--timeout", "30"])).status).toBe("settled");
    await expect.poll(rows).toHaveLength(3);
    expect(rows()[2]).toMatchObject({ input: 0, output: 0, costUsd: null });
    expect(rows()[2]).not.toHaveProperty("costSource");
  } finally {
    if (session) { console.info(`OpenAI-compatible usage fixture evidence: ${session.info.logPath}`); await session.close(); }
    provider.closeAllConnections();
    await new Promise<void>(resolve => provider.close(() => resolve()));
    await removeTempDir(layer);
  }
}, 120_000);
