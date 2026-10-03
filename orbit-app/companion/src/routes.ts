// What a paired device is allowed to ask for.
//
// The default is deny, and that direction is the whole point: the sidecar
// sits in front of an API it does not own and cannot see the future of. A
// route that appears in the harness later is closed to phones until someone
// decides otherwise, because the alternative is that every upstream release
// silently widens what a lost phone can reach.
//
// This file used to claim that and not do it — it listed refusals and let
// everything else under `/api/` through. In the time between writing it and
// noticing, upstream added webhook triggers, connected-app authorisation and
// routines, all of which a paired phone could drive: minting an
// internet-reachable trigger, rotating a signing secret out from under
// whatever was sending to it, disconnecting a Google account. None of that
// was a decision anyone made. It was the default.
//
// So the list below is the surface, derived from what the app actually
// calls. Adding a feature to the phone means adding its route here, on
// purpose, in a diff someone can read. That cost is the feature.

/** A refusal to send back, or null to let the request through. */
export interface Denial {
  status: number;
  error: string;
}

/** One request, reduced to what the allowlist decides on. */
export interface RouteRequest {
  path: string;
  method: string;
  /** Whether the bearer token on the request matched a paired device. */
  authenticated: boolean;
}

/** The one companion route that crosses into full interactive desktop
 * control. Both the allowlist and capability gate consume this classifier so
 * their security decisions cannot drift apart. */
export const CLOUD_DESKTOP_JOIN_ROUTE = {
  method: "POST",
  path: /^\/api\/bots\/[\w-]+\/computer\/join$/,
} as const;

/** A POST whose response is file bytes. Keep this exact classifier shared
 * with the proxy: a `.json` document must not enter the ordinary JSON
 * scrub/re-serialise path and come back as different bytes. */
export const MESSAGE_FILE_ROUTE = {
  method: "POST",
  path: /^\/api\/threads\/[\w-]+\/messages\/[\w-]+\/file$/,
} as const;

export const CLOUD_DESKTOP_CONTROL_ROUTE = {
  method: "POST",
  path: /^\/api\/bots\/[\w-]+\/computer\/(?:control|screenshot|viewer-close)$/,
} as const;

export function isCloudDesktopJoin(method: string, path: string): boolean {
  return method === CLOUD_DESKTOP_JOIN_ROUTE.method && CLOUD_DESKTOP_JOIN_ROUTE.path.test(path);
}

export function isMessageFileDownload(method: string, path: string): boolean {
  return method === MESSAGE_FILE_ROUTE.method && MESSAGE_FILE_ROUTE.path.test(path);
}

export function isCloudDesktopAccess(method: string, path: string): boolean {
  return isCloudDesktopJoin(method, path)
    || (method === CLOUD_DESKTOP_CONTROL_ROUTE.method && CLOUD_DESKTOP_CONTROL_ROUTE.path.test(path));
}

/** Every request the iOS app makes, and nothing else.
 *
 * Ids are `[\w-]+`, matching the harness's own route patterns. The paths
 * arrive undecoded and are anchored at both ends, so an encoded traversal
 * fails to match and is denied rather than forwarded — the failure mode of
 * a strict pattern is a closed door, which is the one to have. */
