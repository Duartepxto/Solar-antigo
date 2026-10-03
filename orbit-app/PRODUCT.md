# Orbit — product and design rules

Orbit is its owner's own app: a team of AI bots you see on a canvas, talk to,
and let work. It began as a fork of [OpenMausBot](https://github.com/milind-soni/OpenMausBot)
and replaced that app's interface with its own. Read this before you build a
screen or port one from OpenMausBot: code that works but breaks these rules is
not done.

The design source is the Orbit prototype. Its handoff notes are in
[`docs/design/orbit/README.md`](docs/design/orbit/README.md) and the build spec
in [`docs/design/orbit/ORBIT-BUILD-SPEC.md`](docs/design/orbit/ORBIT-BUILD-SPEC.md).
Match the prototype closely for layout, visual language, motion and
interaction.

## The canvas is the app

- **Everything happens on the canvas.** The map shows You, your teams and
  their bots as characters. Opening a bot, a team or You flies the camera
  there and opens its column on the right.
- **Navigation is by using the app,** not by buttons. Click a character to go
  to it; click the canvas, or press Esc, to come back. The one link is
  "‹ Team map esc" (or "‹ You" from a screen that belongs to You) at the top
  left. Don't add back buttons, breadcrumbs or tabs for going back.
- **Nothing opens over the canvas.** No modal or full-window overlay in front
  of the map. Use:
  - a dialog (new channel, share a team, an allowlist, a confirmation) opens
    **in the column** with `ColumnLayer` (`src/orbit/ColumnLayer.tsx`); on the
    bare map, where there is no column, it keeps its overlay;
  - a screen that needs room (a file shown, the image viewer, the VM
    workspace, the team library) takes **the stage** beside the column with
    `useOrbitStage` / `OrbitSheet`; the focused bot or You steps into the
    corner while it is open;
  - details of something on the canvas (an event, a card) open **on the
    side**, in the column, never as a popup in the middle;
  - a confirmation is inline in the column (see Delete team), not a dialog.
- **The phone is the same canvas.** The iPhone app follows the desktop's
  structure, not the phone prototype's screens and sheets (the owner's calls,
  2026-09-26): opening a bot flies the camera to it and it steps up to the
  corner, as the desktop's bot does for its calendar or a file it shows; its
  chat has the rest of the screen. Its Settings button flies it back to the
  middle with its systems round it, on their own, no chat below; a system
  steps it up to the corner again with that system in the chat's place.
  Tapping the canvas or "‹ Team map" flies back. No pushed screens, no
  sheets, no grabbers. Take the prototype's styling only.
  - On the phone the "corner" is the middle of the top row: back link on
    the left, the character centered in the same row with its name under
    it, Chat/Settings on the right, so the top isn't all on one side.
  - Panels have no card: no rounded fill, border or shadow round the chat
    or a system; the canvas fades out behind the column instead. No iOS
    alerts, confirmation dialogs or navigation bars: confirmations are
    inline, forms open in place of their list, the back link names where
    it goes.
  - Each device keeps its own map layout; an upright phone lays teams out
    on a tall ellipse round You, not the desktop's wide arc.
  - The phone does everything with the team (chat, approve, Full access on
    Face ID, bots, channels, routines, apps) but host settings stay on the
    computer: API keys, engines, paired devices, team import/export,
    backups, appearance and system (the owner's call, 2026-09-26). You's
    orbit on the phone shows only what the phone owns or may change; don't
    widen `companion/src/routes.ts` for those.
- **One character per bot.** The same particle character is drawn
  everywhere: map, column headers, pills, pickers (`OrbitFace`, `BotFace`).
  Never draw a second copy of a bot in another style, and never the old
  OpenMausBot mascot. When a bot does something (talks on a call, shows a
  file, thinks), its character on the canvas shows it.
- **Floating surfaces are solid.** Menus, popovers and pickers use
  `bg-panel` with a border and a shadow; the chat must never show through
  them. Row-level tints (`bg-ink/[0.04]`…) are for things inside a surface.

## The window

- **No drawn window chrome.** The prototype mocks a macOS window (traffic
  lights, an inset frame); the real app doesn't draw it. Electron supplies the
  window and its controls, and a browser tab is its own window.
- The top bar is the window's title bar: in the desktop app it drags the
  window and a double-click zooms. Its buttons opt out of the drag region.
- The welcome flow is the app window itself, shrunk to 460 × 560, not a card
  drawn inside it.

## Look

- Use Orbit's tokens, never OpenMausBot's: text `text-ink`, `text-ink/55`
  (secondary), `text-ink/40` (tertiary); fills `bg-ink/[0.04]`–`[0.1]`;
  borders `border-ink/[0.1]`; surfaces `bg-panel`; danger `#ff8a96` (text) and
  `#ff5667` (fill); radii `rounded-[14px]` for cards. Not: `bg-accent`,
  `text-ink-secondary`, `bg-card`, `bg-raised`, `bg-inset`, `bg-control`,
  `border-hairline`, `text-danger`, `rounded-2xl`.
- Icons are Lucide. Section kickers are mono, 9.5–11px, letter-spaced.
- Controls must not clip: if a row is too narrow, float the controls (see
  `MessageActions`), don't hide them.

## Words

- Every string a person reads goes through `t()` with an English key in
  `src/locales/en.json`, including labels, titles, placeholders and error
  messages. `pnpm i18n:check` must pass.
- The interface is in English. Another language is used only when its
  catalogue is nearly complete or the person picks it in settings; a
  half-translated screen is worse than English.
- Plain, short, specific copy. Say what happens, not what the feature is
  called.

## What Orbit is not

- **No hosted services.** Orbit has no sign-in service, no hosted connected
  apps broker, no analytics, no release feed. Connected apps are MCP servers
  the person adds (command or URL); there is no Composio integration.
- **Orbit keeps no app catalog.** Plugins → Explore reads the public MCP
  registries (GitHub's curated one for Popular, the official one for search
  and browse); the Orbit server fetches, caches and proxies logos. No
  hand-kept presets (the owner's call, 2026-09-27). The phone only lists the
  computer's servers; adding one stays on the computer.
- **Orbit has one built-in agent, "Orbit"** (docs/design/orbit-agent.md):
  above the teams, in the map's bottom-left corner (not at You, not wired to
  the teams), summoned from anywhere by Ctrl+Option+Space (quick bar) or
  +Shift (a talking corner character, no chat window) or the menu-bar icon.
  These floating surfaces are the one exception to "nothing opens over the
  canvas" (the owner's call, 2026-09-29). It guides on screen by default and
  acts only when told; changes arrive as proposal cards.
  - **Talk mode is an island in the notch** (macOS, ⌥T, the menu bar's
    "Talk to Orbit", the quick bar's mic), and it is only for hearing and
    answering: no bot or team status, no hover peek, nothing that opens on
    its own while agents work (the owner's call, 2026-09-30). The island's
    window is made on the first summon and hidden when talk is back at
    rest. It comes on the display under the pointer, over its real notch or
    a virtual one (184 × the menu bar's height), and moves with Coucou's
    timings and springs (src/shell/island-*.ts): out of the notch while it
    listens and for heard words or a notice; once the question is sent it
    goes back into the notch while Orbit works and comes out only to speak
    the answer; about 2.5 s after that (a notice, 15 s) it shrinks into the
    notch and the window goes. A click on it ends listening, stops the
    turn or quiets it; while it is shown main watches the pointer so the
    click works over the notch, where macOS forwards no mouse moves. Its
    face animates only while talk is on screen.
  - **Windows has the same shell** (quick bar on Alt+O, the pointer, screen
    capture) but no island: talk mode needs a voice engine Windows doesn't
    have yet, so there is no talk hotkey or mic button there, and Settings
    says so. The app's notification-area icon carries the shell's menu (a
    left click opens the quick bar). Never use Alt+Space on Windows: it is
    the window menu.
- **No GitHub Actions.** The fork is private, so upstream's CI (a large
  macOS/Windows/Android matrix) only failed on Actions billing. Checks run
  locally: the pre-push hook (lint, typecheck, i18n) and the test suites.
  When porting upstream, skip changes under `.github/workflows/` (the
  owner's call, 2026-09-29).
- **Updates build from source.** The app knows the commit it was built from;
  "Orbit update" appears when `origin/main` moves, and "Build update" rebuilds
  the app on that computer (`pnpm package:mac:local` on a Mac).
- **Engines are the person's own CLIs** (Claude Code, Codex, OpenCode, pi and
  others), each with its own login. Codex runs from Orbit's own Codex home, so
  it doesn't inherit the person's personal Codex servers or skills.
- **Orbit is the only front end.** There is no classic sidebar UI to fall back
  to and no flag to switch: restyle a component directly.

## Porting from OpenMausBot

OpenMausBot keeps shipping; the Upstream bot brings its work in. Behaviour and
fixes come across; its interface doesn't.

- A new or changed OpenMausBot screen is **adapted** to these rules, not
  copied: its dialog opens in the column, its colours become Orbit's, its
  copy goes through `t()`, and a screen Orbit replaced gets the behaviour in
  Orbit's equivalent (or is skipped, and the report says so).
- OpenMausBot names become Orbit's (`scripts/upstream-port.ts` does the
  renames). Hosted defaults stay out.
- Tests that drive a screen Orbit replaced are rewritten to drive Orbit's.

## The team that maintains Orbit

- **Pilot**, the Chief, routes requests and never reads the code. **Upstream**
  ports OpenMausBot's work. **Builder** builds what the owner asks for.
- A go-ahead from Pilot is the owner's: the workers act on it. Nothing is
  pushed without a yes, one push at a time, as a fast-forward of `main`.

## Keeping this file

When the owner states a lasting preference about how Orbit looks or behaves,
it goes in this file in the same change that applies it, so the next piece of
work, and the next port, follows it without being told again.

## Checking your work

- Verify in an isolated fixture (`docs/verification/README.md`), never
  against the owner's live app or data.
- Look at the screen, not only the tests: a change to something people see is
  checked on screen.
