# Solar — três conceitos de identidade V2

**Rejeitado pelo utilizador em 10/10/2026.** As direções centradas em lettering, abreviação e abstração não correspondem ao pedido. O próximo ícone deve representar o Sol existente do Solar como símbolo de aplicação autónomo, também a preto e branco. Esta pasta é apenas histórico; não integrar nem continuar a desenvolver estes conceitos.

10 de outubro de 2026. Artefactos de comparação derivados da pesquisa de fontes primárias. **Nenhum conceito está aprovado, aplicado no produto ou verificado quanto a exclusividade jurídica.** A primeira proposta «Sol aberto» continua rejeitada e preservada em `../solar-brand/`; não é a base geométrica destes desenhos.

Abrir `index.html`. A primeira comparação é em uma tinta, com positivo/negativo, símbolo em escala real e simulações de app icon. O botão Paleta Solar mostra o dourado/grafite depois da comparação formal. Não guarda preferências nem altera a aplicação.

## Palavra — o nome é a assinatura

SOLAR foi desenhado em cinco contornos próprios. A construção tem caixa larga, terminais abertos e contraformas amplas: O oval com peso consistente, L de pé curto, A de abertura alta e R de perna diagonal, com distâncias individuais entre letras. O S abrevia a assinatura e conserva a mesma geometria em 16/24/32 px. Não há um ícone astronómico extra.

É a direção mais direta para reconhecimento do nome e mais calma para conviver com os corpos 3D. A influência metodológica é estudar o wordmark como assinatura que sustenta aplicações, como no [case Sonos/BMD](https://www.brucemaudesign.com/work/sonos), e distinguir nome/símbolo/ícone como nas [guidelines Linear](https://linear.app/brand). Não usa o ambigrama, faixas ou geometria dessas marcas.

Riscos: uma letra S isolada pode ser confundida com outras aplicações; a largura do nome pede espaço. A geometria é proposta desenhada, não uma alegação de originalidade protegida. Antes de escolher, testar a recordação sem nome, o equilíbrio de S/O e os pares LA/AR em tamanho de cabeçalho.

## Passagem — coordenação como forma

O símbolo usa duas massas opostas com um canal central de dois níveis. Não coloca agentes em pontos nem desenha ligações. O lettering lowercase partilha terminais firmes, curvas contidas e counters modulares: s de duas câmaras, o de perímetro arredondado, l de pé curto, a com haste aberta e r de retorno horizontal. Os contornos são paths próprios, não texto numa fonte de catálogo.

Relaciona-se com trabalho que sai para um agente e regressa para ser revisto. A referência metodológica é derivar gramática do mecanismo, estudada no [case Cohere/Pentagram](https://www.pentagram.com/work/cohere), e reduzir forma para reprodução, estudada no [case Slack/Pentagram](https://www.pentagram.com/work/slack). Não reutiliza células, hashtag, cruz ou cores desses exemplos.

Riscos: pode ser lido como letra/interruptor abstrato; o canal é o primeiro elemento que pode perder-se em 16 px. Testar gaps e centralização óptica em bandeja real antes de exportar. A interpretação «coordenação» é intenção de desenho, não uma leitura já comprovada por utilizadores.

## Limiar — luz com presença

Uma massa circular é aberta por uma fenda larga e curva. Não há raios, órbita, nós, contorno fino ou acabamento metálico. O lettering mistura caixa inicial e minúsculas com contraste deliberado: S de abertura e terminal amplo; o de lados fortes/topo mais leve; l com pé; a e r de acabamento flared. Símbolo e palavra são elementos separados, equilibrados por escala em uma tinta.

A referência metodológica é hierarquia entre assinatura, expressão e objecto físico, estudada no [case Rolls-Royce/Pentagram](https://www.pentagram.com/work/rolls-royce-3/story). Não usa monograma entrelaçado, Art Deco ou figura alada. O resultado procura uma presença mais editorial, mantendo o mundo do produto ao cargo do mapa.

Riscos: pode aproximar-se de energia ou luxo; alguns traços do lettering pedem escala maior que um título compacto. Comparar com categorias adjacentes antes de assumir diferenciação. O símbolo precisa de se reconhecer pela abertura, não pela cor.

## Fontes vetoriais

`generate.mjs` contém a geometria comentada. Executar `node docs/solar-brand-v2/generate.mjs` só escreve nesta pasta. Cada conceito oferece:

- Assinatura e wordmark próprios em tinta preta, branco e dourado.
- Símbolo/abreviação em viewBoxes de 16/24/32 px, nos três tratamentos.
- Foreground transparente de 108 × 108, enquadrado na zona segura do mockup Android.
- Fundo grafite separado partilhado pelas simulações.

As assinaturas não contêm `<text>`, dependência de fontes, assets raster ou scripts. O lettering é desenhado em SVG; a prancha usa o Manrope local apenas para texto informativo. Passagem usa strokes vetoriais para mostrar a construção; a versão final pode expandi-los depois de uma escolha, sem mudar a aparência.

## Simulações e critérios de revisão

Android: foreground colocado com margem dentro da zona segura, sobre fundo separado. As máscaras circle/rounded square na prancha são recortes CSS de comparação, não um adaptive icon Android validado. A referência técnica é [Android Developers](https://developer.android.com/develop/ui/compose/system/icon_design_adaptive).

Windows: uma faixa neutra apresenta símbolos em 16/24/32 px, com um indicador de aplicação ativa. É uma simulação de contexto, não screenshot do Windows nem ICO exportado. A referência técnica é [Microsoft Learn — app icon design](https://learn.microsoft.com/en-us/windows/apps/design/iconography/app-icon-design).

Rever primeiro uma tinta: leitura imediata do nome, silhueta, espaço negativo, equilíbrio entre símbolo e palavra e estabilidade nas três escalas. Depois confirmar que o dourado ajuda a integração, sem ser necessário para reconhecer a marca. As três direções têm risco explícito e podem ser rejeitadas; estes artefactos tornam a comparação concreta.

Para o passo de integração futuro, uma direção precisará de ajuste óptico final, análise de semelhança, regras de uso, exports nativos e verificação física. Não se trocaram favicon, título, ICO, recursos Android, introdução ou mapa nesta passagem.
