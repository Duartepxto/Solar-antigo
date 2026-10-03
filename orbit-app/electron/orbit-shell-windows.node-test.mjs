// The Orbit shell on Windows, against fake Electron modules: the same shell
// with Windows window mechanics, no talk mode, and not one macOS-only call.
// Each test also runs the darwin fixture where macOS must keep its behaviour.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { EventEmitter } from "node:events";
import {
  createMenuBar, createOrbitSummon, displayAt, hotkeyIdsFor, islandFrame, shellSupported, voiceSupported, TALK_SIZE,
} from "./orbit-summon.mjs";
import { createSystemTray } from "./system-tray.mjs";

// Scratch inside the repo's ignored folder, never /tmp (the owner's rule).
const scratchRoot = path.join(path.dirname(new URL(import.meta.url).pathname), "..", ".orbit-scratch", "node-tests");

class FakeWindow extends EventEmitter {
  static all = [];
  static spaces = 0;
  constructor(options) {
    super();
    this.options = options;
    this.visible = false;
    this.destroyed = false;
    this.bounds = { x: 0, y: 0, width: options.width ?? 0, height: options.height ?? 0 };
    this.ignore = null;
    this.sent = [];
    const contents = new EventEmitter();
    Object.assign(contents, {
      isLoading: () => false,
      send: (channel, payload) => this.sent.push([channel, payload]),
      setWindowOpenHandler() {},
      setBackgroundThrottling() {},
    });
    this.webContents = contents;
    FakeWindow.all.push(this);
  }
  loadURL(url) { this.url = url; return Promise.resolve(); }
  isDestroyed() { return this.destroyed; }
  destroy() { this.destroyed = true; }
  isVisible() { return this.visible; }
  showInactive() { this.visible = true; this.emit("show"); }
  show() { this.visible = true; this.emit("show"); }
  hide() { this.visible = false; this.emit("hide"); }
  focus() { this.focused = true; }
  isFocused() { return false; }
  setBounds(bounds) { this.bounds = { ...bounds }; }
  getBounds() { return { ...this.bounds }; }
  setIgnoreMouseEvents(ignore, options) { this.ignore = { ignore, ...options }; }
  setVisibleOnAllWorkspaces() { FakeWindow.spaces += 1; }
  setAlwaysOnTop(_on, level, relative) { this.level = [level, relative]; }
  setOpacity() {}
}

class FakeTray extends EventEmitter {
  static made = [];
  constructor(icon, guid) {
    super();
    this.icon = icon;
    this.guid = guid;
    FakeTray.made.push(this);
  }
  setToolTip(value) { this.tooltip = value; }
  setContextMenu(menu) { this.menu = menu; }
  isDestroyed() { return this.destroyed ?? false; }
  destroy() { this.destroyed = true; }
}

function icon(path) {
  return {
    path,
    template: false,
    setTemplateImage(value) { this.template = value; },
    resize(size) { return { ...this, resized: size }; },
  };
}

// A Windows desktop: the primary display with its taskbar at the bottom (the
// work area starts at the top edge) and a second one with it docked at the top.
const primary = { id: 10, bounds: { x: 0, y: 0, width: 1920, height: 1080 }, workArea: { x: 0, y: 0, width: 1920, height: 1040 }, size: { width: 1920, height: 1080 }, scaleFactor: 1 };
const topTaskbar = { id: 11, bounds: { x: 1920, y: 0, width: 2560, height: 1440 }, workArea: { x: 1920, y: 48, width: 2560, height: 1392 }, size: { width: 2560, height: 1440 }, scaleFactor: 1 };

