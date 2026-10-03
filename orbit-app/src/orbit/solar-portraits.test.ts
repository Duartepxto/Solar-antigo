import { expect, it } from 'vitest';
import { layoutSolarPortraits } from './solar-portraits';
it('retains the exact model and activity while isolating portrait layout from map zoom and darkness', () => {
  const [moon, saturn] = layoutSolarPortraits([
    { id:'moon', kind:'moon', skin:'moon-volcanic', x:-200, y:1700, diameter:9, color:'#ffaa77', active:true, background:true, state:'working', activity:'code', callPhase:'speaking' },
    { id:'saturn', kind:'planet', skin:'saturn', x:0, y:0, diameter:220, color:'#ffeeaa', active:false, state:'sleeping' },
  ]);
  expect(moon).toMatchObject({ id:'moon', skin:'moon-volcanic', state:'working', activity:'code', callPhase:'speaking', background:false, x:64,y:64,diameter:82 });
  expect(saturn).toMatchObject({ skin:'saturn', state:'sleeping', x:192,y:64,diameter:45 });
});
