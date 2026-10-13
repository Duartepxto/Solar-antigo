import type { KeyboardEventHandler, ReactNode, RefObject } from 'react';
import { ArrowLeft, Check, Monitor, ShieldCheck, Smartphone } from 'lucide-react';
import { brand } from '@/lib/brand';
import { t } from '@/lib/i18n';
import type { BeatId } from '@/lib/onboarding';
import { SolarBrandMark } from '@/orbit/SolarBrandMark';
import './solar-welcome.css';

const stepLabels = {
  hello: 'solar.welcome.step.hello',
  reel: 'solar.welcome.step.reel',
  engines: 'solar.welcome.step.engines',
  permissions: 'solar.welcome.step.permissions',
  phone: 'solar.welcome.step.phone',
  bot: 'solar.welcome.step.bot',
} as const;

/** An illustration of the Solar hierarchy, not a second roster or live map. */
function SolarWelcomeIllustration() {
  return <svg className="solar-welcome-illustration" viewBox="0 0 320 240" aria-hidden="true">
    <g className="solar-welcome-paths" fill="none">
      <circle cx="158" cy="121" r="74" />
      <circle cx="158" cy="121" r="109" />
      <path d="M158 121 229 97M158 121 120 181M158 121 107 67M229 97 274 111M120 181 84 208" />
    </g>
    <g className="solar-welcome-sun">
      <circle cx="158" cy="121" r="25" fill="none" />
      <circle cx="158" cy="121" r="14" />
      <path d="M158 83v8M158 151v8M120 121h8M188 121h8M131 94l6 6M179 142l6 6M131 148l6-6M179 100l6-6" fill="none" />
    </g>
    <g className="solar-welcome-planets">
      <circle cx="229" cy="97" r="11" />
      <circle cx="120" cy="181" r="9" />
      <circle cx="107" cy="67" r="8" />
      <circle cx="274" cy="111" r="4" />
      <circle cx="84" cy="208" r="4" />
    </g>
    <g className="solar-welcome-fragments">
      <rect x="201" y="32" width="3" height="3" rx=".5" />
      <rect x="54" y="121" width="3" height="3" rx=".5" />
      <rect x="185" y="209" width="3" height="3" rx=".5" />
    </g>
  </svg>;
}

export function SolarWelcomeFrame({
  beats, beat, title, previous, onBack, onSkip, cardRef, onKeyDown,
  setFooter, embedded, nativeWindow, children,
}: {
  beats: BeatId[];
  beat: BeatId;
  title: string | null;
  previous: BeatId | null;
  onBack: () => void;
  onSkip: () => void;
  cardRef: RefObject<HTMLDivElement | null>;
  onKeyDown: KeyboardEventHandler<HTMLDivElement>;
  setFooter: (element: HTMLDivElement | null) => void;
  embedded: boolean;
  nativeWindow: boolean;
  children: ReactNode;
}) {
  const current = beats.indexOf(beat);
  return <div className={`solar-welcome${embedded ? ' solar-welcome--embedded' : ''}${nativeWindow ? ' solar-welcome--native' : ''}`}>
    <div className="solar-welcome-frame" data-beat={beat} ref={cardRef} role="dialog" aria-modal="true"
      aria-label={t('onboarding.dialog')} tabIndex={-1} onKeyDown={onKeyDown}>
      <header className="solar-welcome-header">
        <div className="solar-welcome-brand">
          {brand().logo ? <img src={brand().logo} alt="" width="32" height="32" /> : <SolarBrandMark />}
          <span>{brand().name}</span>
        </div>
        <button className="solar-welcome-skip" type="button" onClick={onSkip}>{t('solar.welcome.skip')}</button>
      </header>
      <div className="solar-welcome-layout">
        <aside className="solar-welcome-guide">
          <div className="solar-welcome-story">
            <h2>{t('solar.welcome.promise')}</h2>
            <p>{t('solar.welcome.description')}</p>
            <SolarWelcomeIllustration />
          </div>
          <ol className="solar-welcome-progress" aria-label={t('solar.welcome.progress')}>
            {beats.map((id, index) => <li key={id} aria-label={t(stepLabels[id])} aria-current={index === current ? 'step' : undefined}
              data-complete={index < current ? '' : undefined}>
              <span className="solar-welcome-step-marker" aria-hidden="true">
                {index < current ? <Check size={13} /> : index + 1}
              </span>
              <span>{t(stepLabels[id])}</span>
            </li>)}
          </ol>
        </aside>
        <section className="solar-welcome-setup" aria-labelledby="solar-welcome-title">
          <div className="solar-welcome-content">
            <p className="solar-welcome-count">{t('onboarding.progress', { current: current + 1, total: beats.length })}</p>
            {title && <h1 id="solar-welcome-title">{title}</h1>}
            <div className="solar-welcome-step" data-beat={beat}>{children}</div>
          </div>
          <footer className="solar-welcome-footer">
            {previous ? <button className="solar-welcome-back" type="button" onClick={onBack}>
              <ArrowLeft size={15} aria-hidden="true" />{t('onboarding.back')}
            </button> : <span />}
            <div className="solar-welcome-primary" ref={setFooter} />
          </footer>
        </section>
      </div>
      <div className="solar-welcome-details">
        <span><Monitor size={14} aria-hidden="true" />{t('solar.welcome.local')}</span>
        <span><Smartphone size={14} aria-hidden="true" />{t('solar.welcome.companion')}</span>
        <span><ShieldCheck size={14} aria-hidden="true" />{t('solar.welcome.control')}</span>
      </div>
      <span className="sr-only" aria-live="polite">{t('onboarding.progress', { current: current + 1, total: beats.length })}</span>
    </div>
  </div>;
}
