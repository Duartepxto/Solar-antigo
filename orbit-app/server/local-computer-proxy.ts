// Near-side gate for the host CUA process. The descriptor and turn token
// travel in environment variables, never command-line arguments or logs.
import { runMcpBridge } from "./mcp-bridge.ts";
import { augmentedPath } from "./env-path.ts";
import { createControlClient } from "./control-client.ts";
import { browserProfileConsentCheck } from "./local-computer-consent.ts";

const {
  ORBIT_CUA_COMMAND: command,
  ORBIT_CUA_ARGS: encodedArgs,
  ORBIT_CONTROL_URL: url,
  ORBIT_CONTROL_TOKEN: token,
  ...childEnv
} = process.env;

let args: string[];
try {
  const parsed: unknown = JSON.parse(encodedArgs ?? "");
  const endpoint = new URL(url ?? "");
  if (!command?.trim() || command.includes("\0") ||
      !Array.isArray(parsed) || !parsed.every((arg) => typeof arg === "string" && !arg.includes("\0")) ||
      !token || !["http:", "https:"].includes(endpoint.protocol) ||
      !["127.0.0.1", "localhost", "[::1]"].includes(endpoint.hostname) || endpoint.username || endpoint.password) {
    throw new Error("invalid connection");
  }
  args = parsed;
} catch {
  process.stderr.write("invalid local computer proxy connection\n");
  process.exit(2);
}

runMcpBridge({
  command: command!,
  args,
  env: { ...childEnv, PATH: augmentedPath() },
  label: "Local Cua Driver",
  gate: { url: url!, token: token! },
  // The person's logged-in browser is theirs to lend: every existing-profile
  // attachment waits for their answer on Orbit's card, whatever the engine
  // or its approval mode already decided.
  consent: browserProfileConsentCheck(createControlClient({ url: url!, token: token! })),
});
