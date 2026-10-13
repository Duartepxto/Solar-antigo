# Pesquisa de design para o Solar

10 de outubro de 2026. Estudo pedido pelo utilizador após rejeitar o primeiro logo e a composição da entrada. A proposta «Sol aberto» e o frame de duas colunas foram retirados do código de produção e preservados como [rascunho rejeitado](rascunhos-rejeitados/entrada-desktop-sol-aberto/README.md). A interface herdada é apenas a base temporária; também precisa de substituição.

Este documento separa o que as fontes mostram das decisões propostas para o Solar. «Premium» é uma intenção de qualidade e perceção, não uma categoria técnica nem uma garantia obtida pela escolha de uma cor.

## O que falhou no primeiro resultado

Análise do rascunho e da reação do utilizador:

- O símbolo parecia uma ilustração astronómica: núcleo, raios, arco e satélites competiam dentro de uma marca de 36 px. Acrescentar elementos que representam funcionalidades não criou uma assinatura reconhecível.
- O nome Solar era texto de interface colocado junto ao símbolo. Faltava tratar proporções, desenho das letras e relação entre símbolo e palavra como uma identidade.
- A entrada juntava slogan, descrição, mapa esquemático, seis passos, formulário e três notas no rodapé. A composição tinha vários centros de atenção antes de a pessoa fazer uma única ação útil.
- A versão estreita empilhava apresentação e formulário. Esconder partes por breakpoint corrigia espaço, mas não resolvia a ideia da experiência.
- As verificações de contraste, overflow e TypeScript tinham passado. Isso não demonstra qualidade de direção de arte. A próxima avaliação deve incluir reconhecimento, hierarquia e relação com o produto.

## Referências estudadas e aplicação

As páginas Linear, Raycast e Stripe foram também observadas renderizadas no browser. As restantes fontes abaixo foram lidas nos sites oficiais. A investigação específica de símbolos e lettering está no [estudo de identidade](PESQUISA-IDENTIDADE-SOLAR-10-10-2026.md).

