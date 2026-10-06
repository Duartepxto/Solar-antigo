// The Orbit assistant's desktop shell, macOS and Windows (docs/design/orbit-agent.md,
// track B): global hotkeys, the menu-bar icon, the quick bar, the talking corner
// character, and a click-through overlay per display for the "can see"
// border and the guide pointer.
//
// Window mechanics follow the ideas in Cherry Studio's quick assistant
// (read, not copied: it is AGPL): one hidden `panel` window per surface,
// kept once made, always-on-top re-applied on every show, visible on every
// Space including full-screen ones, and focus handed back to the app the
// person was in when it hides. The quick bar is made at startup (it must
// open instantly); the overlays on first need. The talk window is talk
// mode's island in the notch: made on the first ⌥T, shown only while a talk
// runs and hidden once it is back at rest. It shows nothing else (no team
// status, no hover peek: the owner's call, 2026-09-30).
//
// Windows (10/11) runs the same shell with its own window mechanics: no
// `panel` type, no Spaces, no app.hide(), no TCC permissions, and the
// notification-area icon the app already has carries the shell's menu. Talk
// mode needs the macOS speech helper, so Windows has no talk hotkey, no mic
// button, no talk summon and so no island until it has a voice engine.
//
// Electron is injected so the module loads (and is tested) under plain Node.
import path from "node:path";
import { captureDisplay, clearCaptureDir, serialized } from "./orbit-capture.mjs";
import { HOTKEY_IDS, normalizeAccelerator, prefsFile, readPrefs, writePrefs } from "./orbit-shell-prefs.mjs";

export const QUICK_WIDTH = 760;
export const QUICK_MIN_HEIGHT = 64;
export const QUICK_MAX_HEIGHT = 520;
// The window the island is drawn in, as large as it grows (Coucou's panel,
// 720 × 320: the 640-pt expanded island plus room for its shadow).
export const TALK_SIZE = { width: 720, height: 320 };
export const SIDE_TALK_SIZE = { width: 340, height: 460 };
// Platforms the floating shell runs on (Linux keeps the app window only).
const SHELL_PLATFORMS = new Set(["darwin", "win32"]);
// Platforms with speech recognition: macOS helper and Solar's local Whisper.
const VOICE_PLATFORMS = new Set(["darwin", "win32"]);

export function shellSupported(platform) {
  return SHELL_PLATFORMS.has(platform);
}

export function voiceSupported(platform) {
  return VOICE_PLATFORMS.has(platform);
}

/** The hotkeys a platform registers: no talk without a voice engine. */
export function hotkeyIdsFor(platform) {
  return voiceSupported(platform) ? [...HOTKEY_IDS] : HOTKEY_IDS.filter((id) => id !== "talk");
}

/** The display a point is on: the one containing it, else the nearest
 * (the pointer can sit on a display's far edge, outside every rect). */
export function displayAt(displays, point) {
  if (!point || !displays?.length) return null;
  let best = null;
  let bestDistance = Infinity;
  for (const display of displays) {
    const { x, y, width, height } = display.bounds;
    const dx = Math.max(x - point.x, 0, point.x - (x + width - 1));
    const dy = Math.max(y - point.y, 0, point.y - (y + height - 1));
    const distance = dx * dx + dy * dy;
    if (distance === 0) return display;
    if (distance < bestDistance) {
      best = display;
      bestDistance = distance;
    }
  }
  return best;
}

// Coucou's pollFrame: the island's rect grown by 6 pt counts as over it.
export const ISLAND_HOVER_INSET = 6;
// While talk is on screen the pointer is watched fast only near the top
// edge (Coucou polls at 60 Hz); elsewhere a few times a second.
export const POINTER_NEAR_MS = 16;
export const POINTER_FAR_MS = 250;
export const POINTER_NEAR_TOP = 80;

/** Where the island is on screen, as the page last reported its size,
 * grown by 6 pt: the island is centred in its window and hangs from its
 * top. null until the page has said how big it is. */
export function islandHoverRect(windowBounds, size, inset = ISLAND_HOVER_INSET, side = false) {
  if (!windowBounds || !size || !(size.width > 0) || !(size.height > 0)) return null;
  return {
    x: windowBounds.x + (side ? windowBounds.width - size.width - 16 : (windowBounds.width - size.width) / 2) - inset,
    y: windowBounds.y + (side ? (windowBounds.height - size.height) / 2 : 0) - inset,
    width: size.width + 2 * inset,
    height: size.height + 2 * inset,
  };
}

export function pointInRect(point, rect) {
  return Boolean(point && rect)
    && point.x >= rect.x && point.x <= rect.x + rect.width
    && point.y >= rect.y && point.y <= rect.y + rect.height;
}

/** How soon to look at the pointer again: fast while it is near the top of
 * its display (or over / just under the open island), slowly elsewhere. */
