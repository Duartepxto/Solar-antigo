import { describe, expect, it } from "vitest";

import { soulHash } from "./bot-folder.ts";
import { upgradeMaintainerInstructions } from "./maintainer-upgrade.ts";
import { ORBIT_TEAM_ROLES } from "../src/lib/bot-roles.ts";
import { TEAM_TEMPLATES } from "../src/lib/team-templates.ts";

const OLD_UPSTREAM = "Push only after the user says yes.";
const OLD_TEAM = "- Every push needs the user's yes, one push at a time";
const earlier = { souls: { chief: [], upstream: [soulHash(OLD_UPSTREAM)], builder: [] }, team: [soulHash(OLD_TEAM)] };

function setup(bots: Array<{ id: string; soul?: string; soulDrift?: boolean }>, texts: Record<string, string>) {
  const store = { bots: bots.map((b) => ({ ...b })), setSoul(id: string, soul: string) { this.bots.find((b) => b.id === id)!.soul = soul; } };
  const teams = { sections: Object.keys(texts), read: (s: string) => ({ text: texts[s]! }), write: (s: string, text: string) => { texts[s] = text; } };
  return { store, teams, texts };
}

describe("upgradeMaintainerInstructions", () => {
  it("moves an untouched earlier template to the current wording", () => {
    const { store, teams, texts } = setup([{ id: "up", soul: OLD_UPSTREAM }], { Orbit: OLD_TEAM });
    expect(upgradeMaintainerInstructions(store, teams, earlier)).toEqual({ bots: ["up"], teams: ["Orbit"] });
    expect(store.bots[0]!.soul).toBe(ORBIT_TEAM_ROLES.upstream.soul);
    expect(texts.Orbit).toBe(TEAM_TEMPLATES[0]!.instructions);
  });

  it("leaves what the person wrote, and a SOUL.md they edited on disk", () => {
    const { store, teams, texts } = setup([
      { id: "edited", soul: `${OLD_UPSTREAM} Also run the e2e suite.` },
      { id: "drift", soul: OLD_UPSTREAM, soulDrift: true },
    ], { Orbit: `${OLD_TEAM}\n- my own rule` });
    expect(upgradeMaintainerInstructions(store, teams, earlier)).toEqual({ bots: [], teams: [] });
    expect(store.bots.map((b) => b.soul)).toEqual([`${OLD_UPSTREAM} Also run the e2e suite.`, OLD_UPSTREAM]);
    expect(texts.Orbit).toBe(`${OLD_TEAM}\n- my own rule`);
  });

  it("is a no-op once current", () => {
    const { store, teams } = setup([{ id: "up", soul: OLD_UPSTREAM }], { Orbit: OLD_TEAM });
    upgradeMaintainerInstructions(store, teams, earlier);
    expect(upgradeMaintainerInstructions(store, teams, earlier)).toEqual({ bots: [], teams: [] });
  });

  it("knows no current text as an earlier one", () => {
    const { store, teams } = setup(
      Object.values(ORBIT_TEAM_ROLES).map((role) => ({ id: role.id, soul: role.soul })),
      { Orbit: TEAM_TEMPLATES[0]!.instructions },
    );
    expect(upgradeMaintainerInstructions(store, teams)).toEqual({ bots: [], teams: [] });
  });
});
