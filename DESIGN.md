---
name: "Jarvis 3.0 Solar Workspace"
description: "A luminous solar workspace built from beveled block fragments, with quiet glass controls."
colors:
  amber-interface: "#eac185"
  sun-amber: "#e05a15"
  earth-ocean: "#164d88"
  earth-teal: "#55a48a"
  saturn-gold: "#ceb993"
  mars-warm: "#c8784e"
  moon-slate: "#66758b"
  space-black: "#050607"
  ink: "#f2f3f5"
  muted: "#a1a7b3"
  hairline: "rgba(255,255,255,.12)"
  hierarchy-line: "#b7c0ce"
typography:
  title:
    fontFamily: "'Jarvis Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "19px"
    fontWeight: 500
    letterSpacing: "-.01em"
  planet-name:
    fontFamily: "'Jarvis Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "14px"
    fontWeight: 500
    letterSpacing: "-.01em"
  moon-name:
    fontFamily: "'Jarvis Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "13px"
    fontWeight: 500
    letterSpacing: "-.01em"
  body:
    fontFamily: "'Jarvis Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "12px"
    fontWeight: 400
rounded:
  circle: "50%"
spacing:
  tight: "5px"
  control-gap: "10px"
  item-inset: "12px"
  mobile-edge: "18px"
  desktop-edge: "30px"
components:
  button-glass:
    textColor: "#d2d5dc"
    rounded: "{rounded.circle}"
    height: "38px"
    width: "38px"
  button-send:
    backgroundColor: "#e6c899"
    textColor: "#1c1c20"
    rounded: "{rounded.circle}"
    height: "34px"
    width: "34px"
  button-send-hover:
    backgroundColor: "#f6dcb4"
  search:
    textColor: "#d2d5dc"
    rounded: "22px"
    height: "38px"
    padding: "0 14px"
  composer:
    textColor: "#f2f3f6"
    rounded: "27px"
    height: "48px"
    padding: "5px 6px"
  menu:
    backgroundColor: "#171a20"
    textColor: "#e5e8ef"
    rounded: "17px"
    padding: "6px"
  recipient:
    backgroundColor: "#0003"
    textColor: "#e4d3bb"
    rounded: "20px"
    height: "36px"
    padding: "0 9px 0 4px"
---

# Design System: Jarvis 3.0 Solar Workspace

## Overview

**Creative North Star: "The Luminous Solar Workspace"**

Jarvis is a quiet local agent workspace in a luminous solar map. A near-black field and illuminated planetary volumes make agent hierarchy tangible. Visible individual beveled square fragments build curved bodies: broad lighting describes planetary curvature, and coherent colors preserve the closed surface. The collection includes an emissive amber Sun, all eight recognizable planetary materials and five Moon variants. Each skin has its own simple luminous eyes without pupils or reflected highlights seated in carved apertures and a mouth groove shaped in the surface. Recess normals and lens geometry catch the scene light.

The interface is capable and quiet. Locally hosted Manrope, explicit agent labels, understated straight hierarchy strokes and translucent glass controls support inspecting the hierarchy, freely arranging bodies, opening an agent and sending a message. This document records the active homepage in orbit-app, launched through chatgpt-3.0/run.mjs; it does not prescribe the original Orbit focused pages. The persistent launch reflects actual backend agents. The user-selected isolated fixture displays the Sun, eight leads and five moons together, clearly labeled as a simulated engine. Earlier root HTML and robot studio guidance is archived in [DESIGN-before-solar.md](chatgpt-3.0/experiments/DESIGN-before-solar.md).

This is a verified visual prototype, not an approved exact reproduction of the reference image or a guarantee of legibility and performance on every device. Current evidence covers the complete collection at desktop (1196×930 and 1280×720), portrait (390×844), quick settings and creation menu in [.impeccable/review/solar-system/](.impeccable/review/solar-system/). Full spring-following drag, custom connection editing, further event choreography and secondary-page redesign remain roadmap work in [PLANO-DE-DESIGN.md](chatgpt-3.0/PLANO-DE-DESIGN.md).

**Key Characteristics:**

