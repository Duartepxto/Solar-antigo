---
name: Solar — previews autónomos
description: Canvas celestial Solar, mobile vertical e companion na margem direita do PC.
colors:
  ground: "#050607"
  ink: "#e4e8ee"
  secondary: "#a9b4c2"
  gold: "#edc77e"
  line: "#ffffff1c"
  field: "#101318"
  notch: "#090b0e"
typography:
  body:
    fontFamily: "'Jarvis Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "14px"
    lineHeight: 1.5
  mobile-title:
    fontFamily: "'Jarvis Manrope', sans-serif"
    fontSize: "21px"
    fontWeight: 500
    letterSpacing: "-.025em"
  event-title:
    fontFamily: "'Jarvis Manrope', sans-serif"
    fontSize: "19px"
    fontWeight: 500
  label:
    fontFamily: "'Jarvis Manrope', sans-serif"
    fontSize: "12px"
  supporting:
    fontFamily: "'Jarvis Manrope', sans-serif"
    fontSize: "11px"
    lineHeight: 1.5
rounded:
  composer: "28px"
  action: "24px"
  mobile-user-message: "18px"
  mobile-activity: "16px"
  notch-expanded: "26px"
  mobile-sheet-top: "24px"
components:
  companion-composer:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    rounded: "{rounded.composer}"
    padding: "7px"
  companion-action:
    textColor: "{colors.ink}"
    rounded: "{rounded.action}"
    padding: "10px 18px"
---

# Design System: Solar — previews autónomos

## Overview

**Creative North Star: "O canvas Solar"**

Estender o mundo existente: chão quase preto, luz dourada, Sol expressivo,
planetas e luas com os materiais do Solar antigo. O trabalho é visível através
da equipa; conversa, delegação e decisões conservam o contexto do agente.
Manrope, ícones Lucide e os renderizadores celestiais existentes são a identidade.
Nenhum novo raster foi gerado para estas extensões.

Este documento descreve apenas os HTML autónomos nesta pasta, em 13/10/2026.
[DESIGN-ACTIVE.md](DESIGN-ACTIVE.md) e [DESIGN-OWN.md](DESIGN-OWN.md)
continuam a autoridade das decisões confirmadas do PC. As superfícies mobile e
notch são extensões separadas; não substituem essas decisões nem as regras de
produção da aplicação. As instruções humanas mais recentes governam este preview
quando divergem de orientações históricas de PRODUCT.md.

**Key Characteristics:**

- Canvas amplo e escuro com personagens reconhecíveis.
- Controlos discretos, ícones sem esferas decorativas e dourado para foco/ação.
- PC com atalhos irregulares ligados por fragmentos ondulados e chat persistente.
- Mobile vertical e notch da margem direita com composições próprias.
- Atividade, aprovação, falha, ligação e interrupção legíveis.

## Colors

A paleta une grafite frio e luz quente. Os valores da frontmatter são os tokens
comuns observados nos companions; os estilos herdados do PC conservam as suas
variações existentes de tinta e dourado.

### Primary

- **Dourado Solar (`gold`):** seleção, foco, autorização e sinais de atividade.
  Não transformar cada elemento num botão preenchido; o dourado distingue ações.

### Neutral

- **Chão (`ground`):** continuidade do canvas e das superfícies mobile.
- **Tinta (`ink`):** mensagens, nomes e títulos.
- **Texto secundário (`secondary`):** estado, ajuda, hora e metadados.
- **Linha (`line`):** divisões leves e limites dos controlos.
- **Campo (`field`):** composer e seleção de estados.
- **Notch (`notch`):** superfície opaca do companion.

Falha usa coral suave; conclusão usa verde suave, acompanhados por texto e ícone.
Transferências no mapa preservam a cor do emissor. Estes sinais não substituem
os nomes dos estados.

## Typography

Manrope local, registada como `Jarvis Manrope`, mantém a voz visual existente.
Títulos compactos usam peso médio e espaçamento ligeiramente fechado; texto da
conversa conserva espaço entre linhas. No mobile, mensagens usam (14px) com
entrelinha (1.7); na notch, (13px) com entrelinha (1.65). Metadados usam
(10–11px), com numerais tabulares para valores, tempo e custos.

Os rótulos do PC têm nome e legenda separados. Nomes não se partem a meio;
reduzir ou reposicionar dentro dos limites do canvas antes de cortar controlos.

## Layout

**PC — Solar.html.** Mapa e chat partilham o viewport. O Sol conserva o centro
da composição local; atalhos ocupam distâncias diferentes, ligados individualmente
por fragmentos. Definições abrem à volta de Jarvis com o chat visível. Detalhes
e desenvolvimento usam o espaço ao lado da conversa. Não reintroduzir os anéis
ou uma sidebar. Agenda permanece uma ação do Sol.

**Entrada — Solar-entrada.html.** Preservar a apresentação aprovada de seis passos
e o mesmo Sol. A pequena elipse de entrada usa o movimento existente; respeitar
interrupção e movimento reduzido.

