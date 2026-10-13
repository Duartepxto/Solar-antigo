# Solar: pedidos sucessivos e preparação para teste — 10/10/2026

## Comportamento que deve ser previsível

Um pedido novo, uma correção ao pedido atual e uma tarefa para depois têm
intenções diferentes. Não convém pedir a um modelo auxiliar que classifique
cada mensagem: isso acrescenta latência e consumo e pode interpretar mal uma
correção. O runtime deve oferecer ações explícitas e conservar recibos.

| Situação | Contrato atual observado no código | O que preservar |
| --- | --- | --- |
| Conversa livre | Inicia um turno com a conversa fixada | Trocar de ecrã não muda o destinatário |
| Agente a trabalhar | Tenta steering se o motor o suporta; caso contrário põe em fila | Não parar o trabalho para aceitar uma simples mensagem |
| Mensagem com imagem | Aguarda um turno com admissão nativa do anexo | Não transformar um anexo numa referência textual incompleta |
| Colegas em execução | Nova mensagem conserva as atribuições; parking pode ser escolhido | O coordenador não volta a enviar o mesmo trabalho |
| Capacidade ocupada | Fila com motivo e posição | Não perder os pedidos nem criar concorrência sem limite |
| Mensagem em fila | Editar só recupera o texto após cancelamento confirmado | Não reenviar algo que já começou a ser processado |
| Clique Stop | Atua na conversa fixada | Não interromper outras conversas/colegas por associação |
| Ligação perdida e retry | `sendId` recupera o recibo canónico | Não criar outra mensagem nem outro custo |
| Reinício | Filas pendentes persistem; dispatch ambíguo não é repetido às cegas | Distinguir confirmação de entrega de uma promessa de exactly-once |

A fila junta apenas o grupo contíguo do mesmo autor/proveniência dentro da
janela definida. Isto reduz chamadas para uma mensagem escrita em partes,
mas não demonstra que todos os pedidos semanticamente independentes devam
ser unidos. Uma evolução possível é permitir «fazer depois» explicitamente,
com fronteira de tarefa, sem depender de heurísticas de linguagem.

## Defeito corrigido nesta revisão

O bloqueio mensal acontecia antes da procura de recibos. Uma mensagem aceite
que atingisse o limite tornava impossível confirmar a própria entrega por
retry: o cliente recebia 409 `spend_cap` apesar de o trabalho já ter ocorrido.

A verificação de orçamento passa a acontecer depois de procurar a mensagem
ou entrada de fila já aceite. Aplica-se a chats e canais. Uma identidade nova
continua bloqueada antes de iniciar, pôr em fila ou tentar steering. A
autorização, validação de identidade e propriedade da conversa continuam a
acontecer antes de devolver qualquer recibo. O início do turno mantém a sua
própria verificação do limite.

O cenário foi reproduzido em servidor descartável antes da alteração (retry
devolvia 409) e verificado depois, incluindo contagem de turnos e custo.
Logs locais: `orbit-app/workflow-receipt-before.log` e
`orbit-app/workflow-receipt-final.log`.

## Referências e comparação

- [Cursor: Agent overview](https://cursor.com/docs/agent/overview): distingue
  steering de follow-ups que aguardam o fim do trabalho.
- [VS Code: chat](https://code.visualstudio.com/docs/chat/chat-overview):
  documenta fila, steering e controlo de mensagens pendentes.
- [Claude Code Desktop](https://code.claude.com/docs/pt/desktop): separa
  sessões e oferece acompanhamento do trabalho em curso.

Estas referências ajudam a avaliar o fluxo; não justificam copiar a
interface ou garantir comportamento de um fornecedor sem o verificar.

## Instalação e fluidez

O utilizador confirmou que pretendia a versão mais recente com as melhorias
de hoje. A análise das transições do sol deve seguir a atualização e a sua
confirmação do sintoma. Não foi alterada a animação nesta etapa: primeiro
precisamos de distinguir binário antigo, bloqueio do renderer e trabalho de
renderização excessivo. A revisão funcional completa continua em curso.

### Atualização instalada

- Instalador: `orbit-app/release-solar/current-2026-10-10/Solar-0.2.2-20261010-setup.exe`.
- SHA-256: `AFE03CE059F8F86B63029C00A608D8FD6C04E90D0135E90C74FBDAA497038474`.
- Instalação terminou com exit code 0; Solar foi reaberto.
- A versão continua identificada como 0.2.2, mas o build instalado é de
  10/10/2026, 14:57 em Lisboa. O anterior era de 09/10/2026, 12:39.
- Os hashes de `app.asar`, `server/index.js` e `ui/index.html` instalados
  coincidem com o pacote produzido.
- O smoke do backend empacotado passou fora do repositório: arranque,
  onze proxies, MCP, worker de backup encriptado e camada enterprise.
- Os cenários de retry no chat/canal e bloqueio de novos pedidos passaram.
  Não foi enviado trabalho a modelos reais para esta verificação.

A confirmação do utilizador sobre a transição do sol permanece pendente.