| Frente | Evidência da fonte | Aplicação proposta ao Solar |
| --- | --- | --- |
| Hierarquia da aplicação | O [refresh do Linear, março de 2026](https://linear.app/now/behind-the-latest-design-refresh) reduz o peso da navegação, o excesso de ícones e a intensidade de divisórias. As comparações visuais mostram conteúdo com maior prioridade. | Chat, tarefa e resultado devem dominar a superfície de trabalho. Reservar o dourado para ação, seleção e identidade; o mapa mantém a sua expressão própria. Não dourar todos os ícones. |
| Coerência do produto | [A design reset, Linear](https://linear.app/now/a-design-reset) descreve como novas funcionalidades acumulam dívida de design e exigem repensar a experiência global. | Rever entrada, chat, definições, ficheiros, permissões e Android com a mesma hierarquia e vocabulário. A primeira página não pode parecer um produto diferente do que vem a seguir. |
| Site de produto | A [página Raycast](https://www.raycast.com/) apresenta uma promessa dominante e passa a exemplos de ferramentas, interações e interfaces. No browser, a abertura tem uma focalização forte e a marca pode ocupar uma área expressiva. | No futuro site, usar o mapa Solar real como demonstração central e mostrar uma tarefa concreta. A dramatização visual da página comercial não deve ocupar todos os passos de configuração da app. |
| Narrativa e provas | A [página Stripe observada na região Austrália](https://stripe.com/au) liga a promessa a casos de uso, interfaces de produtos e provas identificáveis. A sua expressão cromática é parte dessa marca. | Planear a sequência problema → delegação → aprovação → resultado → companion. Só publicar números, testemunhos ou capacidades que tenham prova no Solar. O gradiente e a composição Stripe não são a direção visual do Solar. |
| Tipografia | O [Geist da Vercel](https://vercel.com/geist/typography) distingue títulos, labels, botões e texto corrido; cada estilo combina tamanho, peso, altura de linha e espaçamento. | Conservar Manrope para UI e criar papéis tipográficos consistentes. Evitar acumular valores isolados de 10, 11, 12 e 13 px na entrada. O wordmark pode ter desenho próprio sem obrigar a trocar a fonte de toda a aplicação. |
| Espaço e grelha | O [layout Fluent](https://fluent2.microsoft.design/layout) usa proximidade e espaço para expressar relações, além de adaptar a composição por dispositivo. | Uma ação principal por estado; grupos formados por espaço antes de adicionar caixas e separadores. Windows deve aproveitar a janela e Android deve privilegiar leitura, teclado e toque. Igual identidade não exige igual composição. |
| Primeiro uso | O [onboarding Fluent](https://fluent2.microsoft.design/onboarding/) trata acolher, orientar, explicar e agir como objetivos diferentes. Recomenda ajuda relevante, opcional e ligada à tarefa. | O primeiro ecrã acolhe e oferece começar. Motor de IA é uma dependência a resolver com clareza. Microfone, telefone e personalização podem surgir quando forem úteis, com retorno nas Definições. Rever a necessidade dos seis passos antes de redesenhá-los. |
| Aprendizagem | As [HIG de onboarding da Apple](https://developer.apple.com/design/human-interface-guidelines/onboarding?changes=_7) recomendam ensinar pela interação, adiar configuração não essencial e pedir permissões no contexto de uso. | Depois da configuração necessária, orientar dentro do mapa/chat real. Usar estas recomendações como evidência de UX; os componentes, permissões e navegação continuam a seguir Windows/Android. |
| Movimento | O [sistema de movimento Material](https://m3.material.io/styles/motion/overview/how-it-works) distingue movimento espacial de mudanças de cor/opacidade e oferece expressão mais funcional para utilitários. | Usar transições para mostrar onde se abriu um agente, progresso e conclusão. A entrada não deve demorar por causa de uma animação. Definir alternativas com movimento reduzido e não introduzir uma nova biblioteca só para parecer sofisticada. |
| Site e vídeo | A [equipa de conteúdo Raycast](https://www.raycast.com/blog/hype-team) descreve planeamento, guião, edição e alinhamento de conteúdo com funcionalidades efetivamente entregues. | O vídeo do Solar precisa de uma narrativa e de uma lista de capturas verificadas. A abertura de marca é breve; a maior parte do tempo mostra o trabalho. Manter site e vídeo em planeamento nesta fase. |

## Critérios de qualidade da próxima proposta

Estes são critérios de trabalho escolhidos para o Solar, não regras estéticas universais:

1. **Marca:** estudar primeiro em uma cor, com palavra e símbolo separadamente; comparar 16/24/32 px e tamanho de app icon. A silhueta deve continuar distinguível sem brilho, animação ou explicação. Tratar o logo como marca do produto, separado do avatar de Jarvis.
2. **Entrada Windows:** uma ideia visual dominante, uma frase curta e uma ação clara. Usar o produto como referência de identidade. O tamanho da janela decorre do percurso e dos estados, não de um cartão herdado nem de uma dimensão fixada antes do conceito.
3. **Entrada Android:** mostrar a dependência do PC e como emparelhar. Scanner, confirmação, permissão, erro e nova tentativa fazem parte do desenho. Botões e campos continuam alcançáveis com teclado aberto e texto aumentado.
4. **Aplicação:** o mapa aprovado permanece. Rever pesos de texto, contraste, espaçamento, menus e painéis nas superfícies operacionais. O tratamento decorativo da marca não deve diminuir legibilidade nem competir com a tarefa.
5. **Conteúdo:** PT e EN através de `t()`. Botões descrevem a ação. Um erro explica o que aconteceu e a próxima ação possível; consumo desconhecido não aparece como gratuito.
6. **Site/vídeo:** mesma marca, linguagem e produto demonstrado; identidade estável antes da captura final. Os requisitos de PC, motor e rede são claros no ponto em que ajudam a decisão.

O piso funcional inclui texto normal com contraste mínimo 4,5:1 e texto grande 3:1, conforme [WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). A [WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) prevê 24 × 24 CSS px ou condições de espaçamento/exceções; para os controlos principais do Solar a meta é mais confortável: 44 px no web/desktop e 48 dp no Android. Deve existir foco de teclado visível. Movimento não essencial deve poder ser desativado, conforme [WCAG 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html). Os tamanhos escolhidos são metas do produto, não uma afirmação de certificação.

## Aplicar a pesquisa à revisão completa

| Superfície | Decisão que precisa de ser resolvida | Estado a verificar no produto |
| --- | --- | --- |
| Marca | Símbolo, lettering, microversão e app icon como sistema único | Claro/escuro, uma cor, taskbar, launcher e título |
| Entrada | Menos decisões antes de começar, dependências e retorno claros | Motor disponível/ausente, gravar/falhar, voltar, adiar e reabrir |
| Mapa | Preservar hierarquia Solar, seleção e orientação | Equipas pequenas/grandes, nomes longos, teclado e movimento reduzido |
| Chat | Mensagem e trabalho em primeiro plano; composer estável | Texto longo, anexos, ferramentas, streaming, cancelamento e falha |
| Delegação | Origem, responsável e estado compreensíveis | Espera, recusa, aprovação, resultado e trabalho concorrente |
| Consumo | Tokens/cache/custo e medição desconhecida diferenciados | Várias rondas de ferramentas, retry, cancelamento e chamadas auxiliares |
| Definições | Organização por intenção do utilizador | Motor sem login, alteração guardada, falha de rede e dados inválidos |
| Voz | Feedback de ouvir/pensar/falar com ações alcançáveis | Sem permissão, silêncio, cancelamento, ditado editável e dispositivo ausente |
| Android | Identidade comum com navegação e permissões nativas | Scanner → confirmar → ligar, Back, LAN, rede perdida e retoma |
| Site/vídeo | Demonstração útil e afirmações comprovadas | Guião, shot list, legendas, versões Windows/Android e requisitos |

## Próxima execução

Pontos de entrada do código confirmados nesta passagem, para aplicar a revisão ao produto existente. A presença nesta lista não significa que toda a funcionalidade esteja auditada:

- Entrada desktop: `orbit-app/src/components/onboarding/WelcomeFlow.tsx` e os beats de perfil, motores, permissões, telefone e agente. A preservação do nome ao voltar foi exercitada na fixture; os estados e a nova composição ainda têm de ser revistos em conjunto.
- Mapa e enquadramento: `orbit-app/src/orbit/SolarMap.tsx`, `SolarWorld.tsx`, `SolarChrome.tsx` e `SolarFocus.tsx`.
- Conversa e consumo: `orbit-app/src/components/Composer.tsx`, `ThreadControls.tsx`, `ThreadUsageChip.tsx`, `UsageSection.tsx`, `UsageHistory.tsx` e `UsageBudget.tsx`.
- Configuração: `orbit-app/src/components/EngineLibrary.tsx`, `EngineSetup.tsx`, `PhoneSetupFlow.tsx` e `SolarDictationSettings.tsx`; memória em `orbit-app/src/orbit/detail/MemoryPanel.tsx`.
- Android: `orbit-app/android/app/src/main/kotlin/com/orbit/companion/ui/OnboardingScreens.kt`, `PairingScreen.kt`, `SolarHomeMap.kt`, `PermissionRequests.kt` e `SolarCallControls.kt`.
- Identidade instalada: favicon em `orbit-app/index.html` (`/solar-icon.svg`), Electron em `orbit-app/electron/main.mjs` (`resources/solar-icon.png`) e Android nos `mipmap/ic_launcher` e `ic_launcher_round` declarados no manifest. Rever todos após fechar a marca; nenhum passou para o símbolo rejeitado.

Primeiro, fechar a pesquisa de identidade e comparar territórios com ideias distintas, incluindo uma direção centrada no lettering e outra num símbolo compacto. Mostrar a comparação no mesmo contexto real e nos mesmos tamanhos, com os estados de entrada previstos. Depois escolher e desenvolver a composição completa, verificar Windows e Android numa ronda conjunta, corrigir problemas observados e confirmar uma vez.

Não aplicar novamente o «Sol aberto», não tratar as marcas de referência como catálogo de SVG e não publicar site/vídeo nesta fase. A pesquisa não substitui o trabalho de desenho e não equivale à aprovação de um novo logo.

A auditoria técnica segue em paralelo. Os resultados estão no [plano de profissionalização](PLANO-PROFISSIONALIZACAO-SOLAR.md), na [auditoria de tokens](AUDITORIA-TOKENS-10-10-2026.md) e na [auditoria de confiabilidade](AUDITORIA-CONFIABILIDADE-10-10-2026.md).
