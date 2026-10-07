import { expect, it } from 'vitest';
import { connectionParticles, type SolarParticleLink } from './solar-connection-particles';

const link: SolarParticleLink = { id: 'jarvis-momo', from: { x: 0, y: 0 }, to: { x: 400, y: 0 }, fromRadius: 80, toRadius: 50, color: '#ddbd89', targetColor: '#abcdef', opacity: .6 };
it('keeps bounded particles outside both bodies and varies them across the connecting line', () => {
  const dots = connectionParticles(link, 0);
  expect(dots.length).toBeGreaterThan(8);
  for (const dot of dots) {
    expect(dot.x).toBeGreaterThanOrEqual(80); expect(dot.x).toBeLessThanOrEqual(350);
    expect(Math.abs(dot.y)).toBeLessThanOrEqual(2.2); expect(dot.opacity).toBeLessThanOrEqual(.6);
  }
  expect(new Set(dots.map(dot => dot.y)).size).toBeGreaterThan(8);
  expect(connectionParticles({ ...link, to: { x: 100, y: 0 } }, 0)).toEqual([]);
});
it('moves particles along the same link without changing their density, and caps distant connections', () => {
  const before = connectionParticles(link, 0), after = connectionParticles(link, 1);
  expect(after).toHaveLength(before.length); expect(after).not.toEqual(before);
  expect(connectionParticles({ ...link, to: { x: 10000, y: 0 } }, 0)).toHaveLength(180);
});
