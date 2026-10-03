// Record the commit this package is built from (electron/build-info.json),
// so the installed app can tell when its source checkout has moved on.
import { execFileSync } from "node:child_process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { writeBuildInfo } from "../electron/source-updater.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const git = (...args) => { try { return execFileSync("git", ["-C", root, ...args], { encoding: "utf8" }).trim(); } catch { return undefined; } };
// In a worktree (the updater's own build copy) the checkout to update from
// is the main one, whose .git is the shared "common dir".
const common = git("rev-parse", "--path-format=absolute", "--git-common-dir");
const checkout = common ? dirname(common.replace(/\/$/, "")) : root;
writeBuildInfo(root, git("rev-parse", "HEAD"), undefined, git("remote", "get-url", "origin"), checkout);
