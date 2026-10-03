const teams = [
  { id: 'research', name: 'PESQUISA', color: '#ff947d', x: 282, y: 250, labelX: 282, labelY: 95, agents: ['radar', 'sintese', 'arquivo'] },
  { id: 'projects', name: 'PROJETOS', color: '#65dfae', x: 998, y: 250, labelX: 998, labelY: 95, agents: ['vigia', 'git', 'revisao'] },
  { id: 'personal', name: 'PESSOAL', color: '#6bcdea', x: 640, y: 520, labelX: 640, labelY: 465, agents: ['correio', 'agenda', 'diario'] }
];

const agents = [
  { id: 'radar', name: 'Radar', role: 'Coordena a pesquisa', team: 'research', x: 282, y: 250, chief: true, state: 'Em curso', description: 'Reúne informação e encaminha pedidos de pesquisa para os especialistas.', activity: 'Está a preparar um resumo de referências úteis.', messages: ['Estou a organizar as fontes para o próximo resumo. Quando terminar, envio-te os pontos principais.'] },
  { id: 'sintese', name: 'Síntese', role: 'Resumos', team: 'research', x: 149, y: 169, state: 'Disponível', description: 'Transforma pesquisas e documentos em resumos claros.', activity: 'Concluiu um resumo de pesquisa.', messages: ['O último resumo está pronto para o Jarvis integrar no briefing.'] },
  { id: 'arquivo', name: 'Arquivo', role: 'Memória', team: 'research', x: 149, y: 326, state: 'Disponível', description: 'Organiza contexto e decisões que vale a pena recordar.', activity: 'Organizou notas recentes.', messages: ['Separei as notas de projeto por assunto e data.'] },
  { id: 'vigia', name: 'Vigia', role: 'Acompanha projetos', team: 'projects', x: 998, y: 250, chief: true, state: 'Em curso', description: 'Acompanha alterações dos projetos e prepara atualizações para o Jarvis.', activity: 'Analisou 3 alterações de projeto.', messages: ['Há alterações recentes em três projetos. Ainda precisam de revisão antes de eu as marcar como concluídas.'] },
  { id: 'git', name: 'GitScout', role: 'GitHub', team: 'projects', x: 1131, y: 169, state: 'Disponível', description: 'Observa branches, pull requests e atividade no GitHub.', activity: 'Encontrou uma pull request por rever.', messages: ['Encontrei uma pull request por rever. Posso preparar um resumo das alterações.'] },
  { id: 'revisao', name: 'Revisão', role: 'Qualidade', team: 'projects', x: 1131, y: 326, state: 'Disponível', description: 'Reúne evidência sobre verificações e pontos por analisar.', activity: 'Assinalou pontos por verificar.', messages: ['Ainda não há verificações suficientes para concluir que estas alterações estão prontas.'] },
  { id: 'correio', name: 'Correio', role: 'Gmail e Outlook', team: 'personal', x: 640, y: 520, chief: true, state: 'À tua espera', description: 'Separa mensagens importantes, prepara respostas e aplica apenas as regras que autorizares.', activity: 'Preparou uma resposta para aprovação.', messages: ['Preparei uma resposta ao e-mail importante. Está à tua espera para revisão. Entretanto, continuo a organizar as restantes mensagens.'], approval: 'email' },
  { id: 'agenda', name: 'Agenda', role: 'Calendário', team: 'personal', x: 491, y: 592, state: 'Em curso', description: 'Propõe horários e mantém os próximos compromissos organizados.', activity: 'Propôs dois horários para uma reunião.', messages: ['Encontrei dois horários livres para a reunião de sexta-feira. Posso mostrar-te as opções antes de criar o evento.'], approval: 'calendar' },
  { id: 'diario', name: 'Diário', role: 'Resumo do dia', team: 'personal', x: 789, y: 592, state: 'Disponível', description: 'Prepara a ata diária das decisões, mensagens e projetos.', activity: 'Preparou o resumo do dia.', messages: ['O resumo do dia está disponível no painel do Jarvis.'] }
];