- Two scales of beveled fragments form coherent volumes: larger separated blocks over smaller recessed particles.
- Curved eye lenses sit inside material-carved apertures; lens movement and the mouth's surface fields animate separately.
- Distinct colors and procedural or sampled surface fields identify eight planets and five Moon materials.
- Readable names and status labels coexist with the freely arranged map.
- Quiet straight strokes show actual parent-to-agent hierarchy, without rectangular label cutouts or system orbit ellipses.
- Restrained glass controls and locally hosted Manrope support the hierarchy.
- Sparse circular luminous surrounding particles, returning local dents and bounded fragment lag retain the closed shell; reduced motion and page visibility govern movement.

## Colors

Warm interface light and distinct planetary materials sit against an almost black, slightly cool field; the frontmatter holds the normative color values.

### Primary

- **Amber Interface:** Brand mark, transient event emphasis and input caret; warm action light remains restrained.
- **Sun Amber:** A central fragment palette anchor used by the Sun's fragments, debris and halo. The Sun also uses darker recess colors and a separate amber emissive core; this anchor is not a flat fill.

### Secondary

- **Earth Ocean / Earth Teal:** Blue water and teal land sample colors make Earth recognizable without a photographic shell. Other skins use coherent procedural fields: Mercury's gray craters, Venus's cream marbling, Jupiter's belts and storm, Uranus's pale cyan and Neptune's deep blue bands.
- **Saturn Gold:** A fragment palette anchor for Saturn; its ring mixes restrained gold particles and a darker gap.
- **Mars Warm:** A warm terracotta palette anchor for Mars, with brighter and darker tiles forming volume.

### Tertiary

- **Moon Slate:** The neutral gray-blue anchor for secondary bodies; the Moon collection also includes ice blue, volcanic dark warmth, sand and bright cratered materials. These variants do not replace explicit member names.

### Neutral

- **Space Black:** Root and map background, preserving a continuous field behind the single 3D scene.
- **Ink:** Default interface text.
- **Muted:** Secondary summary copy; names and essential statuses have brighter local treatments.
- **Hairline:** Shared glass borders.
- **Hierarchy Line:** The retained neutral connection anchor. The active map uses partial-opacity gradients between parent and child skin colors, beneath the bodies, with soft glyph shadows for label contrast; the anchor is not the current line's flat stroke.

**The Material Identity Rule.** Planet color describes a material and hierarchy role, while state uses its own small indicator and label. Do not replace named statuses with color alone.

**The Fragment Color Rule.** Main-map surface rasters supply fragment color samples only; recognizable form comes from geometry, lighting and particle construction. Recipient thumbnails may use masked maps.

## Typography

**Display Font:** Jarvis Manrope, with the platform sans fallback stack in the frontmatter.
**Body Font:** Jarvis Manrope, using the same stack.

**Character:** The locally hosted variable Manrope face supplies restrained focal lettering and a compact interface voice. Weight and size distinguish hierarchy; essential information uses readable mixed case rather than decorative display copy.

### Hierarchy

- **Title:** The central Jarvis name uses the title role; it becomes smaller (16px) at the compact CSS breakpoint.
- **Planet Name:** Planet names use the planet-name role, followed by lead/team and status lines on desktop. Compact names become smaller (13px); the complete collection puts each planet name and status together on one line.
- **Moon Name:** Named moons use the moon-name role; compact names become smaller (12px).
- **Body:** Secondary lead/team/status lines and input text use the body role. Compact team and status lines become smaller (11px). Dense portrait planet statuses currently use a smaller inline treatment (10px); this constrained prototype treatment is not the default for new informational text.
- **Brand:** The header uses a medium variable weight (550) and compact lettering (15px desktop, 13px compact); its small workspace description is secondary.

**The Measured Label Rule.** Fit the camera against rendered label rectangles after the local font is ready, including translated names, lead/team copy and statuses. Character-count estimates are only the loading fallback.

The source face is orbit-app/public/solar/fonts/Manrope-Variable.ttf; its SIL Open Font License 1.1 is included alongside it. Utility hints and credits are smaller than agent names and essential state copy; their sizing is not the default for new informational text.

## Layout