function fixture({ platform = "win32", hostTray = null, displays = [primary, topTaskbar], mainVisible = false } = {}) {
  fs.mkdirSync(scratchRoot, { recursive: true });
  const userData = fs.mkdtempSync(path.join(scratchRoot, `orbit-${platform}-`));
  FakeWindow.all = [];
  FakeWindow.spaces = 0;
  FakeTray.made = [];
  const macCalls = [];
  const registered = new Map();
  const handlers = new Map();
  let all = displays;
  let first = displays[0];
  const cursor = { x: 10, y: 10 };
  const screen = Object.assign(new EventEmitter(), {
    getAllDisplays: () => all,
    getPrimaryDisplay: () => first,
    getCursorScreenPoint: () => ({ ...cursor }),
    getDisplayNearestPoint: (point) => displayAt(all, point) ?? first,
    getDisplayMatching: () => first,
  });
  // the pointer watch's clock, never run: talk's watch stays still here
  const pending = new Set();
  const schedule = (fn, ms) => {
    const timer = { fn, ms };
    pending.add(timer);
    return timer;
  };
  const unschedule = (timer) => pending.delete(timer);
  const BrowserWindow = Object.assign(FakeWindow, {
    getFocusedWindow: () => null,
    fromWebContents: (contents) => FakeWindow.all.find((win) => win.webContents === contents) ?? null,
  });
  const summon = createOrbitSummon({
    electron: {
      app: { hide() { macCalls.push("app.hide"); } },
      BrowserWindow, screen,
      Tray: FakeTray,
      Menu: { buildFromTemplate: (items) => items },
      nativeImage: { createFromPath: icon },
      globalShortcut: {
        register(accelerator, fn) { registered.set(accelerator, fn); return true; },
        unregister(accelerator) { registered.delete(accelerator); },
      },
      desktopCapturer: { getSources: async () => [{ display_id: "10", thumbnail: { isEmpty: () => true } }] },
      systemPreferences: {
        getMediaAccessStatus(kind) { macCalls.push(`getMediaAccessStatus:${kind}`); return "granted"; },
        isTrustedAccessibilityClient() { macCalls.push("isTrustedAccessibilityClient"); return true; },
      },
      ipcMain: { handle: (channel, fn) => handlers.set(channel, fn), removeHandler: (channel) => handlers.delete(channel) },
    },
    userData, preloadPath: "preload.cjs", iconPath: "app-icon.png",
    rendererOrigin: () => "http://127.0.0.1:1", rendererArguments: () => [],
    showMainWindow() {}, openMainSettings() {}, openThread() {}, isMainWindowVisible: () => mainVisible, quit() {},
    localOnly: (_channel, fn) => fn,
    notches: async () => { macCalls.push("screenNotches"); return new Map(); },
    platform,
    hostTray,
    schedule,
    unschedule,
  });
  const surface = (name) => FakeWindow.all.find((win) => win.url?.includes(`surface=${name}`));
  const invoke = (channel, win, ...args) => handlers.get(channel)({ sender: win?.webContents }, ...args);
  const setDisplays = (next, nextPrimary = next[0]) => { all = next; first = nextPrimary; };
  const cleanup = () => {
    summon.dispose();
    fs.rmSync(userData, { recursive: true, force: true });
  };
  return { summon, surface, invoke, handlers, registered, macCalls, screen, setDisplays, cleanup };
}

const settle = () => new Promise((resolve) => setImmediate(resolve));

test("the shell runs on macOS and Windows, talk mode only where there is a voice engine", () => {
  assert.equal(shellSupported("darwin"), true);
  assert.equal(shellSupported("win32"), true);
  assert.equal(shellSupported("linux"), false, "Linux keeps the app window only");
  assert.equal(voiceSupported("darwin"), true);
  assert.equal(voiceSupported("win32"), false);
  assert.deepEqual(hotkeyIdsFor("darwin"), ["quick", "talk"]);
  assert.deepEqual(hotkeyIdsFor("win32"), ["quick"]);
});

test("macOS: talk's island hangs from the top edge, over the notch, with the menu bar as its band", () => {
  const mac = { id: 1, bounds: { x: 0, y: 0, width: 1512, height: 982 }, workArea: { x: 0, y: 38, width: 1512, height: 944 } };
  assert.deepEqual(islandFrame(mac, null), { bounds: { x: Math.round(756 - TALK_SIZE.width / 2), y: 0, ...TALK_SIZE }, topInset: 38 });
  assert.equal(islandFrame(mac, { x: 663, width: 186, height: 38 }).bounds.x, Math.round(663 + 93 - TALK_SIZE.width / 2));
});