const ALLOWED: ReadonlyArray<{ method: string; path: RegExp }> = [
  // configured-or-not booleans. The write side is refused below: reading
  // which providers are set up is not reading their keys.
  { method: "GET", path: /^\/api\/config$/ },
  { method: "GET", path: /^\/api\/events$/ },
  { method: "GET", path: /^\/api\/instances$/ },
  // Run Claude Code's own `claude update` on the host when a turn failed
  // because it is too old for the model. A fixed command against the host's
  // configured CLI; the harness refuses it while any Claude turn is running.
  // Instance ids may carry dots, so a dots-only segment is refused outright.
  { method: "POST", path: /^\/api\/instances\/(?!\.+\/)[\w.-]+\/claude-update$/ },
  { method: "GET", path: /^\/api\/team-map$/ },
  // Sidecar-owned, authenticated endpoint metadata. The proxy terminates it
  // locally; it never becomes a newly exposed harness route.
  { method: "GET", path: /^\/api\/companion\/endpoints$/ },

  // the fleet, and making a bot
  { method: "GET", path: /^\/api\/bots$/ },
  { method: "POST", path: /^\/api\/bots$/ },
  // One narrow, atomic organizer write. This can only file visible bots;
  // unlike the desktop's broad PATCH it cannot alter execution policy.
  { method: "POST", path: /^\/api\/sidebar-sections$/ },
  { method: "POST", path: /^\/api\/bots\/[\w-]+\/messages$/ },
  { method: "PATCH", path: /^\/api\/bots\/[\w-]+\/cards\/[\w-]+$/ },
  { method: "POST", path: /^\/api\/bots\/[\w-]+\/respond$/ },
  { method: "POST", path: /^\/api\/bots\/[\w-]+\/interrupt$/ },
  { method: "DELETE", path: /^\/api\/bots\/[\w-]+\/queue\/[\w-]+$/ },
  { method: "POST", path: /^\/api\/bots\/[\w-]+\/read$/ },
  { method: "POST", path: /^\/api\/bots\/[\w-]+\/always-allow$/ },
  { method: "POST", path: /^\/api\/bots\/[\w-]+\/messages\/[\w-]+\/edit$/ },
  // A credential value crosses this one route only as an HPKE envelope. The
  // server binds it to the authenticated device and exact pending card before
  // Electron opens it into the OS-encrypted credential store.
  { method: "POST", path: /^\/api\/bots\/[\w-]+\/secret-cards\/[\w-]+\/provide$/ },
  { method: "POST", path: /^\/api\/bots\/[\w-]+\/active-branch$/ },
  { method: "POST", path: /^\/api\/bots\/[\w-]+\/compact$/ },
  { method: "POST", path: /^\/api\/bots\/[\w-]+\/tasks$/ },
  { method: "POST", path: /^\/api\/bots\/[\w-]+\/tasks\/[\w-]+$/ },
  { method: "PATCH", path: /^\/api\/bots\/[\w-]+\/tasks\/[\w-]+$/ },
  { method: "DELETE", path: /^\/api\/bots\/[\w-]+\/tasks\/[\w-]+$/ },
  // Read-only summary: who the bot is, what it does and won't do, and its
  // recent activity. No settings, no transcript — read on open and on
  // pull-to-refresh.
  { method: "GET", path: /^\/api\/bots\/[\w-]+\/overview$/ },
  // Paired-safe profile subset. The harness route itself rejects fields
  // outside identity, standing instructions (soul, byte-capped),
  // mascot body, notifications, and voice preferences.
  { method: "PATCH", path: /^\/api\/bots\/[\w-]+\/profile$/ },
  // Full model selection, but no other bot settings. The harness validates
  // the live catalog and refuses changes while the bot is working.
  { method: "PATCH", path: /^\/api\/bots\/[\w-]+\/model$/ },
  // The one policy field a phone may change: the bot's approval level. The
  // owner asked to manage it from the phone, so it crosses here and only
  // here — never the general bot PATCH, which also carries computers,
  // folders and the command allowlist. The harness route
  // accepts nothing but the level, applies the desktop's rules (no change
  // while working, per-provider levels, the local-Auto warning, Custom stays
  // on the desktop), grants Full access only to a request this sidecar
  // vouched for with Electron's per-launch secret plus an explicit
  // confirmation, and records it in admin activity like the desktop's change.
  { method: "PATCH", path: /^\/api\/bots\/[\w-]+\/approval$/ },
  // The built-in browser on or off, and which named browser session it uses:
  // the desktop Browser panel's two fields, on their own route with the
  // general PATCH's checks. Managing the sessions themselves stays on the
  // desktop (it signs in with the person's accounts).
  { method: "PATCH", path: /^\/api\/bots\/[\w-]+\/browser$/ },
  // A bot's memory, everything the desktop Memory panel does: read, edit,
  // delete a topic, read the change journal and revert a change. Writes carry
  // the file's hash (a stale phone gets a 409, not a silent overwrite) and
  // every change is journaled as the person's, so a delete or revert made
  // from the phone can itself be reverted. The phone confirms deletes and
  // reverts with Face ID or the passcode. Only "open the folder" stays on the
  // computer: it opens Finder or Obsidian there, which a phone can't use.
  { method: "GET", path: /^\/api\/bots\/[\w-]+\/memory$/ },
  { method: "GET", path: /^\/api\/bots\/[\w-]+\/memory\/file$/ },
  { method: "PUT", path: /^\/api\/bots\/[\w-]+\/memory\/file$/ },
  { method: "DELETE", path: /^\/api\/bots\/[\w-]+\/memory\/file$/ },
  { method: "GET", path: /^\/api\/bots\/[\w-]+\/memory\/journal$/ },
  { method: "POST", path: /^\/api\/bots\/[\w-]+\/memory\/journal\/[\w-]+\/revert$/ },
  // Skills, everything the desktop Skills panel does. The phone shows the
  // whole SKILL.md before it enables one. An import is previewed first
  // (fetch and scan, nothing installed), then installed from exactly the
  // SKILL.md the person read, disabled, through the skill-template route —
  // what was reviewed is what lands. Removing a skill asks for Face ID or the
  // passcode. A bot's proposed skills are answered on their card through the
  // /respond routes above, with the reviewed hash.
  { method: "GET", path: /^\/api\/bots\/[\w-]+\/skills$/ },
  { method: "GET", path: /^\/api\/bots\/[\w-]+\/skills\/[a-z0-9-]+$/ },
  { method: "PATCH", path: /^\/api\/bots\/[\w-]+\/skills\/[a-z0-9-]+$/ },
  { method: "DELETE", path: /^\/api\/bots\/[\w-]+\/skills\/[a-z0-9-]+$/ },
  { method: "POST", path: /^\/api\/bot-defaults\/skills\/preview$/ },
  { method: "POST", path: /^\/api\/bots\/[\w-]+\/skill-template$/ },
  // A bot's settings panel, through the desktop's own handler: its team,
  // Chief, where it works, working folder, peer messages,
  // colour, pin and hide. The harness accepts only those fields on this path
  // (PHONE_BOT_SETTINGS); level, model and MCP servers keep their own rules.
  { method: "PATCH", path: /^\/api\/bots\/[\w-]+\/settings$/ },
  // The exact-command allowlist, as the desktop's Approvals panel manages it.
  // Adding a rule lets a bot run that command unasked, so the phone asks for
  // Face ID or the passcode first.
  { method: "GET", path: /^\/api\/bots\/[\w-]+\/command-allowlist$/ },
  { method: "POST", path: /^\/api\/bots\/[\w-]+\/command-allowlist$/ },
  { method: "DELETE", path: /^\/api\/bots\/[\w-]+\/command-allowlist\/[\w-]+$/ },
  // Deleting a bot, with the desktop's lifecycle (turns stopped, computer
  // released). The phone confirms and asks for Face ID or the passcode.
  { method: "DELETE", path: /^\/api\/bots\/[\w-]+$/ },
  // Teams: rename or delete one, and read or edit its brief.
  { method: "PATCH", path: /^\/api\/sidebar-sections$/ },
  { method: "DELETE", path: /^\/api\/sidebar-sections$/ },
  { method: "GET", path: /^\/api\/section-context$/ },
  { method: "PUT", path: /^\/api\/section-context$/ },
  // Full cloud desktop access. The route is narrow and the proxy applies a
  // second, per-device capability check before it reaches the harness.
  CLOUD_DESKTOP_JOIN_ROUTE,

  CLOUD_DESKTOP_CONTROL_ROUTE,
  // rooms — making one, and talking in one
  { method: "POST", path: /^\/api\/groups$/ },
  // A channel's settings (name, members, who answers, bulletin) and deleting
  // it, through the desktop's handlers; delete asks for Face ID or the passcode.
  { method: "PATCH", path: /^\/api\/groups\/[\w-]+$/ },
  { method: "DELETE", path: /^\/api\/groups\/[\w-]+$/ },
  { method: "POST", path: /^\/api\/groups\/[\w-]+\/messages$/ },
  { method: "POST", path: /^\/api\/groups\/[\w-]+\/interrupt$/ },
  { method: "DELETE", path: /^\/api\/groups\/[\w-]+\/queue\/[\w-]+$/ },
  { method: "POST", path: /^\/api\/groups\/[\w-]+\/read$/ },
  { method: "POST", path: /^\/api\/groups\/[\w-]+\/tasks$/ },
  { method: "POST", path: /^\/api\/groups\/[\w-]+\/tasks\/[\w-]+$/ },
  { method: "PATCH", path: /^\/api\/groups\/[\w-]+\/tasks\/[\w-]+$/ },
  { method: "DELETE", path: /^\/api\/groups\/[\w-]+\/tasks\/[\w-]+$/ },

  // a transcript, its images, and answering an approval
  { method: "GET", path: /^\/api\/threads\/[\w-]+\/messages$/ },
  { method: "GET", path: /^\/api\/threads\/[\w-]+\/messages\/[\w-]+\/image$/ },
  MESSAGE_FILE_ROUTE,
  { method: "POST", path: /^\/api\/threads\/[\w-]+\/messages\/[\w-]+\/reactions$/ },
  { method: "GET", path: /^\/api\/threads\/[\w-]+\/export$/ },
  { method: "POST", path: /^\/api\/threads\/[\w-]+\/respond$/ },
  { method: "GET", path: /^\/api\/search$/ },

  // App-owned profile images. Upload is image-only and capped at 10 MB by
  // the harness; GET is a single bare generated filename, never a path.
  { method: "POST", path: /^\/api\/attachments$/ },
  // Voice notes are served from the same dir as .mp3; the harness honors
  // Range on them so a phone player can seek without the whole clip.
  { method: "GET", path: /^\/api\/attachments\/[\w-]+\.(?:png|jpe?g|gif|webp|mp3)$/i },
  // Share-sheet documents are raw, capped at 25 MiB, and stored under a
  // generated filename by the harness. The display name stays in the query;
  // only this exact upload route crosses the companion boundary.
  { method: "POST", path: /^\/api\/files$/ },

  // Renderer-neutral voice operations. These routes never expose or mutate
  // the workspace ElevenLabs key; the client receives labels or audio only.
  { method: "GET", path: /^\/api\/tts\/voices$/ },
  { method: "POST", path: /^\/api\/tts\/prepare$/ },
  { method: "POST", path: /^\/api\/tts\/speak$/ },

  // Routines create ordinary tasks using an existing agent configuration.
  // Webhook management remains explicitly denied below.
  { method: "GET", path: /^\/api\/routines$/ },
  { method: "POST", path: /^\/api\/routines$/ },
  { method: "PATCH", path: /^\/api\/routines\/[\w-]+$/ },
  { method: "DELETE", path: /^\/api\/routines\/[\w-]+$/ },
  { method: "POST", path: /^\/api\/routines\/[\w-]+\/run$/ },
  { method: "POST", path: /^\/api\/routine-runs\/[\w-]+\/(?:cancel|seen)$/ },

  // The computer's MCP servers, read-only: names, what they run, on or off.
  // Values of their variables and headers never leave the computer, and
  // adding one (a command that runs there) stays on the computer.
  { method: "GET", path: /^\/api\/mcp\/servers$/ },

  // A remote client may decline or retry a credential request, but never
  // claim that it stored a host credential. Saving and `provided` stay local
  // to the host's OS-backed credential store.
  { method: "POST", path: /^\/api\/bots\/[\w-]+\/secret-cards\/[\w-]+\/(?:resume|dismiss)$/ },
];

