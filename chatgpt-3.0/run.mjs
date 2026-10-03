import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve, extname, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const orbit = resolve(root, '../orbit-app');
const smoke = process.argv.includes('--smoke');
const preview = process.argv.includes('--fixture');
const uiPort = Number(process.env.CHATGPT3_UI_PORT || 5200);
const apiPort = Number(process.env.CHATGPT3_API_PORT || 8809);
const dataDir = resolve(root, '.data');
let fixture, backend, web;
let stopping;

async function stop() {
  if (stopping) return stopping;
  stopping = (async () => {
    web?.httpServer?.closeAllConnections();
    await web?.close();
    if (fixture) await fixture.close();
    if (backend) {
      const { waitForExit } = await import(pathToFileURL(resolve(orbit, 'server/testing/cleanup.ts')).href);
      await waitForExit(backend, { signal: 'SIGTERM' });
    }
  })();
  return stopping;
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => { void stop().finally(() => process.exit()); });
}

async function ready(url) {
  const deadline = Date.now() + 60000;
  while (Date.now() < deadline) {
    if (backend && backend.exitCode !== null) throw new Error('O backend terminou antes de iniciar.');
    try {
      const response = await fetch(`${url}/api/health`, { signal: AbortSignal.timeout(1500) });
      if (response.ok) return;
    } catch {}
    await new Promise((done) => setTimeout(done, 250));
  }
  throw new Error('O backend não ficou disponível em 60 segundos.');
}

