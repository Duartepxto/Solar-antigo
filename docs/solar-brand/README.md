# Solar — identidade rejeitada (histórico)

**Estado atualizado em 10 de outubro de 2026: o utilizador rejeitou explicitamente a proposta «Sol aberto» e o primeiro redesign da entrada. Esta direção não está aprovada e não deve ser integrada, publicada ou usada como base para novas variações.** Os SVG, a prancha e as regras abaixo conservam o rascunho para análise histórica; a verificação técnica do HTML não constitui aprovação estética. A pesquisa que substitui esta direção está em [PESQUISA-IDENTIDADE-SOLAR-10-10-2026.md](../inventario-solar/PESQUISA-IDENTIDADE-SOLAR-10-10-2026.md). Nesta fase estuda-se a identidade online antes de desenhar ou aplicar outra proposta.

Proposta de 10 de outubro de 2026. Esta pasta é uma prancha de identidade e fontes vetoriais; não é uma landing page, uma release ou uma aprovação de marca. Não altera o mapa, o onboarding ou os ícones instalados. Abrir `index.html` no browser para comparar as aplicações.

## A ideia

Solar organiza trabalho entre agentes que uma pessoa consegue ver, abrir e orientar. O desenho deve tornar essa estrutura reconhecível antes de tentar transmitir «inteligência artificial».

**Sol aberto** conserva o núcleo circular e os raios do Sol existente. Um arco exterior interrompido e dois pontos distintos representam os agentes à sua volta. O núcleo continua a ser o centro da coordenação; a abertura impede que o símbolo pareça um selo fechado. O arco pertence ao símbolo de marca: não autoriza acrescentar órbitas gráficas ao mapa aprovado.

O traço é plano, legível e sem glow, rosto ou textura. A aplicação já tem corpos 3D expressivos: a marca funciona como assinatura estável, não como outro avatar de Jarvis. Não se usa o mascote herdado nem o habitual conjunto de estrelas de uma marca AI. A proposta precisa de uma revisão de semelhança e disponibilidade do nome antes de publicação; originalidade editorial não equivale a disponibilidade legal.

## Nome e hierarquia

- **Solar**: nome do produto, instalador, APK, site, menus, suporte e documentação pública.
- **Jarvis**: nome do agente principal deste workspace. «Fala com Jarvis» só onde esse agente existe; «Abre o Solar» para a aplicação.
- **Agentes / equipas / conversas**: termos funcionais. Planetas e luas ajudam a explicar o mapa; não obrigam a renomear entidades, IDs, backups ou protocolo.
- **Solar Preview**: mantém-se enquanto a distribuição for uma prévia. Não remover o aviso através de uma troca de logo.

## Fontes e variantes

| Ficheiro | Uso | Regra |
|---|---|---|
| `solar-emblem-gold.svg` | Fundo grafite, cabeçalhos, identidade | Símbolo completo, 32 px ou maior |
| `solar-emblem-ink.svg` | Fundo claro, impressão | Mesma geometria, uma tinta escura |
| `solar-emblem-mono.svg` | Uma tinta, incorporação inline | Usa `currentColor`; ao inserir inline remover/adaptar `color` fixo |
| `solar-micro-gold.svg` | Favicon e bandeja escura | Desenho próprio para 16–24 px |
| `solar-micro-ink.svg` | Bandeja clara | Mesmo micro-símbolo em tinta escura |

Os SVG não incluem scripts, fontes externas ou imagens raster. A prancha usa o Manrope local do projeto. O wordmark é **Solar**, Manrope 550, tracking −0.02em; mantém maiúscula inicial. O texto continua texto nesta fase para permitir revisão; uma fonte convertida em contornos só faz sentido após escolha final. Manrope tem licença SIL OFL no diretório original `orbit-app/public/solar/fonts/`.

