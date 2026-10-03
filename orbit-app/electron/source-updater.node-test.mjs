import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { createSourceUpdater, knownToolDirs, loginShellExec, readBuildInfo, runningBundle, terminalPath, writeBuildInfo } from "./source-updater.mjs";

const git = (cwd, ...args) => execFileSync("git", ["-C", cwd, ...args], { encoding: "utf8" }).trim();

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "orbit-source-updater-"));
  const origin = join(root, "origin");
  const source = join(root, "source");
  mkdirSync(origin);
  git(origin, "init", "-q", "-b", "main");
  git(origin, "config", "user.email", "t@example.test");
  git(origin, "config", "user.name", "Test");
  writeFileSync(join(origin, "a.txt"), "one\n");
  git(origin, "add", ".");
  git(origin, "commit", "-q", "-m", "first");
  execFileSync("git", ["clone", "-q", origin, source]);
  return { root, origin, source, buildDir: join(root, "app-data", "source-build"), built: git(source, "rev-parse", "HEAD") };
}

// real git through a real shell; pnpm is faked so the test builds nothing
const fakeExec = (log) => (command, cwd) => {
  log.push(command);
  if (command.startsWith("pnpm package:")) {
    mkdirSync(join(cwd, "release", "mac-arm64", "Orbit.app"), { recursive: true });
    return Promise.resolve("");
  }
  if (command.startsWith("pnpm")) return Promise.resolve("");
  return loginShellExec(command, cwd, { shell: "/bin/sh", path: process.env.PATH });
};

test("offers, builds and swaps in an update when origin moves past the build", async () => {
  const f = fixture();
  try {
    const states = [];
    const log = [];
    const detached = [];
    let quit = 0;
    const updater = createSourceUpdater((patch) => states.push(patch), {
      buildInfo: { commit: f.built }, sourceDir: f.source, buildDir: f.buildDir, platform: "darwin", exec: fakeExec(log),
      runningApp: "/Applications/Orbit.app", quit: () => { quit += 1; }, spawnDetached: (script) => detached.push(script), pid: 4242,
      teamOf: async () => "TEAM123",
    });
    await updater.check(true);
    assert.equal(states.at(-1).status, "idle", "nothing new yet");

    writeFileSync(join(f.origin, "a.txt"), "two\n");
    git(f.origin, "commit", "-qam", "Port upstream fix");
    await updater.check(true);
    assert.equal(states.at(-1).status, "available");
    assert.match(states.at(-1).version, /1 new commit$/);
    assert.match(states.at(-1).notes, /Port upstream fix/);

    await updater.download();
    assert.equal(states.at(-1).status, "downloaded");
    assert.equal(states.at(-1).signingChanged, false, "signed by the same team");
    assert.equal(git(f.buildDir, "rev-parse", "HEAD"), git(f.origin, "rev-parse", "HEAD"), "the build copy is exactly origin's main");
    assert.equal(git(f.source, "rev-parse", "HEAD"), f.built, "the person's checkout was left alone");
    assert.deepEqual(log.filter((c) => c.startsWith("pnpm")), ["pnpm install --frozen-lockfile", "pnpm package:mac:local"]);

    await updater.install();
    assert.equal(quit, 1);
    assert.equal(detached.length, 1);
    assert.match(detached[0], /while kill -0 4242/);
    assert.match(detached[0], /ditto '.*source-build\/release\/mac-arm64\/Orbit\.app' '\/Applications\/Orbit\.app'/);
    assert.match(detached[0], /open '\/Applications\/Orbit\.app'/);
  } finally {
    rmSync(f.root, { recursive: true, force: true });
  }
});

test("warns when the new build lost the running app's signing team", async () => {
  // An ad hoc build (certificate missing or expired) makes macOS forget
  // Screen Recording and Microphone permission for Orbit.
  const f = fixture();
  try {
    const states = [];
    const updater = createSourceUpdater((patch) => states.push(patch), {
      buildInfo: { commit: f.built }, sourceDir: f.source, buildDir: f.buildDir, platform: "darwin", exec: fakeExec([]),
      runningApp: "/Applications/Orbit.app", teamOf: async (path) => path === "/Applications/Orbit.app" ? "TEAM123" : null,
    });
    writeFileSync(join(f.origin, "a.txt"), "two\n");
    git(f.origin, "commit", "-qam", "Change");
    await updater.check(true);
    await updater.download();
    assert.equal(states.at(-1).status, "downloaded", states.at(-1).message);
    assert.equal(states.at(-1).signingChanged, true);
  } finally {
    rmSync(f.root, { recursive: true, force: true });
  }
});

