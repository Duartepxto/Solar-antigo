// Teardown primitives for suites that spawn a real process against a
// throwaway home directory.
//
// Both halves of that pattern have a race in them, and both races surface
// as a red suite whose assertions all passed — the most expensive kind of
// failure to read. These two helpers exist so the fix lives in one place
// instead of being re-derived (or forgotten) per suite.
import { execFile, type ChildProcess } from "node:child_process";
import { rmSync } from "node:fs";
import { join } from "node:path";

/** How `waitForExit` should end the child, and how long to allow. */
export interface WaitForExitOptions {
  /** Sent immediately. Omit for a child the caller has already signalled. */
  signal?: NodeJS.Signals;
  /** How long the polite signal gets before SIGKILL. */
  graceMs?: number;
}

/**
 * End a child process and wait for it to actually be gone.
 *
 * `kill()` asks; it does not wait. A caller that proceeds straight from the
 * kill call to deleting the child's home directory is racing a process that
 * may still be mid-write, and on Linux that surfaces as an EACCES or ENOTEMPTY
 * from `rm` rather than anything that names the real cause.
 *
 * Pass `signal` and this sends it, rather than leaving the caller to send one
 * and then wait out a grace period that has already started counting. Both
 * halves of "stop it, and know that it stopped" then live in one call.
 *
 * From there: resolve on `close`, escalate to SIGKILL only after `graceMs`,
 * and keep waiting for `close` even then — a SIGKILL is not an exit either,
 * it just makes one imminent. The final backstop bounds the whole thing so a
 * wedged child can never hang the suite.
 *
 * A loaded CI runner loses that race; a laptop wins it every time, which is
 * why it reads as a phantom.
 */
export function waitForExit(
  child: ChildProcess | undefined,
  options: WaitForExitOptions | number = {},
): Promise<void> {
  const { signal, graceMs = 5_000 } = typeof options === "number" ? { graceMs: options } : options;

  return new Promise<void>((resolve) => {
    // signalCode, not just exitCode: a process killed by a signal reports its
    // death in the former and leaves the latter null.
    if (!child || child.exitCode !== null || child.signalCode !== null) return resolve();

    let timer: ReturnType<typeof setTimeout> | undefined;
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      child.removeListener?.("close", done);
      resolve();
    };
    child.on("close", done);

    const terminate = (requested: NodeJS.Signals) => {
      // The native process handle is the provenance check. Synthetic children
      // can carry invented pids, but do not own a matching kernel handle.
      const handle = (child as ChildProcess & { _handle?: { pid?: number; constructor?: { name?: string } } })._handle;
      if (process.platform === "win32" && child.spawnfile && handle?.constructor?.name === "Process"
        && handle.pid === child.pid && child.pid !== process.pid
        && child.pid && child.exitCode === null && child.signalCode === null) {
        // Windows kill(SIGTERM) terminates only the parent and leaves its
        // fake engines alive. End the exact tree owned by this fixture.
        execFile(join(process.env.SystemRoot || "C:\\Windows", "System32", "taskkill.exe"),
          ["/PID", String(child.pid), "/T", "/F"], { windowsHide: true, timeout: 5_000 }, () => {});
      } else {
        try { child.kill(requested); } catch { /* already exited */ }
      }
    };

    if (signal) {
      try {
        terminate(signal);
      } catch {
        /* already gone — `close` still arrives, or already has */
      }
    }
    if (settled) return;

    timer = setTimeout(() => {
      if (settled) return;
      terminate("SIGKILL");
      if (settled) return;
      timer = setTimeout(done, 2_000);
      timer.unref?.();
    }, graceMs);
    timer.unref?.();
  });
}

/**
 * Remove a temp directory, and never fail a green suite over one.
 *
 * A just-killed child lets go of its files a beat after the kill returns, and
 * `rmSync`'s own `maxRetries` does not cover an EACCES/EPERM on the directory
 * itself. Retry briefly; if the directory still will not go, warn and leave
 * it for the OS to reap. A leaked temp dir is a non-event — a red CI run that
 * says nothing about the code under test is not.
 */
export async function removeTempDir(dir: string): Promise<void> {
  let lastError: unknown;
  for (let i = 0; i < 20; i++) {
    try {
      rmSync(dir, { recursive: true, force: true });
      return;
    } catch (error) {
      lastError = error;
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  console.warn(
    `test cleanup could not remove ${dir}: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
  );
}
