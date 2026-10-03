// The HTML chrome over the Orbit canvas (design: act / attn pills, the map
// controls and key, the map composer with its "To" picker, the back link).

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowUp, Check, ChevronLeft, Hand, Info, Move, MousePointerClick, Settings2, Spline, X } from "lucide-react";
import { useStore, visibleMessages, type Bot } from "@/state/store";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { MAUS_COLORS } from "@/lib/mascot";
import { acceleratorLabel, orbitShell, type OrbitShellState } from "@/lib/orbit-shell";
import { pendingApprovals } from "@/components/PendingApproval";
import type { BotAttentionThread, GroupAttentionThread } from "@/components/SidebarBotActivity";
import { BotFace, OrbitFace } from "./OrbitFace";
import type { OrbitBot } from "./model";
import { useDismissOnOutside } from "@/components/ChatHeader";

const SURFACE = "bg-[color-mix(in_srgb,var(--color-panel)_94%,transparent)] backdrop-blur-[10px]";

/** The way back one level: to the team map, or to wherever this view sits
 * inside (the calendar sits inside You). */
export function BackToMap({ onClick, label }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} aria-keyshortcuts="Escape"
      className="absolute left-[18px] top-4 z-[4] flex h-[30px] items-center gap-1.5 rounded-[15px] pl-2 pr-3 text-[13px] font-medium text-ink/70 animate-rise hover:bg-ink/[0.06]">
      <ChevronLeft size={15} /> {label ?? t("orbit.teamMap")}
      <span aria-hidden className="ml-1 font-mono text-[10px] text-ink/40">esc</span>
    </button>
  );
}

/** "N active threads": the Active Threads list (spec §5.7). */
export function ActivePill({ entries, channels = [], open, onToggle, onJump, onJumpChannel }: {
  entries: BotAttentionThread[]; channels?: GroupAttentionThread[]; open: boolean; onToggle: () => void;
  onJump: (e: BotAttentionThread) => void; onJumpChannel?: (e: GroupAttentionThread) => void;
}) {
  const { state } = useStore();
  const faces = [...new Set(entries.map((e) => e.botId))].slice(0, 3);
  const popRef = useRef<HTMLDivElement>(null);
  const [up, setUp] = useState(false);
  useLayoutEffect(() => {
    if (!open || !popRef.current?.parentElement) return;
    const r = popRef.current.parentElement.getBoundingClientRect();
    setUp(window.innerHeight - r.bottom < 200 && r.top > window.innerHeight - r.bottom);
  }, [open]);
  return (
    <div className="relative">
      <button type="button" onClick={onToggle} aria-expanded={open} title={t("attention.title")}
        className="flex h-[30px] items-center whitespace-nowrap rounded-[15px] border border-ink/[0.12] bg-[color-mix(in_srgb,var(--color-panel)_92%,transparent)] pl-1 pr-3 hover:border-ink/30">
        <span className="flex">{faces.map((id) => <BotFace key={id} id={id} size={24} className="-mr-1.5" />)}</span>
        <span className="ml-2.5 text-[12.5px] text-ink/80"><b className="font-semibold text-ink">{entries.length + channels.length}</b> {entries.length + channels.length === 1 ? t("orbit.activeThreadOne") : t("orbit.activeThreadMany")}</span>
      </button>
      {open && (
        <div ref={popRef} role="dialog" aria-label={t("attention.title")}
          className={cn("absolute left-0 z-30 flex max-h-[320px] w-[300px] flex-col overflow-auto rounded-[14px] border border-ink/[0.14] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,.55)] animate-pop-in", SURFACE, up ? "bottom-9" : "top-9")}>
          <span className="px-2 pb-1 pt-1.5 text-[11px] font-medium text-ink/60">{t("attention.title")}</span>
          {entries.length + channels.length === 0 && <span className="px-2.5 py-2 text-[13px] text-ink/60">{t("attention.empty")}</span>}
          {entries.map((e) => {
            const bot = state.bots.find((b) => b.id === e.botId);
            const working = e.task.busy || e.task.activity === "working";
            const status = working ? t("chat.activity.working") : e.task.queued ? t("task.queued") : t("task.unread");
            return (
              <button key={`${e.botId}:${e.task.threadId}`} type="button" onClick={() => onJump(e)}
                className="flex items-center gap-2.5 rounded-[9px] px-2 py-1.5 text-left hover:bg-ink/[0.06]">
                <BotFace id={e.botId} size={28} />
                <span className="flex min-w-0 flex-1 flex-col gap-px">
                  <span className="truncate text-[13px] font-semibold" style={{ color: bot ? MAUS_COLORS[bot.color] : undefined }}>
                    {e.botName} · <span className="font-medium text-ink/80">{e.task.title}</span>
                  </span>
                  <span className={cn("text-[11.5px]", working ? "text-[#38d591]" : "text-ink/60")}>{status}</span>
                </span>
              </button>
            );
          })}
          {channels.map((e) => <ChannelAttentionRow key={`${e.groupId}:${e.task.threadId}`} entry={e} onOpen={() => onJumpChannel?.(e)} />)}
        </div>
      )}
    </div>
  );
}

