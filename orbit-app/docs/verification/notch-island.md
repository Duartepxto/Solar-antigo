# Talk mode's island in the notch

Talk mode's island (`src/shell/TalkSurface.tsx`, the `island-*.ts` modules
beside it) is the talk window's page. It is only for hearing and answering:
no team status, no hover peek. Its sizes, springs and pointer rule are pure
and unit-tested:

```sh
pnpm exec vitest run src/shell/island.test.ts src/shell/island-live.test.ts src/shell/orbit-client.test.ts
node --test electron/orbit-island.node-test.mjs electron/orbit-shell.node-test.mjs electron/orbit-shell-preload.node-test.mjs electron/orbit-shell-windows.node-test.mjs
```

The Electron tests drive `createOrbitSummon` with a fake Electron and the
owner's desk (the LG as the main display, the MacBook with its notch to its
left and lower), with the pointer watch's clock run by hand: nothing of the
island exists or polls at start, and pointing at the top edge does nothing;
⌥T makes the window on the display under the pointer (over the laptop's
real notch, or a virtual one on the LG), shown and click-through, one level
above the screen's border; the talk ending hides it and the next ⌥T shows the
same window where the person is then; a stale dismiss racing a summon is
ignored; while talk is shown main says when the pointer is over the island
(virtual notch on the main display, real notch on the laptop at y 98),
polling at 60 Hz only near the top edge and 4 Hz elsewhere, and the watch
stops once the window hides. Windows and Linux never get a talk window.

`src/shell/island-live.test.ts` covers the page's side: main's pointer watch
and forwarded moves decide once each whether the island takes the mouse
(the newest wins, so a stale forwarded point can't hold it), never at rest;
and the character's loop draws one still frame and no animation frames when
it isn't live.

## The page, headless

```sh
pnpm exec vitest run scripts/testing/orbit-island-ui.e2e.test.ts
```

It mounts the page (`scripts/testing/island-preview.tsx`) in the pinned
headless Chrome with the Electron bridge replaced by a recorder and the
Mac's voice by a stand-in, and serves a scripted Orbit beside it (its agent,
`/api/events`, the message route). No server runs and no app data is read.
It proves, with sizes read from the page:

- at rest the island is a virtual notch that draws nothing, and nothing runs
  (no animation frame, no timer, over two seconds);
- main's pointer watch and a mouse move over the top edge without a summon
  peek nothing, take no click and ask the server for nothing;
- ⌥T over a 185 × 32 notch grows it to the notch plus two 44-pt ears,
  listening, with the face animating; the words it hears open it 640 wide;
- once the question is sent (`surface: "talk"`) it tucks into the notch
  while Orbit thinks, and still takes the click that would stop the turn;
- the answer brings it out to speak; about 2.5 s after the voice ends it
  shrinks into the notch and asks main to hide the window, and nothing runs;
- no thread is read and no card answered: no team status is ever fetched.

Screenshots land in `.orbit-scratch/verify-evidence/orbit-island/`.

This checks the page, not the real window over the menu bar. macOS forwards
no mouse moves to the click-through panel over the notch (seen on the
owner's Mac), which is why main watches the pointer while talk is shown;
that a click on the tucked-in island stops the turn over a real notch is
only seen in the packaged app.
