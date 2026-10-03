import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// startCua on macOS with Orbit's own daemon launch. The daemon host and the
// SDK are both fakes: nothing here starts a driver or touches the system.
const fixture = vi.hoisted(() => ({ home: "", orbitHosts: [], sdkHosts: [], orbitFails: false }));
vi.mock("electron", () => ({ app: { isPackaged: false, getPath: () => fixture.home }, ipcMain: { handle: () => {} } }));
vi.mock("./cua-embedded-daemon.mjs", () => ({
  OrbitEmbeddedDriverHost: class {
    constructor(binary, bundleId, options) {
      Object.assign(this, { binary, bundleId, options });
      fixture.orbitHosts.push(this);
    }
    async start() {
      if (fixture.orbitFails) throw new Error("fixture: serve refused");
      return { socketPath: `/fixture/orbit-${fixture.orbitHosts.length}.sock`, pid: 1 };
    }
    stop = vi.fn(async () => {});
    uniffiDestroy() {}
  },
}));
vi.mock("@trycua/cua-driver/embedded", () => ({
  EmbeddedCuaDriverHost: class {
    constructor() { fixture.sdkHosts.push(this); }
    async start() { return { socketPath: "/fixture/sdk.sock" }; }
    stop = vi.fn(async () => {});
    uniffiDestroy = vi.fn();
  },
}));
vi.mock("@trycua/cua-driver/electron", () => ({
  requestMacOSPermissions: () => ({ accessibility: true, screenRecording: true }),
  hasRequiredMacOSPermissions: () => true,
}));

let cua;
const descriptor = () => JSON.parse(readFileSync(join(fixture.home, "cua-connection.json"), "utf8"));
beforeEach(async () => {
  fixture.home = mkdtempSync(join(tmpdir(), "orbit-cua-host-"));
  fixture.orbitHosts = [];
  fixture.sdkHosts = [];
  fixture.orbitFails = false;
  vi.stubEnv("ORBIT_CUA_EMBEDDED", "1");
  vi.stubEnv("CUA_DRIVER_PATH", "/fixture/cua-driver");
  vi.resetModules();
  cua = await import("./cua.mjs");
});
afterEach(async () => {
  await cua?.stopCua();
  vi.unstubAllEnvs();
  rmSync(fixture.home, { recursive: true, force: true });
});

describe.skipIf(process.platform !== "darwin")("macOS: Orbit launches the embedded daemon itself", () => {
  it("starts the daemon with the existing-profile grant and hands drivers the unchanged MCP args", async () => {
    const connection = await cua.startCua();
    expect(fixture.orbitHosts).toHaveLength(1);
    expect(fixture.orbitHosts[0]).toMatchObject({ binary: "/fixture/cua-driver", bundleId: "com.orbit.app" });
    expect(fixture.orbitHosts[0].options.grants).toEqual(["existing-profile"]);
    expect(fixture.sdkHosts).toHaveLength(0);
    expect(connection).toMatchObject({
      mode: "embedded",
      socketPath: "/fixture/orbit-1.sock",
      mcpCommand: "/fixture/cua-driver",
      mcpArgs: ["mcp", "--embedded", "--socket", "/fixture/orbit-1.sock"],
      mcpEnv: { CUA_DRIVER_EMBEDDED: "1", CUA_DRIVER_HOST_BUNDLE_ID: "com.orbit.app" },
    });
    expect(descriptor().socketPath).toBe("/fixture/orbit-1.sock");
    await cua.stopCua();
    expect(fixture.orbitHosts[0].stop).toHaveBeenCalled();
    expect(descriptor().mode).toBe("unavailable");
  });

  it("falls back to the SDK host (no grant) when Orbit's launch fails", async () => {
    fixture.orbitFails = true;
    const connection = await cua.startCua();
    expect(fixture.orbitHosts[0].stop).toHaveBeenCalled();
    expect(fixture.sdkHosts).toHaveLength(1);
    expect(connection).toMatchObject({ mode: "embedded", socketPath: "/fixture/sdk.sock" });
  });

  it("marks computer use unavailable when the daemon dies, then restarts it", async () => {
    await cua.startCua();
    fixture.orbitHosts[0].options.onUnexpectedExit({ code: null, signal: "SIGKILL" });
    expect(descriptor()).toEqual({ mode: "unavailable", reason: "cua-driver stopped unexpectedly (SIGKILL)" });
    await expect.poll(() => fixture.orbitHosts.length, { timeout: 3_000 }).toBe(2);
    await expect.poll(() => descriptor().socketPath, { timeout: 3_000 }).toBe("/fixture/orbit-2.sock");
  });

  it("does not restart a crashed daemon after an explicit stop", async () => {
    await cua.startCua();
    const exit = fixture.orbitHosts[0].options.onUnexpectedExit;
    await cua.stopCua();
    exit({ code: 1, signal: null });
    await new Promise((resolve) => setTimeout(resolve, 1_300));
    expect(fixture.orbitHosts).toHaveLength(1);
    expect(descriptor()).toEqual({ mode: "unavailable", reason: "desktop-host-stopped" });
  });
});
