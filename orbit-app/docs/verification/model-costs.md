# Model costs in euros

Settings → Usage now includes a request calculator and a comparison of every
model in the current engine catalogs. Opening it calls `GET /api/usage/models`,
not a model. Changing the token counts calculates locally and spends no AI tokens.

The authenticated route returns EUR unit prices, source URLs, price dates and the
dated ECB exchange quote. Underlying provider accounting remains USD so recorded
costs are not relabelled or rewritten. Divide provider USD by `usdPerEur`.

Total input includes three disjoint parts: fresh input, cache reads and cache
writes. Output includes billed reasoning tokens. The estimate adds each part
once. Known long-context thresholds change the rates for the whole request.
Known context windows exclude requests that the model cannot accommodate.

OpenRouter unit prices come from its catalog's per-token prompt, completion,
cache-read and cache-write fields. Grok prices come from xAI's cents per 100M
tokens, converted to USD per million; its reported request cost uses ticks,
with 10 billion ticks per USD. Mistral aliases inherit a known price only when
its live catalog explicitly associates them with the priced concrete model.
Other compatible endpoints do not automatically inherit OpenRouter currency
or pricing semantics. A local `provider::model` never inherits an official
cloud rate merely because its slug looks familiar.

When the engine reports tokens without a cost, booking prefers an exact
operator override, then a discovered vendor rate, then the dated list rate.
The operator's fallback applies only after those. Reported cost still wins.
Legacy EUR operator prices are normalized with the verified exchange quote
before booking in the USD ledger. Discovered-price estimates retain their
source and date. Unknown prices remain unknown.

## Isolated verification

```powershell
node --experimental-strip-types scripts/control-orbit.ts launch
# In another terminal, use only the fixture URL printed above:
Invoke-RestMethod 'http://127.0.0.1:PORT/api/usage/models'
```

The route must return `currency: EUR`, a dated `quote`, and one row per catalog
option. An unavailable connection may still have reference rates for planning;
this is not evidence that the account can run that model.

The production calculator was mounted against this isolated API and inspected
in a browser at desktop width and 390 px. A scenario of 100,000 input, 10,000
output, 60,000 cache-read and 20,000 cache-write tokens with Claude Sonnet 5
produced an API-equivalent estimate of approximately €0.18 using the ECB quote
of 2026-10-09 (1 EUR = 1.1206 USD). Model comparison sorted the same scenario by
estimated cost and retained rows with unknown prices. This is a simulation,
not a charge or a comparison of model quality or tokenizer efficiency.

Calculator evidence:
[desktop screenshot](../../../docs/verification-evidence/solar-model-costs-2026-10-10.png).

Core checks:

```powershell
node node_modules/vitest/vitest.mjs run --configLoader native shared/model-cost.test.ts server/model-cost-catalog.test.ts server/model-prices.test.ts server/usage-currency.test.ts server/drivers/grok.test.ts server/drivers/openai-compat.test.ts server/drivers/mistral.test.ts
node node_modules/typescript/bin/tsc -b
node node_modules/typescript/bin/tsc -p tsconfig.server.json --noEmit
node scripts/generate-locale.mjs --check
```

## Limits

These are Standard API equivalents. An included subscription allowance is not
an additional per-token invoice. Tax, tools, regional and priority premiums,
cache storage, alternate cache lifetimes and private contracted rates need
their own measurements. Missing cache rates prevent that scenario's estimate;
they are not substituted with zero. Provider prices and access can change.
Grok retains its last usable catalog on refresh failure; seeded rows are a
fallback, not an account-access test. No real provider prompts were used for
this verification.
