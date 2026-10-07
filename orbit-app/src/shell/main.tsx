// The Orbit assistant's floating surfaces (electron/orbit-summon.mjs loads
// this page as ?surface=quick | talk | overlay | island).
import { lazy, StrictMode, Suspense, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { applySkin, readSkin } from "@/lib/skins";
import { applyFont, readFont } from "@/lib/fonts";
import { QuickBar } from "./QuickBar";
import { TalkSurface } from "./TalkSurface";
import { Overlay } from "./Overlay";
import "../styles.css";
import "./shell.css";

// Loaded only in the island's window: it reads shared pages (artifacts.ts),
// which the other surfaces never need.
const IslandSurface = lazy(() => import("./IslandSurface").then((module) => ({ default: module.IslandSurface })));

applySkin(readSkin());
applyFont(readFont());

const surface = new URLSearchParams(location.search).get("surface");
const views: Record<string, () => ReactNode> = {
  quick: () => <QuickBar />,
  talk: () => <TalkSurface />,
  overlay: () => <Overlay />,
  // Solar's Alt+J island (main makes this window only in the Solar build)
  island: () => <Suspense fallback={null}><IslandSurface /></Suspense>,
};
const view = views[surface ?? ""];
if (view) createRoot(document.getElementById("root")!).render(<StrictMode>{view()}</StrictMode>);
