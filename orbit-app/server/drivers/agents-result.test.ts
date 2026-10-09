import { expect, it, vi } from "vitest";
import { boundedAgentResult, AGENT_RESULT_INLINE_CHARS } from "./agents-result.ts";
import { TOOL_RESULT_MAX_CHARS, TOOL_RESULT_PREVIEW_CHARS, ToolResults } from "../tool-results.ts";

const id = "r-37a58e8d-4411-4a9c-bc1a-00c4278201db";

it("leaves small results unchanged without cache I/O", async () => {
  const save = vi.fn();
  expect(await boundedAgentResult("original result", save)).toBe("original result");
  expect(save).not.toHaveBeenCalled();
});

it("returns a bounded preview and an exact next offset without breaking emoji", async () => {
  const save = vi.fn().mockResolvedValue({ id });
  const text = `${"x".repeat(3_999)}🌱${"y".repeat(15_000)}`;
  const reply = await boundedAgentResult(text, save);
  expect(reply.length).toBeLessThan(5_000);
  expect(Buffer.from(reply).toString()).toBe(reply);
  expect(reply).toContain(`id "${id}" and offset 3999`);
  expect(save).toHaveBeenCalledExactlyOnceWith(text, false);
});

it("keeps ordinary results inline and retrieves a medium result losslessly only when requested", async () => {
  const save = vi.fn();
  const small = "x".repeat(AGENT_RESULT_INLINE_CHARS);
  expect(await boundedAgentResult(small, save)).toBe(small);
  expect(save).not.toHaveBeenCalled();
  const cache = new ToolResults();
  const owner = { botId: "probe", threadId: "conversation" };
  const text = `${"x".repeat(3_999)}🌱${"tail".repeat(4_000)}`;
  const reply = await boundedAgentResult(text, async retained => cache.save(owner, retained));
  const handle = reply.match(/id "([^"]+)" and offset (\d+)/)!;
  const offset = Number(handle[2]);
  const pieces = [reply.slice(0, offset)];
  let cursor = offset;
  let pages = 0;
  while (cursor < text.length) {
    const page = cache.read(owner, handle[1]!, cursor)!;
    expect(page.text.length).toBeLessThanOrEqual(TOOL_RESULT_PREVIEW_CHARS);
    expect(Buffer.from(page.text).toString()).toBe(page.text);
    expect(page.nextOffset).toBeGreaterThan(cursor);
    pieces.push(page.text);
    cursor = page.nextOffset;
    pages++;
  }
  expect(pieces.join("")).toBe(text);
  expect(cursor).toBe(text.length);
  expect(pages).toBe(2);
  expect(cache.read({ ...owner, botId: "other" }, handle[1]!, offset)).toBeNull();
});

it("redacts before both preview and retention, and admits when the tail is omitted", async () => {
  const save = vi.fn().mockResolvedValue({ id });
  const secret = `ghp_${"x".repeat(30)}`;
  const reply = await boundedAgentResult(`${secret}\n${"x".repeat(TOOL_RESULT_MAX_CHARS * 2)}`, save);
  expect(reply).not.toContain(secret);
  expect(reply).toContain("remaining tail was omitted");
  expect(save.mock.calls[0]![0]).not.toContain(secret);
  expect(save.mock.calls[0]![0].length).toBeLessThanOrEqual(TOOL_RESULT_MAX_CHARS);
  expect(save.mock.calls[0]![1]).toBe(true);
});

it.each([null, {}, { id: "bad" }])("does not advertise a missing cache handle: %j", async saved => {
  expect(await boundedAgentResult("x".repeat(30_000), async () => saved)).toContain("could not be saved");
});

it("does not repeat the operation or claim failure when storing its output fails", async () => {
  const save = vi.fn().mockRejectedValue(new Error("offline"));
  const reply = await boundedAgentResult("x".repeat(30_000), save);
  expect(save).toHaveBeenCalledTimes(1);
  expect(reply).toContain("The original operation was not retried");
  expect(reply).not.toContain(id);
});
