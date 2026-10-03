/* Jarvis product layer built on the saved Orbit interaction system.
   No connector or model is implied by the sample conversations. */
const STORE_KEY = 'jarvis-orbit-workspace-v1';
const readStore = () => { try { return JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch { return {}; } };
const prior = readStore();
const defaults = {
  language: 'pt', model: 'Codex CLI', voice: false, notifications: false,
  tasks: [
    { id: 'task-1', title: 'Rever o rascunho de e-mail', due: 'Hoje', done: false, source: 'Correio', demo: true },
    { id: 'task-2', title: 'Confirmar o estado do portfólio', due: 'Esta semana', done: false, source: 'Projetos', demo: true },
    { id: 'task-3', title: 'Reservar duas horas de foco', due: 'Amanhã', done: false, source: 'Agenda', demo: true }
  ],
  approvals: [
    { id: 'approval-email', agent: 'emaily', title: 'Enviar resposta preparada', detail: 'Mensagem de exemplo para um cliente. Nenhum e-mail será enviado.', action: 'Rever o rascunho e preparar o envio', state: 'pending', demo: true },
    { id: 'approval-project', agent: 'probe', title: 'Atualizar snapshots', detail: 'Alteração de exemplo num projeto. Nenhum ficheiro será alterado.', action: 'Atualizar snapshots de teste', state: 'pending', demo: true }
  ],
  activity: [
    { id: 'act-1', at: Date.now() - 18 * 60_000, agent: 'Radar', text: 'Encaminhou uma pesquisa para a equipa.', type: 'research', demo: true },
    { id: 'act-2', at: Date.now() - 48 * 60_000, agent: 'Vigia', text: 'Preparou um ponto de situação dos projetos.', type: 'project', demo: true },
    { id: 'act-3', at: Date.now() - 96 * 60_000, agent: 'Correio', text: 'Preparou um rascunho para revisão.', type: 'mail', demo: true }
  ],
  events: [
    { id: 'event-1', title: 'Bloco de foco', when: 'Amanhã · 10:00–12:00', demo: true },
    { id: 'event-2', title: 'Revisão semanal', when: 'Sexta · 16:00', demo: true }
  ],
  projects: [{ id: 'project-demo', name: 'Portfólio', repo: '', stage: 'A aguardar ligação ao GitHub', demo: true }],
  mail: [
    { id: 'mail-1', from: 'Cliente (exemplo)', subject: 'Pedido de atualização', note: 'Revisão recomendada antes de responder.', important: true, demo: true },
    { id: 'mail-2', from: 'IPCA (exemplo)', subject: 'Atualização académica', note: 'Resumo por preparar após ligar o Outlook.', important: false, demo: true }
  ],
  briefs: [], customAgents: [], rules: [], messages: {}
};
const work = Object.fromEntries(Object.entries(defaults).map(([key, value]) => [key, prior[key] ?? value]));
if (!Array.isArray(work.approvals)) work.approvals = defaults.approvals;
for (const item of work.approvals) {
  item.action ||= item.agent === 'emaily' ? 'Rever o rascunho e preparar o envio' : item.agent === 'probe' ? 'Atualizar snapshots de teste' : 'Ação proposta';
  item.createdAt ||= Date.now();
  item.history ||= [{ state: 'pending', at: item.createdAt, note: 'Proposta apresentada', action: item.action }];
}
const persist = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(work)); } catch { /* Private browsing or full storage */ } };
const uid = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
const nowDate = () => new Date().toLocaleDateString(work.language === 'en' ? 'en-GB' : 'pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
const todayKey = () => new Date().toISOString().slice(0, 10);
const relativeTime = ms => new Date(ms).toLocaleTimeString(work.language === 'en' ? 'en-GB' : 'pt-PT', { hour: '2-digit', minute: '2-digit' });
const say = (pt, en) => work.language === 'en' ? en : pt;
const safe = value => escapeHtml(value ?? '');
const agentMeta = {
  atlas: { name: 'Radar', role: 'Coordena a pesquisa', prompt: 'Procura fontes para o próximo resumo.', tools: ['Delegou a Fontes', 'Delegou a Arquivo', 'Pediu a Síntese um resumo'], reply: 'Dividi a pesquisa pela equipa. Trago-te um resumo com fontes assim que estiver pronto.', ask: 'quer criar um novo especialista de pesquisa', cmd: 'proposta · novo subagente' },
  brody: { name: 'Fontes', role: 'Dados e fontes', prompt: 'Confirma os dados desta pesquisa.', tools: ['Organizou as fontes', 'Assinalou referências por confirmar'], reply: 'Separei o que está confirmado do que ainda precisa de verificação.', ask: 'quer consultar uma fonte externa', cmd: 'pesquisa · fonte externa' },
  quill: { name: 'Síntese', role: 'Resumos', prompt: 'Faz um resumo claro desta informação.', tools: ['Leu as notas de pesquisa', 'Preparou os pontos principais'], reply: 'O resumo está organizado por conclusões, evidências e pontos por confirmar.', ask: 'quer publicar um resumo', cmd: 'publicar · resumo' },
  ferret: { name: 'Arquivo', role: 'Memória da pesquisa', prompt: 'Organiza estas referências.', tools: ['Classificou documentos', 'Associou fontes ao projeto'], reply: 'As referências estão agrupadas e podem ser retomadas mais tarde.', ask: 'quer guardar uma nova fonte', cmd: 'memória · fonte' },
  clive: { name: 'Vigia', role: 'Acompanha projetos', prompt: 'Dá-me o ponto de situação dos meus projetos.', tools: ['Consultou atividade de exemplo', 'Preparou um resumo por projeto'], reply: 'Há alterações para rever. Ligar o GitHub permitirá acompanhar repositórios reais.', ask: 'quer alterar uma regra de acompanhamento', cmd: 'proposta · projeto' },
  gitscout: { name: 'GitHub', role: 'Commits e PRs', prompt: 'Resume as alterações recentes.', tools: ['Organizou commits de exemplo', 'Assinalou PRs por rever'], reply: 'O projeto está pronto para acompanhar alterações quando ligares o GitHub.', ask: 'quer publicar um branch', cmd: 'git push · requer ligação' },
  probe: { name: 'Revisão', role: 'Estado e qualidade', prompt: 'Verifica o estado do projeto.', tools: ['Reuniu resultados de exemplo', 'Preparou pontos de revisão'], reply: 'Há uma decisão de exemplo à tua espera. Nenhum ficheiro foi alterado.', ask: 'quer atualizar snapshots', cmd: 'pnpm test --update-snapshots' },
  patch: { name: 'Entrega', role: 'Publicações', prompt: 'Prepara a próxima entrega.', tools: ['Organizou uma checklist', 'Assinalou passos pendentes'], reply: 'A checklist está pronta. Publicar alterações exigirá uma ligação e uma instrução tua.', ask: 'quer publicar uma versão', cmd: 'publicar · requer aprovação' },
  emaily: { name: 'Correio', role: 'Gmail e Outlook', prompt: 'Resume o correio importante.', tools: ['Organizou mensagens de exemplo', 'Preparou um rascunho de demonstração'], reply: 'Há um rascunho de exemplo para rever. Liga Gmail ou Outlook para analisar mensagens reais.', ask: 'quer enviar uma resposta', cmd: 'enviar e-mail · aprovação necessária' },
  omiii: { name: 'Agenda', role: 'Calendário', prompt: 'Organiza o meu dia de amanhã.', tools: ['Consultou eventos de exemplo', 'Propôs um bloco de foco'], reply: 'Propus duas horas de foco. Para atualizar o calendário real, será preciso ligar a conta.', ask: 'quer alterar um evento', cmd: 'Google Calendar · requer ligação' },
  tally: { name: 'Diário', role: 'Resumo do dia', prompt: 'Faz a ata do dia.', tools: ['Reuniu tarefas e decisões', 'Preparou o resumo diário'], reply: 'O resumo do dia está disponível no painel do Jarvis e pode ser guardado no histórico.', ask: 'quer guardar a ata', cmd: 'guardar · histórico local' }
};
teams[0].name = 'Pesquisa'; teams[1].name = 'Projetos'; teams[2].name = 'Pessoal';
room.name = '#colaboração';
for (const [id, meta] of Object.entries(agentMeta)) Object.assign(bots[id], meta, { engine: 'Nenhum', model: 'Por ligar', works: 'Por ligar' });
const capLabels = {
  engine: ['MOTOR','ENGINE'], computer: ['COMPUTADOR','COMPUTER'], browser: ['NAVEGADOR','BROWSER'], phone: ['TELEMÓVEL','PHONE'],
  apps: ['APPS','APPS'], approvals: ['APROVAÇÕES','APPROVALS'], skills: ['CAPACIDADES','SKILLS'], memory: ['MEMÓRIA','MEMORY'],
  routines: ['ROTINAS','ROUTINES'], voice: ['VOZ','VOICE']
};
function localizeAgentCaps(){for(const cap of caps)cap[1]=say(...capLabels[cap[0]]);}
localizeAgentCaps();
const addCustomAgent = (record, save = true) => {
  const team = teams.find(item => item.id === record.team) || teams[2];
  if (bots[record.id]) return;
  bots[record.id] = { name: record.name, role: record.role, team: team.id, color: record.color,
    engine: work.model, model: 'Por configurar', works: 'Por configurar',
    prompt: `Apresenta-te e explica a tua função: ${record.role}.`, tools: ['Agente criado localmente'],
    reply: 'Estou pronto para receber instruções. Liga um motor de IA para executar tarefas.',
    ask: 'aguarda configuração', cmd: 'configuração · motor de IA' };
  const count = team.members.length;
  team.members.push(record.id);
  const angle = (count - 1) * .75 - 1.2;
  home[record.id] = { x: home[team.chief].x + Math.cos(angle) * (count > 5 ? 245 : 185), y: home[team.chief].y + Math.sin(angle) * (count > 5 ? 245 : 185), r: 23 };
  if (save) { work.customAgents.push(record); persist(); recordActivity('Jarvis', `Criou o subagente ${record.name}.`, 'system'); }
};
for (const record of work.customAgents) addCustomAgent(record, false);
for (const [id, messages] of Object.entries(work.messages)) if (bots[id] && Array.isArray(messages)) state.threads[id] = messages;

const chrome = document.querySelector('.chrome');
const badge = document.createElement('span'); badge.className = 'demo-badge'; badge.innerHTML = '<i></i> PRÉ-VISUALIZAÇÃO LOCAL';
chrome.insertBefore(badge, $('searchButton'));
document.title = 'Jarvis — Mapa da equipa';
document.querySelector('.window').setAttribute('aria-label', 'Jarvis · assistente pessoal');
$('searchButton').setAttribute('aria-label', 'Pesquisar agentes e ações');
$('searchButton').lastChild.textContent = 'Pesquisar ou saltar · Ctrl K';
$('back').innerHTML = '‹ <span>Mapa da equipa</span><kbd>esc</kbd>';
$('keyButton').innerHTML = '⌗ &nbsp; Legenda';
$('fit').textContent = 'Ajustar';
$('overviewInput').placeholder = 'Pede algo ao Radar';
$('overviewInput').setAttribute('aria-label', 'Mensagem para um agente');
document.querySelector('#statusText').textContent = 'Mapa em demonstração';

function recordActivity(agent, text, type = 'system', demo = false) {
  work.activity.unshift({ id: uid('activity'), at: Date.now(), agent, text, type, demo });
  work.activity = work.activity.slice(0, 100);
  persist();
}
function addTask(title, due = 'Sem prazo', source = 'Jarvis') {
  work.tasks.unshift({ id: uid('task'), title: title.trim(), due, done: false, source, demo: false });
  persist(); recordActivity('Jarvis', `Adicionou a tarefa “${title.trim()}”.`, 'task');
}
function pendingApprovals() { return work.approvals.filter(item => item.state === 'pending'); }
function pendingTasks() { return work.tasks.filter(item => !item.done); }
function briefingText() {
  const tasks = pendingTasks();
  const approvals = pendingApprovals();
  const projects = work.projects.length;
  return say(
    `Tens ${tasks.length} ${tasks.length === 1 ? 'tarefa pendente' : 'tarefas pendentes'} e ${approvals.length} ${approvals.length === 1 ? 'decisão à espera' : 'decisões à espera'}. ${projects} ${projects === 1 ? 'projeto está' : 'projetos estão'} no teu radar. As ligações externas ainda não estão ativas.`,
    `You have ${tasks.length} open ${tasks.length === 1 ? 'task' : 'tasks'} and ${approvals.length} ${approvals.length === 1 ? 'decision' : 'decisions'} waiting. ${projects} ${projects === 1 ? 'project is' : 'projects are'} on your radar. External connections are not active yet.`
  );
}
function saveBrief() {
  const key = todayKey();
  const brief = { id: uid('brief'), date: key, title: `Ata de ${nowDate()}`, text: briefingText(),
    tasks: pendingTasks().map(task => task.title), decisions: pendingApprovals().map(item => item.title),
    activity: work.activity.filter(item => new Date(item.at).toISOString().slice(0, 10) === key).slice(0, 8).map(item => `${item.agent}: ${item.text}`) };
  const index = work.briefs.findIndex(item => item.date === key);
  if (index >= 0) work.briefs[index] = brief; else work.briefs.unshift(brief);
  persist(); recordActivity('Diário', 'Guardou a ata do dia no histórico local.', 'brief');
  return brief;
}

const sectionMeta = {
  chat: ['CONVERSA','CHAT','●'], briefing: ['RESUMO','BRIEFING','◷'], tasks: ['TAREFAS','TASKS','✓'], activity: ['ATIVIDADE','ACTIVITY','≋'],
  inbox: ['CORREIO','MAIL','✉'], calendar: ['AGENDA','CALENDAR','▦'], projects: ['PROJETOS','PROJECTS','⌘'],
  approvals: ['APROVAÇÕES','APPROVALS','◇'], connections: ['LIGAÇÕES','CONNECTIONS','◎'],
  models: ['MODELOS','MODELS','◈'], voice: ['VOZ','VOICE','≋'], memory: ['MEMÓRIA','MEMORY','▤'], settings: ['PREFERÊNCIAS','SETTINGS','⚙']
};
const phoneIcon='<svg class="call-pill-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5 9.2 6l-1.6 2.2c1.3 2.8 3.4 4.9 6.2 6.2l2.2-1.6 2.5 2.6-1.5 3.3c-.3.6-1 .9-1.7.7C9.4 17.9 6.1 14.6 4.6 8.7c-.2-.7.1-1.4.7-1.7l1.3-.6Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const originalHubCaps = hubCaps;
const ringKeys = ['chat','briefing','tasks','inbox','calendar','projects','approvals','connections','models','activity','settings'];
hubCaps = function () {
  if (state.hub !== 'you') return originalHubCaps();
  return ringKeys.map(key => [key, say(sectionMeta[key][0], sectionMeta[key][1]), sectionMeta[key][2]]);
};
const originalCapValue = capValue;
capValue = function (key) {
  if (state.focus) {
    const values={engine:say('Por ligar','Not connected'),computer:say('Por ligar','Not connected'),browser:say('Sem acesso','No access'),phone:say('Sem acesso','No access'),apps:say('Por ligar','Not connected'),approvals:say('Pedir confirmação','Ask first'),skills:say('Por configurar','Not configured'),memory:say('Local','Local'),routines:say('Sem rotinas','No routines'),voice:say('Disponível no PC','Available on PC')};
    return values[key]||say('Abrir','Open');
  }
  if (state.hub !== 'you') return originalCapValue(key);
  const vals = {
    chat: say('Falar com Jarvis','Talk to Jarvis'), briefing: say('Hoje','Today'), tasks: `${pendingTasks().length} ${say('por fazer','open')}`,
    activity: `${work.activity.length} ${say('registos','entries')}`, inbox: say('Por ligar','Not connected'),
    calendar: `${work.events.length} ${say(work.events.length===1?'evento':'eventos',work.events.length===1?'event':'events')}`, projects: `${work.projects.length} ${say(work.projects.length===1?'projeto':'projetos',work.projects.length===1?'project':'projects')}`,
    approvals: `${pendingApprovals().length} ${say('pendentes','pending')}`, connections: say('4 serviços','4 services'),
    models: work.model, voice: work.voice ? say('Ativa','On') : say('Desligada','Off'),
    memory: say('Local','Local'), settings: work.language.toUpperCase()
  };
  return vals[key] || say('Abrir','Open');
};
const originalUpdateCaps=updateCaps;
let capScene='';
updateCaps=function(){
  originalUpdateCaps();
  const scene=state.focus||state.hub||'';
  if(!scene){capScene='';return;}
  if(scene===capScene)return;
  capScene=scene;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  requestAnimationFrame(()=>{
    if((state.focus||state.hub)!==scene)return;
    const center=focusGeom();
    [...$('caps').querySelectorAll('.cap')].forEach((element,index,all)=>{
      const x=Number.parseFloat(element.style.left),y=Number.parseFloat(element.style.top);
      const dx=center.fx-x,dy=center.fy-y,angle=-Math.PI/2+index*Math.PI*2/all.length;
      const tangentX=-Math.sin(angle)*40,tangentY=Math.cos(angle)*40;
      element.animate([
        {opacity:0,filter:'blur(5px)',transform:`translate(-50%,-50%) translate(${dx}px,${dy}px) rotate(-70deg) scale(.25)`},
        {offset:.7,opacity:1,filter:'blur(0px)',transform:`translate(-50%,-50%) translate(${dx*.18+tangentX}px,${dy*.18+tangentY}px) rotate(12deg) scale(1.06)`},
        {opacity:1,filter:'blur(0px)',transform:'translate(-50%,-50%) translate(0,0) rotate(0) scale(1)'}
      ],{duration:570,delay:index*35,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
    });
  });
};
const originalRenderHubDetail = renderHubDetail;
renderHubDetail = function () {
  if (state.hub !== 'you') return renderTeamDetail();
  return renderJarvisDetail();
};
const iconFor = key => sectionMeta[key]?.[2] || '◈';
const panelShell = (key, title, description, inner) => `<div class="detail jarvis-detail" data-section="${key}">
  <div class="detail-heading" style="--detail-color:var(--jarvis)"><span class="detail-icon">${iconFor(key)}</span><div><span class="detail-kicker">JARVIS</span><h2>${safe(title)}</h2></div></div>
  ${description ? `<p class="dashboard-notice">${safe(description)}</p>` : ''}${inner}</div>`;
const card = (content, extra = '') => `<article class="panel-card ${extra}">${content}</article>`;
const status = (text, type = 'demo') => `<span class="status-pill ${type}">${safe(text)}</span>`;
const heading = (title, sub = '') => `<div class="list-heading"><h3>${safe(title)}</h3>${sub ? `<small>${safe(sub)}</small>` : ''}</div>`;
let proposalAgentDraft = 'emaily';
const approvalState = item => ({pending:say('À tua espera','Waiting for you'),revision:say('Alterações pedidas','Changes requested'),approved:say('Aprovada','Approved'),denied:say('Recusada','Denied')})[item.state] || item.state;
function approvalCard(item, compact = false) {
  const agent = bots[item.agent]?.name || 'Jarvis';
  const events = Array.isArray(item.history) ? item.history : [];
  return card(`<div class="card-top"><strong>${safe(item.title)}</strong>${status(approvalState(item),item.state==='pending'?'waiting':item.state==='approved'?'live':'demo')}</div>
    <div class="card-meta"><i style="--dot:${bots[item.agent]?.color||'#a8d5ec'}"></i>${safe(agent)} · ${item.demo?say('exemplo','sample'):say('proposta local','local proposal')} · ${safe(relativeTime(item.createdAt))}</div>
    <div class="card-text">${safe(item.detail)}</div>
    <div class="approval-proposal"><small>${say('AÇÃO PROPOSTA','PROPOSED ACTION')}</small><span>${safe(item.action)}</span></div>
    ${item.feedback ? `<div class="approval-feedback"><small>${say('ALTERAÇÕES PEDIDAS','REQUESTED CHANGES')}</small><span>${safe(item.feedback)}</span></div>` : ''}
    ${item.state==='pending'?`<div class="card-actions"><button class="primary" data-action="approve" data-id="${safe(item.id)}">${say('Aprovar','Approve')}</button><button data-action="request-changes" data-id="${safe(item.id)}">${say('Pedir alterações','Request changes')}</button><button class="warn" data-action="deny" data-id="${safe(item.id)}">${say('Recusar','Deny')}</button></div>
      <form class="approval-change-form hidden" data-form="approval-change" data-id="${safe(item.id)}"><label>${say('O que deve mudar?','What should change?')}<textarea name="feedback" required maxlength="500" placeholder="${say('Explica a alteração que queres ver…','Describe the change you want…')}"></textarea></label><div class="card-actions"><button class="primary" type="submit">${say('Enviar ao agente','Send to agent')}</button><button type="button" data-action="cancel-changes" data-id="${safe(item.id)}">${say('Cancelar','Cancel')}</button></div></form>`:''}
    ${item.state==='revision'?`<form class="approval-revise-form" data-form="approval-revise" data-id="${safe(item.id)}"><label>${say('Nova proposta','Revised proposal')}<textarea name="action" required maxlength="500">${safe(item.action)}</textarea></label><button class="small-action primary" type="submit">${say('Reapresentar para decisão','Resubmit for decision')}</button></form>`:''}
    ${!compact?`<details class="approval-history"><summary>${say('Histórico da decisão','Decision history')} · ${events.length}</summary>${events.map(event=>`<div class="approval-history-row"><i></i><span>${safe(({pending:say('Proposta apresentada','Proposal submitted'),revision:say('Alterações pedidas','Changes requested'),approved:say('Aprovada','Approved'),denied:say('Recusada','Denied')})[event.state]||event.state)}${event.note?` · ${safe(event.note)}`:''}${event.state==='pending'&&event.action?`<small>${say('Ação:','Action:')} ${safe(event.action)}</small>`:''}</span><time>${safe(relativeTime(event.at))}</time></div>`).join('')}</details>`:''}
    ${!compact?`<button class="approval-open" data-agent="${safe(item.agent)}">${say('Abrir conversa com','Open conversation with')} ${safe(agent)} ↗</button>`:''}
    ${compact?`<button class="approval-open" data-open-section="approvals">${say('Abrir caixa de decisões','Open decision inbox')} ↗</button>`:''}
    <small class="approval-local-note">${say('A decisão fica registada localmente; não executa ações externas.','The decision is saved locally; it performs no external action.')}</small>`,item.state==='pending'?'attention':'approval-record');
}

function renderJarvisDetail() {
  const key = state.detail || 'briefing';
  if (key === 'briefing') {
    const last = work.briefs[0];
    return panelShell(key, say('O teu dia','Your day'), say('Resumo calculado a partir do que está nesta aplicação. As contas externas ainda não estão ligadas.','Summary based on what is stored in this app. External accounts are not connected yet.'), `
      <span class="briefing-date">${safe(nowDate())}</span>
      <h3 class="briefing-title">${say('Bom regresso.','Welcome back.')}</h3>
      <p class="briefing-copy">${safe(briefingText())}</p>
      <div class="metric-strip"><div><strong>${pendingTasks().length}</strong><span>${say('TAREFAS','TASKS')}</span></div><div><strong>${pendingApprovals().length}</strong><span>${say('DECISÕES','DECISIONS')}</span></div><div><strong>${work.projects.length}</strong><span>${say('PROJETOS','PROJECTS')}</span></div></div>
      <div class="card-actions"><button class="primary" data-action="save-brief">${say('Guardar ata de hoje','Save today’s record')}</button><button data-open-section="activity">${say('Ver atividade','View activity')}</button></div>
      ${heading(say('À tua espera','Waiting for you'))}
      ${pendingApprovals().slice(0, 2).map(item => card(`<div class="card-top"><strong>${safe(item.title)}</strong>${status(approvalState(item),'waiting')}</div><div class="card-text">${safe(item.detail)}</div><div class="card-actions"><button data-open-section="approvals">${say('Rever decisão','Review decision')}</button></div>`,'attention')).join('') || `<div class="empty-state">${say('Não há decisões pendentes.','No decisions are waiting.')}</div>`}
      ${heading(say('Histórico diário','Daily history'), `${work.briefs.length} ${say('atas','records')}`)}
      ${last ? card(`<div class="card-top"><strong>${safe(last.title)}</strong><small>${safe(last.date)}</small></div><div class="card-text">${safe(last.text)}</div>`):`<div class="empty-state">${say('Guarda o primeiro resumo para começares o histórico.','Save the first daily record to start the history.')}</div>`}`);
  }
  if (key === 'tasks') return panelShell(key, say('Tarefas','Tasks'), say('A tua lista fica guardada neste computador. O Jarvis pode juntá-la ao resumo diário.','Your list stays on this computer and feeds the daily summary.'), `
    <form class="input-row" data-form="task"><input name="title" required maxlength="140" placeholder="${say('Nova tarefa…','New task…')}"><button class="small-action primary" type="submit">${say('Adicionar','Add')}</button></form>
    ${heading(say('Por fazer','To do'),`${pendingTasks().length}`)}
    ${work.tasks.filter(item=>!item.done).map(taskRow).join('') || `<div class="empty-state">${say('Tudo tratado por agora.','Everything is done for now.')}</div>`}
    ${work.tasks.some(item=>item.done) ? heading(say('Concluídas','Completed')) + work.tasks.filter(item=>item.done).map(taskRow).join('') : ''}`);
  if (key === 'activity') return panelShell(key, say('Atividade','Activity'), say('O registo mostra ações locais e exemplos separados por etiqueta.','This log shows local actions and labelled samples.'), `
    ${heading(say('Mais recente','Latest'),`${work.activity.length} ${say('registos','entries')}`)}
    ${work.activity.map(item=>`<div class="timeline-row"><i class="timeline-dot" style="--event-color:${item.type==='project'?'#75dda7':item.type==='mail'?'#61d2e9':item.type==='research'?'#ff9a7e':'#a8cbe7'}"></i><div class="row-main"><strong>${safe(item.agent)} · ${safe(item.text)}</strong><small>${safe(relativeTime(item.at))} ${item.demo ? `· ${say('exemplo','sample')}`:''}</small></div></div>`).join('')}`);
  if (key === 'inbox') return panelShell(key, say('Correio','Mail'), say('O Gmail e o Outlook estão por ligar. Estas mensagens são exemplos; nada será enviado automaticamente.','Gmail and Outlook are not connected. These messages are samples; nothing is sent automatically.'), `
    <div class="card-actions"><button data-open-section="connections">${say('Configurar contas','Set up accounts')}</button><button data-agent="emaily">${say('Falar com Correio','Talk to Mail')}</button></div>
    ${heading(say('Caixa de entrada · exemplo','Inbox · sample'))}
    ${work.mail.map(item=>`<div class="mail-row"><i class="timeline-dot" style="--event-color:${item.important?'#ffae76':'#6dcde9'}"></i><div class="row-main"><strong>${safe(item.subject)}</strong><small>${safe(item.from)} · ${safe(item.note)}</small></div>${item.important?status(say('Importante','Important'),'waiting'):''}</div>`).join('')}
    ${heading(say('Regras de atenção','Alert rules'),`${work.rules.length}`)}
    <form class="input-row" data-form="rule"><input name="rule" required maxlength="120" placeholder="${say('Ex.: avisar se vier do IPCA','E.g. alert me about IPCA mail')}"><button class="small-action" type="submit">${say('Guardar','Save')}</button></form>
    ${work.rules.map(rule=>`<div class="detail-row"><span>${safe(rule.text)}</span><button class="row-button" data-action="delete-rule" data-id="${safe(rule.id)}" aria-label="${say('Apagar regra','Delete rule')}">×</button></div>`).join('') || `<p class="narrow-note">${say('As regras ficam locais até ligares as contas.','Rules remain local until accounts are connected.')}</p>`}`);
  if (key === 'calendar') return panelShell(key, say('Agenda','Calendar'), say('Eventos locais de exemplo e notas tuas. A sincronização com Google Calendar será ligada mais tarde.','Local sample events and your notes. Google Calendar sync can be connected later.'), `
    <div class="card-actions"><button data-open-section="connections">${say('Configurar Google Calendar','Set up Google Calendar')}</button><button data-agent="omiii">${say('Abrir Agenda','Open Calendar agent')}</button></div>
    ${heading(say('Próximos eventos','Upcoming events'))}
    ${work.events.map(item=>`<div class="calendar-row"><i class="timeline-dot" style="--event-color:#7b93ff"></i><div class="row-main"><strong>${safe(item.title)}</strong><small>${safe(item.when)} ${item.demo?'· exemplo':''}</small></div><button class="row-button" data-action="delete-event" data-id="${safe(item.id)}" aria-label="${say('Remover evento','Remove event')}">×</button></div>`).join('')}
    <form class="input-row" data-form="event"><input name="title" required maxlength="120" placeholder="${say('Novo evento…','New event…')}"><input name="when" required maxlength="80" placeholder="${say('Quando?','When?')}" style="max-width:115px"><button class="small-action" type="submit">+</button></form>`);
  if (key === 'projects') return panelShell(key, say('Projetos','Projects'), say('Adiciona um repositório público para acompanhar dados básicos. Repositórios privados exigirão uma ligação ao GitHub.','Add a public repository to track basic information. Private repositories will require a GitHub connection.'), `
    ${heading(say('No radar','On the radar'),`${work.projects.length}`)}
    ${work.projects.map(project=>card(`<div class="card-top"><strong>${safe(project.name)}</strong>${status(project.demo?say('Exemplo','Sample'):say('Público','Public'),'demo')}</div><div class="card-text">${safe(project.stage)}</div>${project.repo?`<small>${safe(project.repo)}</small>`:''}<div class="card-actions">${project.repo?`<button data-action="refresh-project" data-id="${safe(project.id)}">${say('Atualizar','Refresh')}</button>`:''}<button data-agent="clive">${say('Abrir Vigia','Open Watcher')}</button>${!project.demo?`<button class="warn" data-action="delete-project" data-id="${safe(project.id)}">${say('Remover','Remove')}</button>`:''}</div>`)).join('')}
    <form class="agent-builder" data-form="project"><input class="panel-field" name="name" required maxlength="100" placeholder="${say('Nome do projeto','Project name')}"><div class="input-row"><input name="repo" type="url" required placeholder="https://github.com/utilizador/repositorio"><button class="small-action primary" type="submit">${say('Adicionar','Add')}</button></div></form>`);
  if (key === 'approvals') return panelShell(key, say('Caixa de decisões','Decision inbox'), say('Cada proposta mostra o contexto, a ação e o agente. As decisões ficam locais; nenhuma aprovação executa ações externas nesta versão.','Each proposal shows its context, action and agent. Decisions stay local; approvals perform no external action in this version.'), `
    ${heading(say('À tua espera','Waiting for you'),`${pendingApprovals().length}`)}
    ${pendingApprovals().map(item=>approvalCard(item)).join('') || `<div class="empty-state">${say('Não há decisões pendentes. Os outros agentes podem continuar enquanto uma proposta aguarda alterações.','No decisions are waiting. Other agents can keep working while a proposal awaits changes.')}</div>`}
    ${work.approvals.some(item=>item.state==='revision')?heading(say('Alterações pedidas','Changes requested'))+work.approvals.filter(item=>item.state==='revision').map(item=>approvalCard(item)).join(''):''}
    ${heading(say('Preparar proposta local','Prepare a local proposal'))}
    <form class="agent-builder approval-create" data-form="approval-create"><select class="panel-select" name="agent" aria-label="${say('Agente responsável','Responsible agent')}">${Object.entries(bots).map(([id,bot])=>`<option value="${safe(id)}" ${id===proposalAgentDraft?'selected':''}>${safe(bot.name)} · ${safe(bot.role)}</option>`).join('')}</select><input class="panel-field" name="title" required maxlength="120" placeholder="${say('Título da decisão','Decision title')}"><textarea name="detail" required maxlength="600" placeholder="${say('Contexto: porque é necessária esta decisão?','Context: why is this decision needed?')}"></textarea><textarea name="action" required maxlength="500" placeholder="${say('Ação concreta proposta','The specific proposed action')}"></textarea><button class="small-action primary" type="submit">${say('Apresentar decisão','Submit proposal')}</button></form>
    ${work.approvals.some(item=>item.state==='approved'||item.state==='denied')?heading(say('Histórico','History'))+work.approvals.filter(item=>item.state==='approved'||item.state==='denied').map(item=>approvalCard(item)).join(''):''}`);
  if (key === 'connections') return panelShell(key, say('Ligações','Connections'), say('A estrutura está preparada. Ligar contas reais requer autenticação própria e permissões específicas.','The structure is ready. Real accounts require their own authentication and scoped permissions.'), `
    ${[['Gmail','Resumos, alertas e rascunhos','G'],['Outlook · IPCA','Correio académico','O'],['Google Calendar','Eventos e propostas','C'],['GitHub','Projetos, PRs e commits','⌘']].map(([name,description,icon])=>`<div class="connection-row"><span class="connection-icon">${icon}</span><span class="connection-body"><strong>${name}</strong><small>${safe(description)}</small></span>${status(say('Por ligar','Not connected'))}</div>`).join('')}
    <p class="narrow-note">${say('Os agentes não conseguem ler contas, enviar e-mails ou modificar repositórios nesta versão.','Agents cannot read accounts, send email or modify repositories in this version.')}</p>`);
  if (key === 'models') return panelShell(key, say('Modelos de IA','AI models'), say('Escolhe a preferência para quando ligares um motor. Nenhum modelo está ligado nesta pré-visualização.','Choose a preference for when an engine is connected. No model is connected in this preview.'), `
    ${heading(say('Preferência principal','Primary preference'))}
    <div class="mode-grid">${['Codex CLI','Claude Code','Gemini CLI','Modelo local'].map(name=>`<button type="button" class="${work.model===name?'active':''}" data-action="model" data-value="${name}"><strong>${name}</strong><small>${name==='Codex CLI'?say('Escolhido por ti','Your current choice'):name==='Modelo local'?say('Sem cloud','No cloud'):say('Por configurar','Not configured')}</small></button>`).join('')}</div>
    ${heading(say('Princípio de custos','Cost preference'))}
    ${card(`<div class="card-top"><strong>${say('Gastar o mínimo possível','Minimize spending')}</strong>${status(say('Ativo','Active'),'live')}</div><div class="card-text">${say('Encaminhar tarefas simples para opções gratuitas ou locais quando houver ligação, e reservar modelos melhores para decisões e planeamento.','Route simple work to free or local options when connected, and reserve stronger models for planning and decisions.')}</div>`)}`);
  if (key === 'voice') return panelShell(key, say('Voz','Voice'), say('Usa a voz de síntese disponível neste navegador/Windows. Não exige ElevenLabs. A disponibilidade depende do sistema.','Uses speech synthesis available in this browser/Windows. ElevenLabs is not required. Availability depends on the system.'), `
    <div class="voice-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
    <label class="toggle-line"><span>${say('Ler respostas em voz alta','Read replies aloud')}</span><input data-setting="voice" type="checkbox" ${work.voice?'checked':''}></label>
    <div class="card-actions"><button data-action="sample-voice">${say('Ouvir exemplo','Hear sample')}</button></div>
    <p class="narrow-note">${say('O controlo de voz por microfone fica para uma fase posterior.','Microphone control comes later.')}</p>`);
  if (key === 'memory') return panelShell(key, say('Memória','Memory'), say('As notas ficam neste navegador, neste computador. Poderás revê-las e apagá-las.','Notes stay in this browser on this computer. You can review and erase them.'), `
    <textarea id="memoryNotes" class="hub-text" placeholder="${say('Preferências, projetos e contexto que queres que o Jarvis recorde…','Preferences, projects and context for Jarvis to remember…')}">${safe(work.memoryNotes||'')}</textarea>
    <div class="card-actions"><button class="primary" data-action="save-memory">${say('Guardar memória','Save memory')}</button></div>
    <p class="narrow-note">${say('Estas notas ainda não são enviadas a nenhum serviço de IA.','These notes are not sent to any AI service yet.')}</p>`);
  if (key === 'settings') return panelShell(key, say('Preferências','Settings'), say('Controla idioma, notificações e a organização da tua equipa.','Control language, notifications and your team.'), `
    ${heading(say('Idioma','Language'))}<div class="mode-grid"><button data-action="language" data-value="pt" class="${work.language==='pt'?'active':''}"><strong>Português</strong><small>PT</small></button><button data-action="language" data-value="en" class="${work.language==='en'?'active':''}"><strong>English</strong><small>EN</small></button></div>
    ${heading(say('Notificações no PC','Desktop notifications'))}<div class="card-actions"><button data-action="notifications">${say('Ativar notificações','Enable notifications')}</button></div>
    <p class="narrow-note">${say('Só são pedidas permissões quando clicares. Alertas no telemóvel exigem uma aplicação companheira.','Permission is requested only when you click. Mobile alerts require a companion app.')}</p>
    <div class="card-actions"><button data-open-section="voice">${say('Voz','Voice')}</button><button data-open-section="memory">${say('Memória local','Local memory')}</button><button data-open-section="models">${say('Modelos','Models')}</button></div>
    ${heading(say('Novo subagente','New subagent'))}<form class="agent-builder" data-form="agent"><input class="panel-field" name="name" required maxlength="32" placeholder="${say('Nome do agente','Agent name')}"><input class="panel-field" name="role" required maxlength="70" placeholder="${say('Função','Role')}"><div class="input-row"><select class="panel-select" name="team"><option value="research">${say('Pesquisa','Research')}</option><option value="eng">${say('Projetos','Projects')}</option><option value="personal">${say('Pessoal','Personal')}</option></select><button class="small-action primary" type="submit">${say('Criar agente','Create agent')}</button></div></form>
    <p class="narrow-note">${say('O Jarvis poderá propor novos agentes automaticamente quando houver um motor ligado e uma regra aprovada.','Jarvis can propose new agents automatically once a model and an approval rule are connected.')}</p>`);
  return panelShell('briefing', say('O teu dia','Your day'), '', `<p>${safe(briefingText())}</p>`);
}

function taskRow(task) { return `<div class="task-row ${task.done?'done':''}"><input type="checkbox" data-task="${safe(task.id)}" ${task.done?'checked':''} aria-label="${safe(task.title)}"><div class="row-main"><strong>${safe(task.title)}</strong><small>${safe(task.due)} · ${safe(task.source)} ${task.demo?'· exemplo':''}</small></div><button class="row-button" data-action="delete-task" data-id="${safe(task.id)}" aria-label="${say('Apagar tarefa','Delete task')}">×</button></div>`; }
function renderTeamDetail() {
  const team = teams.find(item=>item.id===state.hub);
  if (!team) return originalRenderHubDetail();
  const key = state.detail || 'instructions';
  const teamTitle = safe(team.name);
  let body = '';
  if (key === 'instructions') body = `<textarea class="hub-text" data-team-notes="${team.id}" placeholder="${say('Instruções partilhadas pela equipa…','Shared team instructions…')}">${safe(work.teamNotes?.[team.id]||'')}</textarea><p class="narrow-note">${say('Estas instruções ficam guardadas localmente.','These instructions are saved locally.')}</p>`;
  else if (key === 'members') body = team.members.map(id=>`<button type="button" data-go="${id}"><span style="color:${bots[id].color}">${safe(bots[id].name)}</span><span style="float:right;color:#fcfcfc88">${safe(bots[id].role)}</span></button>`).join('');
  else if (key === 'chief') body = card(`<div class="card-top"><strong>${safe(bots[team.chief].name)}</strong>${status(say('Chefe de equipa','Team lead'),'live')}</div><div class="card-text">${say('Coordena os pedidos e informa o Jarvis sobre o progresso.','Coordinates work and reports progress to Jarvis.')}</div><div class="card-actions"><button data-agent="${team.chief}">${say('Abrir conversa','Open chat')}</button></div>`);
  else if (key === 'channels') body = card(`<div class="card-top"><strong>${safe(room.name)}</strong>${status(say('4 agentes','4 agents'),'live')}</div><div class="card-text">${say('Canal partilhado entre Pesquisa e Projetos.','Shared channel between Research and Projects.')}</div><div class="card-actions"><button data-hub="${room.id}">${say('Abrir canal','Open channel')}</button></div>`);
  else if (key === 'troutines') body = [['Revisão diária','Todos os dias · 09:00'],['Resumo semanal','Sexta · 16:00']].map(([name,when])=>`<div class="detail-row"><span>${name}</span><span>${when} · ${say('exemplo','sample')}</span></div>`).join('');
  else if (key === 'tcomputer') body = card(`<div class="card-top"><strong>${say('Computador da equipa','Team computer')}</strong>${status(say('Por configurar','Not configured'))}</div><div class="card-text">${say('Uma futura ligação dará aos agentes um ambiente de trabalho específico.','A future connection will give agents a dedicated work environment.')}</div>`);
  const labels = {instructions:say('Instruções','Instructions'),tcomputer:say('Computador da equipa','Team computer'),chief:say('Chefe de equipa','Team lead'),members:say('Membros','Members'),channels:say('Canais','Channels'),troutines:say('Rotinas','Routines')};
  return `<div class="detail"><div class="detail-heading" style="--detail-color:${team.color}"><span class="detail-icon">${(originalHubCaps().find(item=>item[0]===key)||[])[2]||'◈'}</span><div><span class="detail-kicker">${teamTitle.toUpperCase()}</span><h2>${labels[key]||teamTitle}</h2></div></div><p class="dashboard-notice">${safe(team.members.length)} ${say('agentes nesta equipa. Os exemplos não executam ações externas.','agents in this team. Samples perform no external actions.')}</p>${body}</div>`;
}

const originalRenderThread = renderThread;
renderThread = function (id) {
  const threadKey = state.activeThread[id] || 'main';
  const messages = threadKey === 'main' ? threadData(id) : (state.threads[`${id}::${threadKey}`] || []);
  if (!messages.length) return `<div class="msg-bot" style="margin:auto 0;color:#fcfcfc99">${say('Ainda não há mensagens.','No messages yet.')}<br><small>${say('Escreve ao agente para começar esta conversa.','Write to the agent to start this conversation.')}</small></div>`;
  const threadHtml=messages.filter(message=>message.type!=='approval').map(message => {
    if (message.type === 'user') return `<div class="msg-user">${safe(message.text)}</div>`;
    if (message.type === 'tools') return `<div class="msg-tools">${(message.items||[]).map(item => `<span>${safe(item)}</span>`).join('')}</div>`;
    if (message.type === 'bot') return `<div class="msg-bot">${safe(message.text)}</div>`;
    return '';
  }).join('');
  const shared=screenForAgent(id);
  const agentApprovals=threadKey==='main'?work.approvals.filter(item=>item.agent===id):[];
  return threadHtml+(threadKey==='main'&&shared?`<button type="button" class="shared-screen-chip" data-open-screen="${shared.id}"><span class="screen-chip-icon">▣</span><span>${safe(shared.title)}<small>${say('Ecrã de demonstração','Demo screen')}</small></span><b>${say('Ver','View')}</b></button>`:'')
    +(agentApprovals.length?`<div class="agent-proposal-list">${heading(say('Decisões deste agente','This agent’s decisions'),String(agentApprovals.length))}${agentApprovals.map(item=>approvalCard(item,true)).join('')}</div>`:'')
    +(threadKey==='main'?`<button type="button" class="approval-open agent-proposal-trigger" data-action="prepare-proposal" data-agent-id="${safe(id)}">＋ ${say('Preparar proposta deste agente','Prepare this agent’s proposal')}</button>`:'');
};
renderDetail = function () {
  const id=state.focus,bot=bots[id],key=state.detail;
  if(!bot)return '';
  const entries={
    engine:[say('Motor de IA','AI engine'),say('Nenhum motor está ligado a este agente. A preferência escolhida no Jarvis não inicia sessões nem consome créditos.','No AI engine is connected to this agent. Jarvis model preference does not start sessions or spend credits.'),say('Sem ligação','Not connected')],
    computer:[say('Computador','Computer'),say('Este agente ainda não tem acesso a ficheiros ou aplicações do PC.','This agent does not have access to computer files or apps yet.'),say('Sem acesso','No access')],
    browser:[say('Navegador','Browser'),say('A navegação automática deste agente está por configurar.','Automated browsing for this agent is not configured.'),say('Sem acesso','No access')],
    phone:[say('Telemóvel','Phone'),say('O futuro companheiro móvel permitirá notificações e consultas fora do PC.','A future mobile companion will bring notifications and status away from the PC.'),say('Sem ligação','Not connected')],
    apps:[say('Aplicações','Apps'),say('Gmail, Outlook, Calendar e GitHub precisam de ligações autorizadas separadamente.','Gmail, Outlook, Calendar and GitHub each need an authorized connection.'),say('Por ligar','Not connected')],
    approvals:[say('Aprovações','Approvals'),say('As decisões de exemplo podem ser revistas. O envio real de mensagens e alterações externas exigirá regras explícitas.','Sample decisions can be reviewed. Sending real messages or changing external data will require explicit rules.'),say('Confirmar antes de agir','Ask before acting')],
    skills:[say('Capacidades','Skills'),say('A função deste agente está definida. Ferramentas de execução serão adicionadas quando o motor e as contas estiverem ligados.','This agent has a defined role. Execution tools will come after connecting an engine and accounts.'),say('Em preparação','In preparation')],
    memory:[say('Memória','Memory'),say('As notas da equipa ficam guardadas neste navegador. Ainda não são usadas por um modelo.','Team notes are stored in this browser. A model does not use them yet.'),say('Local','Local')],
    routines:[say('Rotinas','Routines'),say('Ainda não há rotinas automáticas a executar.','No automatic routines are running yet.'),say('Sem rotinas','No routines')],
    voice:[say('Voz','Voice'),say('Podes iniciar uma chamada de demonstração com síntese de voz do sistema e uma conversa escrita.','You can start a demonstration call with system speech synthesis and a text conversation.'),say('Demonstração local','Local demo')]
  };
  const [title,description,value]=entries[key]||entries.engine;
  return `<div class="detail agent-detail"><button class="detail-back" data-back-chat>‹ &nbsp; ${say('Voltar à conversa','Back to chat')}</button><div class="detail-heading" style="--detail-color:${bot.color}"><span class="detail-icon">${(caps.find(item=>item[0]===key)||[])[2]||'◈'}</span><div><h2>${safe(title)}</h2></div></div><p>${safe(description)}</p>${card(`<div class="card-top"><strong>${safe(bot.name)}</strong>${status(value)}</div><div class="card-text">${safe(bot.role)}</div>`)}<div class="card-actions">${key==='voice'?`<button class="call-start-pill panel-call-pill" data-start-call="${id}">${phoneIcon}${say('Chamada','Call')}</button>`:`<button data-open-section="${key==='engine'?'models':key==='memory'?'memory':key==='approvals'?'approvals':'connections'}">${say('Abrir no Jarvis','Open in Jarvis')}</button>`}</div></div>`;
};
const originalRenderPanel = renderPanel;
renderPanel = function () {
  if (state.hub === 'you') {
    const panel = $('panel');
    if (state.detail === 'chat') {
      const messages = work.jarvisChat || [];
      panel.innerHTML = `<div class="panel-head"><div class="panel-name-row"><span class="panel-name" style="color:var(--jarvis)">Jarvis</span><button class="more" type="button" title="${say('Abrir resumo','Open briefing')}" data-open-section="briefing">⋯</button></div><span class="panel-sub">${say('Agente principal · organiza pedidos e coordena a equipa','Main agent · organizes requests and coordinates the team')}</span><div class="chips"><button class="chip" data-open-section="models">${safe(work.model)} · ${say('por ligar','not connected')}</button><button class="chip" data-open-section="approvals">${pendingApprovals().length} ${say('decisões','decisions')}</button>${!activeCall?`<button class="call-start-pill panel-call-pill" data-start-call="jarvis">${phoneIcon}${say('Chamada','Call')}</button>`:''}</div></div>
        <div class="thread" id="jarvisThread">${messages.length ? messages.map(message => message.from === 'user' ? `<div class="msg-user">${safe(message.text)}</div>` : `<div class="msg-bot">${safe(message.text)}</div>`).join('') : `<div class="msg-bot" style="margin:auto 0"><strong>${say('Bom regresso.','Welcome back.')}</strong><br>${safe(briefingText())}<br><br><span style="color:#fcfcfc88;font-size:12px">${say('Podes pedir um resumo, criar uma tarefa ou explorar o painel.','You can ask for a summary, create a task or explore the dashboard.')}</span></div>`}</div>
        <div class="chat-composer"><button class="attachment" data-open-section="tasks" title="${say('Tarefas','Tasks')}">＋</button><input id="jarvisChatInput" type="text" placeholder="${say('Fala com o Jarvis','Talk to Jarvis')}" autocomplete="off"><button class="call" data-start-call="jarvis" title="${say('Chamar Jarvis','Call Jarvis')}">◖))</button><button class="send" type="button" data-action="send-jarvis" aria-label="${say('Enviar mensagem','Send message')}">↑</button></div>`;
      const input = $('jarvisChatInput');
      input.onkeydown = event => { if (event.key === 'Enter') sendJarvis(); };
      requestAnimationFrame(() => { const thread = $('jarvisThread'); if (thread) thread.scrollTop = thread.scrollHeight; });
    } else {
      panel.innerHTML = `<div class="panel-head"><div class="panel-name-row"><span class="panel-name" style="color:var(--jarvis)">Jarvis</span></div><span class="panel-sub">${say('Agente principal · coordena 3 equipas e apresenta o que precisa de ti','Main agent · coordinates 3 teams and brings you what needs attention')}</span><div class="chips"><button class="chip" data-open-section="chat">${say('Conversar','Chat')}</button><button class="chip" data-open-section="approvals">${pendingApprovals().length} ${say('decisões','decisions')}</button></div></div>${renderJarvisDetail()}`;
    }
    if(activeCall)renderCall();
    return;
  }
  originalRenderPanel();
  const panel = $('panel');
  if (state.focus) {
    const id = state.focus, team = teams.find(item => item.id === bots[id].team);
    const sub = panel.querySelector('.panel-sub');
    if (sub) sub.textContent = `${id===team.chief?say('Chefe de equipa','Team lead'):bots[id].role} · ${team.name} · ${id===team.chief?say('fala com o Jarvis','reports to Jarvis'):say('fala com '+bots[team.chief].name,'reports to '+bots[team.chief].name)}`;
    const tabs = panel.querySelectorAll('.thread-tab');
    if (tabs[0] && tabs[0].textContent === 'Main') tabs[0].textContent = say('Principal','Main');
    const input = panel.querySelector('#chatInput'); if (input) input.placeholder = `${say('Mensagem para','Message')} ${bots[id].name}`;
    const chips = panel.querySelectorAll('.chip');
    if (chips[1]) chips[1].innerHTML = `◌ ${say('Pedir aprovação','Ask for approval')}`;
    const more = panel.querySelector('[data-more]'); if (more) more.title = say('Mais ações','More actions');
    const call = panel.querySelector('[data-call]');
    if(call){call.title=say(`Chamar ${bots[id].name}`,`Call ${bots[id].name}`);call.onclick=()=>openCall(id);}
    if(!activeCall&&!state.detail){const pill=document.createElement('button');pill.type='button';pill.className='call-start-pill panel-call-pill';pill.dataset.startCall=id;pill.innerHTML=`${phoneIcon}${say('Chamada','Call')}`;panel.querySelector('.panel-head .chips')?.append(pill);}
    panel.querySelectorAll('[data-resolve]').forEach(button => {
      button.onclick = () => {
        const [index, result] = button.dataset.resolve.split(':');
        const message = threadData(id)[Number(index)];
        if (message) message.status = result;
        work.messages[id] = state.threads[id];
        const approval = work.approvals.find(item => item.agent === id && item.state === 'pending');
        if (approval) approval.state = result === 'allow' ? 'approved' : 'denied';
        persist(); recordActivity(bots[id].name, result === 'allow' ? 'Aprovou uma decisão de exemplo.' : 'Recusou uma decisão de exemplo.', 'approval');
        renderPanel(); renderAttention(); updateCaps();
        toast(result === 'allow' ? say('Exemplo aprovado · sem ação externa','Sample approved · no external action') : say('Decisão recusada','Decision denied'));
      };
    });
  }
  if (state.hub && state.hub !== room.id) {
    const sub = panel.querySelector('.panel-sub');
    if (sub) sub.textContent = state.hub === 'you' ? say('Agente principal','Main agent') : `${teams.find(t=>t.id===state.hub)?.members.length||0} ${say('agentes','agents')} · ${say('coordenação por','led by')} ${bots[teams.find(t=>t.id===state.hub).chief].name}`;
  }
  if(activeCall)renderCall();
};

const originalOverview = overview;
overview = function () { if(activeCall)endCall(); originalOverview(); $('windowTitle').textContent = `Jarvis — ${say('Mapa da equipa','Team map')}`; $('recipientName').textContent = state.recipient === 'jarvis' ? 'Jarvis' : bots[state.recipient]?.name || 'Jarvis'; updateOverviewText(); };
const originalFocusBot = focusBot;
focusBot = function (id) { if(activeCall&&activeCall.id!==id)endCall(); originalFocusBot(id); $('windowTitle').textContent = `Jarvis — ${bots[id]?.name || id}`; if (bots[id]) burstSignal('you', id, bots[id].color); updateOverviewText(); };
const originalFocusHub = focusHub;
focusHub = function (id, detail) {
  if(activeCall&&(id!=='you'||activeCall.id!=='jarvis'))endCall();
  originalFocusHub(id, detail);
  if (id === 'you') { state.detail = detail && sectionMeta[detail] ? detail : 'briefing'; renderPanel(); updateCaps(); $('windowTitle').textContent = 'Jarvis — '+say('O teu espaço','Your space'); }
  else if (id === room.id) $('windowTitle').textContent = `Jarvis — ${room.name}`;
  else $('windowTitle').textContent = `Jarvis — ${teams.find(t=>t.id===id)?.name||id}`;
  updateOverviewText();
};
$('back').onclick = () => overview();

function updateOverviewText() {
  $('digest').innerHTML = `<b>${say('Resumo','Briefing')}</b>${say('do dia','for today')}`;
  $('attention').innerHTML = `<span class="attention-faces">● ●</span><b>${pendingApprovals().length} ${say('decisões','decisions')}</b> ${say('à tua espera','waiting')}`;
  $('attention').style.display = pendingApprovals().length ? '' : 'none';
  $('overviewInput').placeholder = state.recipient === 'jarvis' ? say('Fala com o Jarvis','Talk to Jarvis') : `${say('Pede algo a','Ask')} ${bots[state.recipient]?.name || 'Jarvis'}`;
  $('statusText').textContent = say('Mapa em demonstração','Map preview');
}
const originalRenderAttention = renderAttention;
renderAttention = function () {
  const attention = $('attentionPopover');
  attention.innerHTML = `<div class="popover-title">${say('À TUA ESPERA','WAITING ON YOU')}</div>${pendingApprovals().map(item=>`<button class="popover-item" data-attn="${safe(item.agent)}"><i class="mini-dot" style="background:${bots[item.agent]?.color||'#a8d5ec'}"></i><span>${safe(bots[item.agent]?.name||'Jarvis')}<small>${safe(item.title)} · ${item.demo?say('exemplo','sample'):say('pendente','pending')}</small></span></button>`).join('') || `<div class="empty-state">${say('Sem decisões pendentes.','No pending decisions.')}</div>`}`;
  attention.querySelectorAll('[data-attn]').forEach(button=>button.onclick=()=>focusBot(button.dataset.attn));
  const right = state.focus || state.hub ? `${focusGeom().chatW+44}px` : '16px';
  $('attention').style.right = right;
  updateOverviewText();
};

const originalPaletteResults = paletteResults;
paletteResults = function () {
  const query = $('paletteInput').value.toLocaleLowerCase().trim();
  const agents = Object.entries(bots).filter(([, bot]) => `${bot.name} ${bot.role} ${teams.find(t=>t.id===bot.team)?.name||''}`.toLocaleLowerCase().includes(query));
  const sections = Object.entries(sectionMeta).filter(([, [pt,en]]) => `${pt} ${en}`.toLocaleLowerCase().includes(query));
  $('paletteResults').innerHTML = `<div class="palette-group">${say('AGENTES','AGENTS')}</div>${agents.map(([id,bot],index)=>`<button class="palette-item ${index===state.paletteIndex?'active':''}" data-pick="${id}"><span style="color:${bot.color}">●</span>${safe(bot.name)}<small>${safe(bot.role)}</small></button>`).join('')}
    <div class="palette-group">JARVIS</div>${sections.map(([key,[pt,en,icon]])=>`<button class="palette-item" data-section-pick="${key}"><span style="color:var(--jarvis)">${icon}</span>${safe(say(pt,en))}<small>Jarvis</small></button>`).join('')}${!agents.length&&!sections.length?`<div class="palette-group">${say('Sem resultados','No results')}</div>`:''}`;
  $('paletteResults').querySelectorAll('[data-pick]').forEach(button=>button.onclick=()=>{closePalette();focusBot(button.dataset.pick)});
  $('paletteResults').querySelectorAll('[data-section-pick]').forEach(button=>button.onclick=()=>{closePalette();focusHub('you',button.dataset.sectionPick)});
};

function getAgentThread(id) { const key=state.activeThread[id]||'main'; return key==='main'?threadData(id):(state.threads[`${id}::${key}`]||(state.threads[`${id}::${key}`]=[])); }
function speak(text) { if (!work.voice || !('speechSynthesis' in window)) return; speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = work.language === 'en' ? 'en-GB' : 'pt-PT'; utterance.rate = 1; speechSynthesis.speak(utterance); }
function responseFor(text, id) {
  const lower = text.toLocaleLowerCase();
  if (/^(\/tarefa|adiciona tarefa|cria tarefa|add task)\b/.test(lower)) {
    const title = text.replace(/^(\/tarefa|adiciona tarefa|cria tarefa|add task)\s*/i,'').trim();
    if (title) { addTask(title); return say(`Adicionei “${title}” à tua lista de tarefas.`,`Added “${title}” to your tasks.`); }
  }
  if (/(resumo do dia|resume o dia|briefing|daily summary)/.test(lower)) return briefingText();
  if (/(aprovaç|decisõ|approval|pending)/.test(lower)) return say(`Tens ${pendingApprovals().length} decisões à espera. Abre Aprovações para as rever.`,`You have ${pendingApprovals().length} decisions waiting. Open Approvals to review them.`);
  if (/(e-?mail|correio|inbox)/.test(lower)) return say('Posso mostrar os exemplos de correio. Para ler mensagens reais, precisas de ligar Gmail ou Outlook.','I can show the mail samples. Connect Gmail or Outlook to read real messages.');
  if (/(calend|agenda|schedule)/.test(lower)) return say('A tua agenda local está no painel. O Google Calendar ainda não está ligado.','Your local calendar is in the panel. Google Calendar is not connected yet.');
  if (/(projeto|github|repo)/.test(lower)) return say('Podes adicionar um repositório público em Projetos. Para repositórios privados, precisaremos de uma ligação ao GitHub.','You can add a public repository under Projects. Private repositories will need a GitHub connection.');
  return id==='jarvis' ? say('Registei o pedido. Nesta versão consigo organizar tarefas, resumos e decisões locais. Para executar este pedido com IA, teremos de ligar um motor.','I saved your request. This version can organize local tasks, summaries and decisions. An AI engine must be connected to carry out this request.') : say(`${bots[id].name} recebeu o pedido. A execução automática requer um motor de IA ligado; não houve ação externa.`,`${bots[id].name} received your request. Automatic work requires a connected AI engine; no external action was taken.`);
}
function submitMessage(id, text) {
  const value = text.trim(); if (!value) return;
  const answer = responseFor(value, id);
  if (id === 'jarvis') { (work.jarvisChat||(work.jarvisChat=[])).push({from:'user',text:value},{from:'jarvis',text:answer}); focusHub('you','chat'); }
  else { const thread = getAgentThread(id); thread.push({type:'user',text:value},{type:'bot',text:answer}); work.messages[id] = state.threads[id]; renderPanel(); }
  persist(); recordActivity(id==='jarvis'?'Jarvis':bots[id].name,'Recebeu uma mensagem tua.','chat');
  if (id !== 'jarvis') burstSignal('you',id,bots[id].color);
  speak(answer);
}
sendChat = function () { if (state.focus) { const value=$('chatInput')?.value||''; activeCall?.id===state.focus?sendInCall(value):submitMessage(state.focus,value); } };
function sendJarvis() { const value=$('jarvisChatInput')?.value||''; activeCall?.id==='jarvis'?sendInCall(value):submitMessage('jarvis',value); }
function sendFromMap() { const value=$('overviewInput').value; $('overviewInput').value=''; submitMessage('jarvis',value); }
$('overviewSend').onclick = sendFromMap;
$('overviewInput').onkeydown = event => { if (event.key === 'Enter') sendFromMap(); };
$('overviewCall').onclick = () => openCall('jarvis');
state.recipient = 'jarvis';
$('recipientName').textContent = 'Jarvis';
document.querySelector('.recipient-dot').style.background = '#b5d8f0';
$('recipient').onclick = null;
$('recipientMenu').remove();
updateOverviewText();

function refreshSurface() { renderPanel(); updateCaps(); renderAttention(); updateOverviewText(); }
function resolveApproval(id, decision) {
  const item=work.approvals.find(entry=>entry.id===id);
  if (!item || item.state!=='pending') return;
  item.state=decision;
  item.updatedAt=Date.now();
  item.history.push({state:decision,at:item.updatedAt,action:item.action,note:decision==='approved'?say('Aprovação registada; nenhuma ação externa executada','Approval recorded; no external action performed'):say('Proposta recusada','Proposal denied')});
  const messages=state.threads[item.agent];
  const inline=messages?.find(message=>message.type==='approval'&&message.status==='pending');
  if (inline) { inline.status=decision==='approved'?'allow':'deny'; work.messages[item.agent]=messages; }
  persist();
  recordActivity('Tu',decision==='approved'?`Aprovou “${item.title}” de ${bots[item.agent]?.name||'Jarvis'}; sem ação externa.`:`Recusou “${item.title}” de ${bots[item.agent]?.name||'Jarvis'}.`,'approval');
  toast(decision==='approved'?say('Aprovação registada · sem ação externa','Approval recorded · no external action'):say('Decisão recusada','Decision denied'));
  refreshSurface();
}
function requestApprovalChanges(id, feedback) {
  const item=work.approvals.find(entry=>entry.id===id);
  if(!item||item.state!=='pending'||!feedback.trim())return;
  item.state='revision';item.feedback=feedback.trim();item.updatedAt=Date.now();
  item.history.push({state:'revision',at:item.updatedAt,note:item.feedback});
  persist();recordActivity('Tu',`Pediu alterações em “${item.title}” a ${bots[item.agent]?.name||'Jarvis'}.`,'approval');
  toast(say('Pedido de alterações guardado','Change request saved'));refreshSurface();
}
function resubmitApproval(id, action) {
  const item=work.approvals.find(entry=>entry.id===id);
  if(!item||item.state!=='revision'||!action.trim())return;
  item.action=action.trim();item.state='pending';item.updatedAt=Date.now();
  item.history.push({state:'pending',at:item.updatedAt,action:item.action,note:say('Proposta revista manualmente','Proposal revised manually')});
  persist();recordActivity(bots[item.agent]?.name||'Jarvis',`Reapresentou “${item.title}” para decisão.`,'approval');
  toast(say('Proposta reapresentada','Proposal resubmitted'));refreshSurface();
}
function parseGitHubRepo(value) {
  try {
    const url=new URL(value.trim());
    if (url.protocol!=='https:'||!['github.com','www.github.com'].includes(url.hostname)) return null;
    const parts=url.pathname.split('/').filter(Boolean);
    if (parts.length!==2||!parts.every(part=>/^[A-Za-z0-9_.-]+$/.test(part))) return null;
    return {owner:parts[0],repo:parts[1].replace(/\.git$/,'')};
  } catch { return null; }
}
async function refreshProject(id) {
  const project=work.projects.find(item=>item.id===id); if (!project) return;
  const parsed=parseGitHubRepo(project.repo);
  if (!parsed) { toast(say('Endereço GitHub inválido','Invalid GitHub URL')); return; }
  project.stage=say('A consultar GitHub…','Checking GitHub…'); refreshSurface();
  try {
    const response=await fetch(`https://api.github.com/repos/${encodeURIComponent(parsed.owner)}/${encodeURIComponent(parsed.repo)}`,{
      headers:{Accept:'application/vnd.github+json'},signal:AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error(response.status===404?say('Repositório público não encontrado','Public repository not found'):`GitHub HTTP ${response.status}`);
    const data=await response.json();
    if (data.private) throw new Error(say('Repositório privado: liga o GitHub primeiro','Private repository: connect GitHub first'));
    const pushed=data.pushed_at?new Date(data.pushed_at).toLocaleDateString(work.language==='en'?'en-GB':'pt-PT'):'—';
    project.stage=say(`Último push: ${pushed} · ${data.open_issues_count??0} issues/PRs abertas`,`Last push: ${pushed} · ${data.open_issues_count??0} open issues/PRs`);
    project.updatedAt=Date.now(); project.defaultBranch=data.default_branch;
    recordActivity('Vigia',`Atualizou o estado público de ${project.name}.`,'project');
  } catch (error) { project.stage=say(`Não foi possível atualizar: ${error.message}`,`Could not refresh: ${error.message}`); }
  persist(); refreshSurface();
}

$('panel').addEventListener('click',async event=>{
  const target=event.target.closest('button'); if(!target)return;
  if(target.dataset.startCall){openCall(target.dataset.startCall);return;}
  if(target.dataset.openScreen){openScreen(target.dataset.openScreen);return;}
  if(target.dataset.callAction==='end'){endCall();return;}
  if(target.dataset.callAction==='sound'&&activeCall){activeCall.sound=!activeCall.sound;work.voice=activeCall.sound;persist();if(!activeCall.sound&&'speechSynthesis'in window)speechSynthesis.cancel();renderCall();if(activeCall.sound)callSpeak(activeCall.log.at(-1)?.text||'');return;}
  if(target.dataset.openSection){state.detail=target.dataset.openSection;focusHub('you',state.detail);return;}
  if(target.dataset.agent){focusBot(target.dataset.agent);return;}
  if(target.dataset.hub){focusHub(target.dataset.hub);return;}
  const action=target.dataset.action,id=target.dataset.id;
  if(!action)return;
  if(action==='prepare-proposal'){proposalAgentDraft=target.dataset.agentId;focusHub('you','approvals');$('panel').querySelector('.approval-create input[name="title"]')?.focus();return;}
  if(action==='request-changes'){const form=target.closest('.panel-card')?.querySelector('.approval-change-form');if(form){form.classList.remove('hidden');form.querySelector('textarea')?.focus();}return;}
  if(action==='cancel-changes'){target.closest('.approval-change-form')?.classList.add('hidden');return;}
  if(action==='send-jarvis'){sendJarvis();return;}
  if(action==='save-brief'){saveBrief();refreshSurface();toast(say('Ata guardada neste computador','Daily record saved on this computer'));return;}
  if(action==='delete-task'){work.tasks=work.tasks.filter(item=>item.id!==id);persist();recordActivity('Jarvis','Removeu uma tarefa.','task');refreshSurface();return;}
  if(action==='delete-event'){work.events=work.events.filter(item=>item.id!==id);persist();refreshSurface();return;}
  if(action==='delete-rule'){work.rules=work.rules.filter(item=>item.id!==id);persist();refreshSurface();return;}
  if(action==='delete-project'){work.projects=work.projects.filter(item=>item.id!==id);persist();refreshSurface();return;}
  if(action==='refresh-project'){await refreshProject(id);return;}
  if(action==='approve'||action==='deny'){resolveApproval(id,action==='approve'?'approved':'denied');return;}
  if(action==='model'){work.model=target.dataset.value;persist();refreshSurface();toast(say('Preferência guardada · motor por ligar','Preference saved · engine not connected'));return;}
  if(action==='language'){work.language=target.dataset.value;localizeAgentCaps();persist();refreshSurface();updateCaps();updateOverviewText();toast(work.language==='pt'?'Idioma: Português':'Language: English');return;}
  if(action==='save-memory'){work.memoryNotes=$('memoryNotes')?.value||'';persist();recordActivity('Jarvis','Atualizou a memória local.','memory');toast(say('Memória guardada localmente','Memory saved locally'));return;}
  if(action==='sample-voice'){
    if(!('speechSynthesis'in window)){toast(say('Síntese de voz indisponível neste navegador','Speech synthesis is unavailable in this browser'));return;}
    const utterance=new SpeechSynthesisUtterance(say('Olá, sou o Jarvis. Estou pronto para ajudar a organizar o teu dia.','Hello, I am Jarvis. I am ready to help organize your day.'));
    utterance.lang=work.language==='en'?'en-GB':'pt-PT'; speechSynthesis.cancel(); speechSynthesis.speak(utterance);return;
  }
  if(action==='notifications'){
    if(!('Notification'in window)){toast(say('Notificações não disponíveis neste navegador','Notifications unavailable in this browser'));return;}
    const permission=await Notification.requestPermission();
    work.notifications=permission==='granted';persist();
    toast(permission==='granted'?say('Notificações permitidas neste PC','Desktop notifications allowed'):say('Permissão não concedida','Permission not granted'));
  }
});
$('panel').addEventListener('submit',event=>{
  const form=event.target.closest('form[data-form]');if(!form)return;event.preventDefault();
  const values=new FormData(form),kind=form.dataset.form;
  if(kind==='task'){const title=String(values.get('title')||'').trim();if(title)addTask(title);refreshSurface();return;}
  if(kind==='approval-create'){
    const agent=String(values.get('agent')||''),title=String(values.get('title')||'').trim(),detail=String(values.get('detail')||'').trim(),action=String(values.get('action')||'').trim();
    if(!bots[agent]||!title||!detail||!action)return;
    const createdAt=Date.now();
    work.approvals.unshift({id:uid('approval'),agent,title,detail,action,state:'pending',demo:false,createdAt,history:[{state:'pending',at:createdAt,action,note:say('Proposta local preparada manualmente','Local proposal prepared manually')}]});
    proposalAgentDraft=agent;persist();recordActivity(bots[agent].name,`Apresentou a proposta local “${title}”.`,'approval');
    refreshSurface();toast(say('Proposta adicionada à caixa de decisões','Proposal added to decision inbox'));return;
  }
  if(kind==='approval-change'){requestApprovalChanges(form.dataset.id,String(values.get('feedback')||''));return;}
  if(kind==='approval-revise'){resubmitApproval(form.dataset.id,String(values.get('action')||''));return;}
  if(kind==='event'){const title=String(values.get('title')||'').trim(),when=String(values.get('when')||'').trim();if(title&&when){work.events.unshift({id:uid('event'),title,when,demo:false});persist();recordActivity('Agenda',`Adicionou o evento “${title}” à agenda local.`,'calendar');refreshSurface()}return;}
  if(kind==='rule'){const text=String(values.get('rule')||'').trim();if(text){work.rules.unshift({id:uid('rule'),text});persist();recordActivity('Correio','Guardou uma regra de atenção local.','mail');refreshSurface()}return;}
  if(kind==='project'){
    const name=String(values.get('name')||'').trim(),repo=String(values.get('repo')||'').trim();
    if(!parseGitHubRepo(repo)){toast(say('Usa um endereço https://github.com/utilizador/repo','Use a https://github.com/owner/repo URL'));return;}
    const project={id:uid('project'),name,repo,stage:say('Por atualizar','Waiting to refresh'),demo:false};work.projects.unshift(project);persist();recordActivity('Vigia',`Adicionou o projeto ${name} ao radar.`,'project');refreshSurface();refreshProject(project.id);return;
  }
  if(kind==='agent'){
    const name=String(values.get('name')||'').trim(),role=String(values.get('role')||'').trim(),team=String(values.get('team')||'personal');
    if(!name||!role)return;
    const palette=['#85c9e9','#e79dab','#c5b1ec','#a9d39a','#e6bb7e'];
    const record={id:uid('custom').replace(/-/g,'').toLowerCase(),name,role,team,color:palette[work.customAgents.length%palette.length]};
    addCustomAgent(record);updateCaps();refreshSurface();toast(say(`Agente ${name} criado localmente`,`Agent ${name} created locally`));return;
  }
});
$('panel').addEventListener('change',event=>{
  const checkbox=event.target.closest('[data-task]');
  if(checkbox){const task=work.tasks.find(item=>item.id===checkbox.dataset.task);if(task){task.done=checkbox.checked;persist();recordActivity('Jarvis',task.done?`Concluiu “${task.title}”.`:`Reabriu “${task.title}”.`,'task');refreshSurface()}return;}
  if(event.target.dataset.setting==='voice'){work.voice=event.target.checked;persist();refreshSurface();toast(work.voice?say('Voz ativada','Voice enabled'):say('Voz desligada','Voice disabled'));}
});
$('panel').addEventListener('input',event=>{
  const team=event.target.dataset.teamNotes;
  if(team){work.teamNotes||=( {} );work.teamNotes[team]=event.target.value;persist();}
});

// A call lives in the current agent view. It never captures the microphone;
// optional speech uses the OS synthesizer and remains a labelled local demo.
let activeCall=null,callTimer=null;
function callAgent(id){return id==='jarvis'?{name:'Jarvis',role:say('Agente principal','Main agent'),color:'#b5d8f0'}:bots[id];}
function callDuration(){if(!activeCall)return '00:00';const seconds=Math.floor((Date.now()-activeCall.started)/1000);return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;}
function callSpeak(text){
  if(!activeCall?.sound||!('speechSynthesis'in window))return;
  speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);
  utterance.lang=work.language==='en'?'en-GB':'pt-PT';utterance.rate=.97;
  utterance.onstart=()=>stage.classList.add('is-speaking');
  utterance.onend=utterance.onerror=()=>stage.classList.remove('is-speaking');
  speechSynthesis.speak(utterance);
}
function renderCall(){
  if(!activeCall)return;
  if(activeCall.id==='jarvis'?state.hub!=='you':state.focus!==activeCall.id)return;
  const panel=$('panel'),head=panel.querySelector('.panel-head');if(!head)return;
  head.querySelector('.panel-call-pill')?.remove();
  let bar=panel.querySelector('.inline-call');
  if(!bar){bar=document.createElement('div');bar.className='inline-call';head.querySelector('.chips')?.after(bar);}
  bar.innerHTML=`<span class="inline-call-state"><i></i>${say('Em chamada · demonstração','On a call · demo')} <strong id="callDuration">${callDuration()}</strong></span><div class="inline-call-actions"><button type="button" data-call-action="sound" title="${say('Voz do sistema','System voice')}">${activeCall.sound?say('Silenciar','Mute'):say('Ouvir voz','Hear voice')}</button><button type="button" class="hangup" data-call-action="end">${say('Terminar','Hang up')}</button></div>`;
  stage.classList.add('call-active');stage.style.setProperty('--call-accent',callAgent(activeCall.id).color);
}
function openCall(id){
  if(id!=='jarvis'&&!bots[id])return;
  if(activeCall)endCall();
  if(id==='jarvis'&&state.hub!=='you')focusHub('you','chat');
  else if(id!=='jarvis'&&state.focus!==id)focusBot(id);
  const bot=callAgent(id);
  activeCall={id,started:Date.now(),sound:work.voice&&'speechSynthesis'in window,log:[{from:'bot',text:say(`Olá, sou ${bot.name}. Podemos conversar aqui enquanto preparo a ligação às minhas ferramentas.`,`Hello, I'm ${bot.name}. We can talk here while my tools are being connected.`)}]};
  renderCall();($('chatInput')||$('jarvisChatInput'))?.focus();
  callTimer=setInterval(()=>{const label=$('callDuration');if(label&&activeCall)label.textContent=callDuration();},1000);
  burstSignal('you',id==='jarvis'?'you':id,bot.color);
  callSpeak(activeCall.log[0].text);
}
function endCall(){
  if(!activeCall)return;
  const id=activeCall.id;
  clearInterval(callTimer);callTimer=null;
  if('speechSynthesis'in window)speechSynthesis.cancel();
  activeCall=null;stage.classList.remove('call-active','is-speaking');
  $('panel').querySelector('.inline-call')?.remove();
  recordActivity(id==='jarvis'?'Jarvis':bots[id]?.name||'Jarvis','Terminou uma conversa de demonstração.','call');
  renderPanel();
  ($('chatInput')||$('jarvisChatInput'))?.focus();
}
function sendInCall(value){
  if(!activeCall||!value.trim())return;
  const id=activeCall.id,text=value.trim(),answer=responseFor(text,id);
  activeCall.log.push({from:'you',text},{from:'bot',text:answer});
  if(id==='jarvis')(work.jarvisChat||(work.jarvisChat=[])).push({from:'user',text},{from:'jarvis',text:answer});
  else{const thread=getAgentThread(id);thread.push({type:'user',text},{type:'bot',text:answer});work.messages[id]=state.threads[id];}
  persist();recordActivity(id==='jarvis'?'Jarvis':bots[id].name,'Recebeu uma mensagem durante a chamada.','call');
  renderPanel();($('chatInput')||$('jarvisChatInput'))?.focus();callSpeak(answer);
}
document.addEventListener('keydown',event=>{if(activeCall&&event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();endCall();}},true);

// Agents can present an artifact without changing the selected conversation.
// These first screens are clearly marked as local examples.
const sharedScreens=[
  {id:'research',agent:'atlas',title:'Mapa de pesquisa',summary:'Fontes e conclusões em preparação',tone:'#ff9a7e'},
  {id:'project',agent:'clive',title:'Estado do portfólio',summary:'Radar do projeto e próximas decisões',tone:'#58e8a8'},
  {id:'calendar',agent:'omiii',title:'Plano de amanhã',summary:'Blocos de tempo da agenda local',tone:'#7b93ff'},
  {id:'mail',agent:'emaily',title:'Rascunho de resposta',summary:'Mensagem de exemplo à espera de revisão',tone:'#48d3ee'}
];
function screenForAgent(id){return sharedScreens.find(screen=>screen.agent===id)||null;}
function screenBody(screen){
  if(screen.id==='research')return `<div class="screen-sheet"><h3>${say('Mapa de pesquisa','Research map')}</h3><p>${say('Exemplo de ecrã preparado pelo Radar. As fontes reais serão listadas aqui quando houver uma pesquisa ligada.','Sample screen prepared by Radar. Real sources will appear here after research is connected.')}</p><div class="screen-grid"><span>${say('Tema','Topic')}</span><span>${say('Estado','Status')}</span><strong>${say('Fontes do projeto','Project sources')}</strong><em>${say('Por confirmar','To verify')}</em><strong>${say('Dados relevantes','Relevant data')}</strong><em>${say('Em preparação','Preparing')}</em><strong>${say('Resumo final','Final brief')}</strong><em>${say('Por escrever','To write')}</em></div></div>`;
  if(screen.id==='project')return `<div class="screen-sheet"><h3>${say('Portfólio','Portfolio')}</h3><p>${say('Vista de acompanhamento. Adiciona um repositório público no painel Projetos para trazer dados reais.','Tracking view. Add a public repository in Projects to fetch real data.')}</p><div class="screen-timeline"><span>01</span><strong>${say('Ligação ao repositório','Repository connection')}</strong><em>${say('Por configurar','Not configured')}</em><span>02</span><strong>${say('Revisão do estado','Status review')}</strong><em>${say('À espera','Waiting')}</em><span>03</span><strong>${say('Próxima entrega','Next release')}</strong><em>${say('Por planear','To plan')}</em></div></div>`;
  if(screen.id==='calendar')return `<div class="screen-sheet"><h3>${say('Agenda local','Local calendar')}</h3><p>${say('Os eventos abaixo são locais ou exemplos; Google Calendar ainda não está ligado.','These events are local or samples; Google Calendar is not connected yet.')}</p>${work.events.slice(0,5).map(item=>`<div class="screen-event"><span>${safe(item.when)}</span><strong>${safe(item.title)}</strong>${item.demo?`<em>${say('Exemplo','Sample')}</em>`:''}</div>`).join('')}</div>`;
  return `<div class="screen-sheet"><h3>${say('Rascunho para revisão','Draft for review')}</h3><p>${say('Este ecrã mostra como o Correio pode apresentar uma resposta antes de a enviar. É apenas um exemplo.','This screen shows how Mail can present a reply before sending. It is a sample only.')}</p><div class="screen-mail"><small>${say('Assunto','Subject')}</small><strong>Re: ${say('Pedido de atualização','Update request')}</strong><hr><p>${say('Olá, obrigado pela mensagem. Estou a reunir a informação e volto a responder em breve.','Hello, thank you for your message. I am gathering the information and will reply soon.')}</p><small>${say('Nenhum e-mail será enviado.','No email will be sent.')}</small></div></div>`;
}
const screenToggle=document.createElement('button');screenToggle.type='button';screenToggle.id='screensToggle';screenToggle.className='screens-toggle';screenToggle.innerHTML=`<span class="screen-toggle-icon">▣</span> ${say('Ecrãs partilhados','Shared screens')} <b>${sharedScreens.length}</b>`;
stage.append(screenToggle);
const screenDeck=document.createElement('div');screenDeck.id='screenDeck';screenDeck.className='screen-deck hidden';stage.append(screenDeck);
const screenViewer=document.createElement('div');screenViewer.id='screenViewer';screenViewer.className='screen-viewer hidden';stage.append(screenViewer);
function renderScreenDeck(){screenDeck.innerHTML=`<div class="screen-deck-head"><strong>${say('Ecrãs partilhados','Shared screens')}</strong><small>${say('Exemplos locais','Local samples')}</small></div>${sharedScreens.map(screen=>`<button type="button" class="screen-preview" data-open-screen="${screen.id}" style="--screen-color:${screen.tone}"><span class="screen-preview-window"><i></i><i></i><i></i></span><span class="screen-preview-content"><strong>${safe(screen.title)}</strong><small>${safe(screen.summary)}</small><span class="preview-lines"><i></i><i></i><i></i></span></span><span class="screen-preview-foot">${safe(bots[screen.agent].name)} <b>${say('Ver ecrã','View screen')} ↗</b></span></button>`).join('')}`;}
renderScreenDeck();
screenToggle.onclick=()=>{screenDeck.classList.toggle('hidden');screenToggle.classList.toggle('active',!screenDeck.classList.contains('hidden'));};
screenDeck.addEventListener('click',event=>{const button=event.target.closest('[data-open-screen]');if(button)openScreen(button.dataset.openScreen);});
function openScreen(id){
  const screen=sharedScreens.find(item=>item.id===id);if(!screen)return;
  screenDeck.classList.add('hidden');screenToggle.classList.remove('active');
  screenViewer.classList.remove('hidden');screenViewer.style.setProperty('--screen-color',screen.tone);
  screenViewer.innerHTML=`<section class="screen-viewer-window" role="dialog" aria-modal="true" aria-label="${say('Ecrã de','Screen from')} ${safe(bots[screen.agent].name)}"><header><div><span class="screen-owner">${safe(bots[screen.agent].name)} · ${say('demonstração local','local demo')}</span><h2>${safe(screen.title)}</h2></div><button type="button" data-close-screen aria-label="${say('Fechar ecrã','Close screen')}">×</button></header>${screenBody(screen)}<footer><span>${say('Apresentado por','Presented by')} ${safe(bots[screen.agent].name)}</span><button type="button" data-go-agent="${screen.agent}">${say('Abrir conversa','Open conversation')}</button></footer></section>`;
  screenViewer.querySelector('[data-close-screen]')?.focus();
}
function closeScreen(){screenViewer.classList.add('hidden');screenViewer.innerHTML='';}
screenViewer.addEventListener('click',event=>{
  if(event.target===screenViewer||event.target.closest('[data-close-screen]')){closeScreen();return;}
  const button=event.target.closest('[data-go-agent]');if(button){closeScreen();focusBot(button.dataset.goAgent);}
});
document.addEventListener('keydown',event=>{if(!screenViewer.classList.contains('hidden')&&event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();closeScreen();}},true);

// The overview composer addresses Jarvis first; specialists stay available in its menu.
const originalSubmitMessage=submitMessage;
submitMessage = function(id,text){
  const wasFocused=state.focus===id;
  originalSubmitMessage(id,text);
  if(id!=='jarvis'&&!wasFocused&&text.trim())focusBot(id);
};

const signalCanvas=$('signals'),signalContext=signalCanvas.getContext('2d');
let signalWidth=0,signalHeight=0,signalScale=1;
const bursts=[];
const motionReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function sizeSignals(){const rect=stage.getBoundingClientRect();signalWidth=rect.width;signalHeight=rect.height;signalScale=Math.min(2,devicePixelRatio||1);signalCanvas.width=Math.round(signalWidth*signalScale);signalCanvas.height=Math.round(signalHeight*signalScale);signalContext.setTransform(signalScale,0,0,signalScale,0,0)}
new ResizeObserver(sizeSignals).observe(stage);sizeSignals();
function pointFor(id){return id==='you'?screen(0,70):home[id]?screen(home[id].x,home[id].y):null}
function ambientEdges(){
  const result=[];
  for(const team of teams){
    result.push({from:team.chief,to:'you',color:team.color,weight:1.2});
    for(const id of team.members){if(id!==team.chief)result.push({from:team.chief,to:id,color:bots[id].color,weight:.85});}
  }
  result.push({from:'atlas',to:'clive',color:'#b4b0e9',weight:.52});
  result.push({from:'emaily',to:'you',color:'#6dd8ed',weight:1});
  return result;
}
function burstSignal(from,to,color){bursts.push({from,to,color,start:performance.now(),duration:1350});if(bursts.length>30)bursts.shift()}
function signalParticle(ax,ay,bx,by,progress,color,opacity,scale=1){
  const x=ax+(bx-ax)*progress,y=ay+(by-ay)*progress;
  if(x<-30||x>signalWidth+30||y<-30||y>signalHeight+30)return;
  const c=signalContext;
  for(let step=8;step>=1;step--){
    const u=progress-step*.012;
    if(u<=0)continue;
    const tx=ax+(bx-ax)*u,ty=ay+(by-ay)*u;
    c.globalAlpha=opacity*(1-step/9)*.38;
    c.fillStyle=color;c.beginPath();c.arc(tx,ty,(.55+step*.08)*scale,0,Math.PI*2);c.fill();
  }
  c.globalAlpha=opacity*.22;const glow=c.createRadialGradient(x,y,0,x,y,11*scale);glow.addColorStop(0,color);glow.addColorStop(1,'transparent');c.fillStyle=glow;c.beginPath();c.arc(x,y,11*scale,0,Math.PI*2);c.fill();
  c.globalAlpha=opacity;c.fillStyle='#f4faff';c.beginPath();c.arc(x,y,1.8*scale,0,Math.PI*2);c.fill();
}
function drawCallSignal(time,still=false){
  if(!activeCall)return;
  const id=activeCall.id;
  if(id==='jarvis'?state.hub!=='you':state.focus!==id)return;
  const point=pointFor(id==='jarvis'?'you':id);if(!point)return;
  const c=signalContext,[x,y]=point;
  const radius=id==='jarvis'?Math.min(54,signalHeight*.08)*1.85:home[id].r*state.camera.s*1.7;
  const phase=still?0:time*.00011;
  c.save();c.globalCompositeOperation='screen';
  c.strokeStyle='rgba(245,188,111,.62)';c.lineWidth=1.3;c.setLineDash([1,6]);c.lineDashOffset=still?0:-time*.012;
  c.beginPath();c.arc(x,y,radius,0,Math.PI*2);c.stroke();c.setLineDash([]);
  for(let i=0;i<3;i++){
    const angle=phase+i*Math.PI*2/3,px=x+Math.cos(angle)*radius,py=y+Math.sin(angle)*radius;
    c.fillStyle='#f7c789';c.shadowColor='#f5b976';c.shadowBlur=12;c.beginPath();c.arc(px,py,still?2:2.1+Math.sin(time*.004+i)*.5,0,Math.PI*2);c.fill();
  }
  c.shadowBlur=0;c.fillStyle='#171b1f';c.strokeStyle='#e5c69a';c.lineWidth=1.2;
  const bx=x-radius-16,by=y+5;c.beginPath();c.roundRect(bx-11,by-11,22,22,5);c.fill();c.stroke();
  c.fillStyle='#f3d5ab';c.font='14px Inter,sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('◖',bx,by);
  c.restore();
}
function drawSignals(time){
  const c=signalContext;c.clearRect(0,0,signalWidth,signalHeight);
  if(motionReduced){drawCallSignal(time,true);requestAnimationFrame(drawSignals);return;}
  c.save();c.globalCompositeOperation='screen';
  const edges=ambientEdges();
  edges.forEach((edge,index)=>{
    const a=pointFor(edge.from),b=pointFor(edge.to);if(!a||!b)return;
    const selected=state.focus;
    const relation=!selected||edge.from===selected||edge.to===selected;
    const sceneOpacity=state.hub==='you'?.28:state.hub?.38:relation?1:.16;
    const velocity=.00012+(index%4)*.000018;
    for(let packet=0;packet<2;packet++){
      const phase=(time*velocity+index*.137+packet*.52)%1;
      const fade=Math.sin(Math.PI*phase)**1.1;
      signalParticle(a[0],a[1],b[0],b[1],phase,edge.color,fade*.9*sceneOpacity*edge.weight,index%3===0?1.18:1);
    }
  });
  for(let index=bursts.length-1;index>=0;index--){
    const burst=bursts[index],progress=(time-burst.start)/burst.duration;
    if(progress>=1){bursts.splice(index,1);continue;}
    const a=pointFor(burst.from),b=pointFor(burst.to);if(!a||!b)continue;
    for(let packet=0;packet<7;packet++){
      const u=clamp(progress-packet*.028,0,1);
      signalParticle(a[0],a[1],b[0],b[1],u,burst.color,(1-progress)*(.55+packet*.06),1.15);
    }
  }
  c.restore();drawCallSignal(time);
  requestAnimationFrame(drawSignals);
}
requestAnimationFrame(drawSignals);

// A quiet handoff on idle makes the map legible as a living team without
// claiming that an external service is actually executing work.
let idleIndex=0;
setInterval(()=>{
  if(document.hidden||state.focus||state.hub||motionReduced)return;
  const edges=ambientEdges();const edge=edges[idleIndex++%edges.length];
  if(edge)burstSignal(edge.from,edge.to,edge.color);
  const current=['Sinal de pesquisa · exemplo','Sinal de projetos · exemplo','Sinal de correio · exemplo','Sinal de agenda · exemplo'][idleIndex%4];
  $('statusText').textContent=say(current,'Team signal preview');
},4300);

// The reference canvas uses the owner's initial. The Jarvis adaptation keeps
// the animated outer ring while painting its own monogram and label.
const originalYouAvatar=youAvatar;
youAvatar=function(x,y,r,t,alpha=1){
  originalYouAvatar(x,y,r,t,alpha);
  const c=ctx;c.save();c.globalAlpha=alpha;
  const disc=c.createRadialGradient(x-r*.18,y-r*.2,0,x,y,r*.8);disc.addColorStop(0,'#263847');disc.addColorStop(.6,'#141b25');disc.addColorStop(1,'#0b1017');
  c.fillStyle=disc;c.beginPath();c.arc(x,y,r*.76,0,Math.PI*2);c.fill();
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  for(let i=0;i<45;i++){
    const phi=i*2.39996,rad=Math.sqrt((i+.5)/45)*r*.67,drift=reduced?0:t*.09;
    const px=x+Math.cos(phi+drift)*rad,py=y+Math.sin(phi+drift)*rad*.88;
    c.globalAlpha=alpha*(.12+.17*Math.sin(i*17.13)**2);c.fillStyle=i%3===0?'#a9e1f1':'#ffffff';c.fillRect(px,py,Math.max(.5,r*.024),Math.max(.5,r*.024));
  }
  c.globalAlpha=alpha;c.fillStyle='#f7fbff';c.textAlign='center';c.textBaseline='middle';c.font=`600 ${Math.round(r*.76)}px Inter,sans-serif`;c.fillText('J',x,y+r*.04);c.restore();
};
let lastPointerMotion=performance.now();
world.addEventListener('pointermove',()=>{lastPointerMotion=performance.now();},{passive:true});
const sleepyAgents=new Set(['ferret','patch','tally','brody']);
const originalAvatar=avatar;
avatar=function(id,x,y,r,t,alpha=1){
  originalAvatar(id,x,y,r,t,alpha);
  if(r<10||alpha<.4)return;
  const hovered=!state.focus&&!state.hub&&state.hover?.id===id;
  const conversing=activeCall?.id===id&&state.focus===id;
  const sleeping=!hovered&&!conversing&&!state.focus&&!state.hub&&sleepyAgents.has(id)&&performance.now()-lastPointerMotion>3900;
  if(!hovered&&!conversing&&!sleeping)return;
  const c=ctx,reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  c.save();c.globalAlpha=alpha;
  const face=c.createRadialGradient(x,y-r*.12,0,x,y,r*.58);face.addColorStop(0,'#2b353b');face.addColorStop(1,'#151b20');
  c.fillStyle=face;c.beginPath();c.ellipse(x,y+r*.05,r*.53,r*.49,0,0,Math.PI*2);c.fill();
  c.fillStyle=bots[id].color;
  for(let point=0;point<18;point++){const a=point*2.39996,dist=Math.sqrt((point+.5)/18)*r*.42;c.globalAlpha=alpha*.42;c.fillRect(x+Math.cos(a)*dist,y+r*.05+Math.sin(a)*dist*.85,Math.max(.6,r*.035),Math.max(.6,r*.035));}
  c.globalAlpha=alpha;
  c.strokeStyle='#f4f8fa';c.fillStyle='#f4f8fa';c.lineWidth=Math.max(1,r*.07);c.lineCap='round';
  if(sleeping){
    for(const side of [-1,1]){const ex=x+side*r*.27;c.beginPath();c.moveTo(ex-r*.12,y-r*.025);c.quadraticCurveTo(ex,y+r*.055,ex+r*.12,y-r*.025);c.stroke();}
    c.beginPath();c.arc(x,y+r*.27,r*.09,Math.PI*.1,Math.PI*.9);c.stroke();
    c.fillStyle=bots[id].color;c.textAlign='center';c.textBaseline='middle';c.font=`600 ${Math.max(12,r*.57)}px Inter,sans-serif`;
    c.fillText('z',x+r*.72,y-r*.52+(reduce?0:Math.sin(t*1.5)*r*.07));
    if(r>18){c.globalAlpha=alpha*.68;c.font=`600 ${Math.max(8,r*.3)}px Inter,sans-serif`;c.fillText('z',x+r*.98,y-r*.81+(reduce?0:Math.sin(t*1.5+.9)*r*.07));}
  }else{
    for(const side of [-1,1]){const ex=x+side*r*.28;c.beginPath();c.ellipse(ex,y-r*.07,r*.15,r*.23,0,0,Math.PI*2);c.fill();}
    c.strokeStyle='#f4f8fa';c.beginPath();
    if(conversing){const mouth=reduce?.11:.12+Math.abs(Math.sin(t*8))*r*.003;c.ellipse(x,y+r*.29,r*.14,r*mouth,0,0,Math.PI*2);c.fill();}
    else{c.moveTo(x-r*.15,y+r*.26);c.quadraticCurveTo(x,y+r*.43,x+r*.15,y+r*.26);c.stroke();}
    c.fillStyle=bots[id].color;
    if(hovered){
      const shimmer=reduce?1:.7+.3*Math.sin(t*5);
      c.globalAlpha=alpha*shimmer;c.beginPath();c.arc(x+r*.8,y-r*.67,Math.max(1.5,r*.065),0,Math.PI*2);c.fill();
      c.strokeStyle=bots[id].color;c.lineWidth=Math.max(1,r*.025);c.beginPath();c.arc(x,y,r*1.16,-.9,.3);c.stroke();
    }
  }
  c.restore();
};
overview();
