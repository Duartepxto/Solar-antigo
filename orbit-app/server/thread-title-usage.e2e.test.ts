// Generated titles are opt-in provider calls. Exercise the real admission,
// helper and durable accounting path with disposable fake-engine servers.
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";
import { launchVerificationServer, runControlOrbit, type VerificationServer } from "../scripts/control-orbit.ts";
import { readUsage } from "./usage-ledger.ts";
import { removeTempDir } from "./testing/cleanup.ts";

async function fixture(test: (session: VerificationServer) => Promise<void>, result?: string): Promise<void> {
  const directory = mkdtempSync(join(tmpdir(), "solar-title-usage-"));
  mkdirSync(join(directory, "server"));
  writeFileSync(join(directory, "server", "index.js"), 'export async function register() { return { customer: "Fixture", features: ["budgets"], expiresAt: "2099-01-01" }; }\n');
  const replies = join(directory, "replies.json");
  writeFileSync(replies, JSON.stringify({ "Name the conversation": "Plan release checklist" }));
  let session: VerificationServer | undefined;
  try {
    session = await launchVerificationServer({ ...process.env, FAKE_CLAUDE_TEXT_ROUTES: replies, ...(result ? { FAKE_CLAUDE_TEXT_RESULT: result } : {}) }, undefined, undefined, undefined, { dir: directory, licenseKey: "fixture-key" });
    await test(session);
  } finally {
    if (session) { console.info(`Thread title fixture evidence: ${session.info.logPath}`); await session.close(); }
    await removeTempDir(directory);
  }
}

const json = (body: unknown, token?: string, method = "POST"): RequestInit => ({ method, headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) });
const rows = (session: VerificationServer) => readUsage(session.info.dataDir, { from: new Date(Date.now() - 86_400_000), to: new Date() });

it("books a generated title to the requesting person and includes it in the spend cap", () => fixture(async session => {
  const api = (path: string, init?: RequestInit) => fetch(`${session.info.url}${path}`, init);
  expect((await api("/api/config", json({ features: { llmThreadTitles: true }, budgets: { monthlyUsd: 0.015 } }, undefined, "PUT"))).status).toBe(200);
  const created = await runControlOrbit(["new-bot", "--name", "Title usage probe", "--url", session.info.url]) as any;
  const bot = created.bot;
  const opened = await (await api("/api/auth/pairing", json({}))).json() as any;
  const paired = await (await api("/api/auth/pair", json({ code: opened.code, label: "Fixture phone" }))).json() as any;
  expect(paired.token).toBeTypeOf("string");
  expect((await api(`/api/bots/${bot.id}/messages`, json({ text: "prepare the release acceptance checklist" }, paired.token))).status).toBe(202);
  await runControlOrbit(["wait", "--bot", bot.id, "--timeout", "30", "--url", session.info.url]);
  await expect.poll(() => rows(session).filter(row => row.botId === bot.id).length, { timeout: 10_000 }).toBe(2);
  const helper = rows(session).find(row => row.threadId.startsWith("title-"));
  expect(helper).toMatchObject({ botId: bot.id, driverKind: "claudeAgent", model: "claude-haiku-4-5", input: 15, output: 5, cachedInput: 2, costUsd: 0.01, costSource: "reported", trigger: { kind: "user", label: "Fixture phone" } });
  const state = await (await api("/api/bots?messages=0")).json() as any;
  expect(state.bots.find((candidate: any) => candidate.id === bot.id).tasks.some((task: any) => task.title === "Plan release checklist")).toBe(true);
  const refused = await api(`/api/bots/${bot.id}/messages`, json({ text: "next task" }));
  expect(refused.status).toBe(409);
  expect(await refused.json()).toMatchObject({ code: "spend_cap" });
  const ledger = join(session.info.dataDir, "usage", `${new Date().toISOString().slice(0, 7)}.jsonl`);
  expect(existsSync(ledger)).toBe(true);
  expect(readFileSync(ledger, "utf8")).not.toContain("acceptance checklist");
}), 120_000);

it("books group title usage to its responding bot while preserving the owner trigger", () => fixture(async session => {
  const api = (path: string, init?: RequestInit) => fetch(`${session.info.url}${path}`, init);
  expect((await api("/api/config", json({ features: { llmThreadTitles: true } }, undefined, "PUT"))).status).toBe(200);
  const { bot } = await runControlOrbit(["new-bot", "--name", "Group title probe", "--url", session.info.url]) as any;
  const made = await api("/api/groups", json({ name: "Release room", memberIds: [bot.id], setup: { bulletin: "", defaultResponder: { kind: "member", botId: bot.id } } }));
  expect(made.status).toBe(201);
  const { group } = await made.json() as any;
  expect((await api(`/api/groups/${group.id}/messages`, json({ text: "prepare the release acceptance checklist" }))).status).toBe(202);
  await expect.poll(() => rows(session).filter(row => row.botId === bot.id).length, { timeout: 30_000 }).toBe(2);
  expect(rows(session).find(row => row.threadId.startsWith("title-"))).toMatchObject({ botId: bot.id, model: "claude-haiku-4-5", input: 15, output: 5, cachedInput: 2, costUsd: 0.01, trigger: { kind: "owner" } });
  const state = await (await api("/api/bots?messages=0")).json() as any;
  expect(state.groups.find((candidate: any) => candidate.id === group.id).tasks.some((task: any) => task.title === "Plan release checklist")).toBe(true);
}), 120_000);

it("keeps a title helper with absent usage unpriced rather than estimating zero", () => fixture(async session => {
  const api = (path: string, init?: RequestInit) => fetch(`${session.info.url}${path}`, init);
  expect((await api("/api/config", json({ features: { llmThreadTitles: true } }, undefined, "PUT"))).status).toBe(200);
  const { bot } = await runControlOrbit(["new-bot", "--name", "Unmeasured title probe", "--url", session.info.url]) as any;
  await runControlOrbit(["send", "--bot", bot.id, "--text", "prepare release", "--url", session.info.url]);
  await runControlOrbit(["wait", "--bot", bot.id, "--timeout", "30", "--url", session.info.url]);
  await expect.poll(() => rows(session).some(row => row.threadId.startsWith("title-")), { timeout: 10_000 }).toBe(true);
  const helper = rows(session).find(row => row.threadId.startsWith("title-"));
  expect(helper).toMatchObject({ input: 0, output: 0, costUsd: null });
  expect(helper).not.toHaveProperty("costSource");
}, JSON.stringify({ type: "result", is_error: false, result: "Plan release checklist" })), 120_000);
