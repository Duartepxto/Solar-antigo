// ⌘K (design: pal): jump to a bot or channel, land on a message hit from
// /api/search, open a settings place, or run an action. Bots, channels and
// hits come from local state and the search route; settings and actions go
// through the same store actions and Orbit navigation the map uses.
// Self-contained — owns its open state and its global chord.
import { useEffect, useMemo, useRef, useState } from "react";
import { Archive, Bug, FileDown, Hash, Info, Keyboard, MessageSquare, Plus, RefreshCw, Scan, Search, Sparkles, Users, type LucideIcon } from "lucide-react";
import { brand } from "@/lib/brand";
import { api, useStore } from "@/state/store";
import { rankByName } from "@/lib/palette-rank";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";
import type { SearchHit } from "@/lib/search-hit";
import { landOnSearchHit } from "@/lib/focus-message";
import { buildTeamMapSections } from "@/lib/team-map";
import { BotFace } from "@/orbit/OrbitFace";
import { SolarPlanet } from "@/orbit/SolarPlanet";
import { solarNodes } from "@/orbit/solar-model";
import { buildModel, loadBotOrder, loadLayout } from "@/orbit/model";
import { orbitNavigate } from "@/orbit/events";
import { YOU_HUB } from "@/orbit/detail/HubPanels";
import { PANEL_ICON, PANEL_KICKER, type BotPanelKey } from "@/orbit/detail/BotPanels";
import { orderedThreadList } from "./SidebarThreadRow";

const BOT_PALETTE_PANELS: BotPanelKey[] = ["engine", "computer", "browser", "phone", "apps", "approvals", "skills", "memory", "routines", "voice", "profile", "overview", "usage", "history"];
const JARVIS_SOLAR = import.meta.env.VITE_JARVIS_SOLAR === 'true';
import { useAppSettingsSections } from "./SettingsModal";

interface Item {
  key: string;
  label: string;
  meta?: string;
  /** extra words a settings section is found by ("retention", "tailscale") */
  keywords?: string[];
  icon?: LucideIcon;
  botId?: string;
  hit?: SearchHit;
  run: () => void | Promise<void>;
}

const YOU_TITLE: Record<string, string> = {
  engines: "orbit.hub.p.engines", connections: "orbit.hub.p.keys", apps: "orbit.hub.p.apps", remote: "orbit.hub.p.remote", usage: "orbit.hub.p.usage",
  calendar: "orbit.hub.p.calendar", library: "orbit.hub.p.library", appearance: "orbit.hub.p.appearance", people: "orbit.hub.p.people",
  workspaces: "orbit.hub.p.workspaces", system: "orbit.hub.p.system",
};

