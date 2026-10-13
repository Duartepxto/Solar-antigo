import { createServer, request, type Server } from "node:http";
import { once } from "node:events";
import { afterEach, expect, it } from "vitest";
import { json, parsedBodyOf, readBody } from "./http.ts";

let server: Server | undefined;
afterEach(async () => {
  if (!server) return;
  server.closeAllConnections();
  await new Promise<void>((resolve, reject) => server!.close(error => error ? reject(error) : resolve()));
  server = undefined;
});

async function endpoint(limit?: number) {
  let firstChunk!: () => void;
  const receivedFirstChunk = new Promise<void>(resolve => { firstChunk = resolve; });
  server = createServer(async (req, res) => {
    req.once("data", firstChunk);
    try {
      const body = await readBody(req, limit);
      json(res, 200, { body, remembered: parsedBodyOf(req) });
    } catch (error) {
      json(res, (error as { status: number }).status, { error: (error as Error).message });
    }
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Missing fixture port");
  return { port: address.port, receivedFirstChunk };
}

it.each(["á", "☀", "🪐", "日"])("preserves a split UTF-8 character (%s) across HTTP chunks", async character => {
  const { port, receivedFirstChunk } = await endpoint();
  const body = { text: "Olá, ação. ☀️ 🪐 日本語" };
  const encoded = Buffer.from(JSON.stringify(body));
  // Deliver a byte inside the character on its own HTTP chunk, not just writes
  // that TCP is free to coalesce. The fixture acknowledges the first chunk.
  const split = encoded.indexOf(Buffer.from(character)) + 1;
  const client = request({ host: "127.0.0.1", port, method: "POST" });
  const responseReady = once(client, "response");
  client.write(encoded.subarray(0, split));
  await receivedFirstChunk;
  client.end(encoded.subarray(split));
  const [response] = await responseReady;
  const chunks: Buffer[] = [];
  for await (const chunk of response) chunks.push(chunk);
  expect(response.statusCode).toBe(200);
  expect(JSON.parse(Buffer.concat(chunks).toString())).toEqual({ body, remembered: body });
});

it("counts the UTF-8 byte limit and still returns a readable 413", async () => {
  const { port } = await endpoint(12);
  const response = await fetch(`http://127.0.0.1:${port}`, { method: "POST", body: JSON.stringify({ text: "áá" }) });
  expect(response.status).toBe(413);
  expect(await response.json()).toEqual({ error: "body too large" });
});

it("keeps empty requests and malformed JSON behavior", async () => {
  const { port } = await endpoint();
  const empty = await fetch(`http://127.0.0.1:${port}`, { method: "POST" });
  expect(await empty.json()).toEqual({ body: {}, remembered: {} });
  const invalid = await fetch(`http://127.0.0.1:${port}`, { method: "POST", body: "{" });
  expect(invalid.status).toBe(400);
  expect(await invalid.json()).toEqual({ error: "invalid JSON body" });
});
