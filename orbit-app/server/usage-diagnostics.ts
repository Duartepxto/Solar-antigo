// Read-only, aggregate diagnostics. No prompt, email, device label or native
// identifier leaves this module; bot labels exist only for this one report.
import { createReadStream } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { createInterface } from "node:readline";
import type { UsageRow } from "./usage-ledger.ts";

export interface UsageDiagnosticTotals {
  turns: number;
  input: number;
  output: number;
  cachedInputKnown: number;
  uncachedInputKnown: number;
  inputWithUnknownCache: number;
  cacheMeasuredTurns: number;
  cacheUnknownTurns: number;
  /** Share only among input with a reported cache measurement. */
  measuredCacheShare: number | null;
  zeroTokenTurns: number;
  zeroCostZeroTokenTurns: number;
  reportedCostUsd: number | null;
  estimatedCostUsd: number | null;
  unpricedTurns: number;
  promptMeasuredTurns: number;
  stablePromptBytes: number;
  volatilePromptBytes: number;
  maxAssembledPromptBytes: number | null;
}

export interface UsageDiagnostics {
  total: UsageDiagnosticTotals;
  byTrigger: Array<{ trigger: "owner" | "user" | "bot" | "routine" | "other"; total: UsageDiagnosticTotals }>;
  byBot: Array<{ bot: string; total: UsageDiagnosticTotals }>;
  uniqueBots: number;
  uniqueThreads: number;
  /** Extra records sharing a settlement key; totals retain them for audit. */
  duplicateSettlementKeys: number;
  inputTokensPerTurn: { median: number | null; p95: number | null; max: number | null };
}

const count = (value: unknown): number => typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0;
const measured = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0;

function empty(): UsageDiagnosticTotals {
  return {
    turns: 0, input: 0, output: 0, cachedInputKnown: 0, uncachedInputKnown: 0,
    inputWithUnknownCache: 0, cacheMeasuredTurns: 0, cacheUnknownTurns: 0,
    measuredCacheShare: null, zeroTokenTurns: 0, zeroCostZeroTokenTurns: 0,
    reportedCostUsd: null, estimatedCostUsd: null, unpricedTurns: 0,
    promptMeasuredTurns: 0, stablePromptBytes: 0, volatilePromptBytes: 0,
    maxAssembledPromptBytes: null,
  };
}

function add(total: UsageDiagnosticTotals, row: UsageRow): void {
  const input = count(row.input);
  const output = count(row.output);
  total.turns++;
  total.input += input;
  total.output += output;
  if (measured(row.cachedInput)) {
    const cached = Math.min(input, count(row.cachedInput));
    total.cachedInputKnown += cached;
    total.uncachedInputKnown += input - cached;
    total.cacheMeasuredTurns++;
  } else {
    total.inputWithUnknownCache += input;
    total.cacheUnknownTurns++;
  }
  const measuredInput = total.cachedInputKnown + total.uncachedInputKnown;
  total.measuredCacheShare = measuredInput > 0 ? total.cachedInputKnown / measuredInput : null;
  if (input + output === 0) {
    total.zeroTokenTurns++;
    if (row.costUsd === 0) total.zeroCostZeroTokenTurns++;
  }
  if (measured(row.costUsd)) {
    const key = row.costSource === "estimated" ? "estimatedCostUsd" : "reportedCostUsd";
    total[key] = (total[key] ?? 0) + row.costUsd;
  } else total.unpricedTurns++;
  if (row.promptBytes && measured(row.promptBytes.stable) && measured(row.promptBytes.volatile)) {
    const stable = count(row.promptBytes.stable);
    const volatile = count(row.promptBytes.volatile);
    total.promptMeasuredTurns++;
    total.stablePromptBytes += stable;
    total.volatilePromptBytes += volatile;
    total.maxAssembledPromptBytes = Math.max(total.maxAssembledPromptBytes ?? 0, stable + volatile);
  }
}

/** Descriptive evidence only: input counts cannot prove a context replay,
 * and assembled prompt bytes are not transmitted bytes or tokenizer counts. */
