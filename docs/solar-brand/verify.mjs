// Local visual inspection only. Uses a dedicated headless browser session.
import { execFile } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const directory = fileURLToPath(new URL('.', import.meta.url));
const project = resolve(directory, '../..');
const binary = join(project, 'orbit-app/.orbit-scratch/verify-tools/tools/agent-browser/0.36.0-omb.1/agent-browser.exe');
const evidence = join(directory, 'evidence');
mkdirSync(evidence, { recursive: true });
const config = join(evidence, 'browser-config.json');
writeFileSync(config, '{}\n');
const env = {
  ...process.env,
  AGENT_BROWSER_SESSION: 'solar-brand-review',
  AGENT_BROWSER_HEADLESS: '1',
  AGENT_BROWSER_NO_WEBMCP: '1',
  AGENT_BROWSER_CONFIG: config,
  AGENT_BROWSER_SOCKET_DIR: evidence,
  AGENT_BROWSER_EXECUTABLE_PATH: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
};
const execute = promisify(execFile);
const browser = async (...args) => {
  const { stdout } = await execute(binary, [...args, '--json'], { env, timeout: 30000, windowsHide: true, maxBuffer: 1048576 });
  const value = JSON.parse(stdout);
  if (!value.success) throw new Error(JSON.stringify(value.error));
  return value.data;
};

try {
  await browser('set', 'viewport', '1280', '900');
  await browser('open', pathToFileURL(join(directory, 'index.html')).href);
  await browser('wait', '--fn', 'document.fonts.status === "loaded" && [...document.images].every(i => i.complete && i.naturalWidth > 0)');
  const desktop = await browser('eval', '({width:innerWidth,content:document.documentElement.scrollWidth,font:document.fonts.check("15px Manrope"),images:[...document.images].every(i=>i.naturalWidth>0)})');
  await browser('screenshot', join(evidence, 'desktop.png'), '--full');
  await browser('find', 'role', 'button', 'click', '--name', 'Claro', '--exact');
  await browser('wait', '--fn', 'getComputedStyle(document.querySelector(".preview")).backgroundColor === "rgb(242, 239, 232)"');
  const light = await browser('eval', '({tone:document.querySelector(".preview").dataset.tone,selected:document.querySelector("button[aria-pressed=true]").textContent})');
  await browser('screenshot', join(evidence, 'light.png'));
  await browser('set', 'viewport', '390', '844');
  await browser('find', 'role', 'button', 'click', '--name', 'Grafite', '--exact');
  await browser('wait', '--fn', 'getComputedStyle(document.querySelector(".preview")).backgroundColor === "rgb(21, 25, 31)"');
  const mobile = await browser('eval', '({width:innerWidth,content:document.documentElement.scrollWidth,buttons:[...document.querySelectorAll("button")].map(b=>({text:b.textContent,height:b.getBoundingClientRect().height}))})');
  await browser('screenshot', join(evidence, 'mobile.png'), '--full');
  const result = { desktop: desktop.result, light: light.result, mobile: mobile.result };
  writeFileSync(join(evidence, 'inspection.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result));
} finally {
  await browser('close').catch(() => {});
}
