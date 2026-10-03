// Run the Orbit agent evals against real models through the Claude Code CLI.
//
//   node --experimental-strip-types scripts/evals/orbit-agent/run.ts \
//     [--models claude-opus-5-5,claude-sonnet-5-5] [--only id,id] [--repeat 1]
//
// Each scenario is one fresh `claude -p` turn: Orbit's own system prompt
// appended, the stand-in tool server (stub-mcp.ts) as its only tools, no
// personal Claude Code setup. Uses the signed-in Claude Code account; no
// prompt is sent to anything else. Results go to .orbit-scratch/evals/.
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { orbitAgentSystemPrompt } from "../../../server/orbit-agent.ts";
import { SCENARIOS, type Scenario } from "./scenarios.ts";

const ROOT = resolve(import.meta.dirname, "../../..");
const arg = (flag: string) => { const i = process.argv.indexOf(flag); return i >= 0 ? process.argv[i + 1] : undefined; };
const models = (arg("--models") ?? "claude-opus-5-5,claude-sonnet-5-5,claude-haiku-4-5").split(",").filter(Boolean);
const only = arg("--only")?.split(",");
const repeat = Math.max(1, Number(arg("--repeat") ?? 1));
const scenarios = only ? SCENARIOS.filter((s) => only.includes(s.id)) : SCENARIOS;

const runDir = join(ROOT, ".orbit-scratch", "evals", new Date().toISOString().replace(/[:.]/g, "-"));
mkdirSync(runDir, { recursive: true });
const promptFile = join(runDir, "system.txt");
writeFileSync(promptFile, orbitAgentSystemPrompt({ teams: [{ name: "Orbit", bots: 3, chief: "Pilot" }], looseBots: 1 }));

interface Outcome { scenario: string; category: string; model: string; pass: boolean; failures: string[]; reply: string; calls: string[] }

function grade(s: Scenario, reply: string, calls: Array<{ name: string; arguments: Record<string, unknown> }>): string[] {
  const names = calls.map((call) => call.name.replace(/^mcp__[^_]+__/, ""));
  const f: string[] = [];
  for (const tool of s.expect.calls ?? []) if (!names.includes(tool)) f.push(`did not call ${tool}`);
  if (s.expect.anyOf && !s.expect.anyOf.some((tool) => names.includes(tool))) f.push(`called none of ${s.expect.anyOf.join("/")}`);
  for (const tool of s.expect.notCalls ?? []) if (names.includes(tool)) f.push(`called ${tool}`);
  for (const re of s.expect.says ?? []) if (!re.test(reply)) f.push(`reply lacks ${re}`);
  for (const re of s.expect.neverSays ?? []) if (re.test(reply)) f.push(`reply has ${re}`);
  for (const check of s.expect.args ?? []) {
    const call = calls.find((c) => c.name.replace(/^mcp__[^_]+__/, "") === check.tool);
    if (call && !check.test(call.arguments)) f.push(`args: ${check.label}`);
  }
  return f;
}

function runOne(s: Scenario, model: string, n: number): Promise<Outcome> {
  const dir = join(runDir, `${model}--${s.id}--${n}`);
  mkdirSync(dir, { recursive: true });
  const scenarioFile = join(dir, "scenario.json");
  writeFileSync(scenarioFile, JSON.stringify({ tools: s.tools ?? {} }));
  const callsFile = join(dir, "calls.ndjson");
  writeFileSync(callsFile, "");
  const mcpConfig = join(dir, "mcp.json");
  writeFileSync(mcpConfig, JSON.stringify({ mcpServers: { orbit: {
    command: process.execPath,
    args: ["--experimental-strip-types", "--no-warnings", join(ROOT, "scripts/evals/orbit-agent/stub-mcp.ts")],
    env: { ORBIT_EVAL_SCENARIO: scenarioFile, ORBIT_EVAL_CALLS: callsFile },
  } } }));
  // the agent works in an empty folder: the scenario's script and the call
  // log sit beside it, where it can't read the answers it is graded on
  // outside the repository too, or Claude Code loads this repo's own
  // CLAUDE.md, skills and git state as project context
  const work = mkdtempSync(join(tmpdir(), "orbit-eval-"));
  return new Promise((done) => {
    const child = spawn("claude", [
      "-p", s.message, "--model", model, "--output-format", "json",
      "--append-system-prompt-file", promptFile,
      "--mcp-config", mcpConfig, "--strict-mcp-config", "--setting-sources", "project",
      "--allowedTools", "mcp__orbit", "--permission-mode", "default", "--max-turns", "8",
    ], { cwd: work, stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    child.stdout.on("data", (chunk) => { out += chunk; });
    const timer = setTimeout(() => child.kill("SIGTERM"), 240_000);
    child.on("close", () => {
      clearTimeout(timer);
      let reply = "";
      try { reply = String(JSON.parse(out).result ?? ""); } catch { reply = out.slice(-2000); }
      const calls = existsSync(callsFile)
        ? readFileSync(callsFile, "utf8").trim().split("\n").filter(Boolean).map((line) => JSON.parse(line))
        : [];
      writeFileSync(join(dir, "reply.txt"), reply);
      const failures = grade(s, reply, calls);
      done({ scenario: s.id, category: s.category, model, pass: failures.length === 0, failures, reply, calls: calls.map((c: { name: string }) => c.name) });
    });
  });
}

const results: Outcome[] = [];
const queue = models.flatMap((model) => scenarios.flatMap((s) => Array.from({ length: repeat }, (_, n) => ({ s, model, n }))));
const workers = Array.from({ length: 3 }, async () => {
  while (queue.length) {
    const job = queue.shift()!;
    const outcome = await runOne(job.s, job.model, job.n);
    results.push(outcome);
    console.log(`${outcome.pass ? "PASS" : "FAIL"} ${outcome.model.padEnd(20)} ${outcome.scenario}${outcome.pass ? "" : `  — ${outcome.failures.join("; ")}`}`);
  }
});
await Promise.all(workers);

writeFileSync(join(runDir, "results.json"), JSON.stringify(results, null, 2));
console.log(`\nresults: ${runDir}`);
for (const model of models) {
  const mine = results.filter((r) => r.model === model);
  const byCategory = new Map<string, { pass: number; total: number }>();
  for (const r of mine) {
    const c = byCategory.get(r.category) ?? { pass: 0, total: 0 };
    c.total += 1; if (r.pass) c.pass += 1;
    byCategory.set(r.category, c);
  }
  console.log(`${model}: ${mine.filter((r) => r.pass).length}/${mine.length}  ${[...byCategory].map(([k, v]) => `${k} ${v.pass}/${v.total}`).join(" · ")}`);
}
