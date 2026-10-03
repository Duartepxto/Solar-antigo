import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowUp, ChevronDown, ChevronRight, Check, Mic, Square, X, MessageCircle, Plus, Search, Sparkles, Users } from 'lucide-react';
import { t } from '@/lib/i18n';
import { useStore } from '@/state/store';
import type { OrbitModel } from './model';
import { solarNodes } from './solar-model';
import { SolarPlanet } from './SolarPlanet';
import {useSolarDictation} from './useSolarDictation';
import {solarState} from './solar-state';

export function SolarHeader({ onSearch, onAdd, onTeam, onChannel, canMake, mac }: {
  onSearch: () => void; onAdd: () => void; onTeam: () => void; onChannel: () => void; canMake: boolean; mac: boolean;
}) {
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null), create = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) { setOpen(false); } };
    document.addEventListener('pointerdown', outside); return () => document.removeEventListener('pointerdown', outside);
  }, []);
  useEffect(() => { if (open) menu.current?.querySelector<HTMLButtonElement>('button')?.focus(); },[open]);
  const noDrag = { WebkitAppRegion: 'no-drag' } as CSSProperties;
  const options = [ {label:t('jarvis.solar.add'),detail:t('jarvis.solar.agentDetail'),action:onAdd,Icon:Sparkles}, {label:t('jarvis.solar.addTeam'),detail:t('jarvis.solar.teamDetail'),action:onTeam,Icon:Users}, {label:t('jarvis.solar.addChannel'),detail:t('jarvis.solar.conversationDetail'),action:onChannel,Icon:MessageCircle} ];
  return <header ref={header} className={`solar-header${mac ? ' solar-header--mac' : ''}`} style={{ WebkitAppRegion: window.ogb ? 'drag' : undefined } as CSSProperties}>
    <div className="solar-brand"><svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="7" /><path d="M16 2v3M16 27v3M2 16h3M27 16h3M6 6l2 2M24 24l2 2M6 26l2-2M24 8l2-2" /></svg><span>{t('jarvis.solar.brand')}<small>{t('jarvis.solar.workspace')}</small></span></div>
    <nav className="solar-header-actions" style={noDrag} aria-label={t('jarvis.solar.navigation')}>
      <button className="solar-search solar-glass" type="button" onClick={onSearch} aria-label={t('jarvis.solar.search')}><Search size={15} /><span>{t('jarvis.solar.search')}</span><kbd aria-hidden="true">⌘ / Ctrl K</kbd></button>
      {canMake && <div className="solar-create-wrap"><button ref={create} className="solar-icon-button solar-glass" type="button" onClick={() => { setOpen(v => !v); }} aria-expanded={open} aria-haspopup="menu" aria-label={t('jarvis.solar.create')} title={t('jarvis.solar.create')}><Plus size={19} /></button>
        {open && <div ref={menu} className="solar-menu solar-create-menu" role="menu" aria-label={t('jarvis.solar.create')} onKeyDown={event => {
          if(event.key==='Escape'){setOpen(false);create.current?.focus();return;}
          if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;
          event.preventDefault();const items=Array.from(menu.current?.querySelectorAll<HTMLButtonElement>('button')??[]), index=items.indexOf(document.activeElement as HTMLButtonElement);
          items[event.key==='Home'?0:event.key==='End'?items.length-1:(index+(event.key==='ArrowDown'?1:-1)+items.length)%items.length]?.focus();
        }}>
          {options.map(({label,detail,action,Icon}) => <button key={label} type="button" role="menuitem" onClick={() => { setOpen(false); action(); }}><span className="solar-create-icon"><Icon size={17}/></span><span>{label}<small>{detail}</small></span><ChevronRight size={13}/></button>)}
        </div>}
      </div>}
    </nav>
  </header>;
}

