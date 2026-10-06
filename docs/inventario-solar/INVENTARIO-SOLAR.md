# Inventário funcional do Solar 0.1.87

Data: **5 de outubro de 2026**, Europe/Lisbon. Código analisado: **7ac1c04**, branch main. Aplicação Windows aberta por código e janela Solar confirmada através da UI Automation.

## Como usar esta lista

Cada item tem um ID e uma caixa por marcar. A caixa significa **avaliação de qualidade por fazer**, não funcionalidade em falta. Podemos escolher IDs e decidir: manter, melhorar, substituir, retirar ou testar. Este inventário descreve o que existe na interface e implementação; ainda não compara fornecedores nem afirma que a tecnologia atual é a melhor.

**Evidência:** observação da aplicação instalada para o mapa, foco de Jarvis e hub Sistema; leitura dos componentes/handlers; extração estática de 791 ficheiros, 1099 linhas com controlos, 3449 referências de textos traduzidos e 473 referências de API. Estas contagens não são quantidades de funcionalidades distintas.

**Limite:** nenhum inventário estático prova cobertura absoluta de todas as combinações de estado. Não foram executados todos os botões nem testadas contas, permissões, microfone, cloud ou telefone. Os índices conservam superfícies condicionais/legadas para permitir a revisão posterior. Bibliotecas MCP externas podem acrescentar ferramentas arbitrárias: o catálogo final dessas ferramentas só é conhecido depois de instalar e consultar cada servidor.

## O que confirmei na aplicação aberta

- O mapa mostra agentes reais, pesquisa, Criar, zoom, enquadramento, linhas de hierarquia, reposição de disposição e compositor com destinatário/ditado.
- Jarvis abre chat, modelo, aprovações, destino, threads, anexos, chamada, menu e os seis sistemas próprios.
- Sistema dá acesso a motores, chaves, Apps, remoto/telefone, consumo, calendário, biblioteca, aparência, backups e outras definições.
- O hub de motores apresenta **14 motores e 1 pronto** nesta instalação. Isto é estado observado, não um teste de respostas nem prova de disponibilidade de todos os motores.

## Índice

- 01. Mapa solar e navegação (20 itens)
- 02. Criação e identidade dos agentes (24 itens)
- 03. Jarvis integrado e assistência da aplicação (14 itens)
- 04. Conversa, mensagens e compositor (29 itens)
- 05. Anexos e resultados apresentados (14 itens)
- 06. Threads, pastas e gestão de trabalho (23 itens)
- 07. Equipas, responsáveis e canais (22 itens)
- 08. Delegação e objetivos de equipa (16 itens)
- 09. Motores e modelos de IA (31 itens)
- 10. Chaves e ligações de fornecedores (11 itens)
- 11. Aprovações, cartões e credenciais pedidas (20 itens)
- 12. Computador, ecrã e controlo humano (16 itens)
- 13. VM local, Boat cloud e VPS próprio (15 itens)
- 14. Navegador integrado e perfis autenticados (23 itens)
- 15. Android por USB (12 itens)
- 16. Ditado, chamadas e reprodução de voz (25 itens)
- 17. Ficheiros, editor e Desenvolvimento Solar (18 itens)
- 18. Memória e contexto pessoal (18 itens)
- 19. Skills e playbooks (13 itens)
- 20. Plugins, Apps e servidores MCP (22 itens)
- 21. Rotinas agendadas e calendário (35 itens)
- 22. Webhooks e eventos externos (12 itens)
- 23. Integração Slack (6 itens)
- 24. Telefone companion e acesso remoto (21 itens)
- 25. Workspaces ligados e computadores partilhados (17 itens)
- 26. Backups e reposição de workspace (13 itens)
- 27. Templates, biblioteca e partilha de equipas (16 itens)
- 28. Consumo, custos e faturação (14 itens)
- 29. Pessoas, audiência e auditoria (13 itens)
- 30. Organização, modelos e backups cloud empresariais (18 itens)
- 31. Servidor multi-workspace e camada enterprise (12 itens)
- 32. Definições gerais, aparência e onboarding (24 itens)
- 33. Desktop, diagnóstico, atualizações e APIs (20 itens)

## 01. Mapa solar e navegação

**Implementação atual:** React + renderização Three.js/WebGL + preferências locais.

**Condições:** Solar desktop/browser; mapa depende dos agentes existentes.

**Fontes:** [src/orbit/SolarMap.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarMap.tsx:1), [src/orbit/SolarChrome.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarChrome.tsx:1), [src/orbit/solar-interaction.js](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/solar-interaction.js:1), [src/orbit/solar-renderer.js](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/solar-renderer.js:1).

- [ ] **SOL-001** — Ver Jarvis como Sol, responsáveis como planetas e agentes como luas.
- [ ] **SOL-002** — Abrir o foco e a conversa de um agente ao clicar no seu corpo ou rótulo.
- [ ] **SOL-003** — Arrastar um agente para reorganizar o mapa.
- [ ] **SOL-004** — Mover planetas com as suas luas associadas.
- [ ] **SOL-005** — Mover agentes com teclas de seta e acelerar com Shift.
- [ ] **SOL-006** — Aumentar o zoom.
- [ ] **SOL-007** — Diminuir o zoom.
- [ ] **SOL-008** — Enquadrar todo o sistema.
- [ ] **SOL-009** — Mostrar ou ocultar linhas de hierarquia.
- [ ] **SOL-010** — Restaurar a disposição inicial do mapa.
- [ ] **SOL-011** — Conservar a disposição local do mapa.
- [ ] **SOL-012** — Adaptar o mapa ao tamanho e orientação do ecrã.
- [ ] **SOL-013** — Mostrar os estados de repouso, pensamento, trabalho, espera, falha e desligado.
- [ ] **SOL-014** — Animar olhar, piscar, boca e sono dos retratos de acordo com o estado.
- [ ] **SOL-015** — Pesquisar agentes e tarefas a partir do cabeçalho.
- [ ] **SOL-016** — Escolher destinatário, pesquisar e enviar uma mensagem diretamente no mapa.
- [ ] **SOL-017** — Iniciar e parar o ditado no compositor do mapa.
- [ ] **SOL-018** — Voltar ao mapa pelo botão Team map, fundo ou Escape.
- [ ] **SOL-019** — Redimensionar a área de chat e repor a largura com duplo clique.
- [ ] **SOL-020** — Abrir o menu Criar: agente, equipa ou canal.

## 02. Criação e identidade dos agentes

**Implementação atual:** Formulários React + registos persistentes de bots + SOUL.md.

**Condições:** Algumas ações são reservadas ao proprietário/admin; Jarvis integrado tem regras próprias.

**Fontes:** [src/orbit/detail/NewBotPanel.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/NewBotPanel.tsx:1), [src/orbit/detail/ProfilePanels.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/ProfilePanels.tsx:1), [src/components/ChatHeader.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatHeader.tsx:1), [src/lib/bot-roles.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/lib/bot-roles.ts:1).

- [ ] **SOL-021** — Criar um agente em branco.
- [ ] **SOL-022** — Criar um agente a partir de um papel predefinido.
- [ ] **SOL-023** — Pesquisar papéis e modelos de equipas.
- [ ] **SOL-024** — Criar uma equipa vazia ou a partir de um modelo.
- [ ] **SOL-025** — Definir o nome do agente.
- [ ] **SOL-026** — Definir a função/papel do agente.
- [ ] **SOL-027** — Definir a descrição curta do agente.
- [ ] **SOL-028** — Editar as instruções permanentes em SOUL.md.
- [ ] **SOL-029** — Escolher a cor/identidade visual do agente.
- [ ] **SOL-030** — Definir quem vê o agente: todos, administradores ou emails/domínios específicos.
- [ ] **SOL-031** — Abrir o perfil pelo retrato/cabeçalho.
- [ ] **SOL-032** — Ver a visão geral: o que faz, alcança e não faz.
- [ ] **SOL-033** — Pré-visualizar o prompt/instruções que o modelo recebe e a estimativa de tokens.
- [ ] **SOL-034** — Executar /setup para o agente entrevistar o utilizador e preparar o seu papel.
- [ ] **SOL-035** — Fixar ou desafixar um agente.
- [ ] **SOL-036** — Marcar um agente como não lido.
- [ ] **SOL-037** — Mover um agente para outra equipa.
- [ ] **SOL-038** — Promover um agente a responsável de equipa ou retirar essa função.
- [ ] **SOL-039** — Duplicar um agente.
- [ ] **SOL-040** — Ocultar um agente do mapa.
- [ ] **SOL-041** — Arquivar um agente, respeitando as restrições do responsável e do último agente.
- [ ] **SOL-042** — Consultar e recuperar agentes arquivados.
- [ ] **SOL-043** — Apagar um agente mediante confirmação.
- [ ] **SOL-044** — Consultar o histórico de alterações do perfil e definições.

## 03. Jarvis integrado e assistência da aplicação

**Implementação atual:** Agente integrado + ferramentas de propostas + shell Electron.

**Condições:** Jarvis preserva identidade interna; shell e voz variam com plataforma.

**Fontes:** [src/orbit/OrbitShell.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/OrbitShell.tsx:1), [server/orbit-agent.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/orbit-agent.ts:1), [electron/orbit-summon.mjs](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/orbit-summon.mjs:1), [src/shell/QuickBar.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/shell/QuickBar.tsx:1), [src/components/OrbitAssistantSettings.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrbitAssistantSettings.tsx:1).

