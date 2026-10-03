import { useState } from 'react';
import { Globe2, Phone, Code2 } from 'lucide-react';
import { t } from '@/lib/i18n';
import { PrimaryButton, type BeatProps } from '../beats/shared';

const scenes = ['world','voice','work'] as const;
const icons = [Globe2, Phone, Code2];
/** A short introduction to the actual Solar surfaces, without a second map
 * or a pretend interactive workspace inside the welcome window. */
export function SolarFeatureReel({ onNext }: BeatProps) {
  const [index, setIndex] = useState(0);
  const scene = scenes[index];
  return <div className="flex flex-col items-center text-center">
    <div className="mt-3 flex gap-2" aria-label={t('onboarding.reel.scenes')}>
      {scenes.map((key,i) => { const Icon=icons[i];return <button key={key} type="button" aria-pressed={i===index} aria-label={t(`jarvis.welcome.${key}.title`)} onClick={()=>setIndex(i)} className="flex size-9 items-center justify-center rounded-full border border-ink/20 text-ink/80 transition-colors hover:bg-ink/10" style={i===index?{borderColor:'#ffc27a',color:'#ffc27a'}:undefined}><Icon size={16}/></button>; })}
    </div>
    <div key={scene} className="animate-rise mt-5">
      <h2 className="text-[17px] font-semibold text-ink">{t(`jarvis.welcome.${scene}.title`)}</h2>
      <p className="mt-3 max-w-[360px] text-pretty text-[14px] leading-relaxed text-ink/80">{t(`jarvis.welcome.${scene}.body`)}</p>
    </div>
    <PrimaryButton className="mt-5" onClick={index===scenes.length-1?onNext:()=>setIndex(index+1)}>{t(index===scenes.length-1?'onboarding.continue':'onboarding.reel.next')}</PrimaryButton>
  </div>;
}
