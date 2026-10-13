# Navegação própria e execução — 13/10/2026

O utilizador escolheu uma hierarquia em dois níveis, e depois pediu explicitamente que a composição deixasse de parecer uma órbita circular. A direção final mantém atalhos mais importantes acessíveis, mas usa distâncias diferentes e ligações individuais feitas de fragmentos. Não há anéis, raios contínuos, novos cards ou sidebar. Sol, materiais, caras e chat conservados.

## Decisões visuais
- Controlos afastados do corpo e distribuídos irregularmente; ícones sem esferas decorativas.
- Ligações por fragmentos pequenos, sobretudo em linha reta, com ligeira dispersão e ondulação. A ferramenta ativa ilumina o percurso. Sem animação circular permanente dos menus.
- Entrada curta e interrompível, seleção e foco visíveis, movimento reduzido respeitado, canvas limitado a cerca de 30 fps e suspenso quando o documento fica oculto. Canvas com dimensões CSS independentes da resolução física, para escala alta.
- Retirado o logo e o texto Solar do canto superior esquerdo do workspace. Retirado o Sol decorativo na navegação dos painéis. Mantidos os avatares que identificam efetivamente quem fala.
- Intro original de seis passos: o mesmo Sol percorre uma pequena elipse (18 × 11 px), usando o loop original que já anima olhos e fragmentos; sem novo temporizador e sem sobrepor o texto. Movimento reduzido mostra uma posição fixa.

## Painel da imagem
Execução com uma linha de estado legível e uma segunda linha para o comando atual, sem repetir o rótulo do comando. Expansão mostra passos completos, sem cortar o erro num trecho minúsculo. Histórico separado por turno/digest. No máximo uma ação atual marcada a trabalhar. Uma falha só é descrita como recuperada quando há uma operação subsequente com resultado positivo; uma resposta final não basta para esconder a falha. Recolher e dispensar preservam o comportamento do chat.

## Pesquisa e limites
Consultadas orientações oficiais [Apple Motion](https://developer.apple.com/design/human-interface-guidelines/motion), [Material Motion](https://m3.material.io/styles/motion) e [21st Circle Menu](https://docs.21st.dev/@samitkapoor/components/circle-menu). Referências para hierarquia, continuidade e feedback; nenhuma dependência ou implementação externa acrescentada. O CLI 21st não está disponível neste ambiente; o catálogo oficial foi consultado através da web.

Estudado o painel e os contratos da aplicação de referência, com HEAD confirmado fa21b3c058af3e23a83888e0a999660f39e9a29e. Os ficheiros do painel de execução não mudaram desde o snapshot 282dc429. As mudanças recentes nos menus dos canais foram registadas para a análise funcional futura; não copiadas para este preview. Os componentes de navegação, partículas do menu, execução e interpretação dos estados foram escritos especificamente para Solar.

Validação: build Vite, testes existentes e novos de delimitação por turno, falha não recuperada, recuperação comprovada, uma ação ativa e cobertura/limites dos controlos em três larguras desktop. Inspeção no navegador do mapa, menus, execução expandida e intro. Duas observações confirmaram mudança nas coordenadas do Sol da intro. Consola sem erros novos. Este entregável é o HTML de demonstração para PC; não altera o programa instalado ou o backend real.

Depois de a direção visual estar aprovada, continuar a análise funcional de diferenças entre as aplicações e implementar os gaps no Solar V0, conforme pedido anterior do utilizador.

Refinamento pedido no mesmo dia: ligações com 32–90 fragmentos principais por percurso (mais fragmentos secundários), opacidade de repouso aumentada, fragmentos maiores e ondulação de 18–27 px animada. Percursos destacados mais luminosos; sem alterações ao mapa, menus ou transferências entre agentes.
