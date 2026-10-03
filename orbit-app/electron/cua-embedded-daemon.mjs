// Orbit's own launch of the embedded cua-driver daemon on macOS.
//
// The SDK's EmbeddedCuaDriverHost has no way to pass launch grants, and an
// existing logged-in Chromium profile can only be attached in standard mode
// when the trusted launcher starts the daemon with `--grant existing-profile`
// (cua-driver's EMBEDDING.md allows a host to start `serve --embedded` itself).
// So Orbit spawns the daemon the same way the SDK does, plus that one grant,
// and owns the consent: the harness shows the person a card before any bot
// attaches to their browser (server/browser-profile-consent.ts).
//
// Mirrors the SDK host (cua-driver-sdk 0.28.x, read from the running
// daemon's argv and environment):
//   serve --embedded --parent-liveness-stdio --no-permissions-gate
//         --socket <private path> --host-bundle-id <id> --permission-mode standard
// with an allowlisted environment plus CUA_DRIVER_EMBEDDED_HOST_PID. The
// daemon exits when its stdin closes (parent liveness), so Orbit dying takes
// the daemon with it; an orderly stop still closes stdin, then TERM, then KILL.
//
// Spawned directly from Electron main (never `open`, never a helper), so
// macOS TCC keeps attributing the daemon to Orbit.

import { spawn as nodeSpawn } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";

/** The grants this launcher knows how to pass. Anything else is refused so a
 * typo can never widen what the daemon is allowed to do. */
export const SUPPORTED_GRANTS = Object.freeze(["existing-profile"]);

/** Environment names the SDK host lets through, plus the two documented
 * window-change tuning variables. Everything else in Orbit's environment
 * (tokens, API keys, ELECTRON_*) stays out of the daemon. */
export const EMBEDDED_ENV_ALLOWLIST = Object.freeze([
  "HOME",
  "LANG",
  "LC_ALL",
  "LC_CTYPE",
  "LOGNAME",
  "PATH",
  "SHELL",
  "TMPDIR",
  "USER",
  "CUA_DRIVER_WINDOW_CHANGE_TIMEOUT_MS",
  "CUA_DRIVER_WINDOW_CHANGE_POLL_MS",
]);

/** macOS sun_path is 104 bytes including the terminator. */
const MAX_SOCKET_PATH = 103;
export const STARTUP_TIMEOUT_MS = 15_000;
// Leaves room inside main.mjs's 2.5s before-quit budget.
const LIVENESS_EXIT_MS = 1_200;
const TERM_EXIT_MS = 700;

/** The daemon's argv. Pure, so the launch contract is pinned by a test. */
export function buildEmbeddedServeArgs({ socketPath, hostBundleId, grants = [] }) {
  if (typeof socketPath !== "string" || !path.isAbsolute(socketPath)) {
    throw new Error("embedded cua-driver socket path must be absolute");
  }
  if (typeof hostBundleId !== "string" || !/^[^\s\p{Cc}]{1,255}$/u.test(hostBundleId)) {
    throw new Error("embedded cua-driver host bundle id is invalid");
  }
  const unique = [...new Set(grants)];
  for (const grant of unique) {
    if (!SUPPORTED_GRANTS.includes(grant)) throw new Error(`unsupported cua-driver grant: ${grant}`);
  }
  return [
    "serve",
    "--embedded",
    "--parent-liveness-stdio",
    "--no-permissions-gate",
    "--socket", socketPath,
    "--host-bundle-id", hostBundleId,
    "--permission-mode", "standard",
    ...unique.flatMap((grant) => ["--grant", grant]),
  ];
}

/** The daemon's environment: the allowlist from the parent plus the fixed
 * embedding contract. Pure. */