/** A channel thread in an attention list: the channel's # and name, the
 * thread, and what it's doing; it opens the channel on that thread. */
function ChannelAttentionRow({ entry, onOpen }: { entry: GroupAttentionThread; onOpen: () => void }) {
  const working = entry.task.busy || entry.task.activity === "working";
  const status = entry.task.activity === "waiting-on-you" ? t("orbit.waitingOnYou") : working ? t("chat.activity.working") : entry.task.queued ? t("task.queued") : t("task.unread");
  return (
    <button type="button" onClick={onOpen} className="flex items-center gap-2.5 rounded-[9px] px-2 py-1.5 text-left hover:bg-ink/[0.06]">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink/[0.08] text-[13px] font-semibold text-ink/70">#</span>
      <span className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="truncate text-[13px] font-semibold text-ink">{entry.groupName.replace(/^#/, "")} · <span className="font-medium text-ink/80">{entry.task.title}</span></span>
        <span className={cn("text-[11.5px]", working ? "text-[#38d591]" : entry.task.activity === "waiting-on-you" ? "text-[#ffb454]" : "text-ink/60")}>{status}</span>
      </span>
    </button>
  );
}

/** "N waiting": one row per bot, Allow / Deny for plain approvals (the same
 * decideRequest the in-chat card sends); anything else opens the thread. */
export function WaitingPill({ entries, channels = [], open, onToggle, onOpen, onOpenChannel }: {
  entries: BotAttentionThread[]; channels?: GroupAttentionThread[]; open: boolean; onToggle: () => void;
  onOpen: (e: BotAttentionThread) => void; onOpenChannel?: (e: GroupAttentionThread) => void;
}) {
  const { state, dispatch } = useStore();
  const groups = useMemo(() => {
    const byBot = new Map<string, BotAttentionThread[]>();
    for (const e of entries) byBot.set(e.botId, [...(byBot.get(e.botId) ?? []), e]);
    return [...byBot.entries()].map(([botId, items]) => {
      const bot = state.bots.find((b) => b.id === botId);
      const pending = bot && items.some((i) => i.task.threadId === bot.threadId)
        ? pendingApprovals(visibleMessages(bot)).filter((p) => !p.message.card?.routineRequest && !p.message.card?.skillRequest && !p.message.card?.profileRequest && !p.message.card?.teamSetupRequest)
        : [];
      return { botId, bot, items, pending };
    });
  }, [entries, state.bots]);
  const faces = groups.map((g) => g.botId).slice(0, 3);
  const decide = (bot: Bot, requestIds: string[], behavior: "allow" | "deny") => {
    for (const requestId of requestIds) dispatch({ type: "decideRequest", threadId: bot.threadId, requestId, behavior });
  };
  return (
    <div className="relative flex flex-col items-start gap-2">
      <button type="button" onClick={onToggle} aria-expanded={open}
        className="flex h-[30px] items-center gap-1.5 whitespace-nowrap rounded-[15px] border border-[#ff980044] bg-[rgba(28,19,8,.85)] pl-1 pr-3 text-[12.5px] font-medium text-ink backdrop-blur-[8px]">
        <span className="flex">{faces.map((id) => <BotFace key={id} id={id} size={24} className="-mr-1.5" />)}</span>
        <span className="ml-2">{groups.length === 1 && channels.length === 0 && groups[0].bot ? t("orbit.waitingOne", { name: groups[0].bot.name }) : t("orbit.waitingCount", { count: groups.length + channels.length })}</span>
      </button>
      {open && (
        <div className={cn("absolute top-[38px] z-30 flex w-[320px] flex-col overflow-hidden rounded-[14px] border border-[#2a2a2c] shadow-[0_20px_50px_rgba(0,0,0,.55)] animate-pop-in", SURFACE)}>
          {groups.map(({ botId, bot, items, pending }) => {
            const n = Math.max(items.length, pending.length);
            const summary = pending[0]?.message.card?.title ?? items[0]?.task.title ?? "";
            return (
              <div key={botId} className="flex items-center gap-2.5 border-b border-[#1f1f21] px-2.5 py-2">
                <BotFace id={botId} size={30} />
                <button type="button" onClick={() => onOpen(items[0])} className="flex min-w-0 flex-1 flex-col gap-px text-left">
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: bot ? MAUS_COLORS[bot.color] : undefined }}>
                    {bot?.name ?? items[0]?.botName}
                    {n > 1 && <span className="rounded-lg bg-[#ff9800] px-1.5 text-[10.5px] font-semibold text-[#1a1000]">{n}</span>}
                  </span>
                  <span className="truncate text-[12px] leading-[1.35] text-ink/70">{summary}</span>
                </button>
                {bot && pending.length > 0 ? (
                  <>
                    <button type="button" title={pending.length > 1 ? t("orbit.allowAll", { count: pending.length }) : t("orbit.allowOnce")} aria-label={t("orbit.allowOnce")}
                      onClick={() => decide(bot, pending.map((p) => p.requestId), "allow")}
                      className="flex size-7 items-center justify-center rounded-full bg-[#1084fe]"><Check size={13} className="text-white" /></button>
                    <button type="button" title={t("orbit.deny")} aria-label={t("orbit.deny")}
                      onClick={() => decide(bot, pending.map((p) => p.requestId), "deny")}
                      className="flex size-7 items-center justify-center rounded-full border border-[#333]"><X size={11} className="text-ink/80" /></button>
                  </>
                ) : (
                  <button type="button" onClick={() => onOpen(items[0])} className="h-[26px] whitespace-nowrap rounded-[13px] border border-[#3a3a3c] px-2.5 text-[12px] font-medium text-ink hover:bg-ink/[0.06]">
                    {t("orbit.openThread")}
                  </button>
                )}
              </div>
            );
          })}
          {channels.length > 0 && <div className="flex flex-col p-1">
            {channels.map((e) => <ChannelAttentionRow key={`${e.groupId}:${e.task.threadId}`} entry={e} onOpen={() => onOpenChannel?.(e)} />)}
          </div>}
        </div>
      )}
    </div>
  );
}

