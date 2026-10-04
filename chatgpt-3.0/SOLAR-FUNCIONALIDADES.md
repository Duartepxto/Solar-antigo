# Funcionalidades Solar no Solar

Revisão de 3 de outubro de 2026. A referência funcional é o código local original do Solar, em particular `src/orbit/OrbitShell.tsx`, `artifacts.ts`, `ArtifactCard.tsx`, `src/components/ComputerPanel.tsx`, `BrowserPanel.tsx`, `ChatView.tsx` e os painéis de sistemas. O Solar mantém o backend e estes fluxos; altera a representação dos agentes e a composição visual.

| Fluxo | Situação no Solar | Dependência prática |
| --- | --- | --- |
| Conversas, threads, editar mensagens e anexos | Mantido no chat original, sem moldura adicional | Motor de IA configurado para respostas reais |
| O agente oferece um resultado | Convite visível no mapa e no foco; View abre junto da conversa | HTML, PDF ou imagem realmente partilhados pelo agente |
| O agente oferece a sua tela | Mantida a oferta por pedido enquanto trabalha e transmite frames | Computador escolhido, permissões e driver disponível |
| Assumir/devolver controlo | Mantido o lease que pausa o agente durante controlo humano | Computador ativo; não contorna aprovações |
| Navegador próprio | Mantido perfil persistente, painel e controlo do Solar | Runtime de navegador incluído no Electron |
| Ficheiros e código | Novo espaço Desenvolvimento: editor, guardar, pastas e preview junto do chat | Projeto local; não monta disco cloud/VM |
| Engines/modelos, papéis e instruções | Sistemas originais preservados | Login/API key do fornecedor escolhido |
| Aprovações e ferramentas | Preservadas; não substituídas pela simulação | Configuração real de acessos |
| Memória, skills, Apps/MCP e rotinas | Painéis e backend preservados | Servidores, contas e ferramentas configurados |
| Equipas e canais | Mantidos criação, membros, conversas e associação | Organização das skins ainda por definir |
| Voz e ditado no Windows | Adaptador Solar com Whisper.cpp local e vozes instaladas | Permissão do microfone; resposta usa o motor configurado |
| Telefone, ligação remota e computadores cloud/VM | Fluxos originais conservados | Emparelhamento, recursos ou serviço próprio; não provisionados nesta revisão |

## Apresentação do agente

O convite nunca depende das coordenadas do mapa antigo no Solar. Ao aceitar, o agente abre o seu foco e o resultado ocupa a zona à esquerda do chat. HTML mantém sandbox sem `allow-same-origin`; usa `srcdoc` com os bytes do ficheiro partilhado para evitar a página branca de blob em browsers embutidos. Imagens e PDFs conservam a apresentação própria. O ficheiro continua a ser servido pela rota restrita à mensagem que o partilhou.

O painel Computador está também acessível no espaço Desenvolvimento, junto de Ficheiros. A tela ao vivo, tomar controlo e abrir o desktop continuam a usar os mecanismos do Solar, em vez de imagens ou botões fictícios.

## Verificação e limites

- 113 testes selecionados passaram, incluindo política de caras, retratos vivos, voz local, ficheiros/revisões, HTTP isolado, ofertas, computador, navegador e comportamento Solar. 28 testes Electron passaram e 3 casos de symlink foram ignorados no Windows.
- TypeScript frontend/backend, lint dos ficheiros alterados, catálogos i18n e build foram verificados. O aviso de chunk Vite maior que 500 kB já existia.
- No browser: ficheiros reais de uma fixture, guardar e recuperar rascunho; acesso ao painel Computador; convite de um agente fictício, abertura e conteúdo real do HTML servido pela conversa.
- Na aplicação instalada: backend HTTP 200 e `/api/solar-voice/status` com `ready: true`. Transcrição real de áudio público pela API isolada. O microfone físico, uma chamada completa com IA e a transmissão de tela de um computador real não foram exercitados.
- Estas verificações não afirmam que contas externas, modelos, cloud, MCP ou telefone estejam ligados. A demonstração identifica o motor como simulado; o Electron usa o workspace real separado.

Evidência: `docs/verification-evidence/solar-agent-result.png`, captura do browser da fixture local. Conteúdo HTML criado por código apenas para verificação; sem dados pessoais ou imagens geradas.

Revisão do retrato: `docs/verification-evidence/solar-live-identity.png` mostra a Lua Vulcânica real no editor e no chat. Os canvases são atualizados por um renderizador partilhado com os mesmos modelos, estados e preferências do mapa, incluindo piscar/olhar e sono, em vez do fallback de linhas que apareceu anteriormente. A miniatura estática também foi corrigida: o canvas agora tem um host antes de criar a cena.

## Preparação para uso real

A simulação automática, o showcase e os seus controlos foram removidos do código da aplicação. O mapa passa a mostrar apenas atividade real. Foram retirados os rótulos de demonstração e “All quiet”; os créditos das texturas ficam em Sobre, com a origem e CC BY 4.0. A instrução discreta para arrastar mantém-se.

O Jarvis tem seis controlos próprios (motor, aprovações, skills, memória, voz e acesso ao sistema), em vez de todos os sistemas de um agente comum. O botão Application Settings desapareceu do cabeçalho. O agente integrado muda de Solar para Jarvis no Solar, preservando ID, motor, threads e nomes personalizados.

