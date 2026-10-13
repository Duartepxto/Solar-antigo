# Solar: definições espaciais para PC

Brief: definições à volta do sol, sem uma página convencional, sidebar, cards, fundos de controlos ou caixas. O ficheiro anterior foi preservado; esta direção está em `Solar Canvas PC.html`.

As oito áreas são Identidade, Motor, Capacidades, Dispositivos, Voz, Rotinas, Aspeto e Proteção. Selecionar uma desloca o sol e o ponto selecionado e revela controlos como satélites. Esc volta às áreas e, daí, ao mapa. Os controlos têm fundo transparente. Não há coluna de definições nesta vista.

O movimento usa uma simulação de mola interrompível para posição, escala do sol e visibilidade. As ligações usam curvas cúbicas e pequenos sinais em movimento; uma máscara protege o sol e os ícones. O renderer original mantém os materiais e a reação do sol ao rato. O renderer do mapa fica suspenso enquanto esta vista está aberta, sem desmontar a conversa. A opção Movimento e a preferência do sistema por movimento reduzido são respeitadas.

As preferências de aspeto afetam o sol e o espaço. Os outros campos são opções de demonstração guardadas localmente. Configurar contas, ligações e telemóveis mostra orientação de demonstração; não cria acesso nem liga serviços. A exportação das preferências gera apenas JSON local. Os oito domínios são uma proposta de organização visual, não uma declaração de paridade com todo o backend.

Verificação no browser: abertura da vista, ausência de painéis convencionais visíveis, edição de nome e recuperação ao sair e reabrir, opções de aspeto, Movimento ligado/desligado, regresso com Esc, 1280 × 720 e 1440 × 900 sem overflow. Os controlos de Aspeto foram confirmados com fundo transparente. Não houve erros de consola na confirmação. O HTML contém os recursos necessários e o empacotamento deduplica as imagens e fontes repetidas.

Referências estudadas: o HTML enviado pelo utilizador, [continuidade espacial e animações de layout da Motion](https://motion.dev/docs/react-layout-animations) e [experiências de partículas do Codrops](https://tympanus.net/Tutorials/InteractiveParticles/). A implementação do grafo, curvas e controlos é própria; não se importou código do HTML de referência.

Fonte do protótipo: `orbit-app/.orbit-scratch/design-export/SpatialSettings.tsx`, `spatial.css`, `entry.tsx` e os adaptadores de exportação em `build.mjs`. Nenhuma aplicação instalada nem o Solar V0 foi alterado. Mobile terá um ficheiro e uma composição próprios.

Regenerar na pasta `orbit-app`:

```powershell
$env:SOLAR_DESIGN_VARIANT='canvas'
node .orbit-scratch/design-export/build.mjs
```