export function CommandPalette({ onOpenChange, openRequest = 0 }: {
  onOpenChange?: (open: boolean) => void;
  /** Bump to open the palette from a button (Orbit's search chip). */
  openRequest?: number;
}) {
  const { state, dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messageHits, setMessageHits] = useState<SearchHit[]>([]);
  const [cursor, setCursor] = useState(0);
  const selectedRef = useRef<HTMLButtonElement>(null);
  const remoteClient = window.ogb?.remoteClient?.active === true;
  const appSections = useAppSettingsSections();
  // same model inputs as the map, so every planet and moon keeps its own identity here
  const solar = useMemo(() => JARVIS_SOLAR ? new Map(solarNodes(buildModel(state, loadLayout().hidden, loadBotOrder())).map(node => [node.id, node])) : new Map(), [state]);

  // The chord fires from anywhere — a modifier chord never collides with typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k" && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (openRequest) setOpen(true);
  }, [openRequest]);

  // fresh palette every open; stale queries from last time would flash
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setMessageHits([]);
    setCursor(0);
  }, [open]);

  useEffect(() => {
    onOpenChange?.(open);
  }, [onOpenChange, open]);

  const q = query.trim().toLowerCase();

  // Names answer instantly from local state, transcript hits arrive a beat
  // later, and a stale response for an outdated query is dropped.
  useEffect(() => {
    if (!open || !q) {
      setMessageHits([]);
      return;
    }
    setMessageHits([]);
    let alive = true;
    const timer = setTimeout(() => {
      api(`/api/search?q=${encodeURIComponent(q)}&limit=12`)
        .then((result: { hits?: SearchHit[] }) => alive && setMessageHits(result.hits ?? []))
        .catch(() => alive && setMessageHits([]));
    }, 150);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [open, q]);

  useEffect(() => setCursor(0), [q]);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "nearest" });
  }, [cursor, messageHits]);

  const close = () => setOpen(false);
  const go = (fn: () => void | Promise<void>) => async () => { close(); await fn(); };

  const groups = useMemo(() => {
    if (!open) return [];
    const matches = (...xs: Array<string | undefined>) => !q || xs.some((x) => (x ?? "").toLowerCase().includes(q));
    const visible = state.bots.filter((b) => !b.hidden && (!JARVIS_SOLAR || solar.has(b.id)));
    // Bots in team order (each team's Chief first), the way the map reads.
    const sections = buildTeamMapSections(visible, state.sections ?? []);
    // pinned bots lead, then team order (each team's Chief first)
    const inTeams = sections.flatMap((s) => [...s.chiefs, ...s.members]);
    const byTeam = [...inTeams.filter((b) => b.pinned), ...inTeams.filter((b) => !b.pinned)];
    const bots: Item[] = (q ? rankByName(visible, q) : byTeam).map((bot) => ({
      key: `bot:${bot.id}`, label: JARVIS_SOLAR ? solar.get(bot.id)?.name ?? bot.name : bot.name, botId: bot.id,
      meta: [bot.chiefOfStaff ? t("orbit.pal.chief") : bot.title, bot.section?.trim()].filter(Boolean).join(" · "),
      run: () => dispatch({ type: "select", id: bot.id }),
    }));
    // Channels first; bot⇄bot conversations stay reachable after them.
    const channels: Item[] = rankByName(state.groups, q).sort((a, b) => Number(Boolean(a.dm)) - Number(Boolean(b.dm))).map((group) => ({
      key: `room:${group.id}`, label: group.dm ? group.name : `#${group.name.replace(/^#/, "")}`, icon: group.dm ? MessageSquare : Hash,
      meta: group.dm ? t("orbit.pal.dm") : t("orbit.pal.channel"),
      run: () => dispatch({ type: "select", id: group.id }),
    }));
    // threads by title across every bot (the old sidebar search did this)
    const threads: Item[] = q ? visible.flatMap((bot) => (bot.tasks ?? [])
      .filter((task) => !task.archivedAt && task.title.toLowerCase().includes(q))
      .map((task): Item => ({
        key: `anythread:${bot.id}:${task.threadId}`, label: task.title, meta: bot.name, icon: MessageSquare,
        run: () => { dispatch({ type: "switchTask", botId: bot.id, threadId: task.threadId }); orbitNavigate({ to: "bot", id: bot.id }); },
      }))).slice(0, 8) : [];
    const messages: Item[] = q ? messageHits.map((hit) => ({
      key: `msg:${hit.threadId}:${hit.messageId}`, label: hit.name, icon: MessageSquare, hit, meta: hit.task,
      run: async () => {
        try { await landOnSearchHit(hit, state, dispatch); } catch (error) { dispatch({ type: "error", message: error instanceof Error ? error.message : String(error) }); }
      },
    })) : [];
    // The current bot (design: the focused bot's group): its recent threads,
    // every settings panel, and the Inspector — the old settings search.
    const current = state.bots.find((b) => b.id === state.selectedId && !b.hidden);
    const botItems: Item[] = current ? [
      ...orderedThreadList((current.tasks ?? []).filter((task) => !task.archivedAt)).slice(0, q ? undefined : 5).map((task): Item => ({
        key: `thread:${task.threadId}`, label: task.title, meta: t("orbit.pal.thread"), icon: MessageSquare,
        run: () => { dispatch({ type: "switchTask", botId: current.id, threadId: task.threadId }); orbitNavigate({ to: "bot", id: current.id }); },
      })),
      ...(remoteClient ? [] : BOT_PALETTE_PANELS).map((panel): Item => ({
        key: `panel:${panel}`, label: t(PANEL_KICKER[panel]), meta: t("orbit.pal.botSettings", { name: current.name }), icon: PANEL_ICON[panel],
        run: () => orbitNavigate({ to: "bot", id: current.id, panel }),
      })),
      ...(remoteClient ? [] : [{ key: "inspector", label: t("chat.inspector"), meta: current.name, icon: Bug, run: () => { orbitNavigate({ to: "bot", id: current.id }); dispatch({ type: "toggleInspector", open: true }); } }]),
    ].filter((x) => matches(x.label, x.meta)) : [];
    const available = new Set(appSections.map((s) => s.id));
    const settings: Item[] = [
      ...(!JARVIS_SOLAR ? [{ key: "welcome", label: t("orbit.pal.replay"), meta: t("orbit.pal.onboarding"), icon: Sparkles, run: () => dispatch({ type: "toggleWelcome", open: true }) }] : []),
      { key: "shortcuts", label: t("orbit.pal.shortcuts"), meta: t("orbit.pal.app"), icon: Keyboard, run: () => dispatch({ type: "toggleShortcuts", open: true }) },
      ...(window.ogb?.updater ? [{ key: "updates", label: t("orbit.pal.updates"), meta: t("orbit.pal.appOnly"), icon: RefreshCw, run: () => void window.ogb?.updater?.check() }] : []),
      { key: "about", label: t("orbit.pal.about", { app: brand().name }), meta: t("orbit.pal.appOnly"), icon: Info, run: () => orbitNavigate({ to: "about" }) },
      ...YOU_HUB.filter((h) => (h.section ? available.has(h.section) : !remoteClient)).map((h): Item => ({
        key: `you:${h.key}`, label: t(YOU_TITLE[h.key] as never), meta: t("orbit.you"), icon: h.icon, run: () => orbitNavigate({ to: "you", panel: h.key }),
        keywords: appSections.find((entry) => entry.id === h.section)?.keywords,
      })),
      // every settings section this client has, by its own name
      ...appSections.filter((entry) => !YOU_HUB.some((h) => h.section === entry.id)).map((entry): Item => ({
        key: `settings:${entry.id}`, label: t(entry.labelKey), meta: t("orbit.pal.settingsSection"), icon: entry.icon, keywords: entry.keywords,
        run: () => { orbitNavigate({ to: "you" }); dispatch({ type: "toggleAppSettings", open: true, section: entry.id }); },
      })),
      ...sections.filter((s) => s.key).map((s): Item => ({
        key: `team:${s.key}`, label: t("orbit.pal.team", { team: s.name }), meta: t("orbit.pal.teamSettings"), icon: Users, run: () => orbitNavigate({ to: "team", key: s.key }),
      })),
    ].filter((x) => matches(x.label, x.meta, ...(x.keywords ?? [])));
    const actions: Item[] = [
      ...(!remoteClient ? [{ key: "new", label: t("orbit.empty.newBot"), icon: Plus, run: () => orbitNavigate({ to: "new" }) }] : []),
      ...(!remoteClient ? [{ key: "install", label: t("orbit.pal.install"), icon: FileDown, run: () => orbitNavigate({ to: "library" }) }] : []),
      ...(!remoteClient ? [{ key: "newTeam", label: t("team.create"), icon: Users, run: () => orbitNavigate({ to: "newTeam" }) }] : []),
      { key: "fit", label: t(JARVIS_SOLAR ? "jarvis.solar.fit" : "orbit.pal.fit"), icon: Scan, run: () => orbitNavigate({ to: "fit" }) },
      ...(!remoteClient && state.bots.some((b) => b.hidden) ? [{ key: "archived", label: t("orbit.hub.archived"), meta: t("orbit.hub.archivedCount", { count: state.bots.filter((b) => b.hidden).length }), icon: Archive, run: () => orbitNavigate({ to: "archived" }) }] : []),
    ].filter((x) => matches(x.label));
    return [
      ...(current ? [{ title: current.name.toUpperCase(), items: botItems }] : []),
      { title: t("orbit.pal.bots"), items: bots },
      { title: t("orbit.pal.channels"), items: channels },
      { title: t("orbit.pal.threads"), items: threads.filter((x) => !botItems.some((b) => b.key === `thread:${x.key.split(":")[2]}`)) },
      { title: t("orbit.pal.messages"), items: messages },
      { title: t("orbit.pal.settings"), items: settings },
      { title: t("orbit.pal.actions"), items: actions },
    ].filter((g) => g.items.length);
  }, [open, q, state, messageHits, appSections, remoteClient, dispatch, solar]);

  if (!open) return null;
  const flat = groups.flatMap((g) => g.items);
  // hits arriving or rows filtering away can strand the cursor past the end
  const selected = flat.length ? Math.min(cursor, flat.length - 1) : 0;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      // shield the window listeners other modals hang their own Esc on
      e.stopPropagation();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor(flat.length ? (selected + 1) % flat.length : 0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor(flat.length ? (selected - 1 + flat.length) % flat.length : 0);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[selected];
      if (item) void go(item.run)();
    }
  };

  let index = -1;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-6 pt-[14vh]"
      onMouseDown={(e) => e.target === e.currentTarget && close()} onKeyDown={onKeyDown}>
      <div role="dialog" aria-modal="true" aria-label={t("orbit.pal.aria")}
        className="flex max-h-[min(540px,76vh)] w-full max-w-[560px] flex-col overflow-hidden rounded-[14px] border border-ink/[0.12] bg-[color-mix(in_srgb,var(--color-panel)_96%,transparent)] shadow-[0_30px_70px_rgba(0,0,0,.6)] backdrop-blur-[12px] animate-pop-in">
        <div className="flex items-center gap-3 border-b border-ink/[0.08] px-4 py-3">
          <Search size={16} className="shrink-0 text-ink/60" />
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("orbit.pal.placeholder")} aria-label={t("orbit.pal.placeholder")}
            className="w-full bg-transparent text-[14.5px] text-ink placeholder:text-ink/45 focus:outline-none" />
          <span className="shrink-0 font-mono text-[11px] text-ink/45">esc</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-1.5">
          {flat.length === 0 && (
            <div className="px-3 py-6 text-center text-[13px] text-ink/60">
              {q ? t("orbit.pal.none", { query }) : t("orbit.pal.empty")}
            </div>
          )}
          {groups.map((g) => (
            <div key={g.title} className="flex flex-col">
              <span className="px-2.5 pb-1 pt-2 font-mono text-[10px] tracking-[0.1em] text-ink/50">{g.title}</span>
              {g.items.map((item) => {
                const i = ++index;
                const Icon = item.icon;
                const hit = item.hit;
                return (
                  <button key={item.key} type="button" ref={i === selected ? selectedRef : undefined} onClick={() => void go(item.run)()}
                    // mousemove, not mouseenter: rows shifting under a resting
                    // pointer (hits arriving) must not steal the selection
                    onMouseMove={() => setCursor(i)}
                    className={cn("flex w-full items-center gap-3 rounded-[10px] px-2.5 py-2 text-left", hit && "flex-col items-stretch gap-0.5", i === selected ? "bg-ink/[0.09]" : "hover:bg-ink/[0.05]")}>
                    {hit ? <>
                      <span className="flex items-center gap-2 truncate text-[13px] font-medium text-ink">
                        <MessageSquare size={13} className="shrink-0 text-ink/60" />
                        {hit.name}
                        {hit.task ? <span className="font-normal text-ink/60"> · {hit.task}</span> : null}
                      </span>
                      <span className="line-clamp-2 text-[12.5px] text-ink/60">
                        {hit.snippet.slice(0, hit.matchStart)}<mark className="rounded-sm bg-ink/[0.08] px-0.5 text-ink">{hit.snippet.slice(hit.matchStart, hit.matchStart + hit.matchLength)}</mark>{hit.snippet.slice(hit.matchStart + hit.matchLength)}
                      </span>
                    </> : <>
                      {item.botId ? JARVIS_SOLAR ? <span className="size-[26px] shrink-0"><SolarPlanet kind={solar.get(item.botId)?.kind ?? 'moon'} skin={solar.get(item.botId)?.kind === 'moon' ? solar.get(item.botId)?.moonSkin : solar.get(item.botId)?.skin} /></span> : <BotFace id={item.botId} size={26} /> : Icon ? <span className="flex size-[26px] shrink-0 items-center justify-center"><Icon size={15} className="text-ink/60" /></span> : null}
                      <span className="min-w-0 flex-1 truncate text-[14px] text-ink">{item.label}</span>
                      {item.meta && <span className="shrink-0 truncate text-[12.5px] text-ink/55">{item.meta}</span>}
                    </>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 border-t border-ink/[0.08] px-4 py-2 text-[11.5px] text-ink/55">
          <span>{t("orbit.pal.move")}</span><span>{t("orbit.pal.open")}</span><span>{t("orbit.pal.close")}</span>
        </div>
      </div>
    </div>
  );
}
