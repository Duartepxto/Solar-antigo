import { useEffect, useId, useRef, type CSSProperties } from "react";
import { solarFaceEyeOpen } from "@/orbit/solar-face";
import { reducedMotion } from "@/lib/onboarding";
import art from "./solar-approved-art.json";

const SUN_RADIUS = 78, SUN_CENTER = { x: 112, y: 124 };

/** Solar's native gaze response, expressed in the approved artwork's coordinates. */
export function approvedSunGaze(dx: number, dy: number) {
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) return { x: 0, y: 0 };
  const distance = Math.sqrt(dx * dx + dy * dy + 4 * SUN_RADIUS * SUN_RADIUS);
  return { x: dx / distance * SUN_RADIUS * .065, y: dy / distance * SUN_RADIUS * .05 };
}

/** Rotate original fragments on a tilted orbit, with a small radial bounce. */
export function approvedParticlePose(particle: { cx: number; cy: number }, index: number, time: number) {
  const x = particle.cx - SUN_CENTER.x, y = particle.cy - SUN_CENTER.y;
  const tilt = .92, radius = Math.min(106, Math.hypot(x, y / tilt));
  const start = Math.atan2(y / tilt, x), angle = start + time * (.23 + index % 3 * .025);
  const breath = (Math.sin(time * 1.7 + index * 2.4) - Math.sin(index * 2.4)) * 2.4;
  const px = Math.cos(angle) * (radius + breath), py = Math.sin(angle) * (radius + breath) * tilt;
  const front = Math.sin(angle), hidden = front < 0 && Math.hypot(px, py) < SUN_RADIUS;
  return { x: SUN_CENTER.x + px - particle.cx, y: SUN_CENTER.y + py - particle.cy,
    scale: .86 + (front + 1) * .15, rotation: time * .27,
    opacity: hidden ? 0 : .62 + (front + 1) * .19 };
}

