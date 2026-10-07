import {t} from '@/lib/i18n';
import {cn} from '@/lib/cn';
import {useSolarPreferences} from './solar-preferences';
import {List, MONO_LABEL} from './detail/primitives';

const THEMES = ['black','deep-blue','graphite'] as const;

/** Full appearance settings, built from the same panel pieces as every other system. */
export function SolarAppearance(){
  const [preferences,update]=useSolarPreferences();
  return <div className="solar-appearance flex flex-col gap-3.5">
    <div role="radiogroup" aria-label={t('jarvis.solar.preference.background')} className="mt-2 flex flex-col gap-2">
      <span className={MONO_LABEL}>{t('jarvis.solar.preference.background')}</span>
      <div className="grid grid-cols-3 gap-1.5">
        {THEMES.map(theme=>{const on=preferences.background===theme;return <button key={theme} type="button" role="radio" aria-checked={on} data-theme={theme} onClick={()=>update({background:theme})}
          className={cn('flex flex-col items-center gap-2 rounded-xl border px-1 pb-2.5 pt-3 text-[11.5px] font-medium transition-colors',
            on?'border-[#ddbd89]/60 bg-[#ddbd89]/[0.1] text-[#f4dcb5] shadow-[0_0_18px_-8px_#ddbd89]':'border-ink/[0.07] text-ink/60 hover:bg-ink/[0.04]')}>
          <span className="solar-theme-swatch" aria-hidden="true"/>{t(`jarvis.solar.background.${theme}`)}
        </button>;})}
      </div>
    </div>
    <List title={t('jarvis.solar.preference.map')} items={(['motion','interactive','debris','links'] as const).map(key=>({key,name:t(`jarvis.solar.preference.${key}`),on:preferences[key],onClick:()=>update({[key]:!preferences[key]})}))}/>
    <label className="mt-2 flex flex-col gap-2">
      <span className={MONO_LABEL}>{t('jarvis.solar.preference.glow')}</span>
      <span className="flex items-center gap-3">
        <input className="solar-range flex-1" style={{'--v':preferences.glow} as React.CSSProperties} type="range" min=".6" max="1.4" step=".1" value={preferences.glow} onChange={e=>update({glow:Number(e.target.value)})}/>
        <span className="w-9 text-right text-[12px] tabular-nums text-ink/60">{preferences.glow.toFixed(1)}×</span>
      </span>
    </label>
  </div>;
}