const jarvis = { id: 'jarvis', name: 'Jarvis', role: 'Agente principal', color: '#a8d5ec', state: 'Disponível', description: 'O teu ponto de contacto. Organiza pedidos, acompanha a equipa e mostra-te o que precisa da tua decisão.', messages: ['Bom regresso. Há duas decisões à tua espera e algumas atualizações dos projetos. Posso resumir-te o dia.'] };

const approvals = [
  { id: 'email', title: 'Resposta a um e-mail importante', from: 'Correio', detail: 'Lê o rascunho antes de autorizar o envio.', recipient: 'contacto@exemplo.pt', subject: 'Re: Próximos passos', proposal: 'Olá! Obrigado pela mensagem. Posso enviar-te uma atualização sobre os próximos passos até sexta-feira. Cumprimentos, Duarte', time: 'há 12 min', status: 'pending' },
  { id: 'calendar', title: 'Novo evento na agenda', from: 'Agenda', detail: 'Proposta de horário para a reunião. Revê antes de adicionar o evento.', recipient: 'Google Calendar', subject: 'Reunião de acompanhamento', proposal: 'Sexta-feira, 25 de setembro · 15:00–15:30', time: 'há 28 min', status: 'pending' }
];

const events = [
  { time: '14:42', title: 'Resposta preparada', detail: 'Correio colocou uma mensagem à tua espera.', color: '#6bcdea' },
  { time: '14:31', title: 'Projetos revistos', detail: 'Vigia encontrou três alterações recentes e pontos por verificar.', color: '#65dfae' },
  { time: '13:55', title: 'Horários propostos', detail: 'Agenda encontrou duas opções para uma reunião.', color: '#6bcdea' },
  { time: '11:20', title: 'Resumo concluído', detail: 'Síntese terminou um resumo de pesquisa.', color: '#ff947d' }
];

const byId = Object.fromEntries(agents.map(agent => [agent.id, agent]));
const teamById = Object.fromEntries(teams.map(team => [team.id, team]));
const scene = document.getElementById('orbitScene');
const panel = document.getElementById('detailPanel');
const panelContent = document.getElementById('detailContent');
const panelKicker = document.getElementById('detailKicker');
const commandDialog = document.getElementById('commandDialog');
const commandInput = document.getElementById('commandInput');
const commandResults = document.getElementById('commandResults');
let currentView = 'orbit';
let selectedAgent = null;
let sceneScale = 1;
let toastTimer;
const extraMessages = {};

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

function icon(name, className = 'icon') { return `<svg class="${className}" aria-hidden="true"><use href="#i-${name}"></use></svg>`; }

function route(fromX, fromY, toX, toY, bend = 0) {
  const mx = (fromX + toX) / 2;
  const my = (fromY + toY) / 2;
  return `M ${fromX} ${fromY} Q ${mx + bend} ${my - bend} ${toX} ${toY}`;
}

function svgNode(agent) {
  const color = teamById[agent.team].color;
  const radius = agent.chief ? 37 : 27;
  const statusColor = agent.state === 'À tua espera' ? '#ffad8e' : agent.state === 'Em curso' ? '#65dfae' : '#8e9aa8';
  const y = agent.y;
  const x = agent.x;
  return `<g class="agent-node ${agent.chief ? 'hub-node' : ''}" data-agent="${agent.id}" role="button" tabindex="0" aria-label="Abrir ${escapeHTML(agent.name)}: ${escapeHTML(agent.role)}">
    <circle class="node-bg" cx="${x}" cy="${y}" r="${radius + 10}" fill="${color}" fill-opacity=".045" />
    <circle class="node-ring" cx="${x}" cy="${y}" r="${radius + 4}" stroke="${color}" stroke-opacity=".44" />
    <circle class="node-bg" cx="${x}" cy="${y}" r="${radius}" />
    <circle class="node-inner" cx="${x}" cy="${y}" r="${radius - 7}" />
    <circle class="node-eye" cx="${x - radius * .27}" cy="${y - 2}" r="${agent.chief ? 3.9 : 3}" />
    <circle class="node-eye" cx="${x + radius * .27}" cy="${y - 2}" r="${agent.chief ? 3.9 : 3}" />
    <circle class="node-status" cx="${x + radius * .75}" cy="${y + radius * .7}" r="5" fill="${statusColor}" />
    <text class="node-name" x="${x}" y="${y + radius + 25}">${escapeHTML(agent.name)}</text>
    <text class="node-role" x="${x}" y="${y + radius + 41}">${escapeHTML(agent.role)}</text>
  </g>`;
}

