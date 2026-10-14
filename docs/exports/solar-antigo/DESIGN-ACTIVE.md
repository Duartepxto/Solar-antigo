# Solar — instruções atuais do design

Esta orientação substitui as experiências anteriores Solar Design PC e Solar Canvas PC. O artefacto ativo é Solar.html: demonstração autónoma para PC, baseada no último Solar antigo. A aplicação Solar V0 não é modificada por este trabalho.

- Preservar os planetas, as luas, o Sol, o mapa arrastável e o estilo dos ícones existentes.
- Abrir as definições à volta do Jarvis. O chat permanece visível. Não abrir a cena separada de definições criada na experiência anterior.
- Retirar pesquisa, definições externas e ferramentas de zoom/organização. Conservar a criação de agentes e mostrar a hora do computador.
- Mostrar contagens de agentes, planetas e luas.
- Agenda como ação do Sol, fora das definições. Rotinas, memória, voz, motores, permissões, skills, aplicações MCP e utilização devem ser encontráveis.
- Conservar o espaço de desenvolvimento existente, com ficheiros, editor e navegador/pré-visualização.
- Chat organizado com estados de pensamento/trabalho, chamadas de ferramentas, delegações, tempo, tokens e custo. Mostrar utilização por agente.
- Equipa demonstrativa continuamente ativa, sem controlo de pausa da simulação. Usar as expressões e partículas existentes. Dados, tarefas, valores e ligações são simulados; não chamar serviços reais.
- Nome público: Solar. Logótipo sem quadrado no cabeçalho; quadrado apenas para o ícone da aplicação. Disponibilizar Sol em SVG isolado.
- A versão mobile terá um artefacto próprio numa fase posterior.

## Refinamento para PC — 13 outubro de 2026

Modo: Operate. Conservar os corpos 3D, materiais, caras integradas, skins, mapa arrastável e transferências com a paleta do emissor. O pedido atual é uma limpeza da interface, sem substituição desta identidade.

- Retirar o nome Solar e a imagem do cabeçalho no PC. Manter data/hora, agenda e criação de agentes.
- Correção do utilizador: conservar a ideia de interação do Orbit. As funções abrem diretamente pelos seus controlos à volta do agente, com valor/estado junto ao ícone. Não usar quatro categorias ou um índice genérico de definições. O painel ocupa o espaço do canvas ao lado da conversa; o mesmo agente passa para o canto, e regressa ao centro quando se fecha a função.
- A agenda pertence à pessoa: calendários Pessoal e Projetos, eventos e tarefas, semana/mês/lista, notas, repetição e agente opcional. Os registos são locais ao navegador; não há sincronização ou execução automática neste artefacto.
- Substituir o cartão «Esta execução» por uma linha de atividade expansível. Manter passos, erros, dispensa e preparação de skills, sem comandos repetidos ou cartão permanente sobre o chat.
- Transições curtas, estados claros, foco de teclado visível, movimento reduzido e atividade demonstrativa menos frequente. Não modificar a geometria, densidade e cores das transferências aprovadas.
- Reproduzir a partir de `prototype-source`: executar `node docs/exports/solar-antigo/prototype-source/rebuild.mjs` na raiz. O processo restaura as fontes no diretório de trabalho da exportação e preserva o HTML anterior em `Solar-before-clean.html`.

## Depois de fechar o design

O utilizador quer uma análise funcional aprofundada do Orbit atual: funcionalidades que o Solar ainda não tem, comportamentos que o concorrente faz melhor e prioridades de implementação. Executar essa comparação depois de fechar o design, antes da implementação correspondente. A consulta do concorrente serve de referência; conservar autoria, licenças e identidade Solar. Não esquecer esta fase ao retomar o projeto.
