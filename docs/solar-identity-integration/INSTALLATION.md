# Solar Windows atualizado — 10/10/2026

A pedido do utilizador, a identidade aprovada e a última animação do Sol foram integradas no checkout principal juntamente com as alterações locais mais recentes de backend e funcionalidades. A integração preservou as alterações existentes, incluindo o perfil, os catálogos de tradução e os respetivos hashes. Não foram feitos resets nem commits das alterações de outros chats.

O instalador `orbit-app/release-solar/Solar-0.2.2-setup.exe` foi reconstruído e instalado. Terminou com código 0. A aplicação foi reaberta em `C:/Users/duart/AppData/Local/Programs/solar/Solar.exe`. O número de versão mantém-se 0.2.2; os binários correspondem ao novo build.

Verificação: 22 testes de integração da intro passaram; catálogos válidos com 4277 strings e português completo. O build compilou frontend, servidor, companion e updater. O backend empacotado arrancou fora do repositório, resolveu os onze proxies, MCP, exportação cifrada e camada enterprise.

Após instalar, os cinco hashes de executável, app.asar, servidor, HTML e arte aprovada coincidiram com o pacote. `/api/health` respondeu e o novo ícone carregou na interface servida pela instalação. Os identificadores expostos dos agentes coincidiram com os anteriores depois do arranque estabilizar. Os dados pessoais `bots.json` e `config.json` ficaram intactos e todas as 41 mensagens anteriores continuaram presentes.

Cópia de segurança local e logs: `orbit-app/.orbit-scratch/identity-install-2026-10-10/`. Inclui os dados Solar anteriores, uma cópia SQLite consistente, ficheiros de código anteriores à integração e relatórios de verificação. Contém dados privados, está fora do Git e deve permanecer local. A imagem de verificação da interface está em `evidence/solar-installed.png`.

Esta instalação é a versão Windows. Não foi instalada uma atualização Android nem repetida a autenticação/execução real nos fornecedores nesta etapa.
