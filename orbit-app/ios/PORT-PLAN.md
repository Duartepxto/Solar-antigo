# iPhone app → Orbit phone design: survey and port plan

Survey date: 2026-09-25. Read with [`PRODUCT.md`](../PRODUCT.md) (the rules),
the phone prototype (`design-full/design_handoff_orbit/OpenMausBot Orbit Phone.dc.html`,
outside the repo) and the desktop implementation in `src/orbit/`.

## 1. Build status (before any change)

- `xcodegen generate` + `xcodebuild … -destination 'platform=iOS Simulator,…' CODE_SIGNING_ALLOWED=NO build`
  (Xcode 26, iOS 26.5 simulator): **BUILD SUCCEEDED with no changes.** The
  OpenMausBot → Orbit rename did not break the build.
- Rename leftovers found (not build breakers):
  - `CFBundleDisplayName: MausBot` for the app, share extension and widgets in
    `project.yml` (home-screen name, "Open in “MausBot”?" prompt). The comment
    ties it to an App Store listing named MausBot, which Orbit does not have.
  - `NSMicrophoneUsageDescription` / `NSSpeechRecognitionUsageDescription` say
    "OrbitMobile".
  - The mascot: `MausAvatar.swift`, `MausFaceData.swift`, `MascotState.swift`,
    `BotAvatarView.swift`, `CompanionCore/MausBodies.swift`,
    `MausSilhouette.swift` (+ tests), `AppStore/` screenshots and copy.
- To pair in the Simulator the app must be signed with a team so the Keychain
  entitlement exists (`DEVELOPMENT_TEAM=<team> CODE_SIGN_IDENTITY=- CODE_SIGN_STYLE=Manual`),
  as `TESTING.md` says. This Mac has the owner's Apple Development identity;
  its team id was used only for simulator builds.

## 2. Pairing with an isolated fixture

Done in the Simulator, never against the owner's app or `~/.orbit`:

