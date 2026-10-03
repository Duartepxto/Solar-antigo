// Speech helper lifecycle, main-process side. The Swift recognizer is a tiny
// background app. In the installed app it runs as Orbit's own child, so
// macOS asks for the microphone and speech recognition once, as Orbit (its
// Info.plist has both purpose strings). A development build's Electron has
// no such strings, and there, or if macOS refuses the child, the helper is
// launched as its own app ("Orbit Speech") through LaunchServices instead.
// Compiled lazily in development; each recording session is one helper run.
// The same helper also reports each display's notch (`--screens`).
//
// On Apple silicon with macOS 14+, dictation uses the bundle's second
// executable, orbit-parakeet: NVIDIA Parakeet v3 on the Neural Engine,
// which works out the spoken language by itself (25 European languages).
// Its model (~0.5 GB) downloads in the background into userData the first
// time Orbit runs; until then, and wherever it can't run, Apple's
// recognizer answers as before. It needs only the microphone.
import { execFile, spawn } from "node:child_process";
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  unwatchFile,
  watchFile,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { app } from "electron";

import {
  buildSpeechHelper,
  parakeetBinary,
  speechHelperBinary,
  speechHelperBundle,
} from "./build-speech-helper.mjs";
import { createSpeechOwner } from "./speech-owner.mjs";
import {
  inputDeviceArgs,
  meterLevel,
  normalizeInputUid,
  parseInputList,
  readSpeechInputPrefs,
  speechInputPrefsFile,
  writeSpeechInputPrefs,
} from "./speech-input-prefs.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "resources", "speech-helper.swift");
const INFO = path.join(__dirname, "resources", "speech-helper-Info.plist");
// Packaged: the helper bundle ships pre-built + signed in Resources. A signed
// app bundle must never be rewritten — lazy compilation would break its seal.
const BUNDLE = app.isPackaged
  ? path.join(process.resourcesPath, "Orbit Speech.app")
  : speechHelperBundle;
const BIN = app.isPackaged
  ? path.join(BUNDLE, "Contents", "MacOS", "speech-helper")
  : speechHelperBinary;

const PARAKEET_BIN = app.isPackaged
  ? path.join(BUNDLE, "Contents", "MacOS", "orbit-parakeet")
  : parakeetBinary;

function ensureBuilt() {
  if (app.isPackaged) return;
  const binaryMtime = existsSync(BIN) ? statSync(BIN).mtimeMs : 0;
  const stale = binaryMtime < Math.max(statSync(SRC).mtimeMs, statSync(INFO).mtimeMs);
  if (!stale) return;
  // the Parakeet package takes minutes; `pnpm build:speech` builds it
  buildSpeechHelper({ parakeet: false });
}

// ── Parakeet: the model, fetched once ──────────────────────────────────────
const modelsDir = () => path.join(app.getPath("userData"), "speech-models");
const readyMarker = () => path.join(modelsDir(), "parakeet-ready.json");
// Set when this run's Parakeet failed to start or load: Apple's recognizer
// answers until Orbit restarts.
let parakeetBroken = false;
let preparing = null;

function parakeetCanRun() {
  // macOS 14 is Darwin 23
  return process.platform === "darwin" && process.arch === "arm64" &&
    Number(os.release().split(".")[0]) >= 23 && existsSync(PARAKEET_BIN);
}

function parakeetReady() {
  return !parakeetBroken && parakeetCanRun() && existsSync(readyMarker());
}

/** Download and warm the Parakeet model in the background, once; later
 * dictation uses it. Safe to call on every launch. */
export function prepareSpeechModels(log = console.log) {
  if (preparing || !parakeetCanRun() || existsSync(readyMarker())) return preparing;
  preparing = new Promise((resolve) => {
    let reported = 0;
    let out = "";
    mkdirSync(modelsDir(), { recursive: true });
    const child = spawn(PARAKEET_BIN, ["--prepare", "--models-dir", modelsDir()], { stdio: ["ignore", "pipe", "ignore"] });
    child.stdout.on("data", (chunk) => {
      out += chunk;
      const progress = [...out.matchAll(/"progress":([\d.]+)/g)].at(-1)?.[1];
      if (progress && Number(progress) >= reported + 0.25) {
        reported = Number(progress);
        log(`[speech] downloading the Parakeet model: ${Math.round(reported * 100)}%`);
      }
    });
    child.on("close", (code) => {
      preparing = null;
      if (code === 0 && out.includes('"ready":true')) {
        writeFileSync(readyMarker(), `${JSON.stringify({ model: "parakeet-tdt-0.6b-v3", at: new Date().toISOString() })}\n`);
        log("[speech] Parakeet ready: dictation now recognizes the language you speak");
      } else {
        log(`[speech] Parakeet model not ready (exit ${code}); Apple's recognizer stays in use`);
      }
      resolve();
    });
    child.on("error", () => { preparing = null; resolve(); });
  });
  return preparing;
}

