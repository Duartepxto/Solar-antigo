import assert from "node:assert/strict";
import test from "node:test";
import { createSpeechLease } from "./speech-owner.mjs";

test("Whisper ownership survives transcription and rejects another window or stale cleanup", () => {
  const lease = createSpeechLease();
  const main = {}, pill = {};
  const first = lease.claim(main);
  assert.ok(first);
  assert.equal(lease.claim(pill), null);
  assert.equal(lease.release(pill, first), false);
  assert.equal(lease.release(main, first), true);
  const second = lease.claim(main);
  assert.notEqual(second, first);
  assert.equal(lease.release(main, first), false);
  assert.equal(lease.claim(pill), null);
  assert.equal(lease.release(main), true, "destroying the owner releases its microphone");
  assert.ok(lease.claim(pill));
});