test("Windows: no island at all, from the start or when displays change", async () => {
  const { summon, surface, screen, setDisplays, cleanup } = fixture();
  summon.start();
  await settle();
  assert.equal(surface("talk"), undefined, "no talk window: Windows has no voice engine");
  setDisplays([topTaskbar, primary], topTaskbar);
  screen.emit("display-added");
  screen.emit("display-metrics-changed");
  await settle();
  await settle();
  assert.equal(surface("talk"), undefined);
  assert.equal(summon.state().island, undefined, "and no setting for one");
  cleanup();
});

test("Windows: only the quick bar hotkey, and no talk summon from anywhere", async () => {
  const { summon, surface, handlers, registered, cleanup } = fixture();
  summon.start();
  await settle();
  assert.deepEqual([...registered.keys()], ["Alt+O"], "Alt+O only: no Alt+T, never Alt+Space");
  const state = summon.state();
  assert.equal(state.voice, false);
  assert.equal(state.platform, "win32");
  assert.deepEqual({ accelerator: state.hotkeys.talk.accelerator, registered: state.hotkeys.talk.registered }, { accelerator: "", registered: false });
  await assert.rejects(async () => handlers.get("orbit-shell:set-hotkey")({}, "talk", "Alt+K"), /orbit-shell:unsupported/);
  // Alt+T is free for the quick bar: the unused talk default can't collide
  const next = handlers.get("orbit-shell:set-hotkey")({}, "quick", "Alt+T");
  assert.equal(next.hotkeys.quick.accelerator, "Alt+T");
  assert.deepEqual([...registered.keys()], ["Alt+T"]);

  await summon.summonTalk();
  await settle();
  assert.equal(surface("talk"), undefined, "talk never starts, so its island never comes");
  cleanup();
});

test("Windows: the quick bar is a focusable topmost window, and closing it never calls app.hide()", async () => {
  const { summon, surface, invoke, macCalls, cleanup } = fixture();
  summon.start();
  summon.showQuick();
  const quick = surface("quick");
  assert.equal(quick.isVisible(), true);
  assert.equal(quick.focused, true);
  assert.equal(quick.options.type, undefined);
  assert.equal(quick.options.focusable, undefined, "focusable: it takes typing");
  assert.equal(quick.level[0], "floating");
  assert.equal(quick.getBounds().y + quick.getBounds().height, 1040 - 24, "above the taskbar");
  invoke("orbit-shell:quick-hide", quick);
  assert.equal(quick.isVisible(), false);
  await settle();
  assert.equal(FakeWindow.spaces, 0, "no Spaces on Windows");
  assert.deepEqual(macCalls, [], "no macOS-only call: app.hide, TCC, the notch helper");
  cleanup();
});

test("Windows: screen capture and the pointer overlay work, with no TCC permission to point at", async () => {
  const { summon, surface, invoke, macCalls, cleanup } = fixture();
  summon.start();
  summon.showQuick();
  const quick = surface("quick");
  const capture = await invoke("orbit-shell:capture", quick);
  assert.deepEqual(capture, { ok: false, reason: "failed" }, "an empty picture is a failure, not a Screen Recording switch");
  assert.equal(await invoke("orbit-shell:point", quick, { x: 100, y: 200, label: "here" }), true);
  const overlay = surface("overlay");
  assert.ok(overlay);
  assert.equal(overlay.isVisible(), true);
  assert.equal(overlay.options.enableLargerThanScreen, undefined);
  assert.deepEqual(overlay.ignore, { ignore: true });
  const { permissions } = summon.state();
  assert.deepEqual(permissions, { screen: "unknown", microphone: "unknown", accessibility: "unknown" });
  assert.deepEqual(macCalls, []);
  cleanup();
});

