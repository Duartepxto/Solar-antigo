# OpenDots e o espaço de desenvolvimento Solar

Referência analisada: [CopilotKit/OpenDots](https://github.com/CopilotKit/OpenDots), em 3 de outubro de 2026. O vídeo original ainda não foi identificado; esta análise usa o projeto público da CopilotKit, não uma ferramenta da OpenAI.

O OpenDots junta documentos editáveis, conversas, computadores individuais e permissões por especialista. Destacam-se os rascunhos preservados quando falha uma gravação e a verificação de revisões para evitar sobrescrever alterações recentes. A base Solar já cobre papéis, instruções, ferramentas, aprovações, computadores, voz e rotinas; o acrescento escolhido foi trabalhar em ficheiros junto da conversa. Não foi importado o runtime nem ligado nenhum serviço externo.

## Implementado

- A ação **Development / Desenvolvimento** abre um espaço no canvas, à esquerda da conversa existente. Usa a infraestrutura de stage do Solar, sem substituir o chat.
- Navegação de pastas, leitura e edição de ficheiros de texto, criação de ficheiros, separadores e guardar com Ctrl/Cmd+S.
- Pré-visualização de Markdown, HTML e SVG. HTML/SVG são estáticos, em iframe sandbox, sem executar scripts nem carregar recursos remotos automaticamente.
- Ficheiros reais da pasta configurada para a conversa/agente. Sem pasta definida, usa `task-workspaces/<bot>/<thread>` no diretório de dados.
- Guardar compara uma revisão SHA-256 e devolve 409 quando a versão mudou. A gravação usa ficheiro temporário e rename. Rascunhos por agente/conversa permanecem no sessionStorage deste separador, incluindo ao fechar e reabrir o editor. Reabrir a versão guardada pede confirmação antes de descartar alterações.
- API reservada ao proprietário/admin, com restrição à raiz do projeto, sem seguir symlinks/junctions, sem ficheiros ocultos e com limite de 1 MB por ficheiro. Pastas de dependências e saídas de build são excluídas.
- Caras: expressão normal para todos os estados, apenas fechar os olhos ao dormir. Mantém olhar para o rato e piscar. Olhos e boca ampliados 9%, sem mudar o tamanho dos corpos.

## Limites atuais

O editor suporta projetos locais; ficheiros de computadores cloud/VM ainda não são montados. A pré-visualização não é um servidor de desenvolvimento nem executa aplicações React. Terminal, execução de testes a partir da interface, diffs e histórico de revisões ficam para uma revisão própria. A proteção por revisão ordena gravações desta API; não é um bloqueio contra processos externos que escrevam simultaneamente no disco.

A função não está associada a nenhuma skin: a ação está disponível aos agentes geridos pelo proprietário. Na fixture, a Lua Vulcânica tem apenas um projeto temporário para demonstração, sem definir a organização final das luas.

## Verificação

112 testes selecionados passaram: Solar, caras, voz local, ficheiros/revisões/confinamento, API HTTP, ofertas, computador e navegador. TypeScript frontend/backend, lint e catálogos i18n foram verificados. Testes HTTP usam servidores isolados, com motor falso e diretórios temporários. Também passaram 28 testes Electron, com 3 casos de symlink ignorados no Windows.

No browser da fixture: abrir a lua, abrir Development sem modal, ler README, editar, fechar/reabrir e recuperar rascunho, guardar, abrir preview HTML e manter a conversa disponível. Nenhuma mensagem foi enviada ao agente para testar o editor. O build conserva o aviso preexistente de chunks maiores que 500 kB.

Revisão visual: editor transparente, pílulas, divisores finos e identidade Solar; painel Computador junto dos ficheiros. Numa segunda fixture, um pedido ao motor fictício verificou a oferta e abertura de HTML real junto da conversa. O instalador Electron foi gerado e instalado neste Windows, com dados próprios. Voz usa Whisper.cpp local e vozes instaladas; a transcrição de áudio público passou, mas microfone físico e chamada completa com IA não foram exercitados. Ver `SOLAR-FUNCIONALIDADES.md` para a auditoria funcional e limites.
