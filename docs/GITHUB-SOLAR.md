# GitHub Solar

Repositório privado: https://github.com/Duartepxto/Solar

Conta confirmada pela API GitHub autenticada: Duartepxto. O token é utilizado em memória pelo Git Credential Manager do Windows; não foi escrito no projeto ou na documentação.

A raiz do workspace é o repositório principal, com `orbit-app/` como código normal, não como submódulo. O histórico anterior do Orbit fica guardado localmente em `.source-history/orbit.git`, excluído do Git. Licenças e atribuições continuam em `orbit-app/`.

Fluxo de desenvolvimento: rever alterações, verificar o que mudou, criar commits descritivos e enviar ao Solar. Novos trabalhos podem usar branches `codex/…`; não há sincronização automática implementada nesta revisão.

A `.gitignore` exclui dependências, fixtures/dados locais, configurações secretas, builds, logs e bundles ZIP antigos. A pasta `.source-history` também fica excluída.

## Continuar noutro computador

Na primeira utilização, clonar o repositório e instalar as dependências seguindo o README. Em utilizações seguintes, antes de editar:

```powershell
git status
git pull --ff-only
```

Se houver alterações locais, guardá-las num commit ou resolver o estado do workspace antes do pull. Se `--ff-only` recusar por existirem históricos divergentes, rever os commits dos dois computadores; não usar um push forçado para os substituir.

Depois de rever e verificar o trabalho, selecionar apenas os ficheiros pretendidos com `git add`, criar um commit descritivo e usar `git push`. Uma branch `codex/…` com pull request é útil para alterações maiores. O GitHub só recebe as alterações após o push; não guarda automaticamente o que ficou aberto no editor.

Os dados em `chatgpt-3.0/.data/` e `%APPDATA%/Solar/workspace` não fazem parte do repositório. Para levar agentes, conversas e configurações para outro computador, usar o backup/exportação do workspace e restaurá-lo separadamente. Credenciais podem exigir nova autenticação.

## Estado verificado em 4 de outubro de 2026

- Repositório privado, branch principal `main`.
- Sete commits de desenvolvimento em 3 de outubro, com mensagens descritivas.
- Sem tags, releases ou execuções de GitHub Actions nessa consulta.
- O instalador gerado no computador de origem não está disponível como download no GitHub.

O histórico já permite comparar e recuperar alterações do código. Como próximos passos de manutenção, convém adicionar verificações automáticas e publicar uma release quando existir um instalador reproduzido e verificado. O [CHANGELOG](../CHANGELOG.md) apresenta os marcos num formato legível.
