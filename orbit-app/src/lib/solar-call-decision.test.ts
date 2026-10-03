import { expect, it } from 'vitest';
import { solarCallDecision } from './solar-call-decision';
it('recognises explicit Portuguese and English consent without approving conversation', () => {
  for (const phrase of ['Sim.', 'Podes avançar!', 'go ahead', 'aprovo']) expect(solarCallDecision(phrase)).toBe('allow');
  for (const phrase of ['Não.', 'cancelar', 'deny']) expect(solarCallDecision(phrase)).toBe('deny');
  for (const phrase of ['sim mas não faças isso', 'okay explain what this does', 'não sei', 'I approve of the design']) expect(solarCallDecision(phrase)).toBeNull();
});
