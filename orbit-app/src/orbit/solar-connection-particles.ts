export interface SolarParticleLink {
  id: string; from: { x: number; y: number }; to: { x: number; y: number };
  fromRadius: number; toRadius: number; color: string; targetColor: string; opacity: number;
}

/** Stable particle seeds stay on the same connection while its bodies move. */
export function connectionParticles(link: SolarParticleLink, time: number) {
  const dx = link.to.x - link.from.x, dy = link.to.y - link.from.y;
  const distance = Math.hypot(dx, dy);
  const span = distance - link.fromRadius - link.toRadius;
  if (span <= 0 || distance === 0) return [];
  const count = Math.min(180, Math.max(8, Math.ceil(span / 5)));
  let seed = 0; for (const char of link.id) seed = (seed * 31 + char.charCodeAt(0)) >>> 0;
  const offset = (seed % 997) / 997;
  return Array.from({ length: count }, (_, index) => {
    const t = ((index + offset) / count + time * .012) % 1;
    const along = link.fromRadius + t * span;
    const drift = Math.sin(index * 2.399 + offset * 13 + time * .35) * 2.2;
    const tiny = ((index * 37 + seed) % 101) / 101;
    return { x: link.from.x + dx / distance * along - dy / distance * drift,
      y: link.from.y + dy / distance * along + dx / distance * drift,
      radius: .45 + tiny * .7, opacity: link.opacity * (.3 + tiny * .7) * Math.min(1, t * 14, (1 - t) * 14), t };
  });
}