test("Windows: the app's notification-area icon carries the shell's menu; a left click opens the quick bar", async () => {
  let active = null;
  const calls = [];
  FakeTray.made = [];
  const host = createSystemTray({
    Tray: FakeTray, Menu: { buildFromTemplate: (items) => items }, nativeImage: { createFromPath: icon }, iconPath: "app-icon.png",
    getWindow: () => active, onQuit: () => calls.push("quit"),
  });
  const trayIcon = FakeTray.made[0];
  const { summon, surface, cleanup } = fixture({ hostTray: host });
  summon.start();
  assert.equal(FakeTray.made.length, 0, "one icon, not a second one");
  const labels = trayIcon.menu.filter((item) => item.label).map((item) => item.label);
  assert.deepEqual(labels, ["Ask Orbit…", "Open Orbit", "Pause screen access", "Settings…", "Quit Orbit"], "no Talk without a voice engine");
  trayIcon.emit("click");
  assert.equal(surface("quick").isVisible(), true, "left click: the quick bar");
  trayIcon.menu.find((item) => item.label === "Pause screen access").click();
  assert.equal(trayIcon.menu.find((item) => item.label === "Pause screen access").checked, true, "the menu follows the state");
  cleanup();
  assert.deepEqual(trayIcon.menu.map((item) => item.label).filter(Boolean), ["Open Orbit Bot", "Quit Orbit Bot"], "given back when the shell goes");
  active = { isDestroyed: () => false, setSkipTaskbar() {}, isMinimized: () => false, show() { calls.push("show"); }, focus() {} };
  trayIcon.emit("click");
  assert.deepEqual(calls, ["show"], "and its click opens the app again");
});

test("Windows without the app's icon: the shell makes its own, in colour", () => {
  FakeTray.made = [];
  let menu;
  const bar = createMenuBar({
    Tray: FakeTray, Menu: { buildFromTemplate: (items) => (menu = items) }, nativeImage: { createFromPath: icon }, iconPath: "app-icon.png",
    platform: "win32", isPaused: () => false,
    actions: Object.fromEntries(["quick", "talk", "open", "togglePaused", "settings", "quit"].map((name) => [name, () => (menu.fired = name)])),
  });
  const tray = FakeTray.made[0];
  assert.equal(tray.icon.path, "app-icon.png", "the colour app icon, not the macOS template");
  assert.equal(tray.icon.template, false);
  assert.deepEqual(tray.icon.resized, { width: 20, height: 20 });
  tray.emit("click");
  assert.equal(menu.fired, "quick");
  assert.equal(menu.some((item) => item.label === "Talk to Orbit"), false);
  bar.destroy();
});

test("macOS keeps its shell: panels on every Space, the talk hotkey, TCC permissions, app.hide()", async () => {
  const laptop = { id: 1, bounds: { x: 0, y: 0, width: 1512, height: 982 }, workArea: { x: 0, y: 38, width: 1512, height: 944 }, size: { width: 1512, height: 982 }, scaleFactor: 2 };
  const { summon, surface, invoke, registered, macCalls, cleanup } = fixture({ platform: "darwin", displays: [laptop] });
  summon.start();
  await settle();
  assert.deepEqual([...registered.keys()].sort(), ["Alt+O", "Alt+T"]);
  assert.equal(surface("talk"), undefined, "no island until ⌥T");
  assert.equal(summon.state().voice, true);
  assert.equal(summon.state().permissions.screen, "granted");
  // nothing of Orbit's is on screen, so closing the bar hands focus back
  // with app.hide()
  summon.showQuick();
  invoke("orbit-shell:quick-hide", surface("quick"));
  assert.ok(macCalls.includes("app.hide"), "focus goes back to the app you were in");
  await summon.summonTalk();
  const island = surface("talk");
  assert.equal(island.options.type, "panel");
  assert.equal(island.options.enableLargerThanScreen, true);
  assert.ok(FakeWindow.spaces > 0, "visible on every Space");
  assert.equal(island.getBounds().y, 0, "from the very top edge, over the menu bar");
  assert.ok(macCalls.includes("screenNotches"));
  assert.ok(macCalls.includes("getMediaAccessStatus:screen"));
  assert.equal(FakeTray.made[0].icon.template, true, "a template image in the menu bar");
  cleanup();
});
