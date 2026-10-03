// Explore: MCP servers from the public registries, as a grid of logos.
//
// Orbit keeps no list of its own. The server fetches GitHub's curated MCP
// registry (Popular, by stars) and searches the official MCP registry
// (everyone else), caches both and proxies the logos (server/mcp-catalog.ts).
// Choosing a server shows exactly what would run or where it connects, asks
// for any key it needs, and adds it through the same /api/mcp/servers route
// as the form, so every rule the form follows still applies.
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, BadgeCheck, ExternalLink, Loader2, Search, Star } from "lucide-react";

import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";
import type { LocaleKey } from "@/locales";
import { openExternalLink } from "@/lib/app-links";
import { updateMcpServers } from "@/lib/mcp-servers";
import { api } from "@/state/store";

export interface CatalogField { name: string; description?: string; required: boolean; secret: boolean; default?: string }
export type CatalogInstall =
  | { kind: "remote"; transport: "http" | "sse"; url: string; headers: CatalogField[] }
  | { kind: "npm" | "pypi" | "oci"; command: string; args: string[]; env: CatalogField[]; identifier: string };
export type CatalogCategory = "dev" | "data" | "productivity" | "design" | "web" | "cloud" | "ai" | "other";
export interface CatalogEntry {
  id: string;
  slug: string;
  title: string;
  description: string;
  website?: string;
  repository?: string;
  stars?: number;
  category: CatalogCategory;
  source: "github" | "community";
  publisher?: string;
  icon?: string;
  installs: CatalogInstall[];
}

const CATEGORIES: Array<CatalogCategory | "all"> = ["all", "productivity", "dev", "data", "design", "web", "cloud", "ai", "other"];

export function formatStars(stars: number): string {
  return stars >= 1000 ? `${(stars / 1000).toFixed(stars >= 10_000 ? 0 : 1)}k` : String(stars);
}

/** A free name for the server: the slug, or slug-2, slug-3… */
export function freeServerName(slug: string, taken: string[]): string {
  const set = new Set(taken);
  if (!set.has(slug)) return slug;
  for (let n = 2; n < 100; n += 1) {
    const name = `${slug.slice(0, 29)}-${n}`;
    if (!set.has(name)) return name;
  }
  return `${slug.slice(0, 24)}-${Date.now().toString(36).slice(-6)}`;
}

/** What adding this install sends to /api/mcp/servers. */
export function installBody(name: string, install: CatalogInstall, values: Record<string, string>): Record<string, unknown> {
  const filled = (fields: CatalogField[]) => Object.fromEntries(
    fields.map((field) => [field.name, (values[field.name] ?? field.default ?? "").trim()]).filter(([, value]) => value),
  );
  if (install.kind === "remote") {
    const headers = filled(install.headers);
    return {
      name, type: install.transport, url: install.url, headers,
      // no headers asked for: the server signs in with OAuth
      ...(install.headers.length === 0 ? { auth: "oauth" } : {}),
    };
  }
  return { name, command: install.command, args: install.args, env: filled(install.env) };
}

function installFields(install: CatalogInstall): CatalogField[] {
  return install.kind === "remote" ? install.headers : install.env;
}

function installLabel(install: CatalogInstall): LocaleKey {
  switch (install.kind) {
    case "remote": return install.headers.length ? "mcp.explore.kind.remoteKey" : "mcp.explore.kind.remote";
    case "npm": return "mcp.explore.kind.npm";
    case "pypi": return "mcp.explore.kind.pypi";
    case "oci": return "mcp.explore.kind.oci";
  }
}

