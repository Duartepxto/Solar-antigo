import {t} from '@/lib/i18n';
import {useSolarPreferences} from './solar-preferences';
/** Full appearance settings: no floating quick-settings panel. */
export function SolarAppearance(){
  const [preferences,update]=useSolarPreferences();
  return <div className="solar-appearance">
    <fieldset className="solar-theme-picker"><legend>{t('jarvis.solar.preference.background')}</legend>
      {(['black','deep-blue','graphite'] as const).map(theme=><label key={theme} data-theme={theme}><input type="radio" name="solar-background" checked={preferences.background===theme} onChange={()=>update({background:theme})}/><span className="solar-theme-swatch"/><span>{t(`jarvis.solar.background.${theme}`)}</span></label>)}
    </fieldset>
    {(['motion','interactive','debris','links'] as const).map(key=><label className="solar-appearance-row" key={key}><span>{t(`jarvis.solar.preference.${key}`)}</span><input type="checkbox" checked={preferences[key]} onChange={e=>update({[key]:e.target.checked})}/></label>)}
    <label className="solar-appearance-row"><span>{t('jarvis.solar.preference.glow')}</span><input type="range" min=".6" max="1.4" step=".1" value={preferences.glow} onChange={e=>update({glow:Number(e.target.value)})}/></label>
  </div>;
}
