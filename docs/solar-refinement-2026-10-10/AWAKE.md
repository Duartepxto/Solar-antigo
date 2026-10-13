# Correção — Sol acordado

Substitui a expressão de repouso das propostas de ícone anteriores. Usa como referência visual o Sol acordado em `../verification-evidence/solar-jarvis-controls.png` e as proporções do renderer atual em `orbit-app/src/orbit/solar-renderer.js`: olhos .08/.12, centros ±.215, boca curta .18 com sorriso .04. Resultado visual: olhos abertos e sorriso discreto, nas duas versões e na prancha de uso.

- `solar-icon-awake-gold.png`: PNG com fundo transparente.
- `solar-icon-awake-mono.png`: PNG monocromático com fundo transparente.
- `icon-context-awake.png`: mockup de uso atualizado.

Ferramenta integrada image_gen. Propostas raster; não alteram a aplicação nem são exportações exatas do renderer. As versões antigas foram conservadas para histórico.

## Prompts

### Dourado

Use case: precise-object-edit. EDIT TARGET image 1 is the existing Solar Sun app-icon foreground. Image 2 is the AUTHORITATIVE REAL APPLICATION AWAKE FACE: golden Sun near lower centre-left, at about x434 y520 in screenshot. Change ONLY the face in image 1 from sleeping to the actual awake expression in image 2. Existing actual code dimensions: two simple vertically oriented dark-brown oval eye apertures with a thin pale-gold rim, width 8% and height 12% of sphere diameter; eye centres separated by 21.5% of sphere diameter, positioned 3.75% sphere diameter above sphere centre. Fully open eyes, NO eyelids across them, NO horizontal slit, NO pupils, irises, white eye shine, eyebrows, eyelashes or surprised oversized eyes. Reuse this exact quiet awake Solar face, not generic emoji. The short thin dark-brown mouth is 18% of sphere diameter wide, about 12% sphere diameter below centre, slight shallow upturn of ends (about 2% sphere diameter), matching actual screenshot. Do not make a broad thick smile. Keep EVERY OTHER part of image 1 unchanged: round volume, exact small square particle texture, golden/orange colour, same framing and size, same perimeter particles, same lighting. Preserve true transparent alpha background. ONE standalone icon, no text, tile or board. User specifically wants awake real face, not a redesigned character.

### Monocromático

Use case: precise-object-edit. Edit target image 1, the dense BLACK monochrome Solar Sun icon. Reference image 2 shows corrected AWAKE golden Solar icon. Change ONLY the sleeping face of image 1 into the same fully awake face proportions as image 2: TWO OPEN VERTICAL WHITE OVAL cutouts, width 8% sphere diameter and height 12% sphere diameter, centred with same spacing/vertical location as reference 2. Replace horizontal slit eyes completely. Mouth a short thin shallow white curved smile, same width, position and curvature as reference 2; not straight sleeping pill. Preserve everything else in image 1 exactly: black central mass, white square seams, dense particle perimeter, framing. True transparent background outside black sphere, white face and seams remain white, no tile, labels or effects. Only update eyes and mouth into actual awake Solar expression; no pupils, eyebrows, oversized eyes, surprised expression or extra features.

### Prancha

Use case: precise-object-edit. Edit ONLY the Sun icon faces throughout reference 1, existing Solar icon presentation board. Replace all sleeping slits and flat mouths with the AWAKE icons supplied in references 2 (gold) and 3 (monochrome). Use EXACT corrected eye and mouth proportions in these supplied icons: eyes fully open, vertical dark-brown ovals with thin pale-gold rim in gold icons, white vertical ovals in black icons, small shallow smile. Update large icons, size samples and bottom Windows/Android examples consistently. Preserve reference 1 board layout, typography, labels, light background, graphite tile, white tile, all icon sizes and placements, colours, fragments. No new design, no added text or animation. All icons must look awake; no horizontal slits or sleepy eyes anywhere.

