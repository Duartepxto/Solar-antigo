// Talk mode's island page (src/shell/TalkSurface.tsx) in a plain browser, for
// the island's headless check (orbit-island-ui.e2e.test.ts). The Electron
// bridge is replaced by a recorder that keeps what the page asked main to do
// in window.__island; main's inputs (a ⌥T over a notch, the words heard, the
// end, its pointer watch) are in window.__talk for the check to play. The
// Mac's voice is a stand-in that "speaks" for a moment and records what it
// said.
import { createRoot } from "react-dom/client";
import { TalkSurface } from "../../src/shell/TalkSurface";
import "../../src/styles.css";
import "../../src/shell/shell.css";

const record = {
  interactive: [] as boolean[],
  talkState: [] as string[],
  look: [] as unknown[],
  dismissed: 0,
  spoken: [] as string[],
};
const noop = () => () => {};
// what runs while the island rests: every frame and timer the page asks for
const load = { frames: 0, timers: 0 };
const frame = window.requestAnimationFrame.bind(window);
window.requestAnimationFrame = (cb) => { load.frames += 1; return frame(cb); };
const timeout = window.setTimeout.bind(window);
window.setTimeout = ((cb: TimerHandler, ms?: number, ...rest: unknown[]) => { load.timers += 1; return timeout(cb, ms, ...rest); }) as typeof window.setTimeout;
const interval = window.setInterval.bind(window);
window.setInterval = ((cb: TimerHandler, ms?: number, ...rest: unknown[]) => { load.timers += 1; return interval(cb, ms, ...rest); }) as typeof window.setInterval;
const talk: Record<string, ((value: unknown) => void) | null> = { summon: null, transcript: null, end: null, hover: null };
const keep = (name: string) => (cb: (value: unknown) => void) => { talk[name] = cb; return () => {}; };
// the Mac's own voice (the fallback with no voice provider set up)
const synth = {
  speak: (utterance: SpeechSynthesisUtterance) => {
    record.spoken.push(utterance.text);
    timeout(() => utterance.onend?.(new Event("end") as SpeechSynthesisEvent), 1_200);
  },
  cancel: () => {},
  getVoices: () => [],
};
Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });
Object.assign(window, {
  __island: record,
  __load: load,
  __talk: talk,
  ogb: {
    onSpeechTranscript: keep("transcript"),
    onSpeechEnd: keep("end"),
    speechStart: async () => {},
    speechStop: async () => {},
    speechFinish: async () => {},
    orbitShell: {
      onVisibility: (cb: (visible: boolean) => void) => { cb(true); return () => {}; },
      talkInteractive: async (on: boolean) => { record.interactive.push(on); },
      islandLook: async (look: unknown) => { record.look.push(look); },
      onIslandHover: keep("hover"),
      talkState: async (phase: string) => { record.talkState.push(phase); },
      talkDismiss: async () => { record.dismissed += 1; },
      talkSummon: async () => {},
      screenHeld: async () => {},
      point: async () => false,
      onTalkSummon: keep("summon"),
      onTalkCapture: noop,
      onTalkToggle: noop,
    },
  },
});
document.body.style.cssText = "margin:0;width:720px;height:320px;background:#56708a";
document.getElementById("root")!.style.cssText = "width:720px;height:320px";
createRoot(document.getElementById("root")!).render(<TalkSurface />);
