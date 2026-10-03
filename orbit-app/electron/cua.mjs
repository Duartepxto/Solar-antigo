// CUA computer-use wiring for the Electron main process.
//
// Two modes, per cua-driver's EMBEDDING.md:
//  - "embedded" (packaged app): spawn our own private daemon so TCC grants
//    attribute to Orbit and the driver inherits them. One prompt, named
//    Orbit, out of the box. On macOS Orbit launches `serve --embedded`
//    itself (electron/cua-embedded-daemon.mjs) so it can pass
//    `--grant existing-profile`: attaching to the person's logged-in browser
//    is then decided by Orbit's own consent card, never by the driver alone.
//    If that launch fails, the SDK's EmbeddedCuaDriverHost starts the daemon
//    without the grant, so computer use keeps working. Windows keeps the SDK.
//  - "standalone" (dev): attach to an already-installed CuaDriver.app daemon
//    (its own TCC identity, typically already granted on a dev machine).
//
// Agents never talk to the daemon socket directly — they spawn the official
// stdio MCP proxy: `cua-driver mcp [--embedded --socket <path>]`. The proxy
// executes nothing; the host-owned daemon does.
//
// The resulting connection descriptor is written to
// <userData>/cua-connection.json for the harness server to hand to drivers.

import { app, ipcMain } from "electron";
import { execFile } from "node:child_process";
import { createRequire } from "node:module";
import { promisify } from "node:util";
import { setTimeout as delay } from "node:timers/promises";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { pathToFileURL } from "node:url";
import localOriginModule from "./local-origin.cjs";
import { OrbitEmbeddedDriverHost } from "./cua-embedded-daemon.mjs";

// Local control answers only the local server's UI (electron/local-origin.cjs).
const { localOnly } = localOriginModule;

const require = createRequire(import.meta.url);
const { createCuaConnectionStore } = require("./cua-connection.cjs");
const {
  createLinuxCuaPreferenceStore,
  createLinuxCuaRuntime,
  createUnavailableLinuxRuntime,
} = require("./cua-linux-runtime.cjs");
const {
  cleanupAppImageCuaBundle,
  reapStaleAppImageCuaBundles,
  stageAppImageCuaBundle,
} = require("./cua-linux-bundle.cjs");
const { linuxLocalControlSupport } = require("./capabilities.cjs");

const INSTALLED_DRIVER = "/Applications/CuaDriver.app/Contents/MacOS/cua-driver";
const STANDALONE_SOCKET = path.join(
  app.getPath("home"),
  "Library/Caches/cua-driver/cua-driver.sock",
);
const HOST_BUNDLE_ID = "com.orbit.app";
const CUA_ENV = { CUA_DRIVER_RS_TELEMETRY_ENABLED: "0" };
const execFileAsync = promisify(execFile);
process.env.CUA_DRIVER_RS_TELEMETRY_ENABLED ??= "0";

// Where cua-driver installs itself on Windows: under the user profile, with
// the packages directory holding the versioned releases. The installer's own
// directory is kept as a fallback for machines where the layout differs.
const WIN_INSTALLED_DRIVERS = [
  path.join(app.getPath("home"), ".cua-driver", "packages", "current", "cua-driver.exe"),
  path.join(app.getPath("home"), "AppData", "Local", "Programs", "CuaDriver", "cua-driver.exe"),
];
let embeddedHost = null; // OrbitEmbeddedDriverHost | EmbeddedCuaDriverHost | null
// When an Orbit-launched daemon dies on its own, Orbit restarts it a few
// times with a growing delay; a daemon that keeps dying stays unavailable.
const CRASH_RESTART_WINDOW_MS = 5 * 60_000;
const CRASH_RESTART_LIMIT = 3;
let crashRestarts = [];
let startupAbort = null;
let lifecycleGeneration = 0;
let macRetry = null;
let linuxRuntime = null;
let linuxBundleStage = null;
let stateListener = () => {};
const connectionStore = createCuaConnectionStore({
  getUserData: () => app.getPath("userData"),
});

