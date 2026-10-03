// Decides what first run looks like for whoever opened the app. The desktop
// app's own window is the owner of its own server and gets the welcome flow
// exactly as before, without waiting on anything new. Any other page (a
// browser, or a hosted workspace the desktop app opened with its reduced
// bridge) asks its server who it is first. A hosted workspace's admin gets
// the hosted beats and a hosted member a quiet note. A session that cannot
// save the workspace config is never shown a tour it could not finish.
import { useEffect, useState } from "react";
import { emailGateDone } from "@/lib/email-gate";
import { hostedMember, LOCAL_VIEWER, welcomeDue, welcomeViewer, type BeatId, type WelcomeViewer } from "@/lib/onboarding";
import { api, useStore } from "@/state/store";
import { SharedWorkspaceHint } from "./SharedWorkspaceHint";
import { WelcomeFlow } from "./WelcomeFlow";
import { restartGuidedTour } from "./GuidedTour";

/** Only the desktop app's own pages get the full bridge; `remoteClient` is
 * part of it. A remote page the desktop app loads (Server → Connect hosted
 * workspace…) gets a reduced, still truthy `window.ogb` without it, and is
 * no more the owner than a browser is. */
export function localDesktopPage(): boolean {
  return window.ogb?.remoteClient !== undefined;
}

/** Null while the answer is on its way. The desktop app's own page knows at
 * once: its own server's owner, or a remote client, which never gets a
 * first-run surface anyway. A failed answer keeps the old behaviour. */
export function useWelcomeViewer(): WelcomeViewer | null {
  const local = localDesktopPage();
  const [viewer, setViewer] = useState<WelcomeViewer | null>(local ? LOCAL_VIEWER : null);
  useEffect(() => {
    if (local) return;
    let active = true;
    void api("/api/auth/session", { timeoutMs: 10_000 })
      .then((session) => {
        if (active) setViewer(welcomeViewer(session));
      })
      .catch(() => {
        if (active) setViewer(LOCAL_VIEWER);
      });
    return () => {
      active = false;
    };
  }, [local]);
  return viewer;
}

/** Opens the welcome flow on a fresh workspace (the server's onboarding
 * record says so) or on request from Settings. The decision waits for the
 * config to arrive, so a returning user never sees the tour flash. */
export function WelcomeGate({ viewer }: { viewer: WelcomeViewer | null }) {
  const { state, dispatch } = useStore();
  const [dismissed, setDismissed] = useState(false);
  // Set when the engines beat's organisation row opened Settings, so closing
  // Settings brings the person back to that beat rather than the greeting.
  const [resumeAt, setResumeAt] = useState<BeatId | undefined>(undefined);
  const remoteClient = window.ogb?.remoteClient?.active === true;
  if (!viewer) return null;
  // Only a hosted workspace is a team's by definition. Elsewhere a session
  // without admin scope is often the owner's own phone or browser, so it
  // gets no new note: the tour it cannot save simply does not open itself.
  if (hostedMember(viewer)) {
    return remoteClient ? null : (
      <SharedWorkspaceHint
        replay={state.welcomeOpen}
        onClose={() => {
          if (state.welcomeOpen) dispatch({ type: "toggleWelcome", open: false });
        }}
      />
    );
  }
  const due =
    !dismissed &&
    welcomeDue(state.config, {
      remoteClient,
      legacyDone: emailGateDone(),
      hosted: viewer.hosted,
      canSave: viewer.canSave,
    });
  // Settings asked for explicitly (the native Preferences menu, ⌘K, a
  // connection link) live in Orbit's column, under this window: step aside
  // while they are open. Closing Settings resumes the welcome where it was.
  if (state.appSettingsOpen) return null;
  if (!state.welcomeOpen && !due) return null;
  // the Orbit agent is part of the app; the welcome sets up the first bot of their own
  const bot = state.bots.find((b) => !b.hidden && b.system !== "orbit") ?? null;
  const replay = state.welcomeOpen && !due;
  return (
    <WelcomeFlow
      bot={bot}
      replay={replay}
      hosted={viewer.hosted}
      initialBeat={resumeAt}
      onOpenOrganisation={() => {
        setResumeAt("engines");
        dispatch({ type: "toggleAppSettings", open: true, section: "organization" });
      }}
      onDone={() => {
        setDismissed(true);
        setResumeAt(undefined);
        dispatch({ type: "toggleWelcome", open: false });
        // the welcome always hands over to the guided tour (design: wfFinish);
        // a replay runs it again from the start
        if (replay) void restartGuidedTour(state.config, dispatch);
        else dispatch({ type: "toggleTour", open: true });
      }}
    />
  );
}
