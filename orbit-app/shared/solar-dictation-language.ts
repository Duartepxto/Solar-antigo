/** Spoken input is a device preference, independent of the interface language. */
export const DICTATION_LOCALES = ['pt-PT', 'en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT'] as const;
export type DictationLocale = typeof DICTATION_LOCALES[number];
export const DEFAULT_DICTATION_LOCALES: DictationLocale[] = ['pt-PT', 'en-US'];
export function normalizeDictationLocales(value: unknown): DictationLocale[] {
  const valid = Array.isArray(value) ? [...new Set(value.filter((item): item is DictationLocale => DICTATION_LOCALES.includes(item))) ] : [];
  return valid.length ? valid : [...DEFAULT_DICTATION_LOCALES];
}
export function dictationEngineLanguage(locales: readonly DictationLocale[]): string {
  return locales.length === 1 ? locales[0].split('-')[0] : 'auto';
}
