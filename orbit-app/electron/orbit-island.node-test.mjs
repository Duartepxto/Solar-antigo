import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { EventEmitter } from "node:events";
import { createOrbitSummon, displayAt, TALK_SIZE } from "./orbit-summon.mjs";

// Scratch inside the repo's ignored folder, never /tmp (the owner's rule).
const scratchRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".orbit-scratch", "node-tests");

class FakeWindow extends EventEmitter {
  static all = [];
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
  focus() {}
  isFocused() { return false; }
  setBounds(bounds) { this.bounds = { ...bounds }; }
  getBounds() { return { ...this.bounds }; }
  setIgnoreMouseEvents(ignore, options) { this.ignore = { ignore, ...options }; }
  setVisibleOnAllWorkspaces() {}
  setAlwaysOnTop(_on, level, relative) { this.level = [level, relative]; }
  setOpacity() {}
}

// The owner's desk: the LG is the main display (menu bar 30, no notch); the
// MacBook, with its real notch, sits to its left and lower.
const LG = { id: 2, bounds: { x: 0, y: 0, width: 1920, height: 1080 }, workArea: { x: 0, y: 30, width: 1920, height: 1050 }, size: { width: 1920, height: 1080 }, scaleFactor: 1 };
const LAPTOP = { id: 1, bounds: { x: -1512, y: 98, width: 1512, height: 982 }, workArea: { x: -1512, y: 130, width: 1512, height: 950 }, size: { width: 1512, height: 982 }, scaleFactor: 2 };
const NOTCH = { x: 665, width: 185, height: 32 };
// where the island's window goes on each (centred over the notch on the laptop)
const ON_LG = { x: 600, y: 0, ...TALK_SIZE };
const ON_LAPTOP = { x: Math.round(-1512 + 665 + 92.5 - TALK_SIZE.width / 2), y: 98, ...TALK_SIZE };

function fixture({ platform = "darwin", cursor: startCursor = { x: 960, y: 500 } } = {}) {
  fs.mkdirSync(scratchRoot, { recursive: true });
  const userData = fs.mkdtempSync(path.join(scratchRoot, "orbit-island-"));
  FakeWindow.all = [];
  const handlers = new Map();
  let cursor = startCursor;
  const displays = [LAPTOP, LG];
  const screen = Object.assign(new EventEmitter(), {
    getAllDisplays: () => displays,
    getPrimaryDisplay: () => LG,
    getCursorScreenPoint: () => ({ ...cursor }),
    getDisplayNearestPoint: (point) => displayAt(displays, point) ?? LG,
    getDisplayMatching: () => LG,
  });
  const BrowserWindow = Object.assign(FakeWindow, {
    getFocusedWindow: () => null,
    fromWebContents: (contents) => FakeWindow.all.find((win) => win.webContents === contents) ?? null,
  });
  // the pointer watch's clock, run by hand
  const pending = new Set();
  const schedule = (fn, ms) => {
    const timer = { fn, ms };
    pending.add(timer);
    return timer;
  };
  const unschedule = (timer) => pending.delete(timer);
  const summon = createOrbitSummon({
    electron: {
      app: { hide() {} }, BrowserWindow, screen,
      Tray: class { constructor() { throw new Error("no tray in tests"); } }, Menu: {}, nativeImage: { createFromPath: () => ({}) },
      globalShortcut: { register: () => true, unregister() {} },
      desktopCapturer: { getSources: async () => [] },
      systemPreferences: {},
      ipcMain: { handle: (channel, fn) => handlers.set(channel, fn), removeHandler: (channel) => handlers.delete(channel) },
    },
    userData, preloadPath: "preload.cjs", iconPath: "icon.png",
    rendererOrigin: () => "http://127.0.0.1:1", rendererArguments: () => [],
    showMainWindow() {}, openMainSettings() {}, openThread() {}, isMainWindowVisible: () => false, quit() {},
    localOnly: (_channel, fn) => fn,
    notches: async () => new Map([["1", NOTCH]]),
    platform,
    schedule,
    unschedule,
  });
  const talkWindow = () => FakeWindow.all.find((win) => win.url?.includes("surface=talk"));
  const invoke = (channel, win, ...args) => handlers.get(channel)({ sender: win.webContents }, ...args);
  /** One look at the pointer (what the timer would do), then let a move land. */
  const watch = async (point) => {
    if (point) cursor = point;
    const due = [...pending];
    pending.clear();
    for (const timer of due) timer.fn();
    await settle();
    await settle();
  };
  const nextPoll = () => [...pending][0]?.ms;
  const lastSent = (win, channel) => win.sent.filter(([name]) => name === channel).at(-1)?.[1];
  const cleanup = () => {
    summon.dispose();
    fs.rmSync(userData, { recursive: true, force: true });
  };
  return { summon, talkWindow, invoke, handlers, watch, nextPoll, pending, lastSent, cleanup };
}

