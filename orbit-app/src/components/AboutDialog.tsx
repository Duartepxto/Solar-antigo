// "About" (design: about overlay) — the version you are running and where to
// go next. Small on purpose: this exists so a bug report can quote a version
// number, and so the project Orbit is built on is one click away.
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { brand } from "@/lib/brand";
import { t } from "@/lib/i18n";
import { ColumnLayer } from "@/orbit/ColumnLayer";
import {
  APP_NAME,
  APP_REPOSITORY,
  DOCS_URL,
  LICENSE_URL,
  RELEASES_URL,
  appVersion,
  openExternalLink,
  platformLabel,
} from "@/lib/app-links";

export function AboutDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, onClose]);

  if (!open) return null;

  const platform = platformLabel(window.ogb?.platform);
  const name = brand().name;
  const row = (label: string, value: string, href?: string) => (
    <div key={label} className="flex items-center gap-3 border-b border-ink/[0.07] py-2">
      <span className="flex-1 text-[13px] text-ink/80">{label}</span>
      {href ? (
        <button type="button" onClick={() => void openExternalLink(href)} className="rounded-md bg-ink/[0.08] px-2 py-0.5 font-mono text-[11.5px] font-medium text-ink hover:bg-ink/[0.14]">{value}</button>
      ) : (
        <span className="rounded-md bg-ink/[0.08] px-2 py-0.5 font-mono text-[11.5px] font-medium text-ink">{value}</span>
      )}
    </div>
  );

  return (
    <ColumnLayer onClose={onClose} backdrop="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div role="dialog" aria-modal="true" aria-labelledby="about-dialog-title"
        className="flex w-[min(420px,calc(100%-40px))] flex-col gap-3 rounded-[14px] border border-ink/[0.12] bg-panel px-5 py-[18px] shadow-[0_30px_70px_rgba(0,0,0,.6)] animate-pop-in">
        <div className="flex items-center">
          <h2 id="about-dialog-title" className="flex-1 text-[17px] font-semibold text-ink">{t("about.title", { app: name })}</h2>
          <button ref={closeRef} type="button" onClick={onClose} aria-label={t("common.close")}
            className="flex size-7 items-center justify-center rounded-full text-ink/60 hover:bg-ink/[0.07] hover:text-ink"><X size={15} /></button>
        </div>
        <span className="text-[13px] leading-[1.5] text-ink/70">
          {name === APP_NAME ? t("about.bodyPlain", { app: name }) : t("about.body", { app: name, base: APP_NAME })}
        </span>
        <div className="flex flex-col">
          {row(t("about.version"), `${appVersion()}${platform ? ` · ${platform}` : ""}`)}
          {row(t("about.harness"), window.location.host)}
          {row(t("about.source"), t("about.open"), APP_REPOSITORY)}
          {row(t("about.docs"), t("about.open"), DOCS_URL)}
          {row(t("about.releases"), t("about.open"), RELEASES_URL)}
          {row(t("about.license"), t("about.view"), LICENSE_URL)}
        </div>
      </div>
    </ColumnLayer>
  );
}