- [ ] **SOL-045** — Conversar com o assistente integrado que trabalha entre equipas.
- [ ] **SOL-046** — Abrir os seis sistemas do Jarvis: motor, aprovações, skills, memória, voz e Sistema.
- [ ] **SOL-047** — Pedir diagnóstico do estado de agentes, motores e rotinas.
- [ ] **SOL-048** — Pedir leitura de logs e contexto autorizado de threads.
- [ ] **SOL-049** — Receber propostas de alterações de definições, em cartões de confirmação.
- [ ] **SOL-050** — Receber propostas para adicionar um servidor MCP.
- [ ] **SOL-051** — Receber propostas de alteração de perfil e modelo.
- [ ] **SOL-052** — Receber propostas para criar ou alterar rotinas.
- [ ] **SOL-053** — Abrir a barra rápida por atalho global, incluindo Alt+O no Windows.
- [ ] **SOL-054** — Alterar ou desligar os atalhos globais.
- [ ] **SOL-055** — Usar o guia/pointer no ecrã quando o shell e permissões o permitem.
- [ ] **SOL-056** — Consultar permissões e pausar o acesso do assistente ao ecrã.
- [ ] **SOL-057** — Usar o modo de voz flutuante/island no macOS quando suportado.
- [ ] **SOL-058** — Abrir, ocultar, restaurar e sair da aplicação pelo ícone de bandeja.

## 04. Conversa, mensagens e compositor

**Implementação atual:** Chat React + eventos do servidor + adaptador do motor.

**Condições:** Respostas reais requerem motor autenticado/configurado; capacidades diferem por motor.

**Fontes:** [src/components/ChatView.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatView.tsx:1), [src/components/Composer.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1), [src/components/ChatMarkdown.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ChatMarkdown.tsx:1), [src/components/MessageActions.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/MessageActions.tsx:1), [src/components/ComposerQueuedMessages.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerQueuedMessages.tsx:1).

- [ ] **SOL-059** — Enviar mensagens ao agente selecionado.
- [ ] **SOL-060** — Receber texto e atividade de ferramentas durante a execução.
- [ ] **SOL-061** — Inserir uma nova linha sem enviar com Shift+Enter.
- [ ] **SOL-062** — Editar uma mensagem enviada e reenviar a alteração.
- [ ] **SOL-063** — Editar a última mensagem pelo atalho de seta para cima com o compositor vazio.
- [ ] **SOL-064** — Copiar o conteúdo de uma mensagem.
- [ ] **SOL-065** — Responder com uma citação de mensagem.
- [ ] **SOL-066** — Guardar uma mensagem na memória com Remember this.
- [ ] **SOL-067** — Ler uma resposta em voz alta quando há voz disponível.
- [ ] **SOL-068** — Ver Markdown, tabelas, links e blocos de código.
- [ ] **SOL-069** — Alternar entre Markdown apresentado e texto original.
- [ ] **SOL-070** — Interromper o turno em curso com Stop.
- [ ] **SOL-071** — Enviar mensagens para a fila enquanto o agente está ocupado.
- [ ] **SOL-072** — Introduzir uma mensagem no turno em curso quando o motor permite steering.
- [ ] **SOL-073** — Consultar e gerir mensagens na fila.
- [ ] **SOL-074** — Recuperar o rascunho após falha de envio, repetir ou dispensar a falha.
- [ ] **SOL-075** — Conservar rascunhos por conversa no browser.
- [ ] **SOL-076** — Ver indicadores de atividade, espera, erro e trabalho de outros agentes.
- [ ] **SOL-077** — Carregar mensagens anteriores e posteriores em históricos paginados.
- [ ] **SOL-078** — Voltar à mensagem mais recente.
- [ ] **SOL-079** — Pesquisar dentro da conversa e navegar entre resultados.
- [ ] **SOL-080** — Pesquisar mensagens de várias conversas na paleta global.
- [ ] **SOL-081** — Mencionar agentes com @ e escolher os destinatários.
- [ ] **SOL-082** — Inserir referências a outras threads e abrir os respetivos links.
- [ ] **SOL-083** — Abrir comandos /setup, /learn e /goal quando aplicáveis.
- [ ] **SOL-084** — Descarregar a conversa em Markdown.
- [ ] **SOL-085** — Copiar a transcrição completa.
- [ ] **SOL-086** — Copiar o link da thread.
- [ ] **SOL-087** — Copiar o identificador da conversa.

## 05. Anexos e resultados apresentados

**Implementação atual:** Anexos de conversa + rotas limitadas à mensagem + viewers + iframe sandbox.

**Condições:** Imagens aceites dependem do motor; os resultados têm de existir e ser partilhados.

**Fontes:** [src/components/ComposerAttachments.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComposerAttachments.tsx:1), [src/components/AttachmentGallery.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentGallery.tsx:1), [src/components/AttachmentPreview.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AttachmentPreview.tsx:1), [src/orbit/ArtifactCard.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/ArtifactCard.tsx:1), [src/orbit/artifacts.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/artifacts.ts:1), [server/message-file.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/message-file.ts:1).

- [ ] **SOL-088** — Anexar um ficheiro pelo seletor.
- [ ] **SOL-089** — Arrastar ficheiros para o compositor.
- [ ] **SOL-090** — Colar imagens da área de transferência.
- [ ] **SOL-091** — Transformar colagens longas em anexos quando aplicável.
- [ ] **SOL-092** — Ver e remover anexos antes do envio.
- [ ] **SOL-093** — Apresentar imagens anexadas e abrir a galeria.
- [ ] **SOL-094** — Navegar entre imagens na galeria.
- [ ] **SOL-095** — Abrir e descarregar ficheiros partilhados.
- [ ] **SOL-096** — Mostrar HTML como resultado numa área ao lado do chat.
- [ ] **SOL-097** — Mostrar um PDF partilhado ao lado do chat.
- [ ] **SOL-098** — Mostrar uma imagem partilhada ao lado do chat.
- [ ] **SOL-099** — Ver o convite/oferta de resultado do agente no mapa e no foco.
- [ ] **SOL-100** — Aceitar ou fechar a apresentação do resultado.
- [ ] **SOL-101** — Usar uma apresentação isolada para HTML e restringir o acesso ao ficheiro da mensagem.

## 06. Threads, pastas e gestão de trabalho

**Implementação atual:** Estado por thread + agrupamento por pastas + filas e limites.

**Condições:** Modelos, acessos e pasta de trabalho podem estar fixados por thread.

**Fontes:** [src/components/TaskPicker.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TaskPicker.tsx:1), [src/components/SidebarThreadRow.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SidebarThreadRow.tsx:1), [src/components/BotProjects.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BotProjects.tsx:1), [src/components/ThreadControls.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadControls.tsx:1).

- [ ] **SOL-102** — Criar uma nova thread/conversa.
- [ ] **SOL-103** — Mudar entre threads do mesmo agente.
- [ ] **SOL-104** — Ver threads ativas e arquivadas.
- [ ] **SOL-105** — Pesquisar threads pelo título.
- [ ] **SOL-106** — Renomear uma thread.
- [ ] **SOL-107** — Fixar/desafixar uma thread.
- [ ] **SOL-108** — Arquivar e desarquivar uma thread.
- [ ] **SOL-109** — Apagar uma thread e a sua conversa.
- [ ] **SOL-110** — Adiar uma thread até nova atividade, até às 18h ou até às 9h do dia seguinte.
- [ ] **SOL-111** — Retirar o adiamento de uma thread.
- [ ] **SOL-112** — Copiar o link de uma thread.
- [ ] **SOL-113** — Criar uma pasta para organizar threads.
- [ ] **SOL-114** — Mudar o nome e ícone/emoji de uma pasta.
- [ ] **SOL-115** — Mover uma thread para uma pasta ou para fora dela.
- [ ] **SOL-116** — Alterar a ordem das pastas.
- [ ] **SOL-117** — Marcar uma pasta como lida.
- [ ] **SOL-118** — Criar uma nova thread diretamente numa pasta.
- [ ] **SOL-119** — Apagar uma pasta mantendo as conversas.
- [ ] **SOL-120** — Escolher motor/modelo para a thread.
- [ ] **SOL-121** — Escolher nível de aprovação para a thread.
- [ ] **SOL-122** — Escolher o destino de computador da thread.
- [ ] **SOL-123** — Ver threads com trabalho, mensagens na fila e aprovações pendentes.
- [ ] **SOL-124** — Definir o número máximo de threads paralelas por agente.

## 07. Equipas, responsáveis e canais

**Implementação atual:** Registos de equipas/canais + coordenação de agentes.

**Condições:** Membros, audiência e papel de responsável condicionam o acesso.

**Fontes:** [src/orbit/detail/HubPanels.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/HubPanels.tsx:1), [src/components/TeamDialog.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamDialog.tsx:1), [src/components/NewChannelDialog.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/NewChannelDialog.tsx:1), [src/components/ManageMembersPanel.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ManageMembersPanel.tsx:1), [src/components/GroupView.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupView.tsx:1).

- [ ] **SOL-125** — Criar e renomear uma equipa.
- [ ] **SOL-126** — Editar as instruções partilhadas da equipa.
- [ ] **SOL-127** — Escolher e mudar o responsável da equipa.
- [ ] **SOL-128** — Definir as equipas geridas pelo responsável.
- [ ] **SOL-129** — Adicionar e retirar agentes da equipa.
- [ ] **SOL-130** — Escolher os computadores da equipa e os destinos predefinidos.
- [ ] **SOL-131** — Consultar as rotinas da equipa.
- [ ] **SOL-132** — Apagar uma equipa com confirmação.
- [ ] **SOL-133** — Criar um canal/conversa de grupo.
- [ ] **SOL-134** — Adicionar e remover membros do canal.
- [ ] **SOL-135** — Criar canais com agentes de várias equipas.
- [ ] **SOL-136** — Definir um responsável de resposta do canal.
- [ ] **SOL-137** — Escolher respostas de todos, apenas @menções ou um agente específico.
- [ ] **SOL-138** — Editar instruções partilhadas do canal.
- [ ] **SOL-139** — Definir a pasta de trabalho de um canal antes de a thread a fixar.
- [ ] **SOL-140** — Renomear o canal ou a sua thread.
- [ ] **SOL-141** — Mover um canal para outra equipa.
- [ ] **SOL-142** — Fixar e desafixar mensagens do canal.
- [ ] **SOL-143** — Responder a mensagens do canal com citação.
- [ ] **SOL-144** — Pesquisar, copiar ou exportar a conversa de grupo.
- [ ] **SOL-145** — Apagar uma conversa de grupo, sem apagar os agentes.
- [ ] **SOL-146** — Ver custos/tokens do trabalho do grupo.

## 08. Delegação e objetivos de equipa

