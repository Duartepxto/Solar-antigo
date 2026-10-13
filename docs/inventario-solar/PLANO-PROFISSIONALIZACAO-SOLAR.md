# Profissionalização do Solar

Iniciado em 9 de outubro de 2026; âmbito esclarecido em 10 de outubro. Objetivo por concluir: preparar a aplicação como produto público, com Windows e Android como prioridades, uma identidade própria e funcionamento verificável.

## Direção confirmada

- Correção posterior de design: o ícone é o Sol da própria aplicação, representado graficamente e autónomo, também a preto/branco. Os conceitos de lettering/monograma V2 foram rejeitados. A nova frente usa um único agente de raciocínio médio com contexto focado; agentes antigos de esforço elevado não são retomados.
- Solar é o produto. Jarvis é o agente central; planetas são responsáveis e luas são agentes das equipas.
- Preservar o mapa e a identidade grafite/dourado. Refazer a entrada herdada e outras superfícies que ainda dependam dessa composição, com decisões próprias do Solar.
- Trabalhar identidade e aplicação em paralelo. A revisão técnica inclui funcionalidades, desenho dos fluxos, arquitetura, persistência, recuperação, comunicação entre agentes, consumo e qualidade do código.
- A landing page e o vídeo ficam em planeamento nesta fase. A aplicação deve fornecer as provas que irão sustentar a apresentação pública.
- O utilizador autorizou distribuir o trabalho entre agentes. Cada frente tem ficheiros próprios; a integração e a verificação ficam com o agente principal.

## O que significa concluir

«Profissional» precisa de critérios observáveis. Não significa afirmar que nunca existem erros, nem reduzir funcionalidades para obter números menores.

| Frente | Critério de conclusão | Prova necessária |
| --- | --- | --- |
| Primeiro uso | Um novo utilizador entende o produto, configura um motor ou adia a configuração, cria/edita o primeiro agente e consegue começar | Fluxo real numa instalação limpa e fixture; teclado; ecrã estreito; falhas de gravação e nova tentativa |
| Conversa | Enviar, receber, editar, escolher uma branch, mudar modelo, usar anexos e parar conservam a conversa correta | Exercícios reais com fixture e motores representativos; ausência de duplicados e resultados tardios |
| Trabalho em equipa | Cada pedido tem origem, destinatário, estado e resultado; o coordenador recebe a informação necessária uma vez | Capturas dos pedidos efetivamente recebidos pelo motor simulado; reinício, concorrência, recusa, cancelamento e alteração de instruções |
| Consumo | Entrada total, cache, saída, custo estimado/reportado/desconhecido e chamadas auxiliares ficam diferenciados | Ledger persistente e diagnóstico; correspondência com eventos do fornecedor; cenários de retoma e múltiplas ferramentas |
| Dados | Guardar, reiniciar, exportar e importar conservam identidades, memória, conversas e branches; credenciais não são transferidas inadvertidamente | Fixtures de backup/portabilidade e recuperação; revisão das fronteiras de dados |
| Ferramentas | Configuração, ligações, permissões, erros e limites são compreensíveis; só são mostradas capacidades disponíveis | Motor sem autenticação, ferramenta indisponível, recusa, erro de rede e nova tentativa |
| Voz | Ditado editável, cancelamento, finalização e chamada por turnos funcionam sem enviar rascunhos automaticamente | Fixture + verificação com microfone real em Windows e telefone |
| Android | Entrada, emparelhamento, mapa, chat, permissões, ligação perdida e retorno à app têm identidade própria e mantêm a conversa | Compilação, fixture de transporte/UI e telefone físico; rede doméstica e Tailscale privada |
| Design | Marca coerente; hierarquia, foco, contraste, tamanhos de toque, textos longos e estados vazios/erro resolvidos | Inspeção visual de desktop/mobile e uso por teclado, incluindo movimento reduzido |
| Distribuição | Instalar, atualizar, abrir, fechar, recuperar servidor e desinstalar têm comportamento claro; dados existentes são conservados | Pacote gerado, smoke isolado e revisão de versão/assinatura/atribuições |
| Apresentação pública | Site e vídeo explicam uma tarefa real, requisitos, limites e disponibilidade | Plano editorial com cada afirmação ligada a uma prova; captura final só após estabilização |

## Ordem de execução