function renderScene() {
  const network = teams.map(team => {
    const hub = byId[team.agents[0]];
    const rest = team.agents.slice(1).map(id => byId[id]);
    return `<path class="route" d="${route(640, 330, team.x, team.y, team.id === 'personal' ? 0 : team.id === 'research' ? -50 : 50)}" stroke="${team.color}" />
      <path class="flow" d="${route(640, 330, team.x, team.y, team.id === 'personal' ? 0 : team.id === 'research' ? -50 : 50)}" stroke="${team.color}" />
      ${rest.map(agent => `<path class="route route-secondary" d="${route(hub.x, hub.y, agent.x, agent.y)}" stroke="${team.color}" />`).join('')}`;
  }).join('');
  const teamAreas = teams.map(team => `<g aria-hidden="true"><circle class="team-core" cx="${team.x}" cy="${team.y}" r="118" fill="${team.color}"/><circle class="team-halo" cx="${team.x}" cy="${team.y}" r="127" stroke="${team.color}"/><text class="team-heading" x="${team.labelX}" y="${team.labelY}" text-anchor="middle">${team.name}</text><text class="team-count" x="${team.labelX}" y="${team.labelY + 17}" text-anchor="middle">3 AGENTES</text></g>`).join('');
  const dots = [
    [58, 125, 2], [403, 85, 1.5], [550, 207, 2], [723, 146, 1.5], [1160, 96, 2],
    [1173, 548, 1.5], [929, 495, 2], [324, 515, 1.5], [108, 558, 2], [435, 689, 1.5],
    [847, 644, 1.5], [45, 382, 1.5], [1207, 305, 1.5]
  ].map(([x, y, r], index) => `<circle class="particle" cx="${x}" cy="${y}" r="${r}" fill="#b0c8d9" style="animation-delay:${index * -.28}s"/>`).join('');
  scene.innerHTML = `<defs><radialGradient id="jarvisAura"><stop offset="0" stop-color="#75b5df" stop-opacity=".13"/><stop offset="1" stop-color="#75b5df" stop-opacity="0"/></radialGradient></defs>
    <g aria-hidden="true"><circle class="grid-ring" cx="640" cy="330" r="222"/><circle class="grid-ring" cx="640" cy="330" r="375"/><circle class="grid-ring" cx="640" cy="330" r="555"/><line class="grid-axis" x1="640" y1="0" x2="640" y2="680"/><line class="grid-axis" x1="0" y1="330" x2="1280" y2="330"/>${dots}</g>
    ${network}${teamAreas}
    <g class="jarvis-hit" data-agent="jarvis" role="button" tabindex="0" aria-label="Abrir conversa com Jarvis">
      <circle class="jarvis-aura" cx="640" cy="330" r="150"/>
      <circle class="jarvis-halo" cx="640" cy="330" r="101"/><circle class="jarvis-halo secondary" cx="640" cy="330" r="86"/>
      <circle class="jarvis-halo" cx="640" cy="330" r="72"/>
      <circle class="jarvis-main" cx="640" cy="330" r="60"/>
      <circle fill="#273747" cx="640" cy="330" r="47"/>
      <ellipse class="jarvis-eyes" cx="623" cy="325" rx="6" ry="10"/><ellipse class="jarvis-eyes" cx="657" cy="325" rx="6" ry="10"/>
      <text class="jarvis-name" x="640" y="426">JARVIS</text><text class="jarvis-role" x="640" y="444">AGENTE PRINCIPAL</text>
    </g>
    ${agents.map(svgNode).join('')}`;
}

