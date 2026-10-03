import { describe, expect, it } from "vitest";
import { renameText } from "./upstream-port.ts";

describe("upstream patches renamed for Orbit", () => {
  it("renames what Orbit owns and keeps what it does not", () => {
    expect(renameText("diff --git a/server/openmausbot.ts b/server/openmausbot.ts\n+const dir = process.env.OMB_DATA_DIR ?? '~/.openmausbot';"))
      .toBe("diff --git a/server/orbit.ts b/server/orbit.ts\n+const dir = process.env.ORBIT_DATA_DIR ?? '~/.orbit';");
    expect(renameText("OpenMausBot uses scripts/control-omb.ts and runControlOmb()")).toBe("Orbit uses scripts/control-orbit.ts and runControlOrbit()");
    expect(renameText("https://accounts.openmausbot.com and milind-soni/OpenMausBot and omb_install_x and omb1.key"))
      .toBe("https://accounts.openmausbot.com and milind-soni/OpenMausBot and omb_install_x and omb1.key");
    expect(renameText("tomb combine COMBINATORS")).toBe("tomb combine COMBINATORS");
  });
});