The map is a full spatial field rather than a card grid. Jarvis occupies the Sun, team leads occupy planets and members occupy named moons. With five or more leads, desktop distributes planets above and below the central Sun, allocating moons to the outer sides. The current fixture shows all eight planets simultaneously. Straight SVG lines connect actual parents and children, covering Sun-to-lead and lead-to-member relationships; they are visible by default and can be toggled. Lines use skin-color gradients at partial opacity (0.3, rising to 0.85 on hover or drag), with a fine stroke (0.9px), endpoints clear of body centers and continuous strokes beneath softly shadowed text. There are no system orbit ellipses. Saturn's and Uranus's particle rings belong to their bodies. Body, ring and label extents participate in camera fitting. Header, composer, footer credit and map tools retain their reserved areas.

Below the compact map breakpoint (650px), the complete collection uses two vertically separated planet columns beneath the Sun, with moons placed outward. Each planet's name and state sit together on one line beneath its body, retaining the status text and colored dot clear of the next row's artwork. Team detail is hidden in this dense compact layout; real agent names remain in accessible body labels and the recipient picker. The 390×844 fixture composition retains all 14 body labels. Smaller rosters keep the existing side-label layout and wide-compact alternation from 500px. The CSS compact breakpoint applies at widths up to 650px, while the spatial compact model uses widths below 650px. At the wider chrome breakpoint (1000px), the hint is hidden and the composer moves to the right.

Desktop header edges use the desktop-edge spacing token. Compact composition uses the mobile-edge token around the composer and map tools, with a separately observed header inset (19px). Repeated small gaps and item padding use the frontmatter spacing roles. The system has a compact control rhythm, not an invented global spacing scale.

**The Whole Group Rule.** A planet's visual bounds include its rings and its labels; its moons retain their relationship when that planet moves. Do not fit only the center points of a group.

**The Reserved Bands Rule.** Keep the compact save notice in its own band above the toolbar and composer, clear of moon status labels. Preserve the fit's top and bottom reservations when changing the map.

## Elevation & Depth

Depth has two distinct sources: real 3D fragment construction in the map, and shallow glass layering in the interface. Body cores, visibly beveled individual fragments, broad normal shading, selective rim light and detached luminous cubes around every body give planets volume. Facial cavities displace both core and fragment vertices through common surface fields, with surface-gradient normals describing their bowls, lips and mouth groove. Curved lens meshes sit behind the carved eye openings with a per-skin shape, slope and light tint. The Sun combines emission with a soft halo; Saturn has a broad gold particle ring, while Uranus has a subtler translucent icy ring. A faint star field and understated straight hierarchy strokes support orientation. Glass uses a fine border, translucent diagonal gradient, an inset glint and an ambient black shadow; menus use a more opaque surface and stronger ambient shadow.

### Shadow Vocabulary

- **Glass Ambient:** Shared translucent header actions, map controls, composer and connection notice; the full gradient, blur, border and shadow recipe is in the sidecar.
- **Menu Ambient:** Floating creation and recipient menus; the full opaque recipe is in the sidecar.

**The Coherent Volume Rule.** Let broad light-to-shadow transitions establish curvature before individual tile variation. Preserve recessed fragments and sparse debris; avoid random white speckling that overwhelms the body.

**The Returning Shell Rule.** Mouse and pen proximity may make a local inward dent and bounded gaze response, but never scatter or open the planetary shell. Smoothly return the material and gaze when the pointer leaves.

Decorative rotation is slow (Sun 0.025 radians/second, other bodies 0.032), with a 1.4 activity multiplier. Occasional short blinks and smoothly blended expression changes add restrained character. Working narrows the eye apertures, waiting raises and opens them slightly and blocked turns the small mouth groove downward; these expressions derive from backend state and do not imply semantic success. Reduced motion, paused state and a hidden page stop the continuous animation loop; state changes remain visible without moving transitions and the eyes stay open. Reduced motion also suppresses the moving pointer response. Sending, receiving and activity-ending pulses are transient; the activity-ending pulse indicates that activity stopped, not semantic task success. The renderer owns one WebGL context and disposes its scene resources when removed.

## Shapes