// Set when macOS ended a directly started helper before it said anything:
// from then on this run uses the separate "Orbit Speech" app.
let directRefused = !app.isPackaged;

/** Each display's notch in points ({ x from the display's left, width,
 * height }), keyed by display id; displays without one are absent. Empty
 * where the helper can't run. */
export function screenNotches() {
  return new Promise((resolve) => {
    if (process.platform !== "darwin") return resolve(new Map());
    try { ensureBuilt(); } catch { return resolve(new Map()); }
    execFile(BIN, ["--screens"], { timeout: 5_000 }, (error, stdout) => {
      const notches = new Map();
      if (!error) {
        try {
          for (const screen of JSON.parse(stdout).screens ?? []) {
            const notch = screen.notch;
            if (notch && notch.width > 0 && notch.height > 0) notches.set(String(screen.id), { x: notch.x, width: notch.width, height: notch.height });
          }
        } catch { /* nothing usable */ }
      }
      resolve(notches);
    });
  });
}

// ── The microphone: which input dictation records from ─────────────────────
// A CoreAudio device UID chosen in Settings, or null for the macOS default.
// Every helper run gets it as `--input-device`; a device that is gone
// (unplugged) makes the helper use the default instead of failing.
let chosenInput; // undefined until first read from userData
function chosenInputUid() {
  if (chosenInput === undefined) chosenInput = readSpeechInputPrefs(speechInputPrefsFile(app.getPath("userData"))).inputUid;
  return chosenInput;
}

/** This computer's microphones ({ uid, name, isDefault }) and the chosen
 * one's UID (null: same as macOS). No inputs where the helper can't run. */
export function listSpeechInputs() {
  return new Promise((resolve) => {
    const selected = chosenInputUid();
    if (process.platform !== "darwin") return resolve({ inputs: [], selected });
    try { ensureBuilt(); } catch { return resolve({ inputs: [], selected }); }
    execFile(BIN, ["--list-inputs"], { timeout: 5_000 }, (error, stdout) => {
      resolve({ inputs: error ? [] : parseInputList(stdout), selected });
    });
  });
}

/** Choose the microphone for later dictation; null goes back to the macOS
 * default. Returns the stored choice. */
export function setSpeechInput(uid) {
  const next = writeSpeechInputPrefs(speechInputPrefsFile(app.getPath("userData")), { inputUid: normalizeInputUid(uid) });
  chosenInput = next.inputUid;
  return next.inputUid;
}

// ── The level meter under Settings' microphone picker ──────────────────────
// One helper run in `--meter` mode for one window at a time, launched the
// way dictation is (a plain child, or the "Orbit Speech" app when macOS
// refuses the child), streaming `speech:meter` { level } to that window and
// { ended: true, reason } when it stops by itself.
let meter = null;

