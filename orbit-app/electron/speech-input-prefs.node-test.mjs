import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  defaultSpeechInputPrefs,
  inputDeviceArgs,
  meterLevel,
  normalizeInputUid,
  parseInputList,
  parseSpeechInputPrefs,
  readSpeechInputPrefs,
  speechInputPrefsFile,
  writeSpeechInputPrefs,
} from "./speech-input-prefs.mjs";

// Scratch space inside the repo's ignored scratch folder, never /tmp.
const scratchRoot = path.join(path.dirname(new URL(import.meta.url).pathname), "..", ".orbit-scratch", "node-tests");
function scratch() {
  fs.mkdirSync(scratchRoot, { recursive: true });
  return fs.mkdtempSync(path.join(scratchRoot, "speech-input-"));
}

const USB = "AppleUSBAudioEngine:LCS USB Audio:MMIC-SC:20200508V100:2";

test("a device UID is kept as is; anything else means the macOS default", () => {
  assert.equal(normalizeInputUid(USB), USB);
  assert.equal(normalizeInputUid("  BuiltInMicrophoneDevice "), "BuiltInMicrophoneDevice");
  assert.equal(normalizeInputUid(""), null);
  assert.equal(normalizeInputUid("   "), null);
  assert.equal(normalizeInputUid(null), null);
  assert.equal(normalizeInputUid(42), null);
  assert.equal(normalizeInputUid({ uid: USB }), null);
  assert.equal(normalizeInputUid("x".repeat(513)), null);
  assert.equal(normalizeInputUid("bad\nuid"), null);
});

test("preferences parse field by field and default to the macOS input", () => {
  assert.deepEqual(defaultSpeechInputPrefs(), { inputUid: null });
  assert.deepEqual(parseSpeechInputPrefs(null), { inputUid: null });
  assert.deepEqual(parseSpeechInputPrefs([USB]), { inputUid: null });
  assert.deepEqual(parseSpeechInputPrefs({ inputUid: 7 }), { inputUid: null });
  assert.deepEqual(parseSpeechInputPrefs({ version: 1, inputUid: USB, extra: true }), { inputUid: USB });
});

test("preferences round-trip atomically and survive a damaged file", () => {
  const dir = scratch();
  try {
    const file = speechInputPrefsFile(path.join(dir, "userData"));
    assert.equal(path.basename(file), "speech-input.json");
    assert.deepEqual(readSpeechInputPrefs(file), { inputUid: null }, "no file yet");
    assert.deepEqual(writeSpeechInputPrefs(file, { inputUid: USB }), { inputUid: USB });
    assert.deepEqual(readSpeechInputPrefs(file), { inputUid: USB });
    assert.deepEqual(JSON.parse(fs.readFileSync(file, "utf8")), { version: 1, inputUid: USB });
    assert.deepEqual(fs.readdirSync(path.dirname(file)), ["speech-input.json"], "no temp file left behind");
    assert.equal(fs.statSync(file).mode & 0o777, 0o600);
    writeSpeechInputPrefs(file, { inputUid: null });
    assert.deepEqual(readSpeechInputPrefs(file), { inputUid: null });
    fs.writeFileSync(file, "{ half");
    assert.deepEqual(readSpeechInputPrefs(file), { inputUid: null });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("a failed write leaves the previous choice in place", () => {
  const dir = scratch();
  try {
    const file = speechInputPrefsFile(dir);
    writeSpeechInputPrefs(file, { inputUid: USB });
    const failing = { ...fs, renameSync() { throw new Error("disk full"); } };
    assert.throws(() => writeSpeechInputPrefs(file, { inputUid: "BuiltInMicrophoneDevice" }, failing), /disk full/);
    assert.deepEqual(readSpeechInputPrefs(file), { inputUid: USB });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("the helper's input list is parsed, cleaned and de-duplicated", () => {
  const line = JSON.stringify({
    inputs: [
      { uid: USB, name: "MMIC-SC", isDefault: false },
      { uid: "BuiltInHeadphoneInputDevice", name: "Microfone externo", isDefault: true },
      { uid: "BuiltInMicrophoneDevice", name: "  ", isDefault: "yes" },
      { uid: USB, name: "again" },
      { uid: "", name: "no uid" },
      null,
    ],
  });
  assert.deepEqual(parseInputList(`noise\n${line}\n`), [
    { uid: USB, name: "MMIC-SC", isDefault: false },
    { uid: "BuiltInHeadphoneInputDevice", name: "Microfone externo", isDefault: true },
    { uid: "BuiltInMicrophoneDevice", name: "BuiltInMicrophoneDevice", isDefault: false },
  ]);
  assert.deepEqual(parseInputList(""), []);
  assert.deepEqual(parseInputList("not json"), []);
  assert.deepEqual(parseInputList('{"inputs":"nope"}'), []);
});

test("helper arguments name the device only when one is chosen", () => {
  assert.deepEqual(inputDeviceArgs(USB), ["--input-device", USB]);
  assert.deepEqual(inputDeviceArgs(null), []);
  assert.deepEqual(inputDeviceArgs(""), []);
});

test("meter lines become a level between 0 and 1", () => {
  assert.equal(meterLevel({ level: 0.42 }), 0.42);
  assert.equal(meterLevel({ level: 3 }), 1);
  assert.equal(meterLevel({ level: -1 }), 0);
  assert.equal(meterLevel({ level: Number.NaN }), null);
  assert.equal(meterLevel({ error: "mic-denied" }), null);
  assert.equal(meterLevel(null), null);
});
