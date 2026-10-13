# Solar: mobile e notch do PC

Previews independentes: `Solar.html` (PC), `Solar-entrada.html` (apresentação de seis passos), `Solar-mobile.html` (mobile) e `Solar-notch.html` (companion do PC). Recursos incluídos; o nome do ficheiro escolhe a superfície. Todos usam dados sintéticos e bloqueiam ligações externas.

## Mobile

Mapa vertical com o Sol, dois planetas e quatro luas. Seleção do agente, nome independente da skin e detalhes consistentes com o PC. Conversa com rascunho por agente, anexo demonstrativo, envio e interrupção; o composer e a navegação ficam no fundo. Agenda com criação, edição e remoção de eventos. Atividade com resultados, autorização, recusa, falha, recuperação, computador offline e cenas de voz. Os pedidos offline permanecem em espera. Histórico limitado a 24 notificações.

O modelo mostrado no chat acompanha a seleção. As estatísticas das respostas simuladas estão identificadas como simulação; interrupções não recebem métricas inventadas. Os menus têm foco inicial, ordem de tabulação contida e devolução do foco ao controlo que os abriu.

## Notch do PC

Superfície compacta à direita, expansível para atividade, decisão ou conversa. `Alt+T` abre/recolhe dentro desta página; `Esc` recolhe. Há estados de trabalho, aprovação, conclusão, falha, ligação indisponível e voz animada. Movimento reduzido é respeitado. O seletor de estado permite verificar cada cenário.

A mudança de largura é limitada à notch absoluta de 256–420 px; não reorganiza o documento. O detector visual assinalou essa transição e a revisão independente aceitou-a para este preview.

## Referências estudadas

- [Apple Live Activities](https://developer.apple.com/design/human-interface-guidelines/live-activities): hierarquia compacta/expandida e continuidade.
- [Notchy: notificações na notch](https://notchy.dev/mac-notification-center-notch/): alertas e atividades numa superfície compacta com acesso ao contexto.
- [Android: notificações](https://developer.android.com/design/ui/mobile/guides/home-screen/notifications): ações relevantes, agrupamento e ligação ao conteúdo correspondente.

O código dos companions e as animações foram escritos para Solar. Os materiais dos planetas vêm do Solar antigo.

## Verificação

PC: painéis de motor, aprovações, competências, memória, utilização, aplicações/MCP, rotinas, aspeto, telemóvel, trabalho e agenda; editor e pré-visualização HTML; envio durante atividade e interrupção; amostra da voz portuguesa instalada. Corrigidas legendas cortadas, contador de rotinas, seleção real de voz e botão de interrupção escondido por CSS.

Mobile: mapa em 390 × 844, conversa em 360 × 780, nomes das luas separados, composer no fundo, troca de modelo, ciclo de eventos demonstrativos, recusa de autorização e pedido offline. Notch: aprovação, conversa e `Alt+T`. Intro: seis passos e três cenas percorridos sem ativar microfone nem emparelhamento.

Testes locais: 512 ciclos com histórico limitado, oito estados do mapa, transferências com a cor do emissor, ondas suaves, geometria finita, agenda/recorrência, delimitação das execuções, recusa/recuperação, interrupção, restauro da conversa, modelo consistente e memória isolada por agente.

## Limites e continuação

Ainda são previews HTML: sem teste num telefone físico, notificações push, Live Activities nativas de iOS, overlay/atalho global de Windows ou ligação ao backend. A voz animada não capta o microfone. Importação externa exige o backend; o preview mostra essa limitação.

Depois da aprovação do design, manter o pedido anterior: comparar funcionalidades reais das referências e implementar os gaps no Solar V0, preservando o design aprovado e sem importar código privado do competidor.