**Implementação atual:** Ferramentas agents/MCP + orquestração de turnos, handoffs e retornos.

**Condições:** Disponibilidade do motor, permissões, membros e slots de trabalho.

**Fontes:** [server/drivers/agents-catalog.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-catalog.ts:1), [server/group-goal-run.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/group-goal-run.ts:1), [server/room-handoffs.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/room-handoffs.ts:1), [src/components/GoalRunCard.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GoalRunCard.tsx:1), [src/components/Composer.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/Composer.tsx:1).

- [ ] **SOL-147** — Descobrir colegas e salas que o agente pode consultar.
- [ ] **SOL-148** — Pedir conselho a outro agente.
- [ ] **SOL-149** — Delegar uma tarefa concreta a outro agente.
- [ ] **SOL-150** — Coordenar vários agentes com briefs próprios.
- [ ] **SOL-151** — Consultar o estado e resultado de uma delegação quando o perfil o permite.
- [ ] **SOL-152** — Receber resultados dos colegas e retomar a coordenação.
- [ ] **SOL-153** — Publicar uma mensagem de agente num canal autorizado.
- [ ] **SOL-154** — Criar uma thread para trabalho separado.
- [ ] **SOL-155** — Criar um especialista por ferramenta quando o papel permite.
- [ ] **SOL-156** — Propor a configuração de uma equipa para revisão humana.
- [ ] **SOL-157** — Propor a remoção de um agente para revisão humana.
- [ ] **SOL-158** — Executar /goal ou Finish together até o objetivo assentar num resultado.
- [ ] **SOL-159** — Escolher grupo e líder de um objetivo.
- [ ] **SOL-160** — Ver progresso, participantes, resultados e bloqueios num cartão de objetivo.
- [ ] **SOL-161** — Cancelar um objetivo em execução.
- [ ] **SOL-162** — Aplicar limites/timeout aos turnos de grupo.

## 09. Motores e modelos de IA

**Implementação atual:** Drivers CLI, ACP e API + catálogos e snapshots.

**Condições:** 18 drivers registados no código; 14 motores visíveis nesta instalação, 1 pronto; não equivalem a 18 contas ligadas.

**Fontes:** [server/drivers/builtIn.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/builtIn.ts:1), [src/components/EnginesSettings.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EnginesSettings.tsx:1), [src/components/EngineLibrary.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineLibrary.tsx:1), [src/components/EngineSetup.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/EngineSetup.tsx:1), [src/components/ModelPicker.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ModelPicker.tsx:1), [src/orbit/detail/BotPanels.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/BotPanels.tsx:1).

- [ ] **SOL-163** — Detetar motores instalados e verificar novamente.
- [ ] **SOL-164** — Ver versão, estado, autenticação e capacidades do motor.
- [ ] **SOL-165** — Configurar Claude/Claude Code.
- [ ] **SOL-166** — Configurar Codex/OpenAI.
- [ ] **SOL-167** — Configurar Grok por API e Grok Agent.
- [ ] **SOL-168** — Configurar Gemini Agent.
- [ ] **SOL-169** — Configurar Kimi Agent.
- [ ] **SOL-170** — Configurar Droid/Factory Agent.
- [ ] **SOL-171** — Configurar Cursor Agent.
- [ ] **SOL-172** — Configurar OpenCode.
- [ ] **SOL-173** — Configurar Qwen Agent.
- [ ] **SOL-174** — Configurar Hermes Agent.
- [ ] **SOL-175** — Configurar um motor ACP personalizado.
- [ ] **SOL-176** — Configurar Pi.
- [ ] **SOL-177** — Configurar uma API compatível com OpenAI, incluindo gateway próprio/local.
- [ ] **SOL-178** — Configurar Antigravity.
- [ ] **SOL-179** — Configurar Boat-hosted agent.
- [ ] **SOL-180** — Configurar MiniMax.
- [ ] **SOL-181** — Configurar Mistral.
- [ ] **SOL-182** — Escolher o modelo de cada agente ou conversa.
- [ ] **SOL-183** — Definir o esforço/raciocínio quando o motor o suporta.
- [ ] **SOL-184** — Escolher um ícone de fornecedor para cada instância de motor.
- [ ] **SOL-185** — Carregar um ícone personalizado PNG/JPEG/WebP de até 128 KB para o motor.
- [ ] **SOL-186** — Definir o caminho de um executável CLI específico, versão ou wrapper quando o motor está parado.
- [ ] **SOL-187** — Atualizar o catálogo de modelos e consultar opções personalizadas.
- [ ] **SOL-188** — Mostrar a disponibilidade não verificada de modelos obtidos por fallback.
- [ ] **SOL-189** — Gerir várias contas Claude e as contas Codex disponibilizadas pelo painel.
- [ ] **SOL-190** — Iniciar os fluxos de login de conta ou código de dispositivo.
- [ ] **SOL-191** — Instalar/atualizar motores nos fluxos que o motor e sistema suportam.
- [ ] **SOL-192** — Escolher um modelo de recuperação automático para falha de arranque ACP.
- [ ] **SOL-193** — Repetir a tentativa no backup uma vez sem reproduzir trabalho que possa já ter acontecido.

## 10. Chaves e ligações de fornecedores

**Implementação atual:** Configuração de chaves + login externo + SSH config.

**Condições:** Credenciais necessárias consoante fornecedor; testes de chave/catálogo não provam conversa.

**Fontes:** [src/components/ApiKeys.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApiKeys.tsx:1), [src/components/ClaudeAccountSettings.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ClaudeAccountSettings.tsx:1), [src/components/CodexAccountSettings.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CodexAccountSettings.tsx:1).

- [ ] **SOL-194** — Guardar, substituir ou retirar uma chave Anthropic.
- [ ] **SOL-195** — Guardar, substituir ou retirar uma chave de API OpenAI-compatible.
- [ ] **SOL-196** — Definir o endereço base da API compatível com OpenAI.
- [ ] **SOL-197** — Guardar, substituir ou retirar uma chave xAI.
- [ ] **SOL-198** — Guardar, substituir ou retirar uma chave Mistral.
- [ ] **SOL-199** — Guardar a ligação/chave de Boat/Box para computador cloud.
- [ ] **SOL-200** — Guardar a chave OpenCode Go.
- [ ] **SOL-201** — Testar conectividade/autenticação/catálogo conforme o fornecedor.
- [ ] **SOL-202** — Mostrar configuração existente sem revelar valores secretos guardados.
- [ ] **SOL-203** — Definir ou remover o alias SSH de um VPS próprio.
- [ ] **SOL-204** — Gerir login, estado e desconexão das contas nos painéis suportados.

## 11. Aprovações, cartões e credenciais pedidas

**Implementação atual:** Política de ferramentas + aprovações por turno + propostas estruturadas.

**Condições:** As opções variam por motor, ação e papel; não foram alteradas nesta inspeção.

**Fontes:** [src/components/ApprovalModeSelector.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ApprovalModeSelector.tsx:1), [src/components/PendingApproval.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PendingApproval.tsx:1), [src/components/CommandAllowlistDialog.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CommandAllowlistDialog.tsx:1), [src/components/QuestionCard.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/QuestionCard.tsx:1), [src/components/SecretRequestCard.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SecretRequestCard.tsx:1), [src/components/VerifyCard.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VerifyCard.tsx:1).

- [ ] **SOL-205** — Escolher Ask, Auto ou Full access quando suportado.
- [ ] **SOL-206** — Escolher Edits/auto-accept edits quando esse nível é disponibilizado pelo motor.
- [ ] **SOL-207** — Configurar se o agente pede aprovação antes de contactar outros agentes.
- [ ] **SOL-208** — Rever avisos e confirmar mudanças para modos mais permissivos.
- [ ] **SOL-209** — Permitir uma ação uma vez.
- [ ] **SOL-210** — Negar uma ação.
- [ ] **SOL-211** — Cancelar o turno a partir da aprovação.
- [ ] **SOL-212** — Permitir uma ação durante a conversa ou sessão quando o motor permite.
- [ ] **SOL-213** — Guardar uma autorização para um comando exato no agente, fornecedor e pasta.
- [ ] **SOL-214** — Consultar, editar e retirar comandos da allowlist.
- [ ] **SOL-215** — Navegar entre várias aprovações pendentes.
- [ ] **SOL-216** — Ver argumentos e detalhes de uma ferramenta antes de decidir.
- [ ] **SOL-217** — Responder a cartões de perguntas e opções criados pelo agente.
- [ ] **SOL-218** — Rever uma skill antes de a ativar ou atualizar.
- [ ] **SOL-219** — Rever uma alteração de perfil antes de a confirmar.
- [ ] **SOL-220** — Rever uma rotina/alteração de agenda antes de a confirmar.
- [ ] **SOL-221** — Rever pedidos de uso de uma sessão de navegador autenticada.
- [ ] **SOL-222** — Responder a pedidos de credenciais num cartão próprio.
- [ ] **SOL-223** — Confirmar verificações de execução/identidade nos fluxos respetivos.
- [ ] **SOL-224** — Ver os registos de decisões e autoria das aprovações.

## 12. Computador, ecrã e controlo humano

**Implementação atual:** Driver @trycua + capabilities + previews e leases de controlo.

**Condições:** Destino e capacidade do motor; driver e permissões do SO; não testado com ações reais.

**Fontes:** [src/components/ComputerPanel.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerPanel.tsx:1), [src/components/LocalScreenPreview.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalScreenPreview.tsx:1), [src/components/remote-desktop-panel.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/remote-desktop-panel.tsx:1), [server/computer-control.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/computer-control.ts:1), [electron/cua.mjs](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/cua.mjs:1).