/** Original approved raster, split with vector clips. No regenerated character. */
export function SolarApprovedArt() {
  const svg = useRef<SVGSVGElement>(null);
  const id = useId().replace(/:/g, "");
  const source = `${id}-source`;
  useEffect(() => {
    const element = svg.current;
    if (!element) return;
    const particles = [...element.querySelectorAll<SVGGElement>(".solar-art-fragment")];
    const surface = [...element.querySelectorAll<SVGGElement>(".solar-art-surface-fragment")];
    let frame = 0, last = 0, time = 0, current = { x: 0, y: 0 }, target = current;
    const writeGaze = () => {
      element.style.setProperty("--solar-gaze-x", `${current.x}px`);
      element.style.setProperty("--solar-gaze-y", `${current.y}px`);
    };
    const tick = (ms: number) => {
      frame = 0;
      if (reducedMotion() || document.hidden) return;
      const delta = last ? Math.min(.05, (ms - last) / 1000) : 0;
      last = ms; time += delta;
      const blend = 1 - Math.exp(-delta * 12);
      current = { x: current.x + (target.x - current.x) * blend, y: current.y + (target.y - current.y) * blend };
      writeGaze();
      const phase = time % 5.3;
      const blink = phase > 5.08 ? 1 - Math.sin((phase - 5.08) / .22 * Math.PI) ** 2 : 1;
      element.style.setProperty("--solar-eye-open", String(solarFaceEyeOpen("ready", blink)));
      particles.forEach((node, i) => {
        const pose = approvedParticlePose(art.particles[i], i, time);
        node.style.transform = `translate(${pose.x}px,${pose.y}px) rotate(${pose.rotation}rad) scale(${pose.scale})`;
        node.style.opacity = String(pose.opacity);
      });
      surface.forEach((node, i) => {
        const particle = art.surfaceParticles[i], dx = particle.cx - SUN_CENTER.x, dy = particle.cy - SUN_CENTER.y;
        const radius = Math.hypot(dx, dy), phase = i * 2.399;
        const lift = (Math.sin(time * 1.4 + phase) - Math.sin(phase)) * 1.8;
        const flow = (Math.sin(time * .65 + phase) - Math.sin(phase)) * 2.4;
        node.style.transform = `translate(${(dx * lift - dy * flow) / radius}px,${(dy * lift + dx * flow) / radius}px)`;
      });
      frame = requestAnimationFrame(tick);
    };
    const move = (event: PointerEvent) => {
      if (reducedMotion() || document.hidden || event.pointerType === "touch") return;
      const rect = element.getBoundingClientRect();
      target = approvedSunGaze((event.clientX - rect.left - rect.width * .52) * art.width / rect.width,
        (event.clientY - rect.top - rect.height * .53) * art.height / rect.height);
    };
    const restGaze = () => { target = { x: 0, y: 0 }; };
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) restGaze(); };
    const refresh = () => {
      cancelAnimationFrame(frame); frame = 0; last = 0;
      if (reducedMotion()) {
        time = 0; current = target = { x: 0, y: 0 }; writeGaze();
        element.style.setProperty("--solar-eye-open", "1");
        [...particles, ...surface].forEach(node => { node.style.transform = "none"; node.style.opacity = "1"; });
      } else if (!document.hidden) frame = requestAnimationFrame(tick);
    };
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new MutationObserver(refresh);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-reduced-motion"] });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerout", leave, { passive: true });
    window.addEventListener("blur", restGaze);
    document.addEventListener("visibilitychange", refresh);
    preference.addEventListener("change", refresh);
    refresh();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", leave); window.removeEventListener("blur", restGaze);
      document.removeEventListener("visibilitychange", refresh); preference.removeEventListener("change", refresh);
    };
  }, []);
  return <svg ref={svg} className="solar-approved-art" viewBox={`0 0 ${art.width} ${art.height}`} aria-hidden="true" focusable="false">
    <defs>
      <image id={source} href="/solar/brand/welcome-approved-art.png" x={art.sourceX} y={art.sourceY}
        width={art.sourceWidth} height={art.sourceHeight} />
      <clipPath id={`${id}-body`}><path d={art.body} /></clipPath>
      {art.eyes.map((eye, i) => <clipPath key={i} id={`${id}-eye-${i}`}><path d={eye.path} /></clipPath>)}
      {art.surfaceParticles.map((particle, i) => <clipPath key={i} id={`${id}-surface-${i}`}><path d={particle.path} /></clipPath>)}
      {art.particles.map((particle, i) => <clipPath key={i} id={`${id}-particle-${i}`}><path d={particle.path} /></clipPath>)}
    </defs>
    <g className="solar-art-body">
      <g clipPath={`url(#${id}-body)`}><use href={`#${source}`} /></g>
      {art.surfaceParticles.map((particle, i) => <g key={i} className="solar-art-surface-fragment" style={{transformOrigin:`${particle.cx}px ${particle.cy}px`}}>
        <g clipPath={`url(#${id}-surface-${i})`}><use href={`#${source}`} /></g>
      </g>)}
      {art.eyes.map((eye, i) => <g key={i} clipPath={`url(#${id}-eye-${i})`}>
        <use href={`#${source}`} transform={`translate(${eye.textureOffset} 0)`} />
      </g>)}
      <g className="solar-art-eyes">
        {art.eyes.map((eye, i) => <g key={i} className="solar-art-eye-lid" style={{transformOrigin:`${eye.cx}px ${eye.cy}px`}}><g clipPath={`url(#${id}-eye-${i})`}><use href={`#${source}`} /></g></g>)}
      </g>
    </g>
    {art.particles.map((particle, i) => <g key={i} className="solar-art-fragment" style={{
      transformOrigin: `${particle.cx}px ${particle.cy}px`,
    } as CSSProperties}>
      <g clipPath={`url(#${id}-particle-${i})`}><use href={`#${source}`} /></g>
    </g>)}
  </svg>;
}