function launchMeter(win, viaApp = directRefused) {
  const sessionDir = mkdtempSync(path.join(app.getPath("temp"), "orbit-meter-"));
  const outputPath = path.join(sessionDir, "stdout.ndjson");
  const errorPath = path.join(sessionDir, "stderr.log");
  const stopPath = path.join(sessionDir, "stop");
  writeFileSync(outputPath, "");
  writeFileSync(errorPath, "");
  const args = ["--meter", ...inputDeviceArgs(chosenInputUid()), "--parent-pid", String(process.pid), "--stop-file", stopPath];
  const startedAt = Date.now();
  let proc;
  try {
    if (!viaApp) {
      const out = openSync(outputPath, "a");
      const err = openSync(errorPath, "a");
      try {
        proc = spawn(BIN, args, { stdio: ["ignore", out, err] });
      } finally {
        closeSync(out);
        closeSync(err);
      }
    } else {
      proc = spawn("/usr/bin/open", ["-n", "-g", "-W", "-o", outputPath, "--stderr", errorPath, BUNDLE, "--args", ...args], { stdio: "ignore" });
    }
  } catch {
    rmSync(sessionDir, { recursive: true, force: true });
    return null;
  }

  const current = { win, stopped: false, stop: null };
  let buf = "";
  let offset = 0;
  let reportedError = null;
  const drain = () => {
    let content;
    try { content = readFileSync(outputPath, "utf8"); } catch { return; }
    if (content.length <= offset) return;
    buf += content.slice(offset);
    offset = content.length;
    let nl;
    while ((nl = buf.indexOf("\n")) !== -1) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line) continue;
      try {
        const parsed = JSON.parse(line);
        if (typeof parsed.error === "string") reportedError = parsed.error;
        const level = meterLevel(parsed);
        if (level !== null && !current.stopped && !win.isDestroyed()) win.webContents.send("speech:meter", { level });
      } catch { /* not a line of ours */ }
    }
  };
  watchFile(outputPath, { interval: 50, persistent: false }, drain);
  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    unwatchFile(outputPath, drain);
    rmSync(sessionDir, { recursive: true, force: true });
  };
  current.stop = () => {
    current.stopped = true;
    try { writeFileSync(stopPath, "stop"); } catch {}
    // a plain child can simply be ended; the app is only told by the marker
    if (!viaApp) proc.kill();
  };
  proc.on("close", (_code, signal) => {
    drain();
    cleanup();
    if (current.stopped || meter !== current) return;
    // macOS ended a plain child before it said anything: the app from now on
    if (!viaApp && signal && offset === 0 && Date.now() - startedAt < 5_000) {
      directRefused = true;
      const next = launchMeter(win, true);
      meter = next;
      if (next) return;
    }
    meter = null;
    if (!win.isDestroyed()) win.webContents.send("speech:meter", { ended: true, reason: reportedError ?? "helper-exited" });
  });
  proc.on("error", () => {
    cleanup();
    if (current.stopped || meter !== current) return;
    meter = null;
    if (!win.isDestroyed()) win.webContents.send("speech:meter", { ended: true, reason: "helper-start-failed" });
  });
  return current;
}

/** Start (or restart, e.g. after a new choice) the level meter for `win`,
 * on the chosen microphone. Another window's meter stops. */
export function startSpeechMeter(win) {
  if (process.platform !== "darwin") return false;
  try { ensureBuilt(); } catch { return false; }
  stopSpeechMeter();
  meter = launchMeter(win);
  return meter !== null;
}

/** Stop the meter; with `win`, only if that window owns it. */
export function stopSpeechMeter(win) {
  if (!meter || (win && meter.win !== win)) return;
  const current = meter;
  meter = null;
  current.stop();
}

function sendEnd(win, info) {
  if (!win.isDestroyed()) win.webContents.send("speech:end", info);
}

/**
 * One helper process for `win`. `endpointMs` is for call mode and the talk
 * character: composer dictation deliberately keeps listening until its mic
 * button is pressed. Returns { stop, finish } or null.
 */