/** The Orbit agent, in the map's bottom-left corner: its live face, its
 * name, and what it is doing (or how to reach it from anywhere). It is not
 * among the teams, so nothing on the map reads as reporting to it. */
export function OrbitCorner({ agent, onOpen }: { agent: OrbitBot; onOpen: () => void }) {
  // the person's own hotkeys, which they can change in Settings
  const [hotkeys, setHotkeys] = useState<OrbitShellState["hotkeys"] | null>(null);
  useEffect(() => {
    const shell = orbitShell();
    if (!shell) return;
    let live = true;
    void shell.state().then((state) => { if (live) setHotkeys(state.hotkeys); }, () => {});
    const off = shell.onState((state) => setHotkeys(state.hotkeys));
    return () => { live = false; off?.(); };
  }, []);
  const quick = hotkeys?.quick.registered ? acceleratorLabel(hotkeys.quick.accelerator) : "";
  const talk = hotkeys?.talk.registered ? acceleratorLabel(hotkeys.talk.accelerator) : "";
  const reach = quick && talk ? t("orbit.agent.hotkeys", { quick, talk })
    : quick ? t("orbit.agent.hotkey", { key: quick })
    : talk ? t("orbit.agent.talkHotkey", { key: talk })
    : t("orbit.agent.scope");
  const caption = agent.waiting ? t("orbit.agent.needsYou") : agent.busy ? t("orbit.agent.working") : reach;
  return (
    <button type="button" onClick={onOpen} data-orbit-agent aria-label={t("orbit.agent.open")}
      className="group absolute bottom-[22px] left-4 z-10 flex items-center gap-2.5 rounded-2xl py-1.5 pl-1.5 pr-3.5 text-left transition-colors hover:bg-ink/[0.05] animate-rise">
      <span className="relative">
        <OrbitFace id={agent.id} color={agent.color} size={40} />
        {agent.unread && <span className="absolute right-0.5 top-0.5 size-2 rounded-full bg-[#1084fe]" />}
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[13px] font-semibold" style={{ color: agent.color }}>{agent.name}</span>
        <span className={cn("text-[11px]", agent.waiting ? "text-[#ffb454]" : "text-ink/45")}>{caption}</span>
      </span>
    </button>
  );
}

