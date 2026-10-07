import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { OrbitBot, OrbitModel } from './model';
import { solarNewcomer, solarNodes, solarPositions, type SolarNode } from './solar-model';
import { SOLAR_SKINS_KEY, emptySolarSkins, saveSolarSkins } from './solar-skins';

const bot = (id: string, name = id): OrbitBot => ({ id, name, color: '#88bbcc', teamKey: 'research', chief: false, mood: 'idle', busy: false, waiting: false, unread: false, pinned: false, tool: null, approval: 'ask', lastMessageId: null, quietSince: null });
const model = (): OrbitModel => ({ bots: [bot('jarvis', 'Jarvis'), bot('lead'), bot('moon')], orbitAgent: bot('system'), teams: [{ key: 'research', name: 'Research', color: '#88bbcc', chiefId: 'lead', coordinatorId: null, memberIds: ['lead', 'moon'], loose: false }], channels: [], links: [], conversations: [], connected: true });
function fullSystem(): OrbitModel {
  const source=model();source.bots=[bot('jarvis','Jarvis')];source.teams=[];
  for(let i=0;i<8;i++) {
    const lead=bot(`lead-${i}`),moon=i<5?bot(`moon-${i}`):null;
    source.bots.push(lead);if(moon)source.bots.push(moon);
    source.teams.push({key:`team-${i}`,name:`Team ${i}`,color:'#88bbcc',chiefId:lead.id,coordinatorId:null,memberIds:[lead.id,...(moon?[moon.id]:[])],loose:false});
  }
  return source;
}

function memoryStorage() {
  const data = new Map<string, string>();
  return { getItem: (key: string) => data.get(key) ?? null, setItem: vi.fn((key: string, value: string) => { data.set(key, String(value)); }), removeItem: (key: string) => { data.delete(key); } };
}
const skinsOf = (nodes: SolarNode[]) => Object.fromEntries(nodes.filter(node => node.kind !== 'sun').map(node => [node.id, node.skin ?? node.moonSkin]));
beforeEach(() => { vi.stubGlobal('localStorage', memoryStorage()); saveSolarSkins(emptySolarSkins()); });
afterEach(() => { vi.unstubAllGlobals(); });

describe('Jarvis solar hierarchy', () => {
  it('represents eight real leads and five distinct moon styles without inventing or duplicating agents',()=>{
    const source=fullSystem(),nodes=solarNodes(source);
    expect(nodes).toHaveLength(14);
    expect(new Set(nodes.map(node=>node.id)).size).toBe(14);
    expect(nodes.filter(node=>node.kind==='planet').map(node=>node.skin)).toEqual(['mercury','venus','earth','mars','jupiter','saturn','uranus','neptune']);
    expect(new Set(nodes.filter(node=>node.kind==='moon').map(node=>node.moonSkin)).size).toBe(5);
    for(const node of nodes.slice(1))expect(nodes.some(parent=>parent.id===node.parentId)).toBe(true);
  });
  it.each([false,true])('keeps each eight-planet group together while moving a named moon independently (compact: %s)',compact=>{
    const nodes=solarNodes(fullSystem()),before=solarPositions(nodes,{version:1,offsets:{}},compact);
    const after=solarPositions(nodes,{version:1,offsets:{'lead-3':{x:70,y:30},'moon-3':{x:11,y:-5}}},compact);
    expect(after['lead-3'].x-before['lead-3'].x).toBeCloseTo(70);
    expect(after['moon-3'].x-before['moon-3'].x).toBeCloseTo(81);
    expect(after['moon-3'].y-before['moon-3'].y).toBeCloseTo(25);
    expect(after['lead-4']).toEqual(before['lead-4']);
    for(const p of Object.values(after)){expect(Number.isFinite(p.x)).toBe(true);expect(Number.isFinite(p.y)).toBe(true);}
  });
  it('uses real agents once, with the named Jarvis before the built-in assistant', () => {
    const nodes = solarNodes(model());
    expect(nodes.map(node => [node.id, node.kind, node.parentId])).toEqual([
      ['jarvis', 'sun', null], ['lead', 'planet', 'jarvis'], ['moon', 'moon', 'lead'],
    ]);
  });
  it('uses a real member when a team has no chief, and shows only the sun when empty', () => {
    const source = model(); source.teams[0].chiefId = null;
    expect(solarNodes(source).find(node => node.kind === 'planet')?.id).toBe('lead');
    source.bots = []; source.teams = [];
    expect(solarNodes(source).map(node => node.id)).toEqual(['system']);
  });
  it.each([[false, false], [true, false], [true, true]])('moves a planet and its moons together while preserving independent moon offsets (compact: %s, wide: %s)', (compact, wideCompact) => {
    const nodes = solarNodes(model());
    const initial = solarPositions(nodes, { version: 1, offsets: {} }, compact, wideCompact);
    const moved = solarPositions(nodes, { version: 1, offsets: { lead: { x: 80, y: -20 }, moon: { x: 9, y: 7 } } }, compact, wideCompact);
    expect(moved.lead.x - initial.lead.x).toBeCloseTo(80);
    expect(moved.moon.x - initial.moon.x).toBeCloseTo(89);
    expect(moved.moon.y - initial.moon.y).toBeCloseTo(-13);
    expect(moved.jarvis).toEqual(initial.jarvis);
  });
});

