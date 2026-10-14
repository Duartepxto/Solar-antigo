# Solar Notch — protótipo independente

Ficheiro ativo: `Solar-notch.html`. Fontes: `notch-source`. A notch não é incorporada em `Solar.html` nem em `Solar-entrada.html`; esses HTML foram repostos, byte por byte, a partir das cópias anteriores a esta experiência.

## Direção de 14 de outubro de 2026

Três vídeos enviados pelo utilizador: Dotpals (48 s), Dotpals / notch (31 s) e Grok Bot / Live Activities (19 s). A correção do utilizador pede a notch num ficheiro separado e mais próxima dessas inspirações.

- Uma notch negra presa ao topo do ecrã, com cantos de ligação ao limite superior, em vez de uma barra de atividade dentro do mapa.
- Compacta: três personagens, agente ativo, tarefa e estado.
- Expandida: composição horizontal, personagem à esquerda, trabalho à direita, ações curtas, provas expansíveis e troca de agentes.
- Estados próprios para trabalho, autorização, conferência de testes, falha e entrega verificada. A cor acompanha o significado: azul, âmbar, violeta, vermelho e verde.
- A saída com `exit 0` e um teste falhado é um exemplo deliberado: Qualidade confere os resultados antes de concluir. Os resultados e comandos são exclusivamente simulados.
- Histórico de decisões e verificações; Autorizar/Recusar fica registado. Nada é enviado ao GitHub ou executado no computador.

Os personagens reutilizam o renderer e os materiais do Solar, com as caras aprovadas. Nenhuma mascote ou código dos produtos de referência foi copiado. As texturas de planetas mantêm a atribuição Solar System Scope / CC BY 4.0.

## Movimento e interação

A expansão é o momento focal, em 260 ms. Um único movimento suave do personagem mantém presença durante o trabalho. Escape recolhe; Ctrl+Alt+P mostra/oculta; Alt+Y e Alt+N respondem apenas ao pedido demonstrativo atual. Os separadores Agora/Histórico aceitam as setas do teclado. Os ciclos param quando a página fica oculta e respeitam movimento reduzido.

A página inclui um espaço de trabalho ilustrativo e controlos de estados para revisão de design. Não existe integração com a aplicação ou com o sistema operativo. Não é uma notch nativa de Windows ou macOS.

## Reproduzir

Na raiz de `Solar-design`, com as dependências existentes de `orbit-app`:

```powershell
node docs/exports/solar-antigo/notch-source/build.mjs
```

O HTML inclui fontes, código e texturas e pode ser aberto autonomamente. O servidor de pré-visualização existente serve `http://127.0.0.1:5401/Solar-notch.html`.

## Verificação

Compilação independente; carregamento das miniaturas; expansão/recolha; pedido e recusa; registo no histórico; inspeção da saída dos testes; deteção da falha apesar de `exit 0`; recuperação e conclusão; comparação por hash dos dois HTML principais com as cópias anteriores.