1. **Base e identidade:** inventário do produto ativo, baseline técnico, redesenho da entrada, símbolo vetorial e regras de marca. Planear a mensagem do site e a narrativa do vídeo.
2. **Problemas comprovados:** corrigir perda/corrupção de dados, contabilização incompleta, erros de cancelamento/recuperação e contexto desnecessário. Reproduzir antes, verificar depois.
3. **Percursos completos:** rever conversa, equipas, ferramentas, memória, resultados, ficheiros, voz e emparelhamento. Cada problema entra num registo com impacto, evidência, solução e limite de verificação.
4. **Windows e Android:** adaptar as superfícies restantes, confirmar consistência da identidade e executar a matriz de funcionamento por plataforma.
5. **Preparação da distribuição:** documentação de primeiro uso, suporte, qualidade do pacote, migração e critérios de beta pública.
6. **Execução futura de site/vídeo:** apenas depois desta fase, com conteúdo baseado no estado realmente entregue.

## Primeiro lote em integração — 10 de outubro

- **Design rejeitado pelo utilizador:** o primeiro fluxo e o «Sol aberto» foram retirados do código de produção e guardados como rascunho. A composição herdada foi reposta temporariamente; não é a direção final. Pesquisa online de identidade, UX e páginas antes da nova proposta: [estudo](PESQUISA-DESIGN-SOLAR-10-10-2026.md).
- Ícone do Sol, entrada Windows/Android e ícones nativos serão avaliados como um sistema. A próxima revisão parte da [pesquisa de app icons](PESQUISA-ICONE-SOL-10-10-2026.md); não usa lettering como substituto do símbolo. Nenhuma migração para os desenhos rejeitados está aprovada.
- Diagnóstico de consumo somente de leitura, com anonimização e limitações explícitas. O ledger disponível contém medições vazias; não serve para afirmar gasto real nem uma percentagem de poupança.
- Corrupção de UTF-8 em pedidos HTTP e no transporte de permissões reproduzida e corrigida. Verificações isoladas cobrem acentos, emoji e caracteres multibyte divididos em chunks.
- Geração opcional de títulos identificada como chamada auxiliar sem contabilização/limite; correção e verificação em integração. A opção está desativada por defeito e não explica, por si só, os registos históricos sem medição.

Os relatórios específicos registam números, ficheiros e validação. Este plano não substitui esses relatórios nem marca como concluídas as funcionalidades não exercitadas.

## Método de trabalho

Ler o código e experimentar o percurso são duas fontes de evidência. Testes automatizados protegem correções relevantes; não substituem o uso da interface. As fixtures usam dados descartáveis e motores simulados, sem consumir a conta real ou escrever no workspace pessoal. A análise de registos reais é somente de leitura e evita copiar prompts, credenciais ou conversas para os relatórios.

Cada conclusão distingue: **comprovado no código**, **reproduzido em fixture**, **verificado visualmente**, **verificado com fornecedor/dispositivo real** e **pendente**. Não declarar a aplicação completa por ter uma compilação ou uma suite verde.

## Pendências conhecidas que precisam de prova

- Consumo real com fornecedor: as linhas antigas disponíveis não contêm medições úteis. Precisamos de uma amostra representativa com telemetria efetiva e atribuição de chamadas auxiliares.
- Comparação de contexto entregue em sessões novas, retomadas e reconstruídas, por motor; não confundir bytes montados com bytes enviados ou tokens cobrados.
- Android físico e microfone real: verificações anteriormente adiadas continuam pendentes.
- Ícones nativos/favicon: geometria e paleta ainda divergem; precisam da nova direção de marca, com avaliação em tamanho pequeno, antes da propagação.
- Revisão completa dos fluxos restantes, com destaque para estados de erro e recuperação. O inventário existente orienta a cobertura; a lista será atualizada com descobertas.
- Documentação histórica contém orientações antigas (incluindo HANDOFF.md e trechos de PRODUCT.md). Consolidar o guia operacional antes da beta pública, sem apagar o histórico de decisões.

## Artefactos de referência

- [Marca e lançamento](PLANO-MARCA-E-LANCAMENTO-10-10-2026.md)
- [Pesquisa de design](PESQUISA-DESIGN-SOLAR-10-10-2026.md)
- [Prancha rejeitada — histórico](../solar-brand/index.html)
- [Auditoria de tokens](AUDITORIA-TOKENS-10-10-2026.md)
- [Auditoria de confiabilidade](AUDITORIA-CONFIABILIDADE-10-10-2026.md)
- [Procedimento de verificação](../../orbit-app/docs/verification/README.md)

O objetivo não está concluído enquanto houver trabalho obrigatório na matriz. O estado de execução do goal é controlado pela aplicação. Falta de autenticação numa biblioteca de componentes ou limitação do sandbox não obriga a interromper as frentes que podem continuar com os componentes e fixtures locais.