- [ ] **SOL-225** — Escolher Auto, cloud, VM local, este computador, navegador ou desligado.
- [ ] **SOL-226** — Ver o destino realmente usado por uma conversa.
- [ ] **SOL-227** — Ver capacidades e motivos de indisponibilidade de um destino.
- [ ] **SOL-228** — Ver a pré-visualização do ecrã do computador.
- [ ] **SOL-229** — Iniciar a captura de pré-visualização quando separada das ações do agente.
- [ ] **SOL-230** — Abrir o desktop ao vivo.
- [ ] **SOL-231** — Receber o convite do agente para mostrar o seu ecrã.
- [ ] **SOL-232** — Aceitar ou dispensar um pedido de intervenção humana.
- [ ] **SOL-233** — Assumir o controlo e bloquear os cliques/teclas do agente durante o lease.
- [ ] **SOL-234** — Devolver o controlo ao agente.
- [ ] **SOL-235** — Clicar, escrever e navegar no desktop interativo conforme o backend.
- [ ] **SOL-236** — Escolher outro destino a partir das definições/compositor.
- [ ] **SOL-237** — Definir e guardar a pasta de trabalho do agente no painel Computador.
- [ ] **SOL-238** — Consultar recuperação e diagnóstico de controlo local por plataforma.
- [ ] **SOL-239** — Colocar o computador cloud em repouso quando suportado.
- [ ] **SOL-240** — Redimensionar o painel de computador.

## 13. VM local, Boat cloud e VPS próprio

**Implementação atual:** Backend Boat; VPS por SSH/containers; VM local e inventário de seats.

**Condições:** Destinos condicionados pela plataforma, virtualização, chaves e recursos preparados.

**Fontes:** [src/components/LocalVmWorkspace.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalVmWorkspace.tsx:1), [src/components/LocalComputerSection.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/LocalComputerSection.tsx:1), [src/components/RemoteComputerSection.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RemoteComputerSection.tsx:1), [server/boat.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/boat.ts:1), [server/vps-computer.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/vps-computer.ts:1), [server/local-vm-inventory.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/local-vm-inventory.ts:1).

- [ ] **SOL-241** — Preparar e criar a VM privada de um agente.
- [ ] **SOL-242** — Abrir o espaço de trabalho da VM local.
- [ ] **SOL-243** — Ver dois desktops de VM em conjunto quando suportado.
- [ ] **SOL-244** — Substituir uma VM local preservando o workspace durável previsto.
- [ ] **SOL-245** — Apagar uma VM local com confirmação.
- [ ] **SOL-246** — Gerir disponibilidade, leases e capacidade das VMs locais.
- [ ] **SOL-247** — Usar um computador Boat existente da equipa.
- [ ] **SOL-248** — Criar/abrir um computador cloud Boat mediante configuração.
- [ ] **SOL-249** — Acordar um computador cloud em repouso.
- [ ] **SOL-250** — Ver estados de espera, arranque, falta de recursos e falha.
- [ ] **SOL-251** — Preparar o computador containerizado num VPS próprio.
- [ ] **SOL-252** — Iniciar um computador VPS parado.
- [ ] **SOL-253** — Substituir um container VPS de versão antiga com confirmação.
- [ ] **SOL-254** — Mostrar os avisos sobre dados que vivem apenas no container descartável.
- [ ] **SOL-255** — Reutilizar em Auto um destino existente sem criar recursos silenciosamente.

## 14. Navegador integrado e perfis autenticados

**Implementação atual:** agent-browser + Chromium headless + frames/input + perfis persistentes.

**Condições:** Experimental browser ligado, runtime disponível e motor compatível; gestão restrita.

**Fontes:** [src/components/BrowserPanel.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserPanel.tsx:1), [src/components/BrowserViewport.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserViewport.tsx:1), [src/components/BrowserProfilesManager.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/BrowserProfilesManager.tsx:1), [server/browser-runtime.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/browser-runtime.ts:1), [server/browser-bundle-release.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/browser-bundle-release.ts:1).

- [ ] **SOL-256** — Ativar/desativar o navegador integrado globalmente.
- [ ] **SOL-257** — Ativar/desativar o navegador para um agente.
- [ ] **SOL-258** — Abrir a vista do navegador do agente.
- [ ] **SOL-259** — Escrever um endereço e navegar.
- [ ] **SOL-260** — Voltar à página anterior.
- [ ] **SOL-261** — Avançar na navegação.
- [ ] **SOL-262** — Recarregar a página.
- [ ] **SOL-263** — Criar uma nova aba.
- [ ] **SOL-264** — Gerir/selecionar as abas expostas pelo painel.
- [ ] **SOL-265** — Fechar uma aba do navegador.
- [ ] **SOL-266** — Expandir o navegador para ecrã inteiro quando disponível.
- [ ] **SOL-267** — Clicar, fazer scroll e introduzir texto na página por input remoto.
- [ ] **SOL-268** — Abrir a caixa auxiliar de escrita/colagem para a página.
- [ ] **SOL-269** — Reconectar a vista de frames.
- [ ] **SOL-270** — Reiniciar o navegador mediante fluxo próprio.
- [ ] **SOL-271** — Escolher o perfil privado do agente.
- [ ] **SOL-272** — Escolher uma sessão temporária sem guardar logins em disco.
- [ ] **SOL-273** — Criar um perfil partilhado entre agentes.
- [ ] **SOL-274** — Renomear um perfil partilhado.
- [ ] **SOL-275** — Selecionar o perfil usado por um agente.
- [ ] **SOL-276** — Apagar um perfil e os seus dados/login mediante confirmação.
- [ ] **SOL-277** — Ver os agentes que usam cada perfil.
- [ ] **SOL-278** — Pedir consentimento para usar uma sessão autenticada.

## 15. Android por USB

**Implementação atual:** Android platform-tools/ADB + ligação USB + Phone Harness.

**Condições:** Android desbloqueado, depuração USB autorizada e motor compatível; diferente do companion remoto.

**Fontes:** [src/components/AndroidDevicePanel.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AndroidDevicePanel.tsx:1), [electron/android-device.mjs](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/android-device.mjs:1), [server/drivers/phone-proxy.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/phone-proxy.ts:1).

- [ ] **SOL-279** — Descobrir e apresentar o dispositivo Android ligado por USB.
- [ ] **SOL-280** — Mostrar instruções para ativar Developer options e USB debugging.
- [ ] **SOL-281** — Mostrar estado de autorização, offline ou desconexão.
- [ ] **SOL-282** — Ver o ecrã Android na aplicação.
- [ ] **SOL-283** — Clicar para tocar no ecrã do telefone.
- [ ] **SOL-284** — Arrastar/fazer scroll no telefone.
- [ ] **SOL-285** — Introduzir texto num campo selecionado.
- [ ] **SOL-286** — Usar o botão Android Back.
- [ ] **SOL-287** — Usar o botão Android Home.
- [ ] **SOL-288** — Usar o botão Android Recent apps.
- [ ] **SOL-289** — Permitir tarefas do agente no Android através do mesmo USB autorizado.
- [ ] **SOL-290** — Carregar o Phone Harness para pedidos relacionados com telefone.

## 16. Ditado, chamadas e reprodução de voz

**Implementação atual:** Solar Windows: Whisper.cpp v1.9.0 + modelo base multilingue + vozes do sistema; restantes adaptadores TTS.

**Condições:** Microfone/permissões, voz instalada e motor de IA; group call/island têm condições de plataforma.

**Fontes:** [src/orbit/useSolarDictation.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/useSolarDictation.ts:1), [src/components/CallView.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CallView.tsx:1), [src/components/GroupCallView.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/GroupCallView.tsx:1), [src/components/VoiceSettings.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/VoiceSettings.tsx:1), [server/solar-speech.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/solar-speech.ts:1), [server/tts/index.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/tts/index.ts:1).

- [ ] **SOL-291** — Ditar um rascunho sem o enviar automaticamente.
- [ ] **SOL-292** — Parar a captura e rever a transcrição.
- [ ] **SOL-293** — Apresentar erros de permissão, silêncio ou captura indisponível.
- [ ] **SOL-294** — Escolher o microfone.
- [ ] **SOL-295** — Iniciar uma chamada com um agente.
- [ ] **SOL-296** — Capturar a fala, enviar o turno ao motor e ler a resposta.
- [ ] **SOL-297** — Ver fases de escuta, transcrição, pensamento e fala.
- [ ] **SOL-298** — Interromper a fala/resposta.
- [ ] **SOL-299** — Desligar a chamada.
- [ ] **SOL-300** — Repetir o arranque do microfone depois de uma falha.
- [ ] **SOL-301** — Escolher uma voz instalada no sistema.
- [ ] **SOL-302** — Ouvir uma amostra da voz.
- [ ] **SOL-303** — Ativar/desativar a leitura automática de respostas do agente.
- [ ] **SOL-304** — Ativar/desativar alertas quando o agente termina ou precisa de uma resposta.
- [ ] **SOL-305** — Permitir ou impedir notas de voz enviadas pelo agente.
- [ ] **SOL-306** — Escolher voz neste dispositivo ou voz configurada no host quando disponível.
- [ ] **SOL-307** — Escolher/configurar Grok/xAI como motor de voz.
- [ ] **SOL-308** — Escolher/configurar um servidor Chatterbox e o respetivo modelo.
- [ ] **SOL-309** — Usar adaptadores de ElevenLabs e Fish presentes no backend, conforme configuração e UI disponível.
- [ ] **SOL-310** — Criar/enviar notas de voz pelo agente.
- [ ] **SOL-311** — Iniciar chamadas de grupo no fluxo/plataforma suportados.
- [ ] **SOL-312** — Direcionar uma chamada de grupo a um nome ou a todos.
- [ ] **SOL-313** — Ouvir os participantes em sequência e interromper a chamada de grupo.
- [ ] **SOL-314** — Agendar chamadas individuais ou de grupo no calendário.
- [ ] **SOL-315** — Processar confirmações faladas com regras de consentimento explícito.

## 17. Ficheiros, editor e Desenvolvimento Solar

**Implementação atual:** Editor textarea React + API de ficheiros com revisão + sessionStorage + iframe.

**Condições:** Projeto local do agente/thread; preview estático; não é um IDE completo.

**Fontes:** [src/orbit/SolarDevelopmentWorkspace.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarDevelopmentWorkspace.tsx:1), [server/solar-workspace.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/solar-workspace.ts:1).

