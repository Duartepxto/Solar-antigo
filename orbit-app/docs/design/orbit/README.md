> **Design history.** This is the handoff Orbit was built from, kept for its
> detail. Where it disagrees with [`PRODUCT.md`](../../../PRODUCT.md), that file
> wins: Orbit shipped as the only front end (not behind a flag), draws no
> window chrome, and is its owner's own app rather than a front end for
> OpenMausBot. The prototype is in [`prototype/`](prototype/).

# Handoff: Orbit, a spatial front end for OpenMausBot

## Overview
Orbit is a new front end for **OpenMausBot** (`github.com/milind-soni/OpenMausBot`). It replaces the sidebar layout with:
- a **team map** drawn on a canvas
- bots shown as **particle characters** with moods
- a **zoomed-in bot view** where the bot's settings orbit it and chat sits beside it
- **hubs** for app settings (You) and team settings

Almost everything is an **adaptation of existing OpenMausBot features**. A short list of genuinely new features is specified separately.

**Read `ORBIT-BUILD-SPEC.md` first.** It is the authoritative implementation spec. It sets the hard constraints, the process (pull → analyse → change), the "adapt vs new" inventory, the phases and the parity checklist. This README describes the *design*; the spec describes *what to build and how*.

## About the design files
The `.dc.html` files in this bundle are **design references built in HTML**: working prototypes that show the intended look, motion and interaction. They are **not production code to copy**. Recreate them inside the OpenMausBot codebase (React + TypeScript, Tailwind tokens in `src/styles.css`, `lucide-react`, the i18n `t()` helper, the existing store), following its established patterns.

- **Every data value in the prototypes is sample data:** bots, teams, engines, models, counts, memory, routines and messages alike. The prototypes also *simulate* activity (tasks, handoffs, replies, offers). In the real app, all of it comes from the OpenMausBot store and API. See spec §1 (hard constraints) and §3 (the placeholder list).
- **To view them:** open `OpenMausBot Orbit.dc.html` in a browser, with `support.js` next to it. The **Tweaks** panel has scenario switches: live, first-run, loading, no-engines, offline. It also has pace, the You style, quality and owner name.

## Fidelity
- **High fidelity for layout, visual language, motion and interaction:** the canvas, characters, bot view, panels, onboarding window, tour spotlight, pills and trays. Match these closely.
- **Colors and typography** are prototype approximations of OpenMausBot's skins. Map them onto the codebase's existing tokens (`ink`, `ink-secondary`, `panel`, `raised`, `hairline`, the skin variables) rather than introducing new ones.
- **Copy:** use the existing i18n keys wherever the prototype's text came from OpenMausBot (most of it did). Only the strings listed in spec §5.12, plus Orbit-specific labels, need new keys.

---

## Screens and views

### 1. Window
The app window is inset 18px from the screen, with radius 12, a 1px border at `rgba(line, .09)` and the shadow `0 30px 80px rgba(0,0,0,.6)`.
- **Title bar (38px):**
  - Traffic lights: 12px circles `#ff5f57`, `#febc2e`, `#28c840`, 8px gap.
  - Centred title, 13px/500 at 70% ink: "Orbit — Team map", or "Orbit — <Bot>".
  - Right: the search chip, 24px high, radius 7, fill `rgba(line,.05)`, border `rgba(line,.1)`, 12px text "Search or jump · ⌘K", with a search icon.
  - Its background is the same as the map, **with no divider line**: title bar and content read as one surface.
- **During onboarding** the whole window shrinks to a small centred window: 460 × 560, clamped to the viewport with an 18px margin. It animates its left/top/width/height over 550ms `cubic-bezier(.3,.7,.2,1)`. See §6.

### 2. Team map (canvas)
**Background:** a radial gradient from `stageA` (centre) to `bg0`, plus a dot grid every 80 world units (1.2px dots, 5% ink). The grid is hidden when a grid cell would be under 14px on screen.

**Teams**
- **Glow:** a radial gradient in the team colour at 8% alpha, following the **centroid of its visible members**. Its radius is the members' spread + 120, and it gets dimmer as it grows. Each member also carries a small glow of its own (125 units, 5%).
- **Label:** mono 11px uppercase in the team colour, plus a 400 line underneath: "Chief · Atlas", "coordinated by Atlas" or "no Chief · reports to you". It sits beside the team, on the side away from You.

