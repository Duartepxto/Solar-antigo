# Páginas e funcionalidades: revisão atual

O painel de quick settings foi retirado. O botão superior abre diretamente o hub de definições do Solar. Temas, movimento, interação, aura, linhas e brilho passam para Aparência. Ao abrir um agente, as linhas entre planetas ficam com opacidade 7–12%, sem deslocamento animado; as ligações do planeta aos seus sistemas ficam mais visíveis. A composição de foco e os controlos de zoom são preservados.

A primeira página trabalhada é Criar agente/equipa: mantém as ações, papéis, modelos de equipa, opções de visibilidade e erros do Solar. Acrescenta pesquisa e duas pílulas para separar agentes de equipas; mantém preview à esquerda e opções abertas, sem cartões grossos.

## Gestão de equipas proposta

Vista própria de gestão, com responsáveis e membros, para arrastar luas entre equipas e uma alternativa por seletor para teclado. O mapa normal continua a arrastar apenas posições. Antes de guardar, mostrar origem e destino; usar as ações e validações existentes de equipa, respeitando o backend e permissões. Ainda não implementado nesta revisão.

## Pesquisa OpenDots (projeto público da CopilotKit)

Fontes primárias: https://github.com/CopilotKit/OpenDots e https://www.copilotkit.ai/opendots . A aplicação oficial Dots é distinta: https://openai.com/index/introducing-dots/ . Existem vários projetos com o nome OpenDots; a identidade do vídeo do utilizador ainda não foi confirmada.

| Ideia observada | Base disponível no Solar/Solar | Trabalho seguinte |
| --- | --- | --- |
| Papéis e permissões por agente | Papéis, instruções, ferramentas e aprovações existentes | Tornar a criação e configuração mais claras |
| Trabalho recorrente com pausa/histórico | Rotinas, logs, calendário existentes | Adaptar páginas ao mundo solar |
| Computador por agente e observação de atividade | Computador, browser e ferramentas existentes | Rever a apresentação e distinguir estado real de demo |
| Espaços com documentos editáveis e revisões | Artefactos e apresentações existentes; sem editor de espaços equivalente | Projetar persistência, revisões e permissões antes de implementar |
| Conversa e chamadas | Chat, ditado e voz existentes, conforme configuração | Preservar contexto e ações reais; não ligar serviços fictícios |

Com a autorização seguinte, adaptámos o editor junto da conversa e a proteção de rascunhos/revisões. O runtime e as contas externas não foram importados. Ver [OPENDOTS-E-DESENVOLVIMENTO.md](OPENDOTS-E-DESENVOLVIMENTO.md) para a implementação e os limites.

## Verificação desta revisão

TypeScript e lint passaram. A suite solar passou com 44 testes, incluindo um novo caso para frame inicial anterior ao início da transição: a escala nunca extrapola para valores negativos. Build Vite concluído. Verificação no browser: pesquisa por «coding» deixa apenas o papel correspondente e a opção em branco; Agentes/Equipas ocultam o outro catálogo; abertura do Jarvis funciona; linhas do mapa em foco com opacidade 0.10/0.07 e sem animação; linhas de sistemas com opacidade 0.55 e espessura 1.3px. O botão superior abre diretamente o hub completo, com os três fundos e preferências solares em Aparência. Não foram criados agentes nem alteradas permissões no backend para testar esta revisão.
