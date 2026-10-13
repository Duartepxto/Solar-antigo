# Solar como assistente — verificação funcional

Pedido de 10 de outubro de 2026: ligar as funcionalidades existentes a um
assistente utilizável, verificando também os percursos reais. O esclarecimento
do utilizador é determinante: «como aqui tu consegues abrir browsers […] um
novo separador». O objetivo imediato é o browser próprio e os painéis de
conteúdo dentro do Solar; não exige instalar uma VM Windows.

## Alterações entregues

- O browser privado fica disponível por defeito. Um `features.browser: false`
  guardado, `bot.browser: false`, Works on Off e as permissões existentes
  continuam a impedir o acesso. Disponibilidade não concede controlo do PC
  nem acesso aos perfis pessoais do utilizador.
- O Jarvis prefere o browser próprio para trabalho web e usa `select_computer`
  para selecionar Browser quando as ferramentas ainda não estão montadas.
  Uma mudança pendente termina o turno e retoma o pedido na superfície certa.
- As instruções reconhecem o dock de voz Windows Alt+T e usam a política
  partilhada de autenticação. Não encaminham automaticamente o trabalho para
  o browser pessoal quando o próprio está indisponível.
- A ilha só envia uma gravação concluída com transcrição válida. Cancelar,
  mudar de destinatário, falhar a transcrição ou terminar sem fala não envia
  o rascunho que já existia. Callbacks antigos e duplicados não reenviam.
- As fixtures de browser fixam a língua dos seletores, limitam a descoberta
  de dependências à página selecionada e esperam pelo estado real da UI.
- A aceitação Codex copia o login opt-in para o `codex-home` realmente usado
  pelo driver. Copiá-lo para `.codex` provocava um falso erro de autenticação.
  `verify-codex-surface-live.ts --acceptance` executa um pedido normal e verifica
  o DOM final independentemente da resposta do modelo.

## Evidência prática nesta máquina Windows x64

| Percurso | Resultado e alcance |
| --- | --- |
| Browser incluído na distribuição | Passou: arranque MCP, navegação, título, escrita, clique, fechar/reabrir e PNG após reinício. |
| Dois agentes com browsers próprios | Passou: cookies e localStorage separados. |
| BrowserPanel real + backend isolado | Passou: imagem real, assumir/devolver controlo e recuperação de stream sem repetir navegação nem recuperar uma licença de controlo humano. |
| Inatividade do browser | Passou: documento e formulário não guardado conservaram a identidade após 65 segundos; a ação seguinte submeteu e verificou o cumprimento. |
| Tamanhos do painel | Verificados 390 e 1280 px sem overflow horizontal. |
| Voz na ilha | Hook React real num Chrome descartável: cancelamento, ausência de fala, erro, mudança de destinatário e conclusão única passaram. O bridge de microfone foi simulado. |
| Driver de controlo Windows | Arrancou o daemon real sem consola e ligou 57 ferramentas; encerramento confirmado. Não foram enviados cliques ao desktop do utilizador. |
| Notch/dock | 38 verificações passaram: hotkeys, visibilidade, áreas interativas, click-through e encaminhamento. A janela Electron foi simulada nestes checks. |
| Ferramentas e permissões | 53 checks de servidor isolado passaram: ferramentas de chat, perfis, encaminhamento e interfaces da ilha. |
| Defaults e regressões do browser | 161 checks passaram. A verificação adicional de voz/instruções passou 14 checks. Existem sobreposições; não somar como contagem única. |
| Backend distribuído | Arrancou fora do checkout, sem node_modules; resolveu 11 proxies, MCP stdio, backup encriptado e browser incluído disponível por defeito. |
| Pedido normal ao modelo real | Passou com GPT-5.5: abriu a página local no browser próprio, preencheu e submeteu o formulário, observou o cumprimento e devolveu uma captura à conversa. Uma observação independente do DOM confirmou `Hello, Solar Acceptance`. |
| Compilação | Tipos frontend/servidor, lint dos ficheiros alterados e catálogos de tradução passaram. Instalador Solar 0.2.2 gerado em `orbit-app/release-solar/Solar-0.2.2-setup.exe`. |

Captura do painel real:
[`browser.png`](../verification-evidence/solar-assistant-2026-10-10/browser.png).

A aceitação nativa passou com `agent-browser 0.36.0-omb.1` e Chromium
153.0.8010.47. O relatório da fixture que recebeu um override do executável
mostra a versão nominal upstream; o smoke do recurso empacotado verificou
explicitamente a versão Windows real.

## Limites desta entrega

Esta passagem não comprova paridade integral com ChatGPT ou Claude. Conversas,
anexos, documentos/HTML/imagens no canvas, desenvolvimento, memória, skills,
Apps/MCP e rotinas têm implementação no projeto, mas cada conta ou serviço
externo continua a precisar da sua ligação. Nem todas estas funcionalidades
foram verificadas com fornecedores reais nesta passagem.

O microfone físico, a voz audível e uma chamada completa no dispositivo não
foram usados. Os testes de controlo do PC verificam o transporte, não a
compatibilidade de input com todas as aplicações Windows.

A sessão real recusou `gpt-6.1-sol` como não suportado para esta conta ChatGPT.
Um nome presente no catálogo ou no fallback não comprova acesso a esse modelo.
Não se deve converter essa recusa em sucesso nem trocar silenciosamente o
modelo escolhido pelo utilizador.

O caso com GPT-5.5 passou após corrigir o caminho do login na fixture. O
percurso usou realmente o driver Codex, MCP do browser e captura do resultado
na conversa. O recibo reportou 169232 tokens de entrada agregados, 149248
em cache e 419 de saída, com custo estimado pelo Solar de USD 0.187114; esse
valor não é uma fatura do fornecedor. O modelo foi escolhido explicitamente
para a fixture, sem alterar os agentes reais do utilizador. Log retido:
`server-1791666917932-5180.log`, na pasta temporária
`orbit-verification-evidence` indicada pelo launcher.

O instalador foi gerado; a instalação existente não foi atualizada durante
estas verificações. Todos os pedidos de teste foram enviados a fixtures
descartáveis, não ao workspace real do utilizador.
