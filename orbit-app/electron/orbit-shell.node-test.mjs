import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { EventEmitter } from "node:events";
import { captureDisplay, clearCaptureDir, fitCaptureSize, serialized } from "./orbit-capture.mjs";
import { DEFAULT_HOTKEYS, normalizeAccelerator, parsePrefs, readPrefs, writePrefs } from "./orbit-shell-prefs.mjs";
import { createDeferredSender, createHotkeys, createMenuBar, displayAt, islandHoverRect, pointInRect, pointerPollMs, POINTER_FAR_MS, POINTER_NEAR_MS, quickBounds, talkBounds, QUICK_MAX_HEIGHT, QUICK_MIN_HEIGHT, TALK_SIZE } from "./orbit-summon.mjs";
import { createSpeechOwner } from "./speech-owner.mjs";

// Scratch space inside the repo's ignored scratch folder, never /tmp: the
// owner's rule is that nothing of Orbit's lands there.
const scratchRoot = path.join(path.dirname(new URL(import.meta.url).pathname), "..", ".orbit-scratch", "node-tests");
function scratch() {
  fs.mkdirSync(scratchRoot, { recursive: true });
  return fs.mkdtempSync(path.join(scratchRoot, "orbit-shell-"));
}

test("accelerators are normalized to one spelling and need a real modifier", () => {
  assert.equal(normalizeAccelerator("ctrl+option+space"), "Control+Alt+Space");
  assert.equal(normalizeAccelerator("Shift+Alt+Control+Space"), "Control+Alt+Shift+Space");
  assert.equal(normalizeAccelerator("Cmd+Shift+k"), "Shift+Command+K");
  assert.equal(normalizeAccelerator("Control+F5"), "Control+F5");
  assert.equal(normalizeAccelerator("Alt+/"), "Alt+/");
  assert.equal(normalizeAccelerator(""), "");
  assert.equal(normalizeAccelerator("Shift+A"), null, "Shift alone would steal typing");
  assert.equal(normalizeAccelerator("Space"), null);
  assert.equal(normalizeAccelerator("Control+A+B"), null);
  assert.equal(normalizeAccelerator("Control+Banana"), null);
  assert.equal(normalizeAccelerator("Control++"), null);
  assert.equal(normalizeAccelerator(42), null);
});

test("preferences fall back field by field and never share one hotkey", () => {
  assert.deepEqual(parsePrefs(null), { hotkeys: { ...DEFAULT_HOTKEYS }, screenPaused: false });
  assert.deepEqual(parsePrefs({ hotkeys: { quick: "nonsense", talk: "" }, screenPaused: true }), {
    hotkeys: { quick: DEFAULT_HOTKEYS.quick, talk: "" },
    screenPaused: true,
  });
  // the retired "Show Orbit in the notch" switch on disk is read past, not kept
  assert.deepEqual(parsePrefs({ screenPaused: true, notchIsland: false }), { hotkeys: { ...DEFAULT_HOTKEYS }, screenPaused: true });
  assert.equal(parsePrefs({ hotkeys: { quick: "Control+K", talk: "ctrl+k" } }).hotkeys.talk, "");
});

test("the hotkeys are two keys, and the old defaults move to them", () => {
  assert.deepEqual(DEFAULT_HOTKEYS, { quick: "Alt+O", talk: "Alt+T" });
  assert.deepEqual(parsePrefs({ hotkeys: { quick: "Control+Alt+Space", talk: "Control+Alt+Shift+Space" } }).hotkeys, DEFAULT_HOTKEYS);
  assert.deepEqual(parsePrefs({ hotkeys: { quick: "Alt+Space", talk: "Alt+T" } }).hotkeys, DEFAULT_HOTKEYS);
  // one the person chose stays theirs
  assert.deepEqual(parsePrefs({ hotkeys: { quick: "Command+Shift+K", talk: "Control+Alt+Shift+Space" } }).hotkeys, { quick: "Shift+Command+K", talk: "Alt+T" });
});

test("preferences round-trip through userData atomically", () => {
  const dir = scratch();
  const file = path.join(dir, "orbit-shell.json");
  assert.deepEqual(readPrefs(file), parsePrefs(null), "missing file reads as defaults");
  writePrefs(file, { hotkeys: { quick: "Control+Alt+K", talk: "Control+Alt+Shift+K" }, screenPaused: true, notchIsland: false });
  assert.deepEqual(readPrefs(file), { hotkeys: { quick: "Control+Alt+K", talk: "Control+Alt+Shift+K" }, screenPaused: true });
  assert.equal(JSON.parse(fs.readFileSync(file, "utf8")).notchIsland, undefined, "an old key isn't written back");
  assert.deepEqual(fs.readdirSync(dir), ["orbit-shell.json"], "no temp file left behind");
  fs.writeFileSync(file, "{ not json");
  assert.deepEqual(readPrefs(file), parsePrefs(null));
  fs.rmSync(dir, { recursive: true, force: true });
});