- [ ] **SOL-316** — Abrir o espaço Desenvolvimento junto da conversa.
- [ ] **SOL-317** — Alternar entre Ficheiros e Computador.
- [ ] **SOL-318** — Listar ficheiros e pastas do projeto permitido.
- [ ] **SOL-319** — Entrar numa pasta e voltar à pasta superior.
- [ ] **SOL-320** — Atualizar a listagem.
- [ ] **SOL-321** — Abrir um ficheiro de texto.
- [ ] **SOL-322** — Ter vários documentos abertos em abas.
- [ ] **SOL-323** — Criar um novo ficheiro indicando o nome.
- [ ] **SOL-324** — Editar o código/conteúdo UTF-8.
- [ ] **SOL-325** — Guardar pelo botão Save ou Ctrl+S.
- [ ] **SOL-326** — Mostrar se um documento tem alterações por guardar.
- [ ] **SOL-327** — Manter rascunhos durante a sessão.
- [ ] **SOL-328** — Recarregar o ficheiro de disco.
- [ ] **SOL-329** — Usar revisão de conteúdo para detetar conflito de escrita.
- [ ] **SOL-330** — Ver o preview Markdown do rascunho.
- [ ] **SOL-331** — Ver o preview HTML estático isolado do rascunho.
- [ ] **SOL-332** — Mostrar caminho, número de linhas e estado de gravação.
- [ ] **SOL-333** — Fechar o espaço Desenvolvimento e continuar a conversa.

## 18. Memória e contexto pessoal

**Implementação atual:** Ficheiros Markdown MEMORY.md + tópicos + journal + upkeep por modelo.

**Condições:** Parte da manutenção semântica requer chamadas background de motores compatíveis.

**Fontes:** [src/orbit/detail/MemoryPanel.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/MemoryPanel.tsx:1), [src/components/AboutMeSettings.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/AboutMeSettings.tsx:1), [server/memory-upkeep.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/memory-upkeep.ts:1), [server/memory-tidy.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/memory-tidy.ts:1), [server/routes/bot-memory.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/routes/bot-memory.ts:1).

- [ ] **SOL-334** — Consultar e editar a memória permanente MEMORY.md do agente.
- [ ] **SOL-335** — Criar tópicos de memória.
- [ ] **SOL-336** — Abrir e editar ficheiros de tópicos.
- [ ] **SOL-337** — Apagar um tópico com possibilidade de recuperação pelo histórico.
- [ ] **SOL-338** — Ver o diário diário do agente em modo de leitura.
- [ ] **SOL-339** — Ver o histórico de alterações da memória.
- [ ] **SOL-340** — Desfazer uma alteração de memória.
- [ ] **SOL-341** — Resolver conflitos: recarregar ou sobrescrever com o rascunho próprio.
- [ ] **SOL-342** — Ativar/desativar a manutenção automática da memória.
- [ ] **SOL-343** — Executar a organização/limpeza da memória imediatamente.
- [ ] **SOL-344** — Arquivar notas expiradas e fundir duplicados.
- [ ] **SOL-345** — Organizar factos e tratar contradições quando o motor o permite.
- [ ] **SOL-346** — Consultar o estado/resumo da última limpeza.
- [ ] **SOL-347** — Editar About me, contexto pessoal partilhado entre agentes.
- [ ] **SOL-348** — Remover factos pessoais no respetivo painel.
- [ ] **SOL-349** — Abrir os ficheiros de memória no Obsidian se estiver instalado.
- [ ] **SOL-350** — Mostrar a pasta de memória no gestor de ficheiros do sistema quando a integração está disponível.
- [ ] **SOL-351** — Pesquisar/ler sessões anteriores autorizadas por ferramenta do agente.

## 19. Skills e playbooks

**Implementação atual:** SKILL.md + imports GitHub + propostas de authoring + playbooks de equipa.

**Condições:** Skills importadas chegam desligadas; authoring é opção experimental.

**Fontes:** [src/orbit/detail/SkillsPanel.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/detail/SkillsPanel.tsx:1), [src/components/SkillRequestPreview.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SkillRequestPreview.tsx:1), [server/skill-learn.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/skill-learn.ts:1), [server/installed-playbooks.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/installed-playbooks.ts:1), [server/drivers/agents-catalog.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-catalog.ts:1).

- [ ] **SOL-352** — Listar skills e contar as ativas.
- [ ] **SOL-353** — Ler os conteúdos e ficheiros de uma skill.
- [ ] **SOL-354** — Importar uma skill por URL GitHub ou owner/repo.
- [ ] **SOL-355** — Ativar/desativar uma skill para um agente.
- [ ] **SOL-356** — Remover uma skill com confirmação.
- [ ] **SOL-357** — Explorar playbooks da equipa.
- [ ] **SOL-358** — Pedir /learn para criar uma skill a partir da conversa.
- [ ] **SOL-359** — Rever o rascunho da skill num cartão.
- [ ] **SOL-360** — Guardar uma execução de verificação como skill a partir do cartão Verify.
- [ ] **SOL-361** — Pedir /create-verification-skill nos motores/fluxos suportados.
- [ ] **SOL-362** — Confirmar a ativação ou atualização de uma skill proposta.
- [ ] **SOL-363** — Gerir skills por ferramenta autorizada do agente.
- [ ] **SOL-364** — Ativar/desativar a funcionalidade experimental de autoria de skills.

## 20. Plugins, Apps e servidores MCP

**Implementação atual:** MCP stdio, Streamable HTTP/SSE + OAuth + registries GitHub/oficial.

**Condições:** Cada servidor é software/serviço externo; conta, credenciais e ferramentas próprias.

**Fontes:** [src/components/PluginsPanel.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PluginsPanel.tsx:1), [src/components/McpExplore.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpExplore.tsx:1), [src/components/McpServersPanel.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/McpServersPanel.tsx:1), [server/mcp-registry.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/mcp-registry.ts:1), [server/mcp-oauth.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/mcp-oauth.ts:1).

- [ ] **SOL-365** — Abrir Plugins e alternar Explore/Installed.
- [ ] **SOL-366** — Pesquisar servidores no catálogo MCP.
- [ ] **SOL-367** — Consultar a seleção popular do registry GitHub.
- [ ] **SOL-368** — Explorar categorias e carregar mais resultados do registry oficial.
- [ ] **SOL-369** — Abrir página, código-fonte e instruções de um servidor.
- [ ] **SOL-370** — Usar a última lista em cache se o registry estiver indisponível.
- [ ] **SOL-371** — Adicionar um servidor a partir do catálogo.
- [ ] **SOL-372** — Adicionar um servidor local por comando, argumentos e variáveis de ambiente.
- [ ] **SOL-373** — Adicionar um servidor por URL Streamable HTTP.
- [ ] **SOL-374** — Adicionar um servidor SSE legado.
- [ ] **SOL-375** — Configurar headers/autenticação de um servidor HTTP.
- [ ] **SOL-376** — Colar blocos mcpServers de Claude Code, Cursor ou Claude Desktop.
- [ ] **SOL-377** — Configurar OAuth, client ID e secret quando exigidos.
- [ ] **SOL-378** — Iniciar e terminar a ligação OAuth do servidor.
- [ ] **SOL-379** — Testar a ligação e consultar as ferramentas anunciadas.
- [ ] **SOL-380** — Ativar/desativar um servidor.
- [ ] **SOL-381** — Editar e remover um servidor MCP.
- [ ] **SOL-382** — Escolher os servidores acessíveis a cada agente: todos, seleção ou nenhum.
- [ ] **SOL-383** — Optar por usar também os servidores pessoais Claude Code no motor Claude.
- [ ] **SOL-384** — Aplicar allowlists de servidores da organização quando há gestão empresarial.
- [ ] **SOL-385** — Manter os servidores pessoais Codex separados da superfície de ferramentas Solar.
- [ ] **SOL-386** — Consumir ferramentas, imagens e resultados de MCP dentro do turno do agente.

## 21. Rotinas agendadas e calendário

**Implementação atual:** Scheduler + regras de agenda/cron + runs persistentes.

**Condições:** Aplicação/backend tem de estar disponível; destinos cloud e voz exigem configuração.

**Fontes:** [src/components/RoutineCalendarPage.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/RoutineCalendarPage.tsx:1), [src/components/routines/CronScheduleFields.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/CronScheduleFields.tsx:1), [src/components/routines/ResultsDestination.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/routines/ResultsDestination.tsx:1), [server/routines.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/routines.ts:1).

- [ ] **SOL-387** — Criar uma tarefa agendada para um agente.
- [ ] **SOL-388** — Criar um objetivo agendado para uma equipa com líder.
- [ ] **SOL-389** — Criar uma chamada agendada.
- [ ] **SOL-390** — Definir título, instruções, agente/grupo e início.
- [ ] **SOL-391** — Agendar uma execução única.
- [ ] **SOL-392** — Agendar repetição diária.
- [ ] **SOL-393** — Agendar dias específicos da semana.
- [ ] **SOL-394** — Agendar repetição por intervalo de 5 a 1440 minutos.
- [ ] **SOL-395** — Limitar o intervalo a dias da semana e a uma janela horária.
- [ ] **SOL-396** — Definir data de fim de um intervalo.
- [ ] **SOL-397** — Configurar repetição mensal e anual através dos campos de calendário/cron.
- [ ] **SOL-398** — Definir expressão cron e timezone IANA.
- [ ] **SOL-399** — Escolher dia do mês ou último dia e tratar meses sem a data.
- [ ] **SOL-400** — Escolher duração de chamada.
- [ ] **SOL-401** — Escolher o nível de aprovação da execução da rotina.
- [ ] **SOL-402** — Definir um limite opcional de duração da execução.
- [ ] **SOL-403** — Escolher saltar uma ocorrência ocupada ou enfileirar no máximo uma.
- [ ] **SOL-404** — Escolher o setup atual do agente ou o runner Boat-hosted.
- [ ] **SOL-405** — Adicionar anexos à rotina individual quando permitido.
- [ ] **SOL-406** — Escolher thread/pasta onde ficam os resultados.
- [ ] **SOL-407** — Criar uma thread dedicada de resultados reutilizada pelas execuções.
- [ ] **SOL-408** — Editar, pausar, retomar ou apagar uma rotina.
- [ ] **SOL-409** — Executar manualmente uma rotina quando disponível no respetivo fluxo.
- [ ] **SOL-410** — Ver calendário em dia, três dias ou semana.
- [ ] **SOL-411** — Alternar calendário e lista.
- [ ] **SOL-412** — Navegar para datas anteriores, seguintes e hoje.
- [ ] **SOL-413** — Filtrar por agente e consultar rotinas pausadas.
- [ ] **SOL-414** — Redimensionar/mudar eventos pelos controlos do calendário.
- [ ] **SOL-415** — Consultar execuções em curso e cancelar uma execução.
- [ ] **SOL-416** — Abrir resultado, thread de execução e logs.
- [ ] **SOL-417** — Pesquisar logs e filtrar problemas/estados.
- [ ] **SOL-418** — Ver falhas consecutivas e ocorrências saltadas.
- [ ] **SOL-419** — Marcar problemas/resultados como lidos.
- [ ] **SOL-420** — Manter o computador acordado para trabalho agendado quando ativado.
- [ ] **SOL-421** — Reutilizar opcionalmente um relatório limitado da execução anterior no contexto.

