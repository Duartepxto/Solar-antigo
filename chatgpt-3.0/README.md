# Solar — aplicação local

A entrada ativa inicia o frontend e o backend do Solar aprovado em `../orbit-app`. A pasta mantém o nome de trabalho anterior `chatgpt-3.0`.

## Arranque

Com Node.js 24+ e as dependências de `orbit-app` instaladas:

```powershell
cd C:\Users\duart\Documents\ChatGPT\jarvis\chatgpt-3.0
node run.mjs
```

Frontend: http://127.0.0.1:5200. Backend: http://127.0.0.1:8809; webhook: 8810. Dados persistentes: `.data/`. Para outras portas, definir `CHATGPT3_UI_PORT` e `CHATGPT3_API_PORT`. A aplicação usa os motores e autenticações que o Solar detetar; não configura credenciais novas.

## Página principal solar

O Sol representa o Jarvis. Cada equipa fornece um planeta principal; os restantes membros aparecem como luas. Mercúrio, Vénus, Terra, Marte, Júpiter, Saturno, Urano e Neptuno são identidades visuais, sem alterar nomes ou funções dos agentes. As cinco luas variam entre prata, gelo, vulcânica, areia e crateras. O mapa deriva do estado real do backend, sem equipas fictícias no lançamento persistente.

Os astros são objetos 3D estilizados, construídos com partículas quadradas visíveis, biseladas e de relevo moderado. Campos procedurais e mapas de superfície fornecem cores aos fragmentos; não são aplicados como fotografias a uma esfera. O Sol usa padrões procedurais âmbar; a Terra mantém oceanos e continentes, Saturno tem anéis de partículas e Marte usa tons ferrugem. Cada skin tem um perfil próprio de olhos, inclinação, luz, cavidade e boca. Pequenas lentes 3D curvas ficam encaixadas nas aberturas esculpidas; a boca é um sulco animável da superfície. Não há uma imagem de cara sobreposta. Pestanejos e transições suaves acompanham trabalho, espera e bloqueio reais; as caras não afirmam sucesso de uma tarefa.

O rato dirige ligeiramente o olhar e afunda os fragmentos próximos, com regresso suave. O efeito fica limitado a 17% do raio e mantém o volume fechado do planeta; não dispersa partículas. A deteção usa eventos nativos no palco, sem atualizar o estado React a cada movimento. Toque mantém o arrasto existente. Movimento reduzido desliga o afundamento e o olhar móvel. Um único contexto WebGL renderiza a cena, com rotação contínua e partículas a orbitar. Three.js 0.186.1 está incluído com licença MIT em `orbit-app/src/orbit/vendor/`. Os mapas de cor de Solar System Scope têm atribuição CC BY 4.0 em `orbit-app/public/solar/textures/CREDITS.md` e no rodapé.

Arrastar um planeta transporta as suas luas. Cada corpo também pode ser movido sozinho. As setas movem o corpo focado; Shift aumenta a distância. As posições ficam guardadas no browser. Ctrl/⌘ Z desfaz alterações da sessão; o botão de reposição conserva uma etapa para desfazer. Há zoom, ajuste à janela e linhas de hierarquia opcionais. Abrir um astro entra na conversa existente; o campo inferior envia mensagens ao agente escolhido.

A coleção atual usa 3900 fragmentos no Sol, 2700 por planeta e 900 por lua. Cada modelo tem uma superfície própria, cavidades e lentes de olhos ajustadas ao seu material. Os fragmentos próximos do rato afundam suavemente; partículas luminosas circundam todos os corpos e também reagem ao rato. Durante o arrasto, fragmentos com diferentes profundidades têm um pequeno atraso, que desaparece ao largar. Os círculos do sistema foram removidos; traços discretos como os do Solar mostram a hierarquia e terminam junto dos corpos. O controlo inferior permite ocultá-los.

O botão de definições abre controlos rápidos de movimento, rato, partículas circundantes, ligações e brilho. O menu de criação tem ícones e descrições para agente, equipa e conversa. O microfone junto ao envio transcreve para o rascunho, com botão de parar e revisão antes de enviar. Usa o ditado nativo no macOS ou o reconhecimento fornecido pelo browser, quando disponível. O browser pode usar o seu serviço de voz; não foi acrescentado um serviço pago nem uma chave de API. A captura física de voz ainda precisa de um teste pelo utilizador. O [plano de design](PLANO-DE-DESIGN.md) regista o trabalho atual e os próximos passos.

A rotação pausa quando a página está oculta e com movimento reduzido. Estados de trabalho, espera e bloqueio vêm do backend. Pulsos de envio/receção e fim de atividade são sinais inferidos, não garantias de sucesso de uma tarefa. A indisponibilidade WebGL mostra uma mensagem e miniaturas estáticas de recurso.

O redesenho abrange a página principal. Conversas e páginas secundárias ainda usam componentes da base e serão trabalhadas posteriormente. O lançamento normal do Solar continua disponível sem `VITE_JARVIS_SOLAR`.

## Pré-visualização e verificação isoladas

```powershell
node run.mjs --fixture
node run.mjs --smoke
```

`--fixture` cria dados temporários com Jarvis, oito líderes e cinco luas, com motor simulado identificado na página, conforme a escolha do utilizador. `--smoke` prepara a mesma coleção e verifica a entrada React, módulos 3D, mapas de cor e proxy HTTP numa fixture oficial; encerra os serviços no fim. Não comprova credenciais, ferramentas externas nem embalagem Electron.

## Experiências anteriores

O estudo 2D continua em `/robot-studio/`. Os sprites solares rejeitados estão preservados em `experiments/solar-sprites/` e não são carregados pelo mapa. Os ficheiros do estúdio e `PLANO-3D.md` registam propostas anteriores; a direção atual é o mapa solar de fragmentos luminosos.

O refinamento mais recente reduz a aura para 49 partículas no Sol, 22–29 por planeta e 16–20 por lua, distribuídas circularmente. As caras têm uma zona de contraste no próprio material, olhos maiores e boca luminosa. Saturno e Urano mantêm anéis de partículas com rotação e reação ao rato. As linhas reproduzem os parâmetros e avisos de espera do Solar. A superfície continua com a densidade de fragmentos anterior.

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

