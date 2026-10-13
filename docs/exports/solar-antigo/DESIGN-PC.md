# Solar: refinamento do HTML para PC

Protótipo separado: `Solar Design PC.html`, com cópia em Downloads. A exportação original `Solar antigo.html` foi preservada. Não foram alteradas as aplicações instaladas nem o Solar V0.

A referência enviada foi estudada para continuidade de foco, detalhe progressivo e duração curta das transições. Não se importou código desse HTML. As mudanças próprias são: acesso direto às definições, índice pesquisável por grupos, quatro atalhos em redor do sol nas definições, entrada dos painéis, hover dos instrumentos e menus, separação mais subtil da coluna e ocultação dos planetas vizinhos durante o foco. Os materiais e animações dos planetas continuam a ser os do Solar antigo.

Verificação em desktop: renderização 3D, pesquisa das definições, abertura e regresso de Aspeto, abertura de preferências gerais, navegação dos painéis. Desligar Movimento foi confirmado com `data-solar-motion=off` e `animation-name: none` na coluna. O índice mantém acesso à apresentação original. Os dados são sintéticos, as respostas HTTP são locais e não há ligação a uma IA.

Esta alteração destina-se ao PC. O design mobile será um protótipo separado.

Regenerar na pasta `orbit-app`, em PowerShell:

```powershell
$env:SOLAR_DESIGN_VARIANT='desktop'
node .orbit-scratch/design-export/build.mjs
```

Os ajustes estão em `.orbit-scratch/design-export/SettingsIndex.tsx`, `desktop.css` e no plugin de exportação em `build.mjs`. O empacotador inclui as texturas construídas dinamicamente e a resposta de perfil necessária às preferências gerais.
