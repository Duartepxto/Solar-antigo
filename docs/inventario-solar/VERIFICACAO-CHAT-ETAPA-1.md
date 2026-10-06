# Verificação da primeira etapa do chat

Data: 2026-10-05. Base Solar 0.1.87, revisão Git `7ac1c04`, com alterações locais. Não foi criado um lançamento no GitHub.

## Alterações substituídas

| Antes | Depois |
|---|---|
| Decisão baseada apenas no contexto anterior | Projeção considera também o novo pedido |
| Reconstrução predefinida de 24 KB | Orçamento adaptativo por janela, descontando o novo pedido |
| Corte predefinido após 40 mensagens | Retém mensagens enquanto couberem no orçamento |
| Resumo de entrada com início/fim, omitindo o meio | Lotes cronológicos com transporte do resumo anterior |

As implementações antigas correspondentes foram removidas. Não foi adicionado um segundo motor de contexto, serviço de memória ou dependência. O resumo determinístico continua necessário para motores sem helper, timeout ou erro; não é uma cópia obsoleta do helper semântico. Stop, histórico original, ramificações e proteções contra replay de ações aceites foram preservados.

## Resultados

- Orçamento, reconstrução e resumo: 32 testes aprovados.
- Fixture de compactação, contexto do turno e recuperação de retoma: 34 testes aprovados.
- Nova fixture de pedido grande, compactação, criação do agente e browser companion: 12 testes aprovados (inclui casos repetidos da fixture anterior).
- Regressões finais de orçamento, reconstrução, resumo, configuração, manutenção da memória e recall: 211 testes aprovados (inclui os 32 testes iniciais).
- `tsc -p tsconfig.server.json --noEmit`: aprovado, após corrigir quatro erros de tipagem preexistentes em dois testes.
- Build completo Solar: aprovado, incluindo TypeScript, servidor, companion, frontend e instalador Windows.
- Servidor compilado fora do repositório: arrancou sem node_modules; 11 proxies, MCP stdio, exportação cifrada e camada enterprise aprovados.
- `git diff --check`: aprovado.

Todos os testes com mutações utilizaram dados e processos isolados. Não foram enviadas mensagens a modelos reais nem feitas avaliações de qualidade semântica pagas.

## Instalação

Instalador atualizado: `orbit-app/release-solar/Solar-0.1.87-setup.exe`. Antes da instalação, a API do workspace indicava zero tarefas ativas. A instalação silenciosa terminou com código 0 e o Solar foi reaberto.

O hash SHA-256 do servidor instalado corresponde ao servidor compilado e verificado:

`B2F1E6E035797E2709865587588EDD1A063636DC551E2ED6C1F0693E41289C42`

A versão do executável continua 0.1.87.0: estas são alterações locais à versão base, não uma versão upstream nova.

## Limites

Contagem por bytes é uma estimativa conservadora, não tokenização exata nem garantia de que qualquer pedido enorme caiba. Anexos nativos, raciocínio e resultados acumulados durante um turno exigem verificações adicionais por motor. Resumir vários lotes pode usar várias chamadas, dentro do mesmo timeout de 20 segundos; o fallback pode omitir detalhes. Integração da compactação nativa, memória semântica nos motores sem helper e as outras etapas do plano continuam pendentes.
