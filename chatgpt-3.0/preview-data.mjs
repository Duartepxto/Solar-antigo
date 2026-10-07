// This function is called only for the fixture just created by run.mjs.
// It never seeds the persistent backend or discovers a server from a port.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
export async function seedSolarPreview(fixture, control) {
  const url = fixture.info.url;
  async function request(path, method = 'GET', body) {
    const response = await fetch(`${url}${path}`, {
      method, headers: { 'content-type': 'application/json', origin: url },
      ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`Não foi possível preparar a pré-visualização (${response.status}).`);
    return response.json();
  }
  const list = await request('/api/bots');
  const bots = Array.isArray(list) ? list : list.bots;
  const starter = bots.find(bot => bot.name === 'Fixture Starter');
  if (!starter) throw new Error('A fixture não tem o agente inicial esperado.');
  // The starter was seeded under a random name from server/names.ts, and its
  // first message keeps it ("Hi, I'm Ivy…") through any rename. Jarvis is
  // created fresh so the Sun greets as itself; the starter is then removed.
  const jarvis = await control(['new-bot', '--url', url, '--name', 'Jarvis', '--title', 'Coordenação']);
  if (!jarvis.success || !jarvis.bot?.id) throw new Error('Não foi possível criar o Jarvis na fixture.');
  await request(`/api/bots/${jarvis.bot.id}`, 'PATCH', { color: 'orange' });
  await request(`/api/bots/${starter.id}`, 'DELETE');
  const definitions = [
    ['Hermes', '01 · Operações', 'Coordenação diária', 'gray', true],
    ['Lua Prata', '01 · Operações', 'Organização', 'gray', false],
    ['Aura', '02 · Comunicação', 'Comunicação', 'yellow', true],
    ['Atlas', '03 · Pesquisa', 'Investigação e síntese', 'blue', true],
    ['Lua Gelo', '03 · Pesquisa', 'Fontes e referências', 'cyan', false],
    ['Ares', '04 · Desenvolvimento', 'Implementação', 'orange', true],
    ['Lua Vulcânica', '04 · Desenvolvimento', 'Qualidade e revisão', 'orange', false],
    ['Juno', '05 · Estratégia', 'Planeamento', 'yellow', true],
    ['Lua Areia', '05 · Estratégia', 'Análise', 'yellow', false],
    ['Nova', '06 · Projetos', 'Projetos', 'purple', true],
    ['Orion', '07 · Design', 'Design e comunicação', 'teal', true],
    ['Nereu', '08 · Conhecimento', 'Conhecimento', 'blue', true],
    ['Lua Crateras', '08 · Conhecimento', 'Arquivo', 'blue', false],
  ];
  for (const [name, section, title, color, chiefOfStaff] of definitions) {
    const created = await control(['new-bot', '--url', url, '--name', name, '--title', title, '--section', section]);
    if (!created.success || !created.bot?.id) throw new Error(`Não foi possível criar ${name} na fixture.`);
    await request(`/api/bots/${created.bot.id}`, 'PATCH', { color, chiefOfStaff });
    if (name === 'Lua Vulcânica') {
      const cwd = join(fixture.info.dataDir, 'solar-demo-project');
      mkdirSync(join(cwd, 'src'), { recursive: true });
      writeFileSync(join(cwd, 'README.md'), '# Solar workspace\n\nThis project is an isolated demonstration.\n\n- Chat stays beside the editor.\n- Save checks the file revision.\n- HTML previews do not execute scripts.\n');
      writeFileSync(join(cwd, 'src', 'agent.ts'), 'export const agent = {\n  name: "Solar",\n  role: "development",\n  parent: "Ares",\n};\n');
      writeFileSync(join(cwd, 'preview.html'), '<style>body{background:#0a1019;color:#e9eef6;padding:40px}h1{font-size:46px;font-weight:400}p{color:#99abc1}</style><h1>Solar</h1><p>A quiet place to build alongside your agent.</p>');
      await request(`/api/bots/${created.bot.id}`, 'PATCH', { cwd });
    }
  }
  console.log('Pré-visualização solar: Jarvis, oito planetas e cinco luas temporárias, com motor simulado.');
}