test("builds origin's main in its own copy, whatever the checkout is doing", async () => {
  // Seen for real, twice: the checkout left on a local branch ("git rev-parse
  // origin/fix/phone-polish failed"), then an Xcode-rewritten file in it
  // ("git pull --ff-only failed"). People and bots work in that checkout.
  const f = fixture();
  try {
    const states = [];
    const log = [];
    const updater = createSourceUpdater((patch) => states.push(patch), {
      buildInfo: { commit: f.built }, sourceDir: f.source, buildDir: f.buildDir, platform: "darwin", exec: fakeExec(log),
    });
    git(f.source, "checkout", "-q", "-b", "fix/phone-polish");
    writeFileSync(join(f.source, "a.txt"), "someone's unsaved work\n");
    writeFileSync(join(f.origin, "a.txt"), "two\n");
    git(f.origin, "commit", "-qam", "New on main");
    await updater.check(true);
    assert.equal(states.at(-1).status, "available");
    assert.match(states.at(-1).notes, /New on main/);

    await updater.download();
    assert.equal(states.at(-1).status, "downloaded", states.at(-1).message);
    assert.equal(git(f.buildDir, "rev-parse", "HEAD"), git(f.origin, "rev-parse", "HEAD"));
    assert.equal(git(f.source, "rev-parse", "--abbrev-ref", "HEAD"), "fix/phone-polish", "still on its own branch");
    assert.equal(readFileSync(join(f.source, "a.txt"), "utf8"), "someone's unsaved work\n", "local edits untouched");

    // the next update reuses the copy, and anything left in it is discarded
    writeFileSync(join(f.buildDir, "a.txt"), "stray\n");
    writeFileSync(join(f.origin, "a.txt"), "three\n");
    git(f.origin, "commit", "-qam", "Newer on main");
    await updater.check(true);
    await updater.download();
    assert.equal(states.at(-1).status, "downloaded", states.at(-1).message);
    assert.equal(readFileSync(join(f.buildDir, "a.txt"), "utf8"), "three\n");
  } finally {
    rmSync(f.root, { recursive: true, force: true });
  }
});

test("never offers a checkout that is behind or unrelated to the build", async () => {
  const f = fixture();
  try {
    const states = [];
    const updater = createSourceUpdater((patch) => states.push(patch), {
      buildInfo: { commit: "0".repeat(40) }, sourceDir: f.source, platform: "darwin", exec: fakeExec([]),
    });
    await updater.check(true);
    assert.equal(states.at(-1).status, "idle");
  } finally {
    rmSync(f.root, { recursive: true, force: true });
  }
});

test("says what is missing instead of offering an update it cannot build", async () => {
  const states = [];
  await createSourceUpdater((patch) => states.push(patch), { buildInfo: { commit: "abc" }, sourceDir: "/nonexistent/source" }).check(true);
  assert.equal(states.at(-1).status, "error");
  assert.match(states.at(-1).message, /No Orbit source checkout/);
  const quiet = [];
  await createSourceUpdater((patch) => quiet.push(patch), { buildInfo: null, sourceDir: "/nonexistent" }).check(false);
  assert.deepEqual(quiet, [], "a background check stays silent");
});

test("records and reads the build commit, and finds the running bundle", () => {
  const root = mkdtempSync(join(tmpdir(), "orbit-build-info-"));
  try {
    mkdirSync(join(root, "electron"));
    writeBuildInfo(root, "deadbeef", "2026-09-24T00:00:00.000Z");
    assert.deepEqual(readBuildInfo(root), { commit: "deadbeef", builtAt: "2026-09-24T00:00:00.000Z", sourceDir: root });
    assert.equal(runningBundle("/Applications/Orbit.app/Contents/MacOS/Orbit"), "/Applications/Orbit.app");
    assert.equal(runningBundle("/usr/bin/node"), null);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("finds pnpm where npm's ~/.npmrc prefix put it, from an app's bare PATH", async () => {
  // an app opened from the Dock: macOS's bare PATH, and a shell setup that
  // never names npm's global folder
  const home = mkdtempSync(join(tmpdir(), "orbit-updater-path-"));
  const barePath = process.env.PATH;
  try {
    const bin = join(home, ".npm-global", "bin");
    mkdirSync(bin, { recursive: true });
    writeFileSync(join(home, ".npmrc"), "prefix=~/.npm-global\n");
    writeFileSync(join(bin, "pnpm"), "#!/bin/sh\necho fake-pnpm\n", { mode: 0o755 });
    assert.ok(knownToolDirs(home).includes(bin));
    process.env.PATH = "/usr/bin:/bin:/usr/sbin:/sbin";
    const path = await terminalPath({ shell: "/bin/sh", home, timeoutMs: 5000 });
    assert.ok(path.split(":").includes(bin), path);
    assert.equal(await loginShellExec("pnpm", home, { shell: "/bin/sh", path }), "fake-pnpm");
  } finally {
    process.env.PATH = barePath;
    rmSync(home, { recursive: true, force: true });
  }
});
