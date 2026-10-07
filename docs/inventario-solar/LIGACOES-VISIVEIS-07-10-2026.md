# Apps visíveis no mapa — Solar 0.1.92

**Histórico: esta interface foi rejeitada pelo utilizador e removida na
versão 0.1.93. Não voltar a introduzi-la.** O texto abaixo documenta a
experiência anterior; as ligações continuam no painel de configurações.

Na retirada foram removidos componente, atalho, estilos, traduções, fixtures
específicas e metadados de cache acrescentados para essa faixa. Restaurou-se
a câmara do mapa anterior, mantendo as partículas e a exportação de planetas.
Sete testes de cache e partículas passaram; captura do mapa inspecionada.
Solar 0.1.93.0 instalado e aberto; serviço local HTTP 200 e pacote instalado
igual ao build. Nenhuma ligação ou dado pessoal foi alterado.

Revisão funcional da referência, sem copiar código:
- Responsável que distribui trabalho: já existe via Chief e `coordinate_bots`;
  ver `orbit-app/docs/verification/room-coordination.md` e `team-setup.md`.
- Instruções comuns de um departamento: equipas já guardam instruções;
  ver `orbit-app/docs/verification/teams.md`.
- Memória de preferências e correções: o contexto já inclui MEMORY.md e
  tópicos; ver `orbit-app/server/workspace.ts`, `MEMORY_ROUTING_GUIDANCE`.
- Rotinas e seleção de modelo: fluxos existentes; não acrescentar duplicados.
Não foi identificada nesta revisão uma funcionalidade nova indispensável.
Priorizar funcionamento dos fluxos existentes em vez de novos elementos visuais.

A primeira melhoria inspirada na organização do Agents Office mantém o mapa
Solar, planetas e partículas. Uma faixa discreta de apps aparece abaixo do
resumo do sistema, com ícones Lucide, nomes e estados descritos em texto.
Clicar numa app ou no título abre o painel existente de servidores MCP.

Os dados vêm de `/api/mcp/servers`, a configuração de apps deste Solar.
Outlook, Gmail e outras apps só aparecem quando estão realmente configuradas.
Não foram adicionadas integrações, contas ou permissões nesta alteração.

Estados:
- **Configurada**: a app está ativada; disponibilidade do servidor ainda não
  foi verificada. Usa o teste explícito no painel de apps.
- **Sessão iniciada**: existe autenticação OAuth guardada, sem presumir que
  o serviço remoto está acessível neste instante.
- **Iniciar sessão**: app OAuth ativada sem autenticação guardada.
- **Desativada**: não disponibilizada aos agentes.
- **Acesso restrito**: a política local impede utilização.

A faixa tem carregamento, estado vazio, erro e atualização. Quando não é
possível ler a configuração, não apresenta apps antigas como disponíveis.
Nomes compridos são truncados com descrição completa acessível; o quinto
item é seguido do contador das restantes. Em ecrãs estreitos a lista desliza
horizontalmente e a câmara reserva espaço para as apps sem tapar os planetas.
Na conversa, a faixa recolhe para preservar o foco.

Verificações: nove testes de estados, cache e navegação; um teste de navegador
isolado, incluindo desktop, 390 px, abertura do painel, erro e recuperação.
Capturas inspecionadas em duas rondas e catálogos de tradução válidos.

Referência: https://github.com/ajsahni/agents-office (documentação pública).
O vídeo Instagram não ficou acessível; não se fez uma análise audiovisual.
Não se reutilizou código nem assets do projeto de referência.

Solar 0.1.92.0 construído e instalado neste PC; pacote instalado com SHA-256
igual ao build e serviço local com HTTP 200. A configuração local não tinha
apps MCP adicionadas nesta verificação; a faixa apresenta o estado vazio.
As alterações continuam locais, sem publicação no GitHub.
