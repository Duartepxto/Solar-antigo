import { createRoot } from 'react-dom/client';
import { AgentTransferControls } from '../../src/orbit/detail/AgentTransferControls';
import { api, type Bot } from '../../src/state/store';
import { setLocale } from '../../src/lib/i18n';
import '../../src/styles.css';
import '../../src/orbit/solar.css';

setLocale('pt');
document.documentElement.classList.add('dark'); document.body.classList.add('jarvis-solar');
const { bots } = await api<{ bots: Bot[] }>('/api/bots');
const bot = bots.find(bot => bot.name === 'Planet UI')!;
createRoot(document.getElementById('root')!).render(<main style={{ maxWidth: 620, padding: 24, margin: '0 auto', background: '#0e1013', minHeight: '100vh' }}>
  <h1 style={{ fontSize: 24, marginBottom: 24 }}>Memória · {bot.name}</h1>
  <AgentTransferControls bot={bot} onImported={() => {}} />
</main>);
