// Who owns the one speech-recognition session (electron/speech.mjs).
//
// The Swift helper runs one session at a time, and several windows use it:
// the main window's composer and calls, and the shell's talk character. A
// window may only stop or finish the session it started, and a window whose
// session is taken by another start is told so (`speech:end`, reason
// "preempted") so its UI does not wait forever on a helper that is no
// longer listening for it.
//
// Electron-free: `owner` is any object (main passes the BrowserWindow) and
// `notify(owner, info)` delivers the `speech:end` payload.

/**
 * `launch(owner, options, session)` starts the helper and returns
 * `{ stop(), finish() }`, or null when it could not start (it reports that
 * to `owner` itself). While it runs it asks `session.current()` before
 * delivering anything, and calls `session.release()` when the helper ends
 * on its own.
 */
export function createSpeechOwner({ launch, notify }) {
  let active = null; // { owner, handle }

  function take() {
    const previous = active;
    active = null;
    if (previous) {
      try {
        previous.handle?.stop();
      } catch {}
    }
    return previous;
  }

  return {
    owner: () => active?.owner ?? null,
    /** Start a session for `owner`, ending any other one first. */
    start(owner, options) {
      const previous = take();
      if (previous && previous.owner !== owner) notify(previous.owner, { code: 1, reason: "preempted" });
      const entry = { owner, handle: null };
      active = entry;
      const session = {
        current: () => active === entry,
        release: () => {
          if (active === entry) active = null;
        },
      };
      const handle = launch(owner, options, session);
      if (!handle) session.release();
      else entry.handle = handle;
      return Boolean(handle) && active === entry;
    },
    /** Stop `owner`'s session; a window cannot stop someone else's. */
    stop(owner) {
      if (!active || active.owner !== owner) return false;
      take();
      return true;
    },
    /** Finish `owner`'s session (push-to-talk release): it keeps ownership
     * until the recognizer's final transcript arrives. */
    finish(owner) {
      if (!active || active.owner !== owner) return false;
      try {
        active.handle?.finish();
      } catch {}
      return true;
    },
    /** A window going away: end its session without telling anyone. */
    release(owner) {
      if (!active || active.owner !== owner) return false;
      take();
      return true;
    },
  };
}
