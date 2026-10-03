import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

// The real preload source, run with the Orbit shell's argv: messages main
// sends to a page that has not subscribed yet must wait for it.
const source = readFileSync(new URL("./preload.cjs", import.meta.url), "utf8");
const origin = "http://127.0.0.1:48993";

function fixture({ now = () => 1_000 } = {}) {
  const listeners = new Map();
  const invoked = [];
  let bridge;
  const context = vm.createContext({
    process: { platform: "darwin", argv: [`--orbit-local-origin=${origin}`, "--orbit-shell=1"] },
    location: { origin },
    TextEncoder,
    queueMicrotask,
    Date: { now },
    localStorage: { getItem: () => null },
    require: () => ({
      webUtils: {},
      contextBridge: { exposeInMainWorld: (_key, value) => { bridge = value; } },
      ipcRenderer: {
        on: (channel, handler) => {
          if (!listeners.has(channel)) listeners.set(channel, new Set());
          listeners.get(channel).add(handler);
        },
        removeListener: (channel, handler) => listeners.get(channel)?.delete(handler),
        send: () => {},
        invoke: (channel, ...args) => { invoked.push([channel, ...args]); return Promise.resolve(); },
      },
    }),
  });
  vm.runInContext(source, context);
  const emit = (channel, ...args) => {
    for (const handler of listeners.get(channel) ?? []) handler({}, ...args);
  };
  return { bridge, emit, invoked };
}

const tick = () => new Promise((resolve) => setImmediate(resolve));

test("Open in Orbit reaching a window made just now waits for the app to subscribe", async () => {
  const { bridge, emit } = fixture();
  emit("orbit-shell:open-thread", { botId: "b1", threadId: "t1" });
  emit("orbit-shell:open-thread", { botId: "b2", threadId: "t2", extra: "dropped" });
  const calls = [];
  // StrictMode: a subscription dropped at once must not consume it.
  bridge.orbitShell.onOpenThread((target) => calls.push(["transient", target]))();
  const off = bridge.orbitShell.onOpenThread((target) => calls.push(["app", target]));
  await tick();
  assert.deepEqual(JSON.parse(JSON.stringify(calls)), [["app", { botId: "b2", threadId: "t2" }]], "only the newest, once");
  emit("orbit-shell:open-thread", { botId: "b3", threadId: "t3" });
  assert.equal(calls.length, 2, "a subscribed app gets it directly");
  off();
  const late = bridge.orbitShell.onOpenThread((target) => calls.push(["late", target]));
  await tick();
  assert.equal(calls.length, 2, "nothing replayed to a later subscriber");
  late();
});

test("plain Settings from the shell or the menu waits for the app too", async () => {
  const { bridge, emit } = fixture();
  emit("app:open-settings");
  const calls = [];
  const off = bridge.onOpenAppSettings((section) => calls.push(section ?? "plain"));
  await tick();
  assert.deepEqual(calls, ["plain"]);
  off();
});

test("a request nobody took for a long while is not replayed", async () => {
  let clock = 0;
  const { bridge, emit } = fixture({ now: () => clock });
  emit("app:open-settings");
  emit("orbit-shell:open-thread", { botId: "b", threadId: "t" });
  clock = 60_000;
  const calls = [];
  const offSettings = bridge.onOpenAppSettings(() => calls.push("settings"));
  const offThread = bridge.orbitShell.onOpenThread(() => calls.push("thread"));
  await tick();
  assert.deepEqual(calls, []);
  offSettings();
  offThread();
});

test("a shell page learns whether its window is shown, even if it subscribes late", () => {
  const { bridge, emit } = fixture();
  const seen = [];
  const off = bridge.orbitShell.onVisibility((visible) => seen.push(visible));
  assert.deepEqual(seen, [], "nothing known yet");
  emit("orbit-shell:visibility", { visible: true });
  emit("orbit-shell:visibility", { visible: false });
  off();
  const late = [];
  bridge.orbitShell.onVisibility((visible) => late.push(visible));
  assert.deepEqual(seen, [true, false]);
  assert.deepEqual(late, [false], "the newest value, at once");
});

test("the talk page gets no ambient island bridge or setting", () => {
  const { bridge } = fixture();
  assert.equal(bridge.orbitShell.onIsland, undefined);
  assert.equal(bridge.orbitShell.setNotchIsland, undefined);
});

test("the talk page hears main's pointer watch and tells main its island's size", () => {
  const { bridge, emit, invoked } = fixture();
  const seen = [];
  const off = bridge.orbitShell.onIslandHover((over) => seen.push(over));
  emit("orbit-shell:island-hover", { over: true });
  emit("orbit-shell:island-hover", { over: false });
  emit("orbit-shell:island-hover", null);
  off();
  emit("orbit-shell:island-hover", { over: true });
  assert.deepEqual(seen, [true, false, false], "a boolean, and nothing after unsubscribing");
  bridge.orbitShell.islandLook({ width: 273, height: 32, rest: false, extra: "dropped" });
  bridge.orbitShell.islandLook({ width: 185, height: 32 });
  assert.deepEqual(JSON.parse(JSON.stringify(invoked)), [
    ["orbit-shell:island-look", { width: 273, height: 32 }],
    ["orbit-shell:island-look", { width: 185, height: 32 }],
  ]);
});
