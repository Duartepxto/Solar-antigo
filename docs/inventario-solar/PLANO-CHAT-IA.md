# Solar: melhorar a qualidade e continuidade do chat

Análise de 5 de outubro de 2026, sobre o código base 0.1.87, revisão `7ac1c04`. O objetivo é melhorar o assistente pessoal; o design fica para outra fase. O diagnóstico abaixo descreve a base original. As primeiras alterações autorizadas estão registadas a seguir.

## Primeira etapa aplicada: continuidade do contexto

- A decisão de compactar agora considera o tamanho do novo pedido, além da utilização do turno anterior.
- A reconstrução passa a adaptar-se à janela do motor, reservando margem para instruções, ferramentas e resposta. Foi removido o valor predefinido fixo de 24.000 bytes; configurações explícitas passam a ser um teto dentro da margem adaptativa.
- Foi removido o limite predefinido de 40 mensagens: mensagens que cabem no orçamento continuam disponíveis.
- O helper de resumo processa conversas longas em lotes cronológicos, transportando o resumo anterior; foi removido o corte que ignorava o meio da conversa. O tempo total continua limitado e Stop continua a impedir commits tardios. Lotes adicionais podem consumir chamadas adicionais ao motor.
- Corrigidos quatro erros de tipagem preexistentes em dois testes, necessários para a verificação completa de tipos.

Verificação: testes unitários de orçamento/reconstrução/resumo, fixture de compactação com histórico/retoma/ramificações/Stop, novo cenário de pedido grande, regressões de memória/configuração/recall, testes de criação do agente e browser companion. Compilação de tipos do servidor concluída. A compactação nativa, captura semântica nos motores sem helper, preservação multimodal e comparação de qualidade com modelos reais continuam pendentes; esta etapa não declara os 18 itens concluídos.

## Conclusão e escolha recomendada

O Solar já tem compactação, memória, recuperação de sessões, pesquisa de histórico e avaliações. A melhoria com mais impacto é tornar estas peças consistentes entre motores e medir se preservam a intenção do utilizador. Acrescentar um modelo maior ou um prompt enorme não resolve sozinho a continuidade.

Recomendo manter a arquitetura local e os motores existentes. Primeiro, melhorar a gestão do contexto e o estado persistente da tarefa; depois, a memória e a qualidade das ferramentas; por fim, comparar modelos com exemplos reais. Para Codex, experimentar a compactação nativa antes de substituir sessões por resumos de texto. Para outros motores, manter uma alternativa de resumo com fontes e orçamento adaptativo.

O motor efetivamente escolhido importa: na inspeção anterior do browser, OpenCode aparecia pronto e Codex exigia início de sessão. Estas recomendações não pressupõem que todo o chat já esteja a usar Codex ou uma API OpenAI direta.

## Quatro coisas diferentes

| Camada | O que guarda | Exemplo |
|---|---|---|
| Contexto de trabalho | Informação disponível ao modelo neste momento | Pedido atual, resultados recentes e restrições |
| Compactação | Representação menor do contexto antigo | Decisões e trabalho pendente depois de uma conversa longa |
| Memória duradoura | Factos úteis entre conversas | Preferências, projetos e correções, com data e origem |
| Estado da tarefa | Progresso e identidade das operações | Objetivo, passos concluídos, ficheiros criados, ação já executada |

Compactação permite continuar, mas pode perder detalhes. Histórico guardado permite recuperar os originais, mas não significa que o modelo esteja a ler tudo. Memória não deve transformar hipóteses ou respostas antigas do assistente em factos. Nenhuma destas camadas contorna uma falha de autenticação ou um limite de utilização da conta.

## O que o Solar já faz e onde melhorar

### 1. Compactação automática: existe, com limitações relevantes

`compactConversation` verifica o contexto antes de enviar o turno. Por defeito, o limiar é 80% da janela, com um teto de 90%; usa medição do motor quando disponível e, em alternativa, uma estimativa de bytes/4. Mantém dois intercâmbios recentes e o pedido que acabou de chegar. Guarda um registo persistente sem apagar as mensagens originais. Depois reconstrói uma sessão nova quando aplica o resumo.

Existe cancelamento, proteção contra alterações concorrentes da conversa e respeito pela ramificação ativa. São propriedades a conservar.

**Limitação confirmada:** o resumo semântico depende de `generateText`. O driver Codex analisado não implementa esse helper. Nesse caminho, o Solar usa excertos determinísticos, começando pelos mais recentes, até ao limite de 6.000 bytes. Esses excertos podem omitir o objetivo antigo. Não são equivalentes à compactação nativa do modelo. Quando há helper, o texto enviado para resumo também é limitado a 60.000 bytes, preservando início e fim quando precisa de cortar.