export function buildEmbeddedServeEnv(parentEnv, { hostBundleId, hostPid, fixed = {} }) {
  const env = {};
  for (const name of EMBEDDED_ENV_ALLOWLIST) {
    const value = parentEnv[name];
    if (typeof value === "string" && value !== "") env[name] = value;
  }
  return {
    ...env,
    ...fixed,
    CUA_DRIVER_EMBEDDED: "1",
    CUA_DRIVER_HOST_BUNDLE_ID: hostBundleId,
    CUA_DRIVER_EMBEDDED_HOST_PID: String(hostPid),
  };
}

function probeSocket(socketPath, { connect = net.createConnection, timeoutMs = 500 } = {}) {
  return new Promise((resolve) => {
    let settled = false;
    const socket = connect(socketPath);
    const done = (ok) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      socket.destroy();
      resolve(ok);
    };
    const timer = setTimeout(() => done(false), timeoutMs);
    timer.unref?.();
    socket.once("connect", () => done(true));
    socket.once("error", () => done(false));
  });
}

function abortError(signal) {
  const reason = signal?.reason;
  if (reason instanceof Error) return reason;
  return Object.assign(new Error("embedded cua-driver startup cancelled"), { name: "AbortError" });
}

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(abortError(signal));
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(abortError(signal));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

/**
 * A host with the same shape Orbit used from the SDK: `start({ signal })`
 * resolves `{ socketPath, pid }` once the daemon accepts connections on a
 * private socket; `stop()` is idempotent and cancels a start in progress.
 * `onUnexpectedExit` fires once if a ready daemon dies on its own.
 */
export class OrbitEmbeddedDriverHost {
  constructor(binaryPath, hostBundleId, options = {}) {
    if (typeof binaryPath !== "string" || !path.isAbsolute(binaryPath)) {
      throw new Error("embedded cua-driver binary path must be absolute");
    }
    this.binaryPath = binaryPath;
    this.hostBundleId = hostBundleId;
    this.grants = options.grants ?? [];
    this.env = options.env ?? process.env;
    this.fixedEnv = options.fixedEnv ?? {};
    this.hostPid = options.hostPid ?? process.pid;
    this.tmpRoot = options.tmpRoot ?? os.tmpdir();
    this.startupTimeoutMs = options.startupTimeoutMs ?? STARTUP_TIMEOUT_MS;
    this.spawn = options.spawn ?? nodeSpawn;
    this.fs = options.fs ?? fs;
    this.connect = options.connect ?? net.createConnection;
    this.getuid = options.getuid ?? (() => process.getuid?.() ?? -1);
    this.onUnexpectedExit = options.onUnexpectedExit ?? (() => {});
    this.child = null;
    this.socketDir = null;
    this.socketPath = null;
    this.ready = false;
    this.stopping = null;
    this.startAbort = null;
    this.stderrTail = "";
  }

  async start({ signal } = {}) {
    if (this.child || this.stopping) throw new Error("embedded cua-driver host is already started");
    this.startAbort = new AbortController();
    const internal = this.startAbort.signal;
    const onOuterAbort = () => this.startAbort?.abort(signal.reason);
    signal?.addEventListener("abort", onOuterAbort, { once: true });
    if (signal?.aborted) onOuterAbort();
    try {
      return await this.#start(internal);
    } catch (error) {
      await this.#teardown();
      throw error;
    } finally {
      signal?.removeEventListener("abort", onOuterAbort);
      this.startAbort = null;
    }
  }

  async #start(signal) {
    if (signal.aborted) throw abortError(signal);
    // A fresh 0700 directory per daemon generation. Never a shared /tmp name:
    // on macOS os.tmpdir() is the per-user /var/folders/…/T.
    const dir = await this.fs.promises.mkdtemp(path.join(this.tmpRoot, "orbit-cua-"));
    this.socketDir = dir;
    await this.fs.promises.chmod(dir, 0o700);
    const socketPath = path.join(dir, "cua.sock");
    if (Buffer.byteLength(socketPath) > MAX_SOCKET_PATH) {
      throw new Error(`embedded cua-driver socket path is too long (${Buffer.byteLength(socketPath)} bytes)`);
    }
    this.socketPath = socketPath;
    const args = buildEmbeddedServeArgs({ socketPath, hostBundleId: this.hostBundleId, grants: this.grants });
    const env = buildEmbeddedServeEnv(this.env, {
      hostBundleId: this.hostBundleId,
      hostPid: this.hostPid,
      fixed: this.fixedEnv,
    });
    if (signal.aborted) throw abortError(signal);