Circular body targets follow planetary silhouettes, with a minimum interactive diameter (44px). Moons also retain a minimum visible diameter (44px). The renderer enlarges facial fields for small moons (up to 1.35) and small planets (up to 1.3); these mechanisms do not guarantee face legibility. Individual square blocks are extruded and beveled, with luminous cubes surrounding every body; circular icon buttons and pill-shaped search, recipient and composer controls balance those fragments. Floating menus have gently rounded corners, fine strokes and compact inset rows. Ring extent is part of the silhouette rather than an afterthought.

## Components

### Buttons

Quiet glass icon actions are circular; the warm send action is the principal filled control. Default dimensions and variants are recorded in the frontmatter. Hover introduces a slight surface lift in tone; keyboard focus uses a warm outline (2px, 3px offset). At the compact CSS breakpoint, header search/settings/create controls, map tool buttons and send controls have touch targets (44px); the recipient also grows to that minimum height. Disabled send uses subdued neutral styling and remains unavailable for an empty draft or disconnected session.

### Inputs / Fields

The composer is a glass capsule containing a recipient picker, transparent text field, microphone and circular send action. The field has light text, muted placeholder copy and an amber caret. Focus within warms the capsule border. The microphone transcribes into the editable draft through native macOS or browser speech recognition when available; stopping retains the text for review. Browser support and speech-provider availability vary, and live hardware capture has not been verified. The recipient remains explicit, names may truncate within the control, and the picker exposes actual backend agents. Its miniature planets use cached captures of the actual fragment renderer; the main map retains geometric fragment construction.

### Navigation

The header preserves Jarvis branding, search, settings and creation actions. Desktop search includes its text and keyboard shortcut; compact search keeps the SVG search icon and an accessible label. Settings open a small quick panel for motion, mouse interaction, surrounding particles, connections and glow, with a link to application settings. These choices are local preferences; glow ranges from 0.6 to 1.4. Creation offers three icon-and-description entries: agent, team and conversation. It supports Arrow Up/Down, Home/End and Escape, opens on the first entry and restores focus to its trigger on Escape. Shared action semantics, explicit labels and focus treatment carry across keyboard and touch interaction.

### Cards / Containers

The reusable floating container is the menu: an opaque dark surface with a fine gray border, ambient shadow, rounded frame and padded rows. Recipient menus add scrolling for larger rosters. Glass containers remain shallow and translucent; they do not become large opaque dashboard cards over the map.

### Solar Agent Body

The 3D scene is decorative rendering beneath real DOM buttons and readable labels. Selecting a body opens its existing agent conversation. Pointer drag rearranges it; keyboard arrows move it (12 units, or 40 with Shift), and undo restores arrangements. Planet movement carries its moons because offsets are parent-relative. The map supports panning, zoom, fit, relationship visibility and reset without treating activity changes as a reason to discard the user's camera.

The shared surface shader carves the face into both the body core and its fragments, and opens apertures onto curved 3D lens meshes seated inside the wells. Each Sun, planet and Moon skin has its own eye shape, recess depth, mouth curve and material tint. Separate lenses animate position, tilt and opening; the mouth curve animates through the surface field. Both layers use the same facial and pointer fields, while lenses follow the same inward dent. Blinking, gaze and working/waiting/blocked expressions are available; Continuous surface rotation, orbiting debris, breathing aura, activity satellites and bounded sending/receiving particle streams are implemented. Readable status text remains the explicit source of agent state.

Native mouse and pen pointer events feed renderer coordinates without React state updates for proximity movement. The Gaussian inward field is bounded to a maximum (17% of the body radius), weighted by front-facing depth and proximity. The cursor also curls surface tiles sideways and stirs the surrounding fragments. Parent/child neighbors turn their gaze and brighten their aura; this is pointer feedback, not autonomous conversation. Bounded gaze and deformation blend toward their targets with an exponential return. Paused, hidden and reduced-motion modes do not run a continuous requestAnimationFrame loop or a moving pointer response.