**Bots**
- **Size:** members are R = 23 world units, Chiefs R = 34.
- **Name:** 12px/600 in the bot colour, below the bot. Names hide below 0.38× zoom.
- **Chief crown:** lucide `crown`, above the Chief.
- **Hover:**
  - A ring at `R*1.3+4`, 60% ink.
  - A caption under the name ("click to talk", or its current task).
  - A **"+" handle** at the top-right: drag from it to another bot to create a "can talk" link.
- **Tool bubble:** while a bot works, the tool in use orbits it in a small rounded square (radius 45%, bot-colour border), joined by a dotted line.

**Lines**
- You → Chief: 14% ink.
- Chief → member: 7% ink.
- Member → You, when the team has no Chief: `rgba(255,190,120,.14)`.
- Anything waiting on you turns its line amber: `rgba(255,152,0,.6)`.
- Lines start at the edge of the orb, never at its centre.

**Channels (rooms)**
- A 40-unit circle outlined in the channel colour, with a "#" glyph.
- Name and reply rule beneath: "4 bots · the lead replies".
- Dotted links to its members.
- A channel is hidden when none of its members is visible.

**You**
- A pearl-white particle character, `rgb(232,235,244)`, R = 20 at 0.6× zoom.
- Its surface picks up each team's colour on the side facing that team (additive glows). Arriving reports flash that side.
- Its eyes follow the cursor anywhere in the window. They centre when the cursor is on You, and fall back to reports and waiting bots when the cursor leaves the window.
- The label "You" sits underneath.
- **Hover:** a ring and "click for your settings". Clicking opens the You hub.

**Pills under You**
- **Active Threads pill:**
  - 30px high, radius 15.
  - Shows up to 3 mini character faces (24px, overlapping by 6px) and "N active threads".
  - Opens the Active Threads list, 300px wide. Its max-height adapts to the space below and it opens upward if needed. Each row shows face 28px, "Bot · Thread", and the state: Working / Unread / Routine failed · not seen yet.
- **Waiting pill:**
  - Faces plus "Atlas is waiting" or "N bots are waiting".
  - Opens the grouped approvals list, 320px wide. It has one row per bot, a count badge, Allow (blue `#1084fe`, 28px circle) and Deny (outlined).
  - "Fix the cause" rows appear under the list (spec §5.6).

**Map controls**
- **Bottom-right:** a Key legend plus − / + / Fit.
- **Pan:** drag the background.
- **Zoom:** scroll (with ctrl for pinch). Zoom anchors on the cursor, clamped 0.12–3.2×.
- **Moving bots:** drag a bot to move it. Dragging a Chief moves its whole team.
- **Click a bot:** fly to it.
- **Esc or clicking the background:** fly back.
- **Pointer:** icon-only buttons and all clickable canvas objects (bots, You, channels, team labels, "+" slots) show the pointer cursor; empty canvas shows grab / grabbing.

### 3. Zoomed-in bot view
**Camera:** flies with an exponential ease (factor 0.08 per frame) so the bot sits at `(fx, fy)`, the centre of the area left of the chat, at about 60px radius. Everything else fades to about 5%.

**Systems orbit**
- Ten systems sit on an ellipse (rx up to 300, ry up to 250), starting at the top and going clockwise: ENGINE, COMPUTER, BROWSER, PHONE, APPS & MCP, APPROVALS, SKILLS, MEMORY, ROUTINES, VOICE.
- **Label:** a lucide icon (15px), a mono 9.5px letter-spaced kicker, a 12.5px/500 value, and an 11px status.
- **Active systems** (in use this turn) show a dashed line in the bot colour animating toward the label. APPROVALS uses amber when something is pending.
- **Entrance:** once the camera settles (+300ms), each line grows out from the orb in turn (40ms stagger, 380ms ease-out cubic), ending in a small dot. Its label fades and rises 8px as the line arrives, from 55% of the line's progress. Leaving fades all labels out over 200ms.

**Approval level ring** around the focused bot (1.6px, 40% ink):
- Ask: full ring.
- Auto-accept edits: ring with a gap.
- Approve for me: dashed ring.
- Full access: soft violet glow `rgba(178,150,255,.22)`.

