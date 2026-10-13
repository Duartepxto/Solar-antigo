# Verificação da demonstração Solar

Artefacto: `Solar.html` — HTML autónomo para PC, 15,738,018 bytes e 72 recursos incorporados. Nome público e título: Solar.

## Verificado

- Compilação Vite concluída. Recursos incorporados, incluindo fonte, modelos/texturas e SVG do cabeçalho. Descompressão recompõe exatamente o HTML original. CSP bloqueia ligações externas.
- Simulação: 512 ciclos, hierarquia de delegação, transcrições limitadas a 48 mensagens por agente, custos finitos, conclusão de estados de trabalho, nova conversa e resposta a pedido do utilizador.
- No navegador: mapa com 7 agentes, 2 planetas e 4 luas; definições à volta do Jarvis com o chat visível; estados A pensar/A trabalhar; tempo, tokens e custo nas respostas.
- Vistas inspecionadas: motor, computador, navegador, aprovações, telemóvel, aplicações/MCP, skills, memória, voz, rotinas, aspeto, utilização, trabalho e agenda. A falha das skills causada pela ausência de `warnings` na fixture foi corrigida.
- Modelo alterado; aplicação MCP pesquisada/selecionada; skill desativada; voz selecionada; evento adicionado; mensagem enviada e respondida pela simulação.
- Desenvolvimento: árvore de ficheiros, editor e pré-visualização lado a lado. Navegador abre no desenvolvimento. Computador mostra um ecrã demonstrativo com atividade em vez de esperar por captura real.
- SVG validado como XML, sem fundo quadrado. É uma versão vetorial do Sol; o mapa conserva o renderer 3D antigo.

## Limites deste artefacto

É uma demonstração de design, sem IA, servidor, emparelhamento ou integrações reais. Os custos são fictícios. Voz usa o sintetizador do navegador e depende de vozes instaladas; não foi testada num dispositivo físico. Não foi implementada nem validada uma nova versão mobile neste trabalho. Alguns controlos herdados que exigem instalação, contas ou ficheiros do servidor pertencem à aplicação real e não equivalem a integrações implementadas no HTML.

## Retomar/reproduzir

Fontes ativas: `orbit-app/.orbit-scratch/design-export`. Há uma cópia em `prototype-source` neste diretório. Para reproduzir, restaurar essa cópia no caminho ativo, manter a base Solar antiga em `orbit-app` e executar aí:

```powershell
node .orbit-scratch/design-export/sun-svg.mjs
$env:SOLAR_DESIGN_VARIANT='live'
node .orbit-scratch/design-export/build.mjs
node .orbit-scratch/design-export/check-demo.mjs
```

As instruções atuais e a futura comparação funcional com o Orbit estão em `DESIGN-ACTIVE.md`.