    const child = this.spawn(this.binaryPath, args, {
      env,
      // stdin is the parent-liveness pipe: the daemon exits when it closes.
      stdio: ["pipe", "ignore", "pipe"],
      detached: false,
      windowsHide: true,
    });
    this.child = child;
    child.stdin?.on("error", () => {});
    child.stderr?.on("data", (chunk) => {
      this.stderrTail = (this.stderrTail + String(chunk)).slice(-4_096);
    });

    let exited = null;
    const exitedEarly = new Promise((_, reject) => {
      child.once("error", (error) => {
        exited = { error };
        reject(new Error(`could not start embedded cua-driver: ${error.message}`));
      });
      child.once("exit", (code, exitSignal) => {
        exited = { code, signal: exitSignal };
        if (!this.ready) {
          const tail = this.stderrTail.trim().split("\n").slice(-3).join(" ").slice(0, 600);
          reject(new Error(`embedded cua-driver exited before it was ready (${exitSignal ?? `code ${code}`})${tail ? `: ${tail}` : ""}`));
        } else if (!this.stopping) {
          this.onUnexpectedExit({ code, signal: exitSignal, stderr: this.stderrTail });
        }
      });
    });
    exitedEarly.catch(() => {});

    const deadline = Date.now() + this.startupTimeoutMs;
    const waitReady = (async () => {
      for (;;) {
        if (signal.aborted) throw abortError(signal);
        if (exited) return;
        if (await probeSocket(socketPath, { connect: this.connect })) return;
        if (Date.now() >= deadline) {
          throw new Error(`embedded cua-driver did not accept connections within ${this.startupTimeoutMs} ms`);
        }
        await sleep(100, signal);
      }
    })();
    await Promise.race([waitReady, exitedEarly]);
    if (exited) await exitedEarly;

    // The SDK refuses an endpoint that is not a private socket owned by this
    // user; so does Orbit.
    const stat = await this.fs.promises.lstat(socketPath);
    const uid = this.getuid();
    if (!stat.isSocket() || stat.isSymbolicLink() || (uid >= 0 && stat.uid !== uid) || (stat.mode & 0o077) !== 0) {
      throw new Error("embedded cua-driver endpoint is not a private Unix socket");
    }
    this.ready = true;
    return { socketPath, pid: child.pid };
  }

  async #teardown() {
    const child = this.child;
    this.child = null;
    if (child && child.exitCode === null && child.signalCode === null) {
      const exited = new Promise((resolve) => child.once("exit", resolve));
      const waitFor = (ms) => Promise.race([exited.then(() => true), sleep(ms).then(() => false)]);
      // Parent liveness first: the daemon ends its sessions and exits.
      try { child.stdin?.end(); } catch {}
      if (!(await waitFor(LIVENESS_EXIT_MS))) {
        try { child.kill("SIGTERM"); } catch {}
        if (!(await waitFor(TERM_EXIT_MS))) {
          try { child.kill("SIGKILL"); } catch {}
          await waitFor(TERM_EXIT_MS);
        }
      }
    }
    const dir = this.socketDir;
    this.socketDir = null;
    this.socketPath = null;
    this.ready = false;
    if (dir) await this.fs.promises.rm(dir, { recursive: true, force: true }).catch(() => {});
  }

  /** Idempotent; cancels a start in progress. */
  stop() {
    this.stopping ??= (async () => {
      this.startAbort?.abort();
      await this.#teardown();
    })();
    return this.stopping;
  }

  /** Parity with the SDK object, which needs an explicit native release. */
  uniffiDestroy() {}
}
