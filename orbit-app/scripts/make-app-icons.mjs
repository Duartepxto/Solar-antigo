// Every app icon from build/icon-source.html, drawn with Orbit's own
// character renderer: the macOS tile (build/icon-1024.png) for the desktop
// apps, a full-bleed square for iOS, and a clear foreground for Android's
// adaptive icon. macOS only: sips, iconutil and ffmpeg.
//
//   node scripts/make-app-icons.mjs            # from the saved masters
//   node scripts/make-app-icons.mjs --render   # draw the masters first (pnpm dev running)
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const root = new URL("..", import.meta.url).pathname;
const master = join(root, "build", "icon-1024.png");
const bleed = join(root, "build", "icon-bleed-1024.png");
const foreground = join(root, "build", "icon-foreground-1024.png");

// draw each mode of the source page in headless Chrome and save its canvas
if (process.argv.includes("--render")) {
  const { spawn } = await import("node:child_process");
  const profile = join(tmpdir(), `orbit-icon-chrome-${process.pid}`);
  const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    ["--headless=new", "--remote-debugging-port=9566", `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  let ws;
  for (let i = 0; i < 50 && !ws; i++) {
    try { const page = (await (await fetch("http://127.0.0.1:9566/json")).json()).find((p) => p.type === "page"); if (page) ws = new WebSocket(page.webSocketDebuggerUrl); } catch { await wait(200); }
  }
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let id = 0; const pending = new Map();
  ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); pending.get(m.id)?.(m.result); pending.delete(m.id); });
  const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
  for (const [mode, file] of [["tile", master], ["bleed", bleed], ["foreground", foreground]]) {
    await send("Page.navigate", { url: `http://127.0.0.1:5199/build/icon-source.html?mode=${mode}` });
    await wait(2500);
    const r = await send("Runtime.evaluate", { expression: "window.iconPng()", returnByValue: true });
    writeFileSync(file, Buffer.from(r.result.value.split(",")[1], "base64"));
  }
  ws.close();
  // let Chrome finish writing its profile before it is removed
  await new Promise((r) => { chrome.once("exit", r); chrome.kill(); });
  rmSync(profile, { recursive: true, force: true, maxRetries: 5 });
}
const work = join(tmpdir(), `orbit-icons-${process.pid}`);
mkdirSync(work, { recursive: true });

function png(size) {
  const out = join(work, `${size}.png`);
  execFileSync("sips", ["-z", String(size), String(size), master, "--out", out], { stdio: "ignore" });
  return out;
}

// macOS: the iconset and the .icns packed from it
const iconset = join(root, "build", "icon.iconset");
rmSync(iconset, { recursive: true, force: true });
mkdirSync(iconset);
for (const size of [16, 32, 64, 128, 256, 512]) {
  copyFileSync(png(size), join(iconset, `icon_${size}x${size}.png`));
  copyFileSync(png(size * 2), join(iconset, `icon_${size}x${size}@2x.png`));
}
execFileSync("iconutil", ["-c", "icns", iconset, "-o", join(root, "build", "icon.icns")]);

// Windows: an .ico of PNG entries (Vista and later read these)
const icoSizes = [16, 24, 32, 48, 64, 128, 256];
const images = icoSizes.map((size) => readFileSync(png(size)));
const header = Buffer.alloc(6 + 16 * images.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = header.length;
images.forEach((data, index) => {
  const size = icoSizes[index];
  const entry = 6 + index * 16;
  header.writeUInt8(size >= 256 ? 0 : size, entry);
  header.writeUInt8(size >= 256 ? 0 : size, entry + 1);
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(data.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += data.length;
});
writeFileSync(join(root, "build", "icon.ico"), Buffer.concat([header, ...images]));

// the window and dock icon while running unpackaged, and Linux
copyFileSync(master, join(root, "electron", "resources", "app-icon.png"));

// SVG wrappers for Linux packaging and the browser tab: the master's pixels,
// since the particle character has no vector form
const svg = (size, file) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><image width="${size}" height="${size}" href="data:image/png;base64,${readFileSync(file).toString("base64")}"/></svg>\n`;
writeFileSync(join(root, "build", "icon.svg"), svg(1024, master));
writeFileSync(join(root, "electron", "resources", "app-icon.svg"), svg(256, png(256)));
writeFileSync(join(root, "public", "app-icon.svg"), svg(128, png(128)));

// iOS: one opaque 1024px square (the App Store refuses an alpha channel)
execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", bleed, "-pix_fmt", "rgb24",
  join(root, "ios", "App", "Assets.xcassets", "AppIcon.appiconset", "icon-1024.png")]);

// Android: the adaptive icon's foreground and themed (monochrome) layer; the
// launcher draws its own shape over the background colour
const res = join(root, "android", "app", "src", "main", "res", "drawable-nodpi");
mkdirSync(res, { recursive: true });
execFileSync("sips", ["-z", "432", "432", foreground, "--out", join(res, "ic_launcher_foreground.png")], { stdio: "ignore" });
copyFileSync(join(res, "ic_launcher_foreground.png"), join(res, "ic_launcher_monochrome.png"));

rmSync(work, { recursive: true, force: true });
console.log("app icons written from build/icon-1024.png");
