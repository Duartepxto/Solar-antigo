import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'docs', 'inventario-solar');
fs.mkdirSync(out, {recursive:true});
const locale = JSON.parse(fs.readFileSync(path.join(root,'orbit-app/src/locales/en.json'),'utf8'));
const flat = {};
function flatten(obj, prefix='') { for (const [k,v] of Object.entries(obj)) { const key=prefix?`${prefix}.${k}`:k; if(typeof v==='string') flat[key]=v; else if(v && typeof v==='object') flatten(v,key); } }
flatten(locale);
function walk(dir) { return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]); }
const dirs=['src/components','src/orbit','src/shell','src/pair','src/lib','src/state','server','electron','companion/src','shared','enterprise/server'];
const files=dirs.flatMap(d=>walk(path.join(root,'orbit-app',d))).filter(f=>/\.(tsx?|mjs|cjs|js)$/.test(f)&&!/(?:test|vendor|testing|goldens)/i.test(f));
const evidence=[];
for(const f of files) {
 const text=fs.readFileSync(f,'utf8'), lines=text.split(/\r?\n/), relative=path.relative(root,f).replaceAll('\\','/');
 const labels=[]; const routes=[]; const tools=[]; const controls=[];
 for(let i=0;i<lines.length;i++) {
  const line=lines[i];
  for(const m of line.matchAll(/\bt\(\s*['"]([^'"]+)['"]/g)) if(flat[m[1]]) labels.push({key:m[1],text:flat[m[1]],line:i+1});
  for(const m of line.matchAll(/["'`]((?:\/api\/|\/webhook)[^"'`\s]*)["'`]/g)) routes.push({path:m[1],line:i+1});
  for(const m of line.matchAll(/\bname:\s*["']([a-z][a-z0-9_]+)["']/g)) if(relative.includes('/server/')) tools.push({name:m[1],line:i+1});
  if(/<button\b|<Switch\b|<MenuItem\b|<input\b|<select\b|<textarea\b|<Seg\b|<Actions\b|<ChipRow\b|<a\b|<MenuButton\b/.test(line)) controls.push({line:i+1,code:line.trim().slice(0,1600)});
 }
 evidence.push({file:relative,labels:[...new Map(labels.map(x=>[x.key,x])).values()],routes:[...new Map(routes.map(x=>[x.path,x])).values()],tools,controls});
}
const profiles=walk(path.join(root,'orbit-app/server/drivers/agents-catalog-goldens')).filter(f=>f.endsWith('.tools-list.json')).map(f=>({profile:path.basename(f),tools:JSON.parse(fs.readFileSync(f,'utf8')).tools}));
fs.writeFileSync(path.join(out,'evidencias.json'),JSON.stringify({date:'2026-10-05',commit:'7ac1c04',version:'0.1.87',method:'Static extraction; labels and controls do not prove runtime reachability or successful execution.',files:evidence,profiles},null,2));
const link=(file,line)=>`[${file}:${line}](${path.join(root,file).replaceAll('\\','/')}:${line})`;
let md='# Solar — índice de interface e código\n\nRevisão de 5 de outubro de 2026; versão 0.1.87; commit 7ac1c04.\n\nExtração estática de componentes, traduções, controlos e referências de API. Uma entrada pode ser condicional, antiga, exclusivamente de outra plataforma ou inacessível no Solar. Não representa um teste de funcionamento. Controlos genéricos e campos dinâmicos podem não ter um rótulo literal extraível.\n\n';
for(const e of evidence.filter(e=>e.labels.length||e.controls.length)) {
 md+=`## ${e.file}\n\nFonte: ${link(e.file,1)}. ${e.controls.length} linhas com controlos reconhecidos.\n\n`;
 if(e.labels.length) md+='| Rótulo / texto | Chave | Fonte |\n| --- | --- | --- |\n'+e.labels.map(x=>`| ${x.text.replaceAll('|','\\|').replaceAll('\n',' ')} | \`${x.key}\` | ${link(e.file,x.line)} |`).join('\n')+'\n\n';
}
fs.writeFileSync(path.join(out,'INDICE-INTERFACE.md'),md);
md='# Solar — referências de API e módulos de backend\n\nExtração estática; inclui referências de clientes e guards, não apenas definições de endpoints. Regex, segmentos dinâmicos e duplicados são conservados para rastreabilidade. Métodos, autenticação e disponibilidade têm de ser confirmados no handler.\n\n';
for(const e of evidence.filter(e=>e.routes.length)) md+=`## ${e.file}\n\n`+e.routes.map(x=>`- \`${x.path}\` — ${link(e.file,x.line)}`).join('\n')+'\n\n';
md+='## Módulos analisados\n\n'+evidence.map(e=>`- ${link(e.file,1)}`).join('\n')+'\n';
fs.writeFileSync(path.join(out,'INDICE-API.md'),md);
md='# Solar — catálogo de ferramentas dos agentes\n\nOs três snapshots guardados no repositório têm perfis diferentes; a disponibilização real depende do agente, turno, permissões e capacidades. As descrições abaixo são do código local e conservam a língua original. Incluem ferramentas que não existem como botões.\n\n';
const names = new Map();
for(const p of profiles) for(const t of p.tools??[]) { if(!names.has(t.name)) names.set(t.name,{...t,profiles:[]}); names.get(t.name).profiles.push(p.profile); }
for(const t of names.values()) md+=`## ${t.name}\n\n${t.description}\n\nPerfis: ${t.profiles.join(', ')}.\n\nParâmetros: ${Object.keys(t.inputSchema?.properties??{}).map(k=>`\`${k}\``).join(', ')||'nenhum'}. Obrigatórios: ${(t.inputSchema?.required??[]).join(', ')||'nenhum'}.\n\n`;
md+='## Nomes literais adicionais encontrados no código\n\n'+evidence.filter(e=>e.tools.length).map(e=>`### ${e.file}\n\n`+e.tools.map(t=>`- \`${t.name}\` — ${link(e.file,t.line)}`).join('\n')).join('\n\n');
fs.writeFileSync(path.join(out,'FERRAMENTAS-AGENTES.md'),md);
console.log(JSON.stringify({files:evidence.length,uiFiles:evidence.filter(e=>e.controls.length).length,labelReferences:evidence.reduce((n,e)=>n+e.labels.length,0),controlLines:evidence.reduce((n,e)=>n+e.controls.length,0),apiReferences:evidence.reduce((n,e)=>n+e.routes.length,0),snapshotTools:names.size,out}));
