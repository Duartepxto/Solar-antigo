# Solar — refinamento do protótipo para PC

Artefacto ativo: `Solar.html`. Fonte editável: `prototype-source`. A versão de entrada usa os mesmos recursos em `Solar-entrada.html`; o fluxo de entrada existente é conservado. `Solar-before-clean.html` preserva a versão descarregada do GitHub.

O Orbit local foi usado como referência de comportamento: `RoutineCalendarPage` para calendário e navegação no canvas, `OrbitSheet` para ocupar o espaço ao lado da conversa, `VerifyCard` para preservar a inspeção de passos sem o cartão permanente. A apresentação própria mantém os materiais e planetas do Solar.

## Decisões

- Data/hora, agenda e criação no topo, sem marca visual repetida.
- Direção corrigida após revisão do utilizador: funções diretas à volta do agente, com o padrão de navegação do Orbit. Foram retirados os quatro grupos e o índice de definições. Motor, computador, navegador, telemóvel, aplicações, permissões, skills, memória, rotinas, voz, aspeto e agenda abrem os seus próprios painéis sem categorias intermédias.
- Agenda pessoal e de projetos: semana, mês e lista; criação e edição de eventos/tarefas; agente opcional; notas; repetição diária/semanal; conclusão de tarefas por ocorrência; remoção com desfazer; pesquisa e filtros; criação de projetos.
- Eventos simultâneos ocupam colunas separadas. A agenda mantém os horários locais e inicia a semana à segunda-feira.
- Atividade em linha, com a lista de passos disponível a pedido. Falhas continuam visíveis; a ação de preparar uma skill não envia nada automaticamente.
- Movimento reduzido respeitado. A simulação contínua passa de um ciclo a cada 2,6 segundos para 6,5 segundos, e suspende-se quando a página não está visível.

## Fontes de usabilidade consultadas

- [NN/g — Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/): expor as ações principais, disponibilizar opções especializadas a pedido e tornar claro o caminho de regresso.
- [W3C — Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible): foco percetível nos controlos de teclado.
- [W3C — Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html): respeitar as preferências de movimento e reduzir distrações.
- [Material — Duration and easing](https://m1.material.io/motion/duration-easing.html): transições rápidas, legíveis e consistentes.

## Verificação

- Compilação da exportação e incorporação dos recursos locais, sem backend ou rede no documento.
- Verificação existente: 512 ciclos de simulação, transcrições limitadas, estados e recusa, geometria das partículas, trajetórias retas e paletas do emissor.
- Verificação da agenda: limites de semana e ano, ano bissexto, recorrência e eventos simultâneos sem colisão de colunas.
- No navegador, na primeira versão: tarefa semanal num projeto, conclusão, remoção e desfazer; opção Movimento suave; vistas semana/mês/lista; inspeção dos passos da atividade. A navegação final preserva o acesso direto às funções e o regresso ao agente.
- Inspeção de PC a 1440×900 e 1024×768: painéis separados do chat, sem overflow horizontal. A segunda passagem confirma as correções de navegação e scroll mensal.

## Limites

O HTML é um protótipo local de design. Eventos e projetos ficam no armazenamento deste navegador e podem perder-se se os seus dados forem apagados. Não há integração com Google/Outlook Calendar, sincronização entre dispositivos, backend de agenda ou execução real de rotinas. Os dados e custos dos agentes são demonstrativos. A página mobile continua a ser um trabalho separado.

## Reproduzir

Na raiz do checkout, com as dependências de `orbit-app` instaladas:

```powershell
node docs/exports/solar-antigo/prototype-source/rebuild.mjs
node docs/exports/solar-antigo/prototype-source/check-planner.mjs
```

Para verificar a simulação existente:

```powershell
cd orbit-app
node .orbit-scratch/design-export/check-demo.mjs
```
