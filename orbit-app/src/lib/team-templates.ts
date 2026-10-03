// Whole teams created in one step from the New bot panel. A template names
// a team (a map section), its Chief, and the members the Chief coordinates;
// each member is an ordinary role (bot-roles.ts).
import { ORBIT_TEAM_ROLES, type BotRole } from "./bot-roles.ts";

export interface TeamTemplate {
  id: string;
  /** The team's name on the map. */
  team: string;
  title: string;
  description: string;
  chief: BotRole;
  members: BotRole[];
  /** The team's shared instructions (every member reads them each turn,
   * so they stay short: the facts, not the how-to each role already has). */
  instructions: string;
}

export const TEAM_TEMPLATES: TeamTemplate[] = [
  {
    id: "orbit-maintainers",
    team: "Orbit",
    title: "Orbit maintainers",
    description: "Upstream brings in OpenMausBot's new work, Builder makes what you ask for, and a Chief hands each request to the right one without reading the code twice. They work in Orbit's own code and ask before every push.",
    chief: ORBIT_TEAM_ROLES.chief,
    members: [ORBIT_TEAM_ROLES.upstream, ORBIT_TEAM_ROLES.builder],
    instructions: `Goals
- Keep Orbit current with OpenMausBot without losing what makes it Orbit: its interface, its names, no hosted services
- Build what the user asks for in Orbit

Decisions
- Orbit is the user's own project; "origin" is their repository, "upstream" is OpenMausBot
- Upstream ports upstream commits, Builder builds requests, Pilot routes and never reads the code
- Every push needs a yes: from the user, or passed on by Pilot, whose go-ahead is the user's. One push at a time

Preferences
- Report in a few lines: what changed, commit ids, check results, open questions`,
  },
];
