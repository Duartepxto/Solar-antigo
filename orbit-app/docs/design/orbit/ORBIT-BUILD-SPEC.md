> **Design history.** This is the handoff Orbit was built from, kept for its
> detail. Where it disagrees with [`PRODUCT.md`](../../../PRODUCT.md), that file
> wins: Orbit shipped as the only front end (not behind a flag), draws no
> window chrome, and is its owner's own app rather than a front end for
> OpenMausBot. The prototype is in [`prototype/`](prototype/).

# OpenMausBot Orbit — implementation spec

Orbit is a new front end for **OpenMausBot**. It is an **adaptation**, not a new product. OpenMausBot already has the backend (harness, drivers, store, API) and a UI for almost every setting and flow. Orbit changes how that UI is laid out and presented: a spatial team map, particle characters, and a zoomed-in bot view. It does not change what the app does, except for the short list of genuinely new features in §5.

- **Design reference:** `OpenMausBot Orbit.dc.html` (desktop) and `OpenMausBot Orbit Phone.dc.html` (phone). These are **prototypes**. Every number, name, list and status in them is sample data. Read them for layout, motion and interaction, **never as a data source**.
- **Repository:** `milind-soni/OpenMausBot`, branch `main`.

---

## 1. Hard constraints

1. **The backend is the only source of truth.** Everything Orbit shows must be read from the existing store or API:
   - bots, teams (sections), engines, models, effort levels, approval levels, grants, computers, browsers, phones, apps, MCP servers, skills, memory, routines, runs, voices, usage, threads, messages, cards, notifications and settings.
   - **Do not hardcode or invent any value the backend already serves.** If the prototype shows something the backend doesn't provide, it is either wrong (drop it) or a new feature (it must be in §5 with a backend change).
2. **Adapt, don't reinvent.** For each existing surface, keep its behaviour, validation, confirmations, error states, permissions and i18n keys. Reuse its store actions and API calls. Change presentation only: position, container, styling, motion. Where the existing component's logic is reusable, wrap it; don't copy its logic.
3. **Additive and flagged.** Ship Orbit behind an experimental flag. The current sidebar UI stays the default until the parity checklist (§8) passes. No server behaviour changes except the new features in §5, each behind the same flag where possible.
4. **Nothing can break.**
   - Every action reachable in the current UI must be reachable in Orbit.
   - Existing tests stay green.
   - Remote/paired clients, the phone companions and older clients keep working. Unknown fields are ignored and wire shapes aren't changed without versioning.
5. **Verify before designing.** Before adding or changing any Orbit surface, confirm in the repo whether the feature exists: search the code, `docs/`, and `src/locales/en.json`.
   - If it exists, adapt it.
   - If it doesn't, add it to §5 first, with its backend work, and get sign-off.
6. **All copy goes through `t()`.** Use existing keys where the text exists. New text gets new keys in every locale file, following `docs/localization.md`.

---

## 2. Process

### Step 1. Pull the repository
```sh
git clone https://github.com/milind-soni/OpenMausBot && cd OpenMausBot
pnpm install
pnpm dev            # desktop app against a local harness
pnpm test           # unit and server suites; keep them green throughout
```
- Read `README.md`, `CONTRIBUTING.md`, `docs/self-hosting.md` and `docs/localization.md` before changing anything.
- Use the fake engines in `server/testing/` and `launchVerificationServer` for any manual or automated checks. Never use real accounts.

### Step 2. Analyse the front end and the back end
Produce a written map, and commit it next to this file as `ORBIT-SURFACE-MAP.md`, before writing Orbit code. For every row in §4, fill in:
- **Store:** state fields and selectors in `src/state/store.tsx`, and the actions it dispatches.
- **API:** routes and payloads (`server/index.ts`, `server/routes/*`, `shared/wire.ts`, `server/contracts.ts`).
- **Component:** the existing React component(s) that implement it today.
- **Copy:** i18n key prefixes.
- **Tests:** the tests and `docs/verification/*` that cover it.
- **Gaps:** anything the prototype shows that this source does not serve.

