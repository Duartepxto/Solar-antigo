// Orbit's own source checkout: where a bot that maintains Orbit (the
// Upstream template) works, and what a local rebuild builds from.
//
// Running from a git checkout (development) the checkout is the directory
// this server runs from. A packaged app built from a checkout is told which
// one (ORBIT_SOURCE_DIR, from its build info) and uses that. Only an app with
// neither uses DATA_DIR/source, which the Upstream bot clones into from
// ORBIT_SOURCE_ORIGIN (the repository it was built from) on its first run.
import { execFile } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);

export interface OrbitSource {
  /** The checkout's directory (may not exist yet for a packaged app). */
  path: string;
  /** "running": this server runs from it; "built-from": the checkout this
   * packaged app was built from; "separate": the packaged app's own clone. */
  kind: "running" | "built-from" | "separate";
  exists: boolean;
  git: boolean;
  branch?: string;
  origin?: string;
  upstream?: string;
}

function isOrbitCheckout(dir: string): boolean {
  try {
    const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
    return pkg?.name === "orbit" && existsSync(join(dir, ".git"));
  } catch {
    return false;
  }
}

/** The checkout this server runs from, if it runs from one. */
export function runningCheckout(moduleUrl = import.meta.url): string | null {
  // server/orbit-source.ts → the repository root is one level up
  const root = dirname(dirname(fileURLToPath(moduleUrl)));
  return isOrbitCheckout(root) ? root : null;
}

async function git(cwd: string, args: string[]): Promise<string | undefined> {
  try {
    const { stdout } = await run("git", ["-C", cwd, ...args], { timeout: 5_000 });
    return stdout.trim() || undefined;
  } catch {
    return undefined;
  }
}

export async function orbitSource(dataDir: string, moduleUrl = import.meta.url, env: NodeJS.ProcessEnv = process.env): Promise<OrbitSource> {
  const running = runningCheckout(moduleUrl);
  const builtFrom = !running && env.ORBIT_SOURCE_DIR && isOrbitCheckout(env.ORBIT_SOURCE_DIR) ? env.ORBIT_SOURCE_DIR.replace(/\/+$/, "") : null;
  const path = running ?? builtFrom ?? join(dataDir, "source");
  const kind = running ? "running" : builtFrom ? "built-from" : "separate";
  const exists = existsSync(path);
  const isGit = exists && existsSync(join(path, ".git"));
  if (!isGit) return { path, kind, exists, git: false, ...(env.ORBIT_SOURCE_ORIGIN ? { origin: env.ORBIT_SOURCE_ORIGIN } : {}) };
  const [branch, origin, upstream] = await Promise.all([
    git(path, ["rev-parse", "--abbrev-ref", "HEAD"]),
    git(path, ["remote", "get-url", "origin"]),
    git(path, ["remote", "get-url", "upstream"]),
  ]);
  return { path, kind, exists, git: true, branch, origin, upstream };
}
