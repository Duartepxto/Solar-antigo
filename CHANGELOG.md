# Histórico do Solar

Este registo resume os marcos confirmados no histórico Git. As entradas de 3 de outubro são commits de desenvolvimento, não releases publicadas. Os links permitem consultar o código e o diff de cada alteração.

## 4 de outubro de 2026 — identidade Solar no Windows (0.1.87)

- Nome Solar no cabeçalho, título da janela e boas-vindas.
- Nome e ícone Solar no ecrã de carregamento e na área de notificação.
- Identidade Solar nos menus nativos e metadados do pacote Windows.
- Documentação principal revista e notas de funcionalidades renomeadas para Solar.

## 4 de outubro de 2026 — apresentação do projeto

- README reorganizado com apresentação visual, capturas reais, funcionalidades e instruções de arranque.
- Esclarecida a diferença entre histórico de commits, versões dos pacotes, tags e releases.
- Documentado o fluxo para continuar o desenvolvimento entre computadores.

## 3 de outubro de 2026 — primeiros marcos

| Hora em Portugal | Alteração | Commit |
| --- | --- | --- |
| 14:54 | Primeiro workspace Solar, interface baseada no Orbit e criação de agentes. | [272e566](https://github.com/Duartepxto/Solar/commit/272e566) |
| 16:26 | Espaço Desenvolvimento, voz local e preparação do instalador desktop. | [91591c3](https://github.com/Duartepxto/Solar/commit/91591c3) |
| 16:40 | Identidades dos agentes com modelos planetários partilhados. | [f0252c9](https://github.com/Duartepxto/Solar/commit/f0252c9) |
| 16:45 | Renderer do retrato mantido ativo durante mudanças de atividade. | [5960cb3](https://github.com/Duartepxto/Solar/commit/5960cb3) |
| 18:42 | Preparação para uso diário, estados reais e introdução à voz local. | [374ed13](https://github.com/Duartepxto/Solar/commit/374ed13) |
| 18:48 | Verificação do Solar empacotado e correções de pressupostos dos testes Windows. | [9f5247b](https://github.com/Duartepxto/Solar/commit/9f5247b) |
| 21:37 | Atualização de modelos OpenAI, correções da introdução e emparelhamento Android. | [a831be8](https://github.com/Duartepxto/Solar/commit/a831be8) |

## Versões publicadas

Na consulta ao GitHub de 4 de outubro de 2026, não existiam tags ou releases. A configuração tem `0.1.0` na raiz e `0.1.86` em `orbit-app/package.json`; o segundo valor vem do pacote desktop e não representa 86 releases do Solar.

Para uma futura entrega instalável, pode ser criada uma tag e uma release com notas, o instalador verificado e o respetivo checksum. Alterações de documentação não precisam de aumentar a versão da aplicação.