const settle = () => new Promise((resolve) => setImmediate(resolve));

test("nothing of the island is on screen, or watching the pointer, until ⌥T", async () => {
  const { summon, talkWindow, watch, pending, cleanup } = fixture({ cursor: { x: 960, y: 0 } });
  summon.start();
  await settle();
  assert.equal(talkWindow(), undefined, "made on the first summon, not at startup");
  assert.equal(pending.size, 0, "no pointer watch");
  // pointing at the top edge, over where the notch would be, does nothing
  await watch({ x: 960, y: 2 });
  assert.equal(talkWindow(), undefined);
  assert.equal(pending.size, 0);
  assert.equal(summon.state().island, undefined, "no \"Show Orbit in the notch\" setting");
  cleanup();
});

test("⌥T brings the island to the display under the pointer, click-through, over the screen's border", async () => {
  const { summon, talkWindow, lastSent, cleanup } = fixture();
  summon.start();
  await summon.summonTalk();
  const island = talkWindow();
  assert.ok(island);
  assert.equal(island.isVisible(), true);
  assert.deepEqual(island.ignore, { ignore: true, forward: true }, "clicks go through; moves are forwarded as a second source");
  assert.deepEqual(island.getBounds(), ON_LG, "on the LG the owner works on, not on the laptop's notch");
  assert.deepEqual(island.level, ["screen-saver", 1]);
  assert.equal(island.options.enableLargerThanScreen, true);
  const summoned = lastSent(island, "orbit-shell:talk-summon");
  assert.deepEqual({ id: summoned.display.id, topInset: summoned.display.topInset, notch: summoned.display.notch }, { id: "2", topInset: 30, notch: null }, "a virtual notch as tall as the menu bar");
  assert.equal(lastSent(island, "orbit-shell:island"), undefined, "no ambient island state");
  cleanup();
});

test("⌥T on the laptop sits over its real notch; the talk ending hides the window until the next ⌥T", async () => {
  const { summon, talkWindow, invoke, watch, pending, lastSent, cleanup } = fixture({ cursor: { x: -700, y: 600 } });
  summon.start();
  await summon.summonTalk();
  const island = talkWindow();
  assert.deepEqual(island.getBounds(), ON_LAPTOP, "over the notch at the top of the laptop, at y 98");
  assert.deepEqual(lastSent(island, "orbit-shell:talk-summon").display.notch, { width: 185, height: 32 });
  // the page took the summon, answered, and went back to rest
  invoke("orbit-shell:talk-state", island, "listening");
  invoke("orbit-shell:talk-state", island, "idle");
  invoke("orbit-shell:talk-dismiss", island);
  assert.equal(island.isVisible(), false, "back in the notch, the window goes");
  await watch();
  assert.equal(pending.size, 0, "nothing polls with nothing on screen");
  // the next ⌥T, on the LG: the same window, where the person is now
  await watch({ x: 1200, y: 500 });
  await summon.summonTalk();
  assert.equal(talkWindow(), island);
  assert.equal(island.isVisible(), true);
  assert.deepEqual(island.getBounds(), ON_LG);
  cleanup();
});

test("a dismiss racing a new summon is the old turn's rest timer: the island stays", async () => {
  const { summon, talkWindow, invoke, cleanup } = fixture();
  summon.start();
  await summon.summonTalk();
  const island = talkWindow();
  // the page hasn't taken the summon yet
  invoke("orbit-shell:talk-dismiss", island);
  assert.equal(island.isVisible(), true);
  invoke("orbit-shell:talk-state", island, "listening");
  invoke("orbit-shell:talk-state", island, "idle");
  invoke("orbit-shell:talk-dismiss", island);
  assert.equal(island.isVisible(), false);
  cleanup();
});

