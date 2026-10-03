import {describe,expect,it} from 'vitest';
import type {OrbitBot} from './model';
import {solarActivity,solarState} from './solar-state';
const bot=(patch:Partial<OrbitBot>={})=>({busy:false,waiting:false,mood:'idle',tool:null,...patch}) as OrbitBot;
describe('Solar activity follows agent data',()=>{
  it('gives connection, approval and stall priority over running tools',()=>{
    expect(solarState(bot({busy:true,waiting:true,tool:'exec'}),false)).toBe('offline');
    expect(solarState(bot({busy:true,waiting:true,tool:'exec'}),true)).toBe('waiting');
    expect(solarState(bot({busy:true,mood:'stalled'}),true)).toBe('blocked');
  });
  it('distinguishes reasoning from an actual tool and returns to quiet afterwards',()=>{
    expect(solarState(bot({busy:true}),true)).toBe('thinking');
    expect(solarState(bot({busy:true,tool:'exec_command'}),true)).toBe('working');
    expect(solarState(bot(),true)).toBe('ready');
  });
  it.each([['exec_command','code'],['apply_patch','code'],['web_search','research'],['read_file','document'],['notion_search','notion'],['unknown_tool','task'],[null,'task']])('classifies %s without assuming code work', (tool,expected)=>expect(solarActivity(tool)).toBe(expected));
  it('rests after inactivity but wakes for unread messages, work and approval',()=>{
    const quiet={quietSince:Date.now()-31*60*1000,unread:false};
    expect(solarState(bot(quiet),true)).toBe('sleeping');
    expect(solarState(bot({...quiet,unread:true}),true)).toBe('ready');
    expect(solarState(bot({...quiet,busy:true}),true)).toBe('thinking');
    expect(solarState(bot({...quiet,waiting:true}),true)).toBe('waiting');
  });
});