function ensureLinuxRuntime() {
  if (!linuxRuntime) {
    const support = linuxLocalControlSupport(process.platform, process.env);
    if (!support.available) {
      linuxRuntime = createUnavailableLinuxRuntime({
        connectionStore,
        preferenceStore: createLinuxCuaPreferenceStore({
          getUserData: () => app.getPath("userData"),
        }),
        clearPreference: true,
        reasonCode: support.reasonCode,
        message: support.message,
        onChange: (connection) => stateListener(connection),
      });
      return linuxRuntime;
    }
    try {
      let bundledDriverPath;
      if (app.isPackaged && !process.env.CUA_DRIVER_PATH) {
        bundledDriverPath = path.join(process.resourcesPath, "cua-linux-x64", "cua-driver");
        // AppImage builders may normalize the read-only resource tree to 0755
        // or 0775. Always copy only the pinned binaries to a fresh 0700
        // process-owned directory and verify their hashes after the copy, so
        // every AppImage follows the same execution invariant.
        if (process.env.APPIMAGE) {
          reapStaleAppImageCuaBundles();
          linuxBundleStage ??= stageAppImageCuaBundle({ resourcesPath: process.resourcesPath });
          bundledDriverPath = linuxBundleStage.driverPath;
        }
      }
      linuxRuntime = createLinuxCuaRuntime({
        getUserData: () => app.getPath("userData"),
        connectionStore,
        bundledDriverPath,
        onChange: (connection) => stateListener(connection),
      });
    } catch (error) {
      console.error("[cua] Bundled Linux driver failed integrity validation:", error);
      linuxRuntime = createUnavailableLinuxRuntime({
        connectionStore,
        onChange: (connection) => stateListener(connection),
      });
    }
  }
  return linuxRuntime;
}

export function setCuaStateListener(listener) {
  stateListener = typeof listener === "function" ? listener : () => {};
}

function persistAndNotify(next) {
  const connection = connectionStore.persist(next);
  stateListener(connection);
  return connection;
}

export function resolveWindowsDriver() {
  for (const candidate of WIN_INSTALLED_DRIVERS) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

export function resolveDriverBinary() {
  if (process.env.CUA_DRIVER_PATH) return process.env.CUA_DRIVER_PATH;
  if (app.isPackaged) {
    const bundled = path.join(process.resourcesPath, "cua-driver" + (process.platform === "win32" ? ".exe" : ""));
    if (fs.existsSync(bundled)) return bundled;
  }
  if (process.platform === "darwin" && fs.existsSync(INSTALLED_DRIVER)) return INSTALLED_DRIVER;
  if (process.platform === "win32") {
    const staged = path.join(app.getAppPath(), "dist-native", "cua-win32-x64", "cua-driver.exe");
    return fs.existsSync(staged) ? staged : resolveWindowsDriver();
  }
  return null;
}

export function resolveEmbeddedDriverBinary(binary) {
  if (process.platform !== "win32" || !app.isPackaged || process.env.CUA_DRIVER_PATH ||
      binary !== path.join(process.resourcesPath, "cua-driver.exe")) return binary;
  const background = path.join(process.resourcesPath, "cua-driver-background.exe");
  if (!fs.existsSync(background)) throw new Error("Packaged background CUA driver is missing; reinstall Orbit");
  return background;
}

function socketAlive(sockPath) {
  return new Promise((resolve) => {
    if (!fs.existsSync(sockPath)) return resolve(false);
    const s = net.createConnection(sockPath);
    let timer;
    const done = (ok) => {
      clearTimeout(timer);
      s.destroy();
      resolve(ok);
    };
    s.once("connect", () => done(true));
    s.once("error", () => done(false));
    timer = setTimeout(() => done(false), 1500);
    timer.unref();
  });
}

async function loadEmbeddedSdk() {
  if (!app.isPackaged) {
    if (process.platform === "win32") return import("@trycua/cua-driver/embedded");
    const [embedded, permissions] = await Promise.all([
      import("@trycua/cua-driver/embedded"),
      import("@trycua/cua-driver/electron"),
    ]);
    return { ...embedded, ...permissions };
  }
  const isWindows = process.platform === "win32";
  process.env.ORBIT_CUA_SDK_LIBRARY = path.join(
    process.resourcesPath,
    "cua-sdk",
    "native",
    isWindows ? "cua_driver_sdk.dll" : "libcua_driver_sdk.dylib",
  );
  return import(pathToFileURL(path.join(process.resourcesPath, "cua-sdk", "cua-sdk.mjs")).href);
}

async function attachStandalone(signal) {
  // Windows must stay on the owned embedded host, never an unrelated daemon.
  if (process.platform !== "darwin") return null;
  const driver = fs.existsSync(INSTALLED_DRIVER) ? INSTALLED_DRIVER : null;
  if (!driver) return null;
  if (!(await socketAlive(STANDALONE_SOCKET))) {
    signal.throwIfAborted();
    // Launch CuaDriver.app through LaunchServices so Accessibility /
    // Screen Recording stay on com.trycua.driver — the identity this
    // machine already granted — instead of the freshly signed Orbit.
    const launch = execFileAsync("/usr/bin/open", ["-a", "CuaDriver"], {
      timeout: 8_000, killSignal: "SIGKILL", maxBuffer: 8_192,
    });
    // execFile's AbortSignal path can send TERM independently of its timeout
    // killSignal. Stop must also bound a launcher that ignores TERM.
    const abort = () => launch.child.kill("SIGKILL");
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) abort();
    try { await launch; }
    finally { signal.removeEventListener("abort", abort); }
    for (let i = 0; i < 25; i++) {
      signal.throwIfAborted();
      if (await socketAlive(STANDALONE_SOCKET)) break;
      await delay(200, undefined, { signal });
    }
  }
  if (!(await socketAlive(STANDALONE_SOCKET))) return null;
  return {
    mode: "standalone",
    socketPath: STANDALONE_SOCKET,
    mcpCommand: driver,
    mcpArgs: ["mcp"],
    mcpEnv: { ...CUA_ENV },
  };
}

