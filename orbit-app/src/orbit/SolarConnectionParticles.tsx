import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { connectionParticles, type SolarParticleLink } from './solar-connection-particles';

const rgb = (value: string) => {
  const match = /^#([0-9a-f]{6})$/i.exec(value);
  const hex = match ? parseInt(match[1], 16) : 0xddbd89;
  return [hex >> 16, (hex >> 8) & 255, hex & 255];
};

/** Ambient connections only. Real communication streams remain in SolarWorld. */
export function SolarConnectionParticles({ links, width, height, paused }: {
  links: SolarParticleLink[]; width: number; height: number; paused: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  const stopped = paused || reducedMotion;
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!media) return;
    const update = () => setReducedMotion(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const latest = useRef({ links, width, height, paused });
  latest.current = { links, width, height, paused };
  const draw = (time: number) => {
    const element = canvas.current, state = latest.current;
    if (!element) return;
    const context = element.getContext('2d'); if (!context) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    if (element.width !== Math.round(state.width * ratio) || element.height !== Math.round(state.height * ratio)) {
      element.width = Math.round(state.width * ratio); element.height = Math.round(state.height * ratio);
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, state.width, state.height);
    for (const link of state.links) {
      const from = rgb(link.color), to = rgb(link.targetColor);
      for (const particle of connectionParticles(link, time)) {
        const color = from.map((channel, index) => Math.round(channel + (to[index] - channel) * particle.t));
        context.fillStyle = `rgba(${color.join(',')},${particle.opacity})`;
        context.beginPath(); context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2); context.fill();
      }
    }
  };
  useLayoutEffect(() => { draw(stopped ? 0 : performance.now() / 1000); }, [links, width, height, stopped]);
  useEffect(() => {
    if (stopped || !links.length) return;
    let frame = 0;
    const animate = (now: number) => { draw(now / 1000); frame = requestAnimationFrame(animate); };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [stopped, Boolean(links.length)]); // eslint-disable-line react-hooks/exhaustive-deps
  return <canvas ref={canvas} className="solar-orbits solar-connection-particles" data-solar-links="particles" aria-hidden="true" />;
}
