# Jardim 3D e Alt+T — 8 de outubro de 2026

**Solar 0.2.0 instalado e aberto.** Executável `0.2.0.0`, hash do bundle
instalado idêntico ao compilado e `/api/health` HTTP 200. Jardim aberto em
`http://127.0.0.1:8799/?workspace=v2`, com Jarvis e Momo reais carregados.

## Direção escolhida

O utilizador pediu primeiro outro Alt+T inspirado em dois reels e, depois,
autorizou o avanço da V2 com subagentes. Escolheu um jardim em vez de um
escritório: personagens melhores, com portáteis, agrupadas pelas equipas e
seguindo a base do Solar original. Esta preferência está em PRODUCT.md.

O reel `https://www.instagram.com/reel/DdTh89HxNeH/` foi reproduzido no
navegador: barra lateral escura encaixada na direita, recortes curvos nas
extremidades e detalhes para a esquerda. O segundo, `Dd8mrD0OX5v`, mostrou
restrição de acesso do Instagram. Não foi possível rever esse vídeo.

## Alt+T

- Barra de 56 × 220 px na margem direita da área útil do Windows.
- Painel à esquerda; área interativa expandida de 328 × 248 px.
- Voz mantém o motor local existente, cancelamento, transcrição e respostas.
- Clique no Sol abre/recolhe detalhes, incluindo quando já há texto ou aviso.
- Distinção entre ouvir, pensar e falar; movimento reduzido respeitado.
- O Alt+T mantém o foco na aplicação onde se estava a trabalhar.

## V2 experimental

- Entrada «3D» no Solar; rota `?workspace=v2`; retorno à interface atual.
- Usa `buildModel`/`solarNodes`: mesmos agentes, Jarvis, equipas e Chiefs.
- Jardim procedural Three.js local com ilhas, árvores, flores, lago e caminhos.
- Personagens sentadas em puffs, portáteis e quatro conjuntos de roupa/acessórios.
- Seleção por clique ou lista, foco/órbita/zoom, estados reais de atividade.
- Skins guardadas por id do agente neste dispositivo. Não são sincronizadas.
- Conversas abrem na interface Solar com o mesmo agente e histórico existentes.

## Verificação e artefactos

As verificações usam apenas fixtures e perfis isolados. Nunca foram usadas
as conversas pessoais para enviar mensagens de teste.

- Alt+T: 44 testes Node e 1 e2e de ouvir → transcrever → responder → voltar
  a ouvir → desligar; inclui click-through e recolher/reabrir detalhes.
- Jardim: 1 e2e de equipas, skin persistida, falha de armazenamento, pausa,
  seleção, zoom, retorno, mobile, nomes compridos e estados vazio/erro.
- Capturas revistas em `.orbit-scratch/verify-evidence/workspace-v2/` e
  `.orbit-scratch/verify-evidence/orbit-island/`.
- TypeScript da V2, lint dos ficheiros alterados e catálogos válidos;
  português 100% (4.226 chaves).
- Registos de teste e compilação em `.orbit-scratch/`.
- Integração com o renderer compilado: 1 e2e aprovado. Abre a conversa
  certa, volta ao jardim, avança para a mesma conversa e reidrata depois
  de recarregar. O id da conversa e todas as mensagens ficam inalterados.
  Evidência em `.orbit-scratch/verify-evidence/workspace-v2-app/result.json`.

O jardim é uma pré-visualização desktop/web da V2. A aplicação Android não
foi substituída por esta interface. Microfone real continua a exigir validação
física; o e2e de voz usa um substituto explícito.