/** Route families worth naming in the refusal.
 *
 * Everything not allowed is denied either way; this only decides whether the
 * person gets a sentence or a 404. These are the ones someone might
 * reasonably expect to work from the phone, where "no route" would read as a
 * bug in the companion rather than a decision about where host configuration
 * happens. Order matters only in that the first match wins. */
const EXPLAINED: ReadonlyArray<{ path: RegExp; error: string }> = [
  {
    path: /^\/api\/(companion|devices)(\/|$)/,
    // Losing the phone must not mean losing the ability to lock it out.
    error: "Remote access settings are managed on the host computer",
  },
  { path: /^\/api\/config$/, error: "API keys can only be changed on your computer" },
  { path: /^\/api\/local-computer(\/|$)/, error: "the Local VM is set up on your computer" },
  {
    // Creating one exposes an endpoint to the internet, and rotating a
    // secret breaks whatever was sending to it. Neither belongs on a device
    // that lives in a pocket.
    path: /^\/api\/webhooks(\/|$)/,
    error: "webhooks are set up on your computer",
  },
  {
    path: /^\/api\/routines(\/|$)/,
    error: "this routine operation is only available on your computer",
  },
  { path: /^\/api\/teams(\/|$)/, error: "teams are imported and exported on your computer" },
  { path: /^\/api\/mcp(\/|$)/, error: "MCP servers are added on your computer, under Plugins → Explore" },
];