export function CatalogLogo({ entry, className = "size-10" }: { entry: Pick<CatalogEntry, "icon" | "title">; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (entry.icon && !failed) {
    return (
      <img src={entry.icon} alt="" loading="lazy" onError={() => setFailed(true)}
        className={cn("shrink-0 rounded-[10px] bg-white/90 object-contain p-1", className)} />
    );
  }
  return (
    <div className={cn("flex shrink-0 items-center justify-center rounded-[10px] bg-ink/[0.07] text-[15px] font-semibold text-ink/55", className)}>
      {entry.title.slice(0, 1).toUpperCase()}
    </div>
  );
}

export function McpExplore({ installed, onAdded, openEntryId = null }: { installed: string[]; onAdded: (name: string, signingIn: boolean) => void; openEntryId?: string | null }) {
  const [featured, setFeatured] = useState<CatalogEntry[] | null>(null);
  const [community, setCommunity] = useState<CatalogEntry[]>([]);
  const [next, setNext] = useState<string | undefined>();
  const [browsingAll, setBrowsingAll] = useState(false);
  const [stale, setStale] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CatalogCategory | "all">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chosen, setChosen] = useState<CatalogEntry | null>(null);
  const request = useRef(0);

  // opened from an Orbit agent's proposal: straight to that server
  useEffect(() => {
    if (!openEntryId) return;
    let live = true;
    api(`/api/mcp/catalog/entry?id=${encodeURIComponent(openEntryId)}`)
      .then((result) => { if (live && result.entry) setChosen(result.entry as CatalogEntry); })
      .catch((cause) => { if (live) setError(cause instanceof Error ? cause.message : String(cause)); });
    return () => { live = false; };
  }, [openEntryId]);

  // one request per settled query; the latest one wins
  useEffect(() => {
    const id = ++request.current;
    const q = query.trim();
    const timer = window.setTimeout(() => {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      else if (browsingAll) params.set("all", "1");
      api(`/api/mcp/catalog${params.size ? `?${params}` : ""}`)
        .then((result) => {
          if (id !== request.current) return;
          setFeatured(result.entries ?? []);
          setCommunity(result.community ?? []);
          setNext(result.next);
          setStale(result.stale === true);
        })
        .catch((cause) => { if (id === request.current) setError(cause instanceof Error ? cause.message : String(cause)); })
        .finally(() => { if (id === request.current) setLoading(false); });
    }, q ? 300 : 0);
    return () => window.clearTimeout(timer);
  }, [query, browsingAll]);

  const loadMore = async () => {
    if (!next) return;
    const id = ++request.current;
    setLoading(true);
    try {
      const result = await api(`/api/mcp/catalog?all=1&cursor=${encodeURIComponent(next)}`);
      if (id !== request.current) return;
      setCommunity((current) => [...current, ...(result.community ?? [])]);
      setNext(result.next);
    } catch (cause) {
      if (id === request.current) setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      if (id === request.current) setLoading(false);
    }
  };

  const q = query.trim().toLowerCase();
  const matches = (entry: CatalogEntry) =>
    (category === "all" || entry.category === category) &&
    (!q || `${entry.title} ${entry.description} ${entry.publisher ?? ""}`.toLowerCase().includes(q));
  const popular = (featured ?? []).filter(matches);
  const others = community.filter((entry) => category === "all" || entry.category === category);

  if (chosen) {
    return <ExploreDetail entry={chosen} installed={installed} onBack={() => setChosen(null)} onAdded={(name, signingIn) => { setChosen(null); onAdded(name, signingIn); }} />;
  }

  return (
    <div data-mcp-explore>
      <label className="flex items-center gap-2.5 rounded-xl bg-ink/[0.06] px-3.5 py-2.5 focus-within:bg-ink/[0.08]">
        <Search size={15} className="shrink-0 text-ink/45" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("mcp.explore.search")}
          aria-label={t("mcp.explore.search")}
          className="w-full bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink/40" />
        {loading && <Loader2 size={14} className="shrink-0 animate-spin text-ink/45" />}
      </label>

      <div className="mt-3 flex flex-wrap gap-1.5" role="tablist" aria-label={t("mcp.explore.categories")}>
        {CATEGORIES.map((key) => (
          <button key={key} type="button" role="tab" aria-selected={category === key} onClick={() => setCategory(key)}
            className={cn("rounded-full px-3 py-1 text-[12px] transition-colors",
              category === key ? "bg-ink text-app" : "text-ink/60 hover:bg-ink/[0.06] hover:text-ink")}>
            {t(`mcp.explore.cat.${key}` as LocaleKey)}
          </button>
        ))}
      </div>

      {error && <div className="mt-4 text-[12.5px] text-danger">{t("mcp.explore.error", { error })}</div>}
      {stale && <div className="mt-4 text-[12px] text-ink/50">{t("mcp.explore.stale")}</div>}

      {featured === null && !error ? (
        <div className="flex items-center justify-center gap-2 py-20 text-[13px] text-ink/50"><Loader2 size={14} className="animate-spin" /> {t("mcp.explore.loading")}</div>
      ) : (
        <>
          {popular.length > 0 && (
            <ExploreSection title={t(q ? "mcp.explore.popularMatches" : "mcp.explore.popular")} hint={t("mcp.explore.popularHint")}>
              {popular.map((entry) => <ExploreTile key={entry.id} entry={entry} added={installed.includes(entry.slug)} onOpen={() => setChosen(entry)} />)}
            </ExploreSection>
          )}
          {(q || browsingAll) && others.length > 0 && (
            <ExploreSection title={t("mcp.explore.community")} hint={t("mcp.explore.communityHint")}>
              {others.map((entry) => <ExploreTile key={entry.id} entry={entry} added={installed.includes(entry.slug)} onOpen={() => setChosen(entry)} />)}
            </ExploreSection>
          )}
          {q && !loading && popular.length === 0 && others.length === 0 && (
            <div className="py-16 text-center text-[13px] text-ink/50">{t("mcp.explore.none", { query })}</div>
          )}
          <div className="mt-6 flex justify-center">
            {!q && !browsingAll && (
              <button type="button" onClick={() => setBrowsingAll(true)} className="rounded-lg px-3 py-2 text-[12.5px] text-ink/60 hover:bg-ink/[0.06] hover:text-ink">
                {t("mcp.explore.browseAll")}
              </button>
            )}
            {!q && browsingAll && next && (
              <button type="button" disabled={loading} onClick={() => void loadMore()} className="rounded-lg px-3 py-2 text-[12.5px] text-ink/60 hover:bg-ink/[0.06] hover:text-ink disabled:opacity-50">
                {t("mcp.explore.more")}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ExploreSection({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <div className="flex items-baseline gap-2 px-1">
        <h3 className="text-[13px] font-medium text-ink">{title}</h3>
        <span className="text-[11.5px] text-ink/45">{hint}</span>
      </div>
      <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-1">{children}</div>
    </section>
  );
}

function ExploreTile({ entry, added, onOpen }: { entry: CatalogEntry; added: boolean; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} aria-label={t("mcp.explore.open", { name: entry.title })}
      className="group flex min-w-0 gap-3 rounded-xl p-3 text-left transition-colors hover:bg-ink/[0.05]">
      <CatalogLogo entry={entry} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[13.5px] font-medium text-ink">{entry.title}</span>
          {added && <span className="shrink-0 rounded-full bg-success/10 px-1.5 py-px text-[10.5px] text-success">{t("mcp.explore.added")}</span>}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 truncate text-[11.5px] text-ink/45">
          {entry.publisher && <span className="truncate">{entry.publisher}</span>}
          {entry.stars !== undefined && <span className="flex shrink-0 items-center gap-0.5"><Star size={10} />{formatStars(entry.stars)}</span>}
        </div>
        {entry.description && <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-ink/60">{entry.description}</p>}
      </div>
    </button>
  );
}

function ExploreDetail({ entry, installed, onBack, onAdded }: { entry: CatalogEntry; installed: string[]; onBack: () => void; onAdded: (name: string, signingIn: boolean) => void }) {
  const [which, setWhich] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const install = entry.installs[which] ?? entry.installs[0];
  const fields = installFields(install);
  const missing = fields.filter((field) => field.required && !(values[field.name] ?? field.default ?? "").trim());
  const name = freeServerName(entry.slug, installed);

  const add = async () => {
    setBusy(true);
    setError(null);
    try {
      await api("/api/mcp/servers", { method: "POST", body: JSON.stringify(installBody(name, install, values)) });
      const result = await api(`/api/mcp/servers/${name}`, { method: "PATCH", body: JSON.stringify({ enabled: true }) });
      updateMcpServers(result.servers ?? []);
      const signingIn = install.kind === "remote" && install.headers.length === 0;
      if (signingIn) {
        const { url } = await api(`/api/mcp/servers/${name}/sign-in`, { method: "POST" });
        await openExternalLink(url);
      }
      onAdded(name, signingIn);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div data-mcp-explore-detail>
      <button type="button" onClick={onBack} className="-ml-1 flex items-center gap-1 rounded-lg px-1.5 py-1 text-[12.5px] text-ink/55 hover:text-ink">
        <ArrowLeft size={14} /> {t("mcp.explore.back")}
      </button>
      <div className="mt-4 flex items-start gap-4">
        <CatalogLogo entry={entry} className="size-14" />
        <div className="min-w-0 flex-1">
          <h3 className="text-[18px] font-semibold text-ink">{entry.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-ink/50">
            {entry.publisher && <span className="flex items-center gap-1"><BadgeCheck size={13} />{t("mcp.explore.by", { publisher: entry.publisher })}</span>}
            {entry.stars !== undefined && <span className="flex items-center gap-1"><Star size={12} />{formatStars(entry.stars)}</span>}
            {entry.website && <LinkOut href={entry.website} label={t("mcp.explore.website")} />}
            {entry.repository && <LinkOut href={entry.repository} label={t("mcp.explore.source")} />}
          </div>
        </div>
      </div>
      {entry.description && <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-ink/70">{entry.description}</p>}

      {entry.installs.length > 1 && (
        <div className="mt-5 inline-flex flex-wrap rounded-xl bg-ink/[0.05] p-1" role="radiogroup" aria-label={t("mcp.explore.how")}>
          {entry.installs.map((option, index) => (
            <button key={index} type="button" role="radio" aria-checked={index === which} onClick={() => { setWhich(index); setValues({}); }}
              className={cn("rounded-lg px-3 py-1.5 text-[12px]", index === which ? "bg-ink/[0.1] text-ink" : "text-ink/55 hover:text-ink")}>
              {t(installLabel(option))}
            </button>
          ))}
        </div>
      )}

      <div className="mt-5 text-[12px] font-medium text-ink/55">{t(install.kind === "remote" ? "mcp.explore.connectsTo" : "mcp.explore.runs")}</div>
      <code className="mt-1.5 block break-all rounded-lg bg-ink/[0.05] px-3 py-2 font-mono text-[12px] text-ink/80">
        {install.kind === "remote" ? install.url : [install.command, ...install.args].join(" ")}
      </code>
      <p className="mt-2 text-[12px] leading-relaxed text-ink/50">
        {t(install.kind === "remote"
          ? install.headers.length ? "mcp.explore.remoteKeyNote" : "mcp.explore.oauthNote"
          : install.kind === "npm" ? "mcp.explore.npmNote" : install.kind === "pypi" ? "mcp.explore.pypiNote" : "mcp.explore.ociNote")}
      </p>

      {fields.length > 0 && (
        <div className="mt-4 grid max-w-2xl gap-3">
          {fields.map((field) => (
            <label key={field.name} className="block">
              <span className="text-[12px] font-medium text-ink/60">
                {field.name}{field.required ? "" : ` · ${t("mcp.explore.optional")}`}
              </span>
              {field.description && <span className="mt-0.5 block text-[11.5px] text-ink/45">{field.description}</span>}
              <input type={field.secret ? "password" : "text"} value={values[field.name] ?? ""} placeholder={field.default}
                onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                autoComplete="off" spellCheck={false}
                className="mt-1.5 w-full rounded-lg bg-ink/[0.06] px-3 py-2.5 font-mono text-[12px] text-ink outline-none focus:bg-ink/[0.09]" />
            </label>
          ))}
        </div>
      )}

      {entry.source === "community" && !verifiedDomain(entry.publisher) && <p className="mt-4 text-[12px] leading-relaxed text-warning">{t("mcp.explore.communityWarning")}</p>}
      {error && <p className="mt-3 text-[12.5px] text-danger">{error}</p>}

      <div className="mt-5 flex items-center gap-3">
        <button type="button" disabled={busy || missing.length > 0} onClick={() => void add()}
          className="flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-[13px] font-medium text-app hover:brightness-110 disabled:opacity-45">
          {busy && <Loader2 size={13} className="animate-spin" />}
          {t(install.kind === "remote" && install.headers.length === 0 ? "mcp.explore.addSignIn" : "mcp.explore.add")}
        </button>
        {missing.length > 0 && <span className="text-[12px] text-ink/45">{t("mcp.explore.needs", { fields: missing.map((field) => field.name).join(", ") })}</span>}
        {installed.includes(entry.slug) && <span className="text-[12px] text-ink/45">{t("mcp.explore.addsAs", { name })}</span>}
      </div>
    </div>
  );
}

/** A reverse-DNS registry name the registry checked by DNS or HTTP, so the
 * vendor itself published it (github.com/… only proves an account). */
function verifiedDomain(publisher: string | undefined): boolean {
  return Boolean(publisher && !publisher.startsWith("github.com/"));
}

function LinkOut({ href, label }: { href: string; label: string }) {
  return (
    <button type="button" onClick={() => void openExternalLink(href)} className="flex items-center gap-1 hover:text-ink">
      <ExternalLink size={12} /> {label}
    </button>
  );
}