## 22. Webhooks e eventos externos

**Implementação atual:** Endpoint privado de ingress + fila de tarefas + registo de entregas.

**Condições:** URL acessível ao emissor e backend em execução; criar não liga serviços externos sozinho.

**Fontes:** [src/components/WebhooksPanel.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WebhooksPanel.tsx:1), [server/webhooks.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/webhooks.ts:1), [server/webhook-ingress.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/webhook-ingress.ts:1).

- [ ] **SOL-422** — Criar um webhook para um agente.
- [ ] **SOL-423** — Escolher instruções predefinidas ou usar a tarefa enviada no pedido.
- [ ] **SOL-424** — Escolher computador local ou cloud.
- [ ] **SOL-425** — Restringir os tipos de evento aceites.
- [ ] **SOL-426** — Definir o máximo de tarefas pendentes/em curso.
- [ ] **SOL-427** — Ver e copiar instruções/comando de envio do webhook.
- [ ] **SOL-428** — Ativar/desativar um webhook.
- [ ] **SOL-429** — Editar a configuração do webhook.
- [ ] **SOL-430** — Rodar a URL privada e invalidar a anterior.
- [ ] **SOL-431** — Consultar entregas aceites e recusadas.
- [ ] **SOL-432** — Abrir a thread criada por uma entrega.
- [ ] **SOL-433** — Apagar o webhook.

## 23. Integração Slack

**Implementação atual:** Integração hosted Slack + link para gestão no Admin externo.

**Condições:** A secção Solar é um deep link; criação/configuração da app Slack é feita no Admin da organização.

**Fontes:** [src/components/bot-settings/SlackSection.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/SlackSection.tsx:1), [src/components/bot-settings/useSlackManagement.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/bot-settings/useSlackManagement.ts:1), [server/hosted-slack.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/hosted-slack.ts:1), [server/routes/hosted-slack.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/routes/hosted-slack.ts:1).

- [ ] **SOL-434** — Mostrar a secção Slack apenas quando o servidor oferece um URL de gestão.
- [ ] **SOL-435** — Abrir a gestão Slack desse agente no Admin externo da organização.
- [ ] **SOL-436** — Consultar e sincronizar a associação Slack através das rotas hosted previstas.
- [ ] **SOL-437** — Receber mensagens/eventos Slack e encaminhá-los ao agente autorizado.
- [ ] **SOL-438** — Enviar as respostas através da integração configurada.
- [ ] **SOL-439** — Gerir criação/remoção da ligação no serviço externo; não há formulário local de tokens nesta secção.

## 24. Telefone companion e acesso remoto

**Implementação atual:** Companion autenticado + pairing/QR + rede Wi-Fi/Tailscale/HTTPS + túnel.

**Condições:** Rotas seguras dependem de serviços/conta; QR Solar abre /solar no browser; não é Android USB.

**Fontes:** [src/components/CompanionSection.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanionSection.tsx:1), [src/components/PhoneSetupFlow.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PhoneSetupFlow.tsx:1), [companion/src/solar-browser.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/solar-browser.ts:1), [companion/src/routes.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/companion/src/routes.ts:1), [electron/managed-companion-tunnel.mjs](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/managed-companion-tunnel.mjs:1).

- [ ] **SOL-440** — Ativar/desativar o acesso de dispositivos remotos.
- [ ] **SOL-441** — Gerar um código/QR temporário de emparelhamento.
- [ ] **SOL-442** — Escolher o escopo da sessão de pairing: Full access ou Chat and approvals only no formulário que o expõe.
- [ ] **SOL-443** — Gerar um novo código quando o anterior expira.
- [ ] **SOL-444** — Ver detalhes de emparelhamento manual/endereço.
- [ ] **SOL-445** — Emparelhar diretamente no mesmo Wi-Fi acessível.
- [ ] **SOL-446** — Emparelhar através de Tailscale com MagicDNS.
- [ ] **SOL-447** — Configurar a rota HTTPS/túnel seguro nos fluxos suportados.
- [ ] **SOL-448** — Iniciar/verificar login por código de email para o serviço de acesso seguro.
- [ ] **SOL-449** — Consultar estado da rota e repetir a preparação em falha.
- [ ] **SOL-450** — Abrir o cliente Solar /solar no browser do telefone.
- [ ] **SOL-451** — Confirmar explicitamente a ligação do browser pelo código.
- [ ] **SOL-452** — Ver os agentes e ler conversas no cliente browser Solar.
- [ ] **SOL-453** — Enviar mensagens e receber respostas no cliente browser Solar.
- [ ] **SOL-454** — Usar o cliente companion nativo para chat, aprovações e chamadas que a plataforma suporta.
- [ ] **SOL-455** — Consultar dispositivos emparelhados e última atividade.
- [ ] **SOL-456** — Revogar/remover um dispositivo emparelhado.
- [ ] **SOL-457** — Permitir ou retirar a vista/controlo de computador por dispositivo.
- [ ] **SOL-458** — Manter o host acordado enquanto o acesso remoto está ativo.
- [ ] **SOL-459** — Consultar descoberta próxima, rotas locais e diagnóstico avançado.
- [ ] **SOL-460** — Configurar domínio próprio/HTTPS num servidor preparado.

## 25. Workspaces ligados e computadores partilhados

**Implementação atual:** Cliente desktop remoto + sessão persistente + grants de desktop.

**Condições:** Só pastas e capacidades explicitamente partilhadas são expostas; não mudadas nesta inspeção.

**Fontes:** [src/components/ConnectedWorkspacesSettings.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ConnectedWorkspacesSettings.tsx:1), [src/components/ComputerSharingSettings.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ComputerSharingSettings.tsx:1), [electron/menu.mjs](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/menu.mjs:1), [electron/computer-sharing.mjs](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/computer-sharing.mjs:1), [server/shared-computers.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/shared-computers.ts:1).

- [ ] **SOL-461** — Ligar a um workspace hosted por endereço ou link de pairing.
- [ ] **SOL-462** — Guardar a ligação ao workspace neste computador.
- [ ] **SOL-463** — Alternar entre workspace local e remotos.
- [ ] **SOL-464** — Consultar o workspace atual.
- [ ] **SOL-465** — Retirar/Forget uma ligação guardada.
- [ ] **SOL-466** — Adicionar um servidor através de um link de pairing copiado.
- [ ] **SOL-467** — Entrar numa organização pelo menu de servidor.
- [ ] **SOL-468** — Abrir a gestão de acesso deste computador para um workspace remoto.
- [ ] **SOL-469** — Escolher pastas locais para partilhar, inicialmente só leitura.
- [ ] **SOL-470** — Permitir edição nas pastas escolhidas.
- [ ] **SOL-471** — Dar separadamente acesso a terminal sem restrição.
- [ ] **SOL-472** — Dar separadamente acesso ao ecrã/controlo de computador.
- [ ] **SOL-473** — Parar a partilha e bloquear novos pedidos.
- [ ] **SOL-474** — Listar computadores partilhados online por ferramenta de agente.
- [ ] **SOL-475** — Listar, ler e escrever ficheiros partilhados por folder IDs e revisão/hash.
- [ ] **SOL-476** — Executar comandos ou ferramentas de controlo apenas com o grant separado.
- [ ] **SOL-477** — Consultar atividade de uso/emprestimo do computador.

## 26. Backups e reposição de workspace

**Implementação atual:** Arquivo .orbitbackup cifrado + validação + substituição com cópia de segurança.

**Condições:** Não inclui credenciais guardadas, logins CLI externos ou discos VM remotos.

**Fontes:** [src/components/WorkspaceBackupSettings.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspaceBackupSettings.tsx:1), [server/workspace-backup.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/workspace-backup.ts:1), [server/workspace-backup-http.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/workspace-backup-http.ts:1).

- [ ] **SOL-478** — Exportar um backup completo do workspace com password.
- [ ] **SOL-479** — Incluir agentes, threads, mensagens, ficheiros, instruções e definições não secretas.
- [ ] **SOL-480** — Incluir rascunhos e preferências deste browser no backup.
- [ ] **SOL-481** — Descarregar o arquivo cifrado.
- [ ] **SOL-482** — Escolher um arquivo para importar.
- [ ] **SOL-483** — Introduzir a password e validar antes de alterar o workspace.
- [ ] **SOL-484** — Ver resumo, versão, quantidades, tamanho e exclusões do backup.
- [ ] **SOL-485** — Confirmar a substituição escrevendo REPLACE.
- [ ] **SOL-486** — Guardar uma cópia de segurança recuperável antes da substituição.
- [ ] **SOL-487** — Restaurar agentes, permissões, instruções e skills do arquivo.
- [ ] **SOL-488** — Restaurar rotinas, webhooks e chamadas em estado pausado.
- [ ] **SOL-489** — Restaurar rascunhos/preferências do browser ou manter os atuais.
- [ ] **SOL-490** — Mostrar que é necessário sair completamente/reiniciar após reposição.

## 27. Templates, biblioteca e partilha de equipas

