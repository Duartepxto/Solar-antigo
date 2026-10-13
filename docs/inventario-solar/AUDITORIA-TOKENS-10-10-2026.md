# Solar — auditoria de tokens e contexto, 10/10/2026

## Conclusão com a evidência disponível

O histórico real disponível não permite medir quanto o Solar gastou. No ledger de outubro há três registos, todos de 05/10, num único bot/conversa, iniciados pelo proprietário. Os três registam zero tokens de entrada e saída, cache ausente e custo **estimado** de zero. Isto não demonstra chamadas gratuitas: demonstra ausência de uma medição útil neste conjunto. Não existem turnos bot-to-bot nesta amostra para avaliar o caso descrito pelo utilizador.

O código atual já evita reenviar toda a conversa em cada retorno de um colega quando a sessão nativa e o registo de entrega são válidos. Identifiquei, contudo, uma lacuna independente: os títulos gerados por IA, quando ativados, faziam chamadas auxiliares sem contabilizar uso e sem verificar o limite de gasto imediatamente antes da chamada. A correção adiciona ambos, preservando o título inicial quando a chamada não pode decorrer. Esta opção está desligada por defeito e o Codex não oferece este helper, pelo que não explica os três registos históricos observados.

## Leitura real, apenas de agregados

Foi lido o ficheiro mensal de uso; não foram enviados prompts à aplicação real, consultadas conversas privadas nem alterados os dados do utilizador. O relatório contém apenas números e categorias, sem nomes de bots, emails, prompts, labels de dispositivos ou IDs nativos.

| Medição | Resultado |
|---|---:|
| Ficheiros mensais lidos | 1 |
| Registos no período 01–10/10 UTC | 3 |
| Bots / conversas distintos | 1 / 1 |
| Iniciados por proprietário / bot | 3 / 0 |
| Entrada / saída registada | 0 / 0 |
| Turnos com cache conhecida / desconhecida | 0 / 3 |
| Turnos com zero tokens e zero custo | 3 |
| Chaves de settlement repetidas | 0 |
| Linhas inválidas / ficheiros ilegíveis | 0 / 0 |
| Prompt de sistema montado por turno | 21 812 bytes |
| Parte estável / volátil por turno | 19 994 / 1 818 bytes |
| Soma de bytes montados nos três turnos | 65 436 bytes |

**Bytes montados não são bytes efetivamente transmitidos, nem tokens faturados.** O ledger guarda o tamanho do prompt que o servidor construiu antes do driver aplicar a reutilização da sessão. Três prompts montados com o mesmo tamanho não provam três uploads integrais. Não converti estes bytes em tokens usando uma regra aproximada nem inventei consumo/custo histórico.

O ledger não guarda a versão que produziu cada linha, o estado de medição, o motivo de replay ou o resultado da chamada. A causa exata dos zeros de 05/10 permanece indeterminada. O driver atual emite `cost: null`, e a contabilização atual mantém a chamada sem preço se não recebeu tokens nem custo. As fixtures verificam esta diferença sem reescrever o histórico.

## Como o contexto circula hoje

1. `server/delta-context.ts` regista as mensagens entregues a cada sessão. Numa sessão válida, `unseenMessages` seleciona apenas o que ainda não foi entregue. Uma mensagem recebida enquanto o turno estava em execução continua elegível até existir evidência de entrega; Stop, substituições de sessão e falhas têm tratamento próprio.
2. `server/index.ts` exclui do replay o pedido e os resultados que o próprio turno de coordenação já transporta. Mantém a seleção por ramo ativo e reconstrói contexto quando o ramo muda, o motor muda, a sessão deixa de ser válida ou as instruções relevantes mudam. Essa reconstrução serve a continuidade e a correção.
3. `server/system-prompt.ts` separa instruções estáveis de memória, menções, trabalho pendente e atividade recente. `server/drivers/prompt-split.ts` reutiliza recibos das partes entregues: uma alteração volátil segue como nota, sem acrescentar novamente o bloco estável num turno normal. Reancoragem e reconstrução são explícitas.
4. Os drivers OpenAI-compatible sem sessão nativa recebem o transcript selecionado em cada chamada. Este é um custo real da arquitetura stateless, sujeito aos limites e à cache do provider; não é automaticamente um erro de duplicação.
5. O replay tem orçamento adaptado à janela do modelo; a compactação preserva histórico integral na aplicação e oferece resumo limitado e trocas recentes à nova sessão. A seleção limita o resumo a 6 000 bytes. O helper de resumo pode precisar de vários lotes, acrescentando chamadas próprias.
6. Os resultados de colegas são preservados como dados não confiáveis, não como novas instruções humanas. Mensagens `keep` não são adiadas pelo limite de 12 mensagens/4 000 bytes das mensagens opcionais: vários resultados simultâneos podem ultrapassar esse orçamento suave. Cortá-los indiscriminadamente perderia trabalho.

