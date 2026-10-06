import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'../..');
const groups=[];
function group(title, sources, tech, condition, items) { groups.push({title,sources:sources.split(';'),tech,condition,items:items.trim().split('\n').map(s=>s.trim()).filter(Boolean)}); }
group('Mapa solar e navegação','src/orbit/SolarMap.tsx;src/orbit/SolarChrome.tsx;src/orbit/solar-interaction.js;src/orbit/solar-renderer.js','React + renderização Three.js/WebGL + preferências locais','Solar desktop/browser; mapa depende dos agentes existentes',`
Ver Jarvis como Sol, responsáveis como planetas e agentes como luas.
Abrir o foco e a conversa de um agente ao clicar no seu corpo ou rótulo.
Arrastar um agente para reorganizar o mapa.
Mover planetas com as suas luas associadas.
Mover agentes com teclas de seta e acelerar com Shift.
Aumentar o zoom.
Diminuir o zoom.
Enquadrar todo o sistema.
Mostrar ou ocultar linhas de hierarquia.
Restaurar a disposição inicial do mapa.
Conservar a disposição local do mapa.
Adaptar o mapa ao tamanho e orientação do ecrã.
Mostrar os estados de repouso, pensamento, trabalho, espera, falha e desligado.
Animar olhar, piscar, boca e sono dos retratos de acordo com o estado.
Pesquisar agentes e tarefas a partir do cabeçalho.
Escolher destinatário, pesquisar e enviar uma mensagem diretamente no mapa.
Iniciar e parar o ditado no compositor do mapa.
Voltar ao mapa pelo botão Team map, fundo ou Escape.
Redimensionar a área de chat e repor a largura com duplo clique.
Abrir o menu Criar: agente, equipa ou canal.
`);
group('Criação e identidade dos agentes','src/orbit/detail/NewBotPanel.tsx;src/orbit/detail/ProfilePanels.tsx;src/components/ChatHeader.tsx;src/lib/bot-roles.ts','Formulários React + registos persistentes de bots + SOUL.md','Algumas ações são reservadas ao proprietário/admin; Jarvis integrado tem regras próprias',`
Criar um agente em branco.
Criar um agente a partir de um papel predefinido.
Pesquisar papéis e modelos de equipas.
Criar uma equipa vazia ou a partir de um modelo.
Definir o nome do agente.
Definir a função/papel do agente.
Definir a descrição curta do agente.
Editar as instruções permanentes em SOUL.md.
Escolher a cor/identidade visual do agente.
Definir quem vê o agente: todos, administradores ou emails/domínios específicos.
Abrir o perfil pelo retrato/cabeçalho.
Ver a visão geral: o que faz, alcança e não faz.
Pré-visualizar o prompt/instruções que o modelo recebe e a estimativa de tokens.
Executar /setup para o agente entrevistar o utilizador e preparar o seu papel.
Fixar ou desafixar um agente.
Marcar um agente como não lido.
Mover um agente para outra equipa.
Promover um agente a responsável de equipa ou retirar essa função.
Duplicar um agente.
Ocultar um agente do mapa.
Arquivar um agente, respeitando as restrições do responsável e do último agente.
Consultar e recuperar agentes arquivados.
Apagar um agente mediante confirmação.
Consultar o histórico de alterações do perfil e definições.
`);
group('Jarvis integrado e assistência da aplicação','src/orbit/OrbitShell.tsx;server/orbit-agent.ts;electron/orbit-summon.mjs;src/shell/QuickBar.tsx;src/components/OrbitAssistantSettings.tsx','Agente integrado + ferramentas de propostas + shell Electron','Jarvis preserva identidade interna; shell e voz variam com plataforma',`
Conversar com o assistente integrado que trabalha entre equipas.
Abrir os seis sistemas do Jarvis: motor, aprovações, skills, memória, voz e Sistema.
Pedir diagnóstico do estado de agentes, motores e rotinas.
Pedir leitura de logs e contexto autorizado de threads.
Receber propostas de alterações de definições, em cartões de confirmação.
Receber propostas para adicionar um servidor MCP.
Receber propostas de alteração de perfil e modelo.
Receber propostas para criar ou alterar rotinas.
Abrir a barra rápida por atalho global, incluindo Alt+O no Windows.
Alterar ou desligar os atalhos globais.
Usar o guia/pointer no ecrã quando o shell e permissões o permitem.
Consultar permissões e pausar o acesso do assistente ao ecrã.
Usar o modo de voz flutuante/island no macOS quando suportado.
Abrir, ocultar, restaurar e sair da aplicação pelo ícone de bandeja.
`);
group('Conversa, mensagens e compositor','src/components/ChatView.tsx;src/components/Composer.tsx;src/components/ChatMarkdown.tsx;src/components/MessageActions.tsx;src/components/ComposerQueuedMessages.tsx','Chat React + eventos do servidor + adaptador do motor','Respostas reais requerem motor autenticado/configurado; capacidades diferem por motor',`
Enviar mensagens ao agente selecionado.
Receber texto e atividade de ferramentas durante a execução.
Inserir uma nova linha sem enviar com Shift+Enter.
Editar uma mensagem enviada e reenviar a alteração.
Editar a última mensagem pelo atalho de seta para cima com o compositor vazio.
Copiar o conteúdo de uma mensagem.
Responder com uma citação de mensagem.
Guardar uma mensagem na memória com Remember this.
Ler uma resposta em voz alta quando há voz disponível.
Ver Markdown, tabelas, links e blocos de código.
Alternar entre Markdown apresentado e texto original.
Interromper o turno em curso com Stop.
Enviar mensagens para a fila enquanto o agente está ocupado.
Introduzir uma mensagem no turno em curso quando o motor permite steering.
Consultar e gerir mensagens na fila.
Recuperar o rascunho após falha de envio, repetir ou dispensar a falha.
Conservar rascunhos por conversa no browser.
Ver indicadores de atividade, espera, erro e trabalho de outros agentes.
Carregar mensagens anteriores e posteriores em históricos paginados.
Voltar à mensagem mais recente.
Pesquisar dentro da conversa e navegar entre resultados.
Pesquisar mensagens de várias conversas na paleta global.
Mencionar agentes com @ e escolher os destinatários.
Inserir referências a outras threads e abrir os respetivos links.
Abrir comandos /setup, /learn e /goal quando aplicáveis.
Descarregar a conversa em Markdown.
Copiar a transcrição completa.
Copiar o link da thread.
Copiar o identificador da conversa.
`);
group('Anexos e resultados apresentados','src/components/ComposerAttachments.tsx;src/components/AttachmentGallery.tsx;src/components/AttachmentPreview.tsx;src/orbit/ArtifactCard.tsx;src/orbit/artifacts.ts;server/message-file.ts','Anexos de conversa + rotas limitadas à mensagem + viewers + iframe sandbox','Imagens aceites dependem do motor; os resultados têm de existir e ser partilhados',`
Anexar um ficheiro pelo seletor.
Arrastar ficheiros para o compositor.
Colar imagens da área de transferência.
Transformar colagens longas em anexos quando aplicável.
Ver e remover anexos antes do envio.
Apresentar imagens anexadas e abrir a galeria.
Navegar entre imagens na galeria.
Abrir e descarregar ficheiros partilhados.
Mostrar HTML como resultado numa área ao lado do chat.
Mostrar um PDF partilhado ao lado do chat.
Mostrar uma imagem partilhada ao lado do chat.
Ver o convite/oferta de resultado do agente no mapa e no foco.
Aceitar ou fechar a apresentação do resultado.
Usar uma apresentação isolada para HTML e restringir o acesso ao ficheiro da mensagem.
`);
group('Threads, pastas e gestão de trabalho','src/components/TaskPicker.tsx;src/components/SidebarThreadRow.tsx;src/components/BotProjects.tsx;src/components/ThreadControls.tsx','Estado por thread + agrupamento por pastas + filas e limites','Modelos, acessos e pasta de trabalho podem estar fixados por thread',`
Criar uma nova thread/conversa.
Mudar entre threads do mesmo agente.
Ver threads ativas e arquivadas.
Pesquisar threads pelo título.
Renomear uma thread.
Fixar/desafixar uma thread.
Arquivar e desarquivar uma thread.
Apagar uma thread e a sua conversa.
Adiar uma thread até nova atividade, até às 18h ou até às 9h do dia seguinte.
Retirar o adiamento de uma thread.
Copiar o link de uma thread.
Criar uma pasta para organizar threads.
Mudar o nome e ícone/emoji de uma pasta.
Mover uma thread para uma pasta ou para fora dela.
Alterar a ordem das pastas.
Marcar uma pasta como lida.
Criar uma nova thread diretamente numa pasta.
Apagar uma pasta mantendo as conversas.
Escolher motor/modelo para a thread.
Escolher nível de aprovação para a thread.
Escolher o destino de computador da thread.
Ver threads com trabalho, mensagens na fila e aprovações pendentes.
Definir o número máximo de threads paralelas por agente.
`);
group('Equipas, responsáveis e canais','src/orbit/detail/HubPanels.tsx;src/components/TeamDialog.tsx;src/components/NewChannelDialog.tsx;src/components/ManageMembersPanel.tsx;src/components/GroupView.tsx','Registos de equipas/canais + coordenação de agentes','Membros, audiência e papel de responsável condicionam o acesso',`
Criar e renomear uma equipa.
Editar as instruções partilhadas da equipa.
Escolher e mudar o responsável da equipa.
Definir as equipas geridas pelo responsável.
Adicionar e retirar agentes da equipa.
Escolher os computadores da equipa e os destinos predefinidos.
Consultar as rotinas da equipa.
Apagar uma equipa com confirmação.
Criar um canal/conversa de grupo.
Adicionar e remover membros do canal.
Criar canais com agentes de várias equipas.
Definir um responsável de resposta do canal.
Escolher respostas de todos, apenas @menções ou um agente específico.
Editar instruções partilhadas do canal.
Definir a pasta de trabalho de um canal antes de a thread a fixar.
Renomear o canal ou a sua thread.
Mover um canal para outra equipa.
Fixar e desafixar mensagens do canal.
Responder a mensagens do canal com citação.
Pesquisar, copiar ou exportar a conversa de grupo.
Apagar uma conversa de grupo, sem apagar os agentes.
Ver custos/tokens do trabalho do grupo.
`);
group('Delegação e objetivos de equipa','server/drivers/agents-catalog.ts;server/group-goal-run.ts;server/room-handoffs.ts;src/components/GoalRunCard.tsx;src/components/Composer.tsx','Ferramentas agents/MCP + orquestração de turnos, handoffs e retornos','Disponibilidade do motor, permissões, membros e slots de trabalho',`
Descobrir colegas e salas que o agente pode consultar.
Pedir conselho a outro agente.
Delegar uma tarefa concreta a outro agente.
Coordenar vários agentes com briefs próprios.
Consultar o estado e resultado de uma delegação quando o perfil o permite.
Receber resultados dos colegas e retomar a coordenação.
Publicar uma mensagem de agente num canal autorizado.
Criar uma thread para trabalho separado.
Criar um especialista por ferramenta quando o papel permite.
Propor a configuração de uma equipa para revisão humana.
Propor a remoção de um agente para revisão humana.
Executar /goal ou Finish together até o objetivo assentar num resultado.
Escolher grupo e líder de um objetivo.
Ver progresso, participantes, resultados e bloqueios num cartão de objetivo.
Cancelar um objetivo em execução.
Aplicar limites/timeout aos turnos de grupo.
`);
group('Motores e modelos de IA','server/drivers/builtIn.ts;src/components/EnginesSettings.tsx;src/components/EngineLibrary.tsx;src/components/EngineSetup.tsx;src/components/ModelPicker.tsx;src/orbit/detail/BotPanels.tsx','Drivers CLI, ACP e API + catálogos e snapshots','18 drivers registados no código; 14 motores visíveis nesta instalação, 1 pronto; não equivalem a 18 contas ligadas',`
Detetar motores instalados e verificar novamente.
Ver versão, estado, autenticação e capacidades do motor.
Configurar Claude/Claude Code.
Configurar Codex/OpenAI.
Configurar Grok por API e Grok Agent.
Configurar Gemini Agent.
Configurar Kimi Agent.
Configurar Droid/Factory Agent.
Configurar Cursor Agent.
Configurar OpenCode.
Configurar Qwen Agent.
Configurar Hermes Agent.
Configurar um motor ACP personalizado.
Configurar Pi.
Configurar uma API compatível com OpenAI, incluindo gateway próprio/local.
Configurar Antigravity.
Configurar Boat-hosted agent.
Configurar MiniMax.
Configurar Mistral.
Escolher o modelo de cada agente ou conversa.
Definir o esforço/raciocínio quando o motor o suporta.
Escolher um ícone de fornecedor para cada instância de motor.
Carregar um ícone personalizado PNG/JPEG/WebP de até 128 KB para o motor.
Definir o caminho de um executável CLI específico, versão ou wrapper quando o motor está parado.
Atualizar o catálogo de modelos e consultar opções personalizadas.
Mostrar a disponibilidade não verificada de modelos obtidos por fallback.
Gerir várias contas Claude e as contas Codex disponibilizadas pelo painel.
Iniciar os fluxos de login de conta ou código de dispositivo.
Instalar/atualizar motores nos fluxos que o motor e sistema suportam.
Escolher um modelo de recuperação automático para falha de arranque ACP.
Repetir a tentativa no backup uma vez sem reproduzir trabalho que possa já ter acontecido.
`);
group('Chaves e ligações de fornecedores','src/components/ApiKeys.tsx;src/components/ClaudeAccountSettings.tsx;src/components/CodexAccountSettings.tsx','Configuração de chaves + login externo + SSH config','Credenciais necessárias consoante fornecedor; testes de chave/catálogo não provam conversa',`
Guardar, substituir ou retirar uma chave Anthropic.
Guardar, substituir ou retirar uma chave de API OpenAI-compatible.
Definir o endereço base da API compatível com OpenAI.
Guardar, substituir ou retirar uma chave xAI.
Guardar, substituir ou retirar uma chave Mistral.
Guardar a ligação/chave de Boat/Box para computador cloud.
Guardar a chave OpenCode Go.
Testar conectividade/autenticação/catálogo conforme o fornecedor.
Mostrar configuração existente sem revelar valores secretos guardados.
Definir ou remover o alias SSH de um VPS próprio.
Gerir login, estado e desconexão das contas nos painéis suportados.
`);
group('Aprovações, cartões e credenciais pedidas','src/components/ApprovalModeSelector.tsx;src/components/PendingApproval.tsx;src/components/CommandAllowlistDialog.tsx;src/components/QuestionCard.tsx;src/components/SecretRequestCard.tsx;src/components/VerifyCard.tsx','Política de ferramentas + aprovações por turno + propostas estruturadas','As opções variam por motor, ação e papel; não foram alteradas nesta inspeção',`
Escolher Ask, Auto ou Full access quando suportado.
Escolher Edits/auto-accept edits quando esse nível é disponibilizado pelo motor.
Configurar se o agente pede aprovação antes de contactar outros agentes.
Rever avisos e confirmar mudanças para modos mais permissivos.
Permitir uma ação uma vez.
Negar uma ação.
Cancelar o turno a partir da aprovação.
Permitir uma ação durante a conversa ou sessão quando o motor permite.
Guardar uma autorização para um comando exato no agente, fornecedor e pasta.
Consultar, editar e retirar comandos da allowlist.
Navegar entre várias aprovações pendentes.
Ver argumentos e detalhes de uma ferramenta antes de decidir.
Responder a cartões de perguntas e opções criados pelo agente.
Rever uma skill antes de a ativar ou atualizar.
Rever uma alteração de perfil antes de a confirmar.
Rever uma rotina/alteração de agenda antes de a confirmar.
Rever pedidos de uso de uma sessão de navegador autenticada.
Responder a pedidos de credenciais num cartão próprio.
Confirmar verificações de execução/identidade nos fluxos respetivos.
Ver os registos de decisões e autoria das aprovações.
`);
group('Computador, ecrã e controlo humano','src/components/ComputerPanel.tsx;src/components/LocalScreenPreview.tsx;src/components/remote-desktop-panel.tsx;server/computer-control.ts;electron/cua.mjs','Driver @trycua + capabilities + previews e leases de controlo','Destino e capacidade do motor; driver e permissões do SO; não testado com ações reais',`
Escolher Auto, cloud, VM local, este computador, navegador ou desligado.
Ver o destino realmente usado por uma conversa.
Ver capacidades e motivos de indisponibilidade de um destino.
Ver a pré-visualização do ecrã do computador.
Iniciar a captura de pré-visualização quando separada das ações do agente.
Abrir o desktop ao vivo.
Receber o convite do agente para mostrar o seu ecrã.
Aceitar ou dispensar um pedido de intervenção humana.
Assumir o controlo e bloquear os cliques/teclas do agente durante o lease.
Devolver o controlo ao agente.
Clicar, escrever e navegar no desktop interativo conforme o backend.
Escolher outro destino a partir das definições/compositor.
Definir e guardar a pasta de trabalho do agente no painel Computador.
Consultar recuperação e diagnóstico de controlo local por plataforma.
Colocar o computador cloud em repouso quando suportado.
Redimensionar o painel de computador.
`);
group('VM local, Boat cloud e VPS próprio','src/components/LocalVmWorkspace.tsx;src/components/LocalComputerSection.tsx;src/components/RemoteComputerSection.tsx;server/boat.ts;server/vps-computer.ts;server/local-vm-inventory.ts','Backend Boat; VPS por SSH/containers; VM local e inventário de seats','Destinos condicionados pela plataforma, virtualização, chaves e recursos preparados',`
Preparar e criar a VM privada de um agente.
Abrir o espaço de trabalho da VM local.
Ver dois desktops de VM em conjunto quando suportado.
Substituir uma VM local preservando o workspace durável previsto.
Apagar uma VM local com confirmação.
Gerir disponibilidade, leases e capacidade das VMs locais.
Usar um computador Boat existente da equipa.
Criar/abrir um computador cloud Boat mediante configuração.
Acordar um computador cloud em repouso.
Ver estados de espera, arranque, falta de recursos e falha.
Preparar o computador containerizado num VPS próprio.
Iniciar um computador VPS parado.
Substituir um container VPS de versão antiga com confirmação.
Mostrar os avisos sobre dados que vivem apenas no container descartável.
Reutilizar em Auto um destino existente sem criar recursos silenciosamente.
`);
group('Navegador integrado e perfis autenticados','src/components/BrowserPanel.tsx;src/components/BrowserViewport.tsx;src/components/BrowserProfilesManager.tsx;server/browser-runtime.ts;server/browser-bundle-release.ts','agent-browser + Chromium headless + frames/input + perfis persistentes','Experimental browser ligado, runtime disponível e motor compatível; gestão restrita',`
Ativar/desativar o navegador integrado globalmente.
Ativar/desativar o navegador para um agente.
Abrir a vista do navegador do agente.
Escrever um endereço e navegar.
Voltar à página anterior.
Avançar na navegação.
Recarregar a página.
Criar uma nova aba.
Gerir/selecionar as abas expostas pelo painel.
Fechar uma aba do navegador.
Expandir o navegador para ecrã inteiro quando disponível.
Clicar, fazer scroll e introduzir texto na página por input remoto.
Abrir a caixa auxiliar de escrita/colagem para a página.
Reconectar a vista de frames.
Reiniciar o navegador mediante fluxo próprio.
Escolher o perfil privado do agente.
Escolher uma sessão temporária sem guardar logins em disco.
Criar um perfil partilhado entre agentes.
Renomear um perfil partilhado.
Selecionar o perfil usado por um agente.
Apagar um perfil e os seus dados/login mediante confirmação.
Ver os agentes que usam cada perfil.
Pedir consentimento para usar uma sessão autenticada.
`);
group('Android por USB','src/components/AndroidDevicePanel.tsx;electron/android-device.mjs;server/drivers/phone-proxy.ts','Android platform-tools/ADB + ligação USB + Phone Harness','Android desbloqueado, depuração USB autorizada e motor compatível; diferente do companion remoto',`
Descobrir e apresentar o dispositivo Android ligado por USB.
Mostrar instruções para ativar Developer options e USB debugging.
Mostrar estado de autorização, offline ou desconexão.
Ver o ecrã Android na aplicação.
Clicar para tocar no ecrã do telefone.
Arrastar/fazer scroll no telefone.
Introduzir texto num campo selecionado.
Usar o botão Android Back.
Usar o botão Android Home.
Usar o botão Android Recent apps.
Permitir tarefas do agente no Android através do mesmo USB autorizado.
Carregar o Phone Harness para pedidos relacionados com telefone.
`);
group('Ditado, chamadas e reprodução de voz','src/orbit/useSolarDictation.ts;src/components/CallView.tsx;src/components/GroupCallView.tsx;src/components/VoiceSettings.tsx;server/solar-speech.ts;server/tts/index.ts','Solar Windows: Whisper.cpp v1.9.0 + modelo base multilingue + vozes do sistema; restantes adaptadores TTS','Microfone/permissões, voz instalada e motor de IA; group call/island têm condições de plataforma',`
Ditar um rascunho sem o enviar automaticamente.
Parar a captura e rever a transcrição.
Apresentar erros de permissão, silêncio ou captura indisponível.
Escolher o microfone.
Iniciar uma chamada com um agente.
Capturar a fala, enviar o turno ao motor e ler a resposta.
Ver fases de escuta, transcrição, pensamento e fala.
Interromper a fala/resposta.
Desligar a chamada.
Repetir o arranque do microfone depois de uma falha.
Escolher uma voz instalada no sistema.
Ouvir uma amostra da voz.
Ativar/desativar a leitura automática de respostas do agente.
Ativar/desativar alertas quando o agente termina ou precisa de uma resposta.
Permitir ou impedir notas de voz enviadas pelo agente.
Escolher voz neste dispositivo ou voz configurada no host quando disponível.
Escolher/configurar Grok/xAI como motor de voz.
Escolher/configurar um servidor Chatterbox e o respetivo modelo.
Usar adaptadores de ElevenLabs e Fish presentes no backend, conforme configuração e UI disponível.
Criar/enviar notas de voz pelo agente.
Iniciar chamadas de grupo no fluxo/plataforma suportados.
Direcionar uma chamada de grupo a um nome ou a todos.
Ouvir os participantes em sequência e interromper a chamada de grupo.
Agendar chamadas individuais ou de grupo no calendário.
Processar confirmações faladas com regras de consentimento explícito.
`);
group('Ficheiros, editor e Desenvolvimento Solar','src/orbit/SolarDevelopmentWorkspace.tsx;server/solar-workspace.ts','Editor textarea React + API de ficheiros com revisão + sessionStorage + iframe','Projeto local do agente/thread; preview estático; não é um IDE completo',`
Abrir o espaço Desenvolvimento junto da conversa.
Alternar entre Ficheiros e Computador.
Listar ficheiros e pastas do projeto permitido.
Entrar numa pasta e voltar à pasta superior.
Atualizar a listagem.
Abrir um ficheiro de texto.
Ter vários documentos abertos em abas.
Criar um novo ficheiro indicando o nome.
Editar o código/conteúdo UTF-8.
Guardar pelo botão Save ou Ctrl+S.
Mostrar se um documento tem alterações por guardar.
Manter rascunhos durante a sessão.
Recarregar o ficheiro de disco.
Usar revisão de conteúdo para detetar conflito de escrita.
Ver o preview Markdown do rascunho.
Ver o preview HTML estático isolado do rascunho.
Mostrar caminho, número de linhas e estado de gravação.
Fechar o espaço Desenvolvimento e continuar a conversa.
`);
group('Memória e contexto pessoal','src/orbit/detail/MemoryPanel.tsx;src/components/AboutMeSettings.tsx;server/memory-upkeep.ts;server/memory-tidy.ts;server/routes/bot-memory.ts','Ficheiros Markdown MEMORY.md + tópicos + journal + upkeep por modelo','Parte da manutenção semântica requer chamadas background de motores compatíveis',`
Consultar e editar a memória permanente MEMORY.md do agente.
Criar tópicos de memória.
Abrir e editar ficheiros de tópicos.
Apagar um tópico com possibilidade de recuperação pelo histórico.
Ver o diário diário do agente em modo de leitura.
Ver o histórico de alterações da memória.
Desfazer uma alteração de memória.
Resolver conflitos: recarregar ou sobrescrever com o rascunho próprio.
Ativar/desativar a manutenção automática da memória.
Executar a organização/limpeza da memória imediatamente.
Arquivar notas expiradas e fundir duplicados.
Organizar factos e tratar contradições quando o motor o permite.
Consultar o estado/resumo da última limpeza.
Editar About me, contexto pessoal partilhado entre agentes.
Remover factos pessoais no respetivo painel.
Abrir os ficheiros de memória no Obsidian se estiver instalado.
Mostrar a pasta de memória no gestor de ficheiros do sistema quando a integração está disponível.
Pesquisar/ler sessões anteriores autorizadas por ferramenta do agente.
`);
group('Skills e playbooks','src/orbit/detail/SkillsPanel.tsx;src/components/SkillRequestPreview.tsx;server/skill-learn.ts;server/installed-playbooks.ts;server/drivers/agents-catalog.ts','SKILL.md + imports GitHub + propostas de authoring + playbooks de equipa','Skills importadas chegam desligadas; authoring é opção experimental',`
Listar skills e contar as ativas.
Ler os conteúdos e ficheiros de uma skill.
Importar uma skill por URL GitHub ou owner/repo.
Ativar/desativar uma skill para um agente.
Remover uma skill com confirmação.
Explorar playbooks da equipa.
Pedir /learn para criar uma skill a partir da conversa.
Rever o rascunho da skill num cartão.
Guardar uma execução de verificação como skill a partir do cartão Verify.
Pedir /create-verification-skill nos motores/fluxos suportados.
Confirmar a ativação ou atualização de uma skill proposta.
Gerir skills por ferramenta autorizada do agente.
Ativar/desativar a funcionalidade experimental de autoria de skills.
`);
group('Plugins, Apps e servidores MCP','src/components/PluginsPanel.tsx;src/components/McpExplore.tsx;src/components/McpServersPanel.tsx;server/mcp-registry.ts;server/mcp-oauth.ts','MCP stdio, Streamable HTTP/SSE + OAuth + registries GitHub/oficial','Cada servidor é software/serviço externo; conta, credenciais e ferramentas próprias',`
Abrir Plugins e alternar Explore/Installed.
Pesquisar servidores no catálogo MCP.
Consultar a seleção popular do registry GitHub.
Explorar categorias e carregar mais resultados do registry oficial.
Abrir página, código-fonte e instruções de um servidor.
Usar a última lista em cache se o registry estiver indisponível.
Adicionar um servidor a partir do catálogo.
Adicionar um servidor local por comando, argumentos e variáveis de ambiente.
Adicionar um servidor por URL Streamable HTTP.
Adicionar um servidor SSE legado.
Configurar headers/autenticação de um servidor HTTP.
Colar blocos mcpServers de Claude Code, Cursor ou Claude Desktop.
Configurar OAuth, client ID e secret quando exigidos.
Iniciar e terminar a ligação OAuth do servidor.
Testar a ligação e consultar as ferramentas anunciadas.
Ativar/desativar um servidor.
Editar e remover um servidor MCP.
Escolher os servidores acessíveis a cada agente: todos, seleção ou nenhum.
Optar por usar também os servidores pessoais Claude Code no motor Claude.
Aplicar allowlists de servidores da organização quando há gestão empresarial.
Manter os servidores pessoais Codex separados da superfície de ferramentas Solar.
Consumir ferramentas, imagens e resultados de MCP dentro do turno do agente.
`);
group('Rotinas agendadas e calendário','src/components/RoutineCalendarPage.tsx;src/components/routines/CronScheduleFields.tsx;src/components/routines/ResultsDestination.tsx;server/routines.ts','Scheduler + regras de agenda/cron + runs persistentes','Aplicação/backend tem de estar disponível; destinos cloud e voz exigem configuração',`
Criar uma tarefa agendada para um agente.
Criar um objetivo agendado para uma equipa com líder.
Criar uma chamada agendada.
Definir título, instruções, agente/grupo e início.
Agendar uma execução única.
Agendar repetição diária.
Agendar dias específicos da semana.
Agendar repetição por intervalo de 5 a 1440 minutos.
Limitar o intervalo a dias da semana e a uma janela horária.
Definir data de fim de um intervalo.
Configurar repetição mensal e anual através dos campos de calendário/cron.
Definir expressão cron e timezone IANA.
Escolher dia do mês ou último dia e tratar meses sem a data.
Escolher duração de chamada.
Escolher o nível de aprovação da execução da rotina.
Definir um limite opcional de duração da execução.
Escolher saltar uma ocorrência ocupada ou enfileirar no máximo uma.
Escolher o setup atual do agente ou o runner Boat-hosted.
Adicionar anexos à rotina individual quando permitido.
Escolher thread/pasta onde ficam os resultados.
Criar uma thread dedicada de resultados reutilizada pelas execuções.
Editar, pausar, retomar ou apagar uma rotina.
Executar manualmente uma rotina quando disponível no respetivo fluxo.
Ver calendário em dia, três dias ou semana.
Alternar calendário e lista.
Navegar para datas anteriores, seguintes e hoje.
Filtrar por agente e consultar rotinas pausadas.
Redimensionar/mudar eventos pelos controlos do calendário.
Consultar execuções em curso e cancelar uma execução.
Abrir resultado, thread de execução e logs.
Pesquisar logs e filtrar problemas/estados.
Ver falhas consecutivas e ocorrências saltadas.
Marcar problemas/resultados como lidos.
Manter o computador acordado para trabalho agendado quando ativado.
Reutilizar opcionalmente um relatório limitado da execução anterior no contexto.
`);
group('Webhooks e eventos externos','src/components/WebhooksPanel.tsx;server/webhooks.ts;server/webhook-ingress.ts','Endpoint privado de ingress + fila de tarefas + registo de entregas','URL acessível ao emissor e backend em execução; criar não liga serviços externos sozinho',`
Criar um webhook para um agente.
Escolher instruções predefinidas ou usar a tarefa enviada no pedido.
Escolher computador local ou cloud.
Restringir os tipos de evento aceites.
Definir o máximo de tarefas pendentes/em curso.
Ver e copiar instruções/comando de envio do webhook.
Ativar/desativar um webhook.
Editar a configuração do webhook.
Rodar a URL privada e invalidar a anterior.
Consultar entregas aceites e recusadas.
Abrir a thread criada por uma entrega.
Apagar o webhook.
`);
group('Integração Slack','src/components/bot-settings/SlackSection.tsx;src/components/bot-settings/useSlackManagement.ts;server/hosted-slack.ts;server/routes/hosted-slack.ts','Integração hosted Slack + link para gestão no Admin externo','A secção Solar é um deep link; criação/configuração da app Slack é feita no Admin da organização',`
Mostrar a secção Slack apenas quando o servidor oferece um URL de gestão.
Abrir a gestão Slack desse agente no Admin externo da organização.
Consultar e sincronizar a associação Slack através das rotas hosted previstas.
Receber mensagens/eventos Slack e encaminhá-los ao agente autorizado.
Enviar as respostas através da integração configurada.
Gerir criação/remoção da ligação no serviço externo; não há formulário local de tokens nesta secção.
`);
group('Telefone companion e acesso remoto','src/components/CompanionSection.tsx;src/components/PhoneSetupFlow.tsx;companion/src/solar-browser.ts;companion/src/routes.ts;electron/managed-companion-tunnel.mjs','Companion autenticado + pairing/QR + rede Wi-Fi/Tailscale/HTTPS + túnel','Rotas seguras dependem de serviços/conta; QR Solar abre /solar no browser; não é Android USB',`
Ativar/desativar o acesso de dispositivos remotos.
Gerar um código/QR temporário de emparelhamento.
Escolher o escopo da sessão de pairing: Full access ou Chat and approvals only no formulário que o expõe.
Gerar um novo código quando o anterior expira.
Ver detalhes de emparelhamento manual/endereço.
Emparelhar diretamente no mesmo Wi-Fi acessível.
Emparelhar através de Tailscale com MagicDNS.
Configurar a rota HTTPS/túnel seguro nos fluxos suportados.
Iniciar/verificar login por código de email para o serviço de acesso seguro.
Consultar estado da rota e repetir a preparação em falha.
Abrir o cliente Solar /solar no browser do telefone.
Confirmar explicitamente a ligação do browser pelo código.
Ver os agentes e ler conversas no cliente browser Solar.
Enviar mensagens e receber respostas no cliente browser Solar.
Usar o cliente companion nativo para chat, aprovações e chamadas que a plataforma suporta.
Consultar dispositivos emparelhados e última atividade.
Revogar/remover um dispositivo emparelhado.
Permitir ou retirar a vista/controlo de computador por dispositivo.
Manter o host acordado enquanto o acesso remoto está ativo.
Consultar descoberta próxima, rotas locais e diagnóstico avançado.
Configurar domínio próprio/HTTPS num servidor preparado.
`);
group('Workspaces ligados e computadores partilhados','src/components/ConnectedWorkspacesSettings.tsx;src/components/ComputerSharingSettings.tsx;electron/menu.mjs;electron/computer-sharing.mjs;server/shared-computers.ts','Cliente desktop remoto + sessão persistente + grants de desktop','Só pastas e capacidades explicitamente partilhadas são expostas; não mudadas nesta inspeção',`
Ligar a um workspace hosted por endereço ou link de pairing.
Guardar a ligação ao workspace neste computador.
Alternar entre workspace local e remotos.
Consultar o workspace atual.
Retirar/Forget uma ligação guardada.
Adicionar um servidor através de um link de pairing copiado.
Entrar numa organização pelo menu de servidor.
Abrir a gestão de acesso deste computador para um workspace remoto.
Escolher pastas locais para partilhar, inicialmente só leitura.
Permitir edição nas pastas escolhidas.
Dar separadamente acesso a terminal sem restrição.
Dar separadamente acesso ao ecrã/controlo de computador.
Parar a partilha e bloquear novos pedidos.
Listar computadores partilhados online por ferramenta de agente.
Listar, ler e escrever ficheiros partilhados por folder IDs e revisão/hash.
Executar comandos ou ferramentas de controlo apenas com o grant separado.
Consultar atividade de uso/emprestimo do computador.
`);
group('Backups e reposição de workspace','src/components/WorkspaceBackupSettings.tsx;server/workspace-backup.ts;server/workspace-backup-http.ts','Arquivo .orbitbackup cifrado + validação + substituição com cópia de segurança','Não inclui credenciais guardadas, logins CLI externos ou discos VM remotos',`
Exportar um backup completo do workspace com password.
Incluir agentes, threads, mensagens, ficheiros, instruções e definições não secretas.
Incluir rascunhos e preferências deste browser no backup.
Descarregar o arquivo cifrado.
Escolher um arquivo para importar.
Introduzir a password e validar antes de alterar o workspace.
Ver resumo, versão, quantidades, tamanho e exclusões do backup.
Confirmar a substituição escrevendo REPLACE.
Guardar uma cópia de segurança recuperável antes da substituição.
Restaurar agentes, permissões, instruções e skills do arquivo.
Restaurar rotinas, webhooks e chamadas em estado pausado.
Restaurar rascunhos/preferências do browser ou manter os atuais.
Mostrar que é necessário sair completamente/reiniciar após reposição.
`);
group('Templates, biblioteca e partilha de equipas','src/components/TeamLibraryPanel.tsx;src/components/ShareTeamDialog.tsx;server/package-import.ts;server/bot-package.ts','Templates Markdown/JSON + pacotes/backup de equipa + repositório comunitário','Importa cópias; não transfere contas nem ligações autenticadas',`
Explorar modelos de equipas incluídos.
Pesquisar e carregar modelos da comunidade.
Abrir o repositório público de templates.
Pré-visualizar membros, instruções, playbooks, skills e dependências de um template.
Criar uma equipa a partir de um template.
Importar .mausbackup.json, BotMRR .md ou .mausteam.json legado.
Importar um template/equipa por link GitHub ou JSON direto.
Arrastar um ficheiro de equipa para importar.
Importar a equipa como nova cópia e numerar nomes duplicados.
Adicionar skills desligadas e rotinas pausadas.
Mostrar as ligações que ainda precisam de configuração.
Exportar/partilhar uma equipa inteira como ficheiro sem conversas nem segredos.
Escolher a equipa a partilhar.
Começar a partir de uma pasta de projeto e obter sugestão de equipa.
Selecionar agentes da sugestão e criar uma conversa de grupo no projeto.
Abrir deep links de instalação de pacotes quando suportados pelo desktop.
`);
group('Consumo, custos e faturação','src/components/UsageSection.tsx;src/components/UsageHistory.tsx;src/components/UsageBudget.tsx;server/usage-ledger.ts;server/model-prices.ts','Ledger por turno + tokens/preços reportados ou estimados','Custos de subscrição podem ser equivalentes, não cobranças; budgets/billing são enterprise',`
Ver tokens, turnos e custo por agente.
Ver consumo da thread e do grupo.
Ver totais de todos os agentes.
Consultar histórico por período: mês atual, anterior ou últimos 30 dias.
Agrupar o histórico pelas opções disponibilizadas.
Distinguir origem direta, agente-a-agente e rotina.
Ver tokens de entrada, saída e cache.
Assinalar estimativas e modelos sem preço conhecido.
Exportar o histórico de consumo em CSV.
Definir um teto mensal do workspace quando a licença permite.
Definir percentagem de aviso e bloquear novos turnos ao atingir o teto.
Configurar preços de venda por modelo e preço default quando a licença permite.
Definir moeda e preços de input/output/cache por milhão de tokens.
Consultar a coluna faturável e exportá-la em CSV.
`);
group('Pessoas, audiência e auditoria','src/components/PeopleSection.tsx;src/components/ActivitySection.tsx;server/bot-visibility.ts;server/admin-activity.ts;server/request-auth.ts','Contas/sessões + owner/admin/member + filtros de audiência + audit log','Painéis condicionados pelo modo hosted e papel; listas locais não concedem acesso hosted',`
Consultar pessoas com acesso/atividade neste workspace.
Ver papel, última atividade, dispositivos e consumo por pessoa.
Convidar um email ou domínio quando o modo de servidor o permite.
Copiar o link de convite de login por código email.
Mudar o papel de membro/admin quando permitido.
Remover acesso e sessões de uma pessoa quando permitido.
Gerir pessoas no Admin externo em deployments de organização.
Definir audiência por agente e respeitar a visibilidade na interface/API.
Consultar o registo de alterações de pessoas, definições, acessos e agentes.
Consultar quem respondeu a aprovações.
Filtrar auditoria por pessoa, ação e intervalo de datas.
Ver dados antes/depois nos eventos suportados.
Exportar o registo de auditoria em CSV.
`);
group('Organização, modelos e backups cloud empresariais','src/components/OrganizationSettings.tsx;src/components/CompanyModels.tsx;src/components/CompanyBackupSettings.tsx;electron/company-backups.mjs;server/managed-policy.ts','Admin/gateway externo + licença + sessão desktop + backups service-managed','Requer uma organização/serviço configurado; nada foi ligado nesta inspeção',`
Entrar com email de trabalho através do browser.
Escolher URL de portal Admin personalizada.
Comparar código de verificação do desktop e browser.
Cancelar, repetir ou reabrir o fluxo de login.
Ver organização ligada e validade/estado da licença.
Usar modelos Company no seletor, além dos modelos pessoais.
Aplicar políticas de motores, modelos, MCP e acessos geridos.
Atualizar o estado da organização.
Desligar a organização e parar os turnos Company em curso.
Criar um backup cloud manual para a conta da organização.
Consultar snapshots, espaço, progresso e uploads/limpezas pendentes.
Cancelar uma transferência de backup.
Ativar/desativar backups diários com consentimento específico.
Ver próxima tentativa e último backup agendado.
Descarregar e validar um snapshot antes de restaurar.
Repor um snapshot com preview e REPLACE.
Apagar um snapshot cloud com DELETE.
Pausar backups diários quando a conta/organização deixam de corresponder.
`);
group('Servidor multi-workspace e camada enterprise','src/components/WorkspacesSection.tsx;server/fleet.ts;server/fleet-cli.ts;enterprise/server/index.ts;enterprise/FEATURES','Fleet/instâncias isoladas + licenças Ed25519 + branding','Só deployments preparados com direitos adequados; SSO/OIDC genérico está planeado, não implementado como entitlement',`
Listar workspaces de clientes/tenants de um servidor.
Criar um workspace com nome, admin, membros e opções de chave/limite.
Consultar estado, consumo e problemas de recuperação de um workspace.
Adicionar/remover pessoas na lista de acesso de um tenant.
Suspender e retomar um workspace.
Apagar um workspace escolhendo manter a pasta de dados quando disponível.
Atualizar todos os workspaces do servidor pela ação Upgrade all.
Aplicar nome, tagline, accent, logo e link de suporte white-label por brand.json.
Ver edição, direitos e expiração da licença.
Mostrar avisos de expiração e período de tolerância da licença.
Aplicar direitos admin, budgets e billing quando concedidos pela licença.
Administrar o fleet pela CLI nos fluxos de operador.
`);
group('Definições gerais, aparência e onboarding','src/components/SettingsModal.tsx;src/orbit/SolarAppearance.tsx;src/components/onboarding/WelcomeFlow.tsx;src/components/ThreadCleanupSettings.tsx','Preferências/config do workspace + locale + fluxos de boas-vindas','Algumas preferências ficam no browser e outras no host; Solar substitui skins da base',`
Editar o nome e email do utilizador.
Escolher língua da interface ou usar a do sistema.
Escolher esforço predefinido para novos agentes.
Escolher fundo Solar preto, azul profundo ou grafite.
Ativar/desativar movimento.
Ativar/desativar reação/interação visual.
Ativar/desativar partículas/debris envolventes.
Ativar/desativar ligações visuais.
Ajustar a intensidade de glow.
Escolher a fonte nas opções disponíveis.
Mostrar/ocultar chips/listas de threads conforme a preferência.
Configurar sons/notificações de atividade/conclusão quando expostos.
Configurar a apresentação de chamadas de ferramentas.
Ativar/desativar rotinas na conversa conforme a definição.
Configurar timeout de turnos de grupo.
Configurar o limite de threads paralelas por agente.
Ativar e escolher motor/modelo de recuperação automático.
Eliminar event logs antigos de threads terminadas/arquivadas após um prazo.
Limitar o tamanho dos event logs sem apagar transcrições.
Percorrer ou saltar a introdução Solar.
Criar/configurar o primeiro agente e motor pelos passos de onboarding.
Reabrir a introdução/tour a partir de Sistema.
Abrir a ajuda de atalhos e pesquisar atalhos.
Abrir Sobre com versão, créditos, licenças e atribuições.
`);
group('Desktop, diagnóstico, atualizações e APIs','electron/main.mjs;electron/menu.mjs;electron/diagnostics.mjs;electron/updater.mjs;src/components/InspectorPanel.tsx;server/harness/http.ts;server/message-db.ts','Electron + Node 24 + SQLite/FTS5 + HTTP/eventos + updater adaptado','Solar não recebe updates Orbit; existência de botão não prova canal Solar publicado',`
Arrancar com ecrã de carregamento Solar.
Impedir múltiplas instâncias e trazer a janela existente à frente.
Ocultar/restaurar a janela pela bandeja e sair completamente.
Conservar/restaurar geometria da janela.
Usar menus nativos de ficheiro, edição, visualização e janela.
Usar menu contextual nativo para copiar, colar e selecionar texto.
Escolher caminhos de gravação/download sem substituir inadvertidamente nomes.
Ver banners de atualização e consultar o estado do updater.
Pedir verificação de atualizações nos clientes em que o bridge existe.
Exportar um ficheiro de diagnóstico com versão, estados e log redigido.
Ver o Inspector de uma conversa.
Ver o run log e recarregá-lo do disco.
Ver eventos de ferramentas e narração de trabalho no chat.
Persistir mensagens e pesquisar por SQLite FTS5.
Reconstruir contexto/compactar histórico conforme o motor e orçamento de contexto.
Reconectar eventos do servidor e recuperar escritas/filas após falhas conforme a implementação.
Expor APIs HTTP autenticadas para clientes e ferramentas.
Expor a superfície MCP/control CLI para integração e verificação.
Receber deep links de pairing, organização, pacotes e threads nos fluxos suportados.
Executar fixtures isoladas para testes, separadas dos dados reais.
`);
const scan=JSON.parse(fs.readFileSync(path.join(import.meta.dirname,'evidencias.json'),'utf8'));
const fileLink=f=>`[${f}](${path.join(root,'orbit-app',f).replaceAll('\\','/')}:1)`;
let count=0;
let md='# Inventário funcional do Solar 0.1.87\n\nData: **5 de outubro de 2026**, Europe/Lisbon. Código analisado: **7ac1c04**, branch main. Aplicação Windows aberta por código e janela Solar confirmada através da UI Automation.\n\n';
md+='## Como usar esta lista\n\nCada item tem um ID e uma caixa por marcar. A caixa significa **avaliação de qualidade por fazer**, não funcionalidade em falta. Podemos escolher IDs e decidir: manter, melhorar, substituir, retirar ou testar. Este inventário descreve o que existe na interface e implementação; ainda não compara fornecedores nem afirma que a tecnologia atual é a melhor.\n\n';
md+='**Evidência:** observação da aplicação instalada para o mapa, foco de Jarvis e hub Sistema; leitura dos componentes/handlers; extração estática de '+scan.files.length+' ficheiros, '+scan.files.reduce((n,f)=>n+f.controls.length,0)+' linhas com controlos, '+scan.files.reduce((n,f)=>n+f.labels.length,0)+' referências de textos traduzidos e '+scan.files.reduce((n,f)=>n+f.routes.length,0)+' referências de API. Estas contagens não são quantidades de funcionalidades distintas.\n\n';
md+='**Limite:** nenhum inventário estático prova cobertura absoluta de todas as combinações de estado. Não foram executados todos os botões nem testadas contas, permissões, microfone, cloud ou telefone. Os índices conservam superfícies condicionais/legadas para permitir a revisão posterior. Bibliotecas MCP externas podem acrescentar ferramentas arbitrárias: o catálogo final dessas ferramentas só é conhecido depois de instalar e consultar cada servidor.\n\n';
md+='## O que confirmei na aplicação aberta\n\n- O mapa mostra agentes reais, pesquisa, Criar, zoom, enquadramento, linhas de hierarquia, reposição de disposição e compositor com destinatário/ditado.\n- Jarvis abre chat, modelo, aprovações, destino, threads, anexos, chamada, menu e os seis sistemas próprios.\n- Sistema dá acesso a motores, chaves, Apps, remoto/telefone, consumo, calendário, biblioteca, aparência, backups e outras definições.\n- O hub de motores apresenta **14 motores e 1 pronto** nesta instalação. Isto é estado observado, não um teste de respostas nem prova de disponibilidade de todos os motores.\n\n';
md+='## Índice\n\n'+groups.map((g,i)=>`- ${String(i+1).padStart(2,'0')}. ${g.title} (${g.items.length} itens)`).join('\n')+'\n\n';
for(const [i,g] of groups.entries()) {
 md+=`## ${String(i+1).padStart(2,'0')}. ${g.title}\n\n**Implementação atual:** ${g.tech}.\n\n**Condições:** ${g.condition}.\n\n**Fontes:** ${g.sources.map(fileLink).join(', ')}.\n\n`;
 for(const item of g.items) {count++; md+=`- [ ] **SOL-${String(count).padStart(3,'0')}** — ${item}\n`;}
 md+='\n';
}
md+='## Tecnologias de outras origens que o Solar usa\n\n| Área | Implementação encontrada | O que avaliar depois |\n| --- | --- | --- |\n| Aplicação desktop | Electron e Node.js; UI React/Vite/Tailwind | Peso, arranque, memória, integração nativa, segurança e manutenção |\n| Base funcional | Fork de Orbit/OpenMausBot; core Apache-2.0, camada enterprise com licença própria | Dependência do upstream, compatibilidade de updates, código morto e divergências Solar |\n| Mapa e retratos | Three.js e renderizadores Solar de partículas | GPU, acessibilidade, bateria, fidelidade e desempenho |\n| Ícones | Lucide; ícones de fornecedores e recursos third_party | Licenças, consistência e legibilidade |\n| Ditado Windows | Whisper.cpp v1.9.0, modelo base multilingue, execução local | Precisão PT-PT, latência, tamanho do modelo e consumo CPU |\n| Voz | Vozes Windows/macOS; adaptadores Grok/xAI, Chatterbox, ElevenLabs, Fish | Qualidade PT-PT, naturalidade, preço, privacidade e streaming |\n| Agentes IA | CLI/ACP e APIs por 18 drivers registados | Capacidade real por motor, contexto, ferramentas, retries e custo |\n| Controlo de computador | @trycua/cua-driver e runtime específico por plataforma | Observação, precisão, isolamento, permissões e recuperação |\n| Navegador do agente | agent-browser e Chromium headless | Compatibilidade, login, perfis, frames, input e isolamento |\n| Android | Android platform-tools/ADB e Phone Harness | Latência, fiabilidade, autorização e capacidades por aplicação |\n| Acesso remoto | Companion, cloudflared, Tailscale opcional, Caddy/domínio em self-hosting | Dependências externas, rota efetiva, revogação, reconexão e transporte |\n| Computador cloud | Boat/Box, VPS SSH/containers e VM local | Isolamento, custo, durabilidade, arranque e compatibilidade Windows |\n| Apps/plugins | Registries GitHub/oficial e MCP stdio/HTTP/SSE/OAuth | Confiabilidade de cada servidor, manutenção, excesso de ferramentas e tokens |\n| Persistência e pesquisa | SQLite/FTS5; Markdown/JSON conforme subsistema | Concorrência, migrações, integridade, performance e recuperação |\n| Backups | Arquivos cifrados locais; cloud empresarial com cifragem gerida pelo serviço | Cobertura, recuperação, compatibilidade e desenho da cifragem |\n| Organização | Gateway/Admin externo, licenças e políticas | Dependência do serviço, isolamento de tenants, autenticação e direitos |\n\n';
md+='## Pontos que precisam de validação para não confundir promessa com capacidade\n\n1. **Windows Solar versus base macOS:** existem textos e fluxos da base sobre voz ainda indisponível no Windows, apesar do adaptador Solar Windows. Rever guards e rótulos por superfície, especialmente compositor, shell e chamadas de grupo.\n2. **Atualizações:** o Solar não deve receber updates Orbit. Rever a ação Check updates e o canal Solar; o repositório não tinha release/instalador publicado no histórico consultado, e esta instalação foi compilada localmente.\n3. **SSO genérico/OIDC:** o entitlement sso está documentado como planeado; login da organização/gateway existente não significa que esse entitlement já esteja implementado.\n4. **Android tem dois caminhos:** controlo USB por ADB e acesso Solar no browser/companion. Têm dependências e funções diferentes.\n5. **Voz tem vários caminhos:** ditado Solar, chamada Solar, TTS, shell/island e group call. Não assumir que escolher uma voz habilita todos.\n6. **Papéis/templates não ligam serviços:** criar um especialista não autentica a conta, não instala as ferramentas e não agenda trabalho automaticamente.\n7. **Cloud/VM:** presença de código e botão não prova VM pronta no Windows, SSH configurado ou conta Boat existente.\n8. **Enterprise:** painéis e código não significam licença ativa nem serviço organizacional conectado.\n9. **Preview do editor:** HTML/Markdown estático, não build/execução de um projeto nem IDE completo.\n10. **MCP:** cada instalação acrescenta a sua própria lista de ferramentas e capacidades. Este inventário cobre a gestão e os proxies Solar, não uma lista infinita de serviços ainda não instalados.\n\n';
md+='## Índices técnicos para chegar ao botão e ao código\n\n- [Índice de interface e textos](INDICE-INTERFACE.md): por componente, com texto e fonte/linha.\n- [Índice de referências API e módulos](INDICE-API.md): endpoints referenciados, guards e módulos. Não é uma especificação OpenAPI.\n- [Ferramentas dos agentes](FERRAMENTAS-AGENTES.md): snapshots dos perfis e nomes adicionais no catálogo.\n- [Evidências estruturadas](evidencias.json): controlos, labels, referências de API e schemas dos snapshots.\n- [Script de extração](../solar-inventory-scan.mjs): permite voltar a gerar os índices depois de mudanças.\n\n';
md+='## Conferência visual no browser do Codex\n\nA interface foi também aberta no browser integrado em http://127.0.0.1:8799/. Ver [as observações por ecrã e diferenças desktop/browser](OBSERVACOES-BROWSER.md). A inspeção acrescentou ações à checklist e não executou envios de mensagens, chamadas, backups, criação de agentes nem alterações de permissões.\n\n';
md+=`**Total da checklist: ${count} capacidades/ações agrupadas em ${groups.length} áreas.** Ações técnicas da mesma funcionalidade podem ter entradas próprias; este total não é uma métrica comercial nem uma garantia de funcionamento.\n\n`;
md+='## Ficha de revisão para cada item\n\nCopiar esta ficha quando escolhermos o que melhorar:\n\n```text\nID SOL-___:\nO que quero que aconteça:\nImplementação atual e fonte:\nTeste real e resultado:\nProblema observado:\nAlternativas concretas:\nQualidade / velocidade / custo / privacidade / manutenção:\nDecisão: manter / melhorar / substituir / retirar\nPrioridade:\nCritério para considerar concluído:\n```\n';
fs.writeFileSync(path.join(import.meta.dirname,'INVENTARIO-SOLAR.md'),md);
let id=0;
fs.writeFileSync(path.join(import.meta.dirname,'checklist.json'),JSON.stringify({version:'0.1.87',commit:'7ac1c04',date:'2026-10-05',reviewed:false,groups:groups.map(g=>({...g,items:g.items.map(item=>({id:`SOL-${String(++id).padStart(3,'0')}`,feature:item,decision:null,priority:null,tested:false}))}))},null,2));
console.log(JSON.stringify({areas:groups.length,items:count}));