**Chat column**
- **Width** `clamp(300px, 40vw, 440px)`, 28px from the right edge, from 18px top to 18px bottom.
- **Header:**
  - Name 26px/600 in the bot colour.
  - Subline 13px at 60%: "Chief of Staff · Research · reports to you".
  - Chips (24px, radius 12, 1px border): engine tag + model, approval glyph + level, where it works.
- **Thread chips** (24px, radius 12). Pinned threads come first, then by latest message; at most 3 show as chips.
- **"N more ▾" menu** (220px): rows show a pin toggle, the label and a local date/time. It lists the 6 most recent open threads, with "Show all N threads" for the rest.
- **Messages:**
  - User bubble: fill `rgba(line,.08)`, radius 16/16/4/16, 14px/1.45.
  - Bot text: 14.5px/1.6, no bubble.
  - Tool rows: mono 11.5px with a green check.
  - Delegated message: outlined bubble with "From Atlas · delegated".
  - Cards inline: approval, question, secret, connect.
  - Under replies: the work-summary chip ("Did N tool calls · M files changed"), and "Saved to memory · …".
  - The compaction note "Earlier context summarized" is an expandable details element.
- **Message actions:**
  - A "…" handle, 26px, appears when you hover anywhere on the message (text, chips or the row underneath). It hides 400ms after you leave.
  - Clicking it slides out 26px icon buttons, away from the bubble (mirrored on user messages).
  - User messages: Copy, Edit, Reply, Pin, Remember.
  - Bot messages: Copy, Read aloud, Raw, Regenerate, Reply, Pin, Remember.
  - Icon-only buttons show a tooltip after 450ms.
- **Composer:** 48px high, radius 24, fill `rgba(field,.8)`, blur 10px. It has the input, a mic for calling, and a 36px white send button.
  - Above it: the reply chip ("↩ Replying to “…”"), and during calls the spoken-approval card.
- **Sending:** a small light "orb" flies along an arc from the composer to the target bot (1s, ease-in-out, with a trail). When it arrives it flashes the bot.

**Detail panels:** clicking a system replaces the chat with that system's panel, with "Back to chat". Panels are adapted from `BotSettingsDialog` sections; see spec §4. Notable ones:
- **Memory:**
  - A gauge that turns amber at 80% and red when lines stop loading.
  - Tabs: MEMORY.md, Topics, Daily log, Changes.
  - The edit-conflict banner.
- **Engine:** search, Suggested / All / Local, the busy lock, and the switch-with-Ask confirm.
- **Routines:** the overlap rule, a results thread, and run logs with search and filter.
- **Apps & MCP:** the MCP add/edit form (command or URL, write-only env and headers, Test, then Save switched off) and Paste config.
- **Computer:** "works on" choice and Take control → "You have the wheel…" → Hand control back.

### 4. Hubs
- **You hub:** click You. The camera flies to You (who grows to about 54px radius), and the app-settings systems orbit You: engines, connections/keys, remote & pairing, usage & budget, calendar, library, appearance/skins, people, workspaces & backups, system.
- **Team hubs:** click a team label. Team instructions, team computer, Chief, members, channels.
- **Behaviour:** the same orbit and detail-panel pattern as the bot view.

### 5. Shown items (new, spec §5.4)
**Offer pill**
- 32px high, with the bot's face and the text "Atlas wants to show you market-map.html", plus View and Later.
- It sits near the bot and points at it with a small arrow and a dotted leader line.
- It follows the viewport when the bot is off-screen. It avoids overlapping bots, labels, channels and the pills under You, and moves only when a clearly better spot appears.
- In the zoomed-in view it docks above the composer, and the chat shrinks to make room.
- Several offers stack.

**Shown item**
- A draggable canvas object (680 × 480 world units) next to the bot's team, with a line back to the bot.
- Header: the bot's face, "Atlas is showing you", the file name and a kind badge.
- Body: an HTML iframe, a paged PDF view, or a live computer screen with an agent cursor.
- A reply box that sends to that bot.

### 6. Onboarding and tour
**Welcome window** (the app window itself, 460 × 560)
- **Top:** traffic lights and "Skip tour" in the title bar. There's no title and no divider line.
- **Content (top-aligned; a long step scrolls inside):**
  - The green guide character on a 150px canvas, with a mood per step.
  - The step title, 22px/600.
  - The step content.
