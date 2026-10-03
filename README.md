# Solar

Aplicação local de agentes, com Jarvis como Sol, responsáveis como planetas e agentes de equipa como luas. Desenvolvida sobre a base aberta [Orbit](https://github.com/DragonQLF/orbit).

## Executar

Requisitos: Node.js 24 ou superior e pnpm 10.33.0.

```powershell
cd orbit-app
pnpm install
cd ..
npm run preview
```

Abrir http://127.0.0.1:5200. `preview` cria uma fixture temporária: Jarvis, oito planetas, cinco luas e motor simulado. As animações e estados da demonstração não representam trabalho real.

Para o workspace persistente, usar `npm run dev`. Os dados ficam em `chatgpt-3.0/.data/`, excluídos do Git. Motores e ferramentas precisam da sua configuração; publicar o código não configura credenciais nem liga serviços.

## Organização

- `orbit-app/`: frontend React, backend e componentes funcionais da base Orbit, com o tema Solar.
- `chatgpt-3.0/`: launcher, dados de demonstração, documentação de design e imagens das iterações.
- `docs/`: notas de desenvolvimento e referências do projeto.
- `jarvis/`, `reference/` e ficheiros HTML/JS da raiz: protótipos históricos, conservados como referência. `npm run legacy` abre o protótipo anterior.
- `DESIGN.md`, `PRODUCT.md`: decisões e direção do produto. As revisões mais recentes prevalecem sobre os estudos anteriores.

## Estado atual

Mapa solar livremente organizado, aproximação ao agente, chat aberto, partículas com paletas de origem, fluxo lua → responsável → Jarvis e simulação pausável. A página de criação reaproveita os papéis e modelos de equipas do Orbit, com pesquisa e navegação por pílulas. As preferências solares estão nas definições completas de aparência; não existe painel de quick settings.

O repositório guarda o código e a documentação. Dependências, compilações, bases de dados, configurações locais, credenciais e ficheiros de log ficam excluídos. Commits e envios são explícitos; ainda não há sincronização automática ou publicação de uma aplicação online.

## Verificação

```powershell
cd orbit-app
pnpm exec tsc -b
pnpm exec vitest run --configLoader native src/orbit/SolarOrbitParticles.test.ts src/orbit/solar-transfer.test.ts src/orbit/solar-state.test.ts src/orbit/solar-camera.test.ts src/orbit/solar-model.test.ts src/orbit/solar-interaction.test.ts src/orbit/solar-presets.test.ts
pnpm exec vite build --configLoader native
```

Mutações de teste devem usar a fixture isolada, seguindo `orbit-app/docs/verification/README.md`.

## Origem e licença

A base Orbit mantém os seus avisos e licença Apache-2.0 em `orbit-app/LICENSE`. Consultar também as licenças das dependências e dos assets. A pesquisa de OpenDots serve como referência de funcionalidades; não importámos o seu runtime, código ou serviços externos.