Espaço livre mínimo: um raio do núcleo em todas as direções. Não esticar, inclinar, reconstruir raios, fechar o arco, pôr um planeta com rosto no núcleo ou acrescentar glow. Não reduzir a versão completa abaixo de 32 px. O micro-símbolo elimina raios diagonais e o segundo arco; não é uma miniatura automática da versão grande. A comparação 16/20/24/32/64 px está na prancha.

Para Android, manter foreground/background de adaptive icon separados e rever a zona segura com máscaras circular, squircle e arredondada. Para Windows, gerar ICO multiresolução com o micro nos tamanhos pequenos e o completo nos grandes; conferir bandeja clara/escura, taskbar e instalador no sistema real. **Estes ficheiros são fontes de revisão, não exports nativos já validados.**

## Sistema visual que se conserva

A fonte de implementação é `orbit-app/src/orbit/solar.css`, não a soma de valores históricos em documentos. A prancha usa os valores reais: campo `#050607`, painel `#15191f`, menus `#171b21`, texto `#f2f3f5`, secundário `#a1a7b3`, ação/foco `#ddbd89`, texto sobre dourado `#191b20`. O Sol 3D mantém a sua paleta material âmbar; não se pinta todo o mapa de dourado.

O fundo claro da prancha serve para testar o símbolo em papel e superfícies externas; não propõe um tema claro novo para a aplicação. Vidro é uma superfície de controlo com conteúdo nítido. Na marca e em documentação não se simula vidro, profundidade ou um desktop falso.

Profissionalizar significa consistência entre entrada, janelas, APK e suporte; ações claras; tipografia legível; erros recuperáveis; previsibilidade da navegação. O mapa, personagens e partículas aprovadas são a memória visual que se preserva. Não se substituem por dashboard de cartões para parecer «enterprise».

## Voz

Falar com precisão, em português europeu ou inglês. Preferir verbos de ação e objeto: «Ligar ao computador», «Escolher motor», «Rever pedido». Um erro explica o que falta e a próxima ação. «Computador desligado. Abre o Solar no PC e tenta novamente.» é melhor que «Falha inesperada». Evitar superlativos, promessas de autonomia total, humanização enganadora e slogans sobre magia.

| Situação | Português | English |
|---|---|---|
| Apresentar | O teu trabalho, com uma equipa de agentes à vista. | Your work, with a team of agents in view. |
| Explicar | Coordena agentes no PC e acompanha as conversas no Android. | Coordinate agents on your PC and follow conversations on Android. |
| Preparar | Escolhe um motor e confirma que está ligado. | Choose an engine and check that it is connected. |
| Dar controlo | Revê o pedido antes de permitir esta ação. | Review the request before allowing this action. |
| Custo desconhecido | O fornecedor não reportou o custo deste turno. | The provider did not report the cost of this turn. |
| Estimativa | Custo estimado; pode diferir da cobrança do fornecedor. | Estimated cost; it may differ from your provider bill. |

«Local» descreve a aplicação e o armazenamento que se provar local. Não significa que pedidos aos modelos, Apps ou serviços externos ficam no dispositivo. «Android» descreve o companion ligado ao PC, não agentes autónomos no telefone. «Controlo» não equivale a execução infalível. Não apresentar a contagem de tokens como fatura ou valor desconhecido como zero.

## Integração futura

Após escolha da proposta, definir uma fonte vetorial canónica e derivações reproduzíveis. Substituir de forma coordenada favicon, cabeçalho, carregamento, Windows ICO/PNG, Android adaptive icon e materiais de suporte. Atualmente existem geometrias diferentes em `public/solar-icon.svg`, `scripts/build-solar.mjs` e `android/app/src/main/res/drawable/ic_solar_launcher.xml`; trocar só o favicon mantém a inconsistência.

Critério de aprovação: reconhecer o mesmo Solar a 16 px e num ecrã de entrada; ver o Sol antes de ver uma marca de energia ou uma órbita genérica; conservar contraste sobre fundos permitidos; não confundir o logo com o avatar de Jarvis. A integração, as capturas nativas e a procura de colisões de marca continuam tarefas posteriores.