- **Footer (fixed):** Back on the left (steps 2+), progress dots in the centre (the active one is 18px wide, green `#3ee09a`), and the primary action on the right: a 34px white pill reading Continue / Next / Start chatting.
- **Steps:**
  - Hello: name field, and "Skip for now".
  - What your bots can do: six scenes. A row of six scene icons (36px circles) is the scene index, and each can be clicked.
  - Your engines: the engine list with Ready / Needs setup and Set up.
  - Permissions: microphone.
  - Your phone.
  - Meet your first bot: name, colour, and one standing instruction.
- **Finishing:** the window expands to full size, the new bot appears next to You, and the tour starts.

**Guided tour**
- A spotlight ring (2px `rgba(62,224,154,.9)`, radius 14) with `box-shadow: 0 0 0 9999px rgba(0,0,0,.42)` dims everything else.
- A 300px bubble shows the guide face, the step copy, "Step N of 8", Skip tour, and Next/Finish (green).
- Ring and bubble move between anchors over 350ms. Anchors inside a scrolled panel are scrolled into view first.
- **Steps:** the composer, the engine chip, COMPUTER (opens it), the works-on control, APPS & MCP (opens it), the Apps panel, ROUTINES (opens the calendar), the calendar, and done.

### 7. Empty, loading and error states
- **"Starting Orbit":** the guide (120px canvas, busy mood) and a checklist with states: harness, bots and threads, engines, computers.
- **"Set up an engine to start":** the guide in its thinking mood, with the engine install cards and "Check again". This adapts `NoEngines.tsx`.
- **"Your canvas is empty":** the guide in its happy mood, with New bot and Install a team.
- **Offline:**
  - Sends fail with Retry.
  - Creating a bot shows its error.
  - The update check shows "Couldn’t reach the update server." with Try again.
- **Panel loading and error states:** keep the existing copy from each section.

### 8. Overlays
- **⌘K palette:** the main navigation. It searches bots, threads, settings and actions ("Replay the welcome tour", "Check for updates", "Keyboard shortcuts", "About Orbit").
- **Keyboard shortcuts and About:** one dialog, opened with "?" or from ⌘K.
- **Update pill:** top centre.
- **Other overlays:** toasts (with Undo where the app has it), the confirm dialog, and the bottom sheets that host existing screens.

---

## Characters (canvas)
**Body**
- A particle sphere built from Fibonacci-distributed points, with levels of detail at 110 / 190 / 620 points.
- It rotates around its vertical axis with a 0.35 rad tilt. Particles are drawn in two passes, back then front, with a dark radial core between them: `rgba(10,10,12,.78→0)`.
- **Particle colour:** the bot colour mixed toward white by depth, up to 50%. Size is `(0.8 + depth×1.2) × R/23`. Alpha is `0.22 + 0.78×depth`, and the front pass is at 50%.
- **Halo:** a radial sprite at R×1.8 (R×2.5 when big), alpha .16 (.22 when big).
- **Breathing:** ±2.5%.

**Face**
- Glowing eyes (ellipses about 0.15R wide × 0.24R tall at ±0.3R, glowing in the bot colour) and a mouth line.
- Gaze shifts the face by up to 0.12R horizontally and 0.09R vertically.
- Blinks every 2.8–5.5s for 130ms.

**Moods**
| Mood | Face | Spin (rad/s) | Extra |
|---|---|---|---|
| idle | blink, smile | 0.32 | |
| focused | narrow eyes, flat mouth | 1.5 | band of dots around the orb |
| thinking | eyes up, "o" mouth | 1.1 | 3 thought dots |
| pleading | big eyes with highlights, raised brows, wobbly mouth | 0.2 | pulses amber |
| sending | happy arcs | | looks at the target |
| surprised | round eyes, "o" mouth | | |
| happy | arc eyes, big smile | | |
| talking | mouth animates | | |
| stalled | × eyes, frown | | red tint, jitter |
| sleepy | closed eyes | 0.12 | floating "z" |

**Receiving a message:** a spin boost of 4 rad/s decaying over 0.9s, a particle burst, and an expanding ring. The small guide canvases skip the ring.

**The same character everywhere:** each bot's character is drawn the same way in every place it appears: the map, chat headers, the "To" picker, pills, list rows and the tour bubble.

