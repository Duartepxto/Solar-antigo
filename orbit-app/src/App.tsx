import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Box } from "lucide-react";
import { openNotificationTarget, StoreProvider, useStore } from "@/state/store";
import { useWelcomeViewer, WelcomeGate } from "@/components/onboarding/WelcomeGate";
import { spotlightsQuiet } from "@/lib/onboarding";
import { FirstConversationTour } from "@/components/onboarding/FirstConversationTour";
import { GuidedTour } from "@/components/onboarding/GuidedTour";
import { ThreadRefsProvider } from "@/components/ThreadRefs";
import { WorkspaceBackupRecovery } from "@/components/WorkspaceBackupSettings";
import { UpdateBanner } from "@/components/UpdateBanner";
import { DesktopCapabilitiesProvider, useDesktopCapabilities } from "@/components/DesktopCapabilities";
import { WindowCaptionButtons } from "@/components/WindowCaptionButtons";
import { CommandPalette } from "@/components/CommandPalette";
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcutsModal";
import { setLocale, setSystemLocale } from "@/lib/i18n";
import { shouldOpenKeyboardShortcuts } from "@/lib/keyboard-shortcuts";
import { OrbitShell } from "@/orbit/OrbitShell";
import { ORBIT_FOCUS_EVENT } from "@/orbit/events";
import { effectiveLanguage, useLanguageChoice } from "@/lib/language-preference";
import { t } from "@/lib/i18n";
import "@/workspace-v2/workspace-v2.css";
import { useUsageCurrencyRefresh } from '@/lib/usage-currency';

const WorkspaceV2 = lazy(() => import("@/workspace-v2/WorkspaceV2").then(module => ({ default: module.WorkspaceV2 })));
const WORKSPACE_HISTORY_BOT = "solarWorkspaceConversationBotId";

function workspaceHistoryBot(state: unknown): string | null {
  if (!state || typeof state !== "object") return null;
  const id = (state as Record<string, unknown>)[WORKSPACE_HISTORY_BOT];
  return typeof id === "string" && id ? id : null;
}

