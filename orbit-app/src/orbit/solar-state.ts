import { SLEEP_AFTER_MS, type OrbitBot } from './model';
export type SolarState = 'ready' | 'thinking' | 'working' | 'waiting' | 'blocked' | 'offline' | 'sleeping';
export type SolarSignal = { kind:'sending' | 'receiving' | 'settled'; at:number };
export function solarState(bot:OrbitBot|null, connected:boolean):SolarState {
  if(!connected)return 'offline';
  if(bot?.waiting)return 'waiting';
  if(bot?.mood==='stalled')return 'blocked';
  if(bot?.busy)return bot.tool?'working':'thinking';
  if(bot?.mood==='sleepy'||bot?.quietSince&&!bot.unread&&Date.now()-bot.quietSince>SLEEP_AFTER_MS)return 'sleeping';
  return 'ready';
}
export function solarActivity(tool:string|null|undefined):'code'|'research'|'document'|'notion'|'task' {
  if(!tool)return 'task';
  if(/notion/i.test(tool))return 'notion';
  if(/exec|shell|terminal|code|edit|write|patch|git|build/i.test(tool))return 'code';
  if(/search|browse|web|fetch|research/i.test(tool))return 'research';
  if(/read|file|document|list/i.test(tool))return 'document';
  return 'task';
}
