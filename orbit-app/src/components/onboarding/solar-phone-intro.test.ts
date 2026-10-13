import { Children, createElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PhoneSetupFlowView } from "@/components/PhoneSetupFlow";
import { setLocale, t } from "@/lib/i18n";
import { PrimaryButton } from "./beats/shared";

type Controller = Parameters<typeof PhoneSetupFlowView>[0]["controller"];
type Node = ReactElement<{ children?: ReactNode; onClick?: () => void; disabled?: boolean }>;
function nodes(value: ReactNode): Node[] {
  if (!isValidElement(value)) return [];
  const node = value as Node;
  return [node, ...Children.toArray(node.props.children).flatMap(nodes)];
}
function render(busy = false, connected = true) {
  const start = vi.fn(), skip = vi.fn(), onSkip = vi.fn();
  const controller = {
    phase: "intro", account: null, accountError: null, email: "", pairingLink: "",
    state: connected ? { devices: [] } : null, busy, accountBusy: false,
    error: null, start, skip,
  } as unknown as Controller;
  let tree: ReactNode = null;
  function Capture() {
    tree = PhoneSetupFlowView({ controller, variant: "onboarding", compactHeader: true, onSkip });
    return tree;
  }
  const html = renderToStaticMarkup(createElement(Capture));
  return { html, tree, start, skip, onSkip };
}
beforeEach(() => { vi.stubEnv("VITE_JARVIS_SOLAR", "true"); setLocale("en"); });
afterEach(() => vi.unstubAllEnvs());

describe("Solar phone introduction", () => {
  it("pairs from the single primary action instead of accidentally skipping", () => {
    const view = render();
    const primary = nodes(view.tree).filter(node => node.type === PrimaryButton);
    expect(primary).toHaveLength(1);
    expect(view.html).toContain(t("phone.intro.setUp"));
    expect(view.html).not.toContain(t("onboarding.continue"));
    primary[0]!.props.onClick!();
    expect(view.start).toHaveBeenCalledOnce();
    expect(view.skip).not.toHaveBeenCalled();
    expect(view.onSkip).not.toHaveBeenCalled();
  });
  it("keeps the optional Later path separate and clears its controller", () => {
    const view = render();
    nodes(view.tree).find(node => node.type === "button" && node.props.onClick)!.props.onClick!();
    expect(view.skip).toHaveBeenCalledOnce();
    expect(view.onSkip).toHaveBeenCalledOnce();
    expect(view.start).not.toHaveBeenCalled();
  });
  it("does not offer pairing while busy or when the native bridge is unavailable", () => {
    for (const view of [render(true), render(false, false)]) {
      expect(nodes(view.tree).find(node => node.type === PrimaryButton)!.props.disabled).toBe(true);
      expect(view.html).toContain("disabled");
    }
  });
});