test("while talk is on, main says when the pointer is over the island on the main display", async () => {
  const { summon, talkWindow, invoke, watch, nextPoll, lastSent, cleanup } = fixture();
  summon.start();
  await summon.summonTalk();
  const island = talkWindow();
  await watch();
  assert.equal(nextPoll(), 250, "far from the top edge: four times a second");
  assert.equal(lastSent(island, "orbit-shell:island-hover"), undefined, "nothing to say yet");
  // the page says how big its island is: in the notch while Orbit thinks,
  // 184 × the menu bar
  invoke("orbit-shell:island-look", island, { width: 184, height: 30 });
  await watch({ x: 960, y: 60 });
  assert.equal(nextPoll(), 16, "near the top edge: Coucou's 60 Hz");
  assert.equal(lastSent(island, "orbit-shell:island-hover"), undefined, "near, not over");
  await watch({ x: 960, y: 0 });
  assert.deepEqual(lastSent(island, "orbit-shell:island-hover"), { over: true });
  const sentAfterEnter = island.sent.length;
  await watch({ x: 1000, y: 10 });
  assert.equal(island.sent.length, sentAfterEnter, "one enter, not one per look");
  // the 6-pt margin round the island's rect: x 862 … 1058, y up to 36
  await watch({ x: 1058, y: 36 });
  assert.equal(lastSent(island, "orbit-shell:island-hover").over, true);
  await watch({ x: 1059, y: 36 });
  assert.deepEqual(lastSent(island, "orbit-shell:island-hover"), { over: false });
  // grown to listen under the pointer: its new size counts
  invoke("orbit-shell:island-look", island, { width: 272, height: 30 });
  await watch({ x: 1059, y: 20 });
  assert.equal(lastSent(island, "orbit-shell:island-hover").over, true);
  await watch({ x: 960, y: 700 });
  assert.equal(lastSent(island, "orbit-shell:island-hover").over, false);
  assert.equal(nextPoll(), 250);
  cleanup();
});

test("while talk is on, main says when the pointer is over the laptop's real notch, a display that isn't the main one", async () => {
  const { summon, talkWindow, invoke, watch, nextPoll, lastSent, cleanup } = fixture({ cursor: { x: -700, y: 600 } });
  summon.start();
  await summon.summonTalk();
  const island = talkWindow();
  assert.deepEqual(island.getBounds(), ON_LAPTOP);
  invoke("orbit-shell:island-look", island, { width: 185, height: 32 });
  // the notch is 185 wide at x 665 of the laptop: -847 … -662 on the desk
  await watch({ x: -1512 + 665 + 92, y: 98 });
  assert.equal(nextPoll(), 16, "the laptop's own top edge is near");
  assert.deepEqual(lastSent(island, "orbit-shell:island-hover"), { over: true }, "right under the camera");
  await watch({ x: -1512 + 665 - 7, y: 100 });
  assert.equal(lastSent(island, "orbit-shell:island-hover").over, false, "left of the notch, past the 6-pt margin");
  await watch({ x: -1512 + 665 - 5, y: 100 });
  assert.equal(lastSent(island, "orbit-shell:island-hover").over, true, "within the margin");
  await watch({ x: -1512 + 665 + 92, y: 98 + 32 + 7 });
  assert.equal(lastSent(island, "orbit-shell:island-hover").over, false, "below it");
  // the same spot on the LG is not the laptop's island
  await watch({ x: -1512 + 665 + 92 + 1512, y: 0 });
  assert.equal(lastSent(island, "orbit-shell:island-hover").over, false);
  assert.deepEqual(island.getBounds(), ON_LAPTOP, "the island never follows the pointer");
  cleanup();
});

test("the pointer watch stops, and says the pointer left, once the talk window hides", async () => {
  const { summon, talkWindow, invoke, watch, pending, lastSent, cleanup } = fixture();
  summon.start();
  await summon.summonTalk();
  const island = talkWindow();
  invoke("orbit-shell:island-look", island, { width: 184, height: 30 });
  await watch({ x: 960, y: 0 });
  assert.equal(lastSent(island, "orbit-shell:island-hover").over, true);
  invoke("orbit-shell:talk-state", island, "listening");
  invoke("orbit-shell:talk-state", island, "idle");
  invoke("orbit-shell:talk-dismiss", island);
  await watch();
  assert.equal(pending.size, 0);
  assert.equal(lastSent(island, "orbit-shell:island-hover").over, false);
  cleanup();
});

test("no island on a platform without a voice engine", async () => {
  for (const platform of ["linux"]) {
    const { summon, talkWindow, cleanup } = fixture({ platform });
    summon.start();
    await settle();
    await summon.summonTalk();
    assert.equal(talkWindow(), undefined, platform);
    cleanup();
  }
});
