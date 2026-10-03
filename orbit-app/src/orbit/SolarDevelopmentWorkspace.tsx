import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Code2, Eye, File, FilePlus2, Folder, Monitor, RefreshCw, Save, X } from 'lucide-react';
import { api, type Bot } from '@/state/store';
import { t } from '@/lib/i18n';
import { ChatMarkdown } from '@/components/ChatMarkdown';
import { ComputerPanel } from '@/components/ComputerPanel';
import { SolarIdentity } from './SolarIdentity';
import { OrbitSheet } from './OrbitSheet';
import { useOrbitStage } from './stage';
import './solar-development.css';

type Entry = { name: string; path: string; directory: boolean };
type Document = { path: string; content: string; revision: string | null; draft: string };
type Listing = { root: string; path: string; entries: Entry[] };

export function SolarDevelopmentWorkspace({ bot, onClose }: { bot: Bot; onClose: () => void }) {
  const stage = useOrbitStage(onClose);
  const [directory, setDirectory] = useState('');
  const [listing, setListing] = useState<Listing | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selected, setSelected] = useState('');
  const [mode, setMode] = useState<'code' | 'preview'>('code');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [newName, setNewName] = useState<string | null>(null);
  const [surface, setSurface] = useState<'files' | 'computer'>('files');
  const request = useRef(0);
  const active = documents.find(d => d.path === selected);
  const base = `/api/bots/${bot.id}/solar-workspace?threadId=${encodeURIComponent(bot.threadId)}`;
  const storageKey = `solar:workspace:${bot.id}:${bot.threadId}`;
  const drafts = useRef<Record<string, Document>>({});
  useEffect(() => {
    try { drafts.current = JSON.parse(sessionStorage.getItem(storageKey) ?? '{}'); } catch { drafts.current = {}; }
    const retained = Object.values(drafts.current);
    setDocuments(retained); setSelected(retained[0]?.path ?? '');
    return () => { request.current++; };
  }, [storageKey]);
  const remember = (document: Document) => {
    if (document.draft === document.content && document.revision !== null) delete drafts.current[document.path];
    else drafts.current[document.path] = document;
    try { sessionStorage.setItem(storageKey, JSON.stringify(drafts.current)); } catch { /* Open editor still retains its draft. */ }
  };
  const refresh = async () => {
    try { setListing(await api<Listing>(`${base}&directory=${encodeURIComponent(directory)}`)); setError(''); }
    catch (e) { setError(e instanceof Error ? e.message : String(e)); }
  };
  useEffect(() => {
    const controller = new AbortController();
    setListing(null);
    void api<Listing>(`${base}&directory=${encodeURIComponent(directory)}`, { signal: controller.signal })
      .then(setListing).catch(e => { if (!controller.signal.aborted) setError(e.message); });
    return () => controller.abort();
  }, [base, directory]);
  const open = async (path: string) => {
    setMode('code'); setError('');
    if (documents.some(d => d.path === path)) { setSelected(path); return; }
    const id = ++request.current;
    setBusy(true);
    try {
      const file = await api<Omit<Document, 'draft'>>(`${base}&file=${encodeURIComponent(path)}`);
      if (id !== request.current) return;
      setDocuments(current => [...current, { ...file, draft: file.content }]); setSelected(path);
    } catch (e) { if (id === request.current) setError(e instanceof Error ? e.message : String(e)); }
    finally { if (id === request.current) setBusy(false); }
  };
  const edit = (draft: string) => {
    if (!active) return;
    const next = { ...active, draft }; remember(next);
    setDocuments(current => current.map(d => d.path === next.path ? next : d));
  };
  const save = async () => {
    if (!active || busy) return;
    const snapshot = active;
    setBusy(true); setError('');
    try {
      const file = await api<Omit<Document, 'draft'>>(`${base}&file=${encodeURIComponent(snapshot.path)}`, {
        method: 'PUT', body: JSON.stringify({ content: snapshot.draft, revision: snapshot.revision }),
      });
      const next = { ...file, draft: snapshot.draft }; remember(next);
      setDocuments(current => current.map(d => d.path === next.path ? next : d));
      await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(false); }
  };
  const reloadFile = async () => {
    if (!active || busy) return;
    if (active.draft !== active.content && !window.confirm(t('jarvis.dev.discard'))) return;
    setBusy(true); setError('');
    try {
      const file = await api<Omit<Document, 'draft'>>(`${base}&file=${encodeURIComponent(active.path)}`);
      const next = { ...file, draft: file.content }; remember(next);
      setDocuments(current => current.map(d => d.path === next.path ? next : d));
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(false); }
  };
  const create = () => {
    const path = directory ? `${directory}/${newName?.trim()}` : newName?.trim();
    if (!path || documents.some(d => d.path === path) || listing?.entries.some(e => e.path === path)) { setError(t('jarvis.dev.exists')); return; }
    const next: Document = { path, content: '', draft: path.endsWith('.md') ? '# ' + path.split('/').at(-1)?.replace(/\.md$/, '') + '\n\n' : '', revision: null };
    remember(next); setDocuments(current => [...current, next]); setSelected(path); setNewName(null); setMode('code'); setError('');
  };
  const previewable = active && /\.(html|md|svg)$/i.test(active.path);
  const html = active ? `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:;"><style>body{font-family:system-ui;margin:24px;color:#222}svg{max-width:100%}</style>${active.draft}` : '';
  // Mount the sheet only after OrbitShell's stage exists; otherwise its first
  // layout pass would capture the fallback dialog instead of the canvas slot.
  if (stage.onStage && !stage.slot) return null;
  return <OrbitSheet title={t('jarvis.dev.title')} context={`${bot.name} · ${listing?.root ?? t('jarvis.dev.local')}`} onClose={onClose} labelId="solar-development-title"
    leading={<SolarIdentity id={bot.id} size={64} label={bot.name} />} actions={<><div className="solar-dev-modes"><button aria-pressed={surface === 'files'} onClick={() => setSurface('files')}><Code2 size={14} />{t('jarvis.dev.files')}</button><button aria-pressed={surface === 'computer'} onClick={() => setSurface('computer')}><Monitor size={14} />{t('orbit.sys.computer')}</button></div><button className="solar-dev-icon" onClick={onClose} aria-label={t('common.close')}><X size={17} /></button></>}>
    {surface === 'computer' ? <div className="flex min-h-0 flex-1 flex-col"><ComputerPanel bot={bot} inColumn /></div> : <div className="solar-development">
      <aside className="solar-dev-files" aria-label={t('jarvis.dev.files')}>
        <div className="solar-dev-filebar"><span>{t('jarvis.dev.files')}</span><button className="solar-dev-icon" onClick={() => void refresh()} aria-label={t('jarvis.dev.refresh')}><RefreshCw size={14} /></button><button className="solar-dev-icon" onClick={() => setNewName('page.md')} aria-label={t('jarvis.dev.new')}><FilePlus2 size={15} /></button></div>
        {directory && <button className="solar-dev-entry" onClick={() => setDirectory(directory.split('/').slice(0,-1).join('/'))}><ArrowLeft size={13} /><span>{directory}</span></button>}
        {newName !== null && <form className="solar-dev-new" onSubmit={e => { e.preventDefault(); create(); }}><input autoFocus value={newName} onChange={e => setNewName(e.target.value)} aria-label={t('jarvis.dev.filename')} /><button type="submit"><FilePlus2 size={15} /></button><button type="button" onClick={() => setNewName(null)} aria-label={t('common.close')}><X size={13} /></button></form>}
        <div className="solar-dev-tree">{listing?.entries.map(entry => <button key={entry.path} className="solar-dev-entry" aria-current={selected === entry.path ? 'page' : undefined} onClick={() => entry.directory ? setDirectory(entry.path) : void open(entry.path)}>{entry.directory ? <Folder size={14} /> : <File size={14} />}<span>{entry.name}</span></button>)}</div>
        <p className="solar-dev-hint">{t('jarvis.dev.scope')}</p>
      </aside>
      <section className="solar-dev-editor" aria-label={t('jarvis.dev.editor')}>
        <div className="solar-dev-tabs">{documents.map(document => <button key={document.path} onClick={() => { setSelected(document.path); setMode('code'); }} aria-pressed={selected === document.path}>{document.path.split('/').at(-1)}{document.draft !== document.content || document.revision === null ? <i aria-label={t('jarvis.dev.unsaved')} /> : null}</button>)}</div>
        {active ? <>
          <div className="solar-dev-toolbar"><span title={active.path}>{active.path}</span><div className="solar-dev-modes"><button onClick={() => setMode('code')} aria-pressed={mode === 'code'}><Code2 size={14} />{t('jarvis.dev.code')}</button>{previewable && <button onClick={() => setMode('preview')} aria-pressed={mode === 'preview'}><Eye size={14} />{t('jarvis.dev.preview')}</button>}</div><button className="solar-dev-icon" disabled={busy || active.revision === null} onClick={() => void reloadFile()} aria-label={t('jarvis.dev.reload')} title={t('jarvis.dev.reload')}><RefreshCw size={13} /></button><button className="solar-dev-save" onClick={() => void save()} disabled={busy || (active.draft === active.content && active.revision !== null)}><Save size={14} />{t('jarvis.dev.save')}</button></div>
          {mode === 'preview' && previewable ? active.path.endsWith('.md') ? <div className="solar-dev-markdown"><ChatMarkdown text={active.draft} /></div> : <iframe title={t('jarvis.dev.preview')} sandbox="" srcDoc={html} className="solar-dev-preview" /> : <textarea className="solar-dev-source" spellCheck={false} aria-label={`${t('jarvis.dev.code')} · ${active.path}`} value={active.draft} disabled={busy} onChange={e => edit(e.target.value)} onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); void save(); } }} />}
          <footer className="solar-dev-status"><span>{active.draft.split('\n').length} {t('jarvis.dev.lines')} · UTF-8</span><span>{active.draft !== active.content || active.revision === null ? t('jarvis.dev.draft') : t('jarvis.dev.saved')}</span>{mode === 'preview' && !active.path.endsWith('.md') && <span>{t('jarvis.dev.static')}</span>}</footer>
        </> : <div className="solar-dev-empty"><Code2 size={30} strokeWidth={1} /><h2>{t('jarvis.dev.start')}</h2><p>{t('jarvis.dev.intro')}</p><button onClick={() => setNewName('page.md')}><FilePlus2 size={15} />{t('jarvis.dev.new')}</button></div>}
        {error && <div className="solar-dev-error" role="alert">{error}</div>}
      </section>
    </div>}
  </OrbitSheet>;
}
