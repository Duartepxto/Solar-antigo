import { createHash, randomUUID } from "node:crypto";
import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, realpathSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, isAbsolute, join, relative, resolve, sep } from "node:path";

const MAX_BYTES = 1_000_000;
const MAX_ASSET_BYTES = 20_000_000;
const MAX_ENTRIES = 500;
/** Hidden from the editor: configuration, credentials, dependencies and build output. */
const excluded = /^(?:\..*|node_modules|dist|build|coverage|vendor)$/i;
/** A preview may load built pages, but never dotfiles or dependencies. */
const excludedFromPreview = /^(?:\..*|node_modules)$/i;
const textFile = /\.(?:md|markdown|txt|csv|html|htm|css|scss|sass|less|js|mjs|cjs|ts|tsx|jsx|vue|svelte|astro|json|jsonc|yaml|yml|toml|ini|cfg|conf|xml|svg|py|rb|php|rs|go|java|kt|kts|swift|dart|lua|c|h|cpp|hpp|cc|cs|sql|sh|ps1|bat|gradle|graphql|gql|prisma)$|^(?:dockerfile|makefile|procfile|license|readme)$/i;
/** What a page preview may load, with the type it is served as. */
const ASSET_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8", ".htm": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp", ".avif": "image/avif", ".ico": "image/x-icon",
  ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf", ".otf": "font/otf",
  ".mp3": "audio/mpeg", ".wav": "audio/wav", ".ogg": "audio/ogg", ".mp4": "video/mp4", ".webm": "video/webm",
  ".pdf": "application/pdf", ".txt": "text/plain; charset=utf-8", ".md": "text/plain; charset=utf-8", ".wasm": "application/wasm", ".xml": "application/xml; charset=utf-8",
};
function fail(status: number, message: string): never { throw Object.assign(new Error(message), { status }); }
const revision = (content: Buffer) => createHash("sha256").update(content).digest("hex");

/** Local project files, confined to the configured task root. Never follows
 * child symlinks or exposes hidden configuration/credentials. */
export class SolarWorkspace {
  readonly root: string;
  constructor(root: string) { this.root = existsSync(root) ? realpathSync(root) : resolve(root); }
  private target(path: unknown, kind: "directory" | "text" | "asset" = "text"): string {
    if (typeof path !== "string" || path.includes("\0") || path.includes("\\") || isAbsolute(path)) fail(400, "Invalid workspace path");
    const parts = path.split("/"), hidden = kind === "asset" ? excludedFromPreview : excluded;
    if (path && parts.some(p => !p || p === ".." || p === "." || p.includes(":") || hidden.test(p))) fail(400, "Invalid workspace path");
    if (kind === "text" && (!path || !textFile.test(parts.at(-1) ?? ""))) fail(415, "Only supported text files can be opened");
    if (kind === "asset" && !ASSET_TYPES[extname(path).toLowerCase()]) fail(415, "This file type cannot be previewed");
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
    const target = this.target(path, "directory");
    if (!existsSync(target)) return { root: basename(this.root), path, entries: [], truncated: false };
    if (!lstatSync(target).isDirectory()) fail(400, "Not a directory");
    const visible = readdirSync(target, { withFileTypes: true })
      .filter(e => !excluded.test(e.name) && !e.isSymbolicLink() && (e.isDirectory() || textFile.test(e.name)))
      .sort((a,b) => Number(b.isDirectory()) - Number(a.isDirectory()) || a.name.localeCompare(b.name));
    const entries = visible.slice(0, MAX_ENTRIES).map(e => ({ name: e.name, path: path ? `${path}/${e.name}` : e.name, directory: e.isDirectory() }));
    return { root: basename(this.root), path, entries, truncated: visible.length > MAX_ENTRIES };
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
  /** A file for the live page preview: pages, styles, scripts, images, fonts and media. */
  asset(path: string): { data: Buffer; type: string } {
    const target = this.target(path, "asset");
    if (!existsSync(target)) fail(404, "File not found");
    const info = lstatSync(target);
    if (!info.isFile() || info.size > MAX_ASSET_BYTES) fail(413, "File is too large to preview");
    return { data: readFileSync(target), type: ASSET_TYPES[extname(path).toLowerCase()] };
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
