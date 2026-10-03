# Orbit original e vidro — 3 de outubro de 2026

## Correção final pedida pelo utilizador

O indicador de ferramenta usa diretamente `toolIcon` de `orbit-app/src/orbit/tool-icons.ts`, com a ferramenta real, e só aparece durante trabalho, seguindo o original. Os controlos da página reutilizam diretamente `system.icon`, tamanho 15, sem moldura nova, com a composição original: ícone à esquerda, legenda pequena, valor e estado próprio do sistema. Não são ícones redesenhados. Rótulos permanentes Resting/Ready/Thinking/Working saem dos corpos e da identidade do close-up; avisos de aprovação e bloqueio permanecem e a ferramenta surge no hover. O estado interno continua a conduzir animações e acessibilidade. A barra de simulação identifica explicitamente o ensaio visual.

A lente SVG foi retirada após mostrar distorção/desfoque do conteúdo na inspeção. A versão final usa apenas transparência, reflexos de borda e blur do fundo. Texto e ícones não recebem filtro de refração. A referência Apple informa o material; esta versão não pretende reproduzir a API ótica nativa.

Revisão local de `orbit-app/src/orbit/scene.ts`, `characters.ts`, `tool-icons.ts`, sistemas existentes e `docs/design/orbit/prototype/orbit.dc.html`. Mantêm-se os planetas, as caras aprovadas, as posições e a regra lua ↔ planeta superior.

## Elementos trazidos para o tema solar

- Ícone de atividade reutiliza `toolIcon`, o código Lucide original do Orbit. Ferramenta real determina o símbolo (terminal, leitura, escrita, pesquisa, browser, memória, aplicação, etc.). A demonstração usa categorias equivalentes. Sai o desenho de satélite; entra o pequeno quadrado arredondado escuro, com contorno na cor do agente e ligação pontilhada. Mantém tamanho constante entre planetas e luas e percurso frontal completo.
- A página de agente conserva as funções e a composição espacial. Usa a composição original dos sistemas, com ícone simples à esquerda e legenda/valor/estado à direita. As linhas partem do planeta; removem-se asas, molduras novas e caminhos arbitrários entre controlos. Chat permanece aberto, sem cartão exterior.
- Aura usa quadrados planos, com tamanho e luminosidade ponderados pela profundidade, seguindo a receita das partículas do Orbit. Permanecem próximas do planeta, em rotação e sensíveis ao rato.
- Receção: círculo que cresce de 1.1 a 2.5 raios durante 0.8s e desaparece. Atenção/bloqueio: pulsos âmbar/vermelhos de 1.15 a 1.95 raios. São os efeitos circulares encontrados no Orbit; não se encontrou um efeito gráfico denominado portal. Movimento reduzido mantém atenção estática.
- Hierarquia, partículas de envio, câmara, chat, aprovações, painéis e criação existentes continuam operacionais. Não se copia o personagem/orb por cima dos planetas nem se reabre o redesenho das caras adiado pelo utilizador.

## Vidro

Referências primárias: [Apple — Materials](https://developer.apple.com/design/human-interface-guidelines/materials), [Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/) e [MDN — backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter).

A implementação web final tem fundo mais transparente, reflexão suave nas bordas e contraste do contorno. O blur CSS afeta o fundo, sem dependências ou ciclo de renderização adicional. Maior contraste usa fundo sólido. A experiência SVG de refração foi retirada por distorcer o conteúdo; a implementação atual não usa essa lente nem a API nativa Liquid Glass da Apple.

Validação: TypeScript, lint dirigido, 39 testes solares e compilação de produção. Inspeção desktop no mapa e na página do agente, com controlos reais. Sem enviar mensagens, criar agentes ou alterar configurações reais. Conserva o aviso preexistente de bundles grandes.
