import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BotEditorStore, initialState, type Bot, type TaskUsage, type Action } from '../../src/state/store';
import { UsageSection } from '../../src/components/UsageSection';
import { ThreadUsageChip } from '../../src/components/ThreadUsageChip';
import { useUsageCurrencyRefresh } from '../../src/lib/usage-currency';
import { setLocale } from '../../src/lib/i18n';
import '../../src/styles.css';

const fixture = (window as any).testSolarUsage = { turns: 3, requests: [] as string[], failHistory: false };
const usage = (): TaskUsage => ({ input: 1_000_000 * (fixture.turns - 1), output: 100_000 * (fixture.turns - 1), cachedInput: 800_000 * (fixture.turns - 1), turns: fixture.turns,
  costUsd: 1.1186 * (fixture.turns - 1), estimatedUsd: 1.1186 * (fixture.turns - 1), costSource: 'estimated', unpriced: 1,
  lastTurn: { input: 1_000_000, output: 100_000, cachedInput: 800_000, costUsd: 1.1186 } });
const group = (key: string, label: string) => ({ ...usage(), key, label, billableUsd: null });
window.fetch = async (input, init) => {
  const raw = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  const url = new URL(raw, location.href);
  fixture.requests.push(`${init?.method ?? 'GET'} ${url.pathname}${url.search}`);
  if (url.pathname === '/api/usage/currency') return Response.json({ currency: 'EUR', usdPerEur: 1.1186, source: 'ECB', date: '2026-10-08', cached: false, stale: false });
  if (url.pathname === '/api/usage') {
    if (fixture.failHistory) return Response.json({ error: 'Synthetic history unavailable' }, { status: 503 });
    const by = url.searchParams.get('groupBy') ?? 'bot';
    const label = by === 'model' ? 'gpt-6-luna' : by === 'engine' ? 'codex' : 'Garden agent history';
    return Response.json({ from: url.searchParams.get('from'), to: url.searchParams.get('to'), groupBy: by,
      groups: [group('garden', label)], total: group('total', 'total'), billing: null, budget: null });
  }
  if (url.pathname === '/api/usage.csv') return new Response('cost_usd,cost_eur\n1.1186,1\n', { headers: { 'content-type': 'text/csv' } });
  return Response.json({ error: `Unexpected isolated fixture request ${url.pathname}` }, { status: 404 });
};

function bot(): Bot {
  return { id: 'garden', threadId: 'garden-thread', name: 'Garden agent', title: 'Fixture agent', description: '', color: 'blue', notifications: false, unread: false,
    modelSelection: { instanceId: 'claude', model: 'claude-opus-4-8' }, messages: [],
    tasks: [{ threadId: 'garden-thread', title: 'Fixture conversation', createdAt: 0, modelSelection: { instanceId: 'codex', model: 'gpt-6-luna' }, usage: usage() }] };
}

function Fixture() {
  useUsageCurrencyRefresh();
  const [revision, setRevision] = useState(0);
  const agent = bot();
  const value = useMemo(() => ({ state: { ...initialState, bots: [agent] }, dispatch: (() => undefined) as React.Dispatch<Action>,
    flushBotPatches: async () => null, refreshInstances: async () => undefined, refreshModels: async () => undefined }), [revision]);
  return <BotEditorStore value={value}>
    <main className="mx-auto flex max-w-[660px] flex-col gap-5 p-5 text-ink" data-fixture="solar-usage">
      <header className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-xl font-semibold">Solar · Garden agent</h1><ThreadUsageChip bot={agent} /></header>
      <UsageSection />
      <nav aria-label="Isolated fixture controls" className="flex gap-3 text-xs"><button onClick={() => { fixture.turns++; setRevision(v => v + 1); }}>Settle synthetic turn</button><button onClick={() => { fixture.failHistory = true; }}>Fail next history read</button><button onClick={() => { fixture.failHistory = false; }}>Restore history reads</button></nav>
    </main>
  </BotEditorStore>;
}

setLocale('pt-PT');
document.documentElement.classList.add('dark');
document.body.classList.add('jarvis-solar');
const root = createRoot(document.getElementById('root')!);
root.render(<Fixture />);
if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
