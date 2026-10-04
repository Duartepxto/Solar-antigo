// Minimal string catalog — deliberately not a library. The renderer follows
// the system language once its pack is nearly complete, or the language
// picked in settings; unknown tags and untranslated keys fall back to
// English, so a partial pack can ship the day it has one string.
import { en, localeChoices, locales, type LocaleKey, type LocalePack } from "@/locales";

/** "zh-Hant-TW" → exact tag, then "zh-hant", then "zh", then "en". Pure, for tests. */
export function resolveLocale(tag: string | undefined, available: ReadonlySet<string>): string {
  if (!tag) return "en";
  let candidate = tag.toLowerCase();
  while (candidate) {
    if (available.has(candidate)) return candidate;
    const separator = candidate.lastIndexOf("-");
    if (separator < 0) break;
    candidate = candidate.slice(0, separator);
  }
  return "en";
}

// None of the shipped packs is right-to-left; these are here so adding one
// (Arabic, Hebrew, Persian, Urdu) flips the page direction with no other edit.
const RTL_LANGUAGES = new Set(["ar", "fa", "he", "ur"]);

/** Switch the active language (a future settings picker calls this too).
 * Returns the locale that actually took effect after fallback. The registry
 * is read live, so a pack registered after boot is immediately reachable. */
export function setLocale(tag: string | undefined): string {
  const resolved = resolveLocale(tag, new Set(Object.keys(locales)));
  activePack = locales[resolved] ?? en;
  active = resolved;
  // Screen readers choose pronunciation from <html lang>; index.html ships
  // "en", so without this a German page is read out with English rules.
  const root = typeof document === "undefined" ? undefined : document?.documentElement;
  if (root) {
    root.lang = documentLanguage(resolved);
    root.dir = RTL_LANGUAGES.has(root.lang.split("-")[0]!) ? "rtl" : "ltr";
  }
  return resolved;
}

/** The BCP-47 tag for a registry key, for <html lang>. An alias ("pt",
 * "zh-hk") is tagged as the picker language whose pack it shows, then cased
 * the standard way: "pt-br" → "pt-BR", "zh-hant" → "zh-Hant". */
export function documentLanguage(code: string): string {
  const pack = locales[code];
  const shown = localeChoices.find((choice) => locales[choice.code] === pack)?.code ?? code;
  return shown
    .split("-")
    .map((part, index) =>
      index === 0 ? part.toLowerCase()
        : part.length === 2 ? part.toUpperCase()
          : part.length === 4 ? part[0]!.toUpperCase() + part.slice(1).toLowerCase()
            : part.toLowerCase())
    .join("-");
}

/** The locale t() is answering in. React cannot see a module variable, so a
 * memoized subtree that renders catalog strings takes this as a prop and
 * re-renders when it changes — the transcript does exactly that. */
export function activeLocale(): string {
  return active;
}

/** Follow the system language only when its pack covers nearly everything:
 * a half-translated pack mixes two languages on one screen. A language the
 * person picks in settings goes through setLocale and applies as is. */
export function setSystemLocale(tag: string | undefined): string {
  const resolved = resolveLocale(tag, new Set(Object.keys(locales)));
  const pack = locales[resolved];
  const total = Object.keys(en).length;
  const covered = pack ? Object.keys(pack).filter((key) => Object.hasOwn(en, key)).length : 0;
  return setLocale(resolved !== "en" && covered / total >= SYSTEM_LOCALE_COVERAGE ? resolved : "en");
}
const SYSTEM_LOCALE_COVERAGE = 0.95;

let active = "en";
let activePack: LocalePack = en;
setSystemLocale(globalThis.navigator?.language);

/** Translate a key the server chose rather than the renderer — the note a
 * held approval card shows. A key this build does not know (an older client
 * meeting a newer server, or a card saved before the key existed) falls back
 * to the English the server sends beside it, so the note always reads. */
export function tFromServer(key: string | undefined, fallback: string | undefined): string | undefined {
  return key && Object.hasOwn(en, key) ? t(key as LocaleKey) : fallback;
}

/** Look up a catalog string. `{name}` placeholders interpolate from params;
 * a placeholder without a matching param stays verbatim so a bad pack shows
 * its seams instead of dropping words. */
export function t(key: LocaleKey, params?: Record<string, string | number>): string {
  let template = activePack[key] ?? en[key];
  // Solar keeps the original translation keys, not the original product name.
  if (import.meta.env.VITE_JARVIS_SOLAR === 'true') {
    template = template.replace(/\bOrbit(?:Mobile| Bot)?\b/g, 'Solar').replace(/Jarvis 3\.0/g, 'Solar');
    // This opens a compatible third-party companion, not a Solar iOS release.
    if (key === 'sidebar.menu.getIos') template = activePack['sidebar.menu.iosCompanion'] ?? en['sidebar.menu.iosCompanion'];
    if (key === 'phone.code.detail') template = activePack['jarvis.phone.browserDetail'] ?? en['jarvis.phone.browserDetail'];
    if (key === 'phone.code.manualIntro') template = activePack['jarvis.phone.browserManual'] ?? en['jarvis.phone.browserManual'];
  }
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}

/** t() for a counted phrase: when count is 1 and the catalog has the
 * `<key>One` singular (the convention the catalog already uses), that wins,
 * so "1 bots" never reads. */
export function tCount(key: LocaleKey, count: number, params?: Record<string, string | number>): string {
  const one = `${key}One`;
  return t(count === 1 && Object.hasOwn(en, one) ? (one as LocaleKey) : key, { count, ...params });
}
