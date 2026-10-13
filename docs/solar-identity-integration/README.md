# Solar identity and onboarding integration

Prepared in the isolated branch `codex/solar-identity-intro` on 10 October 2026. The original checkout and its concurrent backend/Android work were not modified. This is application code, not a generated mockup.

## Selected direction

The approved gold icon is used as supplied in `approved-icon-source.png`. Its SHA-256 is `f1f6ad0743a498a21a6e1a1f7106b5383ae487ab966e5632cf0a93ac2fcba848`; it matches the original `docs/solar-refinement-2026-10-10/logo-professional-vivid-gold.png` byte for byte. Icon files are mechanical size/format exports of this source. `approved-intro-reference.png` is the selected visual reference.

The new compact Solar welcome frame uses neutral dark surfaces, local Manrope, left-aligned text, champagne/gold actions, subtle illuminated hover feedback and short entrance transitions. The welcome guide uses the exact tilted Sun artwork from the approved image. Vector clips separate its body, eyes and surrounding fragments; a small bounded gaze follows the mouse, and the original fragments drift gently. Reduced-motion preferences disable transitions, gaze motion and ambient animation.

## Implemented

- Approved icon in the web favicon, Solar header, Electron resource and multi-resolution Windows ICO. The Solar build no longer overwrites it with the old procedural icon.
- Android launcher PNGs for all five densities, plus an adaptive foreground with safe insets. No monochrome variant is added in this iteration.
- All six current onboarding steps: welcome, three-scene product introduction, engines, voice permissions, optional phone setup and first agent. Hosted step counts still follow the existing flow.
- Existing onboarding controllers, persistence, focus handling, native window sizing and save/error behavior retained. Name and agent configuration use the real forms.
- Phone intro uses one primary action and a separate optional skip. Existing pairing states inherit the gold primary styling. No pairing/authentication controller behavior is redesigned.
- The follow-up spotlight tour uses the same awake Sun and gold controls/highlight.
- New copy uses existing English and Portuguese catalogs with matching source hashes. Other brands retain their original welcome frame.
- Development-only `onboarding-preview.html?window=1` presents the real flow without the gallery toolbar. Vite fixture cache stays inside the worktree rather than the shared dependency junction.

## Validation

- TypeScript project build passed.
- Solar production Vite build passed with `VITE_JARVIS_SOLAR=true`. Existing large-chunk warnings remain.
- Locale validation passed: 4251 English strings; Portuguese catalog 100%.
- Lint passed for the changed TypeScript/TSX files.
- 13 targeted test files, 118 tests passed, including three new phone intro tests covering primary/skip separation and disabled states.
- Main application fixture: approved header icon loaded at 30px; skipping onboarding dismissed the real welcome flow and returned to the existing planet map.
- Browser checks in an isolated disposable fixture: all six steps, all three reel scenes, forward/back navigation, profile name retained on return, keyboard focus trap, phone optional skip and visible agent-save failure handling.
- At 320 x 568: no horizontal overflow and footer inside the viewport. At 390 x 480: body scrolls and footer remains visible. Reduced-motion mode reports no step animation.
- PNG dimensions, seven ICO sizes and Android adaptive-icon XML validated. Approved source checksum verified.

Screenshots of the real UI are in `evidence/`. The preview intentionally uses an invalid bot id: its final save shows an error instead of writing a real agent. It is suitable for visual review, not for verifying successful native completion.

Native microphone permission, provider sign-in, real device pairing, installed Windows application/installer and an Android build/device have not been exercised. These remain integration checks after the backend work is ready. No installed application was replaced.

## Review locally

From this isolated checkout, run PowerShell:

```powershell
$env:CHATGPT3_UI_PORT='5224'
node --experimental-strip-types chatgpt-3.0/run.mjs --fixture
```

Open `http://127.0.0.1:5224/onboarding-preview.html?window=1&beat=hello&skin=midnight&reduced=0` for the real welcome flow, or omit `window=1` for the existing step gallery. Fixture data is disposable and separate from the user's app.

