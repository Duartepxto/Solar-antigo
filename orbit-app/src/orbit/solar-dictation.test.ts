import {describe,expect,it,vi} from 'vitest';
import {beginDictation,type Recognition} from './solar-dictation';
class Speech implements Recognition {
  static current:Speech;
  constructor(){Speech.current=this;}
  lang='';continuous=false;interimResults=false;
  onresult:Recognition['onresult']=null;onerror:Recognition['onerror']=null;onend:Recognition['onend']=null;onstart:Recognition['onstart']=null;
  start=vi.fn();stop=vi.fn();abort=vi.fn();
}
describe('Dictation draft and lifecycle',()=>{
  it('replaces interim words, preserves typed text and combines final segments',()=>{
    const text=vi.fn(),session=beginDictation(Speech,'Olá','pt-PT',{text,error:vi.fn(),listening:vi.fn()}),speech=Speech.current;
    speech.onresult?.({results:[[{transcript:'mundo'}]]});
    speech.onresult?.({results:[[{transcript:'mundo inteiro'}]]});
    speech.onresult?.({results:[[{transcript:'mundo inteiro'}],[{transcript:'bom dia'}]]});
    expect(text.mock.calls.map(call=>call[0])).toEqual(['Olá mundo','Olá mundo inteiro','Olá mundo inteiro bom dia']);
    expect(speech.lang).toBe('pt-PT');expect(speech.interimResults).toBe(true);
    session.stop();expect(speech.stop).toHaveBeenCalledOnce();expect(text).toHaveBeenCalledTimes(3);
    session.dispose();expect(speech.abort).toHaveBeenCalledOnce();expect(speech.onresult).toBeNull();
  });
  it('clears recording on denial or end and never submits text',()=>{
    const listening=vi.fn(),error=vi.fn();beginDictation(Speech,'draft','en-US',{text:vi.fn(),error,listening});
    Speech.current.onstart?.();Speech.current.onerror?.({error:'not-allowed'});Speech.current.onend?.();
    expect(error).toHaveBeenCalledWith('not-allowed');expect(listening.mock.calls.map(call=>call[0])).toEqual([true,false,false]);
  });
  it('reports synchronous microphone failure',()=>{
    class FailedSpeech extends Speech{start=vi.fn(()=>{throw Error('no capture');});}
    const error=vi.fn(),listening=vi.fn();beginDictation(FailedSpeech,'draft','pt-PT',{text:vi.fn(),error,listening});
    expect(error).toHaveBeenCalledWith('audio-capture');expect(listening).toHaveBeenCalledWith(false);
  });
});