export function diagnoseUsage(rows: readonly UsageRow[]): UsageDiagnostics {
  const total = empty();
  const bots = new Map<string, UsageDiagnosticTotals>();
  const triggers = new Map<UsageDiagnostics["byTrigger"][number]["trigger"], UsageDiagnosticTotals>();
  const threads = new Set<string>();
  const settlements = new Set<string>();
  const inputs: number[] = [];
  let duplicateSettlementKeys = 0;
  for (const row of rows) {
    add(total, row);
    const botTotal = bots.get(row.botId) ?? empty();
    add(botTotal, row);
    bots.set(row.botId, botTotal);
    const kind = row.trigger.kind;
    const trigger = kind === "owner" || kind === "user" || kind === "bot" || kind === "routine" ? kind : "other";
    const triggerTotal = triggers.get(trigger) ?? empty();
    add(triggerTotal, row);
    triggers.set(trigger, triggerTotal);
    threads.add(JSON.stringify([row.botId, row.threadId]));
    const key = JSON.stringify([row.at, row.botId, row.threadId]);
    if (settlements.has(key)) duplicateSettlementKeys++;
    settlements.add(key);
    inputs.push(count(row.input));
  }
  inputs.sort((a, b) => a - b);
  const percentile = (p: number) => inputs.length ? inputs[Math.max(0, Math.ceil(inputs.length * p) - 1)] : null;
  return {
    total,
    byTrigger: [...triggers].map(([trigger, total]) => ({ trigger, total })),
    byBot: [...bots.values()].map((total, index) => ({ bot: `bot-${index + 1}`, total })),
    uniqueBots: bots.size, uniqueThreads: threads.size, duplicateSettlementKeys,
    inputTokensPerTurn: { median: percentile(0.5), p95: percentile(0.95), max: inputs.at(-1) ?? null },
  };
}

function validRow(value: unknown): value is UsageRow {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const row = value as Partial<UsageRow>;
  return typeof row.at === "string" && Number.isFinite(Date.parse(row.at)) &&
    typeof row.botId === "string" && typeof row.threadId === "string" &&
    measured(row.input) && measured(row.output) &&
    !!row.trigger && typeof row.trigger.kind === "string";
}

/** Only month ledgers in the explicit directory and range are read. Invalid
 * or torn lines are counted without printing their content. Never recovers
 * prices, writes history or contacts a provider. */
export async function readUsageDiagnostics(dataDir: string, range: { from: Date; to: Date }): Promise<UsageDiagnostics & {
  filesRead: number; unreadableFiles: number; invalidRows: number; outsideRangeRows: number;
}> {
  const from = range.from.getTime();
  const to = range.to.getTime();
  if (!Number.isFinite(from) || !Number.isFinite(to) || from > to || to - from > 366 * 86_400_000) throw new Error("Invalid audit range.");
  const directory = join(dataDir, "usage");
  let files: string[];
  try { files = await readdir(directory); }
  catch { throw new Error("Cannot read the selected usage directory."); }
  const firstMonth = range.from.toISOString().slice(0, 7);
  const lastMonth = range.to.toISOString().slice(0, 7);
  const rows: UsageRow[] = [];
  let filesRead = 0;
  let unreadableFiles = 0;
  let invalidRows = 0;
  let outsideRangeRows = 0;
  for (const file of files.sort()) {
    if (!/^\d{4}-(?:0[1-9]|1[0-2])\.jsonl$/.test(file) || file.slice(0, 7) < firstMonth || file.slice(0, 7) > lastMonth) continue;
    const stream = createReadStream(join(directory, file), { encoding: "utf8" });
    const lines = createInterface({ input: stream, crlfDelay: Infinity });
    // readline does not forward an input-stream error to its async iterator.
    stream.on("error", () => lines.close());
    try {
      for await (const line of lines) {
        if (!line.trim()) continue;
        let value: unknown;
        try { value = JSON.parse(line); } catch { invalidRows++; continue; }
        if (!validRow(value)) { invalidRows++; continue; }
        const at = Date.parse(value.at);
        if (at < from || at > to) { outsideRangeRows++; continue; }
        rows.push(value);
      }
      if (stream.errored) unreadableFiles++;
      else filesRead++;
    } catch { unreadableFiles++; }
    finally { lines.close(); stream.destroy(); }
  }
  return { ...diagnoseUsage(rows), filesRead, unreadableFiles, invalidRows, outsideRangeRows };
}
