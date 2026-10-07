import { createRoot } from 'react-dom/client';
import { SolarMap } from '../../src/orbit/SolarMap';
import type { OrbitBot, OrbitModel } from '../../src/orbit/model';

const bot = (id: string, name: string, color: string): OrbitBot => ({ id, name, color, teamKey: 'personal', chief: false,
  mood: 'idle', busy: false, waiting: false, unread: false, pinned: false, tool: null, approval: 'ask', lastMessageId: null, quietSince: null });
const model: OrbitModel = { bots: [bot('jarvis', 'Jarvis', '#ffc27a'), bot('momo', 'Momo', '#91afbf')], orbitAgent: null,
  teams: [{ key: 'personal', name: 'Personal', color: '#91afbf', chiefId: 'momo', coordinatorId: null, memberIds: ['momo'], loose: false }],
  channels: [], links: [], conversations: [], connected: true };
document.documentElement.classList.add('dark');
document.body.classList.add('jarvis-solar');
document.body.style.margin = '0';
createRoot(document.getElementById('root')!).render(<main style={{ position: 'relative', width: '100vw', height: '100vh', background: '#0e1013' }}>
  <SolarMap model={model} onBot={() => {}} onSettings={() => {}} onAdd={() => {}} />
</main>);
