# Intro Solar — cor e animação

Revisão de 10/10/2026. Pedido: conservar composição e modelo aprovados; ajustar apenas botões/cores e pensar em animações. Abandonar o ícone plano desenhado e não desenvolver versão preta nesta revisão.

## Artefactos

- `intro-warm-gold.png`: revisão cromática da intro, sem o símbolo plano rejeitado no cabeçalho. Layout e Sol conservados visualmente.
- `solar-icon-realistic-yellow.png`: proposta de ícone amarelo com volume/material e composição própria sobre tile grafite. Não é captura da aplicação nem export nativo.

Geração com ferramenta integrada image_gen. Nada foi implementado ou instalado. Os ícones anteriores ficam apenas como histórico, não direção a integrar.

## Botões

Tokens propostos, não medições da imagem gerada:

| Papel | Cor |
| --- | --- |
| Primário, topo | #F0CD91 |
| Primário, base | #DDA75B |
| Texto do primário | #211B12 |
| Borda luminosa | #F8DEAE |
| LED exterior | rgba(218,162,93,.22) |
| Secundário | Grafite com texto claro e borda âmbar discreta |

Um botão principal por estado. O brilho fica limitado à borda e não cobre texto. No hover/foco, reforço pequeno de luminosidade; no clique, redução de 1% da escala. Ações secundárias não recebem o mesmo peso do botão principal. Não usar pulsação contínua ou flare que passe por cima da legenda.

## Movimento proposto

| Momento | Movimento | Duração candidata |
| --- | --- | --- |
| Abrir intro | Conteúdo aparece por opacidade e sobe 8px; modelo entra suavemente na mesma posição | 240–320ms |
| Mudar de passo | Texto/formulário sai em 100ms e próximo entra com deslocação de 8px; preservar a instância do guia e o footer | 220–260ms no total |
| Sol em repouso | Drift vertical de ±2px, partículas existentes com movimento lento próximo da superfície; olhos abertos com piscar ocasional do renderer | Ciclo de 5–7s |
| Hover/foco de botão | Intensidade do LED aumenta ligeiramente, sem mexer no layout | 140–180ms |
| Clique | Escala 0.99 por 80ms, regressa ao tamanho normal; sem bounce | 160ms no total |
| Progresso | Segmento ativo recebe o dourado por interpolação; mudança acompanha estado real | 180ms |
| Guardar/verificar motor | Botão mostra operação em curso, texto e tamanho estáveis; sucesso só após resposta real | Sem duração inventada |
| Erro | Mensagem aparece abaixo da ação/campo por opacidade, preservando conteúdo e possibilidade de tentar novamente | 140ms |
| Entrar no mapa | Expandir janela/câmara para o workspace quando o fluxo termina; reutilizar modelo, sem flash ou cópia do Sol | 320–400ms |

Curva sugerida: cubic-bezier(.22,1,.36,1), sem overshoot. Estes tempos são ponto de partida a experimentar, não regras verificadas no produto.

## Integração futura

Reutilizar `WelcomeFlow`, `withViewTransition`, `SolarIdentity` e o renderer existente. Preservar perfis, estado de formulário, permissões, configuração, avanço/retrocesso e número real de passos. Evitar remontar a instância do Sol em cada passo. Nunca prolongar espera funcional para terminar uma animação. Em movimento reduzido, remover drift, deslocação, escala e zoom: troca direta ou fade curto de 80–120ms. Suspender animação fora de vista.

Não se propõe alterar o modelo aprovado nem criar uma biblioteca de animação nova. Antes de implementar, observar teclado, foco, legibilidade, estados loading/erro e movimento reduzido no fluxo real.

## Prompts finais

### Ícone amarelo

Use case: logo-brand. Create ONE realistic yellow Solar app-icon proposal derived specifically from the 3D Sun model in supplied reference (the approved intro). Do NOT use any previous flat graphic sun, smooth cartoon disk, gear-shaped icon or emoji material. Reference approved Sun: round volumetric sphere made of tightly packed SMALL bevelled square fragments in golden-yellow, fine amber depth between facets, subtle near-edge particles, two modest dark upright awake oval eyes and a SHORT subtle smiling mouth. Preserve that base model's face and material language. Translate into a carefully art-directed APP ICON, not a screenshot crop: 3/4 depth conveyed by softly lit sphere facing front, realistic small block material, coherent denser core, clean circular silhouette, 10-16 close small square particles, controlled natural luminosity. Particle surface density closer to actual model than cartoon, slight simplification for icon-scale clarity, no smooth featureless centre, no huge square rays, no stepped pixel wheel. Mostly yellow-gold with subdued amber shadow, no fiery-red lava holes or noisy oversized debris. Soft studio illumination, tactile realistic mineral/plasma-like block surfaces, modest eyes/mouth carved into material without dark face panel or large grin. Professional app-icon treatment on a SINGLE flat graphite rounded-square tile, comfortable 18% inset from tile edges; clean premium lighting, tiny bounded glow behind sphere. Square 1:1 composition. No text, caption, phone icon, monochrome variant, logo sheet, mockup board or extra icons. Goal more real than a cartoon while a composed recognizable app icon rather than literal full-scene photo.

### Cores da intro

Use case: precise-object-edit / ui-mockup. Edit ONLY button COLOURS and subtle lighting in this approved Solar intro board. Preserve exact layout, all texts, models of the three Sun guides, six-step progress, form, engine rows, phone illustration, spacing and window dimensions. User is happy with all these. Primary buttons: replace the over-saturated lemon-yellow LED with elegant warm champagne/amber gold, gentle gradient #F0CD91 at upper edge to #DDA75B at lower edge, very dark #211B12 text, fine soft rim #F8DEAE; narrow subdued warm exterior glow #DAA25D around 4px, no bright white neon outline, no broad yellow bloom. Keep controls visually alive but professional. Hover effect cannot be shown here; show base resting colours only. Secondary 'Voltar' buttons keep graphite fill, legible pale text, thin muted amber rim, nearly zero glow. Text actions 'Configurar' use same warm restrained gold. 'Mais tarde' stays neutral. Progress active segment champagne gold with faint light. Keep existing 3D Sun models exactly, no face or material redesign. Header: remove ONLY the little rejected flat cartoon Sun app-icon preceding Solar; keep word Solar in same position, leave that tiny icon area empty. Do not introduce any new icon. Everything else unchanged. A focused colour correction to approved UI, not a redesign.

