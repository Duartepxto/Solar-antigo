# Jarvis Orbit — linguagem visual atual

## Base

A base ativa é `jarvis/index.html`. Conserva o mapa espacial, as equipas coloridas e a abertura de agentes da reprodução Orbit em `reference/`, mas já apresenta o produto Jarvis: conversa principal fixa no Jarvis, equipas Pesquisa/Projetos/Pessoal, painéis úteis e estados de demonstração honestos. A versão inicial anterior continua guardada em `versions/jarvis-orbit-v1.zip`.

## Composição

- Um Jarvis central coordena três equipas. Agentes especializados orbitam os líderes.
- O mapa mostra sinais discretos de comunicação. Os sinais demonstram a relação entre agentes; não significam execução real.
- O campo inferior fala apenas com o Jarvis e inclui ações de mensagem e chamada.
- Ao abrir um agente, o mapa aproxima o seu orb e apresenta conversa, capacidades e decisões à direita.
- Ecrãs partilhados são pré-visualizações acionáveis, disponíveis num conjunto no mapa e anexadas à conversa do agente que os apresenta.
- O painel do Jarvis reúne resumo diário, tarefas, correio, agenda, projetos, aprovações, atividade, ligações, modelos, voz, memória e preferências.

## Movimento

A interação principal é a transição espacial do mapa para o agente. Os controlos chegam em espiral e sequência à volta do orb. Alguns agentes repousam quando o mapa fica inativo; o rosto reage ao rato e à conversa. Sinais movem-se pelas ligações para sugerir circulação de informação. A chamada começa numa pílula verde com ícone de telefone; o estado desliza para a esquerda, enquanto o orb recebe um anel pontilhado e um marcador de chamada. Duração e botão para terminar aparecem no mesmo painel. Os ecrãs partilhados abrem como documentos legíveis sem retirar o utilizador do contexto. Cartões, capacidades e controlos têm feedback curto ao passar com o rato. `prefers-reduced-motion` interrompe movimento decorativo e mantém indicadores estáticos.

## Dados e ligações

O protótipo guarda tarefas, decisões, notas, preferências e conversas no `localStorage`. Os exemplos estão identificados. Repositórios públicos podem ser consultados pela API pública do GitHub. Contas privadas, e-mail, calendário real, IA e microfone ainda não estão ligados; os controlos mostram esse estado em vez de sugerirem acesso existente.

## Estudo experimental — personagem 2D

Esta direção aplica-se apenas a `chatgpt-3.0/studio`, em `/robot-studio/`. Em 2 de outubro de 2026, o utilizador escolheu um desenho animado 2D após rejeitar a simulação de volume. O mapa principal do Orbit e a linguagem Jarvis Orbit acima continuam intactos. A revisão considera-o pronto para apresentação como estudo de estilo, não como arte final. Não existe uma composição de imagem aprovada; a ilustração original foi construída diretamente em SVG e código.

A personagem tem carapaça creme e papel, visor escuro, contornos de tinta, apontamentos pastel e um rebento no topo. Cabeça, braços, olhos, boca e rebento são peças separadas; CSS articula gestos, respiração e pestanejo. As quatro personagens partilham o desenho e distinguem-se pelos acentos pêssego, azul, verde e rosa. A página ativa não carrega modelos, projeção 3D ou partículas.

O palco preto destaca uma personagem ou uma equipa de quatro. Os controlos ficam numa barra lateral escura à direita e passam para baixo do palco em ecrãs até 850 px. A interface usa Segoe UI, divisórias discretas e seleção em tons quentes.

Os sete estados são Repouso, Pensar, Trabalhar com portátil, Falar, Concluir, Aprovação e Erro. São demonstrações de expressão e movimento, sem correspondência com atividade real dos agentes. A sequência percorre os estados; o controlo de animação permite parar os gestos. `prefers-reduced-motion` desativa animações, e a visibilidade da página pausa o movimento e interrompe a sequência quando fica oculta.

Guardar PNG ou SVG produz um instantâneo da personagem selecionada, com a pose atual congelada; o PNG tem fundo transparente. As fontes desta direção são `studio/index.html`, `illustration.css`, `illustrated-robot.js` e `illustration-main.js`, com contexto em `chatgpt-3.0/README.md`. Evoluir primeiro este estudo antes de aplicar a direção ao mapa principal.
