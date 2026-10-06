# Solar — observações na aplicação e no browser

5 de outubro de 2026, versão 0.1.87. A aplicação Windows foi aberta por código e a janela Solar confirmada. O controlo da janela nativa foi interrompido pelo utilizador com Escape. A pedido do utilizador, a conferência continuou no browser integrado do Codex, através do frontend servido pela aplicação instalada em `http://127.0.0.1:8799/`.

A navegação foi de consulta. Abrir um formulário não significa que a ação de gravação foi executada. Não foram enviados turnos, criadas ligações ou recursos, alteradas permissões, usados microfones nem restaurados dados. Preferências locais e integrações nativas podem diferir entre browser e desktop.

| Superfície consultada | Controlos e capacidade observada | Limite / condição |
| --- | --- | --- |
| Mapa Solar | Agentes, pesquisa, Criar, destinatário, ditado, zoom, enquadramento, linhas e repor disposição | Não foi alterada a organização do mapa |
| Jarvis | Chat, anexos, threads, modelo, aprovações, destino, Call e seis sistemas | O assistente integrado tem sistemas diferentes dos restantes agentes |
| Menu Jarvis | Perfil, visão geral, consumo, histórico, pin, não lido, pasta, pesquisa, transcrição, links, Inspector e Delete | Não foram executadas ações que alteram dados |
| Engine Jarvis | Seletor de modelo, esforço, motores alternativos, refresh e definições | Modelos de fallback mostram disponibilidade não verificada |
| Approvals Jarvis | Ask, Edits, Auto, Full access, pedir antes de contactar colegas e allowlist | Full access aparece desativado no browser e exige desktop |
| Skills | Campo GitHub/owner/repo, Import e playbooks | Sem skills instaladas neste agente; importação não executada |
| Memory | MEMORY.md, Topics, Daily log, Changes, Edit, Tidy, upkeep, Obsidian e gestor de ficheiros | O painel diz que este motor não faz upkeep semântico; resta limpeza determinística |
| Voice | Leitura automática, alertas, notas de voz, voz do dispositivo/host, fornecedores, amostra e Call | O browser mostra opções/rótulos de macOS misturados com uma voz Windows PT-PT; precisa de revisão de plataforma |
| Sistema/hub | Engines, Keys, Apps, remoto, Usage, Calendar, biblioteca, Appearance, People, Backups e System | Workspaces/Organisation do desktop não aparecem da mesma forma sem o bridge nativo |
| Engines detalhado | Ready/Needs setup, check again, contas; OpenCode mostra ícone de fornecedor, upload e Set CLI | 14 entradas, 1 pronta na observação; o estado de Codex mudou para Sign-in required, sem se testar uma resposta |
| Plugins Installed | Refresh, Paste config, Add server, import pessoal Claude Code | Nenhum servidor MCP customizado; nada foi ativado |
| Formulário MCP | Comando/argumentos/env; URL, headers, Streamable HTTP/SSE e OAuth | Formulário consultado e cancelado sem Save |
| Hub Calendar | Filtros All/Problems/Active e Open full calendar | Sem execuções existentes para explorar cartões preenchidos |
| Calendário completo | List/Calendar, datas, Today, filtros de agente, Day/3 days/Week, Schedule/Run logs/Webhooks e drag de agentes | Sem rotinas existentes; não foi executado drag nem criado evento |
| Menu New automation | Scheduled task, Scheduled call e Webhook | Ao escolher Scheduled task nesta navegação, o menu fechou sem surgir editor visível; comportamento por confirmar numa fixture |
| Backups | Password e confirmação, Export, ficheiro Import, password e Validate | Gravação/importação não executadas; texto ainda refere `~/.orbit` apesar do caminho Solar instalado |
| Appearance | Black/Deep blue/Graphite, motion, interação, partículas, linhas e glow | Preferências neste browser podem diferir do desktop |
| Appearance completo | Fonte Skin default/System/Inter/Poppins/Serif, threads, sons e mostrar ferramentas | Nenhuma preferência alterada |
| Experimental | Draft de skills e navegador integrado | Navegador integrado aparece desligado; descrição refere Verify e /create-verification-skill |
| System completo | Perfil/About me, idioma, esforço default, timeout de grupo, concorrência, rotinas na conversa, fallback, logs, tours e diagnóstico | Conteúdos privados não foram copiados para o relatório |
| Remoto/telefone | Texto de ligação a computador/domínio, código de pairing, escopos de sessão e dispositivos | Configuração companion depende do desktop; não foi gerado código nem alargado acesso |
| Agente comum | Dez sistemas habituais mais Desenvolvimento | O exemplo tem nome de agente Solar e skin Mercury; nomes históricos em mensagens não foram reescritos |
| Computer do agente | Auto/Cloud/Local VM/This computer/Browser/Off, Boat/VPS, working folder e Open panel | This computer exige desktop; Browser desativado por feature flag |
| Browser do agente | Perfil e botão de gestão de perfis | O rótulo no sistema diz Own profile, mas o painel informa Browser off; distinguir preferência de disponibilidade |
| Apps do agente | Contagem, Explore e Add server | Nenhuma ferramenta MCP externa configurada |
| Desenvolvimento | Files/Computer, refresh, novo ficheiro, editor e chat ao lado | A pasta atual não mostrava documentos; criação/edição não executadas |
| Computador em Desenvolvimento | Destinos, indisponibilidade e acesso a rotinas | Controlo local não está disponível no browser |
| Menu do agente comum | Acrescenta mover equipa, responsável, duplicar, ocultar e arquivar | Não se criaram cópias nem se alterou organização |
| Perfil do agente | Nome, role, blurb, SOUL.md, dez cores, audiência e Save | Campos consultados sem edição |
| All threads | Pesquisa, abrir, renomear, pin, snooze, link, archive, delete e nova thread | Com a lista atual vazia de pastas, ações de pasta foram identificadas no código |
| Create → Agents | Blank, General assistant, Email triage, Researcher, Coding partner, Community monitor e Operations | Gmail/GitHub/Discord/Slack/Calendar/Notion/Linear são sugestões de ligação, não Apps já conectadas |
| Create → Teams | Empty team e Orbit maintainers com Pilot, Upstream e Builder | É um template herdado: texto e instruções apontam para Orbit/OpenMausBot; rever antes de usar para manutenção Solar |

