// Desktop preferences for the Orbit assistant's Mac shell: the two global
// hotkeys, "screen access paused" and "show Orbit in the notch". They belong to this computer's app,
// not the harness, so they live in Electron's userData next to the window
// state (docs/design/orbit-agent.md, contract 7). Pure and Electron-free.
import fs from "node:fs";
import path from "node:path";

// Two keys each: Option-O (O for Orbit) for the bar, Option-T to talk.
// Not Option-Space: ChatGPT's and Codex's desktop apps already hold it.
export const DEFAULT_HOTKEYS = Object.freeze({
  quick: "Alt+O",
  talk: "Alt+T",
});
// Earlier defaults. Someone who never changed them gets the current ones;
// a hotkey they chose stays theirs.
const RETIRED_DEFAULTS = Object.freeze({
  quick: ["Control+Alt+Space", "Alt+Space"],
  talk: ["Control+Alt+Shift+Space"],
});

export const HOTKEY_IDS = Object.freeze(["quick", "talk"]);

const MODIFIERS = new Map([
  ["control", "Control"], ["ctrl", "Control"],
  ["alt", "Alt"], ["option", "Alt"],
  ["shift", "Shift"],
  ["command", "Command"], ["cmd", "Command"], ["super", "Command"], ["meta", "Command"],
]);
const MODIFIER_ORDER = ["Control", "Alt", "Shift", "Command"];

const NAMED_KEYS = new Map([
  "Space", "Tab", "Backspace", "Delete", "Insert", "Return", "Enter", "Up", "Down", "Left", "Right",
  "Home", "End", "PageUp", "PageDown", "Escape", "Plus",
].map((name) => [name.toLowerCase(), name === "Enter" ? "Return" : name]));
const PUNCTUATION = new Set([")", "!", "@", "#", "$", "%", "^", "&", "*", "(", ":", ";", "<", "=", ">", "?", "[", "]", "{", "}", "|", "\\", "/", "`", "~", ",", ".", "'", '"', "-", "_"]);

function canonicalKey(raw) {
  if (/^[a-z0-9]$/i.test(raw)) return raw.toUpperCase();
  if (/^f([1-9]|1\d|2[0-4])$/i.test(raw)) return raw.toUpperCase();
  if (PUNCTUATION.has(raw)) return raw;
  return NAMED_KEYS.get(raw.toLowerCase()) ?? null;
}

/**
 * An Electron accelerator in one canonical spelling ("Control+Alt+Space"),
 * "" for "no shortcut", or null when the value cannot be a global hotkey.
 * A hotkey needs Control, Option or Command: Shift alone would steal typing.
 */
export function normalizeAccelerator(value) {
  if (value === "" || value === null) return "";
  if (typeof value !== "string" || value.length > 80) return null;
  // "Plus" is the key; a literal "+" separates parts.
  const parts = value.split("+").map((part) => part.trim());
  if (parts.some((part) => !part)) return null;
  const modifiers = new Set();
  let key = null;
  for (const part of parts) {
    const modifier = MODIFIERS.get(part.toLowerCase());
    if (modifier) {
      modifiers.add(modifier);
      continue;
    }
    if (key !== null) return null;
    key = canonicalKey(part);
    if (key === null) return null;
  }
  if (key === null) return null;
  if (![...modifiers].some((modifier) => modifier !== "Shift")) return null;
  return [...MODIFIER_ORDER.filter((modifier) => modifiers.has(modifier)), key].join("+");
}

export function defaultPrefs() {
  return { hotkeys: { ...DEFAULT_HOTKEYS }, screenPaused: false };
}

/** Whatever is on disk, made safe: a bad or missing field falls back to its
 * default instead of discarding the rest, and a field no longer used (the
 * old "Show Orbit in the notch" switch, `notchIsland`) is dropped. */
export function parsePrefs(raw) {
  const prefs = defaultPrefs();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return prefs;
  if (raw.hotkeys && typeof raw.hotkeys === "object") {
    for (const id of HOTKEY_IDS) {
      const normalized = normalizeAccelerator(raw.hotkeys[id]);
      if (normalized !== null && !RETIRED_DEFAULTS[id].includes(normalized)) prefs.hotkeys[id] = normalized;
    }
  }
  if (typeof raw.screenPaused === "boolean") prefs.screenPaused = raw.screenPaused;
  if (prefs.hotkeys.quick && prefs.hotkeys.quick === prefs.hotkeys.talk) prefs.hotkeys.talk = "";
  return prefs;
}

export function prefsFile(userData) {
  return path.join(userData, "orbit-shell.json");
}

export function readPrefs(file, io = fs) {
  try {
    return parsePrefs(JSON.parse(io.readFileSync(file, "utf8")));
  } catch {
    return defaultPrefs();
  }
}

/** Atomic: a crash mid-write must not leave a half file that loses both
 * hotkeys on the next launch. */
export function writePrefs(file, prefs, io = fs) {
  const clean = parsePrefs(prefs);
  const body = `${JSON.stringify({ version: 1, ...clean }, null, 2)}\n`;
  const temp = `${file}.${process.pid}.tmp`;
  io.mkdirSync(path.dirname(file), { recursive: true });
  io.writeFileSync(temp, body, { mode: 0o600 });
  io.renameSync(temp, file);
  return clean;
}
