# GitHub Solar

Repositório privado: https://github.com/Duartepxto/Solar

Conta confirmada pela API GitHub autenticada: Duartepxto. O token é utilizado em memória pelo Git Credential Manager do Windows; não foi escrito no projeto ou na documentação.

A raiz do workspace é o repositório principal, com `orbit-app/` como código normal, não como submódulo. O histórico anterior do Orbit fica guardado localmente em `.source-history/orbit.git`, excluído do Git. Licenças e atribuições continuam em `orbit-app/`.

Fluxo de desenvolvimento: rever alterações, verificar o que mudou, criar commits descritivos e enviar ao Solar. Novos trabalhos podem usar branches `codex/…`; não há sincronização automática implementada nesta revisão.

A `.gitignore` exclui dependências, fixtures/dados locais, configurações secretas, builds, logs e bundles ZIP antigos. A pasta `.source-history` também fica excluída.
