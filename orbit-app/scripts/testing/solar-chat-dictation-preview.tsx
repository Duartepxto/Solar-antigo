import { createRoot } from 'react-dom/client';
import { ChatView } from '../../src/components/ChatView';
import { SolarDictationSettings } from '../../src/components/SolarDictationSettings';
import { StoreProvider, useStore } from '../../src/state/store';
import '../../src/styles.css';

// Observe requests from this isolated renderer. Tests can prove that clicking
// Stop keeps a draft without silently creating a chat turn.
const fixtureRequests = (window as any).testDictationRequests = [] as Array<{ path: string; method: string }>;
const fixtureFetch = window.fetch.bind(window);
window.fetch = (input, init) => {
  const address = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  fixtureRequests.push({ path: new URL(address, window.location.href).pathname, method: init?.method ?? (input instanceof Request ? input.method : 'GET') });
  return fixtureFetch(input, init);
};

class FakeRecognition {
  lang = ''; continuous = false; interimResults = false;
  onresult: ((event: { results: Array<Array<{ transcript: string }>> }) => void) | null = null;
  onerror = null; onend: (() => void) | null = null; onstart: (() => void) | null = null;
  constructor() { (window as any).testRecognition = this; }
  start() { this.onstart?.(); }
  stop() { this.onend?.(); }
  abort() { this.onend?.(); }
}
(window as any).SpeechRecognition = FakeRecognition;
if (new URLSearchParams(window.location.search).has('native')) {
  const voice = (window as any).testSolarVoice = { transcript: null as any, end: null as any, options: null as any,
    starts: 0, finishes: 0, stops: 0, finishResolve: null as (() => void) | null };
  (window as any).ogb = {
    platform: 'darwin',
    speechStart: async (options: unknown) => { voice.options = options; voice.starts++; },
    speechFinish: () => { voice.finishes++; return new Promise<void>(resolve => { voice.finishResolve = resolve; }); },
    speechStop: async () => { voice.stops++; },
    onSpeechTranscript: (callback: unknown) => { voice.transcript = callback; return () => {}; },
    onSpeechEnd: (callback: unknown) => { voice.end = callback; return () => {}; },
  };
}
document.documentElement.classList.add('dark'); document.body.classList.add('jarvis-solar');
function Preview() {
  const { state } = useStore(); const bot = state.bots.find(item => item.name === 'Jarvis dictation fixture');
  const messages = Array.from({ length: 30 }, (_, index) => ({ id: `fixture-${index}`, role: 'assistant' as const, kind: 'text' as const,
    text: `Mensagem ${index + 1}. O Solar conserva o histórico da equipa e permite continuar o trabalho.`, at: index + 1, parentId: index ? `fixture-${index - 1}` : null }));
  return <main style={{ maxWidth: 540, height: '100vh', boxSizing: 'border-box', margin: 'auto', padding: 24, display: 'flex', flexDirection: 'column' }}>
    <h1 style={{ marginBottom: 24 }}>Solar · Jarvis</h1><details><summary>Voice settings fixture</summary><SolarDictationSettings /></details><div style={{ flex: 1, minHeight: 0 }}>{bot && <ChatView bot={{ ...bot, messages, activeLeafId: 'fixture-29' }} />}</div>
  </main>;
}
createRoot(document.getElementById('root')!).render(<StoreProvider><Preview /></StoreProvider>);