test("hotkey registration reports conflicts instead of failing silently", () => {
  const registered = new Map();
  const globalShortcut = {
    register(accelerator, fn) {
      if (accelerator === "Control+Alt+Space") return false; // another app holds it
      if (accelerator === "Control+Bogus") throw new Error("bad accelerator");
      registered.set(accelerator, fn);
      return true;
    },
    unregister(accelerator) { registered.delete(accelerator); },
  };
  const fired = [];
  const hotkeys = createHotkeys({ globalShortcut, handlers: { quick: () => fired.push("quick"), talk: () => fired.push("talk") } });
  const state = hotkeys.apply({ quick: "Control+Alt+Space", talk: "Control+Alt+Shift+Space" });
  assert.equal(state.quick.registered, false);
  assert.equal(state.quick.error, "conflict");
  assert.equal(state.talk.registered, true);
  registered.get("Control+Alt+Shift+Space")();
  assert.deepEqual(fired, ["talk"]);

  const next = hotkeys.apply({ quick: "Control+Bogus", talk: "" });
  assert.equal(next.quick.error, "invalid");
  assert.equal(next.talk.registered, false);
  assert.equal(registered.size, 0, "the old talk shortcut was released");

  hotkeys.apply({ quick: "Control+Alt+K", talk: "Control+Alt+J" });
  assert.equal(hotkeys.suspend(true).quick.suspended, true);
  assert.equal(registered.size, 0, "recording a new shortcut frees the old ones");
  hotkeys.suspend(false);
  assert.deepEqual([...registered.keys()].sort(), ["Control+Alt+J", "Control+Alt+K"]);
  hotkeys.dispose();
  assert.equal(registered.size, 0);
});

test("the menu bar offers the shell's actions and a live pause toggle", () => {
  let paused = false;
  let menu;
  const calls = [];
  class Tray {
    constructor(icon) { this.icon = icon; }
    setToolTip(value) { this.tooltip = value; }
    setContextMenu(value) { menu = value; }
    isDestroyed() { return false; }
    destroy() { calls.push("destroy"); }
  }
  const icon = { template: false, setTemplateImage(value) { this.template = value; } };
  const bar = createMenuBar({
    Tray, Menu: { buildFromTemplate: (items) => items }, nativeImage: { createFromPath: () => icon }, iconPath: "x",
    isPaused: () => paused,
    actions: Object.fromEntries(["quick", "talk", "open", "togglePaused", "settings", "quit"].map((name) => [name, () => calls.push(name)])),
  });
  assert.equal(icon.template, true, "a template image follows light and dark");
  const labels = menu.filter((item) => item.label).map((item) => item.label);
  assert.deepEqual(labels, ["Ask Orbit…", "Talk to Orbit", "Open Orbit", "Pause screen access", "Settings…", "Quit Orbit"]);
  menu.find((item) => item.label === "Pause screen access").click();
  assert.deepEqual(calls, ["togglePaused"]);
  paused = true;
  bar.refresh();
  assert.equal(menu.find((item) => item.label === "Pause screen access").checked, true);
});

test("talk hangs from the top centre like an island and the quick bar sits at the bottom, on the given display", () => {
  const workArea = { x: 1512, y: 25, width: 2560, height: 1375 };
  assert.deepEqual(talkBounds({ x: 1512, y: 0, width: 2560, height: 1440 }, { width: 440, height: 200 }), { x: 1512 + 1060, y: 0, width: 440, height: 200 }, "top centre, from the very top edge");
  // over the real notch, which isn't always dead centre (a 14-inch MacBook Pro)
  assert.equal(talkBounds({ x: 0, y: 0, width: 1512, height: 982 }, { width: 440, height: 200 }, { x: 665, width: 185, height: 32 }).x, Math.round(665 + 92.5 - 220));
  const quick = quickBounds(workArea, 10);
  assert.equal(quick.height, QUICK_MIN_HEIGHT);
  assert.equal(quick.x, 1512 + (2560 - quick.width) / 2);
  assert.equal(quick.y + quick.height, 25 + 1375 - 24, "sits above the Dock");
  const tall = quickBounds(workArea, 10_000);
  assert.equal(tall.height, QUICK_MAX_HEIGHT);
  assert.equal(tall.y + tall.height, 25 + 1375 - 24, "a reply grows it upward");
  assert.equal(quickBounds({ x: 0, y: 0, width: 500, height: 800 }, 80).width, 468, "fits a narrow display");
});