async function startEmbedded(binary, signal) {
  // Import from the staged Resources tree in production. The app intentionally
  // excludes general node_modules, so a bare package import only works in dev.
  const sdk = await loadEmbeddedSdk();
  signal.throwIfAborted();
  // CUA's embedding contract requires grants before the child daemon starts;
  // these SDK calls execute in Electron main so macOS attributes them to
  // Orbit rather than to a terminal or helper process.
  if (process.platform === "darwin") {
    const permissionStatus = sdk.requestMacOSPermissions();
    if (!sdk.hasRequiredMacOSPermissions(permissionStatus)) {
      const missing = [
        !permissionStatus.accessibility && "Accessibility",
        !permissionStatus.screenRecording && "Screen Recording",
      ].filter(Boolean).join(" and ");
      throw new Error(`${missing || "macOS permissions"} required; grant access in System Settings and restart Orbit`);
    }
  }
  if (process.platform === "darwin" && process.env.ORBIT_CUA_SDK_HOST !== "1") {
    try {
      return await startOrbitHost(binary, signal);
    } catch (err) {
      signal.throwIfAborted();
      console.warn(`[cua] Orbit's own driver launch failed; starting the SDK host without browser-profile access: ${err?.message ?? err}`);
    }
  }
  // The native SDK owns the child lifecycle but exposes no windowsHide option.
  const host = new sdk.EmbeddedCuaDriverHost(resolveEmbeddedDriverBinary(binary), HOST_BUNDLE_ID);
  try {
    const conn = await host.start({ signal });
    signal.throwIfAborted();
    embeddedHost = host;
    return {
      mode: "embedded",
      socketPath: conn.socketPath,
      mcpCommand: binary,
      mcpArgs: ["mcp", "--embedded", "--socket", conn.socketPath],
      mcpEnv: { ...CUA_ENV, CUA_DRIVER_EMBEDDED: "1", CUA_DRIVER_HOST_BUNDLE_ID: HOST_BUNDLE_ID },
    };
  } catch (err) {
    try {
      await host.stop();
    } catch {
      // startup already failed; stop is best-effort before destroy
    }
    host.uniffiDestroy?.();
    throw err;
  }
}

/** macOS: Orbit spawns the embedded daemon itself, with the one launch grant
 * that lets a bot attach to the person's logged-in browser. The grant only
 * makes attachment possible; every attachment still waits for the person's
 * explicit approval on Orbit's card (server/browser-profile-consent.ts). */