function renderMobileRoster() {
  document.getElementById('mobileRoster').innerHTML = teams.map(team => `<div class="mobile-team-title">${team.name}</div>${team.agents.map(id => {
    const agent = byId[id];
    return `<button class="mobile-agent" type="button" data-agent="${id}" style="--agent-color:${team.color}">${escapeHTML(agent.name)}<span>${escapeHTML(agent.role)}</span></button>`;
  }).join('')}`).join('');
}

function renderStrip() {
  const emailPending = approvals.find(item => item.id === 'email').status === 'pending';
  document.getElementById('activityStrip').innerHTML = [
    { name: 'Correio', text: emailPending ? 'resposta à tua espera' : 'a organizar mensagens', color: '#6bcdea' },
    { name: 'Vigia', text: 'reviu 3 alterações', color: '#65dfae' },
    { name: 'Diário', text: 'resumo do dia pronto', color: '#ff947d' }
  ].map(item => `<div class="strip-item"><span class="strip-dot" style="--dot:${item.color}"></span><span class="strip-copy"><b>${item.name}</b> ${item.text}</span></div>`).join('');
}

function setRail(view) {
  document.querySelectorAll('.rail-button').forEach(button => button.classList.toggle('active', button.dataset.view === view));
}

function openPanel(view, agentId) {
  currentView = view;
  selectedAgent = agentId || null;
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
  panel.inert = false;
  setRail(view === 'agent' || view === 'briefing' ? 'orbit' : view);
  renderPanel();
}

function closePanel() {
  currentView = 'orbit';
  selectedAgent = null;
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  panel.inert = true;
  setRail('orbit');
}

function approvalCard(approval, compact = false) {
  const done = approval.status !== 'pending';
  return `<div class="info-card" data-approval-card="${approval.id}">
    <div class="card-kicker">${done ? 'DECISÃO LOCAL' : 'À TUA ESPERA'}</div>
    <h3 style="margin-top:8px">${escapeHTML(approval.title)}</h3>
    <p>${escapeHTML(approval.detail)}</p>
    <div class="proposal-preview"><div><span>${approval.id === 'email' ? 'PARA' : 'DESTINO'}</span><strong>${escapeHTML(approval.recipient)}</strong></div><div><span>${approval.id === 'email' ? 'ASSUNTO' : 'EVENTO'}</span><strong>${escapeHTML(approval.subject)}</strong></div><p>${escapeHTML(approval.proposal)}</p></div>
    <div class="card-foot"><span>${escapeHTML(approval.from)} · ${escapeHTML(approval.time)}</span><span>${done ? (approval.status === 'approved' ? 'Aprovado na demonstração' : 'Recusado na demonstração') : 'Pendente'}</span></div>
    ${done ? '' : `<div class="card-actions"><button class="primary-button" type="button" data-approval="${approval.id}" data-decision="approved">Aprovar</button><button type="button" data-approval="${approval.id}" data-decision="rejected">Recusar</button>${compact ? '' : `<button type="button" data-open-agent="${approval.from === 'Correio' ? 'correio' : 'agenda'}">Ver conversa</button>`}</div>`}
  </div>`;
}

