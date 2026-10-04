# Solar — plano de design

Atualizado em 2 de outubro de 2026. Registo da direção atual; as propostas futuras não contam como funcionalidades implementadas nem como validação visual.

## Base existente a preservar

- Página principal solar sobre o frontend e backend do Solar aprovado: Jarvis é o Sol, líderes são planetas e membros são luas, com nomes, funções e hierarquia provenientes dos dados reais.
- Astros 3D com volume reconhecível, partículas biseladas, cores de superfície e caras integradas no material. Preservar o realismo e o volume aprovados.
- O afundamento local provocado pelo rato foi apreciado: manter o efeito limitado, o regresso suave e a superfície sempre fechada, sem dispersar o astro.
- Já existem deslocação dos corpos, planeta a transportar as suas luas, posições guardadas, desfazer, zoom e abertura das conversas. A qualidade do gesto de arrastar terá uma fase própria.
- Preservar a marca Solar e os detalhes atuais do cabeçalho, sistema, agentes, planetas e pré-visualização. Manter fundo preto e controlos discretos com estética Apple/liquid glass. Conservar o chat e os controlos inferiores, bem como a pesquisa, definições e adição no cabeçalho.

## Coleção atual — sistema solar completo

O pedido seguinte alargou o ensaio do Sol a todos os modelos. O utilizador escolheu mostrar os oito planetas ao mesmo tempo no mapa de demonstração.

- Sol, oito planetas e cinco luas com partículas biseladas, materiais distintos e caras em cavidades da própria superfície.
- Mais partículas luminosas à volta de cada corpo, afundamento local com o rato e atraso limitado de fragmentos durante o arrasto.
- Ligações retas com gradientes de cor, sem círculos orbitais do sistema.
- Pré-visualização isolada com 14 agentes temporários e motor simulado; o lançamento persistente usa os agentes reais existentes.
- Pequenas definições de movimento, rato, partículas, ligações e brilho; menu de criação com ícones e descrições; botão de teclado junto ao envio para focar a escrita.

A coleção está em afinação visual. A experimentação do utilizador continua a orientar os próximos ajustes.

O refinamento seguinte acrescenta duas escalas de partículas: blocos maiores elevados e separados, sobre partículas pequenas recuadas. Há quatro vezes mais fragmentos circundantes, com coroas, faixas inclinadas, nuvens e agrupamentos próprios de cada material. O rato afunda a superfície até 17% do raio e provoca um movimento lateral local com regresso suave. Os olhos têm pupilas e reflexos. Passar sobre um astro destaca as suas ligações e provoca uma resposta de olhar e aura nos seus pais/filhos. A máscara retangular das etiquetas foi removida; a leitura usa sombras suaves nos próprios caracteres. O movimento das linhas depende dos sinais de atividade existentes, não de conversas inventadas.

## Próximas fases, por ordem

1. **Caras por skin:** continuar a afinar a leitura e as expressões a partir da coleção completa. As lentes e a boca já são animáveis e seguem os estados de trabalho, espera e bloqueio.
2. **Agarrar, arrastar e largar:** estudar o gesto do Solar, com seguimento por mola e atraso das partículas ponderado pela velocidade e profundidade. Preservar a disposição, a forma dos astros, o transporte das luas pelo planeta e o desfazer.
3. **Luas:** as cinco variantes já estão no mapa, com nomes e uma área de interação mínima de 44 px. Afinar os seus papéis, a escolha de aparência e a apresentação conforme a experimentação do utilizador.
4. **Comunicação e atividade:** ligar animações a dados reais de receção, envio, trabalho, conclusão, pedido de ajuda e erro. Um fim de atividade não pode ser apresentado como sucesso confirmado sem evidência do resultado.
5. **Ligações entre agentes:** permitir mais tarde ligações arbitrárias num grafo explícito. A hierarquia simples e real já deve ficar visível através das linhas retas desta fase.
6. **Controlos e criação:** as definições rápidas, o menu e o botão de escrita já estão nesta página. Afinar o comportamento e as restantes páginas posteriormente; ditado continua por implementar.

## Âmbito

Concluir primeiro a página principal. Conversas e páginas secundárias ficam para uma fase posterior. Reutilizar o backend e os motores do Solar; mostrar claramente os estados reais e distinguir a pré-visualização com motor simulado da execução persistente.

## Refinamento de movimento e expressões — 2 de outubro

Este pedido substitui as pupilas/reflexos, o destaque das ligações ao passar o rato e o botão de teclado descritos acima.