export function pointerPollMs(point, display, rect = null) {
  if (!point || !display) return POINTER_FAR_MS;
  const fromTop = point.y - display.bounds.y;
  if (fromTop <= POINTER_NEAR_TOP) return POINTER_NEAR_MS;
  if (rect && point.y <= rect.y + rect.height + POINTER_NEAR_TOP / 4
    && point.x >= rect.x - POINTER_NEAR_TOP && point.x <= rect.x + rect.width + POINTER_NEAR_TOP) return POINTER_NEAR_MS;
  return POINTER_FAR_MS;
}
// A blur right after show is the panel settling, not the person leaving.
const BLUR_GRACE_MS = 250;
// Long enough for the compositor to drop our windows from the next frame.
const CAPTURE_HIDE_MS = 90;
// A page that failed to load (the server not up yet) is retried, backing
// off to this ceiling.
const RELOAD_MAX_MS = 30_000;
// How long a summon waits for the talk page to take it before a dismiss
// from that page counts again.
const SUMMON_ACK_MS = 3_000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Registers the two global hotkeys and remembers which ones macOS refused.
 * `register` returns false when another app (or another Orbit) holds the
 * combination; that is shown in Settings, never swallowed. */
export function createHotkeys({ globalShortcut, handlers, log = () => {}, ids = HOTKEY_IDS }) {
  const allowed = new Set(ids);
  const active = new Map();
  const status = Object.fromEntries(HOTKEY_IDS.map((id) => [id, { accelerator: "", registered: false, error: null }]));
  let suspended = false;
  let wanted = {};
  let unwatchSuspender = null;

  function release() {
    for (const accelerator of active.values()) {
      try {
        globalShortcut.unregister(accelerator);
      } catch {}
    }
    active.clear();
  }

  function apply(hotkeys = wanted) {
    wanted = { ...hotkeys };
    release();
    for (const id of HOTKEY_IDS) {
      // one this platform can't serve is never registered, nor shown as set
      const accelerator = allowed.has(id) ? wanted[id] ?? "" : "";
      status[id] = { accelerator, registered: false, error: null };
      if (!accelerator || suspended) continue;
      let ok = false;
      try {
        ok = globalShortcut.register(accelerator, () => handlers[id]?.());
      } catch (error) {
        status[id].error = "invalid";
        log(`orbit hotkey ${id} (${accelerator}) rejected: ${error?.message ?? error}`);
        continue;
      }
      if (ok) {
        active.set(id, accelerator);
        status[id].registered = true;
      } else {
        status[id].error = "conflict";
        log(`orbit hotkey ${id} (${accelerator}) is held by another app`);
      }
    }
    return snapshot();
  }

  function snapshot() {
    return Object.fromEntries(HOTKEY_IDS.map((id) => [id, { ...status[id], suspended }]));
  }

  return {
    apply,
    snapshot,
    /** While Settings records a new combination the old ones must not fire.
     * `owner` (the recording page's webContents) going away or navigating
     * resumes them: a closed Settings must never leave them dead. */
    suspend(on, owner = null, onResumed = () => {}) {
      unwatchSuspender?.();
      unwatchSuspender = null;
      suspended = Boolean(on);
      if (suspended && owner && typeof owner.once === "function") {
        const resume = () => {
          if (!unwatchSuspender) return;
          unwatchSuspender();
          unwatchSuspender = null;
          suspended = false;
          apply();
          onResumed();
        };
        const events = ["destroyed", "did-navigate", "render-process-gone"];
        for (const name of events) owner.once(name, resume);
        unwatchSuspender = () => {
          for (const name of events) owner.removeListener?.(name, resume);
        };
      }
      apply();
      return snapshot();
    },
    dispose() {
      unwatchSuspender?.();
      unwatchSuspender = null;
      release();
    },
  };
}

/** The menu-bar icon (macOS): a template image, so it follows light and dark.
 * On Windows the notification-area icon: the app's own one (`hostTray`,
 * electron/system-tray.mjs) when it has it, else one of the shell's, in
 * colour; a left click there opens the quick bar. */
export function createMenuBar({ Tray, Menu, nativeImage, iconPath, actions, isPaused, platform = "darwin", hostTray = null, appName = process.env.SOLAR_APP === "1" ? "Solar" : "Orbit" }) {
  const voice = voiceSupported(platform);
  const build = () => Menu.buildFromTemplate([
    { label: `Ask ${appName}…`, click: () => actions.quick() },
    ...(voice ? [{ label: `Talk to ${appName}`, click: () => actions.talk() }] : []),
    { type: "separator" },
    { label: `Open ${appName}`, click: () => actions.open() },
    { label: "Pause screen access", type: "checkbox", checked: isPaused(), click: () => actions.togglePaused() },
    { label: "Settings…", click: () => actions.settings() },
    { type: "separator" },
    { label: `Quit ${appName}`, click: () => actions.quit() },
  ]);
  if (platform !== "darwin" && hostTray) {
    const loan = hostTray.lend({ menu: build(), click: () => actions.quick() });
    return {
      tray: null,
      refresh() { loan.setMenu(build()); },
      destroy() { loan.release(); },
    };
  }
  const icon = nativeImage.createFromPath(iconPath);
  if (platform === "darwin") icon.setTemplateImage?.(true);
  const tray = new Tray(platform === "darwin" ? icon : icon.resize?.({ width: 20, height: 20 }) ?? icon);
  tray.setToolTip(appName);
  if (platform !== "darwin") tray.on?.("click", () => actions.quick());
  tray.setContextMenu(build());
  return {
    tray,
    refresh() {
      if (!tray.isDestroyed()) tray.setContextMenu(build());
    },
    destroy() {
      if (!tray.isDestroyed()) tray.destroy();
    },
  };
}

