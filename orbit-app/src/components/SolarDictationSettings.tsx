import { DICTATION_LOCALES } from '../../shared/solar-dictation-language';
import { useDictationLocales } from '@/lib/solar-dictation-settings';
import { t } from '@/lib/i18n';

export function SolarDictationSettings() {
  const [selected, save] = useDictationLocales();
  return <fieldset className="solar-settings mb-5 border-b border-ink/[0.1] pb-5">
    <legend className="text-[15px] font-medium text-ink">{t('solar.dictation.languages')}</legend>
    <p className="mt-1 text-[13px] leading-relaxed text-ink/55">{t('solar.dictation.description')}</p>
    <div className="mt-3 grid grid-cols-2 gap-3">
      {DICTATION_LOCALES.map(locale => <label key={locale} className="flex items-center gap-2 text-[13px] text-ink">
        <input type="checkbox" checked={selected.includes(locale)} disabled={selected.length === 1 && selected.includes(locale)}
          onChange={event => save(event.target.checked ? [...selected, locale] : selected.filter(value => value !== locale))} />
        {t(`solar.dictation.${locale}`)}
      </label>)}
    </div>
    <p className="mt-3 text-[11.5px] leading-relaxed text-ink/55">{t('solar.dictation.browserFallback')}</p>
  </fieldset>;
}
