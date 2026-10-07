import { useEffect, useState } from 'react';
import { normalizeDictationLocales, type DictationLocale } from '../../shared/solar-dictation-language';

export const DICTATION_STORAGE_KEY = 'solar.dictation.languages.v1';
const changedEvent = 'solar-dictation-languages';
let sessionValue: DictationLocale[] | undefined;
let sessionOnly = false;
export function readDictationLocales(): DictationLocale[] {
  if (sessionOnly && sessionValue) return [...sessionValue];
  try { return normalizeDictationLocales(JSON.parse(localStorage.getItem(DICTATION_STORAGE_KEY) ?? 'null')); }
  catch { return sessionValue ?? normalizeDictationLocales(null); }
}
export function saveDictationLocales(value: DictationLocale[]): void {
  const next = normalizeDictationLocales(value);
  sessionValue = next;
  try { localStorage.setItem(DICTATION_STORAGE_KEY, JSON.stringify(next)); sessionOnly = false; } catch { sessionOnly = true; }
  window.dispatchEvent(new CustomEvent(changedEvent, { detail: next }));
}
export function useDictationLocales() {
  const [locales, setLocales] = useState(readDictationLocales);
  useEffect(() => {
    const changed = (event: Event) => setLocales((event as CustomEvent<DictationLocale[]>).detail);
    const stored = (event: StorageEvent) => { if (event.key === DICTATION_STORAGE_KEY || event.key === null) setLocales(readDictationLocales()); };
    window.addEventListener(changedEvent, changed);
    window.addEventListener('storage', stored);
    return () => { window.removeEventListener(changedEvent, changed); window.removeEventListener('storage', stored); };
  }, []);
  return [locales, saveDictationLocales] as const;
}