O caching exige um prefixo compatível entre chamadas. Manter instruções fixas no início e conteúdo mutável no fim segue a [documentação oficial OpenAI](https://developers.openai.com/api/docs/guides/prompt-caching). A cache reduz processamento/custo do prefixo conforme o provider, mas não significa que o histórico deixou de integrar a entrada; os tokens em cache devem continuar separados. A [documentação Claude](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) distingue leituras e criação de cache, pelo que uma reconstrução pode ter um custo diferente de um resume normal.

## Fontes de consumo que merecem continuar a ser medidas

| Fonte | Situação observada no código | Próxima evidência necessária |
|---|---|---|
| Instruções e catálogo de ferramentas | O prompt real montado tem ~20 KB de parte estável; não inclui necessariamente toda a definição de ferramentas | Tamanho efetivamente entregue, ferramentas montadas e tokens medidos por chamada |
| Histórico numa sessão nativa | Incremental quando os recibos são válidos; replay em condições de recuperação | Contadores de resume/replay por motivo, sem texto de mensagens |
| Providers stateless | Transcript selecionado volta a integrar a chamada | Entrada com/sem cache por tipo de motor e comprimento da conversa |
| Coordenação entre colegas | Pedidos/resultados e continuação do coordenador geram trabalho; limites de profundidade/pedidos/execuções já existem | Comparação de tarefa equivalente com/sem delegação, incluindo todas as chamadas |
| Ferramentas e comandos | Resultados built-in grandes têm preview limitado e leitura posterior; comandos nativos e MCP externos não partilham todos esses limites | Bytes entregues por origem e frequência de releituras |
| Memória e compactação | Helpers já passam `onUsage` e verificam o orçamento; reporte depende do provider | Cobertura de chamadas e dados de cache write, onde disponível |
| Títulos de conversa | Opt-in; antes desta correção não havia accounting nem verificação local do cap | Fixtures desta correção e acompanhamento de uso futuro |

Somar input ao longo de várias chamadas de ferramentas pode produzir números muito superiores ao tamanho de uma única janela. O driver Codex atual calcula o incremento dos totais da thread relativamente à baseline restaurada, separando cache de input novo. A janela usa a última chamada, não essa soma. O driver Claude mantém o incremento de custo do processo/sessão, evitando somar repetidamente o acumulado.

Não alterei prompts/limites para procurar uma poupança aparente sem prova: remover contexto necessário, resultados dos colegas ou verificações de permissões poderia tornar o produto mais barato e menos correto. A auditoria não demonstrou uma retransmissão integral indevida na versão atual nem mede qualidade/custos de um provider real.

## Ferramenta reutilizável

Novos ficheiros no `orbit-app`:

- `server/usage-diagnostics.ts`: agregados, cobertura de cache, custos reportados/estimados, bytes de prompt, turnos sem tokens, chaves repetidas e leitura de JSONL com contagem de linhas inválidas.
- `scripts/solar-usage-audit.ts`: CLI apenas de leitura, sem chamada a modelos, com diretório absoluto explícito e output JSON saneado.
- `server/usage-diagnostics.test.ts`: fixtures locais, incluindo CLI real, preservação do ledger, cache desconhecida, dados inválidos e recusa de diretório implícito.

Exemplo PowerShell, a partir de `orbit-app`:

```powershell
node --experimental-strip-types scripts/solar-usage-audit.ts --data-dir 'C:\caminho\workspace-do-solar' --from 2026-10-01 --to 2026-10-10
```

O diretório é o data dir do workspace, com `usage` dentro, não a pasta `usage` em si. Datas são UTC e o limite de intervalo é 366 dias. Sem datas, lê o mês UTC atual até ao momento. Não há descoberta automática do Solar em execução. Custo ausente continua ausente; não há recuperação de preços nem reescrita de ficheiros. Chaves repetidas são assinaladas mas continuam nos totais, permitindo investigar antes de deduplicar. `measuredCacheShare` só usa entrada com medição de cache; `inputWithUnknownCache` nunca é rotulado como entrada nova. IDs anónimos dos bots só têm significado no relatório corrente.

## Correção de títulos e verificação

`generateThreadTitle` agora recebe a identidade do bot responsável, a conversa de navegação e uma cópia da origem do pedido. Confere `assertWithinBudget` antes de chamar o provider e passa `onUsage`, registando o modelo auxiliar realmente reportado. Mantém tokens ausentes sem preço. O ledger usa uma conversa auxiliar própria para evitar confusão com o turno principal, e notificações de gasto apontam para a conversa real. O fallback do título continua a ser o texto inicial. Chamadas já admitidas podem terminar acima do cap; o cap impede as seguintes, não reserva um custo futuro desconhecido.

`server/thread-title-usage.e2e.test.ts` percorre a API real com motores fake e um workspace descartável: título de mensagem de pessoa emparelhada, título de grupo, custo auxiliar que passa a contar para o cap e medição ausente que permanece sem preço. `server/index.test.ts` adapta a asserção do formato do helper para JSON, necessário ao reporte de uso.

Verificações concluídas em 10/10/2026:

- Diagnóstico + álgebra incremental + split de prompt: **51/51 testes** em três ficheiros.
- Fluxo real de títulos com accounting: **3/3 fixtures**; o helper reporta 15 input, 2 cached, 5 output e $0.01 sintéticos, e a mensagem seguinte é recusada quando título + turno ultrapassam $0.015.
- Fluxos existentes de títulos e fallback: **4/4 testes selecionados** em `server/index.test.ts`; os restantes 254 foram excluídos intencionalmente nesta execução específica.
- TypeScript do servidor e lint dos ficheiros alterados: sem erros.
- CLI executada sobre o ledger real apenas de leitura: os agregados constam da tabela acima.
- Verificador de documentação: **7/7 testes**; os novos guias e comandos existem. Dois guias já existentes, de moeda e reconhecimento de ditado, estavam omissos no índice e passaram a estar ligados.

- Infraestrutura atual de contexto e accounting: `server/delta-context.e2e.test.ts`, `server/drivers/codex.test.ts` e `server/usage-ledger-api.test.ts`: **186 testes passaram, 2 saltados**, em 455 segundos. Incluem mensagens inéditas/resultados de colegas, reconstrução de sessão, isolamento de helpers, baseline restaurada, múltiplas chamadas num turno e custo indisponível numa falha sem medição.

Somando as execuções relevantes acima: **251 testes passaram**, com dois saltados na suite de infraestrutura e 254 excluídos intencionalmente na seleção de títulos. Os casos fake demonstram ausência de duplicação nos cenários exercitados, não o consumo de um provider real. Nenhuma destas verificações faz chamadas pagas nem usa o workspace real para mutações.

## Próximas ações concretas

1. Acrescentar telemetria de diagnóstico opt-in: `usageReported`, estado do turno, modo de contexto (resume/delta/replay), motivo e bytes efetivamente entregues. Apenas categorias/números, sem conteúdo de conversa.
2. Medir tarefas representativas de conversa curta, longa, ferramentas e colegas; comparar entrada nova/cache e consumo auxiliar. Esta auditoria com providers fake comprova o fluxo, mas não a poupança com modelos reais.
3. Reduzir o catálogo/instruções montados apenas quando a tarefa e a capability permitirem, com comparação funcional. Não alterar seleções de conta/modelo ou permissões silenciosamente.
4. A documentação de compactação e usage foi alinhada nesta revisão com o `onUsage` atualmente existente: helpers reportados já podem entrar no ledger, enquanto providers sem reporte continuam a limitar a cobertura. Manter esta cobertura explicitada em qualquer expansão de drivers.

## Segunda passagem — accounting, falhas e cobertura de cache

Esta passagem examinou código dos drivers OpenAI-compatible, acumuladores do Store, ledger, spend cap e helpers de apresentação da UI. As mudanças mantêm o contrato dos payloads e não alteram design, permissões, modelos selecionados ou política de retries.

### 1. Cache e preço recebidos eram descartados na conversação

O `usageFrom` do runtime partilhado devolvia apenas input/output, apesar de o provider oferecer `prompt_tokens_details.cached_tokens`; o evento de conclusão fixava `cost: null`. Reproduzi contra o driver original: uma resposta sintética com 100 input, 80 cached, 5 output e $0.003 terminava sem cache e sem preço. Outro caso recebia usage antes de erro de protocolo e perdia todos esses tokens ao falhar. Ambos os testes falharam exatamente nessas diferenças antes da correção.

A correção recolhe uma medição por pedido/attempt e soma pedidos distintos, incluindo rondas de ferramentas. Frames sucessivos do mesmo pedido são snapshots, não novas chamadas: não são somados repetidamente. Retém uso já recebido quando um stream falha ou o utilizador cancela. Dados inválidos/ausentes continuam desconhecidos; `usage: {}` não produz uma medição zero nem apaga uma medição válida anterior. Input apenas ausente numa resposta que reporta output não passa a cache conhecida.

Snapshots parciais preservam campos independentes já observados; dependências são invalidadas quando necessário. Se o input passa de 100 para 200 sem nova medição de cache, a cache anterior de 80 não se apresenta como a cobertura do prompt de 200. Se input/output mudam sem preço novo, o preço do snapshot anterior deixa de se apresentar como preço completo. Cache incompleta numa ronda não é rotulada como input novo medido; um preço reportado de apenas parte dos pedidos não é apresentado como preço autoritativo de todo o turno.

Os tokens em cache são parte de `prompt_tokens`, não mais input a adicionar: ver a [referência oficial OpenAI de Chat Completions](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create). Para preço reportado, a correção aceita `usage.cost` apenas quando a URL é OpenRouter, cujo [contrato de usage](https://openrouter.ai/docs/cookbook/administration/usage-accounting) define custo por pedido e cuja [documentação de suporte](https://openrouter.ai/support) identifica créditos denominados USD. Um campo genérico `cost` de outro endpoint não estabelece moeda/unidade. É ignorado para USD, deixando a estimativa explícita ou o custo desconhecido. Este critério aplica-se também aos helpers deste runtime; o teste antigo com custo fictício xAI foi alinhado com esta limitação. Não acrescentei um override silencioso para providers personalizados.

### 2. O acumulado de uma tarefa apresentava cache parcial como integral

`Store.addTaskUsage` utilizava "cache anterior conhecida OU cache atual conhecida". Dois turnos de 100 input, um com 80 cached e outro sem informação de cache, produziam 200 input/80 cached como se o restante fosse todo novo e medido. Duas regressões falharam antes da correção, incluindo a ordem inversa e um turno sem medição.

Agora o agregado só mantém `cachedInput` quando existe cobertura explícita em todos os turnos. O último turno preserva a sua medição individual, mesmo quando o total permanece desconhecido, e esse estado sobrevive ao reload. Cache zero explicitamente reportada é conhecida; input zero sem cache pode ser um placeholder normalizado e não estabelece cobertura. Não há migração que invente cache para registos antigos. A UI existente já sabe mostrar input total/cache desconhecida quando o campo não existe, pelo que esta correção de servidor não requer mudanças visuais.

### 3. Uma escrita de ledger falhada apagava gasto já conhecido do cap

`noteSpend` removia o gasto da memória quando `appendUsage` devolvia `false`. Uma regressão confirmou que um total de $0.80 passava a $0.50 depois da falha de escrita, embora o custo conhecido de $0.30 já tivesse ocorrido. Com armazenamento indisponível, isso podia permitir novas chamadas depois de atingir o cap.

Agora gasto conhecido permanece em memória no mês corrente mesmo com falha/rejeição da escrita. Uma leitura posterior que encontre a mesma settlement key evita dupla contagem, e a mudança de mês não cobra nem conserva entradas antigas. Registos de custo desconhecido continuam sem inventar dinheiro. As regressões cobrem falhas concorrentes, repetição da mesma key, ledger recuperado, reconciliação, cap atingido e mês novo.

**Limitação de durabilidade:** se o processo reiniciar antes de o registo chegar ao disco, a memória perde-se e não há como reconstruir aquele gasto com os dados atuais. Uma regressão documenta precisamente essa perda. A solução nesta ronda não transforma o cap em garantia durável perante ledger indisponível e não interrompe chamadas que já começaram.

### Exercício do fluxo real

`server/openai-usage-accounting.e2e.test.ts` lança o servidor real com workspace descartável, orçamento sintético e provider exclusivamente em loopback. Percorre dois pedidos de uma ronda de pergunta/ferramenta: 250 input, 200 cached, 10 output, com uma única linha final de ledger. A estimativa usa 50 input novo, 200 cache e 10 output; não converte o `cost: 99` arbitrário do loopback em dólares. O custo sintético passa a contar para o cap e a mensagem seguinte é recusada sem novo pedido upstream. Depois de elevar o cap, um stream falhado preserva 100 input/80 cached/5 output, e uma resposta com usage vazio mantém custo indisponível. Sem provider real, sem dados pessoais e sem chamadas pagas.

As suites existentes de Grok verificam retries 429/5xx, limite de attempts, ausência de retry depois de output parcial e cancelamento durante backoff. Os testes dos helpers de apresentação verificam token total quando cache é desconhecida, enquanto ledger, grupos e Store cobrem custo desconhecido, misto e reload. Não se infere qualidade nem poupança de tokens com modelos reais a partir destas fixtures.

### Lacunas inventariadas para a próxima ronda

- O ledger não tem `usageReported`/cobertura por campo. Um zero pode ser medição ou placeholder histórico; grupos/histórico e acumulados conservadores podem divergir após um turno sem medição. Guardar esse estado explícito é necessário para reconstrução precisa, sem alterar o passado por suposição.
- Se um pedido não entregar usage, os tokens/custo que o provider eventualmente cobrou não são recuperáveis apenas pelo stream. Preços mistos reportados/ausentes e campos vendor de cache write também limitam a precisão.
- O cap depende das rows duráveis depois de um restart. Falhas de leitura do ledger e persistência indisponível precisam de diagnóstico/UX e política de recuperação numa passagem própria; a correção em memória não resolve isso integralmente.
- A identidade de settlement usa timestamp/thread/bot. Títulos auxiliares usam thread keys aleatórias próprias, mas uma possível colisão entre duas rows legítimas na mesma milissegundo deve ser investigada com reprodução. É uma hipótese pendente, não um bug comprovado.

Verificação final desta passagem:

- Suites finais após todos os pontos de review: **239 testes passaram, 1 saltado**, em nove ficheiros (`openai-chat-usage`, `openai-chat`, `store`, `spend`, helpers de UI `src/lib/usage`, `usage-ledger`, `group-thread-usage`, `grok` e `minimax`). Incluem 13 regressões dedicadas ao accounting OpenAI-compatible.
- Integração adicional: **8 casos de `spend-cap-api` e 1 de `openai-usage-accounting.e2e` passaram**, além das regressões locais que acompanharam essa execução. Não somei execuções repetidas como se fossem cenários novos.
- Verificador de documentação: **7/7**. Lint de todos os ficheiros desta ronda e `git diff --check`: sem erros.
- TypeScript global fica a cargo da integração principal, depois de todos os ficheiros das frentes paralelas estarem prontos. A verificação de servidor anterior passou; não a apresento como prova do estado integrado posterior.

Os processos desta frente concluíram e não permanecem providers/servidores de fixture a correr. O ledger real não foi alterado. Não foi medida nem declarada uma poupança de tokens real: corrigiu-se a contabilização e a informação de cobertura com evidência causal.
