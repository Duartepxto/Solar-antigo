# Ícone do Solar: representar o Sol da aplicação

10 de outubro de 2026. Instrução confirmada: representar o Sol central que já existe no Solar como um símbolo autónomo de aplicação, também a preto e branco. As propostas de lettering, monograma e abstração V2 foram rejeitadas e retiradas da revisão. O servidor desse preview foi parado.

## Pesquisa dirigida a ícones de aplicações

- [Microsoft: desenho de app icons](https://learn.microsoft.com/en-us/windows/apps/design/iconography/app-icon-design). A metáfora principal deve ser reconhecível em formas simples. A recomendação evita letras e palavras no ícone quando o sistema já apresenta o nome. Escala pequena exige massa e silhueta estáveis; uma versão de alto contraste usa formas sólidas. Para o Solar, isto sustenta partir do Sol e testar a forma isoladamente.
- [Android: adaptive icons](https://developer.android.com/develop/ui/compose/system/icon_design_adaptive). Foreground e background são separados; a camada monocromática permite o tratamento por temas do launcher. Canvas de 108 dp com zona segura de 66 dp. A máscara do sistema não pode destruir os elementos que tornam o Sol reconhecível.
- [Mozilla: redesenho Firefox de 2017](https://blog.mozilla.org/en/firefox/new-firefox-new-firefox-icon/). Este caso histórico conserva a figura existente e simplifica a sua matéria em formas mais elementares. É uma referência de método: reduzir o Sol do Solar sem o substituir por outro conceito. Não descreve necessariamente o ícone Firefox atual.
- [Bear: aplicação e símbolo](https://bear.app/). Página observada no browser: a figura do urso é reconhecível em negativo dentro de uma forma compacta. A lição para o Solar é a autonomia da figura e o controlo do espaço negativo. Não usar a geometria do urso nem a sua composição como molde.

As fontes de plataforma foram lidas diretamente. A documentação Apple de app icons foi encontrada, mas a extração do seu conteúdo completo não esteve disponível; não serve de suporte a regras adicionais neste estudo.

## Aplicação ao Sol existente

A referência visual é o Sol já aprovado, visível em `docs/verification-evidence/solar-workspace.png`: corpo esférico, matéria fragmentada e presença luminosa. O próximo desenho deve conservar a identidade desse objeto numa redução gráfica. Não é uma captura do avatar, uma nova personagem ou uma abreviação do nome.

Critérios para o estudo:

1. O símbolo sozinho comunica Sol; não precisa de nome, número, letras ou elementos ao lado para funcionar.
2. Começar com uma forma sólida e poucos recortes. A matéria fragmentada pode informar o desenho, desde que não se transforme em ruído a 16 px.
3. Comparar preto sobre branco e branco sobre preto com a mesma geometria; cor e acabamento vêm depois.
4. A vista grande não decide a aprovação. Verificar 16/24/32/64 px e máscaras de app icon.
5. O rosto só entra se ajudar a reconhecer o Sol existente e sobreviver à escala; não criar um emoji novo para preencher o centro.

O [estudo focado](../solar-sun-icon/index.html) usa agora disco sólido e corona curva. O primeiro ensaio com rosto e borda fragmentada foi rejeitado internamente porque se lia como emoji/bolacha. Uma correção em lote retirou esses elementos. A confirmação visual em browser observou a mesma forma em preto/branco e amostras reais de 16/24/32/64 px; a [pré-visualização isolada](../solar-sun-icon/preview.png) não contém texto ou números. Isto verifica o estudo, não uma instalação nativa nem a aprovação do utilizador. Favicon, ícone Windows, ícone Android, mapa e avatar permanecem sem esta proposta.

## Custo de execução

Os agentes antigos desta ronda foram parados. A nova tarefa de ícone usa um único agente com raciocínio médio e contexto focado, sem herdar todo o histórico. Nenhum agente antigo de esforço elevado foi retomado. A auditoria técnica já executada permanece conservada; não se repetem suites completas por alterações de documentação ou desenho.
