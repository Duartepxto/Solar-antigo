import { expect, it, vi } from 'vitest';
import { dictationEngineLanguage, normalizeDictationLocales } from '../../shared/solar-dictation-language';
import { DICTATION_STORAGE_KEY, readDictationLocales, saveDictationLocales } from './solar-dictation-settings';

it('validates selections, keeps preference order and never leaves an empty choice', () => {
  expect(normalizeDictationLocales(['en-US', 'invalid', 'en-US', 'pt-PT'])).toEqual(['en-US', 'pt-PT']);
  for (const value of [null, [], 'en-US', ['invalid']]) expect(normalizeDictationLocales(value)).toEqual(['pt-PT', 'en-US']);
  expect(dictationEngineLanguage(['pt-PT'])).toBe('pt');
  expect(dictationEngineLanguage(['pt-PT', 'en-US'])).toBe('auto');
});
it('persists the device choice and broadcasts it to other settings views', () => {
  const data = new Map<string, string>(), dispatchEvent = vi.fn();
  vi.stubGlobal('localStorage', { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => data.set(key, value) });
  vi.stubGlobal('window', { dispatchEvent });
  vi.stubGlobal('CustomEvent', class { constructor(public type: string, public options: unknown) {} });
  try {
    saveDictationLocales(['en-US', 'pt-PT']);
    expect(JSON.parse(data.get(DICTATION_STORAGE_KEY)!)).toEqual(['en-US', 'pt-PT']);
    expect(readDictationLocales()).toEqual(['en-US', 'pt-PT']);
    expect(dispatchEvent).toHaveBeenCalledOnce();
    data.set(DICTATION_STORAGE_KEY, '{bad json');
    expect(readDictationLocales()).toEqual(['en-US', 'pt-PT']);
  } finally { vi.unstubAllGlobals(); }
});
it('keeps the session choice when writes fail but reads still return an older value', () => {
  vi.stubGlobal('localStorage', { getItem: () => '["pt-PT"]', setItem: () => { throw Error('quota exceeded'); } });
  vi.stubGlobal('window', { dispatchEvent: vi.fn() });
  vi.stubGlobal('CustomEvent', class {});
  try {
    saveDictationLocales(['en-US']);
    expect(readDictationLocales()).toEqual(['en-US']);
  } finally { vi.unstubAllGlobals(); }
});
