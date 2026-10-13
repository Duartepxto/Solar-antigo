# Read-only usage audit and generated-title accounting

From the app repository, run the aggregate audit against an **explicit**
absolute workspace data directory (the directory containing `usage/`):

```powershell
node --experimental-strip-types scripts/solar-usage-audit.ts --data-dir 'C:\selected\workspace' --from 2026-10-01 --to 2026-10-10
```

Dates are inclusive UTC days, limited to 366 days. Omitting the dates selects
the current UTC month to now. The CLI never discovers a live app, writes
ledger rows, recovers prices, calls a model or prints emails, labels, prompts,
bot/thread/native IDs. Bot labels are anonymous within one report only.

The report separates measured cached/uncached input from input whose cache
status is unknown. Its cache share uses only input with known cache. It counts
zero-token/zero-cost rows, missing prices, duplicate settlement keys, malformed
lines, unreadable files and prompt measurement coverage. Input includes cache;
assembled system-prompt bytes do not measure bytes actually delivered. Unknown
usage cannot establish a free call. All duplicate rows remain in the totals
until an operator investigates them. An unreadable selected file produces an
incomplete report and exit code 2; an invalid invocation or inaccessible usage
directory produces a generic error and exit code 1 without private paths.

Verification:

```sh
pnpm exec vitest run --no-file-parallelism server/usage-diagnostics.test.ts server/thread-title-usage.e2e.test.ts
pnpm exec vitest run server/index.test.ts -t 'snippet title|generated one|generated title|channel task.*snippet'
```

The diagnostic tests build disposable JSONL ledgers, run the actual CLI,
verify aggregation and privacy, compare the original ledger bytes afterwards,
and check invalid dates, relative/missing directories and unreadable files.

The title fixture launches the shared fake-provider server in an isolated
temporary workspace with a synthetic `budgets` enterprise entitlement. It
enables the opt-in title feature, sends a turn as a paired fixture person,
and verifies the real helper's model, 15 input / 2 cached / 5 output tokens
and $0.01 reported cost in the durable ledger. Title plus normal turn exceed
a $0.015 cap and the next send is refused. A group title books to its responding
bot and preserves the requester. A title helper lacking usage remains unpriced.
The existing title flows verify successful replacement and failure fallback.

Generated titles now check the budget immediately before calling the provider
and pass its usage callback. Title usage has a separate ledger-only thread key;
spend notifications navigate to the real conversation. Already admitted calls
can settle above the cap; the system does not reserve an unknown future price.
Without the budget entitlement this gate is inert, as for other turns.

Each title fixture prints its persistent server log path and closes only its
owned child/home. No real provider account or live Solar mutations are used.
These checks establish accounting and orchestration, not live provider savings
or invoice accuracy. The title feature is off by default, and the historical
zero-token rows alone cannot identify their originating failure mode.