test("the display under the pointer is found on the owner's desk", () => {
  // the LG is the main display, the MacBook (with the notch) to its left
  // and lower
  const lg = { id: 2, bounds: { x: 0, y: 0, width: 1920, height: 1080 } };
  const laptop = { id: 1, bounds: { x: -1512, y: 98, width: 1512, height: 982 } };
  assert.equal(displayAt([laptop, lg], { x: 960, y: 500 }), lg);
  assert.equal(displayAt([laptop, lg], { x: -800, y: 300 }), laptop);
  assert.equal(displayAt([laptop, lg], null), null);
  // on an edge, or just off every display (the gap above the laptop)
  assert.equal(displayAt([laptop, lg], { x: 1919, y: 1079 }), lg);
  assert.equal(displayAt([laptop, lg], { x: 0, y: 0 }), lg);
  assert.equal(displayAt([laptop, lg], { x: -1, y: 98 }), laptop);
  assert.equal(displayAt([laptop, lg], { x: -600, y: 40 }), laptop, "nearest when outside all of them");
  assert.equal(displayAt([], { x: 0, y: 0 }), null);
  // the window holds the 640-pt expanded island
  assert.ok(TALK_SIZE.width >= 640 + 2 * 30 && TALK_SIZE.height >= 300);
});

test("the talking island's rect is grown by 6 pt, and the pointer is watched fast only near the top", () => {
  const window = { x: 600, y: 0, width: 720, height: 320 };
  // hidden on a display without a notch: 184 × the menu bar
  const rect = islandHoverRect(window, { width: 184, height: 30 });
  assert.deepEqual(rect, { x: 600 + 268 - 6, y: -6, width: 196, height: 42 });
  assert.equal(pointInRect({ x: 862, y: 0 }, rect), true, "the 6-pt margin counts");
  assert.equal(pointInRect({ x: 861, y: 0 }, rect), false);
  assert.equal(pointInRect({ x: 960, y: 36 }, rect), true);
  assert.equal(pointInRect({ x: 960, y: 37 }, rect), false);
  assert.equal(islandHoverRect(window, null), null, "no size from the page yet: nothing to take");
  assert.equal(islandHoverRect(window, { width: 0, height: 30 }), null);
  const lg = { id: 2, bounds: { x: 0, y: 0, width: 1920, height: 1080 } };
  const laptop = { id: 1, bounds: { x: -1512, y: 98, width: 1512, height: 982 } };
  assert.equal(pointerPollMs({ x: 300, y: 60 }, lg), POINTER_NEAR_MS, "near the top edge: Coucou's 60 Hz");
  assert.equal(pointerPollMs({ x: 300, y: 500 }, lg), POINTER_FAR_MS, "elsewhere: a few times a second");
  assert.equal(pointerPollMs({ x: -700, y: 150 }, laptop), POINTER_NEAR_MS, "from that display's own top");
  assert.equal(pointerPollMs({ x: -700, y: 300 }, laptop), POINTER_FAR_MS);
  // under an open island (a notice is taller than the top band)
  const open = islandHoverRect(window, { width: 640, height: 132 });
  assert.equal(pointerPollMs({ x: 960, y: 140 }, lg, open), POINTER_NEAR_MS);
  assert.equal(pointerPollMs({ x: 960, y: 300 }, lg, open), POINTER_FAR_MS);
  assert.equal(pointerPollMs(null, null), POINTER_FAR_MS);
  assert.ok(POINTER_NEAR_MS <= 1000 / 30 && POINTER_FAR_MS >= 200 && POINTER_FAR_MS <= 500);
});

test("captures fit the vision model's limits and keep the true scale", () => {
  assert.deepEqual(fitCaptureSize({ size: { width: 1512, height: 982 }, scaleFactor: 1 }), { width: 1512, height: 982 });
  const retina = fitCaptureSize({ size: { width: 1512, height: 982 }, scaleFactor: 2 });
  assert.ok(retina.width <= 2576 && retina.width * retina.height <= 3_750_000);
  assert.ok(Math.abs(retina.width / retina.height - 1512 / 982) < 0.01, "aspect ratio kept");
});

