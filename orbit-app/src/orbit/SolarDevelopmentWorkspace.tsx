import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Code2, Columns2, ExternalLink, Eye, File, FilePlus2, Folder, Globe, Monitor, RefreshCw, Save, X } from 'lucide-react';
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
type Listing = { root: string; path: string; entries: Entry[]; truncated?: boolean; preview?: string };
type Mode = 'code' | 'split' | 'preview';

const PAGE = /\.(html?|svg)$/i;
/** While the agent works its files are re-read this often, so the editor and the page follow along. */
const SYNC_MS = 2500;
const localAddress = (value: string) => { try { const u = new URL(value); return /^https?:$/.test(u.protocol) && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(u.hostname); } catch { return false; } };

export function SolarDevelopmentWorkspace({ bot, onClose }: { bot: Bot; onClose: () => void }) {
  const stage = useOrbitStage(onClose);
  const [directory, setDirectory] = useState('');
  const [listing, setListing] = useState<Listing | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selected, setSelected] = useState('');
  const [mode, setMode] = useState<Mode>('code');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [newName, setNewName] = useState<string | null>(null);
  const [surface, setSurface] = useState<'files' | 'computer'>('files');
  // a dev server the agent started (localhost only), shown instead of the file
  const [address, setAddress] = useState(''), [addressDraft, setAddressDraft] = useState<string | null>(null);
  const [reloads, setReloads] = useState(0);
  const [synced, setSynced] = useState(false);
  const request = useRef(0);
  const active = documents.find(d => d.path === selected);
  const base = `/api/bots/${bot.id}/solar-workspace?threadId=${encodeURIComponent(bot.threadId)}`;
  const storageKey = `solar:workspace:${bot.id}:${bot.threadId}`;
  const drafts = useRef<Record<string, Document>>({});
  const documentsRef = useRef(documents); documentsRef.current = documents;
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
  const refresh = useCallback(async () => {
    try { setListing(await api<Listing>(`${base}&directory=${encodeURIComponent(directory)}`)); setError(''); }
    catch (e) { setError(e instanceof Error ? e.message : String(e)); }
  }, [base, directory]);
  useEffect(() => {
    const controller = new AbortController();
    setListing(null);
    void api<Listing>(`${base}&directory=${encodeURIComponent(directory)}`, { signal: controller.signal })
      .then(next => { setListing(next); setError(''); }).catch(e => { if (!controller.signal.aborted) setError(e.message); });
    return () => controller.abort();
  }, [base, directory]);

  /** Re-read the tree and every open file the person has not edited, so the agent's changes appear. */
  const sync = useCallback(async () => {
    await refresh();
    let changed = false;
    for (const document of documentsRef.current) {
      if (document.revision === null || document.draft !== document.content) continue;
      try {
        const file = await api<Omit<Document, 'draft'>>(`${base}&file=${encodeURIComponent(document.path)}`);
        if (file.revision === document.revision) continue;
        changed = true;
        setDocuments(current => current.map(d => d.path === file.path && d.draft === d.content ? { ...file, draft: file.content } : d));
      } catch { /* a file the agent removed keeps its last copy in the editor */ }
    }
    if (changed) { setReloads(n => n + 1); setSynced(true); }
  }, [base, refresh]);
  const wasBusy = useRef(bot.busy);
  useEffect(() => {
    const was = wasBusy.current; wasBusy.current = bot.busy;
    if (surface !== 'files') return;
    if (bot.busy) { const timer = setInterval(() => void sync(), SYNC_MS); return () => clearInterval(timer); }
    if (was) void sync();
  }, [bot.busy, surface, sync]);
  useEffect(() => { if (!synced) return; const timer = setTimeout(() => setSynced(false), 2400); return () => clearTimeout(timer); }, [synced]);

  const open = async (path: string) => {
    setError('');
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
      setReloads(n => n + 1);
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
      setReloads(n => n + 1);
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(false); }
  };
  const create = () => {
    const name = newName?.trim();
    if (!name || name.endsWith('/')) { setError(t('jarvis.dev.filename')); return; }
    const path = directory ? `${directory}/${name}` : name;
    if (documents.some(d => d.path === path) || listing?.entries.some(e => e.path === path)) { setError(t('jarvis.dev.exists')); return; }
    const next: Document = { path, content: '', draft: path.endsWith('.md') ? '# ' + path.split('/').at(-1)?.replace(/\.md$/, '') + '\n\n' : '', revision: null };
    remember(next); setDocuments(current => [...current, next]); setSelected(path); setNewName(null); setMode('code'); setError('');
  };
  const closeDocument = (path: string) => {
    const document = documents.find(d => d.path === path);
    if (document && (document.draft !== document.content || document.revision === null) && !window.confirm(t('jarvis.dev.discard'))) return;
    delete drafts.current[path];
    try { sessionStorage.setItem(storageKey, JSON.stringify(drafts.current)); } catch { /* best effort */ }
    const rest = documents.filter(d => d.path !== path);
    setDocuments(rest);
    if (selected === path) setSelected(rest.at(-1)?.path ?? '');
  };
  // Tab indents instead of leaving the editor; Ctrl/⌘+S saves.
  const keys = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') { event.preventDefault(); void save(); return; }
    if (event.key === 'Tab' && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      const field = event.currentTarget, start = field.selectionStart, end = field.selectionEnd;
      const next = field.value.slice(0, start) + '  ' + field.value.slice(end);
      edit(next);
      requestAnimationFrame(() => { field.selectionStart = field.selectionEnd = start + 2; });
    }
  };

  const markdown = !!active && /\.(md|markdown)$/i.test(active.path);
  const page = !!active && PAGE.test(active.path);
  const previewable = !!address || markdown || page;
  // a saved page loads through its live link, so relative styles, scripts and images work;
  // an unsaved draft falls back to a sandboxed inline copy until it is saved
  const pageUrl = address || (page && active && listing?.preview && active.revision !== null && active.draft === active.content
    ? `${listing.preview}${active.path.split('/').map(encodeURIComponent).join('/')}` : '');
  const inline = page && active && !pageUrl ? `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:;"><style>body{font-family:system-ui;margin:24px;color:#222}svg{max-width:100%}</style>${active.draft}` : '';
  const shown: Mode = previewable ? mode : 'code';
  const preview = markdown && !address && active
    ? <div className="solar-dev-markdown"><ChatMarkdown text={active.draft} /></div>
    : <iframe key={`${pageUrl}#${reloads}`} title={t('jarvis.dev.preview')} className="solar-dev-preview"
      sandbox={address ? 'allow-scripts allow-forms allow-modals allow-popups allow-same-origin' : 'allow-scripts allow-forms allow-modals allow-popups'}
      {...(pageUrl ? { src: pageUrl } : { srcDoc: inline })} />;

  // Mount the sheet only after OrbitShell's stage exists; otherwise its first
  // layout pass would capture the fallback dialog instead of the canvas slot.
  if (stage.onStage && !stage.slot) return null;
  return <OrbitSheet title={t('jarvis.dev.title')} context={`${bot.name} · ${listing?.root ?? t('jarvis.dev.local')}`} onClose={onClose} labelId="solar-development-title"
    leading={<SolarIdentity id={bot.id} size={64} label={bot.name} />} actions={<><div className="solar-dev-modes"><button aria-pressed={surface === 'files'} onClick={() => setSurface('files')}><Code2 size={14} />{t('jarvis.dev.files')}</button><button aria-pressed={surface === 'computer'} onClick={() => setSurface('computer')}><Monitor size={14} />{t('orbit.sys.computer')}</button></div><button className="solar-dev-icon" onClick={onClose} aria-label={t('common.close')}><X size={17} /></button></>}>
    {surface === 'computer' ? <div className="flex min-h-0 flex-1 flex-col"><ComputerPanel bot={bot} inColumn /></div> : <div className="solar-development">
      <aside className="solar-dev-files" aria-label={t('jarvis.dev.files')}>
        <div className="solar-dev-filebar"><span>{t('jarvis.dev.files')}</span><button className="solar-dev-icon" onClick={() => void sync()} aria-label={t('jarvis.dev.refresh')} title={t('jarvis.dev.refresh')}><RefreshCw size={14} /></button><button className="solar-dev-icon" onClick={() => setNewName('page.html')} aria-label={t('jarvis.dev.new')} title={t('jarvis.dev.new')}><FilePlus2 size={15} /></button></div>
        {directory && <button className="solar-dev-entry" onClick={() => setDirectory(directory.split('/').slice(0,-1).join('/'))}><ArrowLeft size={13} /><span>{directory}</span></button>}
        {newName !== null && <form className="solar-dev-new" onSubmit={e => { e.preventDefault(); create(); }}><input autoFocus value={newName} onChange={e => setNewName(e.target.value)} aria-label={t('jarvis.dev.filename')} /><button type="submit" aria-label={t('jarvis.dev.new')}><FilePlus2 size={15} /></button><button type="button" onClick={() => setNewName(null)} aria-label={t('common.close')}><X size={13} /></button></form>}
        <div className="solar-dev-tree">{listing?.entries.map(entry => <button key={entry.path} className="solar-dev-entry" aria-current={selected === entry.path ? 'page' : undefined} onClick={() => entry.directory ? setDirectory(entry.path) : void open(entry.path)}>{entry.directory ? <Folder size={14} /> : <File size={14} />}<span>{entry.name}</span></button>)}
          {listing?.truncated && <p className="solar-dev-hint">{t('jarvis.dev.truncated')}</p>}</div>
        <p className="solar-dev-hint">{t('jarvis.dev.scope')}</p>
      </aside>
      <section className="solar-dev-editor" aria-label={t('jarvis.dev.editor')}>
        <div className="solar-dev-tabs">{documents.map(document => <span key={document.path} className="solar-dev-tab" data-active={selected === document.path || undefined}>
          <button onClick={() => setSelected(document.path)} aria-pressed={selected === document.path} title={document.path}>{document.path.split('/').at(-1)}{document.draft !== document.content || document.revision === null ? <i aria-label={t('jarvis.dev.unsaved')} /> : null}</button>
          <button className="solar-dev-tab-close" onClick={() => closeDocument(document.path)} aria-label={`${t('common.close')} · ${document.path}`}><X size={11} /></button>
        </span>)}</div>
        {active || address ? <>
          <div className="solar-dev-toolbar">
            {addressDraft !== null
              ? <form className="solar-dev-address" onSubmit={e => { e.preventDefault(); const next = addressDraft.trim(); if (next && !localAddress(next)) { setError(t('jarvis.dev.addressLocal')); return; } setAddress(next); setAddressDraft(null); setError(''); if (next) setMode(m => m === 'code' ? 'split' : m); }}>
                <Globe size={13} /><input autoFocus value={addressDraft} placeholder="http://localhost:5173" onChange={e => setAddressDraft(e.target.value)} aria-label={t('jarvis.dev.address')} onKeyDown={e => { if (e.key === 'Escape') setAddressDraft(null); }} /></form>
              : <span title={address || active?.path}>{address || active?.path}</span>}
            <button className="solar-dev-icon" onClick={() => setAddressDraft(addressDraft === null ? address || 'http://localhost:5173' : null)} aria-pressed={!!address} aria-label={t('jarvis.dev.address')} title={t('jarvis.dev.addressHint')}><Globe size={13} /></button>
            {previewable && <div className="solar-dev-modes">
              <button onClick={() => setMode('code')} aria-pressed={shown === 'code'} disabled={!active} title={t('jarvis.dev.code')}><Code2 size={14} />{t('jarvis.dev.code')}</button>
              <button onClick={() => setMode('split')} aria-pressed={shown === 'split'} disabled={!active} title={t('jarvis.dev.split')}><Columns2 size={14} />{t('jarvis.dev.split')}</button>
              <button onClick={() => setMode('preview')} aria-pressed={shown === 'preview'} title={t('jarvis.dev.preview')}><Eye size={14} />{t('jarvis.dev.preview')}</button>
            </div>}
            {pageUrl && <a className="solar-dev-icon" href={pageUrl} target="_blank" rel="noreferrer" aria-label={t('jarvis.dev.openWindow')} title={t('jarvis.dev.openWindow')}><ExternalLink size={13} /></a>}
            {active && <button className="solar-dev-icon" disabled={busy || active.revision === null} onClick={() => void reloadFile()} aria-label={t('jarvis.dev.reload')} title={t('jarvis.dev.reload')}><RefreshCw size={13} /></button>}
            {active && <button className="solar-dev-save" onClick={() => void save()} disabled={busy || (active.draft === active.content && active.revision !== null)}><Save size={14} />{t('jarvis.dev.save')}</button>}
          </div>
          <div className="solar-dev-panes" data-mode={address && !active ? 'preview' : shown}>
            {active && shown !== 'preview' && <textarea className="solar-dev-source" spellCheck={false} aria-label={`${t('jarvis.dev.code')} · ${active.path}`} value={active.draft} readOnly={busy} onChange={e => edit(e.target.value)} onKeyDown={keys} />}
            {(shown !== 'code' || (address && !active)) && preview}
          </div>
          <footer className="solar-dev-status">
            {active && <span>{active.draft.split('\n').length} {t('jarvis.dev.lines')} · UTF-8</span>}
            {synced && <span className="solar-dev-synced">{t('jarvis.dev.synced', { name: bot.name })}</span>}
            {active && <span>{active.draft !== active.content || active.revision === null ? t('jarvis.dev.draft') : t('jarvis.dev.saved')}</span>}
            {shown !== 'code' && page && !pageUrl && !address && <span>{t('jarvis.dev.static')}</span>}
            {bot.busy && <span className="solar-dev-live"><i />{t('jarvis.dev.following', { name: bot.name })}</span>}
          </footer>
        </> : <div className="solar-dev-empty"><Code2 size={30} strokeWidth={1} /><h2>{t('jarvis.dev.start')}</h2><p>{t('jarvis.dev.intro')}</p><button onClick={() => setNewName('page.html')}><FilePlus2 size={15} />{t('jarvis.dev.new')}</button></div>}
        {error && <div className="solar-dev-error" role="alert">{error}</div>}
      </section>
    </div>}
  </OrbitSheet>;
}