function Shell() {
  useUsageCurrencyRefresh();
  const { state, dispatch } = useStore();
  const { capabilities } = useDesktopCapabilities();
  const [workspaceV2, setWorkspaceV2] = useState(() => new URLSearchParams(window.location.search).get("workspace") === "v2");
  const pendingWorkspaceBot = useRef<string | null>(workspaceV2 ? null : workspaceHistoryBot(window.history.state));
  const switchWorkspace = (next: boolean, botId?: string) => {
    pendingWorkspaceBot.current = next ? null : botId ?? null;
    const url = new URL(window.location.href);
    if (next) url.searchParams.set("workspace", "v2");
    else url.searchParams.delete("workspace");
    // Keep other app history fields while recording the conversation that
    // belongs to this Solar entry. A normal exit still returns to the map.
    const historyState = { ...window.history.state };
    if (!next && botId) historyState[WORKSPACE_HISTORY_BOT] = botId;
    else delete historyState[WORKSPACE_HISTORY_BOT];
    window.history.pushState(historyState, "", `${url.pathname}${url.search}${url.hash}`);
    setWorkspaceV2(next);
  };
  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const next = new URLSearchParams(window.location.search).get("workspace") === "v2";
      pendingWorkspaceBot.current = next ? null : workspaceHistoryBot(event.state);
      setWorkspaceV2(next);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  useEffect(() => {
    if (workspaceV2 || !state.connected || !pendingWorkspaceBot.current) return;
    const botId = pendingWorkspaceBot.current;
    if (!state.bots.some(bot => bot.id === botId && !bot.hidden)) return;
    pendingWorkspaceBot.current = null;
    // OrbitShell deliberately ignores the first snapshot's selection. Send
    // its existing focus event after the map has mounted its listeners.
    window.dispatchEvent(new CustomEvent(ORBIT_FOCUS_EVENT, { detail: { botId } }));
  }, [workspaceV2, state.connected, state.bots]);
  const unreadCount =
    state.bots.filter((bot) => !bot.hidden && bot.unread).length +
    state.groups.filter((group) => group.unread).length;
  const remoteClient = window.ogb?.remoteClient?.active === true;
  useEffect(() => {
    if (!window.ogb?.environments) return;
    const open = (computerId?: string | null) => {
      if (computerId) {
        const target = new URL(window.location.href);
        target.searchParams.set("share-computer", computerId);
        window.history.replaceState(null, "", `${target.pathname}${target.search}${target.hash}`);
      }
      dispatch({ type: "toggleAppSettings", open: true, section: "desktopWorkspaces" });
    };
    const url = new URL(window.location.href);
    const requestedSettings = url.searchParams.get("desktop-settings");
    if (requestedSettings === "workspaces" || (requestedSettings === "organization" && window.ogb.organization && !remoteClient)) {
      url.searchParams.delete("desktop-settings");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      if (requestedSettings === "organization") dispatch({ type: "toggleAppSettings", open: true, section: "organization" });
      else open();
    }
    return window.ogb.environments.onOpenSettings?.(open);
  }, [dispatch]);
  // Apply this device's language, else the server's default, the moment
  // either changes; "" follows the system. The epoch bump re-renders
  // extracted strings — t() reads a module variable, so React needs this nudge.
  const language = effectiveLanguage(useLanguageChoice(), state.config?.language);
  const [, setLocaleEpoch] = useState(0);
  useEffect(() => {
    if (language) setLocale(language);
    else setSystemLocale(globalThis.navigator?.language);
    setLocaleEpoch((epoch) => epoch + 1);
  }, [language]);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteRequest, setPaletteRequest] = useState(0);

  // App-wide shortcuts: ⌘N new bot · ⌘1–9 jump to bot · ⌘⇧[ / ⌘⇧] prev/next · ⌘/ or ? shortcuts cheat sheet.
  // Kept deliberately small; every panel already closes on Esc.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.isComposing || state.shortcutsOpen) return;
      if (shouldOpenKeyboardShortcuts(e)) {
        e.preventDefault();
        dispatch({ type: "toggleShortcuts", open: true });
        return;
      }

      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      // pinned bots come first for ⌘1-9 and ⇧⌘[ ], as they led upstream's sidebar
      const visible = state.bots.filter((b) => !b.hidden);
      const bots = [...visible.filter((b) => b.pinned), ...visible.filter((b) => !b.pinned)];
      if (e.key === "n" && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: "toggleNewBot", open: true });
      } else if (/^[1-9]$/.test(e.key)) {
        const target = bots[Number(e.key) - 1];
        if (target) {
          e.preventDefault();
          dispatch({ type: "select", id: target.id });
        }
      } else if (e.shiftKey && (e.key === "[" || e.key === "]")) {
        const idx = bots.findIndex((b) => b.id === state.selectedId);
        const next = bots[(idx + (e.key === "]" ? 1 : -1) + bots.length) % bots.length];
        if (next) {
          e.preventDefault();
          dispatch({ type: "select", id: next.id });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.bots, state.selectedId, state.shortcutsOpen, dispatch]);

  useEffect(() => {
    window.ogb?.setUnreadCount?.(unreadCount);
  }, [unreadCount]);

  // Warm connected-account state as soon as the local server is available.
  // The modal then opens with the correct Connect/Add account buttons and
  // quietly revalidates instead of rediscovering every account from scratch.
  // The macOS app menu's Preferences… item lives in the desktop shell, so the
  // shell signals the request over the bridge (Cmd+, accelerates the item).
  // Local-shell only: remote server pages never receive the channel, and ogb
  // is absent in the browser.
  useEffect(() => {
    return window.ogb?.onOpenAppSettings?.(section => dispatch({ type: "toggleAppSettings", open: true,
      ...(section === "organization" && window.ogb?.organization && !remoteClient ? { section } : {}) }));
  }, [dispatch]);

  // "Open in Orbit" from the quick bar: fly to the thread the way a
  // notification click does.
  const routingRef = useRef(state);
  routingRef.current = state;
  useEffect(() => {
    return window.ogb?.orbitShell?.onOpenThread((target) =>
      openNotificationTarget(dispatch, target, routingRef.current));
  }, [dispatch]);

  // The viewer outlives ComputerPanel and can target any bot, so release control
  // here (always mounted) when a bot's viewer closes. release() is idempotent.
  useEffect(() => {
    return window.ogb?.desktopViewer?.onState((viewer) => {
      if (viewer.open || !viewer.contextId) return;
      const botId = viewer.contextId;
      void fetch(`/api/bots/${botId}/computer/control`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "release" }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((snap) => {
          if (snap) dispatch({ type: "computerControl", botId, held: snap.held === true, helpReason: snap.helpReason ?? null });
        })
        .catch(() => {});
      void fetch(`/api/bots/${botId}/computer/viewer-close`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      }).catch(() => {});
    });
  }, [dispatch]);

  return (
    <div className="flex h-full flex-col">
      {/* fixed-position pill, top centre — outside the layout flow */}
      <UpdateBanner />
      <div className="relative flex min-h-0 flex-1">
      {workspaceV2 ? <Suspense fallback={<div className="workspace-v2" role="status"><p className="m-auto">{t("workspaceV2.sceneLoading")}</p></div>}>
        <WorkspaceV2 windowChrome={capabilities.windowChrome} onExit={() => switchWorkspace(false)} onOpenConversation={id => {
          dispatch({ type: "select", id });
          switchWorkspace(false, id);
        }} />
      </Suspense> : <>
        <OrbitShell onSearch={() => setPaletteRequest((n) => n + 1)} paletteOpen={paletteOpen} />
        <a className="workspace-v2-entry" data-window-chrome={capabilities.windowChrome} href="?workspace=v2" onClick={event => {
          event.preventDefault();
          switchWorkspace(true);
        }} aria-label={t("workspaceV2.enter")} title={t("workspaceV2.enter")}><Box size={16} aria-hidden="true" /><span>{t("workspaceV2.entryLabel")}</span></a>
      </>}
      {/* The Local VM workspace takes the bot's stage (OrbitShell). */}
      {/* The panels below are siblings, so their keys must differ even
          though each is remounted per bot. Two siblings keyed `bot.id`
          collide in React's keyed reconciliation whenever both are open
          (Computer panel, then the usage chip): every re-render mounts a
          fresh settings panel and never removes the previous one, so the
          panels pile up and Close stops working. */}
      {/* Bot and app settings open in Orbit's column (OrbitShell). */}
      {/* The Computer panel and the Inspector open in the bot's column (OrbitShell). */}
      {state.shortcutsOpen && (
        <KeyboardShortcutsModal
          open={state.shortcutsOpen}
          onClose={() => dispatch({ type: "toggleShortcuts", open: false })}
        />
      )}
      {/* mounted after the modals: same z-50 tier, so DOM order keeps the
          palette on top when one of them is open underneath */}
      <CommandPalette onOpenChange={setPaletteOpen} openRequest={paletteRequest} />
      </div>
      {/* Renderer-drawn caption buttons for the overlay-less frameless
          Windows window. Deliberately the LAST child of the shell: Blink
          resolves -webkit-app-region in DOM-walk order, so these no-drag
          buttons must come after every drag-region header to actually
          subtract from it — earlier placement let the header's drag region
          swallow the buttons (dead clicks, no hover). z-40 keeps true
          modals (z-50, later in DOM) painting above the buttons. */}
      <WindowCaptionButtons
        visible={capabilities.windowChrome === "win-caption" && Boolean(window.ogb?.windowControls)}
      />
    </div>
  );
}

function Application() {
  useEffect(() => {
  }, []);
  const viewer = useWelcomeViewer();
  return (
    <DesktopCapabilitiesProvider>
      <StoreProvider>
        <ThreadRefsProvider>
          <Shell />
        </ThreadRefsProvider>
        <WelcomeGate viewer={viewer} />
        <GuidedTour />
        <FirstConversationTour quiet={spotlightsQuiet(viewer)} />
      </StoreProvider>
    </DesktopCapabilitiesProvider>
  );
}

export default function App() {
  return <WorkspaceBackupRecovery><Application /></WorkspaceBackupRecovery>;
}
