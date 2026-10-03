// Which microphone Orbit's voice input records from, on this computer. The
// choice is a CoreAudio device UID (null: whatever macOS uses as its input),
// kept in Electron's userData like the shell's other desktop preferences;
// it never goes to the server. The speech helpers take it as
// `--input-device` and fall back to the default when that device is gone.
// Pure and Electron-free, so it is unit-tested.
import fs from "node:fs";
import path from "node:path";

const MAX_UID = 512;

/** A device UID as stored and passed to the helper, or null ("same as
 * macOS") for anything that can't be one. */
export function normalizeInputUid(value) {
  if (typeof value !== "string") return null;
  const uid = value.trim();
  if (!uid || uid.length > MAX_UID) return null;
  // a UID never has control characters
  if ([...uid].some((char) => char.charCodeAt(0) < 0x20 || char.charCodeAt(0) === 0x7f)) return null;
  return uid;
}

export function defaultSpeechInputPrefs() {
  return { inputUid: null };
}

export function parseSpeechInputPrefs(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return defaultSpeechInputPrefs();
  return { inputUid: normalizeInputUid(raw.inputUid) };
}

export function speechInputPrefsFile(userData) {
  return path.join(userData, "speech-input.json");
}

export function readSpeechInputPrefs(file, io = fs) {
  try {
    return parseSpeechInputPrefs(JSON.parse(io.readFileSync(file, "utf8")));
  } catch {
    return defaultSpeechInputPrefs();
  }
}

/** Atomic, like the shell's prefs: a crash mid-write leaves the old file. */
export function writeSpeechInputPrefs(file, prefs, io = fs) {
  const clean = parseSpeechInputPrefs(prefs);
  const temp = `${file}.${process.pid}.tmp`;
  io.mkdirSync(path.dirname(file), { recursive: true });
  io.writeFileSync(temp, `${JSON.stringify({ version: 1, ...clean }, null, 2)}\n`, { mode: 0o600 });
  io.renameSync(temp, file);
  return clean;
}

/** The helper's `--list-inputs` line as [{ uid, name, isDefault }]; entries
 * without a usable UID are dropped, and a bad line is an empty list. */
export function parseInputList(stdout) {
  let parsed;
  try {
    parsed = JSON.parse(String(stdout).trim().split("\n").at(-1) ?? "");
  } catch {
    return [];
  }
  if (!Array.isArray(parsed?.inputs)) return [];
  const seen = new Set();
  const inputs = [];
  for (const entry of parsed.inputs) {
    const uid = normalizeInputUid(entry?.uid);
    if (!uid || seen.has(uid)) continue;
    seen.add(uid);
    const name = typeof entry.name === "string" && entry.name.trim() ? entry.name.trim().slice(0, 200) : uid;
    inputs.push({ uid, name, isDefault: entry.isDefault === true });
  }
  return inputs;
}

/** The helper arguments for a chosen device: none for "same as macOS". */
export function inputDeviceArgs(uid) {
  const clean = normalizeInputUid(uid);
  return clean ? ["--input-device", clean] : [];
}

/** One `--meter` line's level, 0…1, or null for anything else. */
export function meterLevel(line) {
  const level = line?.level;
  return typeof level === "number" && Number.isFinite(level) ? Math.min(1, Math.max(0, level)) : null;
}
