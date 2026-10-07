import { describe, it, expect, vi } from 'vitest';
import { SolarStateParticles, particleSeed, satelliteAngle, type SolarParticleBody } from './solar-state-particles';

vi.mock('./tool-icons', () => ({ toolIcon: () => null }));

const bodies: SolarParticleBody[] = [
  { id: 'moon', x: 80, y: 150, radius: 30, color: '#b0d0ee', state: 'ready', alpha: 1, signalAge: 10 },
  { id: 'planet', x: 330, y: 150, radius: 40, color: '#ffb454', state: 'ready', alpha: 1, signalAge: 10 },
  { id: 'jarvis', x: 610, y: 150, radius: 45, color: '#ffb454', state: 'ready', alpha: 1, signalAge: 10 },
];
const gradient = () => ({ addColorStop: vi.fn() });
const context = () => ({
  save: vi.fn(), restore: vi.fn(), beginPath: vi.fn(), arc: vi.fn(), fill: vi.fn(), stroke: vi.fn(), fillRect: vi.fn(), fillText: vi.fn(), drawImage: vi.fn(),
  createRadialGradient: vi.fn(gradient), createLinearGradient: vi.fn(gradient),
}) as unknown as CanvasRenderingContext2D;
const run = (effect: SolarStateParticles, list: SolarParticleBody[], frames: number, arrive = vi.fn(), moving = true, ctx = context()) => {
  for (let i = 1; i <= frames; i++) effect.draw(ctx, list, 800, 400, moving ? i / 60 : 0, 1 / 60, moving, true, arrive);
  return arrive;
};

describe('Solar state particles', () => {
  it('delivers a comet once, at the recipient', () => {
    const effect = new SolarStateParticles();
    run(effect, bodies, 1);
    effect.emit('moon', 'planet', '#fff');
    expect(run(effect, bodies, 240).mock.calls).toEqual([['planet']]);
  });

  it('relays the moon leg to the planet before Jarvis', () => {
    const effect = new SolarStateParticles();
    run(effect, bodies, 1);
    effect.emit('moon', 'planet', '#fff', ['jarvis']);
    expect(run(effect, bodies, 480).mock.calls).toEqual([['planet'], ['jarvis']]);
  });

  it('does not advance or deliver while paused', () => {
    const effect = new SolarStateParticles();
    run(effect, bodies, 1);
    effect.emit('moon', 'planet', '#fff');
    expect(run(effect, bodies, 240, vi.fn(), false)).not.toHaveBeenCalled();
  });

  it('bursts when a busy body settles, not when it starts', () => {
    const effect = new SolarStateParticles();
    const working = bodies.map(b => b.id === 'planet' ? { ...b, state: 'working', tool: 'exec' } : b);
    run(effect, working, 10);
    expect(effect.burstAge('planet')).toBe(Infinity);
    run(effect, bodies, 1);
    expect(effect.burstAge('planet')).toBeLessThan(.1);
    expect(effect.burstAge('moon')).toBe(Infinity);
  });

  it('marks a body that needs the user with a badge', () => {
    const effect = new SolarStateParticles(), ctx = context();
    run(effect, bodies.map(b => b.id === 'moon' ? { ...b, state: 'waiting' } : b), 1, vi.fn(), true, ctx);
    expect((ctx.fillText as ReturnType<typeof vi.fn>).mock.calls.map(call => call[0])).toEqual(['!']);
  });

  it('keeps the satellite and the face on the same orbit position', () => {
    expect(particleSeed('planet')).toBeGreaterThanOrEqual(0);
    expect(particleSeed('planet')).toBeLessThan(1);
    expect(satelliteAngle('planet', 2) - satelliteAngle('planet', 1)).toBeCloseTo(.9);
  });
});
