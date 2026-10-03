// Tool bubbles on the canvas draw a Lucide glyph for the running tool
// (design: TOOLS → icon). The icon is rendered once per tool kind and colour
// into an <img>, so the frame loop only calls drawImage.

import { createElement, type ComponentType } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import {
  AppWindow, Brain, FilePen, FileText, Globe, ListChecks, Monitor, Plug, Search, Smartphone, SquareTerminal, Users, Wrench,
  type LucideProps,
} from "lucide-react";

type Kind = "shell" | "read" | "write" | "search" | "web" | "browser" | "plan" | "delegate" | "computer" | "phone" | "memory" | "app" | "tool";

const ICON: Record<Kind, ComponentType<LucideProps>> = {
  shell: SquareTerminal, read: FileText, write: FilePen, search: Search, web: Globe, browser: AppWindow,
  plan: ListChecks, delegate: Users, computer: Monitor, phone: Smartphone, memory: Brain, app: Plug, tool: Wrench,
};

/** The kind of a tool call, from its name as the engine reports it. */
export function toolKind(tool: string): Kind {
  const n = tool.toLowerCase();
  if (/android|phone|adb/.test(n)) return "phone";
  if (/computer|screenshot|cua|mouse|click|keyboard|desktop/.test(n)) return "computer";
  if (/browser|playwright|navigate|chrome/.test(n)) return "browser";
  if (/websearch|web_search|webfetch|web_fetch|fetch|http/.test(n)) return "web";
  if (/memory|remember/.test(n)) return "memory";
  if (/ask_bot|delegate|agent|task\b|subagent/.test(n)) return "delegate";
  if (/todo|plan/.test(n)) return "plan";
  if (/bash|shell|exec|terminal|command/.test(n)) return "shell";
  if (/grep|glob|search|find|list/.test(n)) return "search";
  if (/write|edit|patch|replace|create/.test(n)) return "write";
  if (/read|view|cat|open/.test(n)) return "read";
  if (n.startsWith("mcp__")) return "app";
  return "tool";
}

const cache = new Map<string, HTMLImageElement>();

export function toolIcon(tool: string, color: string): HTMLImageElement | null {
  if (typeof document === "undefined") return null;
  const kind = toolKind(tool);
  const key = `${kind}|${color}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const host = document.createElement("div");
  const root = createRoot(host);
  flushSync(() => root.render(createElement(ICON[kind], { size: 48, color, strokeWidth: 2 })));
  const svg = host.innerHTML;
  root.unmount();
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  cache.set(key, img);
  return img;
}