The complete collection uses instanced surface fragments (3,900 for the Sun, 2,700 per planet and 900 per moon), plus sparse circular surrounding particles: 49 for the Sun, 22–29 per planet and 16–20 per moon. Saturn's ring uses 1,400 instances and Uranus's subtler ring uses 520. Color maps sample Earth, Mars, Saturn and Moon fields; other identities use procedural material fields. These counts describe the current prototype rather than a universal density scale. While a body is grabbed, depth-weighted fragment lag is bounded to 8.5% of its radius and decays after release; child moons receive the same grabbed state when their parent moves. The body center follows the existing direct drag, not a complete Orbit spring. Parent-relative offsets, independent moon movement and Ctrl/⌘ Z undo remain intact.

Activity satellites, unread dots and named statuses complement the body material. Agent counts and names derive from the current backend model. The labeled --fixture preview uses temporary simulated agents; its roster is not a fixed production design token. If 3D rendering fails, the page retains DOM controls, a retry notice and miniature fallback visuals.

## Do's and Don'ts

### Do:

- **Do** preserve coherent planetary curvature while keeping individual beveled block fragments visible, with broad shading, coherent colors and selective emission.
- **Do** carve facial recesses into the core and fragments with common surface fields, and seat curved 3D eye lenses inside those apertures.
- **Do** preserve per-skin animated lens geometry and mouth fields while continuing to assess face legibility at the displayed size.
- **Do** show actual hierarchy through quiet straight strokes, visible by default, without hover illumination.
- **Do** bound mouse and pen dents to the local inward field, return them smoothly and retain the closed shell.
- **Do** preserve the eight recognizable planetary materials and five distinct Moon variants within the implemented material vocabulary.
- **Do** reserve complete ring, body and rendered-label bounds before fitting groups into the viewport.
- **Do** preserve compact touch targets and separate bands for status notices, map tools and the composer.
- **Do** retain locally hosted Manrope, explicit agent identity, accessible SVG actions, keyboard menu navigation and visible focus.
- **Do** stop continuous decorative motion and moving pointer reactions for reduced motion, paused maps and hidden pages, and label simulated preview data.

### Don't:

- **Don't** replace the main fragment construction with photographic sphere skins or place flat face images, SVGs or billboards over the bodies.
- **Don't** let random tile contrast or white moon speckles overpower coherent planetary volume.
- **Don't** infer semantic success from an activity-ending visual pulse.
- **Don't** present bounded fragment lag as a complete spring-following body gesture, or later event choreography and custom graph editing as implemented.
- **Don't** treat the current fragment counts, fixture captures or reference direction as universal performance, legibility or exact-match guarantees.
- **Don't** turn the fixture roster or the original Orbit focused pages into requirements of this homepage design system.
- **Don't** inherit the archived root HTML or robot studio style as the active solar visual authority.

## Latest motion evidence — 2 October 2026

Calm luminous eyes replace pupils and highlights. Actual surface rotation and orbiting debris remain independent of the stationary front facial field. Short neutral pulses and 12-cube communication streams follow message/activity events; existing aura particles are never removed to produce a stream. Quiet Orbit hierarchy strokes retain width 1.2 and opacity 0.14/0.07, without hover highlighting. Thinking/tool/wait/block states reveal small satellites with grounded activity symbols. Cached miniature captures use one temporary renderer which is disposed after producing all skins. The recipient menu supports localized search, keyboard navigation and real status labels. Compact moons retain their names, states in their accessible labels and full states in the selector, while their separate visual status line is hidden to avoid label collisions.

Current evidence: [.impeccable/review/solar-motion/](.impeccable/review/solar-motion/), including isolated simulated send/reply verification, desktop and portrait inspection, 28 focused tests, TypeScript, targeted lint and production build. Speech lifecycle is adapter-tested; the browser exposes SpeechRecognition, but physical microphone transcription remains unverified.

## Readable face and circular aura refinement

The latest refinement removes the shared dark facial bed entirely. Calm eyes and mouth use dark tones on pale materials and light tones on Earth, Neptune and the volcanic moon; only their individual recessed apertures remain. Eyes are larger, especially on the compact moons, but remain plain lenses without pupils. Surface counts and pointer dents are unchanged. Sparse circular debris replaces all inclined aura belts; only Saturn and Uranus retain actual rings. Ring particles rotate in their own plane and use a bounded local shader displacement on pointer approach. Body drift stays below 1.2 px. Earth rotates at 0.23 radians/second, other planets at 0.17, surrounding particles at 0.30 (Sun 0.24), and rings at 0.24.

