// Record the README's GIFs from the Orbit prototype: headless Chrome over the
// DevTools protocol, a script of steps (film, click, press a button, type),
// frames from Chrome's screencast with their real timing. See make.sh.
//
//   node scripts/readme-gifs/record.mjs <url> <out-dir> '<steps-json>'

import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
const [url, outDir, mode] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless=new", "--remote-debugging-port=9555", `--user-data-dir=${outDir}/../profile`, "--window-size=1440,900",
  "--hide-scrollbars", "--force-device-scale-factor=1", "about:blank"], { stdio: "ignore" });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let ws;
for (let i = 0; i < 50 && !ws; i++) {
  try { const list = await (await fetch("http://127.0.0.1:9555/json")).json(); const page = list.find((p) => p.type === "page"); if (page) ws = new WebSocket(page.webSocketDebuggerUrl); } catch {}
  if (!ws) await wait(200);
}
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0; const pending = new Map();
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result ?? m.error); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Page.enable");
await send("Page.navigate", { url });
await wait(4000);
const shot = async (name) => { const r = await send("Page.captureScreenshot", { format: "jpeg", quality: 88 }); writeFileSync(`${outDir}/${name}.jpg`, Buffer.from(r.data, "base64")); };
const click = async (x, y) => { for (const type of ["mousePressed", "mouseReleased"]) await send("Input.dispatchMouseEvent", { type, x, y, button: "left", clickCount: 1 }); };
const move = async (x, y) => send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
if (mode === "still") { await shot("still"); }
else {
  const steps = JSON.parse(mode);
  let f = 0;
  // Chrome's screencast streams frames as the page paints them, each with its
  // real timestamp; frames.txt keeps the timing for the encoder
  const timing = [];
  let recording = false, last = null;
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.method !== "Page.screencastFrame") return;
    send("Page.screencastFrameAck", { sessionId: m.params.sessionId });
    if (!recording) return;
    const name = String(f++).padStart(4, "0") + ".jpg";
    writeFileSync(`${outDir}/${name}`, Buffer.from(m.params.data, "base64"));
    const t = m.params.metadata.timestamp;
    if (last) last.duration = Math.min(0.2, t - last.t);
    last = { name, t, duration: 1 / 20 };
    timing.push(last);
  });
  const film = async (ms) => {
    recording = true;
    await send("Page.startScreencast", { format: "jpeg", quality: 88, maxWidth: 1440, maxHeight: 900, everyNthFrame: 1 });
    await wait(ms);
    await send("Page.stopScreencast");
    recording = false;
    // a cut between filmed stretches: the last frame holds briefly, not for the gap
    if (last) { last.duration = 1 / 20; last = null; }
  };
  process.on("exit", () => writeFileSync(`${outDir}/frames.txt`, timing.map((x) => `file '${x.name}'\nduration ${x.duration.toFixed(4)}`).join("\n") + (timing.length ? `\nfile '${timing[timing.length - 1].name}'\n` : "")));
  for (const s of steps) {
    if (s.film) await film(s.film);
    if (s.filmUntil) {
      // keep filming until an element with this exact text is on screen (30s at most)
      const found = async () => (await send("Runtime.evaluate", { returnByValue: true, expression: `[...document.querySelectorAll("button, [role=button], div, span")].some((e) => e.offsetParent && e.textContent.trim() === ${JSON.stringify(s.filmUntil)})` }))?.result?.value;
      const end = Date.now() + 30000;
      while (!(await found()) && Date.now() < end) await film(250);
    }
    if (s.waitUntil) {
      const found = async () => (await send("Runtime.evaluate", { returnByValue: true, expression: `[...document.querySelectorAll("button, [role=button], div, span")].some((e) => e.offsetParent && e.textContent.trim() === ${JSON.stringify(s.waitUntil)})` }))?.result?.value;
      const end = Date.now() + 30000;
      while (!(await found()) && Date.now() < end) await wait(200);
    }
    if (s.shot) await shot(s.shot);
    if (s.dump) { const r = await send("Runtime.evaluate", { returnByValue: true, expression: `[...document.querySelectorAll("button")].filter((e) => e.offsetParent).map((e) => e.textContent.trim()).filter(Boolean).slice(0, 40).join(" | ")` }); console.log(s.dump, "→", r?.result?.value); }
    if (s.click) await click(...s.click);
    if (s.move) await move(...s.move);
    if (s.wait) await wait(s.wait);
    if (s.js) await send("Runtime.evaluate", { expression: s.js, awaitPromise: true });
    if (s.text) {
      // click the element whose own text is exactly this (buttons, pills, menu rows)
      const r = await send("Runtime.evaluate", { returnByValue: true, expression: `(() => { const want = ${JSON.stringify(s.text)}; const el = [...document.querySelectorAll("button, [role=button], [role=option], a, div, span")].filter((e) => e.offsetParent && e.textContent.trim() === want).sort((a, b) => a.textContent.length - b.textContent.length)[0]; if (!el) return null; const b = el.getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; })()` });
      const at = r?.result?.value; if (at) await click(at[0], at[1]); else console.error("no element:", s.text);
    }
    if (s.type) await send("Input.insertText", { text: s.type });
    if (s.any) {
      // press whichever of these buttons is showing: walks a flow of steps
      const r = await send("Runtime.evaluate", { returnByValue: true, expression: `(() => { for (const want of ${JSON.stringify(s.any)}) { const b = [...document.querySelectorAll("button")].filter((e) => e.offsetParent && e.textContent.trim() === want).pop(); if (b) { b.click(); return want; } } return null; })()` });
      console.log("pressed", r?.result?.value);
    }
    if (s.button) {
      const r = await send("Runtime.evaluate", { returnByValue: true, expression: `(() => { const b = [...document.querySelectorAll("button")].filter((e) => e.offsetParent && e.textContent.trim() === ${JSON.stringify(s.button)}).pop(); if (!b) return false; b.click(); return true; })()` });
      if (!r?.result?.value) console.error("no button:", s.button);
    }
    if (s.cmdk) { await send("Input.dispatchKeyEvent", { type: "keyDown", key: "k", code: "KeyK", modifiers: 4, windowsVirtualKeyCode: 75 }); await send("Input.dispatchKeyEvent", { type: "keyUp", key: "k", code: "KeyK", modifiers: 4 }); }
    if (s.key) { await send("Input.dispatchKeyEvent", { type: "keyDown", key: s.key, code: s.key, windowsVirtualKeyCode: s.key === "Escape" ? 27 : 0 }); await send("Input.dispatchKeyEvent", { type: "keyUp", key: s.key, code: s.key }); }
  }
  console.log("frames", f);
}
ws.close(); chrome.kill();
