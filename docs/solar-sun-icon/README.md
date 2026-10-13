# Estudo do Sol do Solar

Uma proposta de símbolo para a app, referenciada no Sol de [solar-workspace.png](../verification-evidence/solar-workspace.png). A esfera central continua a ser a forma dominante. A luminosidade dourada é traduzida numa corona de plasma visível em uma tinta.

## Decisões de forma

- **Disco maciço:** centro circular, sem rosto nem textura. A massa continua legível a 16 px.
- **Corona curva:** terminações largas, inclinadas e de comprimentos diferentes indicam calor em redor do disco. Fazem parte de uma massa exterior contínua, sem raios finos ou peças flutuantes.
- **Separação circular:** o vazio distingue o núcleo da corona e conserva a leitura de uma esfera. Não representa uma órbita.
- **Optical 16:** o próprio SVG alarga a separação de 3 para 4 unidades quando o viewport tem até 20 px; o núcleo passa de raio 17,5 para 17. A silhueta exterior mantém-se. Não é outro conceito.
- **Uma geometria em preto e branco:** apenas o preenchimento muda; os dois ficheiros têm o mesmo disco, corona, máscara e ajuste óptico. Sem letras ou nome junto do símbolo.

Abrir [index.html](index.html) para observar 128, 64, 32, 24 e 16 px, nos dois contrastes. A referência perdeu partículas e expressão facial; mantém o corpo solar, e a corona torna explícita a leitura de Sol fora da cena do mapa.

## Evidência e limites

[Microsoft — app icon design](https://learn.microsoft.com/en-us/windows/apps/design/iconography/app-icon-design): focalização numa forma literal, detalhe limitado. [Android — adaptive icons](https://developer.android.com/develop/ui/compose/system/icon_design_adaptive): camada monocromática e adaptação à zona segura. Os SVG deste estudo ainda não são os ficheiros de instalação Windows/Android.

Na primeira passagem, o contorno de partículas e o rosto produziram leitura de emoji/bolacha na avaliação interna. Essa forma foi substituída nesta correção única. A nova leitura precisa de confirmação visual nos tamanhos reais; não se reivindica reconhecimento testado com utilizadores.

Nenhum ficheiro de produção, mapa, favicon, Electron ou Android foi alterado.