test("a capture stays in memory and maps back with its effective scale", async () => {
  const dir = scratch();
  const display = { id: 7, size: { width: 1512, height: 982 }, scaleFactor: 2, bounds: { x: 0, y: 0, width: 1512, height: 982 } };
  const thumbnail = {
    isEmpty: () => false,
    getSize: () => ({ width: 2400, height: 1559 }),
    toJPEG: () => Buffer.from("jpeg"),
  };
  let asked;
  const desktopCapturer = {
    getSources: async (options) => {
      asked = options;
      return [{ display_id: "3", thumbnail }, { display_id: "7", thumbnail }];
    },
  };
  const result = await captureDisplay({ desktopCapturer, display });
  assert.equal(result.ok, true);
  assert.deepEqual(asked.types, ["screen"]);
  assert.equal(result.displayId, "7");
  assert.equal(result.scaleFactor, 2400 / 1512);
  assert.equal(result.image.toString(), "jpeg");
  assert.equal("file" in result, false, "nothing on disk to point at");
  assert.deepEqual(fs.readdirSync(dir), [], "no screenshot written");

  const empty = { ...thumbnail, isEmpty: () => true };
  const denied = await captureDisplay({ desktopCapturer: { getSources: async () => [{ display_id: "7", thumbnail: empty }] }, display, dir });
  assert.deepEqual(denied, { ok: false, reason: "denied" });
  const failed = await captureDisplay({ desktopCapturer: { getSources: async () => { throw new Error("x"); } }, display, dir });
  assert.deepEqual(failed, { ok: false, reason: "failed" });
  const refused = await captureDisplay({ desktopCapturer: { getSources: async () => { throw new Error("Failed to get sources."); } }, display, dir });
  assert.deepEqual(refused, { ok: false, reason: "denied" }, "what a dev build without Screen Recording really gets");
  fs.rmSync(dir, { recursive: true, force: true });
});

test("screenshots older builds saved are cleared", () => {
  const root = scratch();
  const dir = path.join(root, "orbit-captures");
  fs.mkdirSync(dir);
  for (let i = 10; i < 13; i += 1) fs.writeFileSync(path.join(dir, `screen-${i}.jpg`), "x");
  assert.equal(clearCaptureDir(dir), true);
  assert.equal(fs.existsSync(dir), false);
  assert.equal(clearCaptureDir(dir), true, "an absent folder is fine");
  fs.rmSync(root, { recursive: true, force: true });
});

test("captures run one at a time, so one never restores what another hid", async () => {
  const log = [];
  let hidden = 0;
  const gates = [];
  const capture = serialized(async (name) => {
    hidden += 1;
    log.push(`hide ${name} (${hidden})`);
    await new Promise((resolve) => gates.push(resolve));
    log.push(`shot ${name} (${hidden})`);
    hidden -= 1;
    if (name === "b") throw new Error("boom");
    return name;
  });
  const a = capture("a");
  const b = capture("b");
  const c = capture("c");
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(gates.length, 1, "the second waits for the first");
  gates.shift()();
  assert.equal(await a, "a");
  await new Promise((resolve) => setImmediate(resolve));
  gates.shift()();
  await assert.rejects(b, /boom/);
  await new Promise((resolve) => setImmediate(resolve));
  gates.shift()();
  assert.equal(await c, "c", "a failed capture does not stall the queue");
  assert.deepEqual(log, ["hide a (1)", "shot a (1)", "hide b (1)", "shot b (1)", "hide c (1)", "shot c (1)"]);
});

function fakeWindow({ loading = false } = {}) {
  const webContents = new EventEmitter();
  webContents.loading = loading;
  webContents.sent = [];
  webContents.isLoading = () => webContents.loading;
  webContents.send = (channel, payload) => webContents.sent.push([channel, payload]);
  return { webContents, destroyed: false, isDestroyed() { return this.destroyed; } };
}