**Implementação atual:** Templates Markdown/JSON + pacotes/backup de equipa + repositório comunitário.

**Condições:** Importa cópias; não transfere contas nem ligações autenticadas.

**Fontes:** [src/components/TeamLibraryPanel.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/TeamLibraryPanel.tsx:1), [src/components/ShareTeamDialog.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ShareTeamDialog.tsx:1), [server/package-import.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/package-import.ts:1), [server/bot-package.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/bot-package.ts:1).

- [ ] **SOL-491** — Explorar modelos de equipas incluídos.
- [ ] **SOL-492** — Pesquisar e carregar modelos da comunidade.
- [ ] **SOL-493** — Abrir o repositório público de templates.
- [ ] **SOL-494** — Pré-visualizar membros, instruções, playbooks, skills e dependências de um template.
- [ ] **SOL-495** — Criar uma equipa a partir de um template.
- [ ] **SOL-496** — Importar .mausbackup.json, BotMRR .md ou .mausteam.json legado.
- [ ] **SOL-497** — Importar um template/equipa por link GitHub ou JSON direto.
- [ ] **SOL-498** — Arrastar um ficheiro de equipa para importar.
- [ ] **SOL-499** — Importar a equipa como nova cópia e numerar nomes duplicados.
- [ ] **SOL-500** — Adicionar skills desligadas e rotinas pausadas.
- [ ] **SOL-501** — Mostrar as ligações que ainda precisam de configuração.
- [ ] **SOL-502** — Exportar/partilhar uma equipa inteira como ficheiro sem conversas nem segredos.
- [ ] **SOL-503** — Escolher a equipa a partilhar.
- [ ] **SOL-504** — Começar a partir de uma pasta de projeto e obter sugestão de equipa.
- [ ] **SOL-505** — Selecionar agentes da sugestão e criar uma conversa de grupo no projeto.
- [ ] **SOL-506** — Abrir deep links de instalação de pacotes quando suportados pelo desktop.

## 28. Consumo, custos e faturação

**Implementação atual:** Ledger por turno + tokens/preços reportados ou estimados.

**Condições:** Custos de subscrição podem ser equivalentes, não cobranças; budgets/billing são enterprise.

**Fontes:** [src/components/UsageSection.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageSection.tsx:1), [src/components/UsageHistory.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageHistory.tsx:1), [src/components/UsageBudget.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/UsageBudget.tsx:1), [server/usage-ledger.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/usage-ledger.ts:1), [server/model-prices.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/model-prices.ts:1).

- [ ] **SOL-507** — Ver tokens, turnos e custo por agente.
- [ ] **SOL-508** — Ver consumo da thread e do grupo.
- [ ] **SOL-509** — Ver totais de todos os agentes.
- [ ] **SOL-510** — Consultar histórico por período: mês atual, anterior ou últimos 30 dias.
- [ ] **SOL-511** — Agrupar o histórico pelas opções disponibilizadas.
- [ ] **SOL-512** — Distinguir origem direta, agente-a-agente e rotina.
- [ ] **SOL-513** — Ver tokens de entrada, saída e cache.
- [ ] **SOL-514** — Assinalar estimativas e modelos sem preço conhecido.
- [ ] **SOL-515** — Exportar o histórico de consumo em CSV.
- [ ] **SOL-516** — Definir um teto mensal do workspace quando a licença permite.
- [ ] **SOL-517** — Definir percentagem de aviso e bloquear novos turnos ao atingir o teto.
- [ ] **SOL-518** — Configurar preços de venda por modelo e preço default quando a licença permite.
- [ ] **SOL-519** — Definir moeda e preços de input/output/cache por milhão de tokens.
- [ ] **SOL-520** — Consultar a coluna faturável e exportá-la em CSV.

## 29. Pessoas, audiência e auditoria

**Implementação atual:** Contas/sessões + owner/admin/member + filtros de audiência + audit log.

**Condições:** Painéis condicionados pelo modo hosted e papel; listas locais não concedem acesso hosted.

**Fontes:** [src/components/PeopleSection.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/PeopleSection.tsx:1), [src/components/ActivitySection.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ActivitySection.tsx:1), [server/bot-visibility.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/bot-visibility.ts:1), [server/admin-activity.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/admin-activity.ts:1), [server/request-auth.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/request-auth.ts:1).

- [ ] **SOL-521** — Consultar pessoas com acesso/atividade neste workspace.
- [ ] **SOL-522** — Ver papel, última atividade, dispositivos e consumo por pessoa.
- [ ] **SOL-523** — Convidar um email ou domínio quando o modo de servidor o permite.
- [ ] **SOL-524** — Copiar o link de convite de login por código email.
- [ ] **SOL-525** — Mudar o papel de membro/admin quando permitido.
- [ ] **SOL-526** — Remover acesso e sessões de uma pessoa quando permitido.
- [ ] **SOL-527** — Gerir pessoas no Admin externo em deployments de organização.
- [ ] **SOL-528** — Definir audiência por agente e respeitar a visibilidade na interface/API.
- [ ] **SOL-529** — Consultar o registo de alterações de pessoas, definições, acessos e agentes.
- [ ] **SOL-530** — Consultar quem respondeu a aprovações.
- [ ] **SOL-531** — Filtrar auditoria por pessoa, ação e intervalo de datas.
- [ ] **SOL-532** — Ver dados antes/depois nos eventos suportados.
- [ ] **SOL-533** — Exportar o registo de auditoria em CSV.

## 30. Organização, modelos e backups cloud empresariais

**Implementação atual:** Admin/gateway externo + licença + sessão desktop + backups service-managed.

**Condições:** Requer uma organização/serviço configurado; nada foi ligado nesta inspeção.

**Fontes:** [src/components/OrganizationSettings.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/OrganizationSettings.tsx:1), [src/components/CompanyModels.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyModels.tsx:1), [src/components/CompanyBackupSettings.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/CompanyBackupSettings.tsx:1), [electron/company-backups.mjs](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/company-backups.mjs:1), [server/managed-policy.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/managed-policy.ts:1).

- [ ] **SOL-534** — Entrar com email de trabalho através do browser.
- [ ] **SOL-535** — Escolher URL de portal Admin personalizada.
- [ ] **SOL-536** — Comparar código de verificação do desktop e browser.
- [ ] **SOL-537** — Cancelar, repetir ou reabrir o fluxo de login.
- [ ] **SOL-538** — Ver organização ligada e validade/estado da licença.
- [ ] **SOL-539** — Usar modelos Company no seletor, além dos modelos pessoais.
- [ ] **SOL-540** — Aplicar políticas de motores, modelos, MCP e acessos geridos.
- [ ] **SOL-541** — Atualizar o estado da organização.
- [ ] **SOL-542** — Desligar a organização e parar os turnos Company em curso.
- [ ] **SOL-543** — Criar um backup cloud manual para a conta da organização.
- [ ] **SOL-544** — Consultar snapshots, espaço, progresso e uploads/limpezas pendentes.
- [ ] **SOL-545** — Cancelar uma transferência de backup.
- [ ] **SOL-546** — Ativar/desativar backups diários com consentimento específico.
- [ ] **SOL-547** — Ver próxima tentativa e último backup agendado.
- [ ] **SOL-548** — Descarregar e validar um snapshot antes de restaurar.
- [ ] **SOL-549** — Repor um snapshot com preview e REPLACE.
- [ ] **SOL-550** — Apagar um snapshot cloud com DELETE.
- [ ] **SOL-551** — Pausar backups diários quando a conta/organização deixam de corresponder.

## 31. Servidor multi-workspace e camada enterprise

**Implementação atual:** Fleet/instâncias isoladas + licenças Ed25519 + branding.

**Condições:** Só deployments preparados com direitos adequados; SSO/OIDC genérico está planeado, não implementado como entitlement.

**Fontes:** [src/components/WorkspacesSection.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/WorkspacesSection.tsx:1), [server/fleet.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/fleet.ts:1), [server/fleet-cli.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/fleet-cli.ts:1), [enterprise/server/index.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/enterprise/server/index.ts:1), [enterprise/FEATURES](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/enterprise/FEATURES:1).

- [ ] **SOL-552** — Listar workspaces de clientes/tenants de um servidor.
- [ ] **SOL-553** — Criar um workspace com nome, admin, membros e opções de chave/limite.
- [ ] **SOL-554** — Consultar estado, consumo e problemas de recuperação de um workspace.
- [ ] **SOL-555** — Adicionar/remover pessoas na lista de acesso de um tenant.
- [ ] **SOL-556** — Suspender e retomar um workspace.
- [ ] **SOL-557** — Apagar um workspace escolhendo manter a pasta de dados quando disponível.
- [ ] **SOL-558** — Atualizar todos os workspaces do servidor pela ação Upgrade all.
- [ ] **SOL-559** — Aplicar nome, tagline, accent, logo e link de suporte white-label por brand.json.
- [ ] **SOL-560** — Ver edição, direitos e expiração da licença.
- [ ] **SOL-561** — Mostrar avisos de expiração e período de tolerância da licença.
- [ ] **SOL-562** — Aplicar direitos admin, budgets e billing quando concedidos pela licença.
- [ ] **SOL-563** — Administrar o fleet pela CLI nos fluxos de operador.

## 32. Definições gerais, aparência e onboarding

**Implementação atual:** Preferências/config do workspace + locale + fluxos de boas-vindas.

**Condições:** Algumas preferências ficam no browser e outras no host; Solar substitui skins da base.

**Fontes:** [src/components/SettingsModal.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/SettingsModal.tsx:1), [src/orbit/SolarAppearance.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/orbit/SolarAppearance.tsx:1), [src/components/onboarding/WelcomeFlow.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/onboarding/WelcomeFlow.tsx:1), [src/components/ThreadCleanupSettings.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/ThreadCleanupSettings.tsx:1).