function launchHelper(win, options = {}, session, engine = parakeetReady() ? "parakeet" : "apple", viaApp = directRefused) {
  if (process.platform !== "darwin") {
    sendEnd(win, { code: 2, reason: "unsupported-platform" });
    return null;
  }
  const requested = Number(options?.endpointMs);
  const endpointMs = Number.isFinite(requested) && requested > 0
    ? Math.min(5_000, Math.max(250, Math.round(requested)))
    : 0;
  const args = [...(endpointMs ? ["--endpoint-ms", String(endpointMs)] : []), ...inputDeviceArgs(chosenInputUid())];

  try {
    ensureBuilt();
  } catch {
    sendEnd(win, { code: 1, reason: "helper-build-failed" });
    return null;
  }

  // Either way the helper writes to files we tail, so both paths keep the
  // same NDJSON streaming contract: `open` can only redirect to files, and a
  // direct child is given the same files.
  const sessionDir = mkdtempSync(path.join(app.getPath("temp"), "orbit-speech-"));
  const outputPath = path.join(sessionDir, "stdout.ndjson");
  const errorPath = path.join(sessionDir, "stderr.log");
  const stopPath = path.join(sessionDir, "stop");
  const finishPath = path.join(sessionDir, "finish");
  writeFileSync(outputPath, "");
  writeFileSync(errorPath, "");

  const parakeet = engine === "parakeet";
  // Parakeet needs no Speech Recognition purpose string, so it always runs
  // as a plain child, development builds included.
  if (parakeet) viaApp = false;
  const helperArgs = [...(parakeet ? ["--models-dir", modelsDir()] : []), ...args, "--stop-file", stopPath, "--finish-file", finishPath];
  const startedAt = Date.now();
  let proc;
  try {
    if (!viaApp) {
      const out = openSync(outputPath, "a");
      const err = openSync(errorPath, "a");
      try {
        proc = spawn(parakeet ? PARAKEET_BIN : BIN, helperArgs, { stdio: ["ignore", out, err] });
      } finally {
        closeSync(out);
        closeSync(err);
      }
    } else proc = spawn(
      "/usr/bin/open",
      [
        "-n",
        "-g",
        "-W",
        "-o",
        outputPath,
        "--stderr",
        errorPath,
        BUNDLE,
        "--args",
        ...args,
        "--stop-file",
        stopPath,
        "--finish-file",
        finishPath,
      ],
      { stdio: "ignore" },
    );
  } catch {
    rmSync(sessionDir, { recursive: true, force: true });
    sendEnd(win, { code: 1, reason: "helper-start-failed" });
    return null;
  }

  let buf = "";
  let offset = 0;
  let reportedError = null;
  let completed = false;

  const drain = () => {
    let content;
    try {
      content = readFileSync(outputPath, "utf8");
    } catch {
      return;
    }
    if (content.length <= offset) return;
    buf += content.slice(offset);
    offset = content.length;
    let nl;
    while ((nl = buf.indexOf("\n")) !== -1) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line) continue;
      try {
        const parsed = JSON.parse(line);
        if (typeof parsed.error === "string") reportedError = parsed.error;
        if (parsed.partial === false && typeof parsed.text === "string") completed = true;
        // A stopped/replaced helper can flush one last chunk. Never leak it
        // into the session that replaced it.
        if (session.current() && !win.isDestroyed()) {
          win.webContents.send("speech:transcript", parsed);
        }
      } catch {
        /* non-JSON noise on stdout — ignore */
      }
    }
  };
  watchFile(outputPath, { interval: 50, persistent: false }, drain);

  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    unwatchFile(outputPath, drain);
    rmSync(sessionDir, { recursive: true, force: true });
  };
  // the handle the caller holds; a refused direct start swaps in the app
  const handle = {
    inner: null,
    stop() {
      if (handle.inner) return handle.inner.stop();
      try {
        writeFileSync(stopPath, "stop");
      } catch {}
    },
    finish() {
      if (handle.inner) return handle.inner.finish();
      try {
        writeFileSync(finishPath, "finish");
      } catch {}
    },
  };
  proc.on("close", (code, signal) => {
    drain();
    cleanup();
    // macOS kills a child it won't attribute to Orbit before it prints a
    // line: fall back to the separate app, for this session and the rest.
    const quickDeath = signal && offset === 0 && Date.now() - startedAt < 5_000;
    // Parakeet that couldn't start or load its model: Apple's recognizer
    // takes this turn and the rest of the run.
    if (parakeet && session.current() && !completed && (quickDeath || (reportedError ?? "").startsWith("model-"))) {
      parakeetBroken = true;
      handle.inner = launchHelper(win, options, session, "apple");
      if (!handle.inner) session.release();
      return;
    }
    if (!parakeet && !viaApp && quickDeath && session.current()) {
      directRefused = true;
      handle.inner = launchHelper(win, options, session, "apple", true);
      if (!handle.inner) session.release();
      return;
    }
    // A stop releases ownership before creating the stop marker. Suppressing
    // that close event is essential in call mode: intentional TTS muting must
    // not look like the natural end of a spoken turn.
    if (!session.current()) return;
    session.release();
    if (reportedError) {
      sendEnd(win, { code: 1, reason: reportedError });
    } else if (completed && code === 0) {
      sendEnd(win, { code: 0, reason: "completed" });
    } else {
      sendEnd(win, { code: 1, reason: "helper-exited" });
    }
  });
  proc.on("error", () => {
    cleanup();
    if (!session.current()) return;
    session.release();
    sendEnd(win, { code: 1, reason: "helper-start-failed" });
  });

  return handle;
}

const sessions = createSpeechOwner({ launch: launchHelper, notify: sendEnd });

/** Start a session for `win`; another window's session ends with
 * `speech:end` { code: 1, reason: "preempted" }. */
export function startSpeech(win, options = {}) {
  sessions.start(win, options);
}

/** The window whose session is running, or null. */
export function speechOwner() {
  return sessions.owner();
}

/** Only the owner can stop its session. */
export function stopSpeech(win) {
  return sessions.stop(win);
}

/** Finalize the owner's request and keep it owned until the recognizer
 * emits its final transcript. Used by push-to-talk key release. */
export function finishSpeech(win) {
  return sessions.finish(win);
}

/** `win` is closing or navigating: drop its session quietly. */
export function releaseSpeech(win) {
  return sessions.release(win);
}
