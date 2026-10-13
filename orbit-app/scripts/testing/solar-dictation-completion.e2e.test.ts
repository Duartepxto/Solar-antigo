import { build } from "esbuild";
import { createServer } from "node:http";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";
import { BrowserRuntime } from "../../server/browser-runtime.ts";
import { closeBrowserSession } from "../../server/browser-engine.ts";

const binary = process.env.ORBIT_VERIFY_BROWSER_BINARY;
const chrome = process.env.ORBIT_VERIFY_BROWSER_CHROME;

it.skipIf(!binary || !chrome)("the real React dictation hook sends only successful completed recordings", async () => {
  const source = `
    import { useState } from 'react';
    import { createRoot } from 'react-dom/client';
    import { useSolarDictation } from './src/orbit/useSolarDictation';
    window.sent=[];
    window.bridge={
      onSpeechTranscript(fn){window.transcript=fn; return ()=>{window.transcript=()=>{};};},
      onSpeechEnd(fn){window.end=fn; return ()=>{window.end=()=>{};};},
      speechStart(){return Promise.resolve();}, speechStop(){return Promise.resolve();},
      speechFinish(){return Promise.resolve();}
    };
    function Fixture(){
      const [text,setText]=useState('Existing draft');
      const [recipient,setRecipient]=useState('one');
      const voice=useSolarDictation(text,setText,recipient,value=>window.sent.push(value));
      window.voice=voice; window.changeRecipient=setRecipient;
      return <div id="state">{JSON.stringify({text,listening:voice.listening,finishing:voice.finishing})}</div>;
    }
    createRoot(document.getElementById('root')).render(<Fixture/>);
  `;
  const bundle = await build({ stdin: { contents: source, resolveDir: process.cwd(), loader: "tsx" },
    bundle: true, write: false, format: "iife", jsx: "automatic", plugins: [{
      name: "fixture-voice", setup(builder) {
        builder.onResolve({ filter: /solar-voice$/ }, () => ({ path: "voice", namespace: "fixture" }));
        builder.onResolve({ filter: /solar-dictation-settings$/ }, () => ({ path: "settings", namespace: "fixture" }));
        builder.onLoad({ filter: /.*/, namespace: "fixture" }, ({ path }) => ({ contents: path === "voice"
          ? "export const useSolarSpeechReady=()=>true; export const solarSpeechBridge=()=>window.bridge;"
          : "export const readDictationLocales=()=>['en-US'];", loader: "js" }));
      },
    }] });
  const server = createServer((req, res) => {
    res.setHeader("content-type", req.url === "/app.js" ? "text/javascript" : "text/html");
    res.end(req.url === "/app.js" ? bundle.outputFiles[0]!.text : '<div id="root"></div><script src="/app.js"></script>');
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const home = mkdtempSync(join(tmpdir(), "solar-dictation-completion-"));
  const session = `dictation-${process.pid}`;
  const env = { HOME: home, USERPROFILE: home, PATH: process.env.PATH,
    AGENT_BROWSER_SESSION: session, AGENT_BROWSER_HEADLESS: "1", AGENT_BROWSER_EXECUTABLE_PATH: chrome! };
  const runtime = new BrowserRuntime();
  const spec = { command: binary!, args: ["mcp", "--tools", "core"], env };
  const call = async (name: string, args: Record<string, unknown>) => {
    const result = await runtime.agentRpc(session, spec, "tools/call", { name: `agent_browser_${name}`, arguments: args }) as { isError?: boolean };
    expect(result.isError, JSON.stringify(result)).not.toBe(true);
    return JSON.stringify(result);
  };
  const act = (script: string) => call("eval", { script });
  try {
    const port = (server.address() as { port: number }).port;
    await call("open", { url: `http://127.0.0.1:${port}` });
    await act("window.voice.toggle()");
    await act("window.transcript({text:'Partial cancelled',partial:true}); window.voice.cancel()");
    expect(await act("JSON.stringify(window.sent)")).toContain("[]");
    await act("window.voice.toggle()");
    await act("window.end({code:0})");
    expect(await act("JSON.stringify(window.sent)")).toContain("[]");
    await act("window.voice.toggle()");
    await act("window.transcript({text:'Do not send',partial:false}); window.end({code:1})");
    expect(await act("JSON.stringify(window.sent)")).toContain("[]");
    await act("window.voice.toggle()");
    await act("window.transcript({error:'audio-capture'}); window.end({code:0})");
    expect(await act("JSON.stringify(window.sent)")).toContain("[]");
    await act("window.voice.toggle()");
    await act("window.transcript({text:'Wrong recipient',partial:false}); window.changeRecipient('two')");
    await act("window.end({code:0})");
    expect(await act("JSON.stringify(window.sent)")).toContain("[]");
    await act("window.voice.toggle()");
    await act("window.transcript({text:'Successful recording',partial:false}); window.end({code:0}); window.end({code:0})");
    expect(await act("window.sent.length")).toMatch(/\b1\b/);
    expect(await act("window.sent[0]")).toContain("Successful recording");
  } finally {
    try { await closeBrowserSession(binary!, env); }
    finally {
      await runtime.closeAll();
      await new Promise<void>((resolve) => server.close(() => resolve()));
      rmSync(home, { recursive: true, force: true });
    }
  }
}, 60_000);