export function SolarComposer({ model, onSent }: { model: OrbitModel; onSent: (id: string) => void }) {
  const { state, dispatch } = useStore();
  const [draft, setDraft] = useState(''), [toId, setToId] = useState<string | null>(null), [open, setOpen] = useState(false);
  const [filter,setFilter]=useState('');
  const root = useRef<HTMLFormElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const nodes = solarNodes(model).filter(node => node.bot);
  const to = nodes.find(node => node.id === toId) ?? nodes[0];
  const voice=useSolarDictation(draft,setDraft,to?.id);
  const picker=useRef<HTMLDivElement>(null),recipientButton=useRef<HTMLButtonElement>(null),search=useRef<HTMLInputElement>(null);
  useEffect(()=>{if(open)search.current?.focus();else setFilter('');},[open]);
  const choices=nodes.filter(node=>`${node.name} ${node.team} ${node.skin??node.moonSkin??''} ${node.skin?t(`jarvis.solar.${node.skin}`):''}`.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
  const bot = state.bots.find(b => b.id === to?.id);
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', outside); return () => document.removeEventListener('pointerdown', outside);
  }, []);
  if (!to || !bot) return null;
  return <form ref={root} className="solar-composer solar-glass" aria-label={t('jarvis.solar.messageForm')} onSubmit={event => {
    event.preventDefault(); const text = draft.trim(); if (!text || !state.connected || voice.listening) return;
    dispatch({ type: 'send', botId: bot.id, threadId: bot.threadId, text });
    setDraft(''); onSent(bot.id);
  }} onKeyDown={event => { if (event.key === 'Escape') setOpen(false); }}>
    {open && <div ref={picker} className="solar-recipient-menu solar-menu" role="dialog" aria-label={t('jarvis.solar.recipient')} onKeyDown={event=>{
      if(event.key==='Escape'){event.stopPropagation();setOpen(false);recipientButton.current?.focus();return;}
      if(event.key==='Enter'&&event.target===search.current){event.preventDefault();picker.current?.querySelector<HTMLButtonElement>('[data-recipient]')?.focus();return;}
      if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key)||((event.key==='Home'||event.key==='End')&&event.target===search.current))return;
      event.preventDefault();const buttons=Array.from(picker.current?.querySelectorAll<HTMLButtonElement>('[data-recipient]')??[]),index=buttons.indexOf(document.activeElement as HTMLButtonElement);
      buttons[event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length]?.focus();
    }}>
      <div className="solar-recipient-heading"><strong>{t('jarvis.solar.recipient')}</strong><span>{nodes.length}</span></div>
      <label className="solar-recipient-search"><Search size={14}/><input ref={search} type="search" value={filter} onChange={event=>setFilter(event.target.value)} placeholder={t('jarvis.solar.findRecipient')} aria-label={t('jarvis.solar.findRecipient')}/></label>
      <div className="solar-recipient-list">
      {choices.map(node => {const status=solarState(node.bot,model.connected);return <button data-recipient key={node.id} type="button" aria-pressed={node.id === to.id} onClick={() => { setToId(node.id); setOpen(false);input.current?.focus(); }}><span className="solar-recipient-art"><SolarPlanet color={node.color} kind={node.kind} skin={node.kind==='moon'?node.moonSkin:node.skin} /></span><span className="solar-recipient-copy">{node.name}{node.skin&&<small>{t(`jarvis.solar.${node.skin}`)}</small>}<small>{node.team||t('jarvis.solar.workspace')} · {t(`jarvis.solar.${status==='ready'?'idle':status}`)}</small></span>{node.id===to.id&&<Check size={15}/>}</button>;})}
      {!choices.length&&<p className="solar-recipient-empty">{t('jarvis.solar.noRecipients')}</p>}
      </div>
    </div>}
    {voice.error&&<div className="solar-voice-note" role="alert"><span>{t(`jarvis.solar.voice.${voice.error==='unsupported'?'unavailable':['not-allowed','service-not-allowed'].includes(voice.error)?'permission':voice.error==='no-speech'?'noSpeech':'error'}`)}</span><button type="button" aria-label={t('jarvis.solar.dismiss')} onClick={voice.dismiss}><X size={14}/></button></div>}
    {voice.listening&&<div className="solar-voice-note" role="status"><span>{t('jarvis.solar.voice.listening')}<small>{t(voice.native?'jarvis.solar.voice.review':'jarvis.solar.voice.provider')}</small></span></div>}
    <button ref={recipientButton} className="solar-recipient" type="button" disabled={voice.listening} aria-label={t('jarvis.solar.recipient')} aria-expanded={open} onClick={() => setOpen(v => !v)}><span className="solar-recipient-art"><SolarPlanet color={to.color} kind={to.kind} skin={to.kind==='moon'?to.moonSkin:to.skin} /></span><span>{to.name}</span><ChevronDown size={10} /></button>
    <input ref={input} readOnly={voice.listening} aria-label={t('jarvis.solar.message', { name: to.name })} placeholder={t('jarvis.solar.message', { name: to.name })} value={draft} onChange={event => setDraft(event.target.value)} />
    <button className={`solar-type${voice.listening?' solar-type--listening':''}`} data-speech-supported={voice.supported} type="button" onClick={()=>{setOpen(false);voice.toggle();}} aria-pressed={voice.listening} title={t(voice.listening?'jarvis.solar.voice.stop':'jarvis.solar.voice.start')} aria-label={t(voice.listening?'jarvis.solar.voice.stop':'jarvis.solar.voice.start')}>{voice.listening?<Square size={14}/>:<Mic size={17}/>}</button>
    <button className="solar-send" type="submit" disabled={!draft.trim() || !state.connected || voice.listening} aria-label={t('jarvis.solar.send')}><ArrowUp size={16} /></button>
  </form>;
}