Read these first, because Orbit overlaps them directly:
- `src/components/TeamMapPage.tsx`, `TeamCanvas.tsx` and `CanvasComputers.tsx`: the app already has a team map and canvas views. Orbit must replace or extend them deliberately, not duplicate them.
- `server/chief-of-staff.ts`, `server/delegations.ts`, `server/bot-overview.ts` and `server/room-handoffs.ts`: teams, Chiefs, delegation and reachability.
- `src/components/Sidebar*.tsx` and `SidebarAttentionPanel.tsx`: navigation and the attention list that Orbit replaces.
- `src/components/BotSettingsDialog.tsx`, `bot-settings/*` and `sections.ts`: every per-bot setting.
- `src/components/SettingsModal.tsx`: every app setting.
- `ChatView.tsx`, `GroupView.tsx`, `Composer.tsx` and `MessageActions.tsx`: chat, channels and message actions.
- `src/lib/onboarding.ts`, `src/lib/guided-tour.ts` and `src/components/onboarding/*`: welcome flow and tours.
- The recent upstream work:
  - thread pinning and update order (#1635)
  - work digests (`server/digest.ts`, `DigestChip`)
  - context compaction
  - guarded requests
  - external runtimes
  - hosted Slack
  - routine failures (#1625)
  - the Composio catalog (#1614)

### Step 3. Make the changes
Follow the phases in §7. Each phase ends with its part of the parity checklist (§8) and green tests.

---

## 3. What in the prototype is placeholder data

Everything below must be deleted or replaced with store/API data. None of it may reach production:

| Prototype | Replace with |
|---|---|
| **Bots, teams, members** | |
| `BOTS`, `TEAMS`, `SOLO` (names, roles, colours, teams, tasks, replies, asks, commands) | Bots, sections and their fields from the store. The "No team" group is simply bots without a section. |
| `BOT_ROLES` | Import `src/lib/bot-roles.ts` as-is. |
| **Engines and models** | |
| `ENGINES`, `MODELS`, `MORE_MODELS`, `LOCAL_MODELS`, `EFFORTS` | Engine instances (`state.instances`), each driver's `ModelCatalog`, effort support per engine, and the local-model endpoints (LM Studio / Ollama). |
| **Bot settings content** | |
| `SKILLS`, `ROUTINES`, `CHANNELS`, `ROOMS`, `QUESTIONS`, `SECRETS` | Skills, routines, channels (groups), and pending question and secret cards from the store. |
| Memory seeds in `memOf()` (entries, topics, logs, journal, line counts) | The memory routes in `docs/memory.md`: `/api/bots/:id/memory`, `/memory/file`, `/memory/journal`. |
| MCP items, connector states, "Sign-in expired" | `McpServersPanel` data; Composio connector state. |
| **Chat and threads** | |
| Thread lists and timestamps (`threadAt`), pins, compaction summaries, digest labels (`digestOf`) | Thread `updatedAt` / `pinned` (#1635), `message.compaction`, and `message.digest`. |
| Scripted simulation: `simulate()`, `startTask()`, `endTask()`, `emit()`, auto-show offers, call speakers | Real turn state and events (§5.2, §5.3). The simulation is deleted. |
| Toasts that stand in for actions (e.g. "Refreshing models", "Copied") | The real action. Show a toast only where the current app shows one. |
| **App-level data** | |
| Usage and budget numbers, people, workspaces, remote devices, keys, versions | Their existing settings APIs. |
| Onboarding engine list, phone-beat copy | `EnginesBeat` data; the real `PhoneBeat` copy. |
| **Canvas geometry** | |
| `YOU`, team centres, `newSpot()` positions | Canvas layout (§5.1). |
| App and tool icons loaded from `cdn.simpleicons.org`, including the Lucide fallback for apps it lacks (Slack) | The app's existing icons: `ProviderIcons.tsx` and the Composio connector catalog. Never a third-party icon CDN. |
| Routine failures assigned to one bot per team (`routineFails` owner rule) | Each routine already belongs to one bot. Failures, unseen state and "Mark all as read" come from that bot's own run receipts. |
| Seeded unread threads (Quill, Emaily, Brody) and the scripted unread tracking in `push()` | The thread's real unread state from the store. |

---

## 4. Adapt: existing features and where they come from

Each row is an **existing** OpenMausBot capability. The Orbit column names the new presentation only. Fill in Store / API / Tests during Step 2.

| Orbit surface | Existing source to adapt | Orbit presentation |
|---|---|---|
| **Map and teams** | | |
| Team map: teams, Chiefs, "reports to" lines | Sections; `chiefOfStaff`, `managedSections`; `TeamMapPage` / `TeamCanvas` | Spatial map: team glows follow their members, Chief crown, lines to You |
| Make Chief / Also coordinate {team} | `PATCH /api/bots/:id` with `chiefOfStaff`, `managedSections`, `acknowledgePeerScope` | Actions in the bot's Approvals panel. Keep the acknowledgement step. |
| **Per-bot settings** (`BotSettingsDialog` / `sections.ts`) | | |
| Overview, Identity, Soul | `OverviewSection`, `IdentitySection`, `SoulSection`, `PromptPreview` | "Profile" panel in the zoomed-in bot view |
| Model and effort | `ModelSection`, `ModelPicker` | ENGINE system: search, suggested / all / local, the busy lock, the switch-with-Ask confirm (`model.*`) |
| Access: works on, folder, browser, apps, webhooks, grants | `AccessSection`, `LocalComputerSection`, `RemoteComputerSection`, `BrowserPanel`, `WebhooksPanel` | COMPUTER, BROWSER and APPS systems |
| Permissions: approval level, peers, coordination | `PermissionsSection`, `ApprovalModeSelector`, `FullAccessWarning`, `LocalComputerAutoWarning` | APPROVALS system: ring glyph per level; Full access only with the desktop confirmation |
| Skills, including learned skills and authoring | `SkillsSection`, `SkillRequestPreview`, `VerifyCard` | SKILLS system |
| Memory: gauge, files, topics, log, journal, conflicts | `MemorySection`; routes in `docs/memory.md` | MEMORY system and panel |
| Routines: overlap, results destination, logs | `RoutinesSection`, `routines/*`, `RoutineCalendarPage`, `RoutineRunCard`, `RunLog` | ROUTINES system and panel; the calendar lives in the You hub |
| Voice & alerts | `VoiceSection`, `VoiceSettings`, `SpeakButton` | VOICE system; the Alerts switch is the per-bot notification setting |
| Usage, History, Slack, Visibility | `UsageSection`, `HistorySection` (undo), `SlackSection`, visibility | Rows and panels in the bot view. Slack only when the server offers the Admin link; Visibility only for admins in a browser. |
| Managed teams | `ManagedTeamsSettings` | Chief actions |
| **App settings** (`SettingsModal`) | | |
| Engines, keys, remote/pairing, usage & budget, people/organization, workspaces & backups, skins, thread cleanup, concurrency, room turn timeouts, updates, diagnostics, experimental | `EnginesSettings`, `EngineSetup`, `ApiKeys`, `ServerPairingCard`, `CompanionSection`, `UsageHistory`, `OrganizationSettings`, `PeopleSection`, `WorkspacesSection`, `CompanyBackupSettings`, `WorkspaceBackupSettings`, `SkinPicker`, `ThreadCleanupSettings`, `ThreadConcurrencySettings`, `RoomTurnTimeoutSettings`, `UpdateBanner`, `CustomDomainSettings`, `ConnectedWorkspacesSettings`, `ComputerSharingSettings` | The **You hub**: click You; systems orbit You |
| **Team settings** | | |
| Team instructions (24,000-byte limit), team computer, members, channels | Section settings, `ManageMembersPanel` | The **team hub**: click a team label |
| Install a team from Markdown / library | `TeamLibraryPanel`, `server/bot-package.ts` (with review) | You hub → library. The review step stays mandatory. |
| **Bots, chat and threads** | | |
| New bot | `NewBotDialog`: blank or one of the six roles, one click | "New Bot" panel: the same one-click create |
| Chat, composer, attachments, mentions, queue | `ChatView`, `Composer`, `ComposerAttachments`, `ComposerQueuedMessages`, `MentionTextarea` | Chat column in the zoomed-in bot view |
| Message actions | `MessageActions`; Copy, Edit, Reply, Pin, Read aloud, Raw, Regenerate (`ChatView`) | The "…" tray beside each message |
| Threads: pin, update order, "Show all N threads" | #1635; `SidebarThreadRow`, `ThreadChip`, `TaskPicker` | Thread chips and the All-threads menu in the bot header |
| Work digest and compaction notes | `DigestChip`, `CompactionChip` | Under replies |
| Approval, question, secret and connect cards | `ApprovalCard`, `PendingApproval`, `QuestionCard`, `SecretRequestCard`, `ConnectorCard`, `SignInAccessCard` | Inline in chat, plus the waiting pill on the map. Held reasons use `approval.held.*`. |
| Channels, group calls, reply rules | `GroupView`, `GroupCallView`, `CallView`, reply rules | Channel "rooms" on the map with dotted member links; calls with voice approvals (`approval.voice.*`) |
| Team incidents thread on Chiefs | `docs/team-incidents.md` | Thread chip on Chiefs |
| **Search, onboarding, notifications** | | |
| ⌘K search | `CommandPalette`, `SearchResults`, `ChatFindBar` | Main navigation (there is no sidebar) |
| Onboarding and tours | `WelcomeFlow` (beats), `GuidedTour`, `FirstConversationTour`, `Spotlight` | Same beats and steps. Spotlights point at Orbit's own controls, with a new anchor map. |
| Notifications | `server/notify.ts`, `docs/notification-and-proactivity-qa.md` | Clicking a notification flies to the bot and opens the exact thread |
| Empty, loading, error states | `NoEngines`, the existing error copy | The same states, on the canvas |
| **Other** | | |
| Phone companions | `ios/`, `android/`, `companion/` | Later phase (§7, phase 5) |

**Resolved decisions** (from earlier review):
- **Product name in the UI is "Orbit"**, set through the existing `brand()` mechanism (the same one organization branding uses), so `t("onboarding.welcome", { app })` reads "Welcome to Orbit". The CLI (`npx openmausbot`), data paths (`~/.openmausbot`), docs and the repository keep the OpenMausBot name. About says "Orbit is built on OpenMausBot".
- Model lists come from the driver at runtime.
- Engines come from the backend.
- Avatars are **not shown** in Orbit; particle characters replace them. Avatar data is untouched.
- Visibility stays browser-admin only.
- External agents (Hermes, Slack, Telegram via the MCP bridge) get **their own place**. Proposal: an "Outside" area on the map, separate from the teams. Each agent is an outlined node (not a particle character) linked to the bot and thread it is bound to. They are managed under You → Integrations. The visual design is still pending.
- The onboarding **phone step** is the existing `PhoneSetupFlow` (the onboarding variant, via `PhoneBeat`). Adapt it, don't write new copy. Skipping costs nothing because it can be resumed from Settings → Companion.

---

## 5. New: genuinely new features (frontend and backend work)

Each item below does **not** exist in OpenMausBot today. Each needs its own design sign-off and, where noted, backend work. Build them in the phases in §7.

### 5.1 Canvas and layout persistence
- **What:**
  - Pan and zoom, and click a bot to fly to it.
  - Drag a bot. Drag a Chief and its team moves with it.
  - Positions of shown items on the canvas.
  - "Hidden from map", which is separate from archive.
- **Backend:**
  - Store a per-user UI preference outside bot and section records, e.g. under `/api/config`: `ui.canvas = { teams: {[sectionId]: {dx, dy}}, bots: {...}, camera: {x, y, s}, artifacts: {...} }`.
  - Schema version, migration, and ignored by older clients.
- **Decided:** synced across devices, including the phone companions. The phone shows the same layout.

### 5.2 Presence and moods
- **What:** each character's mood (idle, focused, thinking, pleading, sending, surprised, happy, talking, stalled, sleepy), the tool it's using, and its gaze.
- **Source:** derive it on the client from **existing** state first: busy/streaming, pending cards, tool activity, failures, voice playback.
- **Backend (only if derivation is insufficient):** one normalized presence event, `{ botId, state, tool?, since }`. Confirm in Step 2 before adding anything.

### 5.3 Delegation and report streams
- **What:** particle streams between bots and You for handoffs, results, incidents and approvals.
- **Source:** existing delegation records and messages (`server/delegations.ts`, the "Delegated to …" rows, incident routing).
- **Backend (only if the renderer can't see these live):** `delegation.sent/accepted/result/failed` events, `{ id, from, to, reason? }`.

### 5.4 "Wants to show you" (bots presenting artifacts)
- **What:**
  - A bot can offer to show something: an HTML file, a PDF, an image, or its live computer screen.
  - A pill with the bot's face appears near the bot, or docked above the composer in the zoomed-in view. It points at the bot and follows it when it's off-screen.
  - The pill offers View and Later. Several offers stack; they don't replace each other.
  - A shown item opens as a draggable object on the canvas next to the bot's team, with a line back to the bot and a reply box that sends to that bot.
  - If you're inside that bot's view, it opens inside the view instead.
- **Why new:** today attachments and screenshots appear only in chat. That must keep working; the canvas offer is extra.
- **Backend:**
  - A `present` capability the bot can call: an agents-MCP tool or a message kind with `{ botId, threadId, kind: html|pdf|image|screen, title, artifactId|url }`.
  - Artifact storage and URLs.
  - **Decided retention:** a shown item stays on the canvas until you close it, with no expiry. The underlying file stays with the conversation like any attachment.
  - Sandboxed rendering for HTML (no network by default).
  - Live-screen offers reuse the existing computer live view and its permission states.
- **Frontend:** the offer queue, the pill, canvas objects with persisted positions (§5.1), the docked variant, and the reply box.

### 5.5 Links drawn on the map ("can talk")
- **What:** drag from a bot's "+" to another bot to let them contact each other; click a link to remove it.
- **Maps onto:** the existing bot `peers` field. Only the presentation is new.
- **Careful:** `peers: undefined` (the default reach) and `peers: []` (nobody) mean different things. `server/bot-overview.test.ts` and `server/delegations.test.ts` depend on this. A drawn link must write an explicit list without silently shrinking the default reach.
- **Decided:** this **is** the existing `peers` feature (who a bot can contact, plus "Ask me before contacting other bots"). The map only draws and edits it, following exactly the reach rules the server enforces today (`reachablePeers`, Chief `managedSections`). If the server refuses a pair, the map shows the server's reason and draws no link.

### 5.6 Approvals with a cause and a one-click fix
- **What:** an approval states why it reached you, and offers the matching fix:
  - "Give Clive Full access"
  - "Let Atlas coordinate Personal"
  - "Approve for me"
- **Source:** derive the cause on the client (the bot's level, the delegator's level, whether there's a Chief). Only add a server-side `cause` field if derivation is ambiguous.
- A fix is a normal settings write with its normal confirmations; it never bypasses them.

### 5.7 Active Threads on the map (adapt, no backend change)
- **Replaces the invented "N runs while you were away" pill.** There is no such summary in OpenMausBot. The existing equivalent is **Active Threads** (`SidebarAttentionPanel`, `SidebarBotActivity`, `attention.title` / `attention.empty`).
- **Orbit presentation:** a pill under You, e.g. "4 active threads", with the faces of the bots involved. It opens the Active Threads list:
  - each row shows the bot, the thread, and its state: **Working**, **Unread**, or an unseen routine failure (`markAllRoutineRunsSeen`)
  - clicking a row flies to the bot and opens that exact thread
- **Waiting on you is excluded here:** those items are the separate waiting pill (existing approval and question cards), so nothing appears twice.
- **Source:** existing thread unread state, busy/streaming state and routine run receipts only. The prototype's seeded unread threads (Quill, Emaily, Brody) are placeholders.
- **Also removed from the design:** the invented You-hub "Digest" panel and the "Morning digest" alert switch.

### 5.8 Hubs
- **What:** You and each team shown as a centre with its settings orbiting it.
- **Source:** existing settings only. Summary numbers come from aggregated reads of existing endpoints. No new server data.

### 5.9 Remember this
- **What:** a message action that asks the bot to save that message to memory. It shows a compact "Remember this · “…”" row, then the bot's `memory_update` step, then "Saved to memory".
- **v1 (no backend change):** send an ordinary user message through the existing send route with a fixed, localized instruction that quotes the message. The bot's existing `memory_update` tool does the save, following the existing rules: budget, redaction, stale-passage refusal, 3 refusals per turn, and self-tidying when full.
- **v2 (backend):** a `remember` message kind with `sourceMessageId`, so the transcript stores a structured row. It uses the same turn admission and queueing.

### 5.10 "Saved to memory" chip
- **What:** a chip under a message whenever that turn wrote memory.
- **Source:** that turn's `memory_update` tool calls, which exist in tool activity and the work digest. If they aren't on the wire for the renderer, expose them in the turn's tool results. No new storage.

### 5.11 Characters, guide, You
- **What:** particle-orb characters in each bot's colour, with moods (§5.2); the You character; the green guide character in onboarding.
- **Scope:** frontend only. Performance budget: 60 fps with 20+ bots on integrated GPUs, with quality tiers. Reduced-motion support is required.

### 5.12 Copy changes caused by removing the sidebar
- **Where:** onboarding reel scene 1 ("Each bot in the sidebar") and the tour's final step ("Settings → General").
- **Work:** new i18n keys in every locale. Tour anchors are remapped to Orbit controls. The Tools-menu step is dropped because Orbit has no Tools menu.

---

## 6. Behaviour rules the design assumes (must match the server)

1. A team with a Chief sends you one answer. Teammates report to the Chief.
2. A team without a Chief: every member reports to you directly.
3. A Chief on Full access passes Full access to the work it delegates, whatever each teammate's own level.
4. Incidents in a Chief's team go to the Chief's "Team incidents" thread first, and reach you only if the Chief can't resolve them.
5. Full access is enabled only from the desktop app, with a confirmation.
6. Memory: only the first 200 lines / 24 KB of `MEMORY.md` load each turn. The bot keeps it tidy itself. It asks you only after 3 refused writes in one turn.
7. Routines: each run starts with fresh context. Overlap is skip or queue-one, per routine.
8. A notification click opens that exact bot and thread.

---

## 7. Phases

1. **Read-only canvas (flagged):**
   - The map from real sections and bots.
   - Characters with moods derived from existing state.
   - Click a bot to open the existing chat in Orbit's chat column.
   - ⌘K navigation.
   - No layout persistence yet.
2. **Bot view:** the zoomed-in view with systems (settings panels adapted from `BotSettingsDialog`), chat, threads, message actions, cards, digests and compaction.
3. **Hubs and app settings:** You hub, team hubs, onboarding and tours, notifications deep links, empty/loading/error states.
4. **New features:**
   - Layout persistence (5.1).
   - Delegation streams (5.3).
   - Links (5.5).
   - Approval causes and fixes (5.6).
   - Active Threads pill (5.7).
   - Remember v1 and the saved chip (5.9, 5.10).
   - "Wants to show you" (5.4), which is the largest item.
5. **Phone companions:** the same layout on iOS and Android, if 5.1 is synced. It is scoped separately because the apps are native.

---

## 8. Parity checklist (before Orbit can become the default)

- [ ] Step 2's surface map is complete, with no "Gaps" left unresolved.
- [ ] Every action in the current UI is reachable in Orbit: every bot settings section, every app settings section, chat, threads, cards, channels, calls, routines, library/packages, usage, remote, backups and skins.
- [ ] No hardcoded data. A grep for the prototype constants (`BOTS`, `TEAMS`, `ENGINES`, `MODELS`, `SKILLS`, `ROUTINES`, `ROOMS`, …) in the Orbit code returns nothing.
- [ ] All strings use `t()`, and every locale has the new keys.
- [ ] Remote and paired clients: no host-only action is offered where it can't work (Open in Obsidian, Show in Finder, local computer). The existing remote-client rules are respected.
- [ ] Keyboard: everything is reachable without a mouse. Visible focus, and Esc backs out one level.
- [ ] Reduced motion is respected. Frame rate holds within budget on low-end hardware.
- [ ] The existing test suites and `docs/verification/*` checks pass. New Orbit tests cover navigation, deep links and the new features.
- [ ] The flag can be turned off at any time with no data loss.

---

## 9. Open questions
- The visual design of the external agents' "Outside" area.
- Anything Step 2's surface map turns up as a gap.

## 10. Computer states adapted in the prototype (phase 2)
Adapted from `ComputerPanel`, `LocalVmWorkspace`, `CloudScreenPreview` and `LocalScreenPreview`, using the existing `computer.*` copy. In the port, every state below comes from the provider, not the prototype:
- **Asleep:** cloud or VM with no work. Wake the Local VM / Wake the cloud desktop → "Waiting for the first frame…" → live.
- **This Mac without Screen Recording:** "No frames yet — the preview needs Screen Recording permission. After granting, relaunch the app.", Open Settings, and a watch-only badge.
- **Engine can't use computers:** a chat-only engine (LM Studio) greys out Local VM, Cloud and This Mac with the reasons "This model engine cannot use the Local VM" / "…cannot use cloud computer tools" / "Local computer control isn’t ready". Browser only and Off still work.
- **Take control:** "You have the wheel — the bot’s clicks and keystrokes are refused until you hand it back." → Hand control back.
- **Local VM:**
  - "Open two desktops" when two or more bots use VMs.
  - "Delete this VM" with a confirmation, blocked while a turn runs ("Stop this bot’s turn before deleting its VM").
