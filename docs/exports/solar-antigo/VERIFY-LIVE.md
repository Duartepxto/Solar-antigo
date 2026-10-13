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

É uma demonstração de design, sem IA, servidor, emparelhamento ou integrações reais. Os custos são fictícios. A amostra pt-PT instalada foi testada neste computador. O preview mobile foi verificado no navegador em 390 × 844 e 360 × 780, ainda sem teste num telefone físico. A notch é uma demonstração independente, ainda sem overlay ou atalho global do Windows. Operações que exigem contas ou ficheiros do servidor pertencem à aplicação real. Ver [COMPANIONS.md](COMPANIONS.md) para a revisão atual.

## Retomar/reproduzir

Fontes ativas: `orbit-app/.orbit-scratch/design-export`. Há uma cópia em `prototype-source` neste diretório. Para reproduzir, restaurar essa cópia no caminho ativo, manter a base Solar antiga em `orbit-app` e executar aí:

```powershell
node .orbit-scratch/design-export/sun-svg.mjs
$env:SOLAR_DESIGN_VARIANT='live'
node .orbit-scratch/design-export/build.mjs
node .orbit-scratch/design-export/check-demo.mjs
node .orbit-scratch/design-export/check-polish.mjs
node .orbit-scratch/design-export/check-companion.mjs
```

Copiar `Solar.html` para `Solar-entrada.html`, `Solar-mobile.html` e `Solar-notch.html` depois do build. O pathname escolhe a superfície. Se o Windows bloquear a escrita final, definir `SOLAR_PACK_OUTPUT` para um ficheiro temporário e copiá-lo com `Copy-Item` após a compressão.

As instruções atuais e a futura comparação funcional com o Orbit estão em `DESIGN-ACTIVE.md`.
