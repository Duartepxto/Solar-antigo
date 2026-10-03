#!/usr/bin/env node --experimental-strip-types
// Bring upstream (OpenMausBot) commits into Orbit.
//
//   node --experimental-strip-types scripts/upstream-port.ts <commit>...
//   node --experimental-strip-types scripts/upstream-port.ts --rename <file>...
//
// Each commit is exported as a patch, renamed the way Orbit renamed itself
// (OpenMausBot/OpenMaus/OMB → Orbit in paths and text, never the endpoints
// and wire formats Orbit keeps), and applied with `git am -3`, so it keeps
// its author and message. A conflict stops with the repository mid-`am`:
// resolve it, `git add`, then `git am --continue` (or `git am --abort`).
// --rename rewrites files in place with the same rules, for code copied by hand.
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

// Upstream's own services, release feeds, license keys and wire formats:
// kept verbatim, as in the original rename.
const PROTECT = [
  String.raw`[A-Za-z0-9.-]*openmausbot\.com(?![A-Za-z0-9])`,
  String.raw`milind-soni/[A-Za-z0-9._-]+`,
  String.raw`openmausbot-releases`,
  String.raw`omb_install_`,
  String.raw`openmausbot-control-plane`,
  String.raw`-omb\.\d+`,
  String.raw`\bomb1\b`,
  String.raw`aos\.openmausbot_status\.v1`,
  String.raw`aos-session-bridge/openmausbot`,
  String.raw`aos_openmausbot_status\.py`,
  String.raw`Milind Soni`,
];
const PROTECT_RE = new RegExp(PROTECT.map((p) => `(?:${p})`).join("|"), "g");

const RULES: Array<[RegExp, string]> = [
  [/OpenMausBot/g, "Orbit"],
  [/OPENMAUSBOT/g, "ORBIT"],
  [/openmausbot/g, "orbit"],
  [/Openmausbot/g, "Orbit"],
  [/OpenMaus/g, "Orbit"],
  [/OPENMAUS/g, "ORBIT"],
  [/openMaus/g, "orbit"],
  [/openmaus/g, "orbit"],
  [/(?:(?<![A-Za-z0-9])|(?<=\\n)|(?<=\\u0000))OMB_/g, "ORBIT_"],
  [/(?<![A-Za-z0-9])OMB(?=2\b)/g, "Orbit"],
  [/(?<![A-Za-z0-9_])OMB(?![A-Za-z0-9_])/g, "Orbit"],
  [/Omb(?![a-z])/g, "Orbit"],
  [/OMB-WORKSPACE-1/g, "ORBIT-WORKSPACE-1"],
  [/ombbackup/g, "orbitbackup"],
  [/(?<![A-Za-z0-9])omb(?![a-z])/g, "orbit"],
];

export function renameText(text: string): string {
  let out = "";
  let last = 0;
  const plain = (segment: string) => RULES.reduce((value, [rx, to]) => value.replace(rx, to), segment);
  for (const match of text.matchAll(PROTECT_RE)) {
    out += plain(text.slice(last, match.index)) + match[0];
    last = match.index! + match[0].length;
  }
  return out + plain(text.slice(last));
}

function git(args: string[]): string {
  return execFileSync("git", args, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
}

function port(commit: string): boolean {
  const patch = git(["format-patch", "-1", "--stdout", "--no-signature", commit]);
  const applied = spawnSync("git", ["am", "-3", "--keep-cr"], { input: renameText(patch), encoding: "utf8", stdio: ["pipe", "inherit", "inherit"] });
  return applied.status === 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  if (args[0] === "--rename") {
    for (const file of args.slice(1)) writeFileSync(file, renameText(readFileSync(file, "utf8")));
  } else if (!args.length) {
    console.error("usage: upstream-port.ts <commit>... | --rename <file>...");
    process.exit(2);
  } else {
    for (const commit of args) {
      if (!port(commit)) {
        console.error(`\n${commit} needs a hand: resolve the conflict, git add, then git am --continue (or git am --abort).`);
        process.exit(1);
      }
      console.log(`ported ${git(["log", "-1", "--format=%h %s", "HEAD"]).trim()} (from ${commit.slice(0, 10)})`);
    }
  }
}
