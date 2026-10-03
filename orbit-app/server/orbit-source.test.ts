import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

import { orbitSource } from "./orbit-source.ts";

const dirs: string[] = [];
function dir(): string {
  const d = mkdtempSync(join(tmpdir(), "orbit-source-"));
  dirs.push(d);
  return d;
}
afterEach(() => { for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true }); });

// a packaged app: this module lives inside the bundle, not a checkout
const bundled = () => pathToFileURL(join(dir(), "server", "orbit-source.ts")).href;

describe("orbitSource", () => {
  it("uses the checkout a packaged app was built from", async () => {
    const checkout = dir();
    writeFileSync(join(checkout, "package.json"), JSON.stringify({ name: "orbit" }));
    mkdirSync(join(checkout, ".git"));
    const source = await orbitSource(dir(), bundled(), { ORBIT_SOURCE_DIR: `${checkout}/` });
    expect(source).toMatchObject({ path: checkout, kind: "built-from", exists: true, git: true });
  });

  it("falls back to its own clone folder, with the repository to clone", async () => {
    const data = dir();
    const notOrbit = dir();
    const source = await orbitSource(data, bundled(), { ORBIT_SOURCE_DIR: notOrbit, ORBIT_SOURCE_ORIGIN: "https://github.com/DragonQLF/orbit.git" });
    expect(source).toMatchObject({ path: join(data, "source"), kind: "separate", git: false, origin: "https://github.com/DragonQLF/orbit.git" });
  });
});