function renderAgentPanel() {
  const agent = selectedAgent === 'jarvis' ? jarvis : byId[selectedAgent];
  if (!agent) { closePanel(); return; }
  const color = agent.id === 'jarvis' ? agent.color : teamById[agent.team].color;
  panelKicker.textContent = agent.id === 'jarvis' ? 'AGENTE PRINCIPAL' : teamById[agent.team].name;
  const messages = [...agent.messages, ...(extraMessages[agent.id] || [])];
  const approval = approvals.find(item => item.id === agent.approval && item.status === 'pending');
  panelContent.innerHTML = `<div class="panel-section">
      <div class="agent-profile"><div class="panel-avatar" style="--avatar-color:${color}"></div><div><h2>${escapeHTML(agent.name)}</h2><p>${escapeHTML(agent.role)}</p></div></div>
      <p class="panel-description" style="margin-top:18px">${escapeHTML(agent.description)}</p>
      <div class="panel-meta"><span class="state-line" style="--state-color:${agent.state === 'À tua espera' ? '#ffad8e' : agent.state === 'Em curso' ? '#65dfae' : '#8e9aa8'}"><span></span>${escapeHTML(agent.state)}</span><strong>${agent.id === 'jarvis' ? 'Coordenação' : 'Especialista'}</strong></div>
      <div class="panel-rule"></div><div class="section-caption">CONVERSA</div>
    </div>
    <div class="message-list">${messages.map(message => `<div class="message ${message.mine ? 'mine' : ''}"><div class="message-author">${message.mine ? 'TU' : escapeHTML(agent.name.toUpperCase())}</div>${escapeHTML(message.text || message)}</div>`).join('')}</div>
    ${approval ? `<div class="section-caption" style="margin-left:22px">PRECISA DA TUA DECISÃO</div>${approvalCard(approval, true)}` : ''}
    <div class="composer"><textarea id="agentMessage" placeholder="Escrever a ${escapeHTML(agent.name)}…" aria-label="Escrever mensagem a ${escapeHTML(agent.name)}"></textarea><button type="button" id="sendMessage" aria-label="Guardar mensagem"><svg class="icon"><use href="#i-send"></use></svg></button></div>
    <p class="demo-note">As mensagens ficam apenas nesta sessão de demonstração.</p>`;
}

