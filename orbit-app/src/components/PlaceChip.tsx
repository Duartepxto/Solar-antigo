import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { browserAvailable, builtInBrowserEnabled } from "@/lib/feature-flags";
import { t } from "@/lib/i18n";
import { instanceSupportsLocalComputer, localComputerSelectable } from "@/lib/local-computer";
import { effectivePlace, PLACES, placeLabelKey, type Place } from "@/lib/place";
import { useStore, type Bot, type Task } from "@/state/store";
import { useDesktopCapabilities } from "./DesktopCapabilities";
import { PlaceIcon } from "./PlaceIcon";
import { useMenuSide } from "@/lib/menu-side";

export type PlaceAvailability = Record<Place, boolean>;

/** The same reachability the Works on picker applies, so the chip never
 * offers a place the panel would grey out. */
export function usePlaceAvailability(bot: Bot): PlaceAvailability {
  const { state } = useStore();
  const { capabilities } = useDesktopCapabilities();
  const instance = state.instances.find((candidate) => candidate.instanceId === bot.modelSelection.instanceId);
  const computerMcp = instance?.capabilities?.computerMcp === true;
  const boxAgent = instance?.driverKind === "boxAgent";
  // Places the enrolled organisation disallows are never offered.
  const allowed = state.config?.managedPolicy?.computers ?? { thisComputer: true, localVm: true, box: true, vps: true };
  return {
    cloud: (bot.cloudBackend === "vps" ? computerMcp && !boxAgent : computerMcp || boxAgent) && (bot.cloudBackend === "vps" ? allowed.vps : allowed.box),
    vm: Boolean(instance?.snapshot?.state === "available" && computerMcp && !boxAgent) && allowed.localVm,
    local: localComputerSelectable({ capabilities, providerSupportsLocal: instanceSupportsLocalComputer(state.instances, bot) }) && allowed.thisComputer,
    browser: builtInBrowserEnabled(state.config) && browserAvailable(state.config) && instance?.capabilities?.browserMcp === true && !boxAgent,
  };
}

const DESCRIPTION: Record<Place, "computer.dest.cloudDesc" | "computer.dest.vmDesc" | "computer.dest.localDesc" | "computer.dest.browserDesc"> = {
  cloud: "computer.dest.cloudDesc", vm: "computer.dest.vmDesc", local: "computer.dest.localDesc", browser: "computer.dest.browserDesc",
};

/** Where this conversation works, always visible beside the send button.
 * Shows the effective place (the conversation's pin, else the bot's Works
 * on), pulses while a turn is acting there, and pins another place for this
 * conversation only. No confirmation card: choosing is the whole gesture. */
export function PlaceChip({ bot, task, live, disabled = false, onPin, chip = false }: {
  /** Orbit's header chip: the place's name, the menu opening downward */
  chip?: boolean;
  bot: Bot;
  task?: Pick<Task, "surface"> | null;
  live: boolean;
  disabled?: boolean;
  onPin: (surface: Place | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const side = useMenuSide(open, wrapperRef, 300);
  const availability = usePlaceAvailability(bot);
  const effective = effectivePlace(bot, task);
  const pinned = Boolean(task?.surface);
  const off = effective === "off";
  const label = t(placeLabelKey(effective));
  const showLive = live && effective !== "off" && effective !== "auto";
  const title = off ? t("place.offHint") : disabled ? t("place.busy") : pinned ? t("place.pinnedHere") : t("place.fromBot");

  useEffect(() => {
    if (!open) return;
    const outside = (event: MouseEvent) => { if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);

  const choose = (surface: Place | null) => { setOpen(false); if (surface !== (task?.surface ?? null)) onPin(surface); };
  const botDefault = bot.computer ?? "auto";

  return (
    <div className="relative flex items-center" ref={wrapperRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("place.chipAria", { place: label })}
        disabled={disabled || off}
        title={off || disabled ? title : `${label} — ${title}`}
        data-testid="place-chip"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          chip
            ? "relative flex h-6 shrink-0 items-center gap-1.5 rounded-full border border-ink/[0.1] px-2.5 text-[12px] text-ink hover:bg-ink/[0.06]"
            : "relative flex size-8 shrink-0 items-center justify-center rounded-full text-ink/55 hover:bg-ink/[0.05] hover:text-ink",
          pinned && !chip && "text-ink hover:text-ink",
          (disabled || off) && "cursor-not-allowed opacity-45 hover:bg-transparent",
        )}
      >
        {chip ? label : <PlaceIcon place={effective} size={16} className="shrink-0 opacity-80" aria-hidden="true" />}
        {showLive && <span className="absolute right-1.5 top-1.5 size-1.5 animate-pulse rounded-full bg-success" aria-label={t("place.live")} />}
      </button>
      {open && (
        <div role="menu" aria-label={t("place.chipTitle")} className={cn("absolute z-40 w-[300px]", side === "right" ? "right-0" : "left-0", "overflow-hidden rounded-[14px] border border-ink/[0.1] bg-panel shadow-[0_20px_50px_rgba(0,0,0,.55)]", chip ? "top-full mt-2" : "bottom-full mb-2")}>
          <div className="border-b border-ink/[0.1] px-4 py-3 text-[14px] font-medium text-ink">{t("place.chipTitle")}</div>
          <div className="flex flex-col py-1.5">
            <button
              type="button"
              role="menuitemradio"
              aria-checked={!pinned}
              onClick={() => choose(null)}
              className={cn("flex items-start gap-3 px-4 py-2 text-left hover:bg-ink/[0.05]", !pinned && "bg-ink/[0.05]")}
            >
              <PlaceIcon place={botDefault} size={14} className="mt-0.5 shrink-0 opacity-70" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] text-ink">{t("place.followBot")}</span>
                <span className="block text-[11px] text-ink/55">{t("place.followBotDetail", { place: t(placeLabelKey(botDefault)) })}</span>
              </span>
              {!pinned && <Check size={14} className="mt-0.5 shrink-0 text-ink" aria-hidden="true" />}
            </button>
            {PLACES.map((place) => {
              const selected = task?.surface === place;
              const reachable = availability[place];
              return (
                <button
                  key={place}
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected}
                  disabled={!reachable}
                  title={reachable ? undefined : t("place.unavailable")}
                  onClick={() => choose(place)}
                  className={cn("flex items-start gap-3 px-4 py-2 text-left", reachable ? "hover:bg-ink/[0.05]" : "cursor-not-allowed opacity-45", selected && "bg-ink/[0.05]")}
                >
                  <PlaceIcon place={place} size={14} className="mt-0.5 shrink-0 opacity-70" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] text-ink">{t(placeLabelKey(place))}</span>
                    <span className="block text-[11px] text-ink/55">{reachable ? t(DESCRIPTION[place]) : t("place.unavailable")}</span>
                  </span>
                  {selected && <Check size={14} className="mt-0.5 shrink-0 text-ink" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