Reporting lines now reproduce the Orbit scene parameters, clipping radii, overlap suppression and waiting-member direct warning line. Their normal color follows --color-ink and no CSS transition is added. Evidence: [.impeccable/review/solar-readable/](.impeccable/review/solar-readable/). Freely arranged positions were preserved; the current custom arrangement can still overlap in a narrow viewport and has not been automatically rearranged.

## Soft automatic motion — 3 October 2026

Body drift is bounded to 1.8 px horizontally and 2.8 px vertically, with a smoothly blended pointer nudge up to 1.4 px. It is renderer-only, never writes layout offsets and pauses while grabbed. Sparse aura fragments retain a circular outline but vary angle, depth, size, aspect and brightness. Per-fragment breathing and a slightly changing cloud tilt prevent a rigid ring appearance. Local pointer curl and inward response are stronger. Decorative motion remains gated by pause, reduced motion and visibility. No shared dark facial mask remains.

## Aura próxima, olhar e vidro — 3 de outubro de 2026

A aura de todos os corpos tem agora 1,15 vezes a contagem de base (antes 0,65): aproximadamente 77% mais fragmentos, incluindo as cinco luas. A faixa radial passa de 1,14–1,70 para 1,09–1,39 no Sol, e de 1,14–1,62 para 1,09–1,34 nos restantes corpos. Fragmentos ligeiramente maiores, emissão mais forte e opacidade elevada dão presença sem alterar os anéis reais. A oscilação e a atração local foram reduzidas para manter a aura perto da superfície.

Os olhos seguem a direção do rato em todo o mapa, com interpolação exponencial e deslocamento limitado a 0,065 / 0,05 do raio nos eixos horizontal / vertical. As cavidades esculpidas acompanham as lentes; a boca mantém a posição. Ao sair do mapa, o olhar regressa suavemente ao estado neutro. Pausa, movimento reduzido e preferência de interação continuam a limitar este movimento. Não há novos eventos de atividade simulados.

Primeiro tratamento de liquid glass: brilho fino no rebordo, reflexos suaves, transparência e blur limitado aos controlos flutuantes, compositor e menus. O mapa mantém o fundo preto e a disposição escolhida.

Verificação: lint do renderer sem avisos; build de produção Vite passou. Inspeção desktop 1196×930 e móvel 390×844; comparação visual do olhar com o rato em duas posições; menus abrem e fecham. Sem avisos/erros THREE observados. A disposição personalizada pode continuar a sobrepor corpos no telemóvel. Não alterámos posições nem o backend.

## Vistas solares e satélites interativos — 3 de outubro de 2026

O zoom segue o ponto sob o rato, com limites iguais aos do Orbit (0,12–3,2). Os corpos têm escala proporcional, sem mínimos visuais independentes; os alvos DOM conservam o mínimo acessível. O culling das malhas com deslocamento por shader foi desativado para evitar desaparecimento integral na margem. O mapa permanece montado e pausado ao abrir um agente, preservando a câmara no regresso; alterações de dimensão continuam a reajustar o enquadramento.

A identidade é centralizada em SolarIdentityProvider e OrbitFace: cabeçalhos, mensagens, listas, calendário, rotinas, equipas, utilização e restantes chamadas partilham o mesmo planeta ou lua atribuído no mapa. Instâncias fora do shell usam a ordem guardada. Agentes ausentes recebem uma lua neutra. O guia usa o Sol. A antiga cena Orbit fica invisível e suspensa nas vistas Jarvis.

O utilizador rejeitou a primeira composição convencional em lista. A composição desktop vigente é uma constelação de satélites de ferramentas: ícones reais sobre núcleos de vidro com pequenas asas, organizados em ramos assimétricos. As linhas são uma composição de navegação, não dependências de execução. O planeta continua no centro, com a face e aura aprovadas. Cada satélite abre o painel real, reage ao hover/seleção e pode ser arrastado. As posições normalizadas ficam em jarvis.solar.system-layout.v1.<agente>, exclusivamente locais, com reposição. Arrastar não abre o painel; cancelar restaura a posição anterior. O movimento decorativo respeita a preferência e reduced motion. Clicar no espaço vazio regressa ao mapa.

