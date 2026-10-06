# Estado funcional — 5 de outubro de 2026

## Correções instaladas nesta passagem

- O cliente móvel envia `threadId`, impedindo a recusa de pedidos em agentes com várias conversas.
- Cada envio móvel tem um `sendId` estável. Ao repetir o mesmo rascunho após uma falha de rede, conserva a identidade e a thread originais. Não há repetição automática de ações.
- O emparelhamento conserva também o seu `pairRequestId` durante as repetições da mesma página, permitindo recuperar uma resposta perdida sem criar outra tentativa incompatível. Foi validado no navegador e no contrato de dispositivos.
- A chamada Windows volta à escuta depois de uma gravação silenciosa bem-sucedida. Erros e transcrições bloqueadas exigem atenção; desligar cancela o temporizador.
- Os endereços de Wi-Fi/Ethernet são preferidos a Radmin VPN, vEthernet e outras interfaces virtuais. As alternativas são mantidas. A aplicação instalada passou a apresentar o endereço doméstico correto.
- O navegador integrado e o companion local foram ativados nas preferências existentes. Não se alargaram permissões de agentes nem se abriram portas no router.
- O Codex usa junctions para ligar o histórico no Windows, dispensando o privilégio necessário para symlinks de diretórios. Os ficheiros de autenticação e instruções pessoais continuam excluídos dessa cópia.
- O motor Claude normaliza a configuração antes de iniciar, evitando uma CLI indefinida quando recebe uma configuração vazia.

## Estado da instalação

| Área | Estado confirmado | Limite da confirmação |
| --- | --- | --- |
| Voz Alt+T | Whisper local pronto; chamada e silêncio testados em Chrome | Microfone e síntese simulados no teste de interface |
| Navegador integrado | Ativado; binários instalados passaram navegação, escrita, cliques, captura e isolamento de perfis | Testes em páginas e perfis descartáveis |
| Computador Windows | Driver real iniciou/terminou e anunciou 57 ferramentas | Não se controlaram aplicações pessoais ou ecrãs UAC |
| Android no navegador | Serviço local ativo; página responde 200; envio e repetição testados | Dispositivo físico ainda por emparelhar |
| Rotinas e calendário | Criação e execução concluídas pela interface Solar em fixture | Motor simulado; consola sem erros |
| Codex e OpenCode | Reportados como disponíveis pela instalação | Não se enviou um pedido pago ao modelo |
| Outros motores e Apps | Exigem instalação, login ou configuração do fornecedor | Não se inventaram chaves nem se criaram contas |
| Android nativo | Atualização de 6/10: Solar Preview instalado; 1.580 testes aprovados e emparelhamento físico confirmado pelo utilizador | Chamada móvel, conversa completa e ação no PC ainda por validar; ver [relatório Android](ANDROID-SOLAR-06-10-2026.md) |
| VM local | Runtime de containers ausente | Não se instalou uma VM nem se iniciou um download pesado |
| Discord e outras contas | Integração requer conta/ferramenta configurada | Nenhuma mensagem externa enviada |

O desenho principal do agente permanece inalterado. A pílula conserva o desenho anterior escolhido, tamanho 48 × 108 px e cores atuais.

## Verificação

- Envio móvel, autenticação e ações por thread: 6 testes passaram.
- Voz e cliente móvel com as últimas alterações: 2 testes de interface passaram.
- Endereços, rotas de QR e fluxo de ligação: 55 testes passaram.
- Descoberta mDNS e Tailscale: 46 testes passaram.
- Recuperação do emparelhamento, cliente móvel e dispositivos: 27 testes passaram, 1 ignorado.
- Electron: 455 testes passaram e 19 foram ignorados por plataforma/ambiente. Corrigiu-se um caminho de fixture Windows e os cenários que exigem `/bin/sh` ou `mv` são identificados explicitamente como Unix; não se ignoraram testes do instalador Windows para obter este resultado.
- Build, empacotamento e instalações silenciosas concluídos com código 0. Os assets de voz e o código móvel instalados correspondem às alterações verificadas.
- Evidência da rotina pela interface: `orbit-app/.orbit-scratch/verify-evidence/solar-routines.png`.
- O diagnóstico de leitura `control:orbit doctor` terminou com sucesso na instalação. O companion respondeu 200 também pelo endereço LAN, além de loopback. Isto não substitui o teste a partir do telefone.
- O servidor instalado arrancou numa cópia descartável fora do projeto; os 11 caminhos de proxies resolveram, o MCP comunicou e o worker de backup exportou um arquivo encriptado. A verificação de tipos do servidor e do companion passou.

Os conjuntos de testes sobrepõem-se e não devem ser somados. A bateria geral terminou com **9.096 testes aprovados, 31 falhas, 286 ignorados, 1 todo e 2 erros**, em 760 ficheiros. Este resultado inicial não é verde. O código foi corrigido durante a execução; a bateria geral não foi repetida integralmente depois dessas correções.

Repetições: endereços Windows, catálogo Claude, histórico Codex e capacidades dos motores passaram **18 testes**; canvas Solar e data localizada passaram **22 testes**. A regressão Claude aprovou 149 testes e identificou 3 casos incompatíveis com a primeira implementação de defaults; ajustou-se a implementação para preservar a configuração já decodificada. Esses 3 casos e os 4 testes de capacidades passaram na repetição final (**7 aprovados**, com os restantes fora do filtro). A recuperação de contexto passou o cenário isolado com histórico suficiente para ultrapassar o orçamento adaptativo. Esse teste deixara de ser válido quando o limite fixo de 40 mensagens foi removido: 21 mensagens curtas já não fazem desaparecer os resultados antigos.

Restam falhas da bateria geral a investigar ou adaptar, incluindo criação de symlinks de ficheiros sem o privilégio Windows, uma asserção POSIX de permissões OAuth, encerramento de fixtures por SIGINT, timeouts do navegador e expectativas de interface desatualizadas. Uma fixture ficou mais de cinco minutos praticamente inativa e foi interrompida; esse erro foi conservado no resultado. Não se desativaram essas verificações para apresentar a bateria como aprovada.

A repetição móvel final passou. A repetição de voz encontrou um timeout de abertura, mas depois de fechar 17 Chrome de fixtures abandonadas (197 processos com perfis dentro de `TEMP/orbit-verify-data-*`), passou isoladamente, incluindo a pílula Windows, gravação silenciosa e cancelamento. Não se fecharam Chrome pessoais nem a aplicação Solar. A falha inicial do navegador fica preservada no log; a limpeza melhora o ambiente, não transforma toda a bateria inicial num resultado aprovado.

Logs: `.orbit-scratch/solar-functional-suite.log`, `solar-functional-rerun.log`, `solar-fixture-rerun.log`, `solar-delta-recovery-rerun.log`, `solar-electron-suite.log` e `solar-packaged-server-smoke.log`. Testes de código não provam todas as combinações de dispositivos, contas e serviços do inventário. A auditoria completa permanece **inconclusiva** até resolver as falhas restantes e confirmar os dispositivos e contas reais.

## Ligar o Android

Manter PC e Android na mesma rede. No Solar: Jarvis → Sistema → Remoto/telefone → ligação local pelo mesmo Wi-Fi. Ler o QR com a câmara e confirmar «Ligar ao Solar» no navegador. O QR transporta uma credencial temporária no fragmento; não a copiar para documentação nem partilhar capturas do QR.

A página sem QR pode ser aberta para verificar conectividade, mas não concede acesso à conversa. Se a ligação física falhar, verificar o perfil de rede e a firewall Windows; não foi criado um acesso público como alternativa.