export function MapControls({ legend, onLegend, onZoomIn, onZoomOut, onFit, canNav }: { legend: boolean; onLegend: () => void; onZoomIn: () => void; onZoomOut: () => void; onFit: () => void; canNav: boolean }) {
  const row = (icon: ReactNode, label: string) => (
    <span className="flex items-center gap-2.5">{icon}{label}</span>
  );
  const line = (style: string) => <span className="w-[22px] shrink-0" style={{ borderTop: style }} />;
  return (
    <div className="absolute bottom-[22px] right-4 z-10 flex flex-col items-end gap-2 animate-rise">
      {legend && (
        <div className={cn("flex w-[250px] flex-col gap-2 rounded-[14px] border border-ink/10 px-3.5 py-3 text-[12px] text-ink/75 shadow-[0_18px_40px_rgba(0,0,0,.5)] animate-pop-in", SURFACE)}>
          <span className="font-mono text-[10px] tracking-[0.1em] text-ink/45">{t("orbit.legend.lines")}</span>
          {row(line("1.5px solid color-mix(in srgb, var(--color-ink) 55%, transparent)"), t("orbit.legend.reports"))}
          {row(line("1.5px solid rgba(62,224,154,.75)"), t("orbit.legend.chiefDown"))}
          {row(line("1.5px dashed #b9a4ff"), t("orbit.legend.canTalk"))}
          {row(line("1.5px solid #ff9800"), t("orbit.legend.waiting"))}
          <span className="my-0.5 h-px bg-ink/[0.08]" />
          <span className="font-mono text-[10px] tracking-[0.1em] text-ink/45">{t("orbit.legend.gestures")}</span>
          {row(<MousePointerClick size={14} className="text-ink/60" />, t("orbit.legend.clickBot"))}
          {row(<Move size={14} className="text-ink/60" />, t("orbit.legend.dragChief"))}
          {row(<Spline size={14} className="text-ink/60" />, t("orbit.legend.dragPlus"))}
          {row(<Hand size={14} className="text-ink/60" />, t("orbit.legend.pan"))}
          {row(<Settings2 size={14} className="text-ink/60" />, t("orbit.legend.clickYou"))}
        </div>
      )}
      <div className="flex items-center gap-0.5 rounded-xl border border-ink/[0.08] bg-[color-mix(in_srgb,var(--color-panel)_82%,transparent)] p-[3px]">
        <button type="button" onClick={onLegend} title={t("orbit.legend.title")} aria-pressed={legend}
          className={cn("flex h-7 items-center gap-1.5 rounded-[9px] px-[9px] text-[12px] font-medium text-ink/80 hover:bg-ink/[0.08]", legend && "bg-ink/[0.08]")}>
          <Info size={14} /> {t("orbit.legend.title")}
        </button>
        {canNav && <>
          <span className="mx-0.5 h-4 w-px bg-ink/10" />
          <button type="button" onClick={onZoomOut} title={t("orbit.zoomOut")} aria-label={t("orbit.zoomOut")} className="size-7 rounded-[9px] text-[16px] font-medium text-ink/80 hover:bg-ink/[0.08]">−</button>
          <button type="button" onClick={onZoomIn} title={t("orbit.zoomIn")} aria-label={t("orbit.zoomIn")} className="size-7 rounded-[9px] text-[16px] font-medium text-ink/80 hover:bg-ink/[0.08]">+</button>
          <button type="button" onClick={onFit} className="h-7 rounded-[9px] px-2.5 text-[12px] font-medium text-ink/80 hover:bg-ink/[0.08]">{t("orbit.fit")}</button>
        </>}
      </div>
    </div>
  );
}