/** Why this request may not go through, or null when it may.
 *
 * Default deny: the answer for anything not on the list is "no route", which
 * is what keeps a stolen token from mapping the API. An allowlist rather than
 * a blocklist is the property this whole module exists for, and the one that
 * quietly stopped being true once before. */
export function denyReason({ path, method, authenticated }: RouteRequest): Denial | null {
  // Pairing is the one thing a device does before it has a credential.
  if (method === "POST" && path === "/api/pair") return null;
  // Liveness is the other: it exists to be the first thing anyone curls when
  // pairing will not work, and behind the token check it answered 401 to
  // exactly the person it was for — which reads as "broken" rather than
  // "unpaired". It discloses nothing a port scan would not.
  if (method === "GET" && path === "/api/health") return null;

  if (!authenticated) {
    return { status: 401, error: "pair this device from Remote access settings on the host computer" };
  }

  if (ALLOWED.some((route) => route.method === method && route.path.test(path))) return null;

  const explained = EXPLAINED.find((family) => family.path.test(path));
  if (explained) return { status: 403, error: explained.error };

  // Everything else, including routes the harness really does have. Saying
  // "no route" rather than "not allowed" keeps the sidecar from enumerating
  // the API to anyone holding a stolen token — and it is what the peer-agent
  // endpoints under /api/internal/ always got, since off this machine they
  // genuinely do not exist.
  return { status: 404, error: `no route: ${method} ${path}` };
}
