import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { t } from '@/lib/i18n';
import { api, type Bot } from '@/state/store';
import { useOwnerOrAdmin } from '@/lib/use-owner-or-admin';
import { AGENT_ARCHIVE_MAX_BYTES, parseAgentArchive, type AgentArchive } from '../../../shared/agent-archive';
import { SMALL_BUTTON, SMALL_PRIMARY, Warning } from './primitives';
import { orbitNavigate } from '../events';

interface Preview { botId: string; name: string; existing: boolean; expectedState: string; conversations: number; messages: number; memoryDocuments: number; exportedAt: number }

export function AgentTransferControls({ bot, onImported }: { bot: Bot; onImported: () => void }) {
  const allowed = useOwnerOrAdmin(), input = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<{ archive: AgentArchive; preview: Preview } | null>(null);
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState('');
  const [importedId, setImportedId] = useState<string | null>(null);
  const exportFile = async () => {
    setBusy(true); setError(''); setNotice('');
    try {
      const { archive } = await api<{ archive: AgentArchive }>(`/api/bots/${bot.id}/agent-archive`);
      const url = URL.createObjectURL(new Blob([JSON.stringify(archive, null, 2)], { type: 'application/json' }));
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${bot.name.replace(/[^\p{L}\p{N} ._-]/gu, '_') || 'Solar'}-${new Date().toISOString().slice(0, 10)}.solar-agent.json`;
      anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 60000);
      setNotice(t('solar.agentTransfer.exported'));
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); } finally { setBusy(false); }
  };
  const readFile = async (file?: File) => {
    if (!file) return;
    setBusy(true); setPending(null); setError(''); setNotice('');
    try {
      if (file.size > AGENT_ARCHIVE_MAX_BYTES) throw new Error(t('solar.agentTransfer.tooLarge'));
      const archive = parseAgentArchive(JSON.parse(await file.text()));
      const preview = await api<Preview>('/api/agent-archives/preview', { method: 'POST', body: JSON.stringify({ archive }) });
      setPending({ archive, preview });
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); } finally { setBusy(false); if (input.current) input.current.value = ''; }
  };
  const importFile = async () => {
    if (!pending) return;
    setBusy(true); setError('');
    try {
      const result = await api<{ name: string; botId: string }>('/api/agent-archives/import', { method: 'POST', body: JSON.stringify({ archive: pending.archive, expectedState: pending.preview.expectedState, contextBotId: bot.id }) });
      setPending(null); setImportedId(result.botId); setNotice(t('solar.agentTransfer.imported', { name: result.name })); onImported();
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); setPending(null); } finally { setBusy(false); }
  };
  // A system bot (Jarvis) neither exports nor imports into its own context.
  if (!allowed || bot.system) return null;
  return <section className="flex flex-col gap-2.5" aria-label={t('solar.agentTransfer.title')}>
    <h3 className="text-sm font-medium text-ink">{t('solar.agentTransfer.title')}</h3>
    <p className="text-xs leading-relaxed text-ink/70">{t('solar.agentTransfer.description')}</p>
    <div className="flex flex-wrap gap-2">
      <button type="button" className={`${SMALL_BUTTON} inline-flex items-center gap-1.5 !h-9`} disabled={busy || bot.busy} onClick={() => void exportFile()}><Download size={14} />{t('solar.agentTransfer.export')}</button>
      <button type="button" className={`${SMALL_BUTTON} inline-flex items-center gap-1.5 !h-9`} disabled={busy} onClick={() => input.current?.click()}><Upload size={14} />{t('solar.agentTransfer.import')}</button>
      <input ref={input} type="file" accept=".solar-agent.json,.json,application/json" className="hidden" aria-label={t('solar.agentTransfer.import')} onChange={event => void readFile(event.target.files?.[0])} />
    </div>
    {pending && <div className="flex flex-col gap-2 border-l-2 border-ink/20 pl-3">
      <strong className="text-sm">{pending.preview.name}</strong>
      <p className="text-xs text-ink/70">{t('solar.agentTransfer.date', { date: new Date(pending.preview.exportedAt).toLocaleString() })}</p>
      <p className="text-xs text-ink/70">{t('solar.agentTransfer.counts', { conversations: pending.preview.conversations, messages: pending.preview.messages, memory: pending.preview.memoryDocuments })}</p>
      <p className="text-xs leading-relaxed text-ink/70">{t(pending.preview.existing ? 'solar.agentTransfer.updateNotice' : 'solar.agentTransfer.newNotice')}</p>
      <div className="flex flex-wrap gap-2"><button type="button" className={`${SMALL_PRIMARY} !h-9`} disabled={busy} onClick={() => void importFile()}>{t(pending.preview.existing ? 'solar.agentTransfer.update' : 'solar.agentTransfer.confirm')}</button>
        <button type="button" className={`${SMALL_BUTTON} inline-flex items-center gap-1.5 !h-9`} disabled={busy} onClick={() => setPending(null)}>{t('solar.agentTransfer.cancel')}</button></div>
    </div>}
    {busy && <p role="status" className="text-xs text-ink/70">{t('solar.agentTransfer.working')}</p>}
    {error && <Warning>{error}</Warning>}
    {notice && <p role="status" className="text-xs text-ink/70">{notice}</p>}
    {importedId && <button type="button" className={`${SMALL_BUTTON} self-start`} onClick={() => orbitNavigate({ to: 'bot', id: importedId })}>{t('solar.agentTransfer.open')}</button>}
  </section>;
}