/** The map composer: pick who it goes to, type, send (design: showComposer). */
export function MapComposer({ onSent, preferredBotId }: { onSent: (botId: string, from: DOMRect) => void; preferredBotId?: string }) {
  const { state, dispatch } = useStore();
  const bots = state.bots.filter((b) => !b.hidden || b.id === preferredBotId);
  const [toId, setToId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const to = bots.find((b) => b.id === toId) ?? bots.find((b) => b.id === preferredBotId) ?? bots.find((b) => b.chiefOfStaff) ?? bots[0];
  if (!to) return null;
  const send = () => {
    const text = draft.trim();
    if (!text) return;
    dispatch({ type: "send", botId: to.id, threadId: to.threadId, text });
    setDraft("");
    if (barRef.current) onSent(to.id, barRef.current.getBoundingClientRect());
  };
  return (
    <div data-tour="composer" className="absolute bottom-[18px] left-1/2 z-10 w-[max(320px,min(620px,calc(100%-460px)))] -translate-x-1/2">
      {open && (
        <div className={cn("absolute bottom-[60px] left-0 flex max-h-[330px] w-[270px] flex-col gap-px overflow-auto rounded-[14px] border border-[#2a2a2c] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,.5)] animate-pop-in", SURFACE)}>
          {bots.map((b) => (
            <button key={b.id} type="button" onClick={() => { setToId(b.id); setOpen(false); }}
              className={cn("flex items-center gap-2.5 rounded-lg px-2 py-[5px] text-left hover:bg-ink/[0.06]", b.id === to.id && "bg-ink/[0.06]")}>
              <BotFace id={b.id} size={26} />
              <span className="flex-1 truncate text-[13.5px] font-medium" style={{ color: MAUS_COLORS[b.color] }}>{b.name}</span>
              <span className="max-w-[40%] truncate text-[11.5px] text-ink/50">{b.chiefOfStaff ? t("chat.chiefOfStaff") : b.title}</span>
            </button>
          ))}
        </div>
      )}
      <div ref={barRef} className="flex h-[52px] items-center gap-2 rounded-[26px] bg-composer/80 px-[7px] backdrop-blur-[10px]">
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label={t("orbit.composer.to")}
          className="flex h-[38px] items-center gap-1.5 whitespace-nowrap rounded-[19px] bg-black/25 pl-1 pr-3 text-[13px] font-medium">
          <BotFace id={to.id} size={30} />
          <span style={{ color: MAUS_COLORS[to.color] }}>{to.name}</span>
        </button>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={t("orbit.composer.placeholder", { name: to.name })}
          aria-label={t("composer.placeholder.bot", { name: to.name })}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } if (e.key === "Escape") setOpen(false); }}
          className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink/50" />
        <button type="button" onClick={send} disabled={!draft.trim()} aria-label={t("chat.send")}
          className="flex size-[38px] items-center justify-center rounded-full bg-ink disabled:opacity-60">
          <ArrowUp size={16} className="text-app" />
        </button>
      </div>
    </div>
  );
}

export interface OrbitToastMessage { id: number; text: string; undo?: () => void }

/** A short confirmation above the composer (design: toast), with Undo when
 * the change can be taken back. It leaves on its own after a few seconds. */
