// Update Orbit by building it from its own source checkout.
//
// Orbit publishes no release feed: every computer builds from the owner's
// repository. The installed app knows the commit it was built from
// (electron/build-info.json, written by `pnpm package:prepare`). A check
// fetches the checkout's origin and offers the update when origin's main
// (or master) moved past that commit, whatever branch the checkout is on.
// "Download" builds that exact commit in the updater's own git worktree
// (buildDir), never in the checkout: people and bots work there, and a local
// edit must not block an update, nor an update move code under someone's
// work. "Install" swaps the new app in after quitting and opens it again.
// Same states as the release updater, so the same pill drives it.
import { execFile, spawn } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { delimiter, dirname, join } from "node:path";

// a Mac builds only its own architecture, as a bare .app: no DMG or ZIP to
// sign and compress, since nothing downloads it
const PACKAGE_SCRIPT = { darwin: "package:mac:local", win32: "package:win", linux: "package:linux" };

const PATH_MARK = "__ORBIT_PATH__";

/** The Apple team an app is signed by, or null when it is signed ad hoc
 * (no certificate on this computer). macOS ties Screen Recording and
 * Microphone permission to it, so an ad hoc build asks for them again. */
export function signingTeam(appPath) {
  return new Promise((resolve) => {
    execFile("/usr/bin/codesign", ["-dv", appPath], { timeout: 15_000 }, (_error, stdout, stderr) => {
      const team = /^TeamIdentifier=(.+)$/m.exec(`${stdout}${stderr}`)?.[1]?.trim();
      resolve(team && team !== "not set" ? team : null);
    });
  });
}

/** Where npm, pnpm and friends install their commands when a person set
 * them up in a terminal: npm's global prefix from ~/.npmrc, pnpm's own home,
 * Volta, and the two Homebrew roots. */
export function knownToolDirs(home = homedir()) {
  const dirs = [];
  try {
    const prefix = /^\s*prefix\s*=\s*(.+?)\s*$/m.exec(readFileSync(join(home, ".npmrc"), "utf8"))?.[1];
    if (prefix) dirs.push(join(prefix.replace(/^~(?=\/|$)/, home), "bin"));
  } catch { /* no ~/.npmrc */ }
  if (process.env.PNPM_HOME) dirs.push(process.env.PNPM_HOME);
  dirs.push(join(home, "Library", "pnpm"), join(home, ".local", "share", "pnpm"), join(home, ".volta", "bin"),
    join(home, ".local", "bin"), "/opt/homebrew/bin", "/usr/local/bin");
  return dirs;
}

/** The PATH a terminal window has. An app opened from the Dock or the Finder
 * starts with macOS's bare PATH, and a login shell alone reads ~/.zprofile but
 * not ~/.zshrc, where npm's global folder is usually added, so pnpm went
 * missing there ("command not found: pnpm"). Ask an interactive login shell
 * once, the way editors pick up a person's environment, bounded by a timeout
 * and marked so prompt themes can't garble it; then add the usual install
 * folders in case the shell setup doesn't name them. */
export function terminalPath({ shell = process.env.SHELL || "/bin/zsh", home = homedir(), timeoutMs = 10_000 } = {}) {
  return new Promise((resolve) => {
    let out = "";
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      const fromShell = out.split(PATH_MARK)[1] ?? "";
      const parts = [...fromShell.split(delimiter), ...(process.env.PATH ?? "").split(delimiter), ...knownToolDirs(home)];
      resolve([...new Set(parts.filter(Boolean))].join(delimiter));
    };
    const child = spawn(shell, ["-ilc", `printf '%s%s%s' ${PATH_MARK} "$PATH" ${PATH_MARK}`],
      { stdio: ["ignore", "pipe", "ignore"], env: { ...process.env, TERM: "dumb" } });
    const timer = setTimeout(() => { child.kill(); finish(); }, timeoutMs);
    child.stdout.on("data", (chunk) => { out += chunk; });
    child.on("error", finish);
    child.on("close", finish);
  });
}