**Escolha:** acrescentar uma capacidade explícita de compactação por motor. Quando suportada, usar a operação nativa e acompanhar o seu resultado terminal; nos restantes, criar um resumo estruturado e auditável. Não correr dois mecanismos independentes de compactação sem coordenar os seus limiares.

O app-server Codex documenta `thread/compact/start` e eventos de progresso `contextCompaction`; esse método não aparece no driver Solar analisado. A integração é uma proposta e precisa de ensaio com a versão instalada. [Documentação Codex app-server](https://learn.chatgpt.com/docs/app-server).

Fontes locais: [orquestração](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:7170), [limiares](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/context-budget.ts:17), [resumos](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/compaction-summary.ts:40).

### 2. Reconstrução de contexto: orçamento demasiado fixo

O valor predefinido de reconstrução é 24.000 bytes e até 40 mensagens; o resumo ocupa parte desse orçamento. Ao trocar de motor, recuperar uma sessão ou aplicar compactação, podem ficar de fora mensagens que caberiam na janela do modelo. Isto não significa que cada turno normal só leia 24 KB: uma sessão nativa retomada conserva o contexto do próprio motor.

**Escolha:** calcular o orçamento em tokens, a partir da janela real, descontando instruções, memória, ferramentas, anexos e espaço para a resposta. Conservar sempre o objetivo atual, correções, restrições, identificadores e operações pendentes. Recuperar detalhes antigos por pesquisa, em vez de simplesmente aumentar todos os limites.

O controlo atual ocorre antes do turno e baseia-se em utilização anterior ou texto estimado. Deve também contemplar crescimento durante ciclos de ferramentas e um pedido novo muito grande. A janela inclui entrada, saída e, conforme o modelo, tokens de raciocínio. [Gestão de conversas e contexto](https://developers.openai.com/api/docs/guides/conversation-state).

Fontes locais: [seleção e limites](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/context-rebuild.ts:25), [reconstrução no envio](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/index.ts:8259).

### 3. Janela dos modelos: privilegiar metadados reais

A ordem atual é: janela reportada pelo motor, catálogo, padrões do nome do modelo, alternativa de 128.000 tokens. A tabela de padrões não cobre todos os modelos atuais; por exemplo, não tem uma regra GPT-6. Isso não prova que o valor usado em execução esteja errado: Codex reporta a janela em eventos de utilização.

**Escolha:** guardar a origem da medição e distinguir valor confirmado de estimado. Usar catálogo/telemetria do fornecedor; padrões servem apenas de alternativa conservadora. Revalidar ao mudar motor, conta ou modelo.

Fontes: [resolução da janela](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/context-budget.ts:7), [padrões](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/model-context-window.ts:5), [telemetria Codex](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/codex.ts:1217).

### 4. Memória pessoal: já existe, mas não é igual em todos os motores

O Solar carrega as primeiras 200 linhas ou 24 KB de `MEMORY.md`. Tem tópicos, expiração, origem, diário de alterações e desfazer. Faz pesquisa automática em notas e conversas com SQLite FTS5: até quatro resultados de cada tipo, num bloco limitado. Há separação de acesso entre conversas privadas e salas.

A captura automática de factos, organização e resolução semântica de contradições dependem de `generateText`; em motores sem esse helper, só parte da manutenção automática funciona. O agente ainda pode usar ferramentas para escrever memória explicitamente. Pesquisa lexical pode falhar em paráfrases, sinónimos ou referências como «aquilo de ontem».

**Escolha:** tornar explícitas as capacidades de memória do motor; acrescentar captura compatível com o motor selecionado, sem ferramentas nem efeitos externos. Melhorar a recuperação em português e testar paráfrases. Só acrescentar embeddings se os testes mostrarem benefício; combinar pesquisa lexical e semântica preservando permissões, datas, fontes e correções. Manter os ficheiros locais como fonte de verdade e o índice reconstruível.

Fontes: [contrato da memória](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/docs/memory.md:36), [recall](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/recall.ts:1), [manutenção](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/memory-upkeep.ts:1).

### 5. Recuperação: conservar a proteção contra repetir ações

Já há classificação de falhas de retoma: só se permite replay automático quando há evidência de que o pedido ainda não foi aceite. Há watchdog para turnos sem atividade e verificação de capacidades antes de trocar para um motor de recuperação.

**Escolha:** acrescentar pontos persistentes de progresso da tarefa e classificar falhas de rede, autenticação, limites da conta, contexto e ferramenta. Retentar falhas transitórias com limites; perante aceitação incerta, reconciliar o resultado antes de reenviar. Uma mensagem enviada ou operação executada não pode ser repetida só porque o stream caiu. Validar reconexão do browser, reinício do servidor e cancelamento durante compactação.

Fontes: [recuperação da retoma](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/resume-recovery.ts:43), [compatibilidade do motor alternativo](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/automatic-recovery.ts:1), [watchdog](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/turn-watchdog.ts:1).

### 6. Ferramentas e respostas: preservar evidência, evitar ruído

Resultados grandes das ferramentas de agentes já podem ser guardados e lidos por partes. Esse armazenamento é temporário e expira, inclusive no reinício. Não deve ser a única referência de um trabalho que precise de durar dias.

**Escolha:** guardar resultados duradouros como artefactos com referências; pôr no contexto apenas os trechos relevantes. Validar argumentos e resultados, distinguir erro de ferramenta de ausência de informação, conservar evidência de ações concluídas. Avaliar descoberta seletiva de ferramentas quando o catálogo crescer. Testar comportamento de anexos e imagens depois de compactar ou trocar motor; a reconstrução textual analisada não demonstra preservação multimodal completa.

Fontes: [resultados limitados](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/agents-result.ts:1), [contexto do turno](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/turn-context.ts:1).

### 7. Instruções, parâmetros e qualidade do modelo

O driver Codex já separa instruções estáveis de memória e informação variável, preservando as primeiras na sessão. Suporta seleção de esforço de raciocínio. Conservar este contrato.

**Escolha:** criar perfis de comportamento verificáveis: resposta rápida, análise aprofundada e execução de tarefas. Usar apenas parâmetros suportados pelo motor/modelo; subir esforço conforme complexidade e resultados medidos. Não definir tudo no máximo por defeito. Medir qualidade, tempo e utilização com tarefas pessoais em português, em vez de escolher pelo nome ou tamanho da janela.

Também verificar se o histórico reconstruído conserva a distinção entre atualização de progresso e resposta final: uma atualização não deve encerrar a tarefa. A documentação OpenAI recomenda preservar `phase` nas mensagens aplicáveis e avaliar ganhos antes de elevar o esforço. Estas regras precisam de adaptação ao protocolo de cada motor. [Checklist de implementação OpenAI](https://developers.openai.com/api/docs/guides/deployment-checklist).

Fonte: [instruções Codex](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/server/drivers/codex.ts:1433).

## Comparação de opções de integração

| Opção | Vantagem | Limitação | Recomendação |
|---|---|---|---|
| Melhorar os drivers atuais e compactar nativamente quando possível | Preserva integração local, ferramentas e sessões | Exige contrato e testes por motor | Primeira escolha |
| Resumo estruturado pelo Solar | Portável e auditável | Perde informação; exige helper e recuperação das fontes | Alternativa para motores sem compactação nativa |
| Driver direto Responses | Controlo explícito do ciclo e compactação automática da API | Solar assume execução de ferramentas, eventos e recuperação | Comparar num ensaio separado, se trouxer benefício |
| Migrar toda a orquestração para outro runtime de agentes | Pode reduzir manutenção em algumas áreas | Migração grande e mudança de contratos | Não é necessária para resolver estes problemas primeiro |

A Responses API suporta compactação automática por `context_management`/`compact_threshold` e compactação explícita. O resultado é um item opaco de estado, não um resumo legível. Não se deve substituir esse item por texto, nem aplicar parâmetros Responses diretamente ao RPC Codex. [Compactação OpenAI](https://developers.openai.com/api/docs/guides/compaction).

A documentação atual também descreve inferência Responses com OAuth autorizado para utilização do plano ChatGPT. A elegibilidade, registo e limites dessa integração devem ser verificados antes de a escolher para Solar; não se deve assumir que um token existente pode ser reutilizado livremente. Uma opção com chave API também exige decidir a sua configuração e custos. A recomendação atual não depende de mudar a forma de autenticação. [Modelos e inferência com ChatGPT](https://developers.openai.com/siwc/token-sharing-open-source/models-and-inference).

Foi também comparada a abordagem Anthropic: a API Claude disponibiliza compactação a pedido e por limiar, atualmente em beta, com contratos próprios para preservar turnos recentes. Estas opções pertencem à API e não são parâmetros que se possam aplicar diretamente ao driver Claude CLI existente. Manter a memória e as fontes fora do resumo continua a ser necessário. Não acrescentar um segundo serviço de memória só para duplicar os ficheiros e pesquisa locais do Solar. [Compactação Claude](https://platform.claude.com/docs/en/build-with-claude/compaction).

## Lista de trabalho por prioridade

Todas as linhas abaixo são propostas, não trabalhos concluídos. P0 = continuidade e base de medição; P1 = qualidade e personalização; P2 = otimizações dependentes de resultados.

| ID | Prioridade | Trabalho | Critério de conclusão |
|---|---|---|---|
| AI-01 | P0 | Comparar compactação nativa e resumo Solar | Após vários ciclos, conserva objetivo e correções sem repetir ações |
| AI-02 | P0 | Orçamento em tokens com margem para saída e ferramentas | Pedido/anexo grande e crescimento num turno não causam falha por limite |
| AI-03 | P0 | Reconstrução adaptativa com referências | Troca de motor e reinício mantêm decisões e detalhes recuperáveis |
| AI-04 | P0 | Estado persistente da tarefa | Retoma sabe o que falta e o que já aconteceu |
| AI-05 | P0 | Reconexão e falhas com reconciliação | Queda após aceitação não duplica mensagens ou ações |
| AI-06 | P0 | Avaliações de continuidade e qualidade | Relatório antes/depois com casos determinísticos e casos de modelo real |
| AI-07 | P1 | Captura de memória compatível com os motores utilizados | Factos confirmados persistem; hipóteses não viram factos |
| AI-08 | P1 | Correções, expiração e eliminação de memória | Informação corrigida não reaparece como atual |
| AI-09 | P1 | Melhorar recall em português | Recupera paráfrases e fontes, sem atravessar permissões |
| AI-10 | P1 | Instruções pessoais e perfis de esforço | Melhor qualidade em tarefas difíceis sem atrasar todas as respostas |
| AI-11 | P1 | Ferramentas com resultados verificáveis e duradouros | Artefactos continuam acessíveis depois do reinício |
| AI-12 | P1 | Preservação de anexos e referências multimodais | Contexto retomado consegue reencontrar a imagem/documento relevante |
| AI-13 | P1 | Pesquisa atual e citações verificáveis | Afirmações externas remetem para fontes que as sustentam |
| AI-14 | P1 | Progresso, interrupção e novas instruções | Correção durante execução é aplicada; progresso não fecha tarefa |
| AI-15 | P1 | Instrumentação local | Mede compactações, perdas, latência, erros e utilização sem guardar segredos |
| AI-16 | P2 | Pesquisa híbrida com embeddings, se necessária | Supera baseline lexical com custo e latência aceitáveis |
| AI-17 | P2 | Comparação/routing de modelos | Escolha melhora resultados e respeita seleção e capacidades |
| AI-18 | P2 | Descoberta seletiva de ferramentas e cache | Reduz contexto/latência sem piorar a seleção de ferramentas |

## Como provar que ficou melhor

Já existem avaliações offline do harness, traces golden e uma via opt-in com modelos reais. Também há testes de compactação, memória, ramificações e recuperação. Expandir esta infraestrutura; não criar um sistema paralelo sem necessidade. [Avaliações existentes](C:/Users/duart/Documents/ChatGPT/jarvis/orbit-app/evals/README.md:1).

Conjunto inicial proposto: 30 casos com correções tardias, cancelamentos, identificadores exatos, tarefa longa, paráfrases em português, conflito de memória, instruções maliciosas em conteúdo recuperado, ficheiros/imagens, troca de motor, falta de rede e queda após uma ação. Medir retenção de factos críticos, conclusão da tarefa, relevância das fontes, ações duplicadas, latência e consumo. Os casos de efeitos externos devem usar ferramentas simuladas e dados isolados. Comparações reais devem registar modelo, versão, configuração e repetição; um único resultado bom não estabelece superioridade.

Proposta de gate: nenhuma ação duplicada nos cenários de falha simulados; todas as correções críticas preservadas nos casos determinísticos; comparar qualidade de modelos em várias repetições e revisão humana. Os limiares finais de qualidade devem ser calibrados com os teus exemplos, não importados de um benchmark genérico.

A orientação oficial recomenda avaliações específicas e contínuas. Não recomendo construir uma dependência nova no serviço OpenAI Evals: a documentação consultada anuncia a sua descontinuação em novembro de 2026. A infraestrutura local existente permite continuar a avaliar sem essa dependência. [Boas práticas e aviso de descontinuação](https://developers.openai.com/api/docs/guides/evaluation-best-practices).

## Limites desta análise

Foram inspecionados código, contratos, testes existentes e documentação oficial atual. Não foram executadas conversas pagas, alteradas memórias do utilizador nem feitas experiências de compactação na sessão real. A existência de testes no repositório não significa que tenham sido executados nesta análise. Reconexão, anexos, qualidade semântica e compatibilidade da compactação nativa ficam como verificações necessárias em ambiente isolado. As limitações identificadas são do código e dos contratos; não são relatos de falhas observadas numa conversa real.
