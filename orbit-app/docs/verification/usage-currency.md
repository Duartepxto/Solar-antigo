# Usage currency

Provider cost and the durable ledger keep their original USD amounts. Solar's
EUR display divides those values by the European Central Bank's quoted USD for
one euro. Missing cost or an unavailable quote remains unknown, never zero.

The server reads the [official daily ECB XML](https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml)
with a five-second timeout and a 64 KiB body limit. It validates the calendar
date, rejects future reference days, requires a positive finite USD rate, and
does not replace a newer saved reference day with an older response. Fetches
are coalesced per data directory and cached for an hour; failed refreshes retry
after five minutes. The last valid quote is saved in
`<data>/usage/currency-ecb.json` and survives offline restarts.

The bundled offline quote was read directly from that ECB XML on 2026-10-08:

```xml
<Cube time='2026-10-08'>
  <Cube currency='USD' rate='1.1186'/>
```

This is a dated starting value rather than a permanent exchange-rate setting.
Cached responses include their reference date, source, and `cached` status.
`stale` is true when the reference date precedes the current UTC day or a
refresh failed; on weekends an older reference day is expected. If there is
no valid saved or bundled quote, the service returns `null`. Converted totals
use the displayed reference rate, not reconstructed historical transaction
exchange rates or a bank's settlement rate.

## Verification

```sh
pnpm exec vitest run server/usage-currency.test.ts
```

The tests use mocked HTTP and disposable data directories. They cover the
conversion direction, zero versus missing cost, invalid and future rates,
invalid calendar days, duplicate currency tags, unsafe XML entities, body
limits, concurrency, cache isolation, saved/offline/seed fallback, monotonic
reference dates, a later refresh, and a transport that never resolves. No live
Solar ledger is changed and no provider API turn is made.
