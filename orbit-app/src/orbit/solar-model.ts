import type { OrbitBot, OrbitModel, Point } from './model';
import { assignSolarSkins, loadSolarSkins, saveSolarSkins, type SolarSkinMap } from './solar-skins';

export type SolarSkin = 'mercury' | 'venus' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune';
export type SolarMoonSkin = 'moon-silver' | 'moon-ice' | 'moon-volcanic' | 'moon-sand' | 'moon-crater';
export interface SolarNode {
  id: string; bot: OrbitBot | null; parentId: string | null;
  kind: 'sun' | 'planet' | 'moon'; name: string; team: string; color: string; skin?: SolarSkin; moonSkin?: SolarMoonSkin;
}
export interface SolarLayout { version: 1; offsets: Record<string, Point> }
export const SOLAR_LAYOUT_KEY = 'jarvis.solar.layout.v1';

/** Existing Jarvis takes precedence; the built-in assistant otherwise occupies the sun.
 * Skins come from `skins` (pure, nothing saved); without it, from the saved
 * identities, and any newly given skin is saved so the agent keeps it for life. */
export function solarNodes(model: OrbitModel, skins?: SolarSkinMap): SolarNode[] {
  const sun = model.bots.find(bot => /^jarvis(?:\s|$)/i.test(bot.name)) ?? model.orbitAgent ?? null;
  const result: SolarNode[] = [{ id: sun?.id ?? 'jarvis-home', bot: sun, parentId: null, kind: 'sun', name: 'Jarvis', team: '', color: '#ffc27a' }];
  const placed = new Set(sun ? [sun.id] : []);
  for (const team of model.teams) {
    const members = team.memberIds.map(id => model.bots.find(bot => bot.id === id)).filter((bot): bot is OrbitBot => !!bot && !placed.has(bot.id));
    if (!members.length) continue;
    const lead = members.find(bot => bot.id === team.chiefId) ?? members[0];
    result.push({ id: lead.id, bot: lead, parentId: result[0].id, kind: 'planet', name: lead.name, team: team.loose ? '' : team.name, color: lead.color });
    placed.add(lead.id);
    for (const bot of members) {
      if (placed.has(bot.id)) continue;
      result.push({ id: bot.id, bot, parentId: lead.id, kind: 'moon', name: bot.name, team: team.name, color: bot.color });
      placed.add(bot.id);
    }
  }
  for (const bot of model.bots) if (!placed.has(bot.id)) {
    result.push({ id: bot.id, bot, parentId: result[0].id, kind: 'planet', name: bot.name, team: '', color: bot.color });
  }
  const stored = skins ?? loadSolarSkins();
  const assigned = assignSolarSkins(result.filter(node => node.kind === 'planet').map(node => node.id), result.filter(node => node.kind === 'moon').map(node => node.id), stored);
  if (!skins && assigned !== stored) saveSolarSkins(assigned);
  return result.map(node => node.kind === 'planet' ? { ...node, skin: assigned.planets[node.id] } : node.kind === 'moon' ? { ...node, moonSkin: assigned.moons[node.id] } : node);
}

const NEWCOMER_ID = '\u0000solar-newcomer';
/** The body a bot created now would become (joining `section`, or no team) and the
 * exact skin it would get: the creation preview shows this, and the map then agrees. */
export function solarNewcomer(model: OrbitModel, section?: string | null, skins?: SolarSkinMap): { kind: 'planet' | 'moon'; skin: SolarSkin | SolarMoonSkin } {
  const key = section?.trim() ?? '';
  const newcomer = { id: NEWCOMER_ID, name: '', color: '#9aa0aa', teamKey: key } as OrbitBot;
  // A new bot sorts last on the map (see buildModel's order), so it joins the end of its team.
  const teams = model.teams.some(team => team.key === key)
    ? model.teams.map(team => team.key === key ? { ...team, memberIds: [...team.memberIds, NEWCOMER_ID] } : team)
    : [...model.teams, { key, name: key, color: newcomer.color, chiefId: null, coordinatorId: null, memberIds: [NEWCOMER_ID], loose: key === '' }];
  const node = solarNodes({ ...model, bots: [...model.bots, newcomer], teams }, skins ?? loadSolarSkins()).find(candidate => candidate.id === NEWCOMER_ID);
  return node?.kind === 'moon' ? { kind: 'moon', skin: node.moonSkin ?? 'moon-silver' } : { kind: 'planet', skin: node?.skin ?? 'earth' };
}

