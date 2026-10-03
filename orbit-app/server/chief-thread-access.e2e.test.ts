import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";
import { launchVerificationServer, runControlOrbit } from "../scripts/control-orbit.ts";
import { removeTempDir } from "./testing/cleanup.ts";

// A Chief changes the approval level of a teammate's existing conversation
// (set_thread_access), through a real active-turn capability: refused while
// that conversation is running, applied to it alone once the turn is done,
// written into the conversation, and in force on its next turn.
it("a Chief changes one teammate conversation's level mid-thread, never mid-turn", async () => {
  const gates = mkdtempSync(join(tmpdir(), "orbit-thread-access-gates-"));
  const gate = join(gates, "finish");
  const fixture = await launchVerificationServer({ FAKE_CLAUDE_MODE: "slow", FAKE_CLAUDE_SLOW_FINISH_GATE: gate });
  const api = async (method: string, path: string, body?: unknown, expected = 200, token?: string) => {
    const response = await fetch(fixture.info.url + path, { method, headers: { "content-type": "application/json", origin: fixture.info.url,
      ...(token ? { authorization: `Bearer ${token}` } : {}) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    const result = await response.json() as any;
    expect(response.status, JSON.stringify(result)).toBe(expected);
    return result;
  };
  const control = (...args: string[]) => runControlOrbit([...args, "--url", fixture.info.url]);
  const bots = async () => (await api("GET", "/api/bots")).bots;
  const dump = () => JSON.parse(readFileSync(fixture.fixtureDumpPath, "utf8"));
  let lastPid: number | undefined;
  // Send, then wait for that turn's engine process; returns its dump.
  const start = async (botId: string, threadId: string, text: string) => {
    if (existsSync(gate)) unlinkSync(gate);
    await control("send", "--bot", botId, "--task", threadId, "--text", text);
    await expect.poll(() => existsSync(fixture.fixtureDumpPath) && dump().pid !== lastPid, { timeout: 15_000 }).toBe(true);
    const current = dump();
    lastPid = current.pid;
    return current;
  };
  const finishAll = async (...ids: string[]) => {
    writeFileSync(gate, "finish");
    await expect.poll(async () => (await bots()).filter((bot: any) => ids.includes(bot.id)).every((bot: any) => !bot.busy), { timeout: 20_000 }).toBe(true);
  };
  const permissionMode = (argv: string[]) => argv[argv.indexOf("--permission-mode") + 1];
  // The tools a turn was really given: start the tool server exactly as
  // Orbit configured it for that turn and ask it.
  const toolNames = (server: { command: string; args: string[]; env: Record<string, string> }) => new Promise<string[]>((resolve, reject) => {
    const child = spawn(server.command, server.args, { env: { ...process.env, ...server.env }, stdio: ["pipe", "pipe", "ignore"] });
    let buf = "";
    child.on("error", reject);
    child.stdout!.on("data", (chunk) => {
      buf += chunk;
      for (const line of buf.split("\n").slice(0, -1)) {
        const message = JSON.parse(line);
        if (message.id === 2) { child.kill(); resolve(message.result.tools.map((tool: { name: string }) => tool.name)); }
      }
      buf = buf.slice(buf.lastIndexOf("\n") + 1);
    });
    child.stdin!.write(`${JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2024-11-05" } })}\n`);
    child.stdin!.write(`${JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list" })}\n`);
  });
  try {
    const chief = (await api("POST", "/api/bots", { name: "Pilot", title: "Chief of Staff", section: "Ops" }, 201)).bot;
    await api("PATCH", `/api/bots/${chief.id}`, { chiefOfStaff: true, approvalMode: "edits" });
    const mira = (await api("POST", "/api/bots", { name: "Mira", title: "Researcher", section: "Ops" }, 201)).bot;

    // Mira is working: a change now would read as applied and do nothing.
    const miraFirst = await start(mira.id, mira.threadId, "Collect the sources.");
    expect(permissionMode(miraFirst.argv)).toBe("default");
    const token = (await start(chief.id, chief.threadId, "Mira keeps stopping to ask; let her accept her own edits.")).mcpConfig.mcpServers.agents.env.ORBIT_COMMS_TOKEN as string;
    const busy = await api("POST", "/api/internal/set-thread-access", { targetBotId: mira.id, mode: "edits", reason: "Her edits are the work I assigned" }, 409, token);
    expect(busy.error).toContain("working in that conversation");
    await finishAll(chief.id, mira.id);

    // Mid-thread: the same conversation, now between turns.
    const token2 = (await start(chief.id, chief.threadId, "Now let her accept her own edits.")).mcpConfig.mcpServers.agents.env.ORBIT_COMMS_TOKEN as string;
    const above = await api("POST", "/api/internal/set-thread-access", { targetBotId: mira.id, mode: "auto", reason: "Go faster" }, 403, token2);
    expect(above.error).toContain("cannot give away more than it holds");
    await api("POST", "/api/internal/set-thread-access", { targetBotId: chief.id, mode: "edits", reason: "Myself" }, 403, token2);
    await api("POST", "/api/internal/set-thread-access", { targetBotId: mira.id, mode: "edits", reason: "" }, 400, token2);
    const changed = await api("POST", "/api/internal/set-thread-access", { targetBotId: mira.id, mode: "edits", reason: "Her edits are the work I assigned" }, 200, token2);
    expect(changed).toMatchObject({ botId: mira.id, threadId: mira.threadId, mode: "edits", previousMode: "ask", wasWaiting: false });
    await finishAll(chief.id);

    // That conversation alone, with the change written where the person reads.
    const after = (await bots()).find((bot: any) => bot.id === mira.id);
    expect(after.approvalMode ?? "ask").toBe("ask");
    expect(after.tasks.find((task: any) => task.threadId === mira.threadId).approvalMode).toBe("edits");
    const chip = (await api("GET", `/api/threads/${mira.threadId}/messages`)).messages.find((message: any) => message.kind === "activity" && message.tool?.name?.includes("set by Pilot"));
    expect(chip.tool.name).toBe("ask → edits — set by Pilot, a Chief of Staff: Her edits are the work I assigned");

    // Its next turn runs on the new level.
    const miraNext = await start(mira.id, mira.threadId, "Carry on.");
    expect(permissionMode(miraNext.argv)).toBe("acceptEdits");

    // Her default, too: refused while she works, then set between turns.
    const token3 = (await start(chief.id, chief.threadId, "Make edits her default.")).mcpConfig.mcpServers.agents.env.ORBIT_COMMS_TOKEN as string;
    const working = await api("POST", "/api/internal/set-thread-access", { targetBotId: mira.id, scope: "default", mode: "edits", reason: "She edits all day" }, 409, token3);
    expect(working.error).toContain("is working");
    await finishAll(chief.id, mira.id);
    const token4 = (await start(chief.id, chief.threadId, "Now make edits her default.")).mcpConfig.mcpServers.agents.env.ORBIT_COMMS_TOKEN as string;
    await api("POST", "/api/internal/set-thread-access", { targetBotId: mira.id, scope: "default", mode: "auto", reason: "Faster" }, 403, token4);
    await api("POST", "/api/internal/set-thread-access", { targetBotId: mira.id, scope: "default", mode: "edits", reason: "x", targetThreadId: mira.threadId }, 400, token4);
    const setDefault = await api("POST", "/api/internal/set-thread-access", { targetBotId: mira.id, scope: "default", mode: "edits", reason: "She edits all day" }, 200, token4);
    expect(setDefault).toMatchObject({ botId: mira.id, scope: "default", mode: "edits", previousMode: "ask" });
    await finishAll(chief.id);
    expect((await bots()).find((bot: any) => bot.id === mira.id).approvalMode).toBe("edits");
    const note = (await api("GET", `/api/threads/${mira.threadId}/messages`)).messages.find((message: any) => message.kind === "activity" && message.tool?.name?.includes("for new conversations"));
    expect(note.tool.name).toBe("ask → edits for new conversations — set by Pilot, a Chief of Staff: She edits all day");

    // A conversation she starts from now on begins on it.
    const fresh = (await api("POST", `/api/bots/${mira.id}/tasks`, { title: "New work" }, 201)).task;
    const inFresh = await start(mira.id, fresh.threadId, "Start the next piece.");
    expect(permissionMode(inFresh.argv)).toBe("acceptEdits");
    // Mira is no Chief: the tools her turn is given leave the Chief's out.
    const chiefTools = ["create_bot", "set_thread_access", "list_team_setup", "propose_team_setup", "propose_bot_deletion", "retry_thread"];
    const asMember = await toolNames(inFresh.mcpConfig.mcpServers.agents);
    expect(asMember).toContain("list_bots");
    for (const name of chiefTools) expect(asMember).not.toContain(name);
    await finishAll(mira.id);

    // Promoted between turns, she has them on her very next one.
    await api("PATCH", `/api/bots/${mira.id}`, { chiefOfStaff: true });
    const promoted = await start(mira.id, fresh.threadId, "You run this team now.");
    const asChief = await toolNames(promoted.mcpConfig.mcpServers.agents);
    for (const name of chiefTools) expect(asChief).toContain(name);
    await finishAll(mira.id);
  } finally {
    await fixture.close();
    await removeTempDir(gates);
  }
}, 90_000);