- A disposable harness (`server/index.ts`) and companion sidecar
  (`companion/src/index.ts`) under a temp `HOME`, fake engine only (two
  instances: normal replies, and one whose turns hold so a real permission
  request can be raised through the engine's permission socket). Ports
  19401 (harness), 19411 (sidecar), 19412 (control). Bots: Atlas (Chief) +
  Brody + Quill in *Research*, Clive (Chief) + Probe in *Engineering*, Emaily
  and Omiii with no team. Script kept outside the repo (scratchpad
  `fixture/fixture.mjs`); the same shape as `scripts/capture-companion-fixtures.mjs`.
- The app paired by opening an `orbit://pair?address=127.0.0.1:19411&token=…`
  invite (what the desktop QR carries) and tapping Connect, driven by
  `UITests/LiveFixtureUITests.swift` (skipped unless the runner is given the
  fixture through `TEST_RUNNER_ORBIT_LIVE_*` variables).
- Result: roster, transcripts, replies from the fake engine, and a real
  pending approval (Probe wants `pnpm test --filter release`) all reach the phone.
- Not provable here: the camera QR scan, Bonjour/Local Network permission on
  a real iPhone, Tailscale, HTTPS pairing, push/Live Activities on device.
  Those need the owner's iPhone.

Note: the fixture sidecar advertises itself on the LAN over Bonjour as
"Ada Lovelace's computer" while it runs (it is the stock sidecar).

## 3. The phone prototype

Four screens (all sample data; `ios-frame.jsx` draws a mock iPhone and is not
built):

| # | Screen | What it shows / does |
|---|---|---|
| 01 | Team map | Full-screen dark canvas (#050506), dot grid, You in the middle (pearl orb tinted toward each team), teams as coloured glows with a mono label (`RESEARCH`, "Chief · Atlas" / "no Chief · reports to you"), Chiefs linked to You, members linked to their Chief (amber when waiting), a dot travelling along a line while a member works, particle characters with moods, names placed without overlap. Drag to pan, tap a bot (ring pulse) → 02. Top: "Search or jump" pill → 04, a person button (You). Bottom: "N waiting" amber pill with up to 3 faces → 03, and a composer "Tell Atlas what you want done" addressed to the Chief. |
| 02 | Bot | "‹ Team map" link, the bot's character (120 pt, pops in), name in its colour, "role · team · reports to X", a scrolling row of system chips (Engine · model, Computer, Approvals, Browser, Apps & MCP, Skills, Memory, Routines, Voice, Usage; amber when waiting, tinted while working). Below, a rounded sheet: thread pill "Main ▾" with a thread menu, "N threads", "+", the transcript (your messages right in a grey bubble; delegated messages outlined with "From Atlas · delegated"; tool runs as mono "✓ …" lines; bot replies as plain text; approval card with command, **Allow once** / **Deny**), and a composer "Message Brody" with a white send button. Chips open full-height sheets: kicker + title + Done, a description, a segmented grid (model / works on / approval level), chips (effort), key–value rows, and lists with switches. |
| 03 | Waiting on you | A sheet: "Waiting on you N", one card per bot: approval (command, Allow once / Deny), question (option pills), key request (password field, "Save securely", "Stored in your keychain. Never added to chat."). Resolved cards collapse away. Below, dashed "fix" rows ("Personal has no Chief… Let Atlas coordinate", "Full access … Desktop only"). |
| 04 | Search | Search field + Cancel, grouped results: BOTS (face, role · team), THREADS · <bot>, SETTINGS, ACTIONS. |

Motion: `rise`, `pop`, `popUp`, `sheet` enter animations (see the `ENTER`
table), collapse-out for resolved cards, a back-out pop for the header character.

## 4. Mapping prototype → app

| Prototype | Existing SwiftUI | Data / API | Port |
|---|---|---|---|
| 01 Team map canvas | `ChatListView.swift` (roster), `BotThreadTree.swift` | `session.state.bots` (section, chiefOfStaff, color, busy, tasks), `rooms`, `pendingApprovals`, `status` | **New** screen replacing the roster as home; layout = port of `src/orbit/model.ts` (`buildModel`, `teamCentres`, `botHomes`, `looseSpot`). Desktop drag offsets live in the desktop's localStorage, so the phone can't read "same positions as the desktop"; it uses the same deterministic layout without them. **Large** |
| Particle character | `MausAvatar.swift`, `MausFaceData.swift`, `BotAvatarView.swift`, `MascotState.swift` | mood from bot state (`moodFor` in `model.ts`) | **New**: SwiftUI `Canvas` port of `src/orbit/characters.ts` (`drawChar`, `drawFace`, `drawYou`); replaces every mascot including the Live Activity. **Medium** |
| Search or jump | search in `ChatListView` bottom bar, `SearchHitRow` | bots/threads/rooms locally + `session.search` (server message search) | **Restyle + extend** into its own screen. Settings/actions rows open real screens. **Medium** |
| You button | `SettingsView.swift`, `ProfileAvatar` | connection, computers | Restyle SettingsView to Orbit. **Medium** |
| N waiting pill / 03 | `UpdatesPill`, `UpdatesSheet.swift`, `Island.swift` (needs-you popover) | `state.updates`, `session.answer`, `CredentialRequestCardView` | **Restyle** UpdatesSheet as "Waiting on you" cards; drop the island popover over the map (PRODUCT.md: nothing pops over the canvas). **Medium** |
| Map composer "Tell <Chief>…" | none (composer is in `ChatView`) | `session.send(text:attachments:to:)` | **New, small**: sends to the first Chief (or first bot); opens its chat. |
| 02 header, chips | `ChatView.headerBar/headerFace`, island intro | bot fields: `modelSelection`, `computer`, `approvalMode`, `speakReplies`, `notifications`; `modelInstances()` | **Restyle** ChatView header; chips open existing sheets (`AgentProfileView`, `ComputerView`, `ConnectedAppsView`, `TasksRoutinesView`, `WalkieVoiceSettings`). **Large** |
| Thread pill / menu | `TaskManagerView.swift`, thread switcher | tasks, `createTask`, `switchTask` | **Restyle**. **Small** |
| Transcript | `MessageRow`, `TextBubble`, `ActivityChip`, `ActivityRunChip`, `AssistantTurnChip`, `CardView`, `QuestionCardView`, `CredentialRequestCardView`, `StreamingBubble` | unchanged | **Restyle** bubbles (right grey for you, plain text for bots), tool lines, approval card. **Medium** |
| Composer | `ChatView.composer` | unchanged | **Restyle** (keep +, dictation, attachments, slash HUD). **Small** |
| System sheets: Engine/Model/effort | `AgentProfileView` | `updateModel`, `modelInstances` | Restyle; real models from the engine. **Medium** |
| Approvals level | none | `approvalMode` read-only (the phone can't PATCH bot policy) | **Read-only** sheet: shows the level, says it's changed on the computer. |
| Browser, Memory, Skills, Usage | none | no phone route | **Doesn't fit yet**: needs new server routes. Chips are left out rather than faked. |
| Apps & MCP, Routines, Voice | `ConnectedAppsView`, `TasksRoutinesView`, `WalkieVoiceSettings`, `AgentProfileView` | existing routes | Restyle / reuse. |
| 03 "fix" rows (Let Atlas coordinate, Full access desktop only) | none | would need `managedSections` / policy PATCH, refused by the sidecar | **Doesn't fit**; left out. |
| Channels | `GroupTile`, `NewGroupSheet` | rooms | Not drawn in the phone prototype; shown on the map between members like the desktop (`channelPos`), opening the room chat. |
| Welcome / pairing | `OnboardingViews.swift`, `PairingView.swift`, `PairingScanner.swift` | unchanged | **Restyle** dark, with the You character; no mascot. **Medium** |
| Walkie, New section, New bot, New group | `WalkieView`, `NewSectionSheet`, `NewGroupSheet`, `createBot` | unchanged | Kept, reachable from Search → Actions. |

## 5. What the prototype assumes that PRODUCT.md or the real app rules out

- **Drawn device chrome**: `ios-frame.jsx` (status bar, island, home
  indicator, keyboard) is a mockup. The phone supplies all of it.
- **Sample data**: every bot, team, message, command, usage number and
  thread name is sample. Everything comes from the paired computer.
- **"Reads the canvas layout from your Mac"**: the desktop keeps map offsets
  in its own localStorage; no server API exposes them. Same algorithm, no
  offsets.
- **Changing approval level / Full access, "Let Atlas coordinate", browser,
  memory, skills, usage**: the companion sidecar deliberately refuses bot
  policy PATCHes and has no routes for these. Shown read-only or omitted.
- **Hosted services**: the current app offers optional hosted HTTPS pairing
  wording; PRODUCT.md says no hosted services. Pairing copy should point at
  local / Tailscale / the person's own server. (Behaviour left as is: the
  QR decides the route.)
- **Old mascot**: must go everywhere (app, Live Activity, App Store assets).

## 6. Port order

1. Foundations: Orbit tokens (dark only), particle character port, mascot
   removed everywhere, app named Orbit. (medium)
2. Team map home (01) with search pill, You button, waiting pill, Chief
   composer. (large)
3. Bot screen (02): header, chips, chat sheet, transcript and composer
   restyle, thread menu. (large)
4. Waiting on you (03). (medium)
5. Search (04). (medium)
6. System sheets restyle (engine/model, computer, approvals read-only,
   apps, routines, voice). (medium)
7. Welcome, pairing, settings restyle. (medium)

Drop: the needs-you island popover, the island intro in chats, the
"Threads" roster, the mascot body/expression pickers.

## 7. Open questions for the owner

1. Where do channels go on the phone map? (Desktop draws them between their
   members; the phone prototype shows none.) Port uses the desktop placement.
2. The map composer: prototype addresses Atlas (a Chief). With several
   Chiefs, which one? Port: the first Chief; tap its pill to pick another.
3. Should the phone get server routes for approval level, memory, skills,
   usage so those chips can exist? (Security review needed: the sidecar
   refuses policy writes on purpose.)
4. Hosted HTTPS pairing copy/route: remove from the phone entirely?
5. Light mode: Orbit is dark-only in the prototype; port forces dark.

## 8. Risks

- `ChatView.swift` is 2,400 lines with many behaviours (drafts per thread,
  attachments, dictation, file previews, edits, versions, reactions); the
  restyle must keep all of them. UI tests key on identifiers
  (`thread-switcher`, `header-threads`, `message-input`, `Back`).
- A live `Canvas` of many particle characters at 60 fps costs battery; the
  map pauses when not visible and lowers detail for small faces.
- The pairing flow and Keychain can only be fully proved on a device.

## 9. Port status (2026-09-25)

Done, each checked on the simulator against the isolated fixture:

- Foundations: the particle character (`App/Orbit/OrbitCharacter.swift`)
  everywhere including the Live Activity; mascot files removed; dark Orbit
  tokens; app, share extension and widget named Orbit.
- Team map home (`TeamMapView`, `TeamMapCanvas`, `OrbitMapModel`), Search
  (`SearchView`), Waiting on you (`WaitingView`).
- Bot screen: header, system chips, chat sheet, transcript and composer in
  `ChatView.swift`; a read-only Approvals sheet (`OrbitSheet.swift`).
- Settings, pairing, welcome and the list and form screens restyled.
- A real approval raised by the fixture engine was answered from the phone.

Left:

- Engine, computer, voice and threads open the existing sheets, recoloured
  but not rebuilt as the prototype's segmented system sheets.
- Browser, Memory, Skills and Usage chips need phone routes on the server.
- Channels on the map use the desktop placement (open question 1).
- The desktop's map drags aren't visible to the phone (no server route).
- `CompanionCore/MausBodies.swift` and its tests remain, unused by the UI;
  `AppStore/` screenshots and copy still show OpenMausBot.
- Not proved here: camera QR, Bonjour and Local Network, Tailscale or HTTPS,
  push.

## 10. Structure: one canvas (2026-09-26)

The owner rejected the prototype's screen-and-sheet structure: bots pushed
as new screens, a draggable-looking chat sheet under a second copy of the
character, and every system as a sheet stacked on that sheet, with rows that
ran under their switches. The desktop's concept wins; the prototype gives
only styling. Two intermediate versions were tried while the owner watched
(the chat as a column under the systems; then the chat and systems as
sheets) and both were rejected: opening a bot must not show its chat and
its settings at once, and there are no sheets. As built
(`App/Orbit/OrbitShell.swift`):

- One canvas, never torn down. Opening a bot, a channel or You flies the
  camera there (the desktop's `camTarget` easing); the map fades back.
- A bot opens on its chat: it steps up to the corner (the desktop's covered
  corner, as for its calendar) and its chat has the rest of the screen.
- **Settings** (top right, or the bot in the corner) flies it to the middle
  with its ten systems on lines round it, on their own. A system steps it
  back to the corner with that system in the chat's place; Done returns to
  the systems, **Chat** to the chat. A tap on the canvas leaves the systems
  for the chat, and the chat for the map, as does "‹ Team map".
- You: You in the corner, Settings in the chat's place. Waiting on you and
  new channels rise from the bottom of the map; Search grows out of its pill.
- Nothing is pushed or presented as a sheet, except pages inside a system
  (a skill's review, a memory file, Settings' sub-pages) and system pickers.

Left: confirmations still use system alerts (PRODUCT.md wants them inline);
the walkie is still a full-screen cover; map labels can crowd when a team
has no Chief.