**Mobile — Solar-mobile.html.** Mapa vertical com Sol, dois planetas e quatro luas.
Nome e identidade do agente independem da skin. Cabeçalho e atividade precedem
o conteúdo; composer e navegação ficam no fundo, fora da área que percorre as
mensagens. Equipa, Conversa, Agenda e Atividade são os destinos implementados.
Até (540px) de largura, a superfície ocupa (100dvh), sem moldura ou cantos de
telefone. Em viewport amplo, a moldura de demonstração limita a largura a
(420px). Insets seguros protegem cabeçalho e navegação. Em altura inferior a
(670px), o mapa reduz escala; o composer permanece alcançável.

**Notch — Solar-notch.html.** Companion absoluto na margem direita, compacto
(256px), expandido até (420px), limitado pelo viewport. Em desktop fica a
(20px) da direita e (24px) do topo; não altera o fluxo do documento. Atividade
e Conversa partilham o conteúdo expandido. `Alt+T` abre/recolhe nesta página;
`Esc` recolhe. O seletor de estado pertence à demonstração.

## Elevation & Depth

As personagens procedurais, fragmentos e luz do Sol dão profundidade ao canvas.
O chat do PC não ganha um card exterior. Superfícies que precisam de separar
ações — notch, atividade mobile, composer e menus — usam fundo sólido, linha
suave e sombra localizada. A notch usa sombra (0 20px 65px -20px #000b);
não aplicar esta sombra a cada linha ou painel.

Movimento explica presença, trabalho e mudança de estado. Fragmentos do menu
contornam as áreas dos nomes, mantêm a escala física das ondas e suspendem o
loop com documento oculto; a pintura limita-se a cerca de (30fps). Os companions
removem animações, transições e scroll suave com movimento reduzido. A transição
de largura da notch (420ms) foi aceite na revisão como morph limitado de um
elemento absoluto; não generalizar esse tratamento a layouts de página.

## Shapes

Controlos do canvas são abertos e leves. Bordas arredondadas pertencem aos
elementos que encerram interação: composer em cápsula, ações em pílula, mensagens
do utilizador e superfície compacta/expandida da notch. As personagens mantêm
volume celestial, não se convertem em ícones genéricos ou avatares empresariais.
Os menus mobile implementados têm topo arredondado e fundo opaco; são uma decisão
deste preview, não uma autorização para alterar toda a navegação de produção.

## Components

- **Atalhos do PC:** ícone Lucide, nome e legenda, sem esfera decorativa.
  Seleção ilumina o percurso; hover e foco tornam a ação legível. Fragmentos
  não atravessam nomes. Conservar os atalhos dentro do espaço disponível.
- **Composer:** texto editável, anexação demonstrativa e envio; interrupção
  permanece visível durante atividade. Mobile conserva rascunho por agente,
  modelo selecionado e mensagem enviada depois de parar uma resposta.
- **Execução:** uma linha de estado e outra de comando atual; expansão revela
  passos completos. Histórico por turno/digest, no máximo uma ação atual em
  trabalho. Recuperação exige uma operação subsequente bem-sucedida.
- **Métricas:** no PC, apresentar apenas métricas do turno/digest correspondente.
  Nos companions, estatísticas exemplificativas dependem de `exampleMetrics`
  e mostram explicitamente “Simulação”. Uma interrupção não recebe métricas
  inventadas nem herda as de uma resposta anterior.
- **Atividade e decisões:** distinguir trabalho, autorização, recusa, conclusão,
  falha, ligação indisponível e cenas de voz. Autorizar/Recusar ficam junto do
  pedido; pedido offline permanece em espera. Histórico demonstrativo limitado
  a (24) notificações.
- **Agenda:** calendário, seleção de dia e criação/edição/remoção local de eventos;
  dias selecionados usam preenchimento dourado. Não apresentar estes eventos
  como tarefas executadas por um backend.
- **Menus mobile:** foco inicial, Tab contido e devolução ao controlo de origem
  ao fechar. O contorno de foco dos companions é dourado (2px), afastado (3px).
  Preservar alvos mobile usuais de (44px), sem esconder ações quando falta espaço.

## Do's and Don'ts

- **Do** preservar Sol, planetas, luas, Manrope local, Lucide e o mapa aprovado.
- **Do** conservar as decisões desktop de DESIGN-ACTIVE.md e DESIGN-OWN.md.
- **Do** manter nome, modelo, conversa e memória coerentes com o agente escolhido.
- **Do** verificar mapa, chat, interrupção e notch compacta/expandida visualmente.
- **Do** tratar estes HTML como simulações locais com ligações externas bloqueadas.
- **Don't** voltar a usar órbitas circulares de menus, raios contínuos ou sidebar.
- **Don't** esconder Stop, cortar atalhos ou pintar fragmentos sobre os nomes.
- **Don't** apresentar custos demonstrativos como medições reais.
- **Don't** declarar push, Live Activities iOS, overlay/atalho global Windows,
  captura de microfone ou ligação ao backend como implementados nestes previews.
- **Don't** converter a aprovação deste entregável em prontidão de produção.

A evidência e os limites estão em [COMPANIONS.md](COMPANIONS.md). Capturas:
[PC](solar-audit-pc.png), [mapa mobile](solar-mobile-map.png),
[chat mobile](solar-mobile-chat.png), [interrupção](solar-mobile-interrupted.png),
[notch expandida](solar-notch-expanded.png) e [notch compacta](solar-notch-collapsed.png).
Teste num telefone físico e integrações nativas continuam pendentes.
