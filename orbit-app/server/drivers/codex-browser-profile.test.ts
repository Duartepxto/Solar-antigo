import { describe, expect, it } from "vitest";
import { codexBrowserProfileTarget } from "./codex.ts";

describe("codexBrowserProfileTarget", () => {
  const existing = { pid: 77, window_id: 3, strategy: { kind: "existing_profile" } };

  it("reads a legacy mcp_tool_call approval's tool name and arguments", () => {
    const params = {
      message: 'Allow tool "browser_prepare"?',
      _meta: { codex_approval_kind: "mcp_tool_call", tool_params: existing },
    };
    expect(codexBrowserProfileTarget(params, "browser_prepare")).toEqual({ pid: 77, windowId: 3 });
  });

  it("finds the tool name in the metadata when the card names the server", () => {
    expect(codexBrowserProfileTarget({ _meta: { tool_name: "browser_prepare", tool_params: existing } }, "computer"))
      .toEqual({ pid: 77, windowId: 3 });
  });

  it("leaves other calls alone", () => {
    expect(codexBrowserProfileTarget({ _meta: { tool_params: { allow_launch: true } } }, "browser_prepare")).toBeNull();
    expect(codexBrowserProfileTarget({ _meta: { tool_params: existing } }, "click")).toBeNull();
    // No arguments: the host computer gate still asks before the call runs.
    expect(codexBrowserProfileTarget({ message: 'Allow tool "browser_prepare"?' }, "browser_prepare")).toBeNull();
  });
});
