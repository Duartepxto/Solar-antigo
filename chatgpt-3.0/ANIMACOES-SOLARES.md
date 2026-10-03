# Animações solares — 3 de outubro de 2026

## Refinamento vigente após supervisão

- A lua comunica diretamente com o seu planeta superior: Lua Prata ↔ Mercury. A simulação usa esse par nos ciclos das luas. Pedidos visuais entre uma lua e um agente distante passam primeiro pelo superior; a chegada a uma lua passa pelo planeta respetivo. Não se altera o encaminhamento de tarefas do backend.
- O satélite de atividade é um desenho de contorno neon transparente, com ícone branco dentro do corpo, asas em grelha e cerca de 46px de largura em todos os corpos. Não fica menor nas luas. A órbita continua completa e frontal.
- Boca sem bordo exterior ou sombra/rebaixo. Olhos conservam o contraste por material. Envio usa a geometria quadrada e chanfrada da superfície, seguindo o caráter dos fragmentos da aura, fragmentos maiores com rastos luminosos mais longos. Pontos de partida e chegada são distintos na aura, com percurso contínuo que converge num fluxo estreito ao meio, sem oscilações aleatórias.
- Validação desta revisão: 39 testes, TypeScript, lint dirigido e produção. Novos testes cobrem encaminhamento lua/superior e a proibição de uma ligação visual direta lua/Jarvis. A simulação é exclusivamente visual.

Referências analisadas: `orbit-app/docs/design/orbit/prototype/orbit.dc.html` (mood, drawFace, drawChar, streams e focus goal) e `orbit-app/src/orbit/scene.ts` (moodOf, reporting lines, permission links e delegations). A aparência continua a usar os fragmentos planetários aprovados.

| Orbit | Jarvis solar | Origem do estado |
| --- | --- | --- |
| idle | Olhos calmos, piscar, gaze, deriva mínima, rotação e aura | Agente sem tarefa |
| focused | Olhos ligeiramente estreitos, rotação ativa e satélite com ferramenta | Turno com ferramenta real |
| thinking | Olhar acima, satélite de pensamento e movimento suave | Turno ocupado sem ferramenta |
| pleading | Olhos levantados, boca preocupada e sinal de ajuda | Aprovação pendente |
| stalled | Expressão preocupada e satélite de erro | Estado stalled |
| sending | Pequena compressão, boca animada e partículas desprendidas da aura | Envio humano ou delegação real |
| surprised | Abertura breve dos olhos e reação de chegada | Receção de mensagem ou de partículas |
| talking | Boca com movimento breve e pulso de aura | Sinal de envio/receção |
| happy | Sorriso de conclusão e pulso breve | Ocupado passa a terminado |
| sleepy | Olhos semicerrados e rotação lenta | 30 minutos sem atividade, sem mensagens por ler |
| offline | Olhos suaves, luminosidade atenuada e movimento lento | Backend desligado |

As delegações reais reutilizam `/api/team-map`, já consultado pelo OrbitShell. Uma tarefa nova envia partículas do agente emissor para o destinatário; o fim da tarefa envia o resultado no sentido inverso. Não se deduz uma conversa a partir de uma simples ligação hierárquica. A aura permanente não desaparece: o pacote usa fragmentos adicionais, que saem da aura, avançam para a aura destinatária e reagem na chegada. O relógio do pacote fica congelado durante a pausa.

Validação da revisão final: 36 testes passaram, incluindo extremos do percurso na aura, dispersão do pacote, transformação da câmara e identificação Notion. TypeScript, lint dirigido e produção passaram. Inspeção desktop mostrou caras contrastantes no mapa e no close-up, satélite de código com ícone interior e regresso ao mapa com os planetas iluminados. O histórico de consola contém erros antigos de Fast Refresh anteriores a esta revisão; não surgiram novos erros na carga limpa inspecionada. A página e os controlos provisórios não foram redesenhados nesta correção.