async function startOrbitHost(binary, signal) {
  const generation = lifecycleGeneration;
  const host = new OrbitEmbeddedDriverHost(binary, HOST_BUNDLE_ID, {
    grants: ["existing-profile"],
    fixedEnv: CUA_ENV,
    onUnexpectedExit: (info) => onOrbitHostExit(host, generation, info),
  });
  try {
    const conn = await host.start({ signal });
    signal.throwIfAborted();
    embeddedHost = host;
    return {
      mode: "embedded",
      socketPath: conn.socketPath,
      mcpCommand: binary,
      mcpArgs: ["mcp", "--embedded", "--socket", conn.socketPath],
      mcpEnv: { ...CUA_ENV, CUA_DRIVER_EMBEDDED: "1", CUA_DRIVER_HOST_BUNDLE_ID: HOST_BUNDLE_ID },
    };
  } catch (err) {
    await host.stop().catch(() => {});
    throw err;
  }
}

function onOrbitHostExit(host, generation, info) {
  if (embeddedHost !== host || generation !== lifecycleGeneration) return;
  embeddedHost = null;
  void host.stop().catch(() => {});
  const how = info?.signal ?? `code ${info?.code}`;
  console.error(`[cua] embedded cua-driver exited unexpectedly (${how})`);
  persistAndNotify({ mode: "unavailable", reason: `cua-driver stopped unexpectedly (${how})` });
  const now = Date.now();
  crashRestarts = crashRestarts.filter((at) => now - at < CRASH_RESTART_WINDOW_MS);
  if (crashRestarts.length >= CRASH_RESTART_LIMIT) {
    console.error("[cua] cua-driver keeps stopping; computer use stays off until Orbit restarts it");
    return;
  }
  crashRestarts.push(now);
  const timer = setTimeout(() => {
    // An explicit Stop or a newer start since the crash owns the lifecycle.
    if (generation !== lifecycleGeneration || embeddedHost) return;
    startCua().catch((error) => console.error("[cua] restart after crash failed:", error));
  }, 1_000 * crashRestarts.length);
  timer.unref?.();
}

export async function startCua() {
  if (process.platform === "linux") return ensureLinuxRuntime().initialize();
  lifecycleGeneration++;
  startupAbort?.abort();
  startupAbort = new AbortController();
  const { signal } = startupAbort;
  const binary = resolveDriverBinary();
  if (!binary) {
    return persistAndNotify({
      mode: "unavailable",
      reason: "cua-driver binary not found",
    });
  }

  const wantEmbedded =
    process.platform === "win32" || app.isPackaged || process.env.ORBIT_CUA_EMBEDDED === "1";
  let nextConnection;

  if (wantEmbedded) {
    try {
      nextConnection = await startEmbedded(binary, signal);
    } catch (err) {
      signal.throwIfAborted();
      try {
        nextConnection = await attachStandalone(signal);
      } catch (standaloneError) {
        signal.throwIfAborted();
        nextConnection = {
          mode: "unavailable",
          reason: `embedded host failed: ${err?.message ?? err}; standalone launch failed: ${standaloneError?.message ?? standaloneError}`,
        };
      }
      if (!nextConnection) {
        nextConnection = {
          mode: "unavailable",
          reason: `embedded host failed: ${err?.message ?? err}`,
        };
      }
    }
  } else if (process.platform === "darwin" && (await socketAlive(STANDALONE_SOCKET))) {
    // Dev machine with the platform CuaDriver daemon already running. Windows
    // is deliberately excluded: there the shared pipe belongs to whatever
    // driver the user happens to have, so it is never adopted implicitly.
    nextConnection = {
      mode: "standalone",
      socketPath: STANDALONE_SOCKET,
      mcpCommand: binary,
      mcpArgs: ["mcp"],
      mcpEnv: { ...CUA_ENV },
    };
  } else {
    nextConnection = {
      mode: "unavailable",
      reason:
        "no running cua-driver daemon; run `cua-driver serve` or grant via `cua-driver permissions grant`",
    };
  }

  signal.throwIfAborted();
  return persistAndNotify(nextConnection);
}