/** Hanging from the top edge of the display, centred: talk mode is an
 * island that grows out of the notch, like the iPhone's Dynamic Island (the
 * owner's call). The window is the largest the island gets; the page draws
 * the island inside it and the rest stays clear and click-through. */
export function talkBounds(bounds, size = TALK_SIZE, notch = null) {
  // over the notch itself when there is one (it isn't always dead centre)
  const centre = notch ? notch.x + notch.width / 2 : bounds.width / 2;
  return {
    x: Math.round(bounds.x + centre - size.width / 2),
    y: Math.round(bounds.y),
    width: size.width,
    height: size.height,
  };
}

/** Where the island's window goes on `display` and how tall the band it
 * hangs from is (`topInset`: the notch, else the menu bar). */
export function islandFrame(display, notch = null, size = TALK_SIZE) {
  return {
    bounds: talkBounds(display.bounds, size, notch),
    topInset: notch ? notch.height : Math.max(0, display.workArea.y - display.bounds.y),
  };
}

export function sideTalkFrame(display) {
  const area = display.workArea;
  const width = Math.min(SIDE_TALK_SIZE.width, area.width);
  const height = Math.min(SIDE_TALK_SIZE.height, area.height);
  return { x: area.x + area.width - width, y: Math.round(area.y + (area.height - height) / 2), width, height };
}

/** Centred at the bottom of the work area, above the Dock, like the map's
 * own composer; a reply grows the window upward (the owner's call). */
export function quickBounds(workArea, height, width = QUICK_WIDTH) {
  const w = Math.min(width, workArea.width - 32);
  const h = Math.round(Math.min(QUICK_MAX_HEIGHT, Math.max(QUICK_MIN_HEIGHT, height)));
  return {
    x: Math.round(workArea.x + (workArea.width - w) / 2),
    y: Math.round(workArea.y + workArea.height - h - 24),
    width: w,
    height: h,
  };
}

/**
 * `send(win, channel, payload, key = channel)`: straight to a loaded page;
 * to a page still loading, once it has loaded (and React had `delayMs` to
 * subscribe). One `did-finish-load` listener per window however many
 * messages wait, and one waiting payload per `key`: the newest wins.
 */
export function createDeferredSender({ delayMs = 300, schedule = setTimeout } = {}) {
  const waiting = new WeakMap(); // win -> Map<key, { channel, payload }>
  return function send(win, channel, payload, key = channel) {
    if (!win || win.isDestroyed()) return;
    let queue = waiting.get(win);
    if (!queue && !win.webContents.isLoading()) {
      win.webContents.send(channel, payload);
      return;
    }
    if (!queue) {
      queue = new Map();
      waiting.set(win, queue);
      win.webContents.once("did-finish-load", () => schedule(() => {
        waiting.delete(win);
        if (win.isDestroyed()) return;
        for (const message of queue.values()) win.webContents.send(message.channel, message.payload);
      }, delayMs));
    }
    queue.delete(key);
    queue.set(key, { channel, payload });
  };
}

const SHELL_CHANNELS = [
  "orbit-shell:state", "orbit-shell:set-hotkey", "orbit-shell:suspend-hotkeys", "orbit-shell:set-screen-paused",
  "orbit-shell:capture", "orbit-shell:quick-resize", "orbit-shell:quick-hide", "orbit-shell:open-thread",
  "orbit-shell:open-settings", "orbit-shell:talk-state", "orbit-shell:talk-interactive", "orbit-shell:talk-dismiss",
  "orbit-shell:talk-summon", "orbit-shell:screen-held", "orbit-shell:point", "orbit-shell:overlay-idle",
  "orbit-shell:island-look",
];

/**
 * Wires the whole shell. `deps.electron` carries the Electron modules;
 * the rest are callbacks into main.mjs so this module never reaches into
 * the main window or the server itself.
 */
