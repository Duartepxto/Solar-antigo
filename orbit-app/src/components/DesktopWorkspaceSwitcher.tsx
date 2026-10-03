import { useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import { ChevronDown, Cloud, Laptop } from "lucide-react";
import { cn } from "@/lib/cn";

/** The dropdown is native: a remote workspace cannot choose a destination
 * itself or read the other workspaces saved on this computer. */
export function DesktopWorkspaceSwitcher({ compact = false, chip = false }: { compact?: boolean; chip?: boolean }) {
  const bridge = window.ogb?.workspaces;
  const [current, setCurrent] = useState<{ local: boolean; name: string; origin?: string } | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    void bridge?.state().then((state) => { if (alive) setCurrent(state); }).catch(() => {});
    return () => { alive = false; };
  }, [bridge]);
  if (!bridge) return null;
  const name = current?.name ?? "Workspaces";
  const Icon = current?.local === false ? Cloud : Laptop;
  const openMenu = () => {
    if (open) return;
    setError(""); setOpen(true);
    void bridge.menu().catch(() => setError(t("workspaceSwitcher.ui.couldNotOpenWorkspacesTryThe"))).finally(() => setOpen(false));
  };
  // Orbit's title bar: a small chip beside the window controls
  if (chip) {
    return <button type="button" aria-label={`Switch workspace: ${name}`} aria-haspopup="menu" aria-expanded={open}
      title={error || (current?.origin ? `${name} · ${current.origin}` : name)} onClick={openMenu}
      className="flex h-6 max-w-[180px] items-center gap-1.5 rounded-[7px] px-2 text-[12px] text-ink/70 hover:bg-ink/[0.06] hover:text-ink"
      style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
      <Icon size={13} className="shrink-0" />
      <span className="truncate">{name}</span>
      <ChevronDown size={12} className="shrink-0 opacity-60" />
    </button>;
  }
  return <div className={cn("py-1.5", compact ? "px-2" : "px-3")}>
    <button type="button" aria-label={`Switch workspace: ${name}`} aria-haspopup="menu" aria-expanded={open}
      title={current?.origin ? `${name} · ${current.origin}` : name}
      onClick={() => {
        if (open) return;
        setError(""); setOpen(true);
        void bridge.menu().catch(() => setError(t("workspaceSwitcher.ui.couldNotOpenWorkspacesTryThe"))).finally(() => setOpen(false));
      }}
      className={cn("flex w-full items-center gap-2 rounded-lg py-2 text-left text-[13px] font-medium text-ink hover:bg-control focus-visible:outline focus-visible:outline-accent", compact ? "justify-center px-1" : "px-2")}
      style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
      <Icon size={16} className="shrink-0 text-ink/55" />
      {!compact && <><span className="min-w-0 flex-1 truncate">{name}</span><ChevronDown size={13} className="shrink-0 text-ink/55" /></>}
    </button>
    {error && <p role="alert" className="mt-1 text-[11px] text-[#ff8a96]">{error}</p>}
  </div>;
}