export async function cuaPermissionsStatus() {
  const binary = resolveDriverBinary();
  if (!binary) return { available: false };
  const out = await execFileAsync(binary, ["permissions", "status", "--json"], {
    encoding: "utf8",
    timeout: 5000,
    killSignal: "SIGKILL",
    maxBuffer: 65_536,
    env: { ...process.env, ...CUA_ENV },
  }).catch((error) => ({ stdout: error.stdout }));
  try {
    return { available: true, ...JSON.parse(out.stdout) };
  } catch {
    return { available: true, raw: out.stdout?.trim() };
  }
}

export async function stopCua() {
  lifecycleGeneration++;
  startupAbort?.abort();
  startupAbort = null;
  if (linuxRuntime) {
    await linuxRuntime.shutdown();
    if (linuxBundleStage) {
      cleanupAppImageCuaBundle(linuxBundleStage);
      linuxBundleStage = null;
    }
    return;
  }
  const host = embeddedHost;
  embeddedHost = null;
  if (host) {
    try {
      await host.stop();
      host.uniffiDestroy?.();
    } catch {
      // daemon holds a parent-liveness pipe; host death closes it anyway
    }
  }
  if (!startupAbort && connectionStore.get()) {
    persistAndNotify({ mode: "unavailable", reason: "desktop-host-stopped" });
  }
}

export function registerCuaIpc() {
  ipcMain.handle("cua:connection", localOnly("cua:connection", () => connectionStore.get()));
  ipcMain.handle("cua:permissions", localOnly("cua:permissions", () => cuaPermissionsStatus()));
  ipcMain.handle("cua:linux-status", localOnly("cua:linux-status", () =>
    process.platform === "linux"
      ? ensureLinuxRuntime().getStatus()
      : { enabled: false, status: "unavailable", reasonCode: "unsupported-platform" },
  ));
  ipcMain.handle("cua:linux-enable", localOnly("cua:linux-enable", async () => {
    if (process.platform !== "linux") {
      return { enabled: false, status: "unavailable", reasonCode: "unsupported-platform" };
    }
    try {
      await ensureLinuxRuntime().enable();
    } catch (error) {
      console.error("[cua] Linux enable failed:", error);
    }
    return ensureLinuxRuntime().getStatus();
  }));
  ipcMain.handle("cua:linux-disable", localOnly("cua:linux-disable", async () => {
    if (process.platform !== "linux") {
      return { enabled: false, status: "unavailable", reasonCode: "unsupported-platform" };
    }
    try {
      await ensureLinuxRuntime().disable();
    } catch (error) {
      console.error("[cua] Linux disable failed:", error);
    }
    return ensureLinuxRuntime().getStatus();
  }));
  ipcMain.handle("cua:linux-retry", localOnly("cua:linux-retry", async () => {
    if (process.platform === "darwin" || process.platform === "win32") {
      // Concurrent IPC requests share the whole stop/start sequence. A later
      // explicit Stop (including quit) or startup cancels its delayed restart.
      const platformLabel = process.platform === "darwin" ? "macOS" : "Windows";
      macRetry ??= (async () => {
        try {
          const stopping = stopCua();
          const generation = lifecycleGeneration;
          await stopping;
          if (generation !== lifecycleGeneration) throw new Error("Computer use restart cancelled");
          const connection = await startCua();
          const ready = connection?.mode === "embedded" || connection?.mode === "standalone";
          return {
            enabled: ready,
            status: ready ? "ready" : "error",
            reasonCode: ready ? undefined : "permissions-required",
            message: connection?.reason,
          };
        } catch (error) {
          console.error(`[cua] ${platformLabel} retry failed:`, error);
          return {
            enabled: false,
            status: "error",
            reasonCode: "permissions-required",
            message: error instanceof Error ? error.message : String(error),
          };
        }
      })().finally(() => { macRetry = null; });
      return macRetry;
    }
    if (process.platform !== "linux") {
      return { enabled: false, status: "unavailable", reasonCode: "unsupported-platform" };
    }
    try {
      await ensureLinuxRuntime().retry();
    } catch (error) {
      console.error("[cua] Linux retry failed:", error);
    }
    return ensureLinuxRuntime().getStatus();
  }));
}