test("a page still loading gets one listener and the newest payload per channel", () => {
  const timers = [];
  const send = createDeferredSender({ delayMs: 300, schedule: (fn, ms) => timers.push([fn, ms]) });
  const win = fakeWindow({ loading: true });
  send(win, "orbit-shell:talk-summon", { n: 1 });
  send(win, "orbit-shell:talk-summon", { n: 2 });
  send(win, "orbit-shell:overlay", { border: true }, "overlay:border");
  send(win, "orbit-shell:overlay", { point: { x: 1 } }, "overlay:point");
  send(win, "orbit-shell:overlay", { point: { x: 2 } }, "overlay:point");
  assert.equal(win.webContents.listenerCount("did-finish-load"), 1, "no pile of load listeners");
  assert.deepEqual(win.webContents.sent, []);
  win.webContents.loading = false;
  win.webContents.emit("did-finish-load");
  assert.equal(timers.length, 1);
  assert.equal(timers[0][1], 300);
  // Sent while the post-load delay runs: still waits, still one per key.
  send(win, "orbit-shell:talk-summon", { n: 3 });
  timers[0][0]();
  // in the order of each key's newest send
  assert.deepEqual(win.webContents.sent, [
    ["orbit-shell:overlay", { border: true }],
    ["orbit-shell:overlay", { point: { x: 2 } }],
    ["orbit-shell:talk-summon", { n: 3 }],
  ]);
  send(win, "orbit-shell:talk-toggle", {});
  assert.deepEqual(win.webContents.sent.at(-1), ["orbit-shell:talk-toggle", {}], "a loaded page gets it at once");

  const gone = fakeWindow({ loading: true });
  send(gone, "x", 1);
  gone.destroyed = true;
  gone.webContents.emit("did-finish-load");
  timers.at(-1)[0]();
  assert.deepEqual(gone.webContents.sent, [], "never to a destroyed window");
});

test("hotkeys suspended by a page come back when that page goes away or navigates", () => {
  const registered = new Set();
  const globalShortcut = {
    register(accelerator) { registered.add(accelerator); return true; },
    unregister(accelerator) { registered.delete(accelerator); },
  };
  const hotkeys = createHotkeys({ globalShortcut, handlers: {} });
  hotkeys.apply({ quick: "Control+Alt+K", talk: "Control+Alt+J" });
  for (const event of ["destroyed", "did-navigate", "render-process-gone"]) {
    const page = new EventEmitter();
    let resumed = 0;
    hotkeys.suspend(true, page, () => { resumed += 1; });
    assert.equal(registered.size, 0);
    page.emit(event);
    assert.equal(registered.size, 2, `resumed on ${event}`);
    assert.equal(resumed, 1);
    assert.equal(hotkeys.snapshot().quick.suspended, false);
    assert.equal(page.listenerCount("destroyed") + page.listenerCount("did-navigate"), 0, "no listeners left behind");
  }
  const page = new EventEmitter();
  hotkeys.suspend(true, page);
  hotkeys.suspend(false, page);
  assert.equal(page.listenerCount("destroyed"), 0, "an ordinary resume stops watching");
  hotkeys.dispose();
});

test("speech: only the owner stops or finishes, and a preempted owner is told", () => {
  const notices = [];
  const launched = [];
  const owner = createSpeechOwner({
    notify: (win, info) => notices.push([win, info]),
    launch: (win, options, session) => {
      const handle = { win, options, session, stops: 0, finishes: 0, stop() { this.stops += 1; }, finish() { this.finishes += 1; } };
      launched.push(handle);
      return win === "broken" ? null : handle;
    },
  });
  assert.equal(owner.start("main", {}), true);
  assert.equal(owner.owner(), "main");
  assert.equal(owner.stop("talk"), false, "talk cannot stop the app's dictation");
  assert.equal(owner.finish("talk"), false);
  assert.equal(launched[0].stops + launched[0].finishes, 0);

  owner.start("talk", { endpointMs: 1200 });
  assert.equal(launched[0].stops, 1, "the old helper was stopped");
  assert.equal(launched[0].session.current(), false, "its late output is not delivered");
  assert.deepEqual(notices, [["main", { code: 1, reason: "preempted" }]]);
  assert.equal(owner.finish("talk"), true);
  assert.equal(launched[1].finishes, 1);
  assert.equal(owner.owner(), "talk", "finishing keeps ownership until the final transcript");

  owner.start("talk", {});
  assert.equal(notices.length, 1, "restarting your own session is not a preemption");
  launched[2].session.release();
  assert.equal(owner.owner(), null, "a helper that ended on its own frees it");
  launched[1].session.release();
  assert.equal(owner.owner(), null);

  owner.start("main", {});
  assert.equal(owner.release("talk"), false);
  assert.equal(owner.release("main"), true);
  assert.equal(launched[3].stops, 1);
  assert.equal(notices.length, 1, "a closing window is not told anything");

  assert.equal(owner.start("broken", {}), false);
  assert.equal(owner.owner(), null, "a helper that could not start owns nothing");
});

test("scratch space for these tests is not the system temp dir", () => {
  assert.ok(!scratchRoot.startsWith(os.tmpdir()));
});
