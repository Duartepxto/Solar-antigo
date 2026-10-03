// The Orbit assistant's floating surfaces (electron/orbit-summon.mjs loads
// this page as ?surface=quick | talk | overlay).
import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { applySkin, readSkin } from "@/lib/skins";
import { applyFont, readFont } from "@/lib/fonts";
import { QuickBar } from "./QuickBar";
import { TalkSurface } from "./TalkSurface";
import { Overlay } from "./Overlay";
import "../styles.css";
import "./shell.css";

applySkin(readSkin());
applyFont(readFont());

const surface = new URLSearchParams(location.search).get("surface");
const views: Record<string, () => ReactNode> = {
  quick: () => <QuickBar />,
  talk: () => <TalkSurface />,
  overlay: () => <Overlay />,
};
const view = views[surface ?? ""];
if (view) createRoot(document.getElementById("root")!).render(<StrictMode>{view()}</StrictMode>);
