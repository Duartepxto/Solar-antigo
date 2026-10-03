import { existsSync, lstatSync, mkdirSync, readFileSync, readlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { modelOnlyCodexConfig, prepareOrbitCodexHome } from "./codex-orbit-home.ts";

const PERSONAL = `notify = ["bash", "-lc", "afplay /System/Library/Sounds/Glass.aiff"]
model = "gpt-5.5"
model_instructions_file = "/Users/me/.codex/my-prompt.md"
model_reasoning_effort = "high"
service_tier = "fast"
developer_instructions = """
Always end with PINEAPPLE.
"""

[marketplaces.openai-bundled]
source_type = "local"
source = "/Users/me/.codex/plugins"

[plugins."browser@openai-bundled"]
enabled = true

[features]
js_repl = true

[mcp_servers.node_repl]
args = ["repl.js"]
command = "node"

[mcp_servers.node_repl.env]
TOKEN = "x"

[model_providers.omniroute]
name = "OmniRoute"
base_url = "http://127.0.0.1:20128/v1"
env_key = "OMNIROUTE_KEY"

[[skills.config]]
name = "sprite-gen"
enabled = true
`;

describe("Orbit's Codex home", () => {
  it("keeps only the model and provider settings", () => {
    // the settings themselves, not the header that explains them
    const kept = modelOnlyCodexConfig(PERSONAL).split("\n").filter((line) => !line.startsWith("#")).join("\n");
    expect(kept).toContain('model = "gpt-5.5"');
    expect(kept).toContain('model_reasoning_effort = "high"');
    expect(kept).toContain('service_tier = "fast"');
    expect(kept).toContain("[model_providers.omniroute]");
    expect(kept).toContain('base_url = "http://127.0.0.1:20128/v1"');
    // the account's ChatGPT apps are switched off, and nothing else is set
    expect(kept.trim().endsWith("[features]\napps = false")).toBe(true);
    for (const personal of ["notify", "model_instructions_file", "PINEAPPLE", "developer_instructions", "marketplaces", "plugins", "js_repl", "mcp_servers", "node_repl", "TOKEN", "skills", "sprite-gen"]) {
      expect(kept, personal).not.toContain(personal);
    }
  });

  it("copies the settings, links the history, and never the sign-in", () => {
    const home = homedir();
    const personal = join(home, ".codex");
    mkdirSync(join(personal, "skills", "sprite-gen"), { recursive: true });
    writeFileSync(join(personal, "config.toml"), PERSONAL);
    writeFileSync(join(personal, "work.config.toml"), 'model = "gpt-5.5-mini"\nnotify = ["x"]\n');
    writeFileSync(join(personal, "auth.json"), "{}");
    writeFileSync(join(personal, "AGENTS.md"), "PERSONAL");
    const dir = prepareOrbitCodexHome({ HOME: home }, join(home, "orbit-codex"));
    expect(readFileSync(join(dir, "config.toml"), "utf8")).toContain("[model_providers.omniroute]");
    expect(readFileSync(join(dir, "work.config.toml"), "utf8")).toContain('model = "gpt-5.5-mini"');
    expect(readFileSync(join(dir, "work.config.toml"), "utf8")).not.toContain("notify");
    for (const name of ["sessions", "archived_sessions"]) {
      expect(lstatSync(join(dir, name)).isSymbolicLink()).toBe(true);
      expect(readlinkSync(join(dir, name))).toBe(join(personal, name));
    }
    for (const personalOnly of ["auth.json", "AGENTS.md", "skills", "plugins"]) expect(existsSync(join(dir, personalOnly)), personalOnly).toBe(false);
    // a model changed in the person's Codex reaches the next launch
    writeFileSync(join(personal, "config.toml"), 'model = "gpt-6"\n');
    prepareOrbitCodexHome({ HOME: home }, dir);
    expect(readFileSync(join(dir, "config.toml"), "utf8")).toContain('model = "gpt-6"');
  });
});
