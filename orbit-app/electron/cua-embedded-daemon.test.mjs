import { spawn } from "node:child_process";
import { EventEmitter } from "node:events";
import { existsSync, mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  OrbitEmbeddedDriverHost,
  buildEmbeddedServeArgs,
  buildEmbeddedServeEnv,
} from "./cua-embedded-daemon.mjs";

describe("embedded cua-driver launch contract", () => {
  it("mirrors the SDK host's serve argv and adds only the existing-profile grant", () => {
    expect(buildEmbeddedServeArgs({
      socketPath: "/private/var/folders/x/T/orbit-cua-a/cua.sock",
      hostBundleId: "com.orbit.app",
      grants: ["existing-profile", "existing-profile"],
    })).toEqual([
      "serve", "--embedded", "--parent-liveness-stdio", "--no-permissions-gate",
      "--socket", "/private/var/folders/x/T/orbit-cua-a/cua.sock",
      "--host-bundle-id", "com.orbit.app",
      "--permission-mode", "standard",
      "--grant", "existing-profile",
    ]);
    expect(buildEmbeddedServeArgs({ socketPath: "/s/cua.sock", hostBundleId: "com.orbit.app" })).not.toContain("--grant");
  });

  it("refuses grants, sockets and bundle ids it does not understand", () => {
    expect(() => buildEmbeddedServeArgs({ socketPath: "/s", hostBundleId: "com.orbit.app", grants: ["everything"] })).toThrow(/unsupported/);
    expect(() => buildEmbeddedServeArgs({ socketPath: "relative.sock", hostBundleId: "com.orbit.app" })).toThrow(/absolute/);
    expect(() => buildEmbeddedServeArgs({ socketPath: "/s", hostBundleId: "com orbit" })).toThrow(/bundle id/);
  });

  it("passes an allowlisted environment plus the embedding contract", () => {
    const env = buildEmbeddedServeEnv({
      HOME: "/Users/me",
      PATH: "/usr/bin",
      TMPDIR: "/var/folders/x/T/",
      ANTHROPIC_API_KEY: "secret",
      ELECTRON_RUN_AS_NODE: "1",
      CUA_DRIVER_PERMISSION_MODE: "unrestricted",
      CUA_DRIVER_DANGEROUSLY_BYPASS_APPROVALS: "1",
    }, { hostBundleId: "com.orbit.app", hostPid: 4242, fixed: { CUA_DRIVER_RS_TELEMETRY_ENABLED: "0" } });
    expect(env).toEqual({
      HOME: "/Users/me",
      PATH: "/usr/bin",
      TMPDIR: "/var/folders/x/T/",
      CUA_DRIVER_RS_TELEMETRY_ENABLED: "0",
      CUA_DRIVER_EMBEDDED: "1",
      CUA_DRIVER_HOST_BUNDLE_ID: "com.orbit.app",
      CUA_DRIVER_EMBEDDED_HOST_PID: "4242",
    });
  });
});

// A stand-in daemon: listens on --socket, chmods it (like the real driver's
// 0600 endpoint), and exits when its stdin (the liveness pipe) closes.
const FAKE_DAEMON = `
const net = require("node:net");
const fs = require("node:fs");
const args = process.argv.slice(1);
const socket = args[args.indexOf("--socket") + 1];
const mode = Number(process.env.FAKE_MODE || "384");
if (process.env.FAKE_EXIT_EARLY) { process.stderr.write("fake refused to start\\n"); process.exit(3); }
process.umask(0o077);
const server = net.createServer((c) => c.end());
server.listen(socket, () => fs.chmodSync(socket, mode));
if (process.env.FAKE_IGNORE_STDIN !== "1") process.stdin.on("end", () => { server.close(); process.exit(0); });
process.stdin.resume();
if (process.env.FAKE_IGNORE_TERM === "1") process.on("SIGTERM", () => {});
`;

describe.skipIf(process.platform === "win32")("OrbitEmbeddedDriverHost lifecycle (inert fake daemon)", () => {
  let root;
  let spawned;
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "oc-"));
    spawned = [];
  });
  afterEach(() => {
    for (const child of spawned) if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
    rmSync(root, { recursive: true, force: true });
  });
  const host = (extraEnv = {}, options = {}) => new OrbitEmbeddedDriverHost("/fixture/cua-driver", "com.orbit.app", {
    grants: ["existing-profile"],
    tmpRoot: root,
    env: { PATH: process.env.PATH, ...extraEnv },
    startupTimeoutMs: 3_000,
    // Never execute a real driver: run the inert script with the same argv.
    spawn: (_binary, args, spawnOptions) => {
      const child = spawn(process.execPath, ["-e", FAKE_DAEMON, ...args], {
        ...spawnOptions,
        env: { ...spawnOptions.env, ...extraEnv },
      });
      spawned.push(child);
      return child;
    },
    ...options,
  });

  it("starts on a private socket in a 0700 directory and stops through the liveness pipe", async () => {
    const h = host();
    const conn = await h.start();
    expect(conn.socketPath.startsWith(join(root, "orbit-cua-"))).toBe(true);
    expect(statSync(join(conn.socketPath, "..")).mode & 0o777).toBe(0o700);
    expect(spawned[0].spawnargs).toContain("--grant");
    await h.stop();
    expect(spawned[0].exitCode).toBe(0);
    expect(existsSync(conn.socketPath)).toBe(false);
    await h.stop(); // idempotent
  });

  it("refuses a socket other users could open", async () => {
    await expect(host({ FAKE_MODE: String(0o666) }).start()).rejects.toThrow(/private Unix socket/);
    expect(spawned[0].exitCode ?? spawned[0].signalCode).not.toBeNull();
  });

  it("reports a daemon that exits before it is ready, with its stderr", async () => {
    await expect(host({ FAKE_EXIT_EARLY: "1" }).start()).rejects.toThrow(/exited before it was ready.*fake refused to start/);
  });

  it("cancels a start in progress", async () => {
    const controller = new AbortController();
    const h = host({}, { connect: () => {
      const socket = Object.assign(new EventEmitter(), { destroy() {} });
      queueMicrotask(() => socket.emit("error", new Error("not yet")));
      return socket;
    } });
    const started = h.start({ signal: controller.signal });
    await new Promise((resolve) => setTimeout(resolve, 150));
    controller.abort();
    await expect(started).rejects.toMatchObject({ name: "AbortError" });
    expect(spawned[0].exitCode ?? spawned[0].signalCode).not.toBeNull();
  });

  it("forces a daemon that ignores its stdin and TERM to stop", async () => {
    const h = host({ FAKE_IGNORE_STDIN: "1", FAKE_IGNORE_TERM: "1" });
    await h.start();
    const started = Date.now();
    await h.stop();
    expect(spawned[0].signalCode).toBe("SIGKILL");
    expect(Date.now() - started).toBeLessThan(2_500);
  });

  it("tells the owner once when a ready daemon dies on its own", async () => {
    const exits = [];
    const h = host({}, { onUnexpectedExit: (info) => exits.push(info) });
    await h.start();
    spawned[0].kill("SIGKILL");
    await expect.poll(() => exits.length).toBe(1);
    expect(exits[0].signal).toBe("SIGKILL");
    await h.stop();
    expect(exits).toHaveLength(1);
  });
});