- Olhos simples luminosos, sem pupilas, e boca mais calma; cavidades partilhadas pelo núcleo e pelos fragmentos. Pestanejos, olhar, inclinação e boca animam com transições suaves.
- Rotação completa contínua: Terra a cerca de uma volta em 33 segundos; restantes planetas a cerca de 48 segundos. Movimento vertical discreto, aura a respirar e detritos a orbitar. Pausa, movimento reduzido e página oculta suspendem a animação decorativa.
- Estados provenientes dos agentes: disponível, a pensar, a trabalhar com uma ferramenta, à espera de ajuda, bloqueado e desligado. Pensamento usa três pontos num pequeno satélite; código usa sinais de código; pesquisa usa uma lupa; documentos usam linhas; ajuda usa interrogação e bloqueio um aviso. A categoria é inferida da ferramenta atual, não do nome do planeta.
- Envios e novas mensagens do assistente geram grupos de 12 fragmentos que percorrem a ligação à origem/pai. A aura existente permanece. Estes percursos visualizam o evento na hierarquia atual, não provam delegação entre agentes. O fim da atividade produz um pulso neutro, sem afirmar sucesso.
- Traços brancos discretos como o Solar (opacidade 0,14 entre Sol/líder e 0,07 para luas), sem destaque de hover.
- Seletor com pesquisa, nomes, aparência, estado, navegação por teclado e miniaturas capturadas do próprio renderer. O campo de mensagem usa a mesma miniatura.
- Ditado real para o rascunho: macOS nativo ou SpeechRecognition do browser, com parar, revisão e erros de permissão/suporte/rede. Resultados provisórios substituem o sufixo da sessão sem duplicar palavras nem perder o texto já escrito. Nunca envia automaticamente. Sem gravação física durante a verificação; disponibilidade e serviço dependem do browser.

Próximas ideias: satélites específicos para resultados e pedidos de aprovação, trajetórias em grafos explicitamente editáveis e expressões de sucesso apenas quando o resultado real o confirmar. Estas ideias ainda não estão implementadas.

## Caras legíveis, aura circular e anéis — refinamento seguinte

- Os olhos cresceram, sobretudo nas luas; uma zona de material escurecida suavemente, partilhada pelo núcleo e fragmentos, reduz o ruído de superfície na cara. A boca usa uma luz do próprio material. Terra, Neptuno e Lua Vulcânica recebem menos escurecimento que os materiais claros. Não há uma imagem de cara sobreposta.
- Partículas circundantes reduzidas em cerca de 84%: 49 no Sol, 22–29 por planeta e 16–20 por lua. Distribuição circular em todos os materiais, com brilho suave; a Terra deixa de ter uma faixa inclinada parecida com um anel. O número de fragmentos da superfície não muda.
- Os anéis de Saturno e Urano rodam no seu plano; cada partícula tem oscilação discreta e deslocamento local com o rato. A aproximação é detetada até à zona exterior do anel e regressa suavemente. Urano tem o anel mais visível. Pausa, movimento reduzido e página oculta suspendem estes efeitos.
- Rotação do corpo e partículas ligeiramente acelerada; deslocação vertical do corpo limitada a 1,2 px.
- Ligações reproduzem os parâmetros de scene.ts do Solar: largura 1,2; cor --color-ink; opacidade 0,14 / 0,07; afastamento 1,3 raios do Sol e 1,2 dos agentes; segmentos sobrepostos não são desenhados. A espera usa #ff9800 com opacidade 0,6 e, nas luas, acrescenta a ligação de aviso ao Sol mantendo a ligação normal ao líder. Sem transição CSS adicional nem iluminação de hover.

## Caras sem máscara e flutuação suave — 3 de outubro de 2026

Retirada a zona escura que cobria a cara. Olhos e boca passam a usar tons escuros nos materiais claros e luminosos na Terra, Neptuno e Lua Vulcânica, com cavidades menos sombreadas nas superfícies claras. Continuam a fazer parte da geometria e do material, sem decalques.

Flutuação automática com amplitudes até 1,8 px na horizontal e 2,8 px na vertical, mais uma resposta suave até 1,4 px à aproximação do rato. Durante o arrasto esta flutuação suspende-se; as posições guardadas não são alteradas. Pausa, movimento reduzido e página oculta continuam a suspender a animação.

Aura esparsa com distribuição circular mais irregular, profundidades e tamanhos variados, diferenças suaves de brilho, rotação com inclinação oscilante discreta e maior reação local às passagens do rato. O número de partículas e os anéis reais de Saturno/Urano mantêm-se.

## Aura próxima, olhar e vidro — 3 de outubro de 2026

