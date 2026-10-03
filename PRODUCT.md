# Jarvis

<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
The active Jarvis 3.0 application uses the approved Orbit fork in `orbit-app`: React, TypeScript, a local Node backend and its existing agent engines. `chatgpt-3.0/run.mjs` launches this application. The homepage renders a Three.js solar map. The dependency-free root HTML and `/robot-studio/` are earlier experiments. Desktop packaging remains future work.

## Users
One primary user, a student and developer in Portugal, working across personal projects, Gmail, an IPCA Outlook account, GitHub, and Google Calendar.

## Product Purpose
Jarvis is a personal assistant that organizes work, delegates tasks to specialist agents, surfaces what needs attention, and provides a useful daily record. The first version is intended for hands-on exploration and learning while beginning to help with email.

## Operating Context
- Windows PC first, with a possible mobile companion and mobile notifications later.
- Jarvis is the main conversational manager. Specialist agents may have their own conversations and work concurrently.
- A pending approval must not stop unrelated work.
- The user wants daily summaries, important email alerts, project updates, tasks, and approval requests.

## Capabilities and Constraints
- Planned integrations: Gmail, Outlook, Google Calendar, and GitHub.
- Email summaries and drafts may run without approval. Automatic sending requires an explicit user rule or a direct instruction for the specific message.
- The user wants to inspect consequential messages before sending when appropriate.
- Agent creation by Jarvis may be useful when a recurring specialist role emerges.
- Prefer local data storage and minimal spending, ideally zero. Hosted AI and local models remain open technical decisions.
- Voice is desired; ElevenLabs is an option, but free alternatives should be evaluated.
- Interface and conversation should support Portuguese and English.
- The root HTML prototype uses demonstration data. The active application can use engines detected on the user's machine. `--fixture` uses temporary data and a simulated engine, labeled in the interface; it does not prove real engine credentials or external integrations.

## Brand Commitments
- Working name: Jarvis.
- Personality: capable and professional, with room for a relaxed conversational tone.
- The approved Orbit base supplies backend behavior. The homepage has its own black solar workspace: Jarvis as the Sun, team leads as planets and individual members as named moons. The available models include all eight planets and five Moon materials. Every body can be moved; moving a planet carries its moons.
- Latest visual instruction (2 October 2026): make individual block-like particles more visible again while preserving volume and recognizable planets. Treat each skin's eyes and mouth individually. Faces remain integrated into the material, with simple luminous eyes seated in carved apertures; eyes and mouth animate. Nearby mouse movement gently indents local fragments, which return to position and always retain the planetary form. Keep the black field and quiet glass controls. Only the first page is in this redesign.
- Latest expanded scope: refine the Sun, all eight planets and five Moon variants together, including individually legible integrated faces, brighter surrounding fragments and mouse interaction. The user chose to show all eight planets simultaneously in the isolated demonstration. Connections use understated straight hierarchy strokes matching Orbit, without system orbit circles. Preserve the header, search, composer and map controls; settings open a small quick panel and creation uses descriptive choices. A microphone beside Send provides native macOS or browser dictation, with draft review before sending. The implementation and remaining motion requests are recorded in `chatgpt-3.0/PLANO-DE-DESIGN.md`.

## Evidence on Hand
- User supplied reference: `C:\Users\duart\Downloads\OpenMausBot Orbit.html`.
- OpenMausBot and several Jarvis repositories were researched during planning.
- User supplied solar reference: `C:\Users\duart\Downloads\Painel Solar de Agentes Orbitais.png`, a visual direction rather than an approved exact composition.
- Planetary color maps are sourced from Solar System Scope under CC BY 4.0. Attribution is in the asset metadata and `orbit-app/public/solar/textures/CREDITS.md`.

## Product Principles
- Show work and decisions clearly.
- Keep agents available while other requests await approval.
- Let the user define narrow rules for autonomy.
- Make ongoing activity understandable at a glance.
- Treat privacy and cost as core design inputs.

Latest refinement: readable plain luminous eyes and mouth in a soft integrated material recess; sparse circular auras on every body, with no inclined aura belt on Earth. Saturn and Uranus retain real particle rings with their own rotation and local mouse response. Body drift remains tiny. Reporting strokes reproduce the original Orbit parameters and waiting-agent behavior. Preserve freely arranged positions.

