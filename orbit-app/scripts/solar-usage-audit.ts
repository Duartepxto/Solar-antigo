import { isAbsolute } from "node:path";
import { parseUsageRange } from "../server/usage-ledger.ts";
import { readUsageDiagnostics } from "../server/usage-diagnostics.ts";

const help = "Usage: node --experimental-strip-types scripts/solar-usage-audit.ts --data-dir <absolute workspace data directory> [--from YYYY-MM-DD] [--to YYYY-MM-DD]\nRead-only aggregate report. Dates use UTC; default is the current UTC month to date. No model calls or private identifiers are printed.";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--help") { console.log(help); return; }
  const options = new Map<string, string>();
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    const value = args[i + 1];
    if (!["--data-dir", "--from", "--to"].includes(key) || !value || value.startsWith("--") || options.has(key)) throw new Error(help);
    options.set(key, value);
  }
  const dataDir = options.get("--data-dir");
  if (!dataDir || !isAbsolute(dataDir)) throw new Error(help);
  const range = parseUsageRange(options.get("--from"), options.get("--to"));
  if (!range) throw new Error("Invalid dates: use a valid, ordered UTC date range of at most 366 days.");
  const report = await readUsageDiagnostics(dataDir, range);
  console.log(JSON.stringify({
    range: { from: range.from.toISOString(), to: range.to.toISOString() },
    ...report,
    limitations: [
      "Input includes reported cached input. Unknown cache stays unknown; cache share covers only measured input.",
      "Prompt bytes describe the system prompt assembled by Solar, not bytes transmitted or tokens billed.",
      "Zero-token zero-cost rows do not establish a free provider call or complete usage coverage.",
      "Duplicate settlement keys are diagnostic; this report retains all rows and does not rewrite history.",
      "Token totals alone cannot prove repeated context. Helpers and unreported provider usage may be absent.",
      "Bot labels are anonymous within this report and are not durable identities.",
    ],
  }, null, 2));
  if (report.unreadableFiles) process.exitCode = 2;
}

main().catch((error: unknown) => {
  // Our own errors are generic; never print filesystem errors with paths.
  const known = error instanceof Error && (error.message === help || error.message.startsWith("Invalid dates:") || error.message === "Cannot read the selected usage directory.");
  console.error(known ? error.message : "Usage audit failed. No ledger data was changed.");
  process.exitCode = 1;
});
