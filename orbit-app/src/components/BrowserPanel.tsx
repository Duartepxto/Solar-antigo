import { useCallback, useEffect, useRef, useState } from "react";
import { t } from "@/lib/i18n";
import { ArrowLeft, ArrowRight, EllipsisVertical, Globe, Hand, Loader2, Maximize2, Plus, RotateCw, UserRound, X } from "lucide-react";
import { browserUnavailableReason } from "@/lib/feature-flags";
import { api, useStore, type Bot } from "@/state/store";
import { BrowserProfilesManager } from "./BrowserProfilesManager";
import { BrowserViewport, type BrowserFrame } from "./BrowserViewport";
import { createBrowserInputQueue } from "@/lib/browser-input-queue";

interface BrowserTab { tabId: string; title: string; url: string; active: boolean }
type ViewerFrame = BrowserFrame & { viewerId: string; generation: number };
const button = "rounded-md p-1.5 text-ink/55 hover:bg-ink/[0.04] hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed";
const RECONNECT_DELAYS = [1_000, 2_000, 4_000, 8_000, 15_000];
const RECONNECT_MESSAGE = "Connection interrupted. Reconnecting the browser view…";

/** Closing a panel releases its lease. A new connection never silently
 * restores permission to type, and never replays old browser frames. */
