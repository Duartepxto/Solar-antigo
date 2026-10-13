# Solar instalado no desktop — 9 de outubro de 2026

- Código atualizado por fast-forward para `199cbcc1b3e93280ea336a3d82ffbe274fd76b70`, branch `codex/solar-android-and-chat`, no repositório privado `Duartepxto/Solar`.
- Solar Windows **0.2.2.0** compilado, instalado e aberto em `C:/Users/duart/AppData/Local/Programs/solar/Solar.exe`. Instalador terminou com código 0. SHA-256 do `resources/app.asar` instalado corresponde ao pacote final.
- Arranque instalado: `/api/health` HTTP 200. `/api/solar-voice/status`: reconhecimento local pronto, modelo final `small-q5_1`, prévias `base`. Modelos oficiais verificados por checksum. Reconhecimento com voz real não foi testado.
- Dois agentes locais conservados (Jarvis e Solar), com os mesmos identificadores, duas conversas e 15 mensagens antes e depois da atualização. Nenhuma mensagem foi enviada para verificar a aplicação pessoal.
- Cópia de segurança anterior à instalação em `orbit-app/.orbit-scratch/desktop-update-2026-10-09/Solar-before-update/`, fora do Git. Inclui dados privados e deve permanecer local.

## Verificação e correção local

86 testes selecionados de dados, consumo, motor, ditado e estado passaram. Outros 55 testes de backup passaram. A verificação isolada do servidor incluído no pacote final confirmou arranque sem dependências do checkout, os 11 caminhos de proxies, comunicação MCP, exportação cifrada e resolução da camada enterprise. Não demonstra autenticação nos fornecedores ou precisão do microfone real.

Durante a instalação encontrou-se uma falha real de exportação de backups: `codex-home/archived_sessions` é uma ligação para a pasta externa do Codex neste dispositivo. O home gerido do Codex passou a ser excluído dos backups e preservado no destino, tal como outros homes de fornecedores. Os dados e conversas do Solar continuam incluídos. A correção e os testes estão locais, sem publicação no GitHub. O teste de links foi adaptado a junctions Windows, e a verificação de empacotamento passou a mostrar o motivo de falhas HTTP.

## Dados do portátil pendentes

A API GitHub autenticada confirmou duas branches (`main` e `codex/solar-android-and-chat`) e uma release com apenas `Solar-Android-preview.apk`. Nenhuma das árvores, completas, contém `.orbitbackup`, `.solar-agent.json`, `.mausteam.json`, arquivo ZIP/7z de transferência, `bots.json` pessoal ou `messages.db`. Não foi encontrado ficheiro de transferência nas pastas verificadas deste desktop.

O código foi transferido; os planetas organizados no portátil não foram recuperados. O guia de continuação do portátil indica explicitamente transferência separada dos dados. Para completar, exportar o workspace nesse portátil e transferir o backup para este PC. Preservar o workspace atual e rever o conteúdo antes de qualquer substituição; a importação de planetas permite adicionar ou atualizar identidades individualmente.

Logs e resumos numéricos da instalação estão em `orbit-app/.orbit-scratch/solar-desktop-2026-10-09-*` e `orbit-app/.orbit-scratch/desktop-update-2026-10-09/`, fora do Git.
