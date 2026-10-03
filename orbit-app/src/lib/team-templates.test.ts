import { describe, expect, it } from "vitest";

import { createTeamFromTemplate } from "@/state/store";
import { TEAM_TEMPLATES } from "./team-templates";

describe("the Orbit maintainers team template", () => {
  it("creates both workers in Orbit's own checkout and a Chief without one, with Upstream's routine", async () => {
    const calls: Array<{ path: string; method: string; body?: Record<string, unknown> }> = [];
    let next = 0;
    const request = (async (path: string, init?: RequestInit) => {
      const body = typeof init?.body === "string" ? JSON.parse(init.body) : undefined;
      calls.push({ path, method: init?.method ?? "GET", body });
      if (path === "/api/bots") return { bot: { id: `bot-${++next}`, name: body.name, messages: [] } };
      if (path === "/api/orbit/source") return { path: "/repo/orbit", exists: true };
      if (path.startsWith("/api/bots/")) return { bot: { id: path.split("/")[3], ...body } };
      return {};
    }) as unknown as typeof import("@/state/store").api;

    const template = TEAM_TEMPLATES.find((entry) => entry.id === "orbit-maintainers")!;
    const { chief, members, errors } = await createTeamFromTemplate(template, request);
    expect(errors).toEqual([]);
    expect(members.map((bot) => bot.name)).toEqual(["Upstream", "Builder"]);
    expect(chief).toMatchObject({ name: "Pilot", chiefOfStaff: true });

    const created = calls.filter((call) => call.path === "/api/bots");
    expect(created.map((call) => call.body)).toEqual([
      expect.objectContaining({ name: "Upstream", section: "Orbit" }),
      expect.objectContaining({ name: "Builder", section: "Orbit" }),
      expect.objectContaining({ name: "Pilot", section: "Orbit" }),
    ]);
    const profiles = calls.filter((call) => call.method === "PATCH" && call.body?.soul);
    expect(profiles).toHaveLength(3);
    const [upstream, builder, chiefProfile] = profiles;
    // the workers own the code, each in its own worktree
    for (const worker of [upstream, builder]) {
      expect(worker!.body).toMatchObject({ cwd: "/repo/orbit" });
      expect(String(worker!.body!.soul)).toContain("git worktree add .worktrees/");
    }
    // the Chief routes: no code folder, so it cannot read the code twice
    expect(chiefProfile!.body).not.toHaveProperty("cwd");
    expect(String(chiefProfile!.body!.soul)).toContain("verbatim");
    const routines = calls.filter((call) => call.path === "/api/routines");
    expect(routines).toEqual([expect.objectContaining({ body: expect.objectContaining({ name: "Check upstream", botId: "bot-1", enabled: true }) })]);
    expect(calls.find((call) => call.body?.chiefOfStaff)).toMatchObject({ path: "/api/bots/bot-3", method: "PATCH" });
    // the team's shared instructions, short enough to read every turn
    const instructions = calls.find((call) => call.path.startsWith("/api/section-context"))!;
    expect(instructions).toMatchObject({ path: "/api/section-context?section=Orbit", method: "PUT" });
    expect(String(instructions.body!.text)).toMatch(/^Goals\n[\s\S]*Decisions\n[\s\S]*Preferences\n/);
    expect(String(instructions.body!.text).length).toBeLessThan(800);
  });
});