## Papéis e integrações sugeridos

| Papel oferecido | Trabalho descrito | Dependência sugerida |
| --- | --- | --- |
| General assistant | Perguntas, texto e tarefas gerais | Motor configurado |
| Email triage | Triagem de inbox e rascunhos para aprovação | Gmail por ferramenta configurada |
| Researcher | Pesquisa web/ficheiros com fontes | Ferramentas de pesquisa e ficheiros disponíveis |
| Coding partner | Ler/editar projeto e correr verificações | Pasta e ferramentas de execução; GitHub quando ligado |
| Community monitor | Ler comunidade e reportar mudanças | Discord/Slack/fórum e agenda configurados |
| Operations | Calendário, tarefas e follow-ups | Calendar/Notion/Linear quando ligados |
| Orbit maintainers | Pilot coordena, Upstream acompanha a base, Builder implementa pedidos | Template herdado com destinos e instruções Orbit que precisam de adaptação Solar |

## O que ainda não foi demonstrado por navegação

Cartões com aprovações reais, resultados partilhados, chamadas, microfone físico, tools MCP instaladas, sessões de navegador, Android USB, desktops/VMs cloud, grupos com membros, rotinas com execuções, uploads e restores. Essas áreas constam do inventário por implementação e têm de ser experimentadas com fixture ou ligação adequada antes de serem marcadas como verificadas. A inspeção não conclui que estejam todas funcionais nem que precisem todas de substituição.
