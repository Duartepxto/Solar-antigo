// Plugins: MCP servers, found in the public registries (Explore) or added by
// hand (Installed). Orbit keeps no catalog of its own; see McpExplore.
import { useEffect, useRef, useState } from "react";

import { useStore } from "@/state/store";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";
import { useMcpServers } from "@/lib/mcp-servers";
import { McpExplore } from "./McpExplore";
import { McpServersPanel } from "./McpServersPanel";
import { OrbitSheet } from "@/orbit/OrbitSheet";

export function PluginsPanel() {
  const { state, dispatch } = useStore();
  const dialogRef = useRef<HTMLDivElement>(null);
  // "apps" is Explore and "mcp" is Installed, the names the store has always used
  const surface = state.pluginsSurface;
  const { servers } = useMcpServers();
  const policy = state.config?.managedPolicy;
  const restricted = Boolean(policy && !policy.mcp.allowCustom);
  const [justAdded, setJustAdded] = useState<{ name: string; signingIn: boolean } | null>(null);
  const close = () => dispatch({ type: "togglePlugins", open: false });
  const show = (item: "apps" | "mcp") => dispatch({ type: "togglePlugins", open: true, surface: item });
  const exploring = surface === "apps" && !restricted;

  // A modal sheet: focus moves in, Tab stays inside, Escape closes, and
  // focus returns to whatever opened it.
  useEffect(() => {
    const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const focusable = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    (dialog?.querySelector<HTMLElement>("input") ?? focusable()[0] ?? dialog)?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dispatch({ type: "togglePlugins", open: false });
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const items = focusable();
      if (items.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = items[0];
      const last = items.at(-1)!;
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      returnFocus?.focus();
    };
  }, [dispatch]);

  return (
    <OrbitSheet
      dialogRef={dialogRef}
      labelId="plugins-title"
      tour="apps-panel"
      title={t("connectors.title")}
      context={t("connectors.subtitle")}
      onClose={close}
      closeLabel={t("connectors.closeAria")}
    >
      <div className="px-[18px]">
        <div className="flex gap-6" role="tablist" aria-label={t("connectors.typeAria")}>
          {(["apps", "mcp"] as const).filter((item) => item === "mcp" || !restricted).map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={(item === "apps") === exploring}
              onClick={() => show(item)}
              className={cn(
                "border-b-2 px-0.5 pb-2.5 pt-1 text-[13.5px] font-medium transition-colors",
                (item === "apps") === exploring ? "border-ink/40 text-ink" : "border-transparent text-ink/55 hover:text-ink",
              )}
            >
              {item === "apps" ? t("mcp.explore.tab") : t("mcp.explore.installedTab")}
            </button>
          ))}
        </div>
      </div>
      {exploring ? (
        <div className="min-h-0 flex-1 overflow-y-auto px-[18px] pb-8 pt-5">
          <McpExplore
            key={state.pluginsEntryId ?? "explore"}
            openEntryId={state.pluginsEntryId}
            installed={(servers ?? []).map((server) => server.name)}
            onAdded={(name, signingIn) => { setJustAdded({ name, signingIn }); show("mcp"); }}
          />
        </div>
      ) : (
        <McpServersPanel justAdded={justAdded} />
      )}
    </OrbitSheet>
  );
}