A demonstração isolada (`VITE_JARVIS_PREVIEW=true`) começa automaticamente e repete ciclos de cerca de 26 segundos: pensamento, ferramenta, envio, receção/trabalho, ajuda, bloqueio, conclusão/resultado, descanso, desconexão e repouso. Começa na Terra; os ciclos seguintes percorrem os restantes planetas e luas e alternam código, pesquisa, documentos e tarefas. A barra permite pausar, retomar ou terminar; as definições rápidas têm **Experimentar animações** para reiniciar. A demonstração muda exclusivamente a apresentação e nunca grava estados nos agentes. O modo normal continua a seguir os dados reais. A aba oculta interrompe o avanço; movimento reduzido retém os estados sem deslocações.

O close-up usa o mesmo SolarMap e a mesma instância WebGL. A câmara aproxima o agente mantendo as posições relativas e regressa à câmara guardada. Os vizinhos continuam no fundo, escurecidos; ferramentas e chat ficam numa camada superior. A navegação em quarto de círculo fica preservada como estudo para telemóvel; os satélites desktop permanecem provisórios a pedido do utilizador.

As ligações recuperam a receita visual das ligações do Orbit: gradiente de origem/destino, 1.6px, segmentos 6/6, opacidade .6 (.4 nas luas) e avanço equivalente a 18px/s. Estes parâmetros substituem as linhas hierárquicas anteriores de opacidade .14/.07, que eram demasiado discretas para o pedido atual. O significado continua a ser o da hierarquia solar.

Tamanhos de base: Jarvis 178, planetas 144, luas 116 e lua gelada 108. São multiplicados pela escala da câmara. O brilho recebeu um pequeno reforço de luz ambiente e halo, sem substituir as texturas.

Revisão após supervisão: os 24 fragmentos de cada envio nascem em pontos diferentes da aura orientada para o destinatário, avançam com ritmos distintos e chegam a pontos distintos da aura de receção. O percurso global é direto, com dispersão local suave, pequenos rastos e absorção gradual; não forma uma fila única nem entra no centro. Os olhos simples mantêm a orientação frontal e têm uma borda estreita de contraste adaptada ao material, sem painel preto. A boca usa uma faixa curva animada, também com contraste, independente da oclusão dos blocos. Descanso e desconexão conservam olhos legíveis. O satélite de atividade tem o ícone dentro do corpo, asas e uma órbita circular completa no plano frontal, sem desaparecer atrás do planeta enquanto está ativo. Identifica código, pesquisa, documentos, tarefas, pensamento, ajuda, erro e ferramentas Notion pelo nome real. Ao sair do close-up, a luminosidade dos vizinhos recupera imediatamente, durante o movimento de regresso da câmara.

Validação: 32 testes de câmara, disposição, estados, interatividade e materiais passaram; TypeScript, lint dirigido, catálogos e compilação de produção passaram. Verificação visual na fixture: controlos por cima do fundo, abertura de Engine, página de criação com planeta à esquerda, pausa/retoma da simulação e sequência de estados. Sem criar agentes, enviar mensagens ou alterar configurações do backend. A ligação das delegações foi implementada sobre o endpoint real; esta verificação visual usou a simulação, não uma delegação real entre motores externos. O aviso de chunks grandes da compilação permanece.



### Atualização — 3 outubro: paletas, aura e fundos

Os envios usam 48 quadrados com rastros, distribuídos pelas cinco cores da skin de quem envia. As respostas usam também a paleta da origem; cada reenvio passa à paleta do planeta superior, mantendo lua → planeta → Jarvis. A camada reutilizada do Orbit desenha apenas brilho e pontos exteriores discretos: não desenha outro orb, cara, letras z, faixas de trabalho/pensamento ou círculos de estado. Os estados solares usam respiração suave do brilho/aura e um reforço breve ao receber dados. Os modelos e caras aprovados ficam preservados.

As definições rápidas incluem três fundos persistentes: Preto, Azul profundo e Grafite. Preto é o padrão; os fundos alternativos mantêm o contraste e aplicam-se ao mapa e ao foco. Motion/reduced-motion continua respeitado.