export function loadSolarLayout(): SolarLayout {
  try {
    const raw = JSON.parse(localStorage.getItem(SOLAR_LAYOUT_KEY) ?? 'null');
    if (raw?.version === 1 && raw.offsets && typeof raw.offsets === 'object') {
      const offsets: Record<string, Point> = {};
      for (const [id, value] of Object.entries(raw.offsets)) {
        const p = value as Point;
        if (p && Number.isFinite(p.x) && Number.isFinite(p.y)) offsets[id] = { x: Math.max(-5000, Math.min(5000, p.x)), y: Math.max(-5000, Math.min(5000, p.y)) };
      }
      return { version: 1, offsets };
    }
  } catch { /* In private mode, the layout lasts for this session. */ }
  return { version: 1, offsets: {} };
}
export function saveSolarLayout(layout: SolarLayout): boolean {
  try { localStorage.setItem(SOLAR_LAYOUT_KEY, JSON.stringify(layout)); return true; } catch { return false; }
}

/** Offsets belong to a parent; moving a planet therefore carries all of its moons. */
export function solarPositions(nodes: SolarNode[], layout: SolarLayout, compact: boolean, wideCompact = false): Record<string, Point> {
  const points: Record<string, Point> = {};
  const planets = nodes.filter(node => node.kind === 'planet');
  const offset = (id: string) => layout.offsets[id] ?? { x: 0, y: 0 };
  const sun = nodes[0], sunOffset = offset(sun.id);
  if (planets.length >= 5) {
    points[sun.id] = { x: sunOffset.x, y: sunOffset.y + (compact ? -350 : 0) };
    planets.forEach((planet, i) => {
      const p = offset(planet.id), side = i % 2 ? 1 : -1;
      const x = compact ? side * 210 : (i<4?[-820,-280,280,820]:[-820,-420,420,820])[i % 4];
      const y = compact ? Math.floor(i / 2) * 365 : i < 4 ? -465 : 340 + Math.floor((i - 4) / 4) * 350;
      points[planet.id] = { x: x + p.x, y: y + p.y };
      nodes.filter(node => node.parentId === planet.id && node.kind === 'moon').forEach((moon, j) => {
        const o = offset(moon.id), outer = compact ? side * 285 : (i % 4 < 2 ? -1 : 1) * 300;
        points[moon.id] = { x: points[planet.id].x + outer + o.x, y: points[planet.id].y + (compact ? -12 : i===0?12:-100) + j * 170 + o.y };
      });
    });
    return points;
  }
  points[sun.id] = { x: sunOffset.x, y: sunOffset.y + (compact ? wideCompact ? -230 : -400 : 0) };
  planets.forEach((planet, i) => {
    const angle = -2.58 + (i / planets.length) * Math.PI * 2;
    const radius = Math.max(compact ? 225 : 400, planets.length * 65);
    const p = offset(planet.id);
    points[planet.id] = compact ? wideCompact ? { x: (i % 2 ? 280 : -280) + p.x, y: i * 230 + p.y } : { x: -105 + p.x, y: -100 + i * 260 + p.y }
      : { x: Math.cos(angle) * radius + p.x - (Math.sin(angle) > .9 ? 150 : 0), y: Math.sin(angle) * radius * (Math.sin(angle) > .9 ? .7 : .85) + p.y };
    const moons = nodes.filter(node => node.parentId === planet.id && node.kind === 'moon');
    moons.forEach((moon, j) => {
      const lower = Math.sin(angle) > 0;
      const o = offset(moon.id);
      const row = Math.floor(j / 2), outward = Math.cos(angle) < 0 ? -1 : 1;
      const moonX = lower ? (j % 2 === 0 ? -210 : 210) : outward * ((planet.skin === 'saturn' ? 255 : 175) + row * 115);
      const moonY = lower ? 22 + row * 160 : (j % 2 === 0 ? -85 : 110) + row * 160;
      points[moon.id] = compact ? wideCompact
        ? { x: points[planet.id].x + (i % 2 ? -235 - (j % 2) * 170 : 190 + (j % 2) * 170) + o.x, y: points[planet.id].y + row * 170 + o.y }
        : { x: points[planet.id].x + 150 + (j % 2) * 200 + o.x, y: points[planet.id].y + row * 85 + o.y }
        : { x: points[planet.id].x + moonX + o.x, y: points[planet.id].y + moonY + o.y };
    });
  });
  return points;
}