describe('lifelong solar identities', () => {
  const removeTeam = (source: OrbitModel, key: string) => {
    const team = source.teams.find(candidate => candidate.key === key)!;
    source.teams = source.teams.filter(candidate => candidate !== team);
    source.bots = source.bots.filter(candidate => !team.memberIds.includes(candidate.id));
    return source;
  };
  const addLoose = (source: OrbitModel, id: string) => {
    source.bots.push(bot(id));
    const loose = source.teams.find(team => team.key === '');
    if (loose) loose.memberIds.push(id);
    else source.teams.push({ key: '', name: 'General', color: '#88bbcc', chiefId: null, coordinatorId: null, memberIds: [id], loose: true });
    return source;
  };

  it("keeps every agent's skin when teams are reordered or removed", () => {
    const before = skinsOf(solarNodes(fullSystem()));
    const reordered = fullSystem(); reordered.teams.reverse();
    expect(skinsOf(solarNodes(reordered))).toEqual(before);
    const removed = skinsOf(solarNodes(removeTeam(fullSystem(), 'team-1')));
    const { 'lead-1': _lead, 'moon-1': _moon, ...others } = before;
    expect(removed).toEqual(others);
    // The planet labels follow the skins, so nobody is renamed either.
    expect(solarNodes(removeTeam(fullSystem(), 'team-0')).find(node => node.id === 'lead-7')?.skin).toBe('neptune');
  });

  it('gives a new agent exactly the skin the creation preview showed, without saving the preview', () => {
    solarNodes(fullSystem());
    const source = removeTeam(fullSystem(), 'team-2');
    solarNodes(source);
    const writes = vi.mocked(localStorage.setItem).mock.calls.length;
    const preview = solarNewcomer(source, null);
    expect(vi.mocked(localStorage.setItem).mock.calls.length).toBe(writes);
    // Earth's owner left and every other skin is taken, so the newcomer reclaims it.
    expect(preview).toEqual({ kind: 'planet', skin: 'earth' });
    const created = solarNodes(addLoose(source, 'fresh')).find(node => node.id === 'fresh');
    expect({ kind: created?.kind, skin: created?.skin }).toEqual(preview);
    expect(JSON.parse(localStorage.getItem(SOLAR_SKINS_KEY)!).planets.fresh).toBe('earth');
  });

  it('prefers a never-used skin over a freed one, and previews moons joining a team', () => {
    const source = model();
    source.bots.push(bot('second'));
    source.teams.push({ key: 'ops', name: 'Ops', color: '#88bbcc', chiefId: 'second', coordinatorId: null, memberIds: ['second'], loose: false });
    expect(skinsOf(solarNodes(source))).toEqual({ lead: 'mercury', moon: 'moon-silver', second: 'venus' });
    removeTeam(source, 'ops');
    solarNodes(source);
    const planet = solarNewcomer(source);
    expect(planet).toEqual({ kind: 'planet', skin: 'earth' });
    expect(solarNodes(addLoose(source, 'fresh')).find(node => node.id === 'fresh')?.skin).toBe(planet.skin);
    const moon = solarNewcomer(source, 'research');
    expect(moon).toEqual({ kind: 'moon', skin: 'moon-ice' });
    source.bots.push(bot('helper')); source.teams[0].memberIds.push('helper');
    expect(solarNodes(source).find(node => node.id === 'helper')?.moonSkin).toBe(moon.skin);
  });

  it('is pure when the saved identities are passed in', () => {
    vi.mocked(localStorage.setItem).mockClear();
    const nodes = solarNodes(fullSystem(), emptySolarSkins());
    expect(localStorage.setItem).not.toHaveBeenCalled();
    expect(nodes.filter(node => node.kind === 'planet').map(node => node.skin)).toEqual(['mercury','venus','earth','mars','jupiter','saturn','uranus','neptune']);
    expect(solarNodes(fullSystem(), { version: 1, planets: { 'lead-0': 'neptune' }, moons: {} }).find(node => node.id === 'lead-0')?.skin).toBe('neptune');
  });
});