try {
  if (Number(process.versions.node.split('.')[0]) < 24) throw new Error('É necessário Node.js 24 ou superior.');
  if (![uiPort, apiPort].every((port) => Number.isInteger(port) && port > 1024 && port < 65535) || uiPort === apiPort || uiPort === apiPort + 1) {
    throw new Error('Portas inválidas ou sobrepostas.');
  }
  const vitePath = resolve(orbit, 'node_modules/vite/dist/node/index.js');
  if (!existsSync(vitePath)) throw new Error('Instala primeiro as dependências em orbit-app com pnpm install.');
  process.chdir(orbit);
  let serverUrl;
  if (smoke || preview) {
    const { launchVerificationServer, runControlOrbit } = await import(pathToFileURL(resolve(orbit, 'scripts/control-orbit.ts')).href);
    fixture = await launchVerificationServer();
    serverUrl = fixture.info.url;
    if (preview || smoke) {
      const { seedSolarPreview } = await import('./preview-data.mjs');
      await seedSolarPreview(fixture, runControlOrbit);
    }
  } else {
    mkdirSync(dataDir, { recursive: true });
    serverUrl = `http://127.0.0.1:${apiPort}`;
    backend = spawn(process.execPath, ['--experimental-strip-types', 'server/index.ts'], {
      cwd: orbit,
      env: { ...process.env, ORBIT_DATA_DIR: dataDir, ORBIT_PORT: String(apiPort), ORBIT_WEBHOOK_PORT: String(apiPort + 1) },
      stdio: 'inherit', windowsHide: true,
    });
    backend.on('error', (error) => { console.error(error.message); void stop().finally(() => process.exit(1)); });
    backend.on('exit', () => { if (!stopping) void stop().finally(() => process.exit(1)); });
    await ready(serverUrl);
  }
  process.env.ORBIT_PORT = new URL(serverUrl).port;
  process.env.VITE_JARVIS_SOLAR = 'true';
  process.env.VITE_JARVIS_PREVIEW = preview || smoke ? 'true' : 'false';
  const { createServer } = await import(pathToFileURL(vitePath).href);
  web = await createServer({
    root: orbit,
    configFile: resolve(orbit, 'vite.config.ts'),
    configLoader: 'native',
    plugins: [{
      name: 'chatgpt3-studio',
      transformIndexHtml: (html) => html.replace('<title>Orbit</title>', '<title>Jarvis 3.0</title>').replace('<body>', `<body><!--
THESIS: An agent workspace represented by a luminous solar system, with real agents as planets and moons.
OWN-WORLD: Black canvas (#050607), visibly separate beveled block-like particles sculpting recognizable planetary volumes, teal continents and blue oceans, amber Sun, particle rings of Saturn, warm Mars. Each skin has its own carved face with curved 3D eye lenses seated inside its apertures and an animated mouth groove. Nearby mouse movement gently indents local particles and directs the gaze; the shell always retains its planetary form. Restrained glass controls. No photographic sphere skins or flat face overlays.
STORY: See the team hierarchy, open a real agent, send a message and freely arrange the system.
FIRST VIEWPORT: Jarvis Sun in the centre; the isolated demonstration shows all eight planets and five named moon variants together. The persistent workspace reflects its actual agents. Quiet header, compact quick settings and creation menu above; message field and typing control below. Portrait arranges the eight groups in two readable columns.
FORM: Explicitly pinned solar map with procedural instanced 3D fragments. Surface key: jarvis-solar-aura-20261002. Signature: separate beveled square particles retain recognizable curved planetary volumes, with a per-skin carved face and curved eye lenses. Luminous surrounding fragments, a returning local pointer dent and a restrained fragment trail during drag preserve the body shape. Straight gradient lines show actual parent–agent connections without rectangular cutouts behind labels; system orbital circles are removed. Moving a planet carries its moons. Motion, interaction, surrounding particles, connections and glow have local quick controls. Further expression animation and communication patterns remain iterative work.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`),
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const pathname = new URL(req.url, 'http://127.0.0.1').pathname;
          if (!pathname.startsWith('/robot-studio')) return next();
          if (pathname === '/robot-studio') { res.writeHead(302, { Location: '/robot-studio/' }); res.end(); return; }
          if (!pathname.startsWith('/robot-studio/')) return next();
          try {
            const relative = decodeURIComponent(pathname.slice('/robot-studio/'.length)) || 'index.html';
            const vendor = relative.startsWith('vendor/');
            const directory = vendor ? resolve(root, 'node_modules/three') : resolve(root, 'studio');
            const path = resolve(directory, vendor ? relative.slice(7) : relative);
            const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[extname(path)];
            if (!path.startsWith(directory + sep) || !mime) { res.writeHead(404); res.end(); return; }
            res.writeHead(200, { 'Content-Type': `${mime}; charset=utf-8`, 'Cache-Control': 'no-cache' });
            res.end(readFileSync(path));
          } catch { res.writeHead(404); res.end(); }
        });
      },
    }],
    server: { host: '127.0.0.1', port: smoke ? 0 : uiPort, strictPort: true, watch: { ignored: ['**/dist-native/**', '**/release*/**', '**/electron/vendor/**'] } },
  });
  await web.listen();
  const address = web.httpServer.address();
  const uiUrl = `http://127.0.0.1:${address.port}`;
  console.log(`Jarvis 3.0: ${uiUrl}\nBackend Orbit: ${serverUrl}`);
  console.log(`Estúdio de desenho 2D: ${uiUrl}/robot-studio/`);
  if (smoke) {
    const page = await fetch(uiUrl);
    if (!page.ok || !(await page.text()).includes('<title>Jarvis 3.0</title>')) throw new Error('Falhou a página inicial.');
    const health = await fetch(`${uiUrl}/api/health`);
    if (!health.ok) throw new Error('Falhou o proxy para o backend.');
    const main = await fetch(`${uiUrl}/src/main.tsx`);
    if (!main.ok) throw new Error('Falhou a transformação do frontend React.');
    for (const asset of ['src/orbit/SolarMap.tsx', 'src/orbit/SolarChrome.tsx', 'src/orbit/SolarWorld.tsx', 'src/orbit/solar-renderer.js', 'src/orbit/solar-presets.js', 'src/orbit/solar-preferences.ts', 'src/orbit/solar-interaction.js', 'src/orbit/vendor/three.module.js', ...['2k_sun.jpg','2k_earth_daymap.jpg','2k_earth_nightmap.jpg','2k_earth_clouds.jpg','2k_saturn.jpg','2k_saturn_ring_alpha.png','2k_mars.jpg','2k_moon.jpg'].map(name => `solar/textures/${name}`)]) {
      const response = await fetch(`${uiUrl}/${asset}`);
      if (!response.ok) throw new Error(`Falhou o mapa solar: ${asset}`);
    }
    for (const asset of ['', 'illustration-main.js', 'illustrated-robot.js', 'illustration.css']) {
      const response = await fetch(`${uiUrl}/robot-studio/${asset}`);
      if (!response.ok) throw new Error(`Falhou o estúdio de desenho 2D: ${asset}`);
    }
    console.log('Verificado: página, frontend React e ligação HTTP ao backend numa fixture isolada.');
    await stop();
    process.exit(0);
  } else {
    console.log(preview ? 'Pré-visualização com motor simulado e dados temporários. Ctrl+C para terminar.' : `Dados desta aplicação: ${dataDir}\nCtrl+C para terminar.`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
  await stop();
}

