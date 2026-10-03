import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import {createPortal} from 'react-dom';
import { ArrowUpRight, Focus, Minus, Plus, RotateCcw, Settings2, Pause, Play, Square } from 'lucide-react';
import type {LocaleKey} from '@/locales';
import { t } from '@/lib/i18n';
import type { OrbitModel, Point } from './model';
import { loadSolarLayout, saveSolarLayout, solarNodes, solarPositions, type SolarLayout } from './solar-model';
import { SolarPlanet } from './SolarPlanet';
import { SolarWorld } from './SolarWorld';
import { useSolarPreferences } from './solar-preferences';
import { solarState, solarActivity, type SolarSignal } from './solar-state';
import { zoomSolarCamera, solarBodyDiameter, transitionSolarCamera } from './solar-camera';
import './solar.css';
import {useSolarAnimationPreview} from './useSolarAnimationPreview';
import { publishSolarPortraits } from './solar-portraits';

interface Camera { x: number; y: number; scale: number }
interface Drag { id: string | null; x: number; y: number; start: Point; moved: boolean; layout: SolarLayout }
const bodyDiameter = solarBodyDiameter;

export function SolarMap({ model, onBot, onSettings, onAdd, active = true, focusId, focusWidth }: { model: OrbitModel; onBot: (id: string) => void; onSettings: () => void; onAdd: () => void; active?: boolean; focusId?:string; focusWidth?:number }) {
  const root = useRef<HTMLDivElement>(null);
  const linePrefix=useId();
  const [size, setSize] = useState({ w: 1000, h: 700 });
  const [labelMetrics, setLabelMetrics] = useState<Record<string, { w: number; h: number; dx: number; dy: number }>>({});
  const [fontReady, setFontReady] = useState(false);
  const settledLabels = useRef(false), cameraTouched = useRef(false);
  const [layout, setLayout] = useState(loadSolarLayout);
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, scale: .8 });
  const [preferences,updatePreferences] = useSolarPreferences();
  const lines = preferences.links;
  const [grabbedId,setGrabbedId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [paused, setPaused] = useState(document.hidden);
  const [renderFailed, setRenderFailed] = useState(false);
  const [signals, setSignals] = useState<Record<string, SolarSignal>>({});
  const previousActivity = useRef(new Map<string, { busy: boolean; message: string | null }>());
  const drag = useRef<Drag | null>(null), suppressClick = useRef(false);
  const history = useRef<SolarLayout[]>([]);
  const nodes = useMemo(() => solarNodes(model), [model]);
  const preview=useSolarAnimationPreview(nodes);
  const positions = useMemo(() => solarPositions(nodes, layout, size.w < 650, size.w >= 500), [nodes, layout, size.w]);
  const positionsRef = useRef(positions); positionsRef.current = positions;
  const cameraRef = useRef(camera); cameraRef.current = camera;
  const [focusCamera,setFocusCamera]=useState<Camera|null>(null);
  const viewCamera=focusCamera??camera,viewCameraRef=useRef(viewCamera);viewCameraRef.current=viewCamera;
  const layoutRef = useRef(layout); layoutRef.current = layout;
  const nodeSignature = nodes.map(node => node.id).join('|');
  useEffect(()=>{
    const source=viewCameraRef.current,node=nodes.find(n=>n.id===focusId),p=node&&positionsRef.current[node.id];
    const scale=node?144/bodyDiameter(node.kind,1,node.moonSkin):cameraRef.current.scale;
    const target=p?{scale,x:Math.max(160,(focusWidth??size.w)/2)-size.w/2-p.x*scale,y:14-p.y*scale}:cameraRef.current;
    if(!preferences.motion||matchMedia('(prefers-reduced-motion: reduce)').matches){setFocusCamera(focusId?target:null);return;}
    let frame=0;const started=performance.now();
    const animate=(now:number)=>{setFocusCamera(transitionSolarCamera(source,target,now-started));if(now-started<560)frame=requestAnimationFrame(animate);else if(!focusId)setFocusCamera(null);};
    frame=requestAnimationFrame(animate);return()=>cancelAnimationFrame(frame);
  },[focusId,focusWidth,size.w,size.h,preferences.motion]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { let alive = true; void document.fonts.ready.then(() => { if (alive) setFontReady(true); }); return () => { alive = false; }; }, []);
  useEffect(() => {
    const visibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', visibility); return () => document.removeEventListener('visibilitychange', visibility);
  }, []);

  useEffect(() => {
    const now = Date.now(), updates: Record<string, SolarSignal> = {};
    for (const node of nodes) {
      if (!node.bot) continue;
      const previous = previousActivity.current.get(node.id);
      if (previous && previous.message !== node.bot.lastMessageId && node.bot.lastMessageRole === 'assistant') updates[node.id] = { kind: 'receiving', at: now };
      else if (previous?.busy && !node.bot.busy && !node.bot.waiting && node.bot.mood !== 'stalled') updates[node.id] = { kind: 'settled', at: now };
      previousActivity.current.set(node.id, { busy: node.bot.busy, message: node.bot.lastMessageId });
    }
    if (Object.keys(updates).length) setSignals(current => ({ ...current, ...updates }));
  }, [nodes]);
  useEffect(() => {
    const send = (event: Event) => setSignals(current => ({ ...current, [(event as CustomEvent<string>).detail]: { kind: 'sending', at: Date.now() } }));
    window.addEventListener('jarvis-solar-send', send); return () => window.removeEventListener('jarvis-solar-send', send);
  }, []);
  useEffect(() => {
    if (!Object.keys(signals).length) return;
    const timer = setTimeout(() => setSignals({}), 2200); return () => clearTimeout(timer);
  }, [signals]);

  useLayoutEffect(() => {
    const el = root.current; if (!el) return;
    const observer = new ResizeObserver(entries => {
      const rect = entries[0].contentRect; setSize({ w: rect.width, h: rect.height });
    });
    observer.observe(el); return () => observer.disconnect();
  }, []);

  // Measure the rendered copy, including the locally hosted font and translated
  // names/statuses. The camera reserves these rectangles, not character guesses.
  useLayoutEffect(() => {
    const labels = root.current?.querySelectorAll<HTMLElement>('.solar-body-label');
    if (!labels) return;
    const measure = () => {
      const next: Record<string, { w: number; h: number; dx: number; dy: number }> = {};
      labels.forEach(label => { const body=label.parentElement, id=body?.dataset.solarNode; if (id && body) { const r = label.getBoundingClientRect(), b=body.getBoundingClientRect(); next[id] = { w:r.width, h:r.height, dx:r.left-b.left-b.width/2, dy:r.top-b.top-b.height/2 }; } });
      setLabelMetrics(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    const observer = new ResizeObserver(measure); labels.forEach(label => observer.observe(label)); measure();
    return () => observer.disconnect();
  }, [nodeSignature, size.w, camera.scale]);

  function fitted(): Camera {
    const compact = size.w < 650, wideCompact = compact && size.w >= 500, many = nodes.filter(node => node.kind === 'planet').length >= 5;
    const topSpace = many ? compact ? 75 : 50 : wideCompact ? 30 : compact ? 90 : 75, bottomSpace = many ? compact ? 170 : 100 : wideCompact ? 175 : compact ? 200 : 110;
    const availableH = Math.max(160, size.h - topSpace - bottomSpace), availableW = Math.max(200, size.w - 44);
    const bounds = (scale: number) => {
      const boxes = nodes.map(node => {
        const p = positionsRef.current[node.id], d = bodyDiameter(node.kind, scale,node.moonSkin);
        const radius = d / 2 * (node.skin === 'saturn' ? 2.15 : node.kind === 'sun' ? 1.23 : 1.06);
        const labelWidth = labelMetrics[node.id]?.w ?? (node.kind === 'moon' ? 110 : node.kind === 'sun' ? 72 : 170);
        const labelHeight = labelMetrics[node.id]?.h ?? (node.kind === 'planet' ? 61 : 40);
        const horizontal = Math.max(radius, labelWidth / 2, 22);
        const sideLabel = compact && node.kind !== 'moon' && (!many || node.kind === 'sun');
        const labelBottom = sideLabel ? labelHeight / 2 : Math.max(44, d) / 2 + (node.kind === 'sun' ? 18 : node.kind === 'planet' ? 13 : 6) + labelHeight;
        const labelRight = sideLabel && wideCompact && node.kind === 'planet' && p.x > 0;
        const left = sideLabel && node.kind === 'planet' && !labelRight ? Math.max(horizontal, (node.skin === 'saturn' ? radius : d / 2) + 11 + labelWidth) : horizontal;
        const right = labelRight ? Math.max(horizontal, radius + 11 + labelWidth) : sideLabel && node.kind === 'sun' ? Math.max(horizontal, d / 2 + 16 + labelWidth) : horizontal;
        return { left: p.x * scale - left, right: p.x * scale + right, top: p.y * scale - radius, bottom: p.y * scale + Math.max(radius, labelBottom) };
      });
      return { left: Math.min(...boxes.map(b => b.left)), right: Math.max(...boxes.map(b => b.right)), top: Math.min(...boxes.map(b => b.top)), bottom: Math.max(...boxes.map(b => b.bottom)) };
    };
    let scale = .8;
    for (let i = 0; i < 5; i++) {
      const b = bounds(scale);
      scale = Math.max(.18, Math.min(1.25, scale * Math.min(availableW / (b.right - b.left), availableH / (b.bottom - b.top))));
    }
    const b = bounds(scale);
    return { scale, x: -(b.left + b.right) / 2, y: topSpace + availableH / 2 - size.h / 2 - (b.top + b.bottom) / 2 };
  }
  // Changes in activity don't reset the user's camera or move their arrangement.
  useEffect(() => { settledLabels.current = false; cameraTouched.current = false; setCamera(fitted()); }, [size.w, size.h, nodeSignature]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!settledLabels.current && !cameraTouched.current) {
      setCamera(fitted());
      if (fontReady && nodes.every(node => !!labelMetrics[node.id])) settledLabels.current = true;
    }
  }, [fontReady, labelMetrics]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fit = () => setCamera(fitted());
    window.addEventListener('jarvis-solar-fit', fit);
    return () => window.removeEventListener('jarvis-solar-fit', fit);
  });
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 3500); return () => clearTimeout(timer);
  }, [notice]);

  function remember(previous: SolarLayout) { history.current.push(previous); if (history.current.length > 30) history.current.shift(); }
  function persist(next: SolarLayout) {
    if (!saveSolarLayout(next)) setNotice(t('jarvis.solar.sessionOnly'));
    else setNotice(t('jarvis.solar.saved'));
  }
  function start(event: ReactPointerEvent, id: string | null) {
    if (event.button !== 0||focusId) return;
    cameraTouched.current = true;
    const p = id ? layoutRef.current.offsets[id] ?? { x: 0, y: 0 } : cameraRef.current;
    drag.current = { id, x: event.clientX, y: event.clientY, start: { x: p.x, y: p.y }, moved: false, layout: layoutRef.current };
    setGrabbedId(id);
    event.currentTarget.setPointerCapture(event.pointerId);
    if (id) event.stopPropagation();
  }
  function move(event: ReactPointerEvent) {
    const d = drag.current; if (!d) return;
    const dx = event.clientX - d.x, dy = event.clientY - d.y;
    if (Math.hypot(dx, dy) > 5) d.moved = true;
    if (!d.moved) return;
    if (!d.id) { setCamera(c => ({ ...c, x: d.start.x + dx, y: d.start.y + dy })); return; }
    const p = { x: d.start.x + dx / cameraRef.current.scale, y: d.start.y + dy / cameraRef.current.scale };
    setLayout({ version: 1, offsets: { ...d.layout.offsets, [d.id]: p } });
  }
  function end(cancelled = false) {
    const d = drag.current; drag.current = null; setGrabbedId(null); if (!d) return;
    suppressClick.current = !!d.id && d.moved;
    if (cancelled) { setLayout(d.layout); return; }
    if (d.moved && d.id) { remember(d.layout); persist(layoutRef.current); }
  }
  function zoom(factor: number, anchor?: Point) { cameraTouched.current = true; setCamera(c => zoomSolarCamera(c, factor, anchor)); }
  // Wheel zoom is confined to this surface; native scrolling remains usable in other pages.
  useEffect(() => {
    const el = root.current; if (!el) return;
    if(focusId)return;
    const wheel = (event: WheelEvent) => { event.preventDefault(); const rect=el.getBoundingClientRect(); zoom(Math.exp(-event.deltaY * (event.ctrlKey ? .01 : .0015)), { x:event.clientX-rect.left-rect.width/2, y:event.clientY-rect.top-rect.height/2 }); };
    el.addEventListener('wheel', wheel, { passive: false });
    return () => el.removeEventListener('wheel', wheel);
  }, [focusId]);
  function undo() {
    const previous = history.current.pop(); if (!previous) return;
    setLayout(previous); persist(previous);
  }
  const screen = (p: Point) => ({ x: size.w / 2 + viewCamera.x + p.x * viewCamera.scale, y: size.h / 2 + viewCamera.y + p.y * viewCamera.scale });
  const planets = nodes.filter(node => node.kind === 'planet');
  const working = nodes.filter(node => node.bot?.busy).length;
  const waiting = nodes.filter(node => node.bot?.waiting).length;
  const bodies = nodes.map(node => ({ id: node.id, parentId:node.parentId, kind: node.kind, skin: node.kind === 'moon' ? node.moonSkin : node.skin, ...screen(positions[node.id]), diameter: bodyDiameter(node.kind, viewCamera.scale,node.moonSkin), color: node.color, active: !!node.bot?.busy, grabbed: grabbedId !== null && (grabbedId === node.id || grabbedId === node.parentId),
    background:!!focusId&&node.id!==focusId,state:preview.states[node.id]?.state??solarState(node.bot,model.connected),tool:preview.states[node.id]?.activity?undefined:node.bot?.tool??undefined,activity:preview.states[node.id]?.activity??solarActivity(node.bot?.tool),signal:preview.states[node.id]?.signal??signals[node.id] }));
  useEffect(() => { publishSolarPortraits(bodies, preferences, paused || preview.paused || !preferences.motion); }, [bodies, preferences, paused, preview.paused]);

  return <div ref={root} className="solar-map" data-focused={focusId||undefined} data-many={planets.length >= 5 || undefined} data-paused={paused || preview.paused || !preferences.motion || undefined} data-compact={size.w >= 500 && size.w < 650 ? 'wide' : undefined} role="region" aria-label={t('jarvis.solar.map')}
    onPointerDown={event => { if (event.target === event.currentTarget) start(event, null); }}
    onPointerMove={move} onPointerUp={() => end()} onPointerCancel={() => end(true)}
    onKeyDown={event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); undo(); }
    }}>
    <div className="solar-starfield" aria-hidden="true" />
    <svg className="solar-orbits" width={size.w} height={size.h} aria-hidden="true">
      <defs>{nodes.filter(node=>node.parentId).map((node,i)=>{const parent=nodes.find(n=>n.id===node.parentId)!,p=screen(positions[parent.id]),q=screen(positions[node.id]);return <linearGradient key={node.id} id={`${linePrefix}-link-${i}`} gradientUnits="userSpaceOnUse" x1={p.x} y1={p.y} x2={q.x} y2={q.y}><stop offset="0" stopColor={parent.color}/><stop offset="1" stopColor={node.color}/></linearGradient>;})}</defs>
      {lines && nodes.filter(node => node.parentId).map((node,index) => {
        const parent=nodes.find(n => n.id === node.parentId)!, p = screen(positions[node.parentId!]), q = screen(positions[node.id]);
        const length=Math.hypot(q.x-p.x,q.y-p.y)||1, dx=(q.x-p.x)/length, dy=(q.y-p.y)/length;
        const a=bodyDiameter(parent.kind,viewCamera.scale,parent.moonSkin)/2*(parent.kind==='sun'?1.3:1.2), b=bodyDiameter(node.kind,viewCamera.scale,node.moonSkin)/2*1.2;
        const member=node.kind==='moon',waiting=!!node.bot?.waiting&&!member;
        const base=length<a+b?null:<line key={node.id} className="solar-link" x1={p.x+dx*a} y1={p.y+dy*a} x2={q.x-dx*b} y2={q.y-dy*b} stroke={waiting?'#ff9800':`url(#${linePrefix}-link-${index})`} strokeOpacity={focusId?(member?.07:.10):(member?.4:.6)} strokeWidth="1.6" strokeDasharray="6 6" />;
        if(!member||!node.bot?.waiting)return base;
        const sun=nodes[0],s=screen(positions[sun.id]),distance=Math.hypot(q.x-s.x,q.y-s.y)||1,r=bodyDiameter('sun',viewCamera.scale)/2*1.3;
        return [base,distance<r+b?null:<line key={`${node.id}-waiting`} x1={s.x+(q.x-s.x)/distance*r} y1={s.y+(q.y-s.y)/distance*r} x2={q.x-(q.x-s.x)/distance*b} y2={q.y-(q.y-s.y)/distance*b} stroke="#ff9800" strokeOpacity={focusId?.12:.6} strokeWidth="1.2"/>];
      })}
    </svg>
    <SolarWorld bodies={bodies} width={size.w} height={size.h} paused={paused || preview.paused || !preferences.motion || !active} settings={preferences} onFailure={() => setRenderFailed(true)} />
    {preview.playing&&root.current&&createPortal(<div className="solar-simulation solar-glass" role="group" aria-label={t('jarvis.solar.simulation')}>
      <span>{t('jarvis.solar.simulation')}<strong>{t(`jarvis.solar.${preview.phase}` as LocaleKey)}</strong></span>
      <button type="button" aria-label={t(preview.paused?'jarvis.solar.resume':'jarvis.solar.pause')} onClick={()=>window.dispatchEvent(new Event('jarvis-solar-pause-preview'))}>{preview.paused?<Play size={14}/>:<Pause size={14}/>}</button>
      <button type="button" aria-label={t('jarvis.solar.stopSimulation')} onClick={()=>window.dispatchEvent(new Event('jarvis-solar-stop-preview'))}><Square size={12}/></button>
    </div>,root.current.closest('.orbit-stage')??root.current)}
    {renderFailed && <div className="solar-connection-note solar-glass" role="alert">{t('jarvis.solar.renderFailed')}<button type="button" onClick={() => window.location.reload()}>{t('orbit.retry')}</button></div>}
    <div className="solar-summary">
      <span>{t('jarvis.solar.system')}</span>
      <span>{t('jarvis.solar.count', { count: nodes.filter(node => !!node.bot).length, teams: planets.length })}</span>
      {import.meta.env.VITE_JARVIS_PREVIEW === 'true' && <span className="solar-preview-label">{t('jarvis.solar.preview')}</span>}
    </div>
    {nodes.map(node => {
      const p = screen(positions[node.id]);
      const diameter = bodyDiameter(node.kind, viewCamera.scale,node.moonSkin);
      const displayName = node.kind === 'planet' ? t(`jarvis.solar.${node.skin ?? 'earth'}`) : node.name;
      const displayTeam = import.meta.env.VITE_JARVIS_PREVIEW === 'true' ? node.team.replace(/^\d+\s*·\s*/, '') : node.team;
      const visibleState=preview.states[node.id]?.state??solarState(node.bot,model.connected);
      const status = t(`jarvis.solar.${visibleState==='ready'?'idle':visibleState}`);
      const style = { left: p.x, top: p.y, '--planet-size': `${diameter}px`, '--planet-color': node.color } as CSSProperties;
      return <button key={node.id} type="button" className={`solar-body solar-body--${node.kind}${node.bot?.busy ? ' solar-body--working' : ''}${node.bot?.waiting ? ' solar-body--waiting' : ''}`}
        tabIndex={focusId?-1:0} data-focus-current={focusId===node.id||undefined} data-solar-node={node.id} data-solar-kind={node.kind} data-solar-skin={node.kind==='moon'?node.moonSkin:node.skin} data-label-side={size.w >= 500 && size.w < 650 && node.kind === 'planet' && positions[node.id].x > 0 ? 'right' : undefined} style={style}
        aria-label={t('jarvis.solar.open', { name: node.kind === 'planet' ? `${displayName} · ${node.name}` : node.name, status })} title={t('jarvis.solar.moveHint', { name: node.name })}
        onPointerDown={event => start(event, node.id)}
        onClick={() => {
          if(focusId)return;
          if (suppressClick.current) { suppressClick.current = false; return; }
          if (node.bot) onBot(node.bot.id); else onSettings();
        }}
        onKeyDown={event => {
          const delta: Record<string, Point> = { ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 }, ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 } };
          if (!delta[event.key]) return;
          event.preventDefault(); const amount = event.shiftKey ? 40 : 12;
          const previous = layoutRef.current, offset = previous.offsets[node.id] ?? { x: 0, y: 0 };
          const next: SolarLayout = { version: 1, offsets: { ...previous.offsets, [node.id]: { x: offset.x + delta[event.key].x * amount, y: offset.y + delta[event.key].y * amount } } };
          remember(previous); setLayout(next); persist(next);
        }}>
        <span className="solar-body-visual">
          {renderFailed && <SolarPlanet kind={node.kind} skin={node.kind==='moon'?node.moonSkin:node.skin} />}
          {node.bot?.unread && <span className="solar-unread" />}
        </span>
        <span className="solar-body-label"><strong>{displayName}</strong>{node.kind === 'planet' && <span className="solar-team-name">{node.name}{displayTeam ? ` · ${displayTeam}` : ''}</span>}{(visibleState==='waiting'||visibleState==='blocked')&&<span className="solar-body-status">{t(visibleState==='waiting'?'orbit.waitingOnYou':'orbit.runStalled')}</span>}{node.bot?.tool&&<span className="solar-original-hover-tool">{node.bot.tool}</span>}</span>
      </button>;
    })}
    {planets.length === 0 && <div className="solar-empty"><p>{t('jarvis.solar.empty')}</p><button type="button" onClick={onAdd}><Plus size={14} />{t('jarvis.solar.add')}</button></div>}
    <div className="solar-map-tools solar-glass" role="group" aria-label={t('jarvis.solar.controls')}>
      <button type="button" onClick={() => zoom(1 / 1.2)} title={t('jarvis.solar.zoomOut')} aria-label={t('jarvis.solar.zoomOut')}><Minus size={15} /></button>
      <span className="solar-zoom-value">{Math.round(camera.scale * 100)}%</span>
      <button type="button" onClick={() => zoom(1.2)} title={t('jarvis.solar.zoomIn')} aria-label={t('jarvis.solar.zoomIn')}><Plus size={15} /></button>
      <span className="solar-tool-divider" />
      <button type="button" onClick={() => setCamera(fitted())} title={t('jarvis.solar.fit')} aria-label={t('jarvis.solar.fit')}><Focus size={15} /></button>
      <button type="button" onClick={() => updatePreferences({links:!lines})} aria-pressed={lines} title={t('jarvis.solar.connections')} aria-label={t('jarvis.solar.connections')}><Settings2 size={15} /></button>
      <button type="button" onClick={() => { remember(layoutRef.current); const next: SolarLayout = { version: 1, offsets: {} }; setLayout(next); persist(next); }} title={t('jarvis.solar.reset')} aria-label={t('jarvis.solar.reset')}><RotateCcw size={14} /></button>
    </div>
    <div className="solar-map-hint"><span>{t('jarvis.solar.drag')}</span><span>{waiting ? t('jarvis.solar.waitingCount', { count: waiting }) : working ? t('jarvis.solar.workingCount', { count: working }) : t('jarvis.solar.ready')}</span><ArrowUpRight size={12} /></div>
    <div className="solar-notice" role="status">{notice}</div>
    <a className="solar-credits" href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noreferrer">{t('jarvis.solar.textureCredit')}</a>
  </div>;
}