This worktree currently reuses the original installed dependencies through a node_modules junction. On a separate machine, install dependencies normally. Its Vite cache is local to this checkout.

## Integrate after backend completion

The branch contains an initial baseline followed by the identity implementation and its visual refinement. The first, `ddad64a927a76d71c84daa0eccb883265e86e103`, only snapshots the original pre-existing profile correction as a baseline. Do not cherry-pick that baseline separately.

Review and integrate all design commits after that baseline: **Apply Solar identity and compact onboarding design**, followed by **Complete the welcome Sun composition** **Animate the exact approved welcome artwork**, and **Align approved Sun motion with Solar**. The design-only range is `ddad64a..codex/solar-identity-intro`; omit the baseline itself. Merge into the backend branch once that chat has finished; preserve newer backend changes and the original profile correction. Likely overlap areas are WelcomeFlow, PhoneSetupFlow, the locale catalogs/source hashes and Android icon XML. Rerun frontend validation and then native Windows/Android checks in the combined branch.

The 21st CLI design-context step was rejected by automatic approval review because it could transmit local design context externally. Work continued using existing local components and the already-approved references; no external generation is required for this implementation.

## Exact approved artwork with animation

The latest guide uses the original first-panel Sun from `approved-intro-reference.png`, including its three-quarter view, facial features, block shapes, lighting and colours. `public/solar/brand/welcome-approved-art.png` is a byte-for-byte copy, verified by a test. The bitmap is not regenerated or redrawn. `solar-approved-art.json` describes vector clipping paths over that source; no edited bitmap is used.

`SolarApprovedArt.tsx` splits the original into the body, two eyes and thirteen detached particles. The eyes use Solar's native normalized gaze response, bounded to approximately 5.07 source pixels horizontally and 3.9 vertically, with time-based easing towards mouse position. Tiny backing patches come from the same artwork and cover the resting eye locations during gaze motion. The body floats only two source pixels. Twenty local blocks clipped from the same artwork lift and flow around the surface; the thirteen detached particles circulate on a tilted orbit with radial bounce, changing scale and opacity for depth. The eyes blink using Solar's existing `solarFaceEyeOpen` behavior, on the native 5.3-second cadence. The original viewpoint remains fixed. The compact spotlight guide uses this same artwork.

Pointer tracking ignores touch, pauses for hidden windows, and resets on pointer exit, blur or reduced-motion changes. Reduced-motion mode renders the original resting composition with no body, eye or particle motion. Listeners and pending animation frames are cleaned up on unmount.

The rejected 3D approximation's renderer/material/atlas changes were removed. The main map keeps its existing renderer and state behavior. The approved app icon remains unchanged.

Latest validation: seven tests in three files passed, covering source-image identity, bounded gaze, invalid coordinates, existing portrait layout and phone intro behavior. TypeScript, lint and the Solar production build passed. In the browser, gaze changed from positive to negative when the pointer moved across the Sun; thirteen original fragments animate. Reduced-motion mode showed no animations and an identity eye transform. At 320px, there was no horizontal overflow and the footer remained inside the viewport. Updated proof is in `evidence/approved-art-*.png`. Native integration checks remain as stated above.

## Solar movement comparison and validation

Compared the running Solar map and its renderer before refining motion. The guide keeps the selected original viewpoint and pixels; the native gaze equation, smoothing, blink timing and circulating/breathing particle language inform its animation. Surface flow is a layered illusion using the same image, not a newly generated Sun or a claim of a reconstructed 3D mesh.

Latest checks: six tests across the artwork/gaze/orbit and native face suites passed. TypeScript, lint and the Solar production build passed. Browser inspection confirmed stronger gaze in both directions (approximately +3.97 and -4.64 source pixels), twenty surface layers moving independently, outer particles changing position continuously, and no console errors. Reduced-motion mode restores a neutral gaze, fully open eyes and no particle transforms or body animation. The frame loop stops for hidden documents and is cancelled on unmount. Evidence: `solar-motion-final.png` and `solar-motion-right.png`.