let terminalPathOnce = null;

/** Run one command through the user's login shell, with the PATH a terminal
 * would have, so git and pnpm resolve as they do there even when the app was
 * opened from the Finder. */
export async function loginShellExec(command, cwd, { shell = process.env.SHELL || "/bin/zsh", onLine, path } = {}) {
  const PATH = path ?? await (terminalPathOnce ??= terminalPath({ shell }));
  return new Promise((resolve, reject) => {
    const child = spawn(shell, ["-lc", command], { cwd, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env, PATH } });
    let out = "";
    let tail = "";
    const take = (chunk) => {
      const text = String(chunk);
      out += text;
      tail = (tail + text).slice(-4000);
      if (onLine) for (const line of text.split(/\r?\n/)) if (line.trim()) onLine(line.trim());
    };
    child.stdout.on("data", take);
    child.stderr.on("data", take);
    child.on("error", reject);
    child.on("close", (code) => (code === 0 ? resolve(out.trim()) : reject(new Error(`${command} failed (${code}): ${tail.trim().split("\n").slice(-6).join("\n")}`))));
  });
}

const quote = (value) => `'${String(value).replace(/'/g, `'\\''`)}'`;

export function readBuildInfo(appRoot) {
  try {
    const info = JSON.parse(readFileSync(join(appRoot, "electron", "build-info.json"), "utf8"));
    return typeof info?.commit === "string" ? info : null;
  } catch {
    return null;
  }
}

/** The .app bundle this process runs from (macOS), or null. */
export function runningBundle(execPath = process.execPath) {
  const match = execPath.match(/^(.*?\.app)\/Contents\/MacOS\/[^/]+$/);
  return match ? match[1] : null;
}

export function createSourceUpdater(setState, {
  buildInfo,
  sourceDir,
  /** The updater's own worktree of sourceDir's repository. Nobody edits it. */
  buildDir = sourceDir ? join(dirname(sourceDir), `.${sourceDir.split("/").pop()}-build`) : undefined,
  platform = process.platform,
  exec = loginShellExec,
  runningApp = runningBundle(),
  quit = () => {},
  spawnDetached = (script) => spawn("/bin/sh", ["-c", script], { detached: true, stdio: "ignore" }).unref(),
  pid = process.pid,
  teamOf = signingTeam,
} = {}) {
  let busy = false;
  let built = null;
  let target = null;
  const git = (args) => exec(`git ${args}`, sourceDir);
  /** origin's main, or master for a repository that still uses it. */
  const mainBranch = async () => {
    for (const name of ["main", "master"]) {
      if (await git(`rev-parse --verify --quiet ${quote(`refs/remotes/origin/${name}`)}`).then(() => true, () => false)) return name;
    }
    throw new Error("The Orbit checkout's origin has no main or master branch.");
  };
  const available = () => Boolean(buildInfo?.commit && sourceDir && existsSync(join(sourceDir, ".git")));

  return {
    /** Is origin ahead of the commit this app was built from? */
    async check(manual = false) {
      if (busy) return;
      if (!available()) {
        if (manual) setState({ status: "error", message: buildInfo ? `No Orbit source checkout at ${sourceDir}. Create an Upstream bot, or clone your Orbit repository there.` : "This build does not know which commit it was built from, so it cannot update itself." });
        return;
      }
      busy = true;
      setState({ status: "checking" });
      try {
        await git("fetch --quiet origin");
        const branch = await mainBranch();
        const remote = await git(`rev-parse ${quote(`origin/${branch}`)}`);
        if (remote === buildInfo.commit) { setState({ status: "idle" }); return; }
        // only move forward: a checkout behind this build offers nothing
        const ahead = await git(`merge-base --is-ancestor ${quote(buildInfo.commit)} ${quote(remote)}`).then(() => true, () => false);
        if (!ahead) { setState({ status: "idle" }); return; }
        const count = Number(await git(`rev-list --count ${quote(`${buildInfo.commit}..${remote}`)}`)) || 0;
        const notes = await git(`log --format=%s -n 5 ${quote(`${buildInfo.commit}..${remote}`)}`);
        target = { branch, commit: remote };
        setState({ status: "available", version: `${remote.slice(0, 7)} · ${count} new commit${count === 1 ? "" : "s"}`, notes, source: true });
      } catch (error) {
        setState(manual ? { status: "error", message: error.message } : { status: "idle" });
      } finally {
        busy = false;
      }
    },

    /** Pull, install and package a new app from the checkout. */
    async download() {
      if (busy || !target) return;
      const script = PACKAGE_SCRIPT[platform];
      if (!script) { setState({ status: "error", message: `Building Orbit on ${platform} is not supported yet.` }); return; }
      busy = true;
      const step = (message, percent) => setState({ status: "downloading", message, percent });
      try {
        step("Getting the new code…", 5);
        if (existsSync(join(buildDir, ".git"))) {
          // exactly origin's commit, whatever an earlier build left behind;
          // ignored files (node_modules) stay so installs are quick
          await exec(`git checkout --quiet --detach --force ${quote(target.commit)} && git clean -fdq && rm -rf release`, buildDir);
        } else {
          rmSync(buildDir, { recursive: true, force: true });
          await git("worktree prune");
          await git(`worktree add --quiet --detach ${quote(buildDir)} ${quote(target.commit)}`);
        }
        step("Installing dependencies…", 15);
        await exec("pnpm install --frozen-lockfile", buildDir);
        step("Building Orbit (this takes a few minutes)…", 30);
        await exec(`pnpm ${script}`, buildDir);
        built = [join(buildDir, "release", "mac-arm64", "Orbit.app"), join(buildDir, "release", "mac", "Orbit.app")].find((path) => existsSync(path)) ?? null;
        if (platform === "darwin" && !built) throw new Error("The build finished but no Orbit.app was found in release/.");
        // Say so before the swap, not after macOS asks again: a build that
        // fell back to ad hoc signing (the certificate missing or expired)
        // loses the permissions the running app was granted.
        let signingChanged = false;
        if (platform === "darwin" && runningApp) {
          const [before, after] = await Promise.all([teamOf(runningApp), teamOf(built)]);
          signingChanged = Boolean(before) && before !== after;
        }
        setState({ status: "downloaded", percent: 100, message: undefined, signingChanged });
      } catch (error) {
        setState({ status: "error", message: error.message });
      } finally {
        busy = false;
      }
    },

    /** Quit, swap the new app in, open it again. */
    async install() {
      if (!built) return;
      if (platform !== "darwin" || !runningApp) {
        setState({ status: "error", message: `The new build is ready at ${dirname(built)}. Install it from there.` });
        return;
      }
      setState({ status: "installing" });
      const swap = [
        `while kill -0 ${pid} 2>/dev/null; do sleep 0.5; done`,
        `rm -rf ${quote(`${runningApp}.previous`)}`,
        `mv ${quote(runningApp)} ${quote(`${runningApp}.previous`)}`,
        `ditto ${quote(built)} ${quote(runningApp)} && rm -rf ${quote(`${runningApp}.previous`)} || mv ${quote(`${runningApp}.previous`)} ${quote(runningApp)}`,
        `open ${quote(runningApp)}`,
      ].join("; ");
      spawnDetached(swap);
      quit();
    },
  };
}

/** Record the commit a package is built from (pnpm package:prepare).
 * `sourceDir` is the person's checkout even when the build ran in the
 * updater's worktree, so the next update fetches from the same place. */
export function writeBuildInfo(repoRoot, commit, builtAt = new Date().toISOString(), origin, sourceDir = repoRoot) {
  writeFileSync(join(repoRoot, "electron", "build-info.json"), `${JSON.stringify({ commit, builtAt, sourceDir, ...(origin ? { origin } : {}) }, null, 2)}\n`);
}
