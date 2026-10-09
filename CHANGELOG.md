# Histórico do Solar

Este registo resume os marcos confirmados no histórico Git. As entradas de 3 de outubro são commits de desenvolvimento, não releases publicadas. Os links permitem consultar o código e o diff de cada alteração.

## 9 de outubro de 2026 — consumo e continuação no PC fixo (0.2.2 em desenvolvimento)

- Custos em euros com cotação BCE datada e exportação CSV identificada; valores
  estimados e desconhecidos distinguem-se dos custos reportados pelo fornecedor.
- Engine e disponibilidade refletem a conversa atual. Histórico durável atualiza
  após turnos; os contadores separam entrada, cache, saída e contexto.
- Prévia menor para resultados extensos das ferramentas Solar, com recuperação
  completa por páginas; contabilização dos resumos auxiliares de compactação.
- Testes relevantes e typecheck aprovados. Código preparado para continuar pela
  branch `codex/solar-android-and-chat`; instalador 0.2.2 ainda por gerar e instalar.
- Contexto e instruções em `docs/inventario-solar/CONTINUAR-DESKTOP-09-10-2026.md`.

## 8 de outubro de 2026 — ditado contínuo e progressivo (0.2.1)

- Ditado do campo de mensagem continua até Parar; deixam de existir o fim
  por pausa de 1,8 segundos e o corte de sessão aos 29 segundos.
- Texto progressivo em blocos curtos, com confirmação de frases completas
  e sobreposição de áudio nas divisões longas. Pedidos de reconhecimento
  serializados; cada clip mantém o limite de segurança de 29 segundos.
- Parar conserva o rascunho sem enviar, mostra finalização e bloqueia envio
  enquanto chegam as últimas palavras. Cancelamento impede resultados tardios.
- Modelo local final small multilingual Q5_1 instalado e verificado; prévias
  usam base para menor latência. Idiomas selecionados mantidos.
- 31 testes aprovados, incluindo fluxo do composer, 41 segundos de captura,
  pausas longas, áudio final, silêncio, idiomas e falhas. Modelos carregados
  no runtime real; precisão com microfone pessoal ainda por validar.

## 8 de outubro de 2026 — Alt+T e jardim 3D experimental (0.2.0)

- Alt+T Windows substitui a pílula por uma barra escura encaixada na margem
  direita, com recortes curvos e transcrição/avisos num painel à esquerda.
  Os controlos de voz existentes permanecem; recolher o painel conserva o
  texto, e uma nova chamada reinicia o estado de expansão. A área vazia
  mantém click-through. Inspiração observada no reel `DdTh89HxNeH`; o segundo
  reel fornecido ficou indisponível por restrição do Instagram.
- Jardim 3D experimental, com Jarvis central e ilhas por equipa derivadas
  do mesmo modelo do Solar original. Personagens com rostos, cabelo, roupa,
  acessórios, portáteis, movimentos de escrita, pestanejar e acenar.
- Quatro skins por agente, guardadas neste dispositivo; seleção no canvas
  ou na lista, órbita, zoom, pausa de animações e movimento reduzido.
- Entrada «3D» no Solar e retorno sem recarregar. As conversas continuam a
  usar o histórico e as ferramentas existentes, sem cópias de agentes.
- Tests isolados: 44 testes nativos do shell, fluxo Alt+T completo e fluxo
  do jardim com equipas, skins, falha de armazenamento e versões desktop/mobile.
  TypeScript da V2, lint dos ficheiros e catálogos de tradução válidos.

## 8 de outubro de 2026 — correção dos interruptores (Windows 0.1.99)

- Corrigida a regra global Solar que pintava de dourado toda a linha de um
  interruptor ativo e de preto os seus textos, metadados e indicador de estado.
- As duas famílias de interruptores identificam agora a pista e o botão móvel;
  o tema aplica as cores apenas a essas peças. A correção abrange todas as
  utilizações partilhadas: memória, voz, acesso, mapa e definições gerais.
- Teste de interface isolado verifica cores calculadas, textos compridos,
  estados ligados/desligados/desativados, encaixe, clique e teclado.
  Capturas desktop e mobile revistas; três testes aprovados.
- Lint dos ficheiros alterados e catálogos de tradução válidos.

## 7 de outubro de 2026 (noite) — identidade própria do Solar

Guardado no commit local `ed9250c` em 7/10 às 23:00 (Europe/Lisbon).
A consulta ao GitHub em 8/10 confirmou que este commit ainda não foi enviado:
`origin/codex/solar-android-and-chat` continua em `36ad27d`.

- **Vidro líquido real.** Cada controlo de vidro recebe uma lente SVG gerada
  à medida (`src/orbit/liquid-glass.ts`) que refrata o fundo junto ao
  rebordo; o texto nunca passa pelo filtro. Rebordo com brilho que segue o
  rato, três espessuras (controlos, compositor, menus) e menus que abrem com
  mola. Fora do Chromium fica só o desfoque; transparência reduzida respeitada.
- **Definições (proposta A, raios afinados).** Mantém a composição original
  em raios, mais compacta para caber com o chat aberto ou fechado; cada
  ferramenta é uma esfera de vidro, os textos à esquerda espelham-se e a
  selecionada fica dourada com a linha contínua e um ponto de luz a viajar.
  Painéis com o desenho original e destaques dourados em vez de azul.
  O painel Aparência, que tinha ficado sem estilo, foi refeito.