A aura de todos os corpos tem agora 1,15 vezes a contagem de base (antes 0,65): aproximadamente 77% mais fragmentos, incluindo as cinco luas. A faixa radial passa de 1,14–1,70 para 1,09–1,39 no Sol, e de 1,14–1,62 para 1,09–1,34 nos restantes corpos. Fragmentos ligeiramente maiores, emissão mais forte e opacidade elevada dão presença sem alterar os anéis reais. A oscilação e a atração local foram reduzidas para manter a aura perto da superfície.

Os olhos seguem a direção do rato em todo o mapa, com interpolação exponencial e deslocamento limitado a 0,065 / 0,05 do raio nos eixos horizontal / vertical. As cavidades esculpidas acompanham as lentes; a boca mantém a posição. Ao sair do mapa, o olhar regressa suavemente ao estado neutro. Pausa, movimento reduzido e preferência de interação continuam a limitar este movimento. Não há novos eventos de atividade simulados.

Primeiro tratamento de liquid glass: brilho fino no rebordo, reflexos suaves, transparência e blur limitado aos controlos flutuantes, compositor e menus. O mapa mantém o fundo preto e a disposição escolhida.

Verificação: lint do renderer sem avisos; build de produção Vite passou. Inspeção desktop 1196×930 e móvel 390×844; comparação visual do olhar com o rato em duas posições; menus abrem e fecham. Sem avisos/erros THREE observados. A disposição personalizada pode continuar a sobrepor corpos no telemóvel. Não alterámos posições nem o backend.

## Vistas solares e satélites interativos — 3 de outubro de 2026

O zoom segue o ponto sob o rato, com limites iguais aos do Solar (0,12–3,2). Os corpos têm escala proporcional, sem mínimos visuais independentes; os alvos DOM conservam o mínimo acessível. O culling das malhas com deslocamento por shader foi desativado para evitar desaparecimento integral na margem. O mapa permanece montado e pausado ao abrir um agente, preservando a câmara no regresso; alterações de dimensão continuam a reajustar o enquadramento.

A identidade é centralizada em SolarIdentityProvider e OrbitFace: cabeçalhos, mensagens, listas, calendário, rotinas, equipas, utilização e restantes chamadas partilham o mesmo planeta ou lua atribuído no mapa. Instâncias fora do shell usam a ordem guardada. Agentes ausentes recebem uma lua neutra. O guia usa o Sol. A antiga cena Solar fica invisível e suspensa nas vistas Jarvis.

O utilizador rejeitou a primeira composição convencional em lista. A composição desktop vigente é uma constelação de satélites de ferramentas: ícones reais sobre núcleos de vidro com pequenas asas, organizados em ramos assimétricos. As linhas são uma composição de navegação, não dependências de execução. O planeta continua no centro, com a face e aura aprovadas. Cada satélite abre o painel real, reage ao hover/seleção e pode ser arrastado. As posições normalizadas ficam em jarvis.solar.system-layout.v1.<agente>, exclusivamente locais, com reposição. Arrastar não abre o painel; cancelar restaura a posição anterior. O movimento decorativo respeita a preferência e reduced motion. Clicar no espaço vazio regressa ao mapa.

O chat mantém mensagens, anexos, modelos, aprovações e os restantes controlos existentes, numa coluna de vidro. Os cabeçalhos e os ícones dos painéis passam a seguir o mesmo material. A nova direção de telemóvel fica adiada a pedido do utilizador; mantém-se o acesso compacto existente.

Verificação: 13 testes de câmara/organização passaram; lint e TypeScript passaram. Inspeção de zoom 320% manteve a Terra visível e conservou 320% depois de abrir/fechar o agente. Arrasto de Computer observado de (103,353) para (132,328), sem abertura de painel; a posição manteve-se após sair e voltar. Reposição e abertura do painel Engine verificadas. Não houve envio de novas mensagens nem alteração de configuração do backend. A CLI 21st não está instalada neste ambiente; reutilizaram-se os componentes e os dados existentes em vez de instalar dependências.

### Atualização vigente — 3 de outubro de 2026
O close-up desktop usa o próprio mapa e conserva os vizinhos nas posições guardadas. Ferramentas ficam acima do fundo escurecido; a constelação atual de controlos não é arrastável e permanece provisória. O quarto de círculo fica reservado ao estudo mobile. Chat sem cartão exterior e edição preservada. Jarvis 178, planetas 144, luas 116 e lua gelada 108. Animações, simulação contínua pausável, partículas entre auras e validação final de 36 testes estão documentadas em ANIMACOES-SOLARES.md. Esta atualização substitui as descrições anteriores de navegação desktop e tamanhos.