O chat mantém mensagens, anexos, modelos, aprovações e os restantes controlos existentes, numa coluna de vidro. Os cabeçalhos e os ícones dos painéis passam a seguir o mesmo material. A nova direção de telemóvel fica adiada a pedido do utilizador; mantém-se o acesso compacto existente.

Verificação: 13 testes de câmara/organização passaram; lint e TypeScript passaram. Inspeção de zoom 320% manteve a Terra visível e conservou 320% depois de abrir/fechar o agente. Arrasto de Computer observado de (103,353) para (132,328), sem abertura de painel; a posição manteve-se após sair e voltar. Reposição e abertura do painel Engine verificadas. Não houve envio de novas mensagens nem alteração de configuração do backend. A CLI 21st não está instalada neste ambiente; reutilizaram-se os componentes e os dados existentes em vez de instalar dependências.

### Quarto de círculo e tamanhos próximos — 3 de outubro de 2026
A navegação desktop por satélites foi substituída por um único arco de 90 graus: arrastar percorre os sistemas, clicar abre o painel real, e setas/Home/End e botões oferecem alternativas. Conversas regressam ao espaço aberto, sem cartão exterior; as ações de mensagens mantêm a edição. Jarvis mede 158 unidades, planetas 144 e luas 126, multiplicadas pelo zoom. A entrada parte da posição e escala do agente no mapa e aproxima-o suavemente; o mapa desvanece. Respeita movimento reduzido. Mantêm-se as posições guardadas e a direção visual dos planetas.

### Direção vigente: close-up do mapa e animações solares — 3 de outubro de 2026
Esta revisão substitui a composição desktop anterior: a mesma câmara do mapa aproxima o agente, mantendo vizinhos nas suas posições reais, escurecidos. Os controlos atuais são uma constelação provisória de satélites acima do canvas, sem arrasto; o utilizador pediu para os conservar por agora. O quarto de círculo fica como estudo para telemóvel. Chat sem cartão exterior, com edição preservada. Jarvis 178, planetas 144, luas 116 e lua gelada 108. Pequeno brilho adicional; ligações 1.6px, gradiente, segmentos 6/6 e avanço 18px/s, seguindo a receita visual do Orbit. Faces simples, frontais e legíveis sobre cada material, sem painel preto; boca e olhos animados. Satélite de atividade dá uma volta completa no plano frontal, com ícone no corpo. Envios usam fragmentos quadrados entre pontos distintos das auras, com rastos e chegada suave. A demonstração contínua é exclusivamente visual, pausável e terminável. Detalhes em chatgpt-3.0/ANIMACOES-SOLARES.md.

Refinamento vigente: boca plana sem sombra ou contorno; satélite de atividade desenhado a neon, transparente, ícone branco interior e largura constante de 46px também nas luas. Fragmentos enviados reutilizam a geometria chanfrada da aura, com rastos luminosos e fluxo organizado entre extremos distribuídos. Luas comunicam primeiro com o seu planeta superior; a simulação nunca troca diretamente lua/Jarvis.

Revisão posterior: o utilizador rejeitou o satélite neon. O indicador de atividade agora reutiliza o ícone original do Orbit, dentro de quadrado arredondado com contorno e ligação pontilhada; tamanho constante de 40px entre corpos. Controlos da página também usam ícones simples, sem asas, com linhas a partir do planeta. Aura com quadrados planos e profundidade de brilho; chegada e atenção usam pulsos circulares do Orbit. Vidro com transparência, bordas refletoras e lente SVG restrita ao fundo dos controlos, mantendo texto nítido. Caras permanecem adiadas. Ver chatgpt-3.0/ORBIT-E-VIDRO.md.