A primeira abertura usa a introdução Solar versão 2: mapa e hierarquia, chamada versus ditado, desenvolvimento e resultados, configuração do motor e permissões. É possível saltar e voltar a abrir pelo Sistema. Os olhos mantêm-se legíveis; pensar/trabalhar/esperar/falhar têm variações pequenas, dormir fecha os olhos e mostra zzz. A chamada comunica as suas fases ao modelo, incluindo a boca durante a fala.

Voz local: Whisper incluído para transcrição e vozes instaladas no sistema para respostas, sem fornecedor pago de voz. O ditado escreve um rascunho; Chamada envia turnos ao agente e lê respostas. Confirmações faladas em português/inglês exigem uma frase inteira de consentimento. Uma frase como “sim mas não faças isso” não aprova nada. A voz selecionada acompanha a língua da interface, se estiver instalada.

Verificação desta atualização: 226 testes passaram; um teste de plataforma foi saltado. TypeScript de frontend e servidor, lint dos ficheiros alterados e catálogos de tradução validados. Codex está autenticado com ChatGPT e respondeu a um teste sintético numa pasta temporária vazia. A voz local foi testada com reprodução simulada e áudio público nas verificações anteriores; o microfone físico e uma chamada completa no equipamento precisam de ser experimentados pelo utilizador. Contas externas, Apps/MCP, telefone e computadores remotos funcionam pelos fluxos originais, mas exigem ligação e permissões de cada serviço; não inventamos essas ligações.

Para desenvolvimento com os dados da aplicação já instalada: `node chatgpt-3.0/run.mjs --installed`. Este modo liga a página local ao backend do Solar em 8799, sem criar dados fictícios ou outro espaço de trabalho. Para testes, continuar a usar `--fixture` ou `--smoke`, que isolam todas as mutações.

Fecho da entrega: instalador `Solar-0.1.86-setup.exe` compilado e aplicado com código de saída 0. A aplicação reabriu; HTTP 200, voz local pronta e hash do bundle principal servido igual ao build atual. Título e favicon passam a Solar. O smoke de arranque isolado passou. Evidência `docs/verification-evidence/solar-installed-workspace.png`: mapa persistente sem showcase, controlos provisórios ou créditos sobre o canvas. A imagem foi capturada no browser ligado à instalação, sem enviar mensagens nem alterar os dados para testar.

Passagem final adicional: 102 testes em 20 ficheiros Solar/voz/onboarding passaram; 43 testes Electron passaram e 5 ficaram ignorados por dependências de identidade de boot ou WMIC indisponíveis no Windows. O smoke do servidor empacotado arrancou fora do checkout sem node_modules, verificou os 11 proxies, MCP stdio, exportação de backup encriptado e carregamento da camada enterprise. Corrigidos dois pressupostos de plataforma nos testes de preferências de microfone (URL de ficheiro e permissões POSIX), e o cabeçalho esperado do backup no smoke. Nenhuma destas correções altera o executável instalado.

## Correções após a primeira utilização

- A introdução criava uma falsa impressão de gravação quando não existia um agente: terminava imediatamente com `bot === null`. Agora cria pelo POST real, envia cor e instruções em `settings`, espera pelo registo devolvido e atualiza o roster. Falhas mantêm o formulário para repetir; submissões concorrentes são bloqueadas. O teste HTTP confirma nome, cor e instruções em `bots.json`, além do GET seguinte.
- O QR antigo era `orbit://pair`, destinado ao cliente nativo, e não abria na câmara Android sem essa aplicação. No Solar passa a HTTP/HTTPS `/solar`, com a credencial de uso único no fragmento. O browser mostra um botão explícito para ligar, agentes, conversa e envio. Mantém os bearers revogáveis e a allowlist do companion; apenas código público é servido sem autenticação. Outros origins e APIs de administração continuam recusados. Não abre portas na firewall nem ativa uma ligação de rede durante os testes. A ligação no Android físico depende de uma rota acessível, por exemplo o mesmo Wi-Fi.
- A identidade visível das traduções passa a Solar. O nome Solar é preservado apenas no link da aplicação iOS externa; identificadores internos de protocolo e históricos não são reescritos. Novas boas-vindas do Jarvis usam o nome do próprio agente.
- O catálogo Codex pede refresh e paginação, consulta o catálogo atual da conta no endpoint oficial OpenAI quando existe uma sessão compatível, e conserva o catálogo do CLI se essa consulta falhar. GPT-6.1 Sol e GPT-6 Luna aparecem também quando um CLI antigo ainda não os lista, marcados como disponibilidade não verificada; não substituem o modelo atual nem comprovam acesso à conta. A verificação local não obteve o catálogo público da conta, portanto manteve o fallback explícito. Referência: https://developers.openai.com/siwc/token-sharing-open-source/models-and-inference.

93 testes passaram nesta correção (introdução, gravação HTTP/disco, QR, companion, modelos, traduções). No browser, uma fixture emparelhou, enviou uma mensagem ao agente e recebeu a resposta do motor simulado. Evidência `docs/verification-evidence/solar-phone-browser-chat.png`; nenhum dado ou token real é mostrado. Chamadas e uso no Android físico continuam a requerer verificação pelo utilizador.

Verificação final: mais 290 testes de regressão passaram (Codex, proxy, dispositivos e rotas companion); dois foram ignorados. Build, TypeScript, lint e traduções passaram. O instalador atualizado foi aplicado e reabriu o Solar; o bundle principal servido corresponde ao build e `/api/instances` apresenta GPT-6.1 Sol e GPT-6 Luna, com a indicação de disponibilidade não verificada quando provêm do fallback. Os dados do utilizador não foram alterados para realizar estes testes.