export function LiveBrowser({ bot }: { bot: Bot }) {
  const { state } = useStore();
  const [attempt, setAttempt] = useState(0);
  const [frame, setFrame] = useState<ViewerFrame | null>(null);
  const [tabs, setTabs] = useState<BrowserTab[]>([]);
  const [address, setAddress] = useState("");
  const [connected, setConnected] = useState(false);
  const [control, setControl] = useState({ held: false, controlling: false, owned: false });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [showProfiles, setShowProfiles] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [viewport, setViewport] = useState({ width: 1280, height: 720 });
  const viewer = useRef("");
  const generation = useRef(0);
  const pendingOperation = useRef<number | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const addressInput = useRef<HTMLInputElement>(null);
  const profilesDialog = useRef<HTMLDialogElement>(null);
  const typingDialog = useRef<HTMLDialogElement>(null);
  const inputQueue = useRef<ReturnType<typeof createBrowserInputQueue> | null>(null);
  const haltMessage = useRef("");
  const urlEditing = useRef(false);
  const reconnectCount = useRef(0);
  const connectionProfile = useRef("");
  const profileName = bot.browserProfile === "guest" ? "Temporary browser"
    : state.config?.browserProfiles?.find((profile) => profile.id === bot.browserProfile)?.name ?? `${bot.name}’s own browser`;
  useEffect(() => { if (showProfiles) profilesDialog.current?.showModal(); else profilesDialog.current?.close(); }, [showProfiles]);
  useEffect(() => { if (showTyping) typingDialog.current?.showModal(); else typingDialog.current?.close(); }, [showTyping]);

  const action = useCallback(async (body: Record<string, unknown>, expected = viewer.current) => {
    if (!expected) throw new Error("Open the browser connection first.");
    // 120s matches the server's browser requestTimeoutMs: restart replies can
    // be legitimately slow (see the reconnect note in the stream error
    // handler), but a wedged request must surface an error instead of
    // leaving the panel pending forever.
    return api(`/api/bots/${encodeURIComponent(bot.id)}/browser/action`, { method: "POST", body: JSON.stringify({ ...body, viewerId: expected }), timeoutMs: 120_000 });
  }, [bot.id]);
  const input = useCallback((body: Record<string, unknown>) => {
    inputQueue.current?.enqueue(body);
  }, []);
  const reconnect = useCallback(() => {
    // Invalidate synchronously: an old request may finish before React runs
    // the effect cleanup for this reconnect.
    generation.current++;
    reconnectCount.current = 0;
    viewer.current = "";
    inputQueue.current?.clear(); inputQueue.current = null;
    pendingOperation.current = null;
    setAttempt((value) => value + 1);
  }, []);

  useEffect(() => {
    const current = ++generation.current;
    const ownsConnection = () => generation.current === current;
    const profile = JSON.stringify([bot.id, bot.browserProfile]);
    if (connectionProfile.current !== profile) {
      connectionProfile.current = profile;
      reconnectCount.current = 0;
    }
    let stopped = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    viewer.current = ""; pendingOperation.current = null; haltMessage.current = "";
    urlEditing.current = false;
    setFrame(null); setTabs([]); setAddress(""); setConnected(false); setError("");
    setControl({ held: false, controlling: false, owned: false }); setPending(false);
    const source = new EventSource(`/api/bots/${encodeURIComponent(bot.id)}/browser/live`);
    const listen = (name: string, handler: (data: any) => void) => source.addEventListener(name, (event) => {
      if (stopped || !ownsConnection()) return;
      try { handler(JSON.parse((event as MessageEvent).data)); } catch { /* Malformed events are not rendered. */ }
    });
    listen("ready", (data) => {
      if (typeof data.viewerId !== "string" || !data.viewerId) return;
      const expected = data.viewerId;
      viewer.current = expected;
      inputQueue.current = createBrowserInputQueue(async (body) => {
        if (ownsConnection() && viewer.current === expected) await action(body, expected);
      }, (cause) => {
        if (!ownsConnection() || viewer.current !== expected) return;
        haltMessage.current = cause instanceof Error ? cause.message : String(cause);
        setError(haltMessage.current);
      });
      setConnected(true);
    });
    // A ready event alone is not recovery: a flapping stream can open and
    // fail immediately. Reset the retry budget only after a live heartbeat.
    listen("heartbeat", () => { reconnectCount.current = 0; });
    listen("frame", (data) => { if (viewer.current) setFrame({ ...data, viewerId: viewer.current, generation: current }); });
    listen("tabs", (data) => {
      if (!Array.isArray(data.tabs)) return;
      setTabs(data.tabs);
      const active = data.tabs.find((tab: BrowserTab) => tab.active);
      if (active && !urlEditing.current) setAddress(active.url === "about:blank" ? "" : active.url);
    });
    listen("url", (data) => { if (typeof data.url === "string" && !urlEditing.current) setAddress(data.url === "about:blank" ? "" : data.url); });
    listen("status", (data) => {
      if (data.viewportWidth > 0 && data.viewportHeight > 0) setViewport({ width: data.viewportWidth, height: data.viewportHeight });
    });
    listen("control", (data) => {
      setControl(data);
      if (data.held && !data.controlling) { setFrame(null); setTabs([]); setAddress(""); }
    });
    source.addEventListener("error", (event) => {
      // A closed source may still deliver its queued error after a profile
      // switch or reconnect. It must not clear the replacement viewer/input.
      if (stopped || !ownsConnection()) return;
      stopped = true;
      let message = "Browser connection ended. Reconnect to continue watching.";
      let retryable = !(event instanceof MessageEvent);
      if (event instanceof MessageEvent) {
        try {
          const data = JSON.parse(event.data);
          message = data.message || message;
          retryable = data.retryable === true;
        } catch { /* Malformed server errors require explicit reconnect. */ }
      }
      const delay = retryable ? RECONNECT_DELAYS[reconnectCount.current] : undefined;
      if (delay !== undefined) {
        reconnectCount.current++;
        message = RECONNECT_MESSAGE;
        reconnectTimer = setTimeout(() => {
          if (!ownsConnection()) return;
          // Reopen observation only, not browser commands or a human lease.
          generation.current++;
          setAttempt((value) => value + 1);
        }, delay);
      }
      setError(message); setConnected(false); setFrame(null); setControl({ held: false, controlling: false, owned: false });
      // Keep this generation alive: a successful restart closes its stream
      // before the action reply arrives, and must still reconnect afterward.
      viewer.current = ""; inputQueue.current?.clear(); inputQueue.current = null; source.close();
    });
    return () => {
      stopped = true;
      clearTimeout(reconnectTimer);
      if (ownsConnection()) {
        generation.current++; viewer.current = ""; pendingOperation.current = null;
        inputQueue.current?.clear(); inputQueue.current = null;
      }
      source.close();
    };
  }, [bot.id, bot.browserProfile, attempt, action]);

  const execute = async (body: Record<string, unknown>) => {
    if (pendingOperation.current !== null) return;
    const expected = viewer.current;
    const current = generation.current;
    const queue = inputQueue.current;
    pendingOperation.current = current;
    setPending(true); setError("");
    try {
      await queue?.drain();
      if (generation.current !== current || viewer.current !== expected) return;
      await action(body, expected);
      // A halted queue silently drops input; restore the banner the
      // setError("") above cleared so the view does not look interactive.
      if (inputQueue.current?.stopped() && generation.current === current) setError(haltMessage.current);
      if (generation.current === current && body.type === "restart") reconnect();
    }
    catch (cause) { if (generation.current === current) setError(cause instanceof Error ? cause.message : String(cause)); }
    finally {
      if (generation.current === current && pendingOperation.current === current) {
        pendingOperation.current = null; setPending(false);
      }
    }
  };
  const driving = control.controlling && connected && !pending;
  const reconnecting = error === RECONNECT_MESSAGE;
  return <div ref={panel} className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-ink/[0.1] bg-ink/[0.03] text-ink">
    <div className="flex min-h-12 items-center gap-1 px-2 pt-1.5">
      <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
        {tabs.length ? tabs.map((tab) => <div key={tab.tabId} className={`flex max-w-52 shrink-0 items-center gap-1 rounded-xl px-1 text-[12px] ${tab.active ? "bg-ink/[0.04] text-ink" : "text-ink/55"}`}>
          <Globe size={13} className="ml-1.5 shrink-0 opacity-60" />
          <button className="truncate px-1 py-2 text-left disabled:cursor-default" disabled={!driving} onClick={() => void execute({ type: "tab-select", tabId: tab.tabId })} title={tab.title || tab.url}>{tab.title || "New tab"}</button>
          <button className={button} aria-label={`Close ${tab.title || "tab"}`} disabled={!driving} onClick={() => void execute({ type: "tab-close", tabId: tab.tabId })}><X size={13} /></button>
        </div>) : <div className="flex items-center gap-2 rounded-xl bg-ink/[0.04] px-3 py-2 text-[12px] text-ink/55"><Globe size={13} />{t("browser.ui.newTab")}</div>}
        <button className={`${button} shrink-0`} disabled={!driving} aria-label={t("browser.ui.newTab")} title={t("browser.ui.newTab")} onClick={() => void execute({ type: "tab-new" })}><Plus size={17} /></button>
      </div>
      <button className={button} title={t("browser.ui.fullScreen")} aria-label={t("browser.ui.fullScreen")} onClick={() => { void panel.current?.requestFullscreen().catch(() => setError(t("browser.ui.fullScreenIsUnavailableInThis"))); }}><Maximize2 size={16} /></button>
      <button className={`${button} rounded-xl bg-ink/[0.04] p-2`} title={`Browser profile: ${profileName}`} aria-label={t("browser.ui.browserProfiles")} aria-expanded={showProfiles} onClick={() => setShowProfiles(true)}><UserRound size={16} /></button>
    </div>
    <form className="flex h-12 items-center gap-1 border-b border-ink/[0.1] px-2" onSubmit={(e) => { e.preventDefault(); if (driving && address.trim()) void execute({ type: "navigate", url: /^https?:\/\//i.test(address.trim()) ? address.trim() : `https://${address.trim()}` }); }}>
      <div className="flex shrink-0 items-center">
        <button type="button" className={button} disabled={!driving} aria-label={t("browser.ui.back")} onClick={() => void execute({ type: "back" })}><ArrowLeft size={17} /></button>
        <button type="button" className={button} disabled={!driving} aria-label={t("browser.ui.forward")} onClick={() => void execute({ type: "forward" })}><ArrowRight size={17} /></button>
        <button type="button" className={button} disabled={!driving} aria-label={t("browser.ui.reloadPage")} onClick={() => void execute({ type: "reload" })}><RotateCw size={17} /></button>
      </div>
      <input ref={addressInput} aria-label={t("browser.ui.browserAddress")} readOnly={!driving} value={address} onChange={(e) => setAddress(e.target.value)} onFocus={(e) => { urlEditing.current = true; if (driving) e.target.select(); }} onBlur={() => { urlEditing.current = false; }} placeholder={connected ? "about:blank" : "Connecting…"} spellCheck={false} className="mx-1 min-w-0 flex-1 rounded-lg bg-transparent px-2 py-1.5 text-center text-[12px] outline-none placeholder:text-ink/55 focus:bg-ink/[0.04] focus:text-left" />
      <button type="button" disabled={!connected || pending || (control.held && !control.owned)} onClick={() => void execute({ type: control.owned ? "release" : "take" })} title={control.owned ? "Return to bot — browser tools are paused while you control this profile" : control.held ? "This profile is controlled in another window" : "Take control to click, type, or sign in"} aria-label={control.owned ? "Return to bot" : "Take control"} aria-pressed={control.owned} className={`${button} flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px] sm:text-[12px] ${control.owned ? "bg-ink/[0.08] text-ink" : ""}`}>
        {pending ? <Loader2 size={16} className="animate-spin" /> : <Hand size={16} className="hidden sm:block" />}
        <span>{control.owned ? "Return to bot" : "Take control"}</span>
      </button>
      <details className="relative shrink-0">
        <summary className={`${button} list-none cursor-pointer [&::-webkit-details-marker]:hidden`} aria-label={t("browser.ui.browserMenu")} title={t("browser.ui.browserMenu")}><EllipsisVertical size={17} /></summary>
        <div className="absolute right-0 top-full z-20 mt-2 flex w-44 flex-col rounded-xl border border-ink/[0.1] bg-panel p-1.5 text-[12px] shadow-xl">
          <button type="button" className="rounded-md px-3 py-2 text-left hover:bg-ink/[0.04] disabled:opacity-40" disabled={!driving} onClick={(e) => { e.currentTarget.closest("details")?.removeAttribute("open"); setShowTyping(true); }}>{t("browser.ui.typeOrPasteText")}</button>
          <button type="button" className="rounded-md px-3 py-2 text-left hover:bg-ink/[0.04]" onClick={(e) => { e.currentTarget.closest("details")?.removeAttribute("open"); reconnect(); }}>{t("browser.ui.reconnectView")}</button>
          <button type="button" className="rounded-md px-3 py-2 text-left hover:bg-ink/[0.04] disabled:opacity-40" disabled={!connected || pending} onClick={(e) => {
            e.currentTarget.closest("details")?.removeAttribute("open");
            if (!window.confirm("Restart this profile’s browser? Open tabs will close. Saved logins are kept. Stop any bots using it first.")) return;
            void execute({ type: "restart" });
          }}>{t("browser.ui.restartBrowser")}</button>
        </div>
      </details>
    </form>
    {error && <div role={reconnecting ? "status" : "alert"} className={`flex items-center justify-between gap-2 border-b border-ink/[0.1] px-3 py-2 text-[12px] ${reconnecting ? "text-ink/55" : "text-[#ff8a96]"}`}><span>{error}</span>{!connected && <button className="shrink-0 underline" onClick={reconnect}>{t("browser.ui.reconnect")}</button>}</div>}
    <div className="min-h-0 flex-1 overflow-hidden bg-ink/[0.04]">
      {frame ? <BrowserViewport frame={frame} {...viewport} driving={driving} input={input}
        onReturnToToolbar={() => addressInput.current?.focus()}
        acknowledge={(seq) => { if (generation.current === frame.generation && viewer.current === frame.viewerId) void action({ type: "ack", seq }, frame.viewerId).catch(() => {}); }}
        onDecodeError={() => { if (generation.current === frame.generation && viewer.current === frame.viewerId) setError(t("browser.ui.aBrowserFrameCouldNotBe")); }} />
        : <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center text-[13px] text-ink/55">{connected && control.held ? <Hand size={24} /> : error && !reconnecting ? <Globe size={24} /> : <Loader2 size={24} className="animate-spin" />}<span>{control.held ? "Live view paused for human control" : reconnecting ? "Reconnecting…" : error ? "Browser disconnected" : "Opening the live browser…"}</span></div>}
    </div>
    <dialog ref={profilesDialog} onClose={() => setShowProfiles(false)} onClick={(e) => { if (e.target === e.currentTarget) setShowProfiles(false); }} className="m-auto w-[min(420px,calc(100%-32px))] max-h-[80vh] overflow-auto rounded-[14px] border border-ink/[0.1] bg-panel p-5 text-ink shadow-[0_20px_50px_rgba(0,0,0,.55)] backdrop:bg-black/40">
      <div className="mb-4 flex items-center justify-between"><h2 className="text-[15px] font-medium">{t("browser.ui.browserProfiles")}</h2><button className={button} aria-label={t("browser.ui.closeBrowserProfiles")} onClick={() => setShowProfiles(false)}><X size={16} /></button></div>
      <BrowserProfilesManager bot={bot} disabled={pending || control.held} onProfileChanged={() => { setShowProfiles(false); reconnect(); }} />
    </dialog>
    <dialog ref={typingDialog} onClose={() => setShowTyping(false)} className="m-auto w-[min(420px,calc(100%-32px))] rounded-[14px] border border-ink/[0.1] bg-panel p-5 text-ink shadow-[0_20px_50px_rgba(0,0,0,.55)] backdrop:bg-black/40">
      <div className="mb-3 flex items-center justify-between"><h2 className="text-[14px] font-medium">{t("browser.ui.typeIntoTheSelectedPageField")}</h2><button className={button} aria-label={t("browser.ui.closeTyping")} onClick={() => setShowTyping(false)}><X size={16} /></button></div>
      <form className="flex flex-col gap-3" onSubmit={(e) => {
      e.preventDefault(); const field = e.currentTarget.elements.namedItem("pageText") as HTMLInputElement;
      if (driving && field.value) { input({ type: "input_keyboard", eventType: "char", text: field.value }); field.value = ""; setShowTyping(false); }
    }}><input name="pageText" aria-label={t("browser.ui.textForThePage")} autoComplete="off" maxLength={4096} placeholder={t("browser.ui.typeOrPasteText2")} className="rounded-lg bg-ink/[0.04] px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-ink/40" /><button disabled={!driving} className="self-end rounded-lg bg-ink px-4 py-2 text-[12px] text-app disabled:opacity-40">{t("browser.ui.type")}</button></form>
    </dialog>
  </div>;
}

export function BrowserPanel({ bot }: { bot: Bot }) {
  const { state } = useStore();
  const engine = state.config?.browserEngine;
  const [requested, setRequested] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [admin, setAdmin] = useState<boolean | null>(null);
  useEffect(() => { let active = true; void api("/api/auth/session").then((session) => { if (active) setAdmin(session.scopes.includes("admin")); }).catch(() => { if (active) setAdmin(false); }); return () => { active = false; }; }, []);
  const installing = requested || engine?.installing === true;
  const install = async () => {
    setError(null); setRequested(true);
    try { await api("/api/browser-engine/install", { method: "POST" }); }
    catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); }
    finally { setRequested(false); }
  };
  if (admin === false) return <div className="p-5 text-[13px] text-ink/55">{t("browser.ui.onlyWorkspaceAdministratorsCanViewOr")}</div>;
  if (bot.browser === false) return <div className="p-5 text-[13px] text-ink/55">{t("browser.ui.enableTheBrowserInThisBot")}</div>;
  if (engine?.kind === "engine" && !installing && !engine.installError) return admin === null
    ? <div className="p-5 text-[13px] text-ink/55">{t("browser.ui.loadingBrowser")}</div>
    : <LiveBrowser key={bot.id} bot={bot} />;
  return <div className="flex min-h-0 flex-1 flex-col items-start justify-center gap-3 rounded-xl bg-ink/[0.03] p-5">
    <div className="text-[15px] font-medium text-ink">{engine?.kind === "engine" ? "Browser installation incomplete" : "Browser engine not installed"}</div>
    <p className="text-[13px] leading-relaxed text-ink/55">{engine?.kind === "engine" ? "agent-browser is installed, but Chrome setup has not finished. Retry the browser installation." : browserUnavailableReason(state.config)}</p>
    {engine?.installable || engine?.kind === "engine" ? <button type="button" onClick={() => void install()} disabled={installing || admin !== true} className="rounded-lg bg-ink px-3 py-1.5 text-[13px] font-medium text-app disabled:opacity-60">{installing ? "Installing… (a one-time download of about 160 MB)" : engine?.kind === "engine" ? "Retry browser installation" : "Install the browser engine"}</button> : null}
    {(engine?.installError || error) && <p role="alert" className="text-[12px] text-[#ff8a96]">{error ?? engine?.installError}</p>}
  </div>;
}
