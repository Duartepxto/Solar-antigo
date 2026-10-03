import { useEffect, useState } from 'react';

export interface SolarPreferences { motion: boolean; interactive: boolean; debris: boolean; links: boolean; glow: number; background: 'black'|'deep-blue'|'graphite' }
const defaults: SolarPreferences = { motion: true, interactive: true, debris: true, links: true, glow: 1, background: 'black' };
const key = 'jarvis.solar.preferences.v1';
function read(): SolarPreferences {
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? 'null');
    return { ...defaults, ...Object.fromEntries(Object.keys(defaults).filter(name => typeof saved?.[name] === typeof defaults[name as keyof SolarPreferences]).map(name => [name,saved[name]])), background: ['black','deep-blue','graphite'].includes(saved?.background)?saved.background:'black', glow: Math.max(.6,Math.min(1.4,Number.isFinite(saved?.glow)?saved.glow:1)) };
  } catch { return defaults; }
}
export function useSolarPreferences() {
  const [preferences,setPreferences] = useState(read);
  useEffect(() => {
    const changed = (event: Event) => setPreferences((event as CustomEvent<SolarPreferences>).detail);
    window.addEventListener('jarvis-solar-preferences',changed);
    return () => window.removeEventListener('jarvis-solar-preferences',changed);
  },[]);
  function update(patch: Partial<SolarPreferences>) {
    const next = { ...preferences, ...patch };
    try { localStorage.setItem(key,JSON.stringify(next)); } catch { /* Session state still updates. */ }
    window.dispatchEvent(new CustomEvent('jarvis-solar-preferences',{detail:next}));
  }
  return [preferences,update] as const;
}
