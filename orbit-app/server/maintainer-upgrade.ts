// The Orbit maintainers team (Pilot, Upstream, Builder) gets its standing
// instructions copied in when the team is created, so a later change to the
// template never reaches a team that already exists. On start, a bot or team
// text that is still exactly an earlier template version (by its hash) moves
// to the current one; anything the person edited themselves is left alone.
import { soulHash } from "./bot-folder.ts";
import { ORBIT_TEAM_ROLES } from "../src/lib/bot-roles.ts";
import { TEAM_TEMPLATES } from "../src/lib/team-templates.ts";

/** Hashes of every earlier shipped version, by the role that replaces it
 * (from git: 032bcfc8, d7ce0e4f, 91d5c5a2, cfe608d2, cdf07fb4, 0f0cbdec). */
const EARLIER_SOULS: Record<keyof typeof ORBIT_TEAM_ROLES, string[]> = {
  chief: [
    "90d7b4d8ad543e53d0ca3628390c3ee71ed98ac96c7abe966498ef8b3c26d5ca",
    "bf6e5d9e0ab72ebb7057c3b7779035e06d2d9d9af12c335ae46c2c22f327d977",
  ],
  upstream: [
    // the single Upstream bot, before there was a team
    "4a9bed468ff78a4695327c6fba5815e0cf66440c6993f4dfdb5557df57e26113",
    "27fd4732879e51d398da45ce48dd52bbc48a35645a532a616b011cfa035a88d5",
    "0ac9f67b66b797e8ead1b6b8a6e155932f5e71f2f9fbe5deeff6617af03d95f2",
    "773444790b8d1b4d07f0da4b1bf0fa51bddb80fd1972a110591498139186f24f",
    "a680031ef190ada10b457b5b845fcbb07cf464ad4d077522352bae2ed7542d1c",
  ],
  builder: [
    "82c9b75d738a74a6f3392fdd69916f32572984d15d76a237c0438133bf238d51",
    "10ab1e1487ad9800d57c051b24fad1237d88f0c2016cb6449a590dabbbbbdc64",
    "2e5c4b0ef936c4656896fd15b855cb3a8e6a8bc68ba7d0db2270b0cad80cfbd4",
    "6b861574f74ed446f7d6261986cf1281dc0b2448777ae72139e492c2812440ba",
  ],
};
const EARLIER_TEAM_INSTRUCTIONS = ["1f08e50c078102f46ba5f1b474420ef36684df0db6d2a23e67c1faf4de736d4c"];

interface UpgradeStore {
  bots: Array<{ id: string; soul?: string; soulDrift?: boolean; section?: string }>;
  setSoul(id: string, soul: string): unknown;
}
interface TeamTexts {
  sections: string[];
  read(section: string): { text: string } | null;
  write(section: string, text: string): unknown;
}

/** Returns what moved, for the log. */
export function upgradeMaintainerInstructions(
  store: UpgradeStore,
  teams: TeamTexts,
  earlier: { souls: Record<keyof typeof ORBIT_TEAM_ROLES, string[]>; team: string[] } = { souls: EARLIER_SOULS, team: EARLIER_TEAM_INSTRUCTIONS },
): { bots: string[]; teams: string[] } {
  const next = new Map<string, string>();
  for (const [role, hashes] of Object.entries(earlier.souls) as Array<[keyof typeof ORBIT_TEAM_ROLES, string[]]>) {
    for (const hash of hashes) next.set(hash, ORBIT_TEAM_ROLES[role].soul);
  }
  const bots: string[] = [];
  for (const bot of store.bots) {
    // a SOUL.md the person edited on disk is theirs to resolve first
    if (!bot.soul || bot.soulDrift) continue;
    const soul = next.get(soulHash(bot.soul));
    if (soul && soul !== bot.soul) { store.setSoul(bot.id, soul); bots.push(bot.id); }
  }
  const current = TEAM_TEMPLATES.find((template) => template.id === "orbit-maintainers")?.instructions;
  const moved: string[] = [];
  if (current) {
    for (const section of teams.sections) {
      const text = teams.read(section)?.text;
      if (text && earlier.team.includes(soulHash(text))) { teams.write(section, current); moved.push(section); }
    }
  }
  return { bots, teams: moved };
}
