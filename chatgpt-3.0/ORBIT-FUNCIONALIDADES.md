# Funcionalidades Orbit no Solar

Revisão de 3 de outubro de 2026. A referência funcional é o código local original do Orbit, em particular `src/orbit/OrbitShell.tsx`, `artifacts.ts`, `ArtifactCard.tsx`, `src/components/ComputerPanel.tsx`, `BrowserPanel.tsx`, `ChatView.tsx` e os painéis de sistemas. O Solar mantém o backend e estes fluxos; altera a representação dos agentes e a composição visual.

| Fluxo | Situação no Solar | Dependência prática |
| --- | --- | --- |
| Conversas, threads, editar mensagens e anexos | Mantido no chat original, sem moldura adicional | Motor de IA configurado para respostas reais |
| O agente oferece um resultado | Convite visível no mapa e no foco; View abre junto da conversa | HTML, PDF ou imagem realmente partilhados pelo agente |
| O agente oferece a sua tela | Mantida a oferta por pedido enquanto trabalha e transmite frames | Computador escolhido, permissões e driver disponível |
| Assumir/devolver controlo | Mantido o lease que pausa o agente durante controlo humano | Computador ativo; não contorna aprovações |
| Navegador próprio | Mantido perfil persistente, painel e controlo do Orbit | Runtime de navegador incluído no Electron |
| Ficheiros e código | Novo espaço Desenvolvimento: editor, guardar, pastas e preview junto do chat | Projeto local; não monta disco cloud/VM |
| Engines/modelos, papéis e instruções | Sistemas originais preservados | Login/API key do fornecedor escolhido |
| Aprovações e ferramentas | Preservadas; não substituídas pela simulação | Configuração real de acessos |
| Memória, skills, Apps/MCP e rotinas | Painéis e backend preservados | Servidores, contas e ferramentas configurados |
| Equipas e canais | Mantidos criação, membros, conversas e associação | Organização das skins ainda por definir |
| Voz e ditado no Windows | Adaptador Solar com Whisper.cpp local e vozes instaladas | Permissão do microfone; resposta usa o motor configurado |
| Telefone, ligação remota e computadores cloud/VM | Fluxos originais conservados | Emparelhamento, recursos ou serviço próprio; não provisionados nesta revisão |

## Apresentação do agente

O convite nunca depende das coordenadas do mapa antigo no Solar. Ao aceitar, o agente abre o seu foco e o resultado ocupa a zona à esquerda do chat. HTML mantém sandbox sem `allow-same-origin`; usa `srcdoc` com os bytes do ficheiro partilhado para evitar a página branca de blob em browsers embutidos. Imagens e PDFs conservam a apresentação própria. O ficheiro continua a ser servido pela rota restrita à mensagem que o partilhou.

O painel Computador está também acessível no espaço Desenvolvimento, junto de Ficheiros. A tela ao vivo, tomar controlo e abrir o desktop continuam a usar os mecanismos do Orbit, em vez de imagens ou botões fictícios.

## Verificação e limites

- 113 testes selecionados passaram, incluindo política de caras, retratos vivos, voz local, ficheiros/revisões, HTTP isolado, ofertas, computador, navegador e comportamento Solar. 28 testes Electron passaram e 3 casos de symlink foram ignorados no Windows.
- TypeScript frontend/backend, lint dos ficheiros alterados, catálogos i18n e build foram verificados. O aviso de chunk Vite maior que 500 kB já existia.
- No browser: ficheiros reais de uma fixture, guardar e recuperar rascunho; acesso ao painel Computador; convite de um agente fictício, abertura e conteúdo real do HTML servido pela conversa.
- Na aplicação instalada: backend HTTP 200 e `/api/solar-voice/status` com `ready: true`. Transcrição real de áudio público pela API isolada. O microfone físico, uma chamada completa com IA e a transmissão de tela de um computador real não foram exercitados.
- Estas verificações não afirmam que contas externas, modelos, cloud, MCP ou telefone estejam ligados. A demonstração identifica o motor como simulado; o Electron usa o workspace real separado.

Evidência: `docs/verification-evidence/solar-agent-result.png`, captura do browser da fixture local. Conteúdo HTML criado por código apenas para verificação; sem dados pessoais ou imagens geradas.

Revisão do retrato: `docs/verification-evidence/solar-live-identity.png` mostra a Lua Vulcânica real no editor e no chat. Os canvases são atualizados por um renderizador partilhado com os mesmos modelos, estados e preferências do mapa, incluindo piscar/olhar e sono, em vez do fallback de linhas que apareceu anteriormente. A miniatura estática também foi corrigida: o canvas agora tem um host antes de criar a cena.
