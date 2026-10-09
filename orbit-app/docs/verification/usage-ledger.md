# Usage ledger

## Sub-features

- Append one row per settled turn to `<data>/usage/YYYY-MM.jsonl`: bot, model,
  engine, tokens, the cost with where it came from (`costSource: "reported"`
  from the engine, or `"estimated"` from list prices when the engine reports
  tokens but no price), and who asked.
- Book each turn to the sender of the message that started it, captured when
  the message was accepted. A message that queues behind someone else's turn,
  or is steered into it, or someone pressing Steer, does not re-book that
  turn; the queued message's own turn is booked to its sender. A guarded relay
  (the Slack worker) may name the person it acts for with `onBehalfOf`.
- Name the asker: the email a person signed in with, else their device label;
  this computer for loopback; the routine; or "bot to bot" for a peer hop.
- Read a period back grouped by bot, model, person, day or engine, and export
  one CSV line per turn. Owners only; a chat-only device gets 403.
- Keep message text out of the ledger.

## User path

Settings → Usage shows the live per-bot card and, below it, **History**: pick
a period, group it, or **Export CSV**.

## Driving it

```sh
pnpm exec vitest run --no-file-parallelism server/usage-ledger-api.test.ts server/usage-attribution.e2e.test.ts
```

The test launches a fresh `control-orbit` fixture with the repository's fake
engine, creates a bot, sends one turn as the owner through the control surface
and one as a paired device with a label, waits for both to settle, then checks
the month file has exactly two rows with the right triggers and no message
text, that `GET /api/usage` groups them by person and by bot with the fake
engine's `0.01` per turn, that `GET /api/usage.csv` returns three lines, and
that a client-scoped device is refused. It prints the fixture's server log
path as evidence and removes its temporary home.

`server/usage-attribution.e2e.test.ts` boots the server against the fake Claude, ACP
and Codex engines in a disposable home and reads the month file back: an ACP
turn on `grok-4.7` is booked at xAI's list price and marked estimated while an
unlisted model stays unpriced; a paired person's queued message, a live steer
and a queue Steer leave the owner's running turn booked to the owner, while
the queued message's own turn (1:1 and in a room) is the person's; and a
guarded send with `onBehalfOf` is booked to that person, one without it to
this machine, and a chat-only device cannot reach the route at all. It also
sends two turns to a Claude bot whose fake CLI restores the session's running
cost on `--resume` (`FAKE_CLAUDE_COST_STATE`), the way the real CLI does: the
second turn's result says 0.02, and both rows must still read 0.01.

For the same by hand:

```sh
node --experimental-strip-types scripts/control-orbit.ts launch
pnpm control:orbit new-bot --name Probe --url http://127.0.0.1:PORT
pnpm control:orbit send --bot BOT_ID --text "hello" --url http://127.0.0.1:PORT
pnpm control:orbit wait --bot BOT_ID --timeout 30 --url http://127.0.0.1:PORT
cat DATA_DIR/usage/$(date -u +%Y-%m).jsonl
```

Then open the printed preview, go to Settings → Usage → History, and confirm
the turn appears under **Bot** and under **Person** as "This computer".

## Unit regressions

The chat header's input/output breakdown has a separate real-renderer fixture:

```sh
ORBIT_UI_E2E=1 pnpm exec vitest run scripts/testing/usage-details-ui.e2e.test.ts
```

It launches a disposable app, sends one scripted-engine turn through the composer,
waits for settlement, and checks that the tooltip separates 10 uncached input,
2 cached input, and 5 output tokens. The synthetic $0.01 cost remains the compact
headline. Its JSON evidence sits next to the fixture log; no live account is used.

```sh
pnpm exec vitest run server/usage-ledger.test.ts src/components/UsageHistory.test.ts server/request-auth.test.ts
```

These cover month files and 0600 modes, torn lines, clamped tokens, a blocked
directory never failing the turn, range parsing, every grouping, spreadsheet
formula neutralisation in the CSV, the localized person labels, and the admin
scope on both routes.

## Gotchas

