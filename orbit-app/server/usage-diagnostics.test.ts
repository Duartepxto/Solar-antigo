import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import type { UsageRow } from "./usage-ledger.ts";
import { diagnoseUsage, readUsageDiagnostics } from "./usage-diagnostics.ts";

const row = (override: Partial<UsageRow> = {}): UsageRow => ({
  at: "2026-10-10T12:00:00.000Z", botId: "private-bot-id", botName: "private-bot-name",
  threadId: "private-thread-id", instanceId: "private-instance-id", driverKind: "codex",
  model: "gpt-6-luna", input: 100, output: 10, cachedInput: 60, costUsd: 0.01,
  costSource: "estimated", trigger: { kind: "owner" }, ...override,
});

describe("usage diagnostics", () => {
  it("separates unknown cache from measured uncached input and peer turns from owners", () => {
    const report = diagnoseUsage([
      row(), row({ at: "2026-10-10T12:01:00Z", input: 200, cachedInput: undefined, trigger: { kind: "bot", botId: "private-peer-id" }, costUsd: null }),
      row({ at: "2026-10-10T12:02:00Z", input: 50, cachedInput: 0, trigger: { kind: "user", email: "private@example.test" }, costSource: "reported" }),
    ]);
    expect(report.total).toMatchObject({ turns: 3, input: 350, output: 30, cachedInputKnown: 60, uncachedInputKnown: 90, inputWithUnknownCache: 200, cacheMeasuredTurns: 2, cacheUnknownTurns: 1, measuredCacheShare: 0.4, estimatedCostUsd: 0.01, reportedCostUsd: 0.01, unpricedTurns: 1 });
    expect(report.byTrigger.find(group => group.trigger === "bot")?.total).toMatchObject({ turns: 1, input: 200, inputWithUnknownCache: 200 });
    expect(report.inputTokensPerTurn).toEqual({ median: 100, p95: 200, max: 200 });
    expect(JSON.stringify(report)).not.toMatch(/private-|@|gpt-6/);
  });

  it("retains duplicate records while warning and does not equate empty measurements with free calls", () => {
    const empty = row({ input: 0, output: 0, cachedInput: undefined, costUsd: 0, promptBytes: { stable: 19994, volatile: 1818 } });
    const report = diagnoseUsage([empty, empty]);
    expect(report).toMatchObject({ duplicateSettlementKeys: 1, uniqueBots: 1, uniqueThreads: 1 });
    expect(report.total).toMatchObject({ turns: 2, zeroTokenTurns: 2, zeroCostZeroTokenTurns: 2, measuredCacheShare: null, promptMeasuredTurns: 2, stablePromptBytes: 39988, volatilePromptBytes: 3636, maxAssembledPromptBytes: 21812 });
  });

  it("clamps impossible cache shares and keeps missing prompt coverage absent", () => {
    expect(diagnoseUsage([row({ cachedInput: 999, promptBytes: { stable: Number.NaN, volatile: 100 } })]).total).toMatchObject({ cachedInputKnown: 100, uncachedInputKnown: 0, measuredCacheShare: 1, promptMeasuredTurns: 0, maxAssembledPromptBytes: null });
    expect(diagnoseUsage([]).inputTokensPerTurn).toEqual({ median: null, p95: null, max: null });
  });

  it("reads only selected ledgers and counts corrupt lines without exposing or modifying data", async () => {
    const dir = await mkdtemp(join(tmpdir(), "solar-usage-diagnostic-"));
    try {
      await mkdir(join(dir, "usage"));
      const ledger = join(dir, "usage", "2026-10.jsonl");
      const content = [JSON.stringify(row()), "{torn private message", JSON.stringify({ ...row(), input: "invalid" }), JSON.stringify(row({ at: "2026-10-11T12:00:00Z" })), ""].join("\n");
      await writeFile(ledger, content);
      await writeFile(join(dir, "usage", "2026-09.jsonl"), JSON.stringify(row()));
      await writeFile(join(dir, "usage", "notes.jsonl"), JSON.stringify(row()));
      const range = { from: new Date("2026-10-10T00:00:00Z"), to: new Date("2026-10-10T23:59:59.999Z") };
      const report = await readUsageDiagnostics(dir, range);
      expect(report).toMatchObject({ filesRead: 1, unreadableFiles: 0, invalidRows: 2, outsideRangeRows: 1, total: { turns: 1, input: 100 } });
      const cli = spawnSync(process.execPath, ["--experimental-strip-types", "scripts/solar-usage-audit.ts", "--data-dir", dir, "--from", "2026-10-10", "--to", "2026-10-10"], { cwd: process.cwd(), encoding: "utf8" });
      expect(cli.status, cli.stderr).toBe(0);
      expect(JSON.parse(cli.stdout)).toMatchObject({ filesRead: 1, invalidRows: 2, total: { turns: 1 } });
      expect(cli.stdout).not.toContain(dir);
      expect(cli.stdout).not.toMatch(/private-|private message|gpt-6/);
      expect(await readFile(ledger, "utf8")).toBe(content);
    } finally { await rm(dir, { recursive: true, force: true }); }
  });

  it("requires an explicit absolute data directory and rejects invalid dates without reading implicit live data", () => {
    for (const args of [[], ["--data-dir", "relative"], ["--data-dir", tmpdir(), "--from", "2026-02-31"], ["--data-dir", tmpdir(), "--data-dir", tmpdir()]]) {
      const cli = spawnSync(process.execPath, ["--experimental-strip-types", "scripts/solar-usage-audit.ts", ...args], { cwd: process.cwd(), encoding: "utf8" });
      expect(cli.status).toBe(1);
      expect(cli.stdout).toBe("");
      expect(cli.stderr).not.toContain(tmpdir());
    }
  });

  it("fails clearly for unreadable selected ledger files without leaking their paths", async () => {
    const dir = await mkdtemp(join(tmpdir(), "solar-usage-unreadable-"));
    try {
      await mkdir(join(dir, "usage", "2026-10.jsonl"), { recursive: true });
      const report = await readUsageDiagnostics(dir, { from: new Date("2026-10-01"), to: new Date("2026-10-31") });
      expect(report).toMatchObject({ filesRead: 0, unreadableFiles: 1, total: { turns: 0 } });
      await expect(readUsageDiagnostics(dir, { from: new Date("invalid"), to: new Date("2026-10-31") })).rejects.toThrow("Invalid audit range");
    } finally { await rm(dir, { recursive: true, force: true }); }
  });
});