Latest visual steering (3 October): remove the dark facial bed completely. Calm eyes and mouth use dark tones on pale materials and light tones on Earth, Neptune and the volcanic moon. Add gentle automatic body drift and a bounded pointer nudge, suspended during dragging. Vary the sparse circular aura geometry, depth and brightness and strengthen its nearby pointer response. Preserve user arrangement, surface density, actual rings, lines and controls.
Latest steering (3 October, aura and gaze): bring aura fragments closer to the Sun, all planets and all moons, with more particles and stronger light. Eyes follow the mouse smoothly across the map while retaining integrated carving. Begin liquid glass styling on the existing controls and menus. Preserve arrangement and existing behavior.
Latest steering (3 October, focused pages): preserve the distinctive spatial feel; reject conventional settings lists. Desktop controls become draggable instrument satellites with asymmetric branching connections and real panel actions around the same solar agent. Preserve chat functions, pointer gaze, map zoom and camera continuity. The user defers the mobile redesign.

### Navegação revista — 3 de outubro de 2026
A vista de agente usa controlos num quarto de círculo percorrível por arrasto, sem satélites espalhados. O chat fica sem cartão exterior e mantém edição de mensagens. Todos os corpos têm tamanhos próximos; Jarvis apenas ligeiramente maior e luas ligeiramente menores. Ao abrir um agente, a entrada aproxima e desloca o corpo a partir do mapa com transição, mantendo acessibilidade para movimento reduzido. A revisão de telemóvel continua adiada.

Latest accepted steering: desktop focus is a close-up of the actual solar map, with neighbouring bodies in their saved positions behind the controls. Retain the current tool satellites provisionally; defer their redesign and the quarter-circle mobile concept. Keep unboxed chat and editing. Slightly smaller moons and larger Jarvis. Make faces readable in every state without a dark face panel. Activity satellites show the actual tool category inside their body and remain visible through a full orbit. Transfer square aura fragments between distinct surface-adjacent points, with smooth scatter and arrival rather than a rigid row into the centre. Restore planet brightness immediately when exiting focus. Keep a continuous visual-only preview with pause/resume/stop; real events drive the normal mode.

Latest refinement: moons communicate with their own superior planet, never directly with Jarvis. Activity satellites are transparent neon outlines with a white interior icon and the same screen size on moons and planets. Remove the mouth shadow and edging. Transfers use recognisable angular aura fragments and light trails, organised into smooth flows with distinct aura endpoints.

Latest user direction: replace the rejected neon satellite with Orbit's original tool icon and bubble. Base in-agent controls on the original Orbit icon language without replacing solar bodies. Use Orbit-like flat square aura particles and circular arrival/attention effects. Improve glass optical appearance and translucency; preserve text clarity and existing controls. Defer further face work.

Final correction: remove the SVG glass lens that blurred/distorted content. Reuse the actual original toolIcon and system.icon code and the original bare system label/value/status composition. Quiet bodies must not display persistent Resting/Ready captions. Keep original help/block warnings and hover tool captions, internal animation states, and explicit preview simulation controls.


### Atualização — 3 outubro: paletas, aura e fundos

Os envios usam 48 quadrados com rastros, distribuídos pelas cinco cores da skin de quem envia. As respostas usam também a paleta da origem; cada reenvio passa à paleta do planeta superior, mantendo lua → planeta → Jarvis. A camada reutilizada do Orbit desenha apenas brilho e pontos exteriores discretos: não desenha outro orb, cara, letras z, faixas de trabalho/pensamento ou círculos de estado. Os estados solares usam respiração suave do brilho/aura e um reforço breve ao receber dados. Os modelos e caras aprovados ficam preservados.

As definições rápidas incluem três fundos persistentes: Preto, Azul profundo e Grafite. Preto é o padrão; os fundos alternativos mantêm o contraste e aplicam-se ao mapa e ao foco. Motion/reduced-motion continua respeitado.

### Direção atual: páginas, navegação e GitHub

Retirar totalmente o popover de quick settings; manter acesso direto ao hub completo. Preferências solares passam para Aparência. No foco, enfraquecer as linhas da hierarquia do mapa e reforçar as linhas do agente para as suas funcionalidades. Não retirar setas ou controlos de zoom: o utilizador esclareceu que falava das linhas. Preservar a composição de foco atual e partículas aprovadas.

Prioridade escolhida: Criar agentes/equipas sobre o comportamento real do Orbit, com pesquisa, pílulas e opções abertas. Sem cartões grossos. Para mudar luas entre equipas, estudar uma página de gestão separada, com arrasto e alternativa por teclado; não confundir com arrasto de posição no mapa. OpenDots continua como pesquisa candidata, aguardando o link exato do vídeo.

Solar é o nome do novo repositório privado GitHub. O repositório da raiz passa a guardar todas as fontes, documentação e referências. O Git original do Orbit foi conservado localmente em .source-history/orbit.git, fora do versionamento; pode ser consultado com git --git-dir=.source-history/orbit.git --work-tree=orbit-app log. Credenciais, dados locais, dependências e builds não entram no repositório.