function renderPanel() {
  if (currentView === 'agent') { renderAgentPanel(); return; }
  if (currentView === 'approvals') {
    panelKicker.textContent = 'DECISÕES';
    const pending = approvals.filter(item => item.status === 'pending');
    panelContent.innerHTML = `<div class="panel-section"><h2 class="panel-title">À tua espera</h2><p class="panel-description">Os agentes continuam as outras tarefas enquanto estas decisões aguardam por ti.</p><div class="panel-rule"></div><div class="section-caption">${pending.length} PENDENTES</div></div>${pending.length ? pending.map(item => approvalCard(item)).join('') : '<div class="info-card"><h3>Tudo tratado</h3><p>Não há decisões pendentes nesta demonstração.</p></div>'}<p class="demo-note" style="margin-top:18px">Aprovar aqui apenas altera este protótipo; nenhum e-mail ou evento é enviado.</p>`;
    return;
  }
  if (currentView === 'briefing') {
    panelKicker.textContent = 'DIÁRIO';
    const date = new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
    panelContent.innerHTML = `<div class="panel-section"><h2 class="panel-title">Resumo do dia</h2><p class="panel-description">${escapeHTML(date)} · Uma ata breve do que aconteceu e do que ficou por decidir.</p><div class="panel-rule"></div></div>
      <div class="summary-block"><h3>O que avançou</h3><p>Três alterações de projeto foram analisadas. Um resumo de pesquisa ficou pronto e a agenda encontrou dois horários possíveis para a próxima reunião.</p></div>
      <div class="summary-block"><h3>O que precisa de ti</h3><p>Há uma resposta de e-mail por rever e uma escolha de horário pendente. Podes abrir cada pedido na área de aprovações.</p></div>
      <div class="summary-block"><h3>Próximo passo</h3><p>Rever as alterações do projeto e decidir se a resposta preparada pelo Correio pode ser enviada.</p></div>
      <div class="panel-section"><button class="secondary-button" type="button" data-view="approvals">Ver pedidos pendentes ${icon('arrow')}</button></div>
      <p class="demo-note" style="margin-top:18px">Exemplo de ata diária com dados de demonstração.</p>`;
    return;
  }
  if (currentView === 'activity') {
    panelKicker.textContent = 'ATIVIDADE';
    panelContent.innerHTML = `<div class="panel-section"><h2 class="panel-title">O que aconteceu</h2><p class="panel-description">O trabalho da equipa, por ordem de chegada.</p><div class="panel-rule"></div></div><div class="timeline">${events.map(event => `<div class="timeline-item" style="--event-color:${event.color}"><span class="time">${event.time}</span><h3>${escapeHTML(event.title)}</h3><p>${escapeHTML(event.detail)}</p></div>`).join('')}</div><p class="demo-note">Atividade ilustrativa desta demonstração.</p>`;
    return;
  }
  if (currentView === 'connections') {
    panelKicker.textContent = 'SERVIÇOS';
    panelContent.innerHTML = `<div class="panel-section"><h2 class="panel-title">Ligações</h2><p class="panel-description">Serviços previstos para ligar ao Jarvis nas próximas fases.</p><div class="panel-rule"></div><div class="section-caption">CONTAS</div></div>
      ${[['mail','Gmail','E-mail pessoal'],['mail','Outlook','E-mail do IPCA'],['calendar','Google Calendar','Agenda'],['git','GitHub','Projetos e alterações']].map(([symbol,name,desc]) => `<div class="connector-row">${icon(symbol)}<div><strong>${name}</strong><small>${desc}</small></div><span class="soon">POR LIGAR</span></div>`).join('')}
      <p class="demo-note" style="margin-top:20px">Este protótipo não pede acesso às tuas contas.</p>`;
    return;
  }
  if (currentView === 'settings') {
    panelKicker.textContent = 'PREFERÊNCIAS';
    panelContent.innerHTML = `<div class="panel-section"><h2 class="panel-title">O teu Jarvis</h2><p class="panel-description">As preferências e permissões serão definidas contigo antes de ligar agentes reais.</p><div class="panel-rule"></div><div class="section-caption">NESTA DEMONSTRAÇÃO</div></div>
      <div class="connector-row">${icon('spark')}<div><strong>Idioma da interface</strong><small>Português · inglês previsto</small></div></div>
      <div class="connector-row">${icon('bell')}<div><strong>Notificações</strong><small>Apenas visualização local</small></div></div>
      <div class="connector-row">${icon('plug')}<div><strong>Integrações</strong><small>Sem contas ligadas</small></div></div>`;
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

function updateApprovalCount() {
  const count = approvals.filter(item => item.status === 'pending').length;
  document.querySelectorAll('.rail-count').forEach(el => { el.textContent = count; el.hidden = count === 0; });
  document.querySelector('.notification-dot').hidden = count === 0;
}

function renderCommandResults() {
  const query = commandInput.value.trim().toLocaleLowerCase('pt-PT');
  const results = [
    { label: 'Jarvis', meta: 'Agente principal', id: 'jarvis', color: '#a8d5ec', type: 'agent' },
    ...agents.map(agent => ({ label: agent.name, meta: agent.role, id: agent.id, color: teamById[agent.team].color, type: 'agent' })),
    { label: 'Resumo do dia', meta: 'Diário', id: 'briefing', color: '#a8d5ec', type: 'view' },
    { label: 'Aprovações', meta: 'Decisões', id: 'approvals', color: '#ff947d', type: 'view' },
    { label: 'Atividade', meta: 'Equipa', id: 'activity', color: '#65dfae', type: 'view' }
  ].filter(item => `${item.label} ${item.meta}`.toLocaleLowerCase('pt-PT').includes(query));
  commandResults.innerHTML = results.length ? `<div class="result-label">${query ? 'RESULTADOS' : 'SALTAR PARA'}</div>${results.map((item,index) => `<button class="result-item ${index === 0 ? 'active' : ''}" type="button" data-result-type="${item.type}" data-result-id="${item.id}"><span class="result-dot" style="--dot-color:${item.color}"></span>${escapeHTML(item.label)}<small>${escapeHTML(item.meta)}</small></button>`).join('')}` : '<div class="no-results">Nenhum resultado. Experimenta outro termo.</div>';
}

function openCommand() {
  if (!commandDialog.open) commandDialog.showModal();
  commandInput.value = '';
  renderCommandResults();
  commandInput.focus();
}

function selectCommand(button) {
  if (!button) return;
  commandDialog.close();
  if (button.dataset.resultType === 'agent') openPanel('agent', button.dataset.resultId);
  else openPanel(button.dataset.resultId);
}

document.addEventListener('click', event => {
  const agentButton = event.target.closest('[data-agent]');
  if (agentButton) { openPanel('agent', agentButton.dataset.agent); return; }
  const viewButton = event.target.closest('[data-view]');
  if (viewButton) { viewButton.dataset.view === 'orbit' ? closePanel() : openPanel(viewButton.dataset.view); return; }
  const approvalButton = event.target.closest('[data-approval]');
  if (approvalButton) {
    const approval = approvals.find(item => item.id === approvalButton.dataset.approval);
    if (!approval || approval.status !== 'pending') return;
    approval.status = approvalButton.dataset.decision;
    byId[approval.id === 'email' ? 'correio' : 'agenda'].state = approval.id === 'email' ? 'Disponível' : 'Em curso';
    updateApprovalCount();
    renderScene();
    renderStrip();
    renderPanel();
    showToast('Decisão simulada. Nenhum e-mail ou evento foi enviado.');
    return;
  }
  const openAgent = event.target.closest('[data-open-agent]');
  if (openAgent) { openPanel('agent', openAgent.dataset.openAgent); return; }
  if (event.target.closest('#sendMessage')) {
    const field = document.getElementById('agentMessage');
    const message = field?.value.trim();
    if (!message || !selectedAgent) return;
    (extraMessages[selectedAgent] ||= []).push({ text: message, mine: true });
    renderAgentPanel();
    panelContent.scrollTop = panelContent.scrollHeight;
    showToast('Mensagem guardada nesta demonstração.');
  }
});

scene.addEventListener('keydown', event => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-agent]')) {
    event.preventDefault();
    openPanel('agent', event.target.dataset.agent);
  }
});

