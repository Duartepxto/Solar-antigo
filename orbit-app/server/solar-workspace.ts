import { createHash, randomUUID } from "node:crypto";
import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, realpathSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";

const MAX_BYTES = 1_000_000;
const excluded = /^(?:\..*|node_modules|dist|build|coverage|vendor)$/i;
const textFile = /\.(?:md|txt|html|css|js|mjs|cjs|ts|tsx|jsx|json|yaml|yml|toml|svg|py|rs|go|java|sql|sh)$/i;
function fail(status: number, message: string): never { throw Object.assign(new Error(message), { status }); }
const revision = (content: Buffer) => createHash("sha256").update(content).digest("hex");

/** Local project files, confined to the configured task root. Never follows
 * child symlinks or exposes hidden configuration/credentials. */
export class SolarWorkspace {
  readonly root: string;
  constructor(root: string) { this.root = existsSync(root) ? realpathSync(root) : resolve(root); }
  private target(path: unknown, directory = false): string {
    if (typeof path !== "string" || path.includes("\0") || path.includes("\\") || isAbsolute(path)) fail(400, "Invalid workspace path");
    const parts = path.split("/");
    if (path && parts.some(p => !p || p === ".." || p === "." || p.includes(":") || excluded.test(p))) fail(400, "Invalid workspace path");
    if (!directory && (!path || !textFile.test(path))) fail(415, "Only supported text files can be opened");
    const target = resolve(this.root, ...parts);
    const rel = relative(this.root, target);
    if (rel === ".." || rel.startsWith(`..${sep}`) || isAbsolute(rel)) fail(400, "Path outside workspace");
    let cursor = this.root;
    for (const part of parts.filter(Boolean)) {
      cursor = join(cursor, part);
      if (existsSync(cursor) && lstatSync(cursor).isSymbolicLink()) fail(400, "Linked files are not supported");
    }
    return target;
  }
  list(path: string = "") {
    const target = this.target(path, true);
    if (!existsSync(target)) return { root: basename(this.root), path, entries: [] };
    if (!lstatSync(target).isDirectory()) fail(400, "Not a directory");
    const entries = readdirSync(target, { withFileTypes: true })
      .filter(e => !excluded.test(e.name) && !e.isSymbolicLink() && (e.isDirectory() || textFile.test(e.name)))
      .sort((a,b) => Number(b.isDirectory()) - Number(a.isDirectory()) || a.name.localeCompare(b.name))
      .slice(0, 250).map(e => ({ name: e.name, path: path ? `${path}/${e.name}` : e.name, directory: e.isDirectory() }));
    return { root: basename(this.root), path, entries };
  }
  read(path: string) {
    const target = this.target(path);
    if (!existsSync(target)) fail(404, "File not found");
    const info = lstatSync(target);
    if (!info.isFile() || info.size > MAX_BYTES) fail(413, "File is too large or is not a text file");
    const data = readFileSync(target);
    if (data.includes(0)) fail(415, "Binary files cannot be opened");
    return { path, content: data.toString("utf8"), revision: revision(data) };
  }
  save(path: string, content: unknown, expectedRevision: unknown) {
    const target = this.target(path);
    if (typeof content !== "string" || Buffer.byteLength(content) > MAX_BYTES || content.includes("\0")) fail(413, "Invalid or oversized text");
    if (expectedRevision !== null && typeof expectedRevision !== "string") fail(400, "A file revision is required");
    // Synchronous compare + atomic rename keeps simultaneous application writes
    // ordered. A stale editor never silently overwrites another saved version.
    if (existsSync(target)) {
      if (this.read(path).revision !== expectedRevision) fail(409, "This file changed. Your draft is kept; reload before saving.");
    } else if (expectedRevision !== null) fail(409, "This file was removed. Your draft is kept.");
    mkdirSync(dirname(target), { recursive: true });
    const temporary = join(dirname(target), `.solar-${randomUUID()}.tmp`);
    try { writeFileSync(temporary, content, { flag: "wx", mode: 0o600 }); renameSync(temporary, target); }
    finally { rmSync(temporary, { force: true }); }
    return this.read(path);
  }
}
