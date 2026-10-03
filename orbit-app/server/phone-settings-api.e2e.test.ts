// PATCH /api/bots/:id/approval and /browser against a real isolated server and the fake
// engine: the level lands on the bot and the phone's open thread, a working
// thread refuses, only the level may be sent, and Full access never crosses
// plain loopback HTTP (this fixture has no paired-phone channel).
import { expect, it } from "vitest";
import { launchVerificationServer } from "../scripts/control-orbit.ts";

it("changes a bot's approval level from a phone, by the desktop's rules", async () => {
  const fixture = await launchVerificationServer({ FAKE_CLAUDE_MODE: "hang" });
  const { url } = fixture.info;
  const phone = { "x-orbit-companion": "1", "x-orbit-companion-device": "fixture-phone" };
  const api = async (method: string, path: string, body?: unknown, headers: Record<string, string> = {}) => {
    const response = await fetch(url + path, {
      method,
      headers: { origin: url, "content-type": "application/json", ...headers },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(10_000),
    });
    return { status: response.status, body: await response.json() as any };
  };
  try {
    const bot = (await api("POST", "/api/bots", { name: "Phone levels", modelSelection: { instanceId: "claude", model: "claude-sonnet-5" } })).body.bot;
    const thread = bot.threadId as string;

    const edits = await api("PATCH", `/api/bots/${bot.id}/approval`, { mode: "edits", threadId: thread }, phone);
    expect(edits.status, JSON.stringify(edits.body)).toBe(200);
    expect(edits.body.bot.approvalMode).toBe("edits");
    expect(edits.body.bot.tasks.find((task: any) => task.threadId === thread).approvalMode).toBe("edits");

    // only the level (and its confirmations) may be sent
    expect((await api("PATCH", `/api/bots/${bot.id}/approval`, { mode: "auto", computer: "local" }, phone)).status).toBe(400);
    expect((await api("PATCH", `/api/bots/${bot.id}/approval`, { mode: "sudo" }, phone)).status).toBe(400);
    expect((await api("PATCH", `/api/bots/${bot.id}/approval`, { mode: "custom" }, phone)).status).toBe(403);
    // Full access needs the sidecar's per-launch secret, which a header alone is not
    expect((await api("PATCH", `/api/bots/${bot.id}/approval`, { mode: "full", confirmFullAccess: true }, phone)).status).toBe(403);
    expect((await api("PATCH", "/api/bots/no-such-bot/approval", { mode: "ask" }, phone)).status).toBe(404);

    // the browser: on/off and a named session, nothing else
    const off = await api("PATCH", `/api/bots/${bot.id}/browser`, { enabled: false }, phone);
    expect(off.status, JSON.stringify(off.body)).toBe(200);
    expect(off.body.bot.browser).toBe(false);
    expect((await api("PATCH", `/api/bots/${bot.id}/browser`, { profile: "no-such-profile" }, phone)).status).toBe(400);
    expect((await api("PATCH", `/api/bots/${bot.id}/browser`, { enabled: true, computer: "local" }, phone)).status).toBe(400);
    expect((await api("PATCH", `/api/bots/${bot.id}/browser`, { enabled: "yes" }, phone)).status).toBe(400);
    const guest = await api("PATCH", `/api/bots/${bot.id}/browser`, { enabled: true, profile: "guest" }, phone);
    expect(guest.status, JSON.stringify(guest.body)).toBe(200);
    expect(guest.body.bot).toMatchObject({ browser: true, browserProfile: "guest" });

    // memory: write a topic, delete it, find the delete in the journal, undo it
    const topic = "memory/notes.md";
    expect((await api("PUT", `/api/bots/${bot.id}/memory/file`, { path: topic, text: "# notes\n\n- one\n" }, phone)).status).toBe(200);
    const removed = await api("DELETE", `/api/bots/${bot.id}/memory/file?path=${encodeURIComponent(topic)}`, undefined, phone);
    expect(removed.status, JSON.stringify(removed.body)).toBe(200);
    expect(removed.body.overview.topics.map((file: any) => file.path)).not.toContain(topic);
    const journal = await api("GET", `/api/bots/${bot.id}/memory/journal`, undefined, phone);
    const deletion = journal.body.entries.find((entry: any) => entry.kind === "deleted" && entry.path === topic);
    expect(deletion).toMatchObject({ actor: "person", canRevert: true });
    const undone = await api("POST", `/api/bots/${bot.id}/memory/journal/${deletion.id}/revert`, undefined, phone);
    expect(undone.status, JSON.stringify(undone.body)).toBe(200);
    expect(undone.body.overview.topics.map((file: any) => file.path)).toContain(topic);
    expect((await api("GET", `/api/bots/${bot.id}/memory/file?path=${encodeURIComponent(topic)}`, undefined, phone)).body.text).toContain("- one");

    // settings: only the panel's fields, through the desktop's own handler
    const moved = await api("PATCH", `/api/bots/${bot.id}/settings`, { section: "Phone team", pinned: true }, phone);
    expect(moved.status, JSON.stringify(moved.body)).toBe(200);
    expect(moved.body.bot).toMatchObject({ section: "Phone team", pinned: true });
    expect((await api("PATCH", `/api/bots/${bot.id}/settings`, { approvalMode: "full" }, phone)).status).toBe(400);
    expect((await api("PATCH", `/api/bots/${bot.id}/settings`, { mcpServers: [] }, phone)).status).toBe(400);
    expect((await api("PATCH", `/api/bots/${bot.id}/settings`, { cwd: "/definitely/not/a/folder" }, phone)).status).toBe(400);
    // teams: brief, rename
    expect((await api("PUT", `/api/section-context?section=${encodeURIComponent("Phone team")}`, { text: "Ship small." }, phone)).status).toBe(200);
    expect((await api("GET", `/api/section-context?section=${encodeURIComponent("Phone team")}`, undefined, phone)).body.text).toBe("Ship small.");
    expect((await api("PATCH", `/api/sidebar-sections?section=${encodeURIComponent("Phone team")}`, { name: "Pocket team" }, phone)).status).toBe(200);
    expect((await api("GET", "/api/bots")).body.bots.find((b: any) => b.id === bot.id).section).toBe("Pocket team");

    // skills: preview a source (nothing installed), install the reviewed text disabled, remove
    const skillText = "---\nname: phone-skill\ndescription: Made from the phone.\n---\n\n# phone-skill\n";
    const installed = await api("POST", `/api/bots/${bot.id}/skill-template`,
      { name: "phone-skill", description: "Made from the phone.", source: "phone review", text: skillText, enabled: false }, phone);
    expect(installed.status, JSON.stringify(installed.body)).toBe(201);
    expect((await api("GET", `/api/bots/${bot.id}/skills`, undefined, phone)).body.skills.find((s: any) => s.name === "phone-skill").enabled).toBe(false);
    expect((await api("DELETE", `/api/bots/${bot.id}/skills/phone-skill`, undefined, phone)).status).toBe(200);
    expect((await api("GET", `/api/bots/${bot.id}/skills`, undefined, phone)).body.skills.some((s: any) => s.name === "phone-skill")).toBe(false);
    expect((await api("POST", "/api/bot-defaults/skills/preview", { source: "" }, phone)).status).toBe(400);

    // a working thread keeps its level
    expect((await api("POST", `/api/bots/${bot.id}/messages`, { threadId: thread, text: "Hold this turn." })).status).toBe(202);
    await expect.poll(async () => (await api("GET", "/api/bots")).body.bots.find((b: any) => b.id === bot.id)?.busy, { timeout: 15_000 }).toBe(true);
    const busy = await api("PATCH", `/api/bots/${bot.id}/approval`, { mode: "auto", threadId: thread }, phone);
    expect(busy.status).toBe(409);
    expect(busy.body.error).toMatch(/stop this bot's turn/);
    const unchanged = (await api("GET", "/api/bots")).body.bots.find((b: any) => b.id === bot.id);
    expect(unchanged.approvalMode).toBe("edits");
    expect((await api("PATCH", `/api/bots/${bot.id}/browser`, { enabled: false }, phone)).status).toBe(409);

    // Custom: Codex only, and never over plain HTTP without the paired-phone channel
    expect((await api("PATCH", `/api/bots/${bot.id}/approval`, { mode: "custom", confirmCustom: true }, phone)).status).toBe(403);

    // deleting a bot, with the desktop's lifecycle (it stops the held turn)
    const gone = await api("DELETE", `/api/bots/${bot.id}`, undefined, phone);
    expect(gone.status, JSON.stringify(gone.body)).toBe(200);
    expect((await api("GET", "/api/bots")).body.bots.some((b: any) => b.id === bot.id)).toBe(false);
  } finally {
    await fixture.close();
  }
}, 60_000);
