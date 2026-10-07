import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SOLAR_SKINS_KEY, assignSolarSkins, emptySolarSkins, loadSolarSkins, nextMoonSkin, nextPlanetSkin, saveSolarSkins } from './solar-skins';

function memoryStorage() {
  const data = new Map<string, string>();
  return { getItem: (key: string) => data.get(key) ?? null, setItem: vi.fn((key: string, value: string) => { data.set(key, String(value)); }), removeItem: (key: string) => { data.delete(key); } };
}

describe('lifelong solar skins', () => {
  beforeEach(() => { vi.stubGlobal('localStorage', memoryStorage()); saveSolarSkins(emptySolarSkins()); });
  afterEach(() => { vi.unstubAllGlobals(); });

  it('gives newcomers the first never-used skin in canonical order, and keeps stored skins', () => {
    const first = assignSolarSkins(['a', 'b', 'c'], ['m1', 'm2'], emptySolarSkins());
    expect(first.planets).toEqual({ a: 'mercury', b: 'venus', c: 'earth' });
    expect(first.moons).toEqual({ m1: 'moon-silver', m2: 'moon-ice' });
    // Reordered and with a newcomer in front: nobody already on the map changes.
    const second = assignSolarSkins(['new', 'c', 'a', 'b'], ['m2', 'm1'], first);
    expect(second.planets).toEqual({ a: 'mercury', b: 'venus', c: 'earth', new: 'mars' });
    expect(second.moons).toBe(first.moons);
    expect(assignSolarSkins(['a', 'b', 'c'], ['m1', 'm2'], first)).toBe(first);
  });

  it('reserves an absent agent\'s skin until every other skin is taken, then reclaims it', () => {
    const map = assignSolarSkins(['a', 'b', 'c'], [], emptySolarSkins());
    // b leaves: its skin stays reserved, so a newcomer gets a fresh one and b can come back as itself.
    const withD = assignSolarSkins(['a', 'c', 'd'], [], map);
    expect(withD.planets.d).toBe('mars');
    expect(assignSolarSkins(['a', 'b', 'c', 'd'], [], withD).planets.b).toBe('venus');
    // Once all eight skins are held, the freed one is reused and its old owner forgotten.
    const full = assignSolarSkins(['a', 'c', 'd', 'e', 'f', 'g', 'h'], [], withD);
    expect(new Set(Object.values(full.planets)).size).toBe(8);
    expect(nextPlanetSkin(full.planets, ['a', 'c', 'd', 'e', 'f', 'g', 'h'])).toBe('venus');
    const reclaimed = assignSolarSkins(['a', 'c', 'd', 'e', 'f', 'g', 'h', 'i'], [], full);
    expect(reclaimed.planets.i).toBe('venus');
    expect(reclaimed.planets.b).toBeUndefined();
  });

  it('shares the least-used skin only when there are more bodies than skins', () => {
    const moons = assignSolarSkins([], ['1', '2', '3', '4', '5', '6', '7'], emptySolarSkins()).moons;
    expect(Object.values(moons)).toEqual(['moon-silver', 'moon-ice', 'moon-volcanic', 'moon-sand', 'moon-crater', 'moon-silver', 'moon-ice']);
    expect(nextMoonSkin(moons)).toBe('moon-volcanic');
  });

  it('persists under its own key, ignores corrupt entries and survives missing storage', () => {
    const map = assignSolarSkins(['a'], ['m'], emptySolarSkins());
    expect(saveSolarSkins(map)).toBe(true);
    expect(JSON.parse(localStorage.getItem(SOLAR_SKINS_KEY)!)).toEqual(map);
    expect(loadSolarSkins()).toEqual(map);
    localStorage.setItem(SOLAR_SKINS_KEY, JSON.stringify({ version: 1, planets: { a: 'pluto', b: 'mars' }, moons: 'x' }));
    expect(loadSolarSkins()).toEqual({ version: 1, planets: { b: 'mars' }, moons: {} });
    localStorage.setItem(SOLAR_SKINS_KEY, '{nope');
    expect(loadSolarSkins()).toEqual(map); // falls back to this session's identities
    vi.stubGlobal('localStorage', { getItem: () => { throw new Error('private'); }, setItem: () => { throw new Error('private'); } });
    expect(saveSolarSkins(map)).toBe(false);
    expect(loadSolarSkins()).toEqual(map);
  });
});
