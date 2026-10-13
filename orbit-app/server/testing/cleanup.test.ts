import { spawn, type ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";
import { expect, it, vi } from "vitest";
import { requestedWindowsTreeStop, waitForExit } from "./cleanup.ts";

it("ends a simulated process through its model without addressing an OS pid", async () => {
  const model = Object.assign(new EventEmitter(), {
    pid: 2147483647, exitCode: null as number | null, signalCode: null,
    kill: vi.fn(() => { model.exitCode = 0; model.emit("close", 0); return true; }),
  });
  await waitForExit(model as unknown as ChildProcess, { signal: "SIGTERM", graceMs: 1 });
  expect(model.kill).toHaveBeenCalledExactlyOnceWith("SIGTERM");
  expect(model.listenerCount("close")).toBe(0);
  expect(requestedWindowsTreeStop(model as unknown as ChildProcess)).toBeUndefined();
});

it("supports the minimal close/kill process models used by fixture tests", async () => {
  let close: (() => void) | undefined;
  const model = {
    exitCode: null, signalCode: null,
    on: (_event: string, listener: () => void) => { close = listener; },
    kill: vi.fn(() => { close?.(); return true; }),
  };
  await waitForExit(model as unknown as ChildProcess, { signal: "SIGTERM" });
  expect(model.kill).toHaveBeenCalledExactlyOnceWith("SIGTERM");
});

it.skipIf(process.platform !== "win32")("closes an owned Windows fixture together with its engine child", async () => {
  const source = `const {spawn}=require('node:child_process');
    const engine=spawn(process.execPath,['-e','setInterval(()=>{},1000)'],{stdio:'ignore'});
    console.log(engine.pid);setInterval(()=>{},1000);`;
  const parent = spawn(process.execPath, ["-e", source], { stdio: ["ignore", "pipe", "ignore"], windowsHide: true });
  let engine: number | undefined;
  try {
    engine = await new Promise<number>((resolve, reject) => {
      parent.once("error", reject);
      parent.stdout!.once("data", chunk => resolve(Number(String(chunk).trim())));
    });
    expect(Number.isInteger(engine)).toBe(true);
    await waitForExit(parent, { signal: "SIGTERM", graceMs: 2_000 });
    expect(requestedWindowsTreeStop(parent)).toBe("SIGTERM");
    expect(parent.exitCode !== null || parent.signalCode !== null).toBe(true);
    for (let retry = 0; retry < 20; retry++) {
      try { process.kill(engine!, 0); } catch { engine = undefined; break; }
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    expect(engine, "the fixture's engine must not outlive its parent").toBeUndefined();
  } finally {
    await waitForExit(parent, { signal: "SIGKILL", graceMs: 500 });
    if (engine) { try { process.kill(engine, "SIGKILL"); } catch { /* already gone */ } }
  }
});

it("does not credit an already crashed child with a requested Windows stop", async () => {
  const model = Object.assign(new EventEmitter(), { exitCode: 1, signalCode: null, kill: vi.fn() });
  await waitForExit(model as unknown as ChildProcess, { signal: "SIGTERM" });
  expect(model.kill).not.toHaveBeenCalled();
  expect(requestedWindowsTreeStop(model as unknown as ChildProcess)).toBeUndefined();
});