export function OrbitToast({ toast, left, onClose }: { toast: OrbitToastMessage; left: string; onClose: () => void }) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useLayoutEffect(() => {
    const id = window.setTimeout(() => closeRef.current(), toast.undo ? 7000 : 4500);
    return () => window.clearTimeout(id);
  }, [toast.id, toast.undo]);
  return (
    <div role="status" style={{ left }}
      className={cn("absolute bottom-[86px] z-[12] flex h-[38px] -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-[19px] border border-ink/[0.14] pl-3.5 pr-1.5 shadow-[0_12px_30px_rgba(0,0,0,.45)] animate-pop-in", SURFACE)}>
      <span className="text-[13px] text-ink/90">{toast.text}</span>
      {toast.undo && (
        <button type="button" onClick={() => { toast.undo?.(); onClose(); }}
          className="h-[26px] rounded-[13px] bg-ink px-3 text-[12px] font-semibold text-app">{t("orbit.toast.undo")}</button>
      )}
      <button type="button" onClick={onClose} aria-label={t("common.close")} className="flex size-[26px] items-center justify-center rounded-[13px] text-ink/60 hover:text-ink"><X size={14} /></button>
    </div>
  );
}

interface LineOption { label?: string; sub: string; run?: () => void }

/** What a line drawn between two bots means (design: link gesture): let
 * them talk, or open the channel between them. Opens where the line was
 * dropped; a choice that cannot apply says why instead of acting. */
export function LineChooser({ a, b, x, y, bounds, avoid, talk, channel, onClose }: {
  a: Bot; b: Bot; x: number; y: number; bounds: { w: number; h: number };
  /** where the two bots are on screen: the menu sits clear of both */
  avoid?: Array<{ x: number; y: number }>;
  talk: LineOption; channel: (LineOption & { label: string; run: () => void }) | null; onClose: () => void;
}) {
  const ref = useDismissOnOutside(true, onClose);
  const W = 288, H = 220, gap = 58;
  const pts = avoid?.length ? avoid : [{ x, y }];
  const cx = pts.reduce((n, p) => n + p.x, 0) / pts.length;
  const low = Math.max(...pts.map((p) => p.y)), high = Math.min(...pts.map((p) => p.y));
  const below = low + gap, above = high - gap - H;
  const top = below + H <= bounds.h - 12 ? below : above >= 12 ? above : Math.max(12, Math.min(bounds.h - H - 12, y + 14));
  const left = Math.max(12, Math.min(bounds.w - W - 12, cx - W / 2));
  const option = (key: string, label: string, o: LineOption) => (
    <button key={key} type="button" role="menuitem" disabled={!o.run} onClick={() => { onClose(); o.run?.(); }}
      className="flex flex-col items-start gap-0.5 rounded-[10px] px-3 py-2 text-left enabled:hover:bg-ink/[0.07] disabled:cursor-default">
      <span className={cn("text-[13.5px] font-medium", o.run ? "text-ink" : "text-ink/45")}>{label}</span>
      <span className="text-[12px] leading-[1.4] text-ink/55">{o.sub}</span>
    </button>
  );
  return (
    <div ref={ref} role="menu" aria-label={t("orbit.line.title", { a: a.name, b: b.name })} style={{ left, top, width: W }}
      className={cn("absolute z-30 flex flex-col gap-0.5 rounded-[14px] border border-ink/[0.12] p-1.5 shadow-[0_18px_40px_rgba(0,0,0,.5)] animate-pop-in", SURFACE)}>
      <div className="flex items-center gap-2 px-3 pb-1 pt-1.5">
        <BotFace id={a.id} size={20} />
        <span className="text-[12px] text-ink/50">↔</span>
        <BotFace id={b.id} size={20} />
        <span className="min-w-0 truncate text-[12.5px] text-ink/70">
          <span style={{ color: MAUS_COLORS[a.color] }}>{a.name}</span> · <span style={{ color: MAUS_COLORS[b.color] }}>{b.name}</span>
        </span>
      </div>
      {option("talk", t("orbit.line.talk"), talk)}
      {channel && option("channel", channel.label, channel)}
    </div>
  );
}
