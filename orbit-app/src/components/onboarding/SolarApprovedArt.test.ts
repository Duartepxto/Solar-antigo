import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { approvedSunGaze, approvedParticlePose } from "./SolarApprovedArt";
import art from "./solar-approved-art.json";

it("uses the approved artwork bytes instead of a regenerated approximation", () => {
  const bytes = readFileSync(new URL("../../../public/solar/brand/welcome-approved-art.png", import.meta.url));
  const approved = readFileSync(new URL("../../../../docs/solar-identity-integration/approved-intro-reference.png", import.meta.url));
  expect(bytes.equals(approved)).toBe(true);
  expect(createHash("sha256").update(bytes).digest("hex")).toBe(art.sourceSha256);
});
it("looks towards the pointer on both sides without leaving the original eye sockets", () => {
  expect(approvedSunGaze(-500, -200)).toMatchObject({ x: expect.any(Number), y: expect.any(Number) });
  expect(approvedSunGaze(-500, -200).x).toBeLessThan(0);
  expect(approvedSunGaze(-500, -200).y).toBeLessThan(0);
  expect(approvedSunGaze(500, 200).x).toBeGreaterThan(0);
  for (const [x, y] of [[1e6, 1e6], [-1e6, 20], [10, -1e6]]) {
    const gaze = approvedSunGaze(x, y);
    expect(Math.hypot(gaze.x / (78 * .065), gaze.y / (78 * .05))).toBeLessThanOrEqual(1.000001);
  }
});
it("rests at the original pose and ignores invalid pointer coordinates", () => {
  expect(approvedSunGaze(0, 0)).toEqual({ x: 0, y: 0 });
  expect(approvedSunGaze(NaN, 10)).toEqual({ x: 0, y: 0 });
  expect(approvedSunGaze(10, Infinity)).toEqual({ x: 0, y: 0 });
});

it("moves fragments around the Sun instead of only vibrating in place", () => {
  const particle = {cx:200,cy:124};
  const first = approvedParticlePose(particle,0,0);
  const later = approvedParticlePose(particle,0,7);
  expect(Math.hypot(later.x-first.x,later.y-first.y)).toBeGreaterThan(40);
  for (let time=0;time<60;time+=1) {
    const pose=approvedParticlePose(particle,0,time);
    expect(Math.hypot(200+pose.x-112,124+pose.y-124)).toBeLessThan(112);
    expect(pose.scale).toBeGreaterThan(.8);
    expect(pose.opacity).toBeGreaterThanOrEqual(0);
  }
});
