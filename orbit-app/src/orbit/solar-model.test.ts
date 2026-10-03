import { describe, expect, it } from 'vitest';
import type { OrbitBot, OrbitModel } from './model';
import { solarNodes, solarPositions } from './solar-model';

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