- [ ] **SOL-564** — Editar o nome e email do utilizador.
- [ ] **SOL-565** — Escolher língua da interface ou usar a do sistema.
- [ ] **SOL-566** — Escolher esforço predefinido para novos agentes.
- [ ] **SOL-567** — Escolher fundo Solar preto, azul profundo ou grafite.
- [ ] **SOL-568** — Ativar/desativar movimento.
- [ ] **SOL-569** — Ativar/desativar reação/interação visual.
- [ ] **SOL-570** — Ativar/desativar partículas/debris envolventes.
- [ ] **SOL-571** — Ativar/desativar ligações visuais.
- [ ] **SOL-572** — Ajustar a intensidade de glow.
- [ ] **SOL-573** — Escolher a fonte nas opções disponíveis.
- [ ] **SOL-574** — Mostrar/ocultar chips/listas de threads conforme a preferência.
- [ ] **SOL-575** — Configurar sons/notificações de atividade/conclusão quando expostos.
- [ ] **SOL-576** — Configurar a apresentação de chamadas de ferramentas.
- [ ] **SOL-577** — Ativar/desativar rotinas na conversa conforme a definição.
- [ ] **SOL-578** — Configurar timeout de turnos de grupo.
- [ ] **SOL-579** — Configurar o limite de threads paralelas por agente.
- [ ] **SOL-580** — Ativar e escolher motor/modelo de recuperação automático.
- [ ] **SOL-581** — Eliminar event logs antigos de threads terminadas/arquivadas após um prazo.
- [ ] **SOL-582** — Limitar o tamanho dos event logs sem apagar transcrições.
- [ ] **SOL-583** — Percorrer ou saltar a introdução Solar.
- [ ] **SOL-584** — Criar/configurar o primeiro agente e motor pelos passos de onboarding.
- [ ] **SOL-585** — Reabrir a introdução/tour a partir de Sistema.
- [ ] **SOL-586** — Abrir a ajuda de atalhos e pesquisar atalhos.
- [ ] **SOL-587** — Abrir Sobre com versão, créditos, licenças e atribuições.

## 33. Desktop, diagnóstico, atualizações e APIs

**Implementação atual:** Electron + Node 24 + SQLite/FTS5 + HTTP/eventos + updater adaptado.

**Condições:** Solar não recebe updates Orbit; existência de botão não prova canal Solar publicado.

**Fontes:** [electron/main.mjs](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/main.mjs:1), [electron/menu.mjs](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/menu.mjs:1), [electron/diagnostics.mjs](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/diagnostics.mjs:1), [electron/updater.mjs](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/electron/updater.mjs:1), [src/components/InspectorPanel.tsx](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/src/components/InspectorPanel.tsx:1), [server/harness/http.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/harness/http.ts:1), [server/message-db.ts](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/message-db.ts:1).

- [ ] **SOL-588** — Arrancar com ecrã de carregamento Solar.
- [ ] **SOL-589** — Impedir múltiplas instâncias e trazer a janela existente à frente.
- [ ] **SOL-590** — Ocultar/restaurar a janela pela bandeja e sair completamente.
- [ ] **SOL-591** — Conservar/restaurar geometria da janela.
- [ ] **SOL-592** — Usar menus nativos de ficheiro, edição, visualização e janela.
- [ ] **SOL-593** — Usar menu contextual nativo para copiar, colar e selecionar texto.
- [ ] **SOL-594** — Escolher caminhos de gravação/download sem substituir inadvertidamente nomes.
- [ ] **SOL-595** — Ver banners de atualização e consultar o estado do updater.
- [ ] **SOL-596** — Pedir verificação de atualizações nos clientes em que o bridge existe.
- [ ] **SOL-597** — Exportar um ficheiro de diagnóstico com versão, estados e log redigido.
- [ ] **SOL-598** — Ver o Inspector de uma conversa.
- [ ] **SOL-599** — Ver o run log e recarregá-lo do disco.
- [ ] **SOL-600** — Ver eventos de ferramentas e narração de trabalho no chat.
- [ ] **SOL-601** — Persistir mensagens e pesquisar por SQLite FTS5.
- [ ] **SOL-602** — Reconstruir contexto/compactar histórico conforme o motor e orçamento de contexto.
- [ ] **SOL-603** — Reconectar eventos do servidor e recuperar escritas/filas após falhas conforme a implementação.
- [ ] **SOL-604** — Expor APIs HTTP autenticadas para clientes e ferramentas.
- [ ] **SOL-605** — Expor a superfície MCP/control CLI para integração e verificação.
- [ ] **SOL-606** — Receber deep links de pairing, organização, pacotes e threads nos fluxos suportados.
- [ ] **SOL-607** — Executar fixtures isoladas para testes, separadas dos dados reais.

## Tecnologias de outras origens que o Solar usa

| Área | Implementação encontrada | O que avaliar depois |
| --- | --- | --- |
| Aplicação desktop | Electron e Node.js; UI React/Vite/Tailwind | Peso, arranque, memória, integração nativa, segurança e manutenção |
| Base funcional | Fork de Orbit/OpenMausBot; core Apache-2.0, camada enterprise com licença própria | Dependência do upstream, compatibilidade de updates, código morto e divergências Solar |
| Mapa e retratos | Three.js e renderizadores Solar de partículas | GPU, acessibilidade, bateria, fidelidade e desempenho |
| Ícones | Lucide; ícones de fornecedores e recursos third_party | Licenças, consistência e legibilidade |
| Ditado Windows | Whisper.cpp v1.9.0, modelo base multilingue, execução local | Precisão PT-PT, latência, tamanho do modelo e consumo CPU |
| Voz | Vozes Windows/macOS; adaptadores Grok/xAI, Chatterbox, ElevenLabs, Fish | Qualidade PT-PT, naturalidade, preço, privacidade e streaming |
| Agentes IA | CLI/ACP e APIs por 18 drivers registados | Capacidade real por motor, contexto, ferramentas, retries e custo |
| Controlo de computador | @trycua/cua-driver e runtime específico por plataforma | Observação, precisão, isolamento, permissões e recuperação |
| Navegador do agente | agent-browser e Chromium headless | Compatibilidade, login, perfis, frames, input e isolamento |
| Android | Android platform-tools/ADB e Phone Harness | Latência, fiabilidade, autorização e capacidades por aplicação |
| Acesso remoto | Companion, cloudflared, Tailscale opcional, Caddy/domínio em self-hosting | Dependências externas, rota efetiva, revogação, reconexão e transporte |
| Computador cloud | Boat/Box, VPS SSH/containers e VM local | Isolamento, custo, durabilidade, arranque e compatibilidade Windows |
| Apps/plugins | Registries GitHub/oficial e MCP stdio/HTTP/SSE/OAuth | Confiabilidade de cada servidor, manutenção, excesso de ferramentas e tokens |
| Persistência e pesquisa | SQLite/FTS5; Markdown/JSON conforme subsistema | Concorrência, migrações, integridade, performance e recuperação |
| Backups | Arquivos cifrados locais; cloud empresarial com cifragem gerida pelo serviço | Cobertura, recuperação, compatibilidade e desenho da cifragem |
| Organização | Gateway/Admin externo, licenças e políticas | Dependência do serviço, isolamento de tenants, autenticação e direitos |

## Pontos que precisam de validação para não confundir promessa com capacidade

1. **Windows Solar versus base macOS:** existem textos e fluxos da base sobre voz ainda indisponível no Windows, apesar do adaptador Solar Windows. Rever guards e rótulos por superfície, especialmente compositor, shell e chamadas de grupo.
2. **Atualizações:** o Solar não deve receber updates Orbit. Rever a ação Check updates e o canal Solar; o repositório não tinha release/instalador publicado no histórico consultado, e esta instalação foi compilada localmente.
3. **SSO genérico/OIDC:** o entitlement sso está documentado como planeado; login da organização/gateway existente não significa que esse entitlement já esteja implementado.
4. **Android tem dois caminhos:** controlo USB por ADB e acesso Solar no browser/companion. Têm dependências e funções diferentes.
5. **Voz tem vários caminhos:** ditado Solar, chamada Solar, TTS, shell/island e group call. Não assumir que escolher uma voz habilita todos.
6. **Papéis/templates não ligam serviços:** criar um especialista não autentica a conta, não instala as ferramentas e não agenda trabalho automaticamente.
7. **Cloud/VM:** presença de código e botão não prova VM pronta no Windows, SSH configurado ou conta Boat existente.
8. **Enterprise:** painéis e código não significam licença ativa nem serviço organizacional conectado.
9. **Preview do editor:** HTML/Markdown estático, não build/execução de um projeto nem IDE completo.
10. **MCP:** cada instalação acrescenta a sua própria lista de ferramentas e capacidades. Este inventário cobre a gestão e os proxies Solar, não uma lista infinita de serviços ainda não instalados.

## Índices técnicos para chegar ao botão e ao código

- [Índice de interface e textos](INDICE-INTERFACE.md): por componente, com texto e fonte/linha.
- [Índice de referências API e módulos](INDICE-API.md): endpoints referenciados, guards e módulos. Não é uma especificação OpenAPI.
- [Ferramentas dos agentes](FERRAMENTAS-AGENTES.md): snapshots dos perfis e nomes adicionais no catálogo.
- [Evidências estruturadas](evidencias.json): controlos, labels, referências de API e schemas dos snapshots.
- [Script de extração](../solar-inventory-scan.mjs): permite voltar a gerar os índices depois de mudanças.

## Conferência visual no browser do Codex

A interface foi também aberta no browser integrado em http://127.0.0.1:8799/. Ver [as observações por ecrã e diferenças desktop/browser](OBSERVACOES-BROWSER.md). A inspeção acrescentou ações à checklist e não executou envios de mensagens, chamadas, backups, criação de agentes nem alterações de permissões.

**Total da checklist: 607 capacidades/ações agrupadas em 33 áreas.** Ações técnicas da mesma funcionalidade podem ter entradas próprias; este total não é uma métrica comercial nem uma garantia de funcionamento.

## Ficha de revisão para cada item

Copiar esta ficha quando escolhermos o que melhorar:

```text
ID SOL-___:
O que quero que aconteça:
Implementação atual e fonte:
Teste real e resultado:
Problema observado:
Alternativas concretas:
Qualidade / velocidade / custo / privacidade / manutenção:
Decisão: manter / melhorar / substituir / retirar
Prioridade:
Critério para considerar concluído:
```
