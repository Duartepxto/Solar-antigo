# Solar — três composições para a entrada

**Estudo retirado da revisão em 10/10/2026.** A direção de identidade que acompanhava esta ronda foi rejeitada. Estes protótipos não constituem uma entrada aprovada nem a base do próximo redesign. Primeiro resolver o ícone próprio da aplicação a partir do Sol existente, conforme a nova instrução do utilizador.

10 de outubro de 2026. [Abrir o estudo](index.html). Artefacto de comparação criado após a rejeição da primeira proposta. Não é uma landing page, não altera a aplicação e não contém um novo logo. O nome Solar usa Manrope como identificação provisória enquanto o estudo de identidade é desenvolvido em paralelo.

As direções partem da [pesquisa de design](../inventario-solar/PESQUISA-DESIGN-SOLAR-10-10-2026.md) e do [estudo de identidade](../inventario-solar/PESQUISA-IDENTIDADE-SOLAR-10-10-2026.md). Aplicam três conclusões concretas: ajuda relevante para a tarefa, uma decisão principal por estado e expressão proveniente do produto. Não reutilizam os assets ou componentes dos produtos de referência.

| Direção | Organização e primeira ação | O que permite avaliar | Limite |
| --- | --- | --- | --- |
| Entrada tipográfica | Texto amplo, motor como ação principal, recorte real de Jarvis no canto | Se a composição tem presença com poucos elementos, sem introdução longa ou formulário prematuro | A assinatura ainda é texto provisório; a captura tem resolução limitada |
| Mapa primeiro | Canvas dominante, introdução no canto inferior, entrada integrada no mundo | Se o mapa aprovado pode acolher sem um cartão de configuração a tapá-lo | Captura histórica de fixture; não é um mapa vivo nem o espaço atual da pessoa |
| Preparação explícita | Lista de dependência e opcionais, ação junto à respetiva tarefa | Se preparar a aplicação de forma direta é mais útil do que apresentar capacidades | Mostra nome e telefone antes de começar; pode continuar a ser informação dispensável no primeiro contacto |

A ordem corresponde ao seed de exploração fornecido pelo coordenador: 3 → 1 → 5 de sete estruturas possíveis. As diferenças são de topologia, conteúdo e ações, não de cor. As três conservam grafite, ouro funcional e Manrope. O mapa 3D aprovado permanece a referência; não se criou outro conjunto de planetas para decorar a entrada.

O botão **Ver mobile** muda o enquadramento do estudo. Não transforma a entrada desktop numa implementação Android. A app companion exige emparelhamento com o PC e tem um percurso nativo próprio. O estado de telefone explica essa relação e não mostra um QR fictício.

## Estados que se podem experimentar

Os controlos de estudo estão fora do frame de produto. Selecionar uma direção reinicia o percurso e conserva o nome temporário enquanto a página estiver aberta. «Recomeçar» limpa esse nome. Não há armazenamento local, APIs, chamadas a modelos ou pedidos de permissão.

- Motor ausente: permite conhecer a configuração ou explorar primeiro.
- Motor disponível: mostra a ação de entrar, sem alegar uma verificação de conta real.
- Erro de verificação: mensagem e nova tentativa exemplificadas localmente; o próprio texto diz que é uma demonstração.
- Nome opcional: input com label, limite de 100 caracteres, autocomplete e descrição do armazenamento apenas em memória.
- Companion: explica PC e QR do desktop, sem simular emparelhamento.
- Explorar: termina num estado explicitamente de estudo; não apresenta agentes ou mensagens falsamente criados.

Na implementação futura, o inventário de motores, os erros de autenticação e a conclusão terão de usar o fluxo real. A confirmação de configuração não será substituída pelos estados locais desta página. As direções não resolvem ainda estados de gravação, rede, carregamento, telemetria ou permissões nativas.

## Materiais e verificação

Fonte local: `../../orbit-app/public/solar/fonts/Manrope-Variable.ttf`. Material visual: `../verification-evidence/solar-workspace.png`, captura pré-existente da fixture, usada apenas como recorte do produto. Não há imagem de banco, figura inventada ou asset descarregado das referências.

HTML/CSS/JavaScript independentes; nenhum ficheiro de React, Electron ou Android foi alterado por este estudo. O contraste usa texto claro sobre grafite, secundários legíveis e ouro em ações. Controlos principais têm pelo menos 44 px, foco visível, caret e seleção definidos. A navegação local move o foco para o título do novo estado. Não há animação essencial ou pedido de microfone.

Inspeção de browser e capturas coordenadas pelo agente principal: **pendentes**. A ausência de overflow, o recorte em cada enquadramento, o carregamento efetivo da fonte e a navegação por teclado precisam dessa observação; a análise do código não é apresentada como prova visual. Estes artefactos são direções de trabalho, não marca ou entrada aprovadas pelo utilizador.
