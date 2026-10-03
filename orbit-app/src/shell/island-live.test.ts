import { describe, expect, it } from "vitest";
import { IslandPointer } from "./island-hover";
import { createFaceLoop, faceFrameInterval } from "./face-loop";

function pointer(takes = true) {
  const calls: string[] = [];
  const island = new IslandPointer({ interactive: (take) => calls.push(take ? "take" : "release") });
  island.setTakes(takes);
  return { island, calls };
}

describe("the talking island takes a click, from main's pointer watch and forwarded moves", () => {
  it("main's enter lets the talking island take the mouse with no forwarded move at all (the real Mac)", () => {
    const { island, calls } = pointer();
    island.fromMain(true);
    expect(calls).toEqual(["take"]);
    island.fromMain(false);
    expect(calls).toEqual(["take", "release"]);
  });

  it("the two sources agreeing are heard once", () => {
    const { island, calls } = pointer();
    island.fromPage(true);
    island.fromMain(true);
    island.fromPage(true);
    expect(calls).toEqual(["take"]);
    island.fromMain(false);
    island.fromPage(false);
    expect(calls).toEqual(["take", "release"]);
  });

  it("the newest report wins: a stale forwarded point can't hold the mouse", () => {
    const { island, calls } = pointer();
    island.fromPage(true);
    // the pointer left without the page hearing it; main saw it go
    island.fromMain(false);
    expect(calls).toEqual(["take", "release"]);
    // the island resizing re-tests the old forwarded point: ignored now
    island.retest(true);
    expect(calls).toEqual(["take", "release"]);
    expect(island.isOver).toBe(false);
    // a fresh forwarded move counts again, and so does its re-test
    island.fromPage(false);
    island.retest(true);
    expect(calls).toEqual(["take", "release", "take"]);
  });

  it("at rest the island never takes the mouse, even with the pointer over the notch", () => {
    const { island, calls } = pointer(false);
    island.fromMain(true);
    island.fromPage(true);
    expect(calls).toEqual([]);
    // ⌥T with the pointer still there: now it takes the click that stops it
    island.setTakes(true);
    expect(calls).toEqual(["take"]);
    // back to rest
    island.setTakes(false);
    expect(calls).toEqual(["take", "release"]);
  });
});

function faceClock() {
  let now = 0;
  let next = 1;
  const frames = new Map<number, (ms: number) => void>();
  const draws: Array<{ t: number; still: boolean }> = [];
  const deps = {
    request: (cb: (ms: number) => void) => {
      const id = next++;
      frames.set(id, cb);
      return id;
    },
    cancel: (id: number) => void frames.delete(id),
    draw: (t: number, _dt: number, still: boolean) => void draws.push({ t, still }),
    interval: () => 1 / 30,
    now: () => now,
  };
  /** Run the display's frames for `ms` at 60 Hz. */
  const run = (ms: number) => {
    const end = now + ms;
    while (now < end) {
      now += 1000 / 60;
      const due = [...frames.values()];
      frames.clear();
      for (const cb of due) cb(now);
    }
  };
  return { deps, draws, frames, run };
}

describe("the shell character's loop", () => {
  it("a face that isn't live draws one still frame and asks for no frames", () => {
    const clock = faceClock();
    const loop = createFaceLoop(clock.deps, { live: false });
    expect(clock.draws).toEqual([{ t: 0, still: true }]);
    clock.run(2_000);
    expect(clock.draws).toHaveLength(1);
    expect(clock.frames.size).toBe(0);
    expect(loop.running).toBe(false);
    // its mood changed: one new still, still no loop
    loop.refresh();
    expect(clock.draws).toHaveLength(2);
    expect(loop.running).toBe(false);
  });

  it("live, it draws within its budget; paused, it stops and leaves a still", () => {
    const clock = faceClock();
    const loop = createFaceLoop(clock.deps, { live: true });
    expect(clock.draws).toHaveLength(0);
    clock.run(1_000);
    // 30 fps budget on a 60 Hz display
    expect(clock.draws.length).toBeGreaterThanOrEqual(28);
    expect(clock.draws.length).toBeLessThanOrEqual(31);
    expect(clock.draws.every((draw) => !draw.still)).toBe(true);
    loop.setLive(false);
    const drawn = clock.draws.length;
    expect(clock.draws.at(-1)?.still).toBe(true);
    clock.run(2_000);
    expect(clock.draws).toHaveLength(drawn);
    expect(clock.frames.size).toBe(0);
    loop.refresh();
    expect(clock.draws).toHaveLength(drawn + 1);
    loop.setLive(true);
    clock.run(500);
    expect(clock.draws.length).toBeGreaterThan(drawn + 10);
    // a live face's refresh draws nothing extra: the loop has it
    loop.dispose();
    expect(clock.frames.size).toBe(0);
  });

  it("a hidden window stops a live face and brings it back when shown", () => {
    const clock = faceClock();
    const loop = createFaceLoop(clock.deps, { live: true });
    clock.run(200);
    loop.setShown(false);
    const drawn = clock.draws.length;
    clock.run(1_000);
    expect(clock.draws).toHaveLength(drawn);
    expect(clock.frames.size).toBe(0);
    loop.setShown(true);
    clock.run(200);
    expect(clock.draws.length).toBeGreaterThan(drawn);
    loop.dispose();
  });

  it("mini faces cap at 30 fps even when live; big ones run 60 while busy", () => {
    expect(faceFrameInterval("pleading", true, 99)).toBe(1 / 30);
    expect(faceFrameInterval("thinking", true, 0)).toBe(1 / 30);
    expect(faceFrameInterval("thinking", false, 99)).toBe(1 / 60);
    expect(faceFrameInterval("idle", false, 99)).toBe(1 / 30);
    expect(faceFrameInterval("idle", false, 0.5)).toBe(1 / 60);
  });
});