- Rows are appended when `turn.completed` folds, including failed and stopped
  turns. Recorded usage still counts; a turn without measured tokens or a
  reported cost stays unpriced, rather than appearing as a free model call.
- The settled conversation tally and reply digest use the same cost as the
  durable ledger. They preserve `costSource`, the estimated share and the
  number of unpriced turns. Older conversation totals remain incomplete when
  they did not store those costs; use History for the durable records.
- The verified GPT-6 Luna, GPT-6 Sol and GPT-6.1 Sol rates were added on
  2026-10-08. History can recover previously unpriced rows for these exact
  models when nonzero tokens were recorded, by passing
  `readUsage(dataDir, range, { estimateUnpriced: true })`. This only derives
  an estimate while reading. Month files and reported prices are untouched;
  zero-token and unknown-model rows remain unchanged. Recovered rows name
  the official source and its verification date.
- EUR CSV export appends `cost_eur`, optional `billable_eur`, `currency`,
  `usd_per_eur`, `exchange_date` and `exchange_source`, retaining the original
  USD columns. It uses the same dated ECB quote as the interface and keeps
  unavailable prices blank. Tiny nonzero prices retain precision.
- Unknown cache counts remain absent in summaries and blank in CSV instead
  of labelling all input as fresh. Reported cache shares cannot exceed input.
- Historical read-time price recovery is a display/export derivation. It does
  not retroactively rewrite or enforce the optional monthly spend cap against
  past unpriced activity. Future measured costs feed both the ledger and cap.
- The cost column is what the engine reported (real on a metered key, an
  equivalent on a subscription) or, for engines that report none, an estimate
  from `server/model-prices.ts`, marked `~` in History and People and labelled
  in the CSV's `cost_source` column. A model with no known price stays
  unpriced; the summary counts those turns separately instead of treating them
  as free.
- Claude's `total_cost_usd` is a running total, not a turn's figure: it grows
  across the turns of one CLI process and, on `--resume`, starts from a cost
  the CLI restored. The driver books each turn's growth. For a resumed
  process it finds the restored state among the session's recent results in
  `<data>/claude-cost-history.json`; without one, that first turn keeps its
  whole figure.
- Codex reports thread totals and the final model call separately. The
  driver subtracts the restored pre-turn baseline from the total, counting
  every model call in this turn once. Cached input is included in input and
  priced at the cache rate; reasoning output is already part of output.
  Native helper notifications cannot settle or overwrite the parent turn.
- Estimates are Standard short-context API equivalents, not subscription
  invoices. The stream does not identify every service tier, cache write or
  auxiliary tool fee, so Solar cannot infer an exact provider bill from
  token counts alone. Historical zero-cost helper rows without token data
  cannot retrospectively prove free usage and are not fabricated or rewritten.
- The History renderer also has an isolated browser fixture in
  `scripts/testing/solar-usage-ui.e2e.test.ts`: EUR costs, settlement refresh,
  failed-filter clearing, CSV currency and mobile layout, without provider calls.

## Verified OpenAI rates (2026-10-08)

USD per million input / cached input / output tokens:

- [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna):
  0.10 / 0.01 / 0.50.
- [GPT-6 Sol](https://developers.openai.com/api/docs/models/gpt-6-sol):
  2.00 / 0.20 / 10.00.
- [GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol):
  2.00 / 0.10 / 10.00.

These are exact model identifiers, with no sibling-model aliases. Long
context, Fast mode, regional processing and tool fees can change API charges;
see the [official pricing page](https://developers.openai.com/api/docs/pricing).

## 2026-10-08 accounting regression evidence

`server/usage-ledger-api.test.ts` now also uses the isolated fake Codex CLI.
It verifies a measured Luna turn (7 input, 4 cached, 3 output) has the same
estimated USD cost in the conversation, ledger and summary. The next fake
resume fails before model usage and remains unpriced instead of becoming a
zero-cost estimate. Both rows are durable and contain no message text.

`server/drivers/codex.test.ts` includes a multiple-call turn with restored
usage. Its settled total is 27 input, 14 cached and 8 output, rather than the
last call alone (7/4/3) or the restored thread's full lifetime usage.