document.getElementById('closePanel').addEventListener('click', closePanel);
document.getElementById('searchTrigger').addEventListener('click', openCommand);
commandInput.addEventListener('input', renderCommandResults);
commandResults.addEventListener('click', event => selectCommand(event.target.closest('[data-result-id]')));
commandInput.addEventListener('keydown', event => {
  const items = [...commandResults.querySelectorAll('.result-item')];
  const current = items.findIndex(item => item.classList.contains('active'));
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    if (!items.length) return;
    items[current]?.classList.remove('active');
    const next = (current + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    items[next].classList.add('active');
    items[next].scrollIntoView({ block: 'nearest' });
  }
  if (event.key === 'Enter') { event.preventDefault(); selectCommand(items[current] || items[0]); }
});

document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openCommand(); }
  if (event.key === 'Escape' && !commandDialog.open && panel.classList.contains('open')) closePanel();
  if (event.key === 'Enter' && event.target.id === 'agentMessage' && !event.shiftKey) { event.preventDefault(); document.getElementById('sendMessage')?.click(); }
});

function setZoom(next) {
  sceneScale = Math.max(.8, Math.min(1.3, next));
  scene.style.setProperty('--scene-scale', sceneScale);
  document.getElementById('zoomLabel').textContent = `${Math.round(sceneScale * 100)}%`;
}
document.getElementById('zoomOut').addEventListener('click', () => setZoom(sceneScale - .1));
document.getElementById('zoomIn').addEventListener('click', () => setZoom(sceneScale + .1));
document.getElementById('zoomReset').addEventListener('click', () => setZoom(1));

function updateClock() {
  document.getElementById('currentTime').textContent = new Intl.DateTimeFormat('pt-PT', { hour: '2-digit', minute: '2-digit' }).format(new Date());
}
renderScene();
renderMobileRoster();
renderStrip();
updateApprovalCount();
updateClock();
setInterval(updateClock, 30000);
