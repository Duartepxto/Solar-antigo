import type { SolarMoonSkin, SolarSkin } from './solar-model';

/** Which skin each agent wears, kept for the agent's whole life. The map labels
 * planets by skin name, so a skin is part of an agent's identity: adding,
 * removing or reordering teams must never re-texture or rename anyone else. */
export interface SolarSkinMap { version: 1; planets: Record<string, SolarSkin>; moons: Record<string, SolarMoonSkin> }
export const SOLAR_SKINS_KEY = 'jarvis.solar.skins.v1';
export const PLANET_SKINS: readonly SolarSkin[] = ['mercury','venus','earth','mars','jupiter','saturn','uranus','neptune'];
export const MOON_SKINS: readonly SolarMoonSkin[] = ['moon-silver','moon-ice','moon-volcanic','moon-sand','moon-crater'];
export const emptySolarSkins = (): SolarSkinMap => ({ version: 1, planets: {}, moons: {} });

/**
 * The skin the next newcomer receives, and the absent owners it is taken from:
 * 1. the first skin nobody has ever been given;
 * 2. otherwise a freed skin (all of its owners are off the map), reclaimed;
 * 3. otherwise (more bodies than skins) the skin fewest present bodies share.
 * Ties always follow the canonical order, so the choice is deterministic.
 */
function pick<S extends string>(owners: Readonly<Record<string, S>>, present: ReadonlySet<string>, order: readonly S[]): { skin: S; evict: string[] } {
  const held = new Set(Object.values(owners));
  const fresh = order.find(skin => !held.has(skin));
  if (fresh) return { skin: fresh, evict: [] };
  const inUse = new Map<S, number>();
  for (const [id, skin] of Object.entries(owners)) if (present.has(id)) inUse.set(skin, (inUse.get(skin) ?? 0) + 1);
  const freed = order.find(skin => !inUse.has(skin));
  if (freed) return { skin: freed, evict: Object.keys(owners).filter(id => owners[id] === freed) };
  const fewest = order.reduce((best, skin) => (inUse.get(skin) ?? 0) < (inUse.get(best) ?? 0) ? skin : best, order[0]);
  return { skin: fewest, evict: [] };
}

function assign<S extends string>(ids: readonly string[], stored: Readonly<Record<string, S>>, order: readonly S[]): Record<string, S> {
  const present = new Set(ids);
  let owners = stored as Record<string, S>;
  for (const id of ids) {
    if (owners[id]) continue;
    const { skin, evict } = pick(owners, present, order);
    if (owners === stored) owners = { ...stored };
    for (const absent of evict) delete owners[absent];
    owners[id] = skin;
  }
  return owners;
}

/** The planet skin a new planet would get next (the creation preview uses this). */
export function nextPlanetSkin(assigned: Readonly<Record<string, SolarSkin>>, present: Iterable<string> = Object.keys(assigned)): SolarSkin {
  return pick(assigned, new Set(present), PLANET_SKINS).skin;
}
/** The moon skin a new moon would get next. */
export function nextMoonSkin(assigned: Readonly<Record<string, SolarMoonSkin>>, present: Iterable<string> = Object.keys(assigned)): SolarMoonSkin {
  return pick(assigned, new Set(present), MOON_SKINS).skin;
}

/** Pure: keeps every stored skin and gives the first free one to bodies without
 * one, in the given (map) order. Returns `stored` itself when nothing changed. */
export function assignSolarSkins(planetIds: readonly string[], moonIds: readonly string[], stored: SolarSkinMap): SolarSkinMap {
  const planets = assign(planetIds, stored.planets, PLANET_SKINS);
  const moons = assign(moonIds, stored.moons, MOON_SKINS);
  return planets === stored.planets && moons === stored.moons ? stored : { version: 1, planets, moons };
}

function parse(raw: unknown): SolarSkinMap {
  const result = emptySolarSkins();
  if (!raw || typeof raw !== 'object' || (raw as SolarSkinMap).version !== 1) return result;
  const { planets, moons } = raw as Partial<SolarSkinMap>;
  for (const [id, skin] of Object.entries(planets && typeof planets === 'object' ? planets : {})) if (PLANET_SKINS.includes(skin)) result.planets[id] = skin;
  for (const [id, skin] of Object.entries(moons && typeof moons === 'object' ? moons : {})) if (MOON_SKINS.includes(skin)) result.moons[id] = skin;
  return result;
}

// Without storage (private mode, tests) identities last for this session.
let memory: SolarSkinMap = emptySolarSkins();
let cached: { raw: string; map: SolarSkinMap } | null = null;
export function loadSolarSkins(): SolarSkinMap {
  try {
    const raw = localStorage.getItem(SOLAR_SKINS_KEY);
    if (raw === null) return memory;
    if (cached?.raw !== raw) cached = { raw, map: parse(JSON.parse(raw)) };
    return cached.map;
  } catch { return memory; }
}
export function saveSolarSkins(map: SolarSkinMap): boolean {
  memory = map;
  try { localStorage.setItem(SOLAR_SKINS_KEY, JSON.stringify(map)); return true; } catch { return false; }
}
