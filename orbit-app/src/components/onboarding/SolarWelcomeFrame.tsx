import { type KeyboardEvent, type ReactNode, type RefObject } from "react";
import { brand } from "@/lib/brand";
import { t } from "@/lib/i18n";
import { SolarApprovedArt } from "./SolarApprovedArt";
import { QuietButton } from "./beats/shared";
import "./solar-welcome.css";

/** The exact tilted Sun selected in the approved image, with subtle live motion. */
export function SolarWelcomeGuide({ compact = false }: { compact?: boolean }) {
  return <div className={`solar-welcome-guide ${compact ? "is-compact" : "welcome-maus"}`} aria-hidden="true">
    <SolarApprovedArt />
  </div>;
}

export function SolarWelcomeFrame({
  cardRef, nativeWindow, embedded, title, current, total, previous,
  onBack, onSkip, onKeyDown, setFooter, children,
}: {
  cardRef: RefObject<HTMLDivElement | null>;
  nativeWindow: boolean; embedded: boolean; title: string | null;
  current: number; total: number; previous: boolean;
  onBack: () => void; onSkip: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  setFooter: (element: HTMLDivElement | null) => void;
  children: ReactNode;
}) {
  return <div className={`solar-welcome-shell ${embedded ? "is-embedded" : ""} ${nativeWindow ? "is-native" : ""}`}>
    <div ref={cardRef} className="solar-welcome-frame welcome-card" role="dialog"
      aria-modal="true" aria-label={t("onboarding.dialog")} tabIndex={-1} onKeyDown={onKeyDown}>
      <header className="solar-welcome-header">
        <span className="solar-welcome-brand">{brand().name}</span>
        <button type="button" className="solar-welcome-skip" onClick={onSkip}>{t("onboarding.skipTour")}</button>
      </header>
      <div className="solar-welcome-intro">
        <div className="solar-welcome-progress" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => <span key={i} data-active={i === current - 1 || undefined} data-done={i < current - 1 || undefined} />)}
        </div>
        <p className="solar-welcome-count" aria-live="polite">{t("onboarding.progress", { current, total })}</p>
        <SolarWelcomeGuide />
        {title && <h1 className="solar-welcome-title welcome-title">{title}</h1>}
      </div>
      <div className="solar-welcome-body">{children}</div>
      <footer className="solar-welcome-footer">
        {previous ? <QuietButton onClick={onBack}>{t("onboarding.back")}</QuietButton> : <span />}
        <div ref={setFooter} className="solar-welcome-footer-action" />
      </footer>
    </div>
  </div>;
}