export function createOrbitSummon(deps) {
  const {
    electron, userData, preloadPath, iconPath, rendererOrigin, rendererArguments,
    showMainWindow, openMainSettings, openThread, isMainWindowVisible, getMainWindow = () => null, quit, localOnly, log = () => {},
    // each display's notch (speech.mjs asks AppKit); none where unknown
    notches = async () => new Map(),
    platform = process.platform,
    // Windows: the app's notification-area icon (system-tray.mjs), lent
    // to the shell for its menu
    hostTray = null,
    // the pointer watch's clock (tests drive it)
    schedule = setTimeout,
    unschedule = clearTimeout,
  } = deps;
  const isMac = platform === "darwin";
  const voice = voiceSupported(platform);
  const hotkeyIds = hotkeyIdsFor(platform);
  const { app, BrowserWindow, Tray, Menu, nativeImage, globalShortcut, screen, desktopCapturer, systemPreferences, ipcMain } = electron;
  const file = prefsFile(userData);
  const captureDir = path.join(userData, "orbit-captures");
  let prefs = readPrefs(file);
  const shellWindows = new Set();
  const overlays = new Map(); // display id -> BrowserWindow
  const loads = new Map(); // shell window -> { failed, reload() }
  let quick = null;
  let talk = null;
  let menuBar = null;
  let quickShownAt = 0;
  let quickHeight = QUICK_MIN_HEIGHT;
  let appWasActive = false;
  let talkPhase = "hidden";
  let heldDisplayId = null;
  let lastCapture = null; // "granted" | "denied" after a real attempt
  // the island's size, as the talk page last said
  let islandLook = null;
  // the pointer watch while talk is on screen: is it over the island
  let pointerTimer = null;
  let hoverOver = false;
  let disposed = false;
  let summoning = false;
  // numbers each summon, so a capture reaches the page with the summon it
  // belongs to
  let summonCount = 0; // a summon is capturing / placing the character
  let summonAckTimer = null; // until the talk page takes the summon
  const send = createDeferredSender();
  // Notches only change when displays do.
  let notchCache = null;
  // Only macOS has notches (and the helper that finds them).
  const notchesNow = () => (notchCache ??= isMac ? notches().catch(() => new Map()) : Promise.resolve(new Map()));

  const hotkeys = createHotkeys({
    globalShortcut,
    handlers: { quick: () => toggleQuick(), talk: () => void summonTalk() },
    log,
    ids: hotkeyIds,
  });

  function shellUrl(surface) {
    return `${rendererOrigin()}/orbit-shell.html?surface=${surface}`;
  }

  function panel(options) {
    const { surface, ...windowOptions } = options;
    const win = new BrowserWindow({
      // a macOS panel floats over full-screen apps without activating Orbit;
      // Windows has no such type (focusable: false does that part there)
      ...(isMac ? { type: "panel" } : {}),
      show: false,
      frame: false,
      transparent: true,
      backgroundColor: "#00000000",
      hasShadow: false,
      resizable: false,
      movable: false,
      minimizable: false,
      maximizable: false,
      fullscreenable: false,
      skipTaskbar: true,
      ...windowOptions,
      webPreferences: {
        contextIsolation: true,
        preload: preloadPath,
        additionalArguments: [...rendererArguments(), "--orbit-shell=1"],
        // Hidden panels sleep. The talk character turns it off only while
        // it speaks (see talk-state).
        backgroundThrottling: true,
        // The talk character speaks without a click in its own window.
        autoplayPolicy: "no-user-gesture-required",
      },
    });
    shellWindows.add(win);
    // A shell window never becomes a second app: links leave for the browser.
    win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
    win.webContents.on("will-navigate", (event) => event.preventDefault());

    // The page's own animation loops stop while the window is hidden; the
    // preload keeps the newest value for a page that subscribes late.
    const reportVisibility = () => {
      if (!win.isDestroyed()) win.webContents.send("orbit-shell:visibility", { visible: win.isVisible() });
    };
    win.on("show", reportVisibility);
    win.on("hide", reportVisibility);

    // The server may not be up yet (or restarts): a failed load is retried
    // with backoff, and again at once when main says the server is ready.
    const load = { failed: false, attempts: 0, timer: null, reload: null };
    const loadNow = () => {
      if (load.timer) clearTimeout(load.timer);
      load.timer = null;
      if (win.isDestroyed()) return;
      void win.loadURL(shellUrl(surface)).catch((error) => log(`orbit ${surface} failed to load: ${error?.message ?? error}`));
    };
    load.reload = () => {
      load.attempts = 0;
      loadNow();
    };
    loads.set(win, load);
    win.webContents.on("did-start-loading", () => { load.failed = false; });
    win.webContents.on("did-fail-load", (_event, code, _description, _url, isMainFrame) => {
      // -3 is an aborted load (a newer one replaced it), not a failure.
      if (isMainFrame === false || code === -3) return;
      load.failed = true;
      if (load.timer || disposed) return;
      const delay = Math.min(RELOAD_MAX_MS, 1_000 * 2 ** load.attempts);
      load.attempts += 1;
      load.timer = setTimeout(loadNow, delay);
    });
    win.webContents.on("did-finish-load", () => {
      if (!load.failed) load.attempts = 0;
      reportVisibility();
    });
    win.on("closed", () => {
      if (load.timer) clearTimeout(load.timer);
      loads.delete(win);
      shellWindows.delete(win);
    });
    loadNow();
    return win;
  }

  /** The server came (back) up: pages that could not load try again now. */
  function serverReady() {
    for (const [win, load] of loads) {
      if (!win.isDestroyed() && load.failed) load.reload();
    }
  }

  function floatEverywhere(win, level, relativeLevel = 0) {
    // Spaces are macOS's; on Windows "screen-saver" is a topmost window
    // (relativeLevel only orders windows on macOS)
    if (isMac) win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true });
    win.setAlwaysOnTop(true, level, relativeLevel);
  }

  // Lets a frameless window sit over the menu bar / notch on macOS; Windows
  // never pushes a frameless window down, and doesn't know the option.
  const largerThanScreen = isMac ? { enableLargerThanScreen: true } : {};

  function displayUnderCursor() {
    return screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  }

  // ── quick bar ────────────────────────────────────────────────────────
  function createQuick() {
    quick = panel({
      surface: "quick",
      width: QUICK_WIDTH,
      height: QUICK_MIN_HEIGHT,
      // fully transparent: the bar and the reply above it draw their own
      // surfaces, like the map's composer; the gap between them shows the
      // app underneath
      roundedCorners: false,
      hasShadow: false,
    });
    quick.on("blur", () => {
      if (Date.now() - quickShownAt < BLUR_GRACE_MS) return;
      hideQuick();
    });
  }

  function showQuick() {
    if (!quick || quick.isDestroyed()) createQuick();
    const display = displayUnderCursor();
    appWasActive = BrowserWindow.getFocusedWindow() !== null;
    quick.setBounds(quickBounds(display.workArea, quickHeight));
    // Re-applied on every show: macOS drops a panel's level when Spaces or
    // full-screen apps change under it.
    floatEverywhere(quick, "floating");
    quickShownAt = Date.now();
    quick.show();
    quick.focus();
    send(quick, "orbit-shell:quick-shown", { screenPaused: prefs.screenPaused });
  }

  function hideQuick() {
    if (!quick || quick.isDestroyed() || !quick.isVisible()) return;
    quick.hide();
    // The panel normally leaves the other app frontmost. If showing it
    // activated Orbit anyway, hand focus back — but app.hide() would also
    // hide the main window and the talk character, so only when neither is
    // on screen (the same rule Cherry Studio's quick assistant uses).
    // Windows has no app.hide(): hiding the bar already hands the foreground
    // to the window under it.
    if (isMac && !appWasActive && !isMainWindowVisible() && !(talk && !talk.isDestroyed() && talk.isVisible())) {
      app.hide?.();
    }
  }

  function toggleQuick() {
    if (quick && !quick.isDestroyed() && quick.isVisible() && quick.isFocused()) hideQuick();
    else showQuick();
  }

  // ── talk character ───────────────────────────────────────────────────
  function createTalk() {
    // enableLargerThanScreen: Electron then leaves a frameless window's frame
    // exactly where it is put, so the island can start at the very top edge,
    // over the notch; without it macOS pushes it below the menu bar.
    talk = panel({ surface: "talk", ...(isMac ? TALK_SIZE : SIDE_TALK_SIZE), focusable: false, ...largerThanScreen });
    // Forwarded moves are only a second source for the page: macOS
    // forwards none to a click-through panel over the notch or the menu
    // bar, so while talk is shown main watches the pointer itself
    // (watchPointer) and says when it is over the island, which takes the
    // click that stops a turn.
    talk.setIgnoreMouseEvents(true, { forward: true });
    talk.on("show", watchPointer);
    // A reloaded page starts at rest; a stale "listening" would turn the
    // next summon into a toggle.
    talk.webContents.on("did-finish-load", () => {
      talkPhase = "idle";
      islandLook = null;
      hoverOver = false;
    });
  }

  /** Puts the island's window on `display`, over its notch (or the virtual
   * one), and shows it: transparent and click-through, the page takes the
   * mouse only over the island. */
  function showTalk(display, notch) {
    if (!talk || talk.isDestroyed()) createTalk();
    talk.setBounds(isMac ? islandFrame(display, notch).bounds : sideTalkFrame(display));
    // one step above the screen's green border, which would tint the
    // island's black where they meet
    floatEverywhere(talk, "screen-saver", 1);
    if (hoverOver) setHover(false);
    if (!talk.isVisible()) talk.showInactive();
    watchPointer();
  }

  // ── the pointer watch ────────────────────────────────────────────────
  // While talk is on screen main looks at the pointer itself, fast near the
  // top edge, so the island takes a click over the notch. Nothing runs
  // while the window is hidden, which is whenever talk is at rest.
  const pointerWanted = () => !disposed && Boolean(talk) && !talk.isDestroyed() && talk.isVisible();

  function watchPointer() {
    if (pointerTimer || !pointerWanted()) return;
    pointerTimer = schedule(pointerTick, 0);
    pointerTimer?.unref?.();
  }

  function stopPointer() {
    if (pointerTimer) unschedule(pointerTimer);
    pointerTimer = null;
  }

  function setHover(over) {
    if (over === hoverOver) return;
    hoverOver = over;
    if (talk && !talk.isDestroyed()) send(talk, "orbit-shell:island-hover", { over }, "orbit-shell:island-hover");
  }

  function pointerTick() {
    pointerTimer = null;
    if (!pointerWanted()) {
      setHover(false);
      return;
    }
    let point = null;
    let under = null;
    let rect = null;
    try {
      point = screen.getCursorScreenPoint();
      under = displayAt(screen.getAllDisplays(), point);
      rect = islandHoverRect(talk.getBounds(), islandLook, ISLAND_HOVER_INSET, !isMac);
      setHover(pointInRect(point, rect));
    } catch (error) {
      log(`orbit pointer watch: ${error?.message ?? error}`);
    }
    pointerTimer = schedule(pointerTick, pointerPollMs(point, under, rect));
    pointerTimer?.unref?.();
  }

  function clearSummonAck() {
    if (summonAckTimer) clearTimeout(summonAckTimer);
    summonAckTimer = null;
  }

  async function summonTalk() {
    // Talk listens through the macOS speech helper; without a voice engine
    // (Windows) there is nothing to summon.
    if (!voice) return;
    // Made on first summon, then kept.
    if (!talk || talk.isDestroyed()) createTalk();
    // A second press while listening ends the question (toggle to talk:
    // globalShortcut has no key-up).
    if (talk.isVisible() && talkPhase === "listening") {
      send(talk, "orbit-shell:talk-toggle", {});
      return;
    }
    // One summon at a time: a press during the capture would only start a
    // second, identical one.
    if (summoning) return;
    summoning = true;
    clearSummonAck();
    let display;
    const id = ++summonCount;
    try {
      // what you're looking at is what Orbit sees, and where it talks: the
      // island, the capture and the "can see" border all on your display
      display = displayUnderCursor();
      const notch = (await notchesNow()).get(String(display.id)) ?? null;
      if (disposed) return;
      if (!talk || talk.isDestroyed()) createTalk();
      // The island comes at once and listens while the screen is captured:
      // the capture (a full-resolution screenshot) takes from a few hundred
      // milliseconds to over a second, and waiting for it made ⌥T feel
      // broken. The capture follows on its own message.
      showTalk(display, notch);
      // The island's top sits behind the notch, or behind the menu bar on a
      // display without one.
      const { topInset } = islandFrame(display, notch);
      send(talk, "orbit-shell:talk-summon", {
        id,
        capture: null,
        display: { id: String(display.id), bounds: display.bounds, topInset, notch: notch ? { width: notch.width, height: notch.height } : null },
      });
      // The page's rest timer from the last turn can still fire before it
      // takes this summon; that dismiss is stale until the page answers.
      summonAckTimer = setTimeout(() => { summonAckTimer = null; }, SUMMON_ACK_MS);
    } finally {
      summoning = false;
    }
    if (disposed || !display) return;
    const startedAt = Date.now();
    // the island stays in view: fading it for the shot made it blink
    const capture = await captureFor(display, { keep: talk });
    log(`orbit talk: screen ${capture.ok ? "captured" : `not captured (${capture.reason})`} in ${Date.now() - startedAt} ms`);
    if (!disposed && talk && !talk.isDestroyed()) send(talk, "orbit-shell:talk-capture", { id, capture });
  }

  // ── overlays: the "can see" border and the pointer ────────────────────
  /** Made on first need for each display, then kept until the display goes. */
  function overlayFor(display) {
    const key = String(display.id);
    let win = overlays.get(key);
    if (!win || win.isDestroyed()) {
      win = panel({ surface: "overlay", ...display.bounds, focusable: false, ...largerThanScreen });
      win.setIgnoreMouseEvents(true);
      overlays.set(key, win);
    }
    win.setBounds(display.bounds);
    floatEverywhere(win, "screen-saver");
    return win;
  }

  function displayById(id) {
    return screen.getAllDisplays().find((display) => String(display.id) === String(id)) ?? null;
  }

  function showOverlay(display, message) {
    const win = overlayFor(display);
    // A page still loading gets the border state and the newest point.
    send(win, "orbit-shell:overlay", message, message.point ? "overlay:point" : "overlay:border");
    if (!win.isVisible()) win.showInactive();
  }

  function setHeld(displayId, held) {
    if (held) {
      if (heldDisplayId && heldDisplayId !== displayId) setHeld(heldDisplayId, false);
      const display = displayById(displayId);
      if (!display) return;
      heldDisplayId = String(displayId);
      showOverlay(display, { border: true });
    } else if (heldDisplayId === String(displayId) || displayId == null) {
      const win = heldDisplayId ? overlays.get(heldDisplayId) : null;
      heldDisplayId = null;
      send(win, "orbit-shell:overlay", { border: false }, "overlay:border");
    }
  }

  function point({ x, y, label }) {
    if (![x, y].every(Number.isFinite)) return false;
    const display = screen.getDisplayNearestPoint({ x, y });
    const local = { x: x - display.bounds.x, y: y - display.bounds.y };
    // The pointer leaves from the character when it is on that display.
    let from = null;
    if (talk && !talk.isDestroyed() && talk.isVisible()) {
      const b = talk.getBounds();
      // the island hangs from the top edge, centred in its window
      const centre = { x: b.x + b.width / 2, y: b.y + 40 };
      const d = screen.getDisplayNearestPoint(centre);
      if (d.id === display.id) from = { x: centre.x - display.bounds.x, y: centre.y - display.bounds.y };
    }
    showOverlay(display, { point: { ...local, label: typeof label === "string" ? label.slice(0, 120) : "", from } });
    return true;
  }

  // ── capture ──────────────────────────────────────────────────────────
  // One at a time: two overlapping captures would each restore opacity
  // while the other is still taking its picture.
  const captureFor = serialized(captureOnce);

  async function captureOnce(display, { keep = null } = {}) {
    if (prefs.screenPaused) return { ok: false, reason: "paused" };
    // Our own windows must not be in the picture. Opacity rather than hide:
    // a hidden quick bar would lose keyboard focus. `keep` stays: the talk
    // island, small and at the top edge, listening while the shot is taken.
    const visible = [...shellWindows].filter((win) => win !== keep && !win.isDestroyed() && win.isVisible());
    for (const win of visible) win.setOpacity(0);
    if (visible.length) await wait(CAPTURE_HIDE_MS);
    try {
      let result = await captureDisplay({ desktopCapturer, display });
      // "denied" means macOS's Screen Recording switch; Windows has none to
      // send the person to, so an empty picture there is a failed capture.
      if (!isMac && !result.ok && result.reason === "denied") result = { ok: false, reason: "failed" };
      if (result.ok) lastCapture = "granted";
      else if (result.reason === "denied") lastCapture = "denied";
      if (!result.ok) log(`orbit screen capture refused: ${result.reason}`);
      return result;
    } finally {
      for (const win of visible) if (!win.isDestroyed()) win.setOpacity(1);
      emitState();
    }
  }

  // ── state for Settings ───────────────────────────────────────────────
  function permissions() {
    // Screen Recording, Microphone and Accessibility are macOS privacy (TCC)
    // switches; Windows lets desktopCapturer see the screen without one.
    if (!isMac) return { screen: lastCapture ?? "unknown", microphone: "unknown", accessibility: "unknown" };
    const media = (kind) => {
      try {
        return systemPreferences.getMediaAccessStatus?.(kind) ?? "unknown";
      } catch {
        return "unknown";
      }
    };
    // macOS caches the screen answer per process (see main.mjs), so a real
    // capture attempt from this launch outranks it.
    const screenStatus = lastCapture ?? (media("screen") === "granted" ? "granted" : "unknown");
    let accessibility = "unknown";
    try {
      accessibility = systemPreferences.isTrustedAccessibilityClient?.(false) ? "granted" : "denied";
    } catch {}
    return { screen: screenStatus, microphone: media("microphone"), accessibility };
  }

  function publicState() {
    return {
      supported: true,
      platform,
      // talk mode (its hotkey, the quick bar's mic) needs a voice engine
      voice,
      hotkeys: hotkeys.snapshot(),
      screenPaused: prefs.screenPaused,
      permissions: permissions(),
    };
  }

  /** Settings lives in the main window; the shell pages show the hotkey. */
  function emitState() {
    const state = publicState();
    const targets = new Set(shellWindows);
    const main = getMainWindow();
    if (main) targets.add(main);
    for (const win of targets) {
      if (!win.isDestroyed()) win.webContents.send("orbit-shell:state-changed", state);
    }
    menuBar?.refresh();
  }

  function savePrefs(next) {
    prefs = writePrefs(file, next);
    return prefs;
  }

  function setScreenPaused(paused) {
    savePrefs({ ...prefs, screenPaused: Boolean(paused) });
    if (prefs.screenPaused && heldDisplayId) setHeld(heldDisplayId, false);
    emitState();
    return publicState();
  }

  // ── IPC ──────────────────────────────────────────────────────────────
  const fromShell = (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    return win && shellWindows.has(win) ? win : null;
  };

  function registerIpc() {
    const handle = (channel, fn) => ipcMain.handle(channel, localOnly(channel, fn));
    handle("orbit-shell:state", () => publicState());
    handle("orbit-shell:set-hotkey", (_event, id, value) => {
      if (!HOTKEY_IDS.includes(id)) throw new Error("unknown hotkey");
      // Codes, not sentences: Settings words them through its catalogue.
      if (!hotkeyIds.includes(id)) throw new Error("orbit-shell:unsupported");
      const accelerator = normalizeAccelerator(value);
      if (accelerator === null) throw new Error("orbit-shell:needs-modifier");
      const other = HOTKEY_IDS.find((candidate) => candidate !== id);
      // a hotkey this platform never registers can't collide
      if (accelerator && hotkeyIds.includes(other) && prefs.hotkeys[other] === accelerator) throw new Error("orbit-shell:duplicate");
      savePrefs({ ...prefs, hotkeys: { ...prefs.hotkeys, [id]: accelerator } });
      hotkeys.apply(prefs.hotkeys);
      emitState();
      return publicState();
    });
    handle("orbit-shell:suspend-hotkeys", (event, on) => {
      hotkeys.suspend(on, event.sender, emitState);
      emitState();
      return publicState();
    });
    handle("orbit-shell:set-screen-paused", (_event, paused) => setScreenPaused(paused));
    handle("orbit-shell:capture", async (event) => {
      const win = fromShell(event);
      if (!win) throw new Error("only the Orbit shell captures the screen");
      const display = screen.getDisplayMatching(win.getBounds());
      return captureFor(display);
    });
    handle("orbit-shell:quick-resize", (event, height) => {
      if (fromShell(event) !== quick || !Number.isFinite(height)) return;
      quickHeight = Math.round(Math.min(QUICK_MAX_HEIGHT, Math.max(QUICK_MIN_HEIGHT, height)));
      const bounds = quick.getBounds();
      if (bounds.height !== quickHeight) quick.setBounds({ ...bounds, height: quickHeight });
    });
    handle("orbit-shell:quick-hide", () => hideQuick());
    handle("orbit-shell:open-thread", (_event, target) => {
      hideQuick();
      if (target && typeof target.botId === "string" && typeof target.threadId === "string") {
        openThread({ botId: target.botId, threadId: target.threadId });
      } else showMainWindow();
    });
    handle("orbit-shell:open-settings", () => {
      hideQuick();
      openMainSettings();
    });
    handle("orbit-shell:talk-state", (event, phase) => {
      if (fromShell(event) !== talk) return;
      talkPhase = typeof phase === "string" ? phase : "idle";
      // The page took the summon: its dismisses count again.
      if (talkPhase !== "idle") clearSummonAck();
      // Speech must not stutter behind another app; otherwise let it sleep.
      try {
        talk.webContents.setBackgroundThrottling(talkPhase !== "talking");
      } catch {}
    });
    handle("orbit-shell:island-look", (event, look) => {
      if (fromShell(event) !== talk || !look || typeof look !== "object") return;
      const { width, height } = look;
      if (![width, height].every((value) => Number.isFinite(value) && value >= 0)) return;
      islandLook = { width, height };
    });
    handle("orbit-shell:talk-interactive", (event, interactive) => {
      if (fromShell(event) !== talk) return;
      // Click-through except the character itself: the page reports when
      // the pointer is over it, and only then takes the mouse.
      if (interactive) talk.setIgnoreMouseEvents(false);
      else talk.setIgnoreMouseEvents(true, { forward: true });
    });
    handle("orbit-shell:talk-dismiss", (event) => {
      if (fromShell(event) !== talk) return;
      // A dismiss racing a summon is the old turn's rest timer, not the
      // person: the character is on its way back.
      if (summoning || summonAckTimer) return;
      talkPhase = "hidden";
      // back in the notch: the window goes until the next summon
      talk.hide();
    });
    handle("orbit-shell:talk-summon", (event) => {
      if (fromShell(event) !== talk) return;
      void summonTalk();
    });
    handle("orbit-shell:screen-held", (event, displayId, held) => {
      if (!fromShell(event)) return;
      setHeld(displayId == null ? null : String(displayId), Boolean(held));
    });
    handle("orbit-shell:point", (event, target) => {
      if (!fromShell(event) || !target || typeof target !== "object") return false;
      return point(target);
    });
    handle("orbit-shell:overlay-idle", (event) => {
      const win = fromShell(event);
      if (!win) return;
      const key = [...overlays.entries()].find(([, candidate]) => candidate === win)?.[0];
      if (key && key !== heldDisplayId && win.isVisible()) win.hide();
    });
  }

  function handleDisplaysChanged() {
    notchCache = null;
    const alive = new Set(screen.getAllDisplays().map((display) => String(display.id)));
    for (const [key, win] of overlays) {
      if (alive.has(key)) continue;
      overlays.delete(key);
      if (!win.isDestroyed()) win.destroy();
    }
    if (heldDisplayId && !alive.has(heldDisplayId)) heldDisplayId = null;
  }

  function start() {
    // Older builds saved every screenshot here; nothing reads them.
    clearCaptureDir(captureDir);
    registerIpc();
    createQuick();
    hotkeys.apply(prefs.hotkeys);
    try {
      menuBar = createMenuBar({
        Tray, Menu, nativeImage, iconPath, platform, hostTray,
        isPaused: () => prefs.screenPaused,
        actions: {
          quick: () => showQuick(),
          talk: () => void summonTalk(),
          open: () => showMainWindow(),
          togglePaused: () => setScreenPaused(!prefs.screenPaused),
          settings: () => openMainSettings(),
          quit: () => quit(),
        },
      });
    } catch (error) {
      log(`orbit menu-bar icon unavailable: ${error?.message ?? error}`);
    }
    screen.on("display-added", handleDisplaysChanged);
    screen.on("display-removed", handleDisplaysChanged);
    screen.on("display-metrics-changed", handleDisplaysChanged);
    emitState();
    // learn the notch now, so the first ⌥T doesn't wait on it
    void notchesNow();
  }

  return {
    start,
    /** Our floating windows are not "the app window" for activation logic. */
    owns: (win) => shellWindows.has(win),
    showQuick,
    summonTalk,
    serverReady,
    state: publicState,
    dispose() {
      if (disposed) return;
      disposed = true;
      clearSummonAck();
      stopPointer();
      hotkeys.dispose();
      menuBar?.destroy();
      for (const channel of SHELL_CHANNELS) {
        try {
          ipcMain.removeHandler(channel);
        } catch {}
      }
      for (const win of shellWindows) if (!win.isDestroyed()) win.destroy();
      shellWindows.clear();
    },
  };
}