**Particle streams**
- 24 particles per stream. They are pulled toward the target (acceleration 1.15, damping 0.9) and drawn as short trails.
- The stream counts as delivered once 55% of its particles have arrived, or after 3.2s.
- Colours: handoffs in the sender's colour; results `#38d591`; asks `#ff9800`; failures `#ff5667`; approvals `#1084fe`.

**Performance and accessibility:** mini avatars redraw every third frame. There are quality tiers, and reduced motion must be supported.

---

## Interactions and behaviour (summary)
- **Hover:** hover states on every clickable canvas object. Tooltips on icon-only buttons after 450ms.
- **Drags:** a drag that starts on a pill under You still pans the map. A lost mouse-up ends the drag.
- **Esc:** backs out one level: overlay → panel → bot view → map.
- **Remember this:** posts a turn (spec §5.9). It shows "Remember this · “…”", then `memory_update · append`, then "Saved to memory". If memory is full, the bot tidies itself first and says so.
- **Unread:** a bot reply marks its thread unread unless you're viewing it. Opening the thread clears it.

## State (UI only; all data comes from the store)
- **Navigation:** `focus` (bot), `panel`, `hub`, `hubPanel`, the camera goal, the active thread per bot, the thread menu, and the palette.
- **Canvas layout:** team/bot offsets, positions of shown items, hidden-from-map. Persisted per spec §5.1.
- **Transient:** the offer queue, shown items, tray and hover state, the reply target, the pinned-message bar, the welcome and tour step, toasts, and confirm dialogs.
- **Everything else** comes from the existing store and API, per spec §4: bots, sections, engines, models, levels, memory, routines, runs, cards, threads, unread and notifications.

## Design tokens (prototype values; map them to the codebase's tokens)
**Skins** (`SkinPicker`): Midnight, Graphite, Foundry, Dusk, Atelier, Lagoon, Linen and Daylight. Midnight values: bg0 `#050506`, chrome `#0c0c0d`, stageA `#0d0d11`, ink `#fcfcfc`, line `255,255,255`, surf `18,18,20`, field `47,47,47`, accent `#1084fe`.

**Colours by role**
- Approve `#1084fe`; success `#38d591`; warning `#ff9800` (text `#ffb454`); danger `#ff5667` / `#e5484d` (text `#ff6b78` / `#ff8a96`).
- Full access: violet `rgba(178,150,255,*)`. Guide: green `#3ee09a`. You: pearl `rgb(232,235,244)`.
- Team colours (sample): research `#ff8a70`, eng `#3ee09a`, personal `#48c9ee`. Real bot and team colours come from the store.

**Type:** Inter 400/500/600 and JetBrains Mono 400/500, or the codebase's fonts.
- Sizes: 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 16, 17, 20, 22, 26.
- Mono kickers: 9.5–10px, letter-spacing .1em.

**Radius:**
- Pills: full.
- Chips: 12–13.
- Buttons: 14–18 (pill).
- Inputs: 9–10.
- Panels: 10–16.
- Window: 12.
- Dialogs: 16–20.

**Shadows:** popovers `0 20px 50px rgba(0,0,0,.55)`; dialogs `0 30px 70px rgba(0,0,0,.6)`.

**Motion:**
- Camera: exponential ease, 0.08 per frame.
- Panel and tour moves: 350ms `cubic-bezier(.3,.7,.2,1)`.
- Fades: 120–250ms.
- Line reveal: 380ms ease-out cubic, 40ms stagger.

## Assets
- **Icons:** Lucide (`lucide-static@0.469` in the prototype; use `lucide-react` in the codebase).
- **App logos:** the prototype loads them from `cdn.simpleicons.org`. Replace them with the app's own `ProviderIcons` and connector catalog icons (spec §3).
- **Images and characters:** there are no raster images. All characters are drawn procedurally on canvas.

## Files in this bundle
- `ORBIT-BUILD-SPEC.md`: **the implementation spec (start here)**.
- `OpenMausBot Orbit.dc.html`: the desktop prototype. It needs `support.js` beside it.
- `OpenMausBot Orbit Phone.dc.html`: the phone prototype (earlier iteration; spec §7, phase 5).
- `support.js`: the prototype runtime. It is only for viewing the prototypes.
- `ios-frame.jsx`: the device frame used by the phone prototype.