Correção final: removida a lente SVG por causar desfoque. Vidro usa reflexão de borda e fundo translúcido com blur apenas atrás do controlo. Composição dos sistemas passa a ser literalmente a original do Orbit: ícone Lucide existente de 15px à esquerda e label/valor/estado à direita, sem molduras inventadas. O ícone orbital só surge em trabalho, a partir do `toolIcon` original. Não mostrar estados permanentes Resting/Ready sob os corpos ou na identidade; manter avisos de ajuda/bloqueio e ferramenta no hover, como no Orbit.


### Atualização — 3 outubro: paletas, aura e fundos

Os envios usam 48 quadrados com rastros, distribuídos pelas cinco cores da skin de quem envia. As respostas usam também a paleta da origem; cada reenvio passa à paleta do planeta superior, mantendo lua → planeta → Jarvis. A camada reutilizada do Orbit desenha apenas brilho e pontos exteriores discretos: não desenha outro orb, cara, letras z, faixas de trabalho/pensamento ou círculos de estado. Os estados solares usam respiração suave do brilho/aura e um reforço breve ao receber dados. Os modelos e caras aprovados ficam preservados.

As definições rápidas incluem três fundos persistentes: Preto, Azul profundo e Grafite. Preto é o padrão; os fundos alternativos mantêm o contraste e aplicam-se ao mapa e ao foco. Motion/reduced-motion continua respeitado.

### Revisão: criação e foco

Manter UI espacial baseada nas regras do Orbit. Retirar popover de quick settings e transferir escolhas solares para Aparência no hub completo. Ligações interplanetárias em foco: 7–12% de opacidade, sem movimento do tracejado. Ligações aos sistemas: traço pontilhado mais visível, destacado para sistema selecionado/ativo. Criação com preview à esquerda, ações reais à direita, pesquisa e pílulas Agentes/Equipas; manter visibilidade, validação, loading e erros do Orbit. Equipa aparece com opções abertas e separadores finos, sem cartões. Nenhuma nova reformulação de modelos/caras/partículas.

### Desenvolvimento e apresentação — 3 outubro

Modo Operate. Expandir o mundo aprovado: editor transparente no stage à esquerda da conversa, identidade Solar no cabeçalho, navegação compacta de pastas, pílulas e divisores finos. Ficheiros/Computador alternam a área de trabalho; não substituem o chat nem abrem modal. Preservar oferta de tela e resultados do Orbit; no Solar, apresentação usa enquadramento próprio da área livre, sem escala do mapa antigo. Cara normal ampliada 9% nos olhos/boca; dormir fecha os olhos, outros estados não deformam a expressão. Build Electron usa dados próprios do Solar e reconhecimento de voz local Windows. Evidência e limites em chatgpt-3.0/ORBIT-FUNCIONALIDADES.md.

Identidade viva: cabeçalhos, mensagens e seletores usam o mesmo modelo 3D do mapa, com rotação, piscar, estado de atividade e interação do rato. Um atlas WebGL partilhado desenha retratos para canvases 2D, sem um contexto WebGL por avatar. O atlas recebe o estado e as preferências do mapa, mas não a sua posição, zoom ou escurecimento. Corrigido o host da miniatura de recurso para conservar também o modelo real quando o retrato vivo não estiver disponível. Evidência própria: docs/verification-evidence/solar-live-identity.png, captura da fixture, sem assets gerados.

## Solar para uso diário

Removidos o showcase e a simulação de estados. A atividade dos modelos vem dos agentes reais e das fases da chamada. Jarvis expõe controlos próprios e não todos os sistemas dos planetas. Cabeçalho sem Application Settings; créditos das texturas em Sobre. A introdução usa o próprio Sol animado, três cenas explicativas e os passos existentes de configuração e permissões. Chamadas preservam a conversa ao lado do mapa, com uma faixa leve sem card preenchido. A página de desenvolvimento e as ofertas de ecrã/ficheiro continuam a usar a identidade viva do agente.

Revisão final: preservar o mapa aprovado, sem novos cards ou navegação extra. Evidências locais: solar-installed-workspace.png (espaço real), solar-jarvis-controls.png e solar-welcome-voice.png (fixtures), em docs/verification-evidence. O favicon solar-icon.svg é desenhado em código e acompanha o ícone nativo, sem novos assets raster. Build e instalador verificados; chamadas completas e hardware físico continuam explicitamente fora da verificação automática.
