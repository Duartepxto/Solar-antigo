// A stand-in for Orbit's agents MCP server in the Orbit agent evals: the real
// tool definitions the Orbit agent is shown, answered from the scenario's
// script instead of a live app, with every call recorded for grading.
//
//   ORBIT_EVAL_SCENARIO  path to the scenario JSON (its "tools" map answers calls)
//   ORBIT_EVAL_CALLS     file each call is appended to, one JSON object per line
import { appendFileSync, readFileSync } from "node:fs";
import { createInterface } from "node:readline";

import { availableTools, catalogProfileFromEnv } from "../../../server/drivers/agents-catalog.ts";

const scenario = JSON.parse(readFileSync(process.env.ORBIT_EVAL_SCENARIO!, "utf8")) as {
  tools?: Record<string, string | { error: string }>;
};
const tools = availableTools(catalogProfileFromEnv({
  ORBIT_BOT_ID: "orbit", ORBIT_CHIEF_OF_STAFF: "1", ORBIT_SYSTEM_AGENT: "1", ORBIT_ROOM_TURN: "1",
}));

const send = (message: unknown) => process.stdout.write(`${JSON.stringify(message)}\n`);

/** What a tool answers: the scenario's script, else a neutral default. */
function answer(name: string): { text: string; isError?: boolean } {
  const scripted = scenario.tools?.[name];
  if (typeof scripted === "string") return { text: scripted };
  if (scripted && typeof scripted === "object") return { text: scripted.error, isError: true };
  if (name.startsWith("propose_")) return { text: "Proposed. The person applies it from the card; nothing has changed yet. End your turn and wait for them." };
  return { text: "Nothing relevant found." };
}

for await (const line of createInterface({ input: process.stdin })) {
  if (!line.trim()) continue;
  const request = JSON.parse(line) as { id?: number | string; method: string; params?: { name?: string; arguments?: unknown } };
  if (request.method === "initialize") {
    send({ jsonrpc: "2.0", id: request.id, result: { protocolVersion: "2025-06-18", capabilities: { tools: {} }, serverInfo: { name: "orbit-eval", version: "1" } } });
  } else if (request.method === "tools/list") {
    send({ jsonrpc: "2.0", id: request.id, result: { tools } });
  } else if (request.method === "tools/call") {
    const name = request.params?.name ?? "";
    appendFileSync(process.env.ORBIT_EVAL_CALLS!, `${JSON.stringify({ name, arguments: request.params?.arguments ?? {} })}\n`);
    const { text, isError } = answer(name);
    send({ jsonrpc: "2.0", id: request.id, result: { content: [{ type: "text", text }], ...(isError ? { isError: true } : {}) } });
  } else if (request.id !== undefined) {
    send({ jsonrpc: "2.0", id: request.id, result: {} });
  }
}