- **Partículas e caras próprias** (`src/orbit/solar-state-particles.ts`,
  substitui a camada herdada do Orbit): poeira em órbita inclinada que passa
  por trás dos corpos, anel dourado ao pensar, satélite de vidro com o ícone
  da ferramenta e cauda de cometa ao trabalhar, partículas reunidas no topo e
  "!" quando precisa de ti, explosão suave ao terminar e cometas entre
  agentes. As caras seguem o satélite, olham para cima ao pensar, sorriem ao
  terminar, arregalam os olhos ao receber e respiram a dormir.
- **Chat:** tokens, tempo e passos do turno aparecem por baixo da última
  resposta, a contar; botão de anexar passa a "+"; chamada em dourado.
- **Desenvolvimento das luas:** pré-visualização ao vivo de páginas com CSS,
  JavaScript (incluindo módulos), imagens e fontes relativas, por um link
  com segredo e sandbox CSP; modo lado a lado; acompanha as alterações do
  agente enquanto trabalha; endereço de um servidor local (localhost);
  separadores com fecho; Tab indenta; o editor já não perde o foco ao gravar;
  mais tipos de ficheiro (Vue, Svelte, SCSS, C/C++, Dockerfile…).
- **Ilha do Jarvis (Alt+J, só no Solar):** janela flutuante no canto
  superior direito do ecrã, fora da app, com o Sol; abre com mola e mostra
  voz (ditado → Jarvis → resposta lida em voz alta), quem está a trabalhar e
  as páginas partilhadas, que abrem na app.
- **Português de Portugal a 100%:** todas as frases traduzidas e as antigas
  em português do Brasil convertidas; a língua aparece como "Português
  (Portugal)" e o idioma do sistema escolhe-o automaticamente.
- **Definições:** língua escolhida mostrada corretamente; caixas, seletores,
  interruptores e botões a dourado.
- **Planetas com identidade para a vida:** cada agente guarda a sua pele
  (`solar-skins.ts`); reordenar equipas já não muda nomes nem texturas, e a
  pré-visualização da criação mostra o corpo exato (planeta ou lua).
- **Sem restos do Orbit visíveis:** barra rápida, voz, onboarding, cartões,
  chamada e ecrã de arranque em dourado com o Sol; o Jarvis apresenta-se como
  Jarvis na demonstração; a cena escondida do Orbit já não corre.
- **Correções da auditoria:** tokens Solar também em diálogos e na paleta,
  luas com a pele certa na paleta de comandos, cache do vidro limitada,
  contexto WebGL libertado quando as texturas falham, `pnpm lint` sem avisos.

## 7 de outubro de 2026 — partículas e primeira interface Android Solar

- Windows 0.1.97: ditado mais robusto ao cancelar durante a abertura do
  microfone, iniciar duas capturas e receber resultados tardios. Erros de
  transcrição separados de permissões; avisos para microfone ausente/ocupado,
  silêncio sem alterar o rascunho, pausas de 1,8 s no ditado e preferências
  mantidas na sessão quando o armazenamento falha.

- Windows 0.1.96: idiomas do ditado selecionáveis em Definições → Voz,
  guardados por dispositivo. Português e inglês inicialmente selecionados;
  vários idiomas ativam deteção automática no motor local para frases mistas.
  Um idioma fixa o reconhecimento; a alternativa do navegador usa o primeiro.

- Windows 0.1.95: barra de scroll da conversa termina acima do campo de
  mensagem e acompanha a altura do compositor.

- Windows 0.1.94: ditado no campo de mensagem das conversas Solar, incluindo
  Jarvis, usando o mesmo motor de voz do mapa. Microfone visível no Windows,
  parar/cancelar e transcrição editável antes do envio.

- Windows 0.1.93: removida a faixa de apps/atalho adicionada na versão 0.1.92
  a pedido do utilizador; restaurado o enquadramento anterior do mapa.

- Windows 0.1.92: faixa de apps no mapa Solar com ícones, nomes e estados reais
  de configuração/autenticação. Acesso direto ao painel de ligações, estados
  de erro e atualização; disposição adaptada a ecrãs estreitos.

- Windows 0.1.91: exportação e importação de um planeta com identidade,
  instruções, memória e histórico. Atualizações juntam conversas sem duplicar
  o agente; confirmação, cópia de segurança e recuperação em caso de falha.
  [Como levar um planeta entre PCs](docs/inventario-solar/PLANETAS-PORTATEIS-07-10-2026.md).

- Windows 0.1.90: envio e resposta da coordenação entre agentes acionam as
  partículas em tempo real, sem depender da consulta periódica ao mapa.
- Windows 0.1.89: pedidos entre agentes seguem o modelo da conversa atual
  do destinatário, sem regressar ao antigo modelo predefinido do perfil.

- Windows 0.1.88: ligações permanentes de partículas, preservando as animações
  de conversa, resultados, receção e encaminhamento entre agentes.
- Android 1.0.1 preview: mapa Solar, identidades celestes, Manrope e tema
  grafite/dourado; conversas, pesquisa, aprovações e seleção por telefone mantidas.
- Chamada Android por turnos: áudio limitado a 29 segundos, Whisper autenticado
  no PC, fala no telefone e cancelamento ao sair ou perder a ligação.
- Fixtures Windows: asserção OAuth ajustada ao sistema de permissões e
  encerramento da árvore de motores de teste para evitar processos abandonados.
- SDK/JDK Android Studio reutilizados; assinatura original pode ser fornecida
  ao script sem guardar chaves no Git.
- [Estado, verificações e pendentes](docs/inventario-solar/CONTINUACAO-07-10-2026.md).

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
