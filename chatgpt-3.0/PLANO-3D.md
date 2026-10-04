# Plano de implementação — ChatGPT 3.0

## Decisões confirmadas

- Reutilizar o Solar existente, que já tem frontend, backend e estrutura Electron.
- As duas imagens de robôs fornecidas pelo utilizador são referências visuais.
- Fundo preto, robôs com volume e animações; discutir a composição antes de substituir a interface.
- Manter as linguagens do Solar: TypeScript/JavaScript, React e Node. Acrescentar tecnologia apenas onde necessária.

## Arquitetura proposta

O backend continua a gerir agentes, conversas, motores, ferramentas, aprovações e persistência. HTTP e SSE continuam a ligar o frontend ao backend. O estado visual é derivado desses eventos, sem inventar atividade.

O frontend conserva os painéis HTML/React de chat, documentos, configurações e aprovação. O mapa atual (`src/orbit/scene.ts` e `characters.ts`) usa canvas 2D; a camada visual será substituída por uma cena Three.js. Uma cena e um renderer partilhados para o mapa inteiro, em vez de um contexto WebGL por robô. Começar com integração direta, porque o Solar já tem um ciclo imperativo de cena; avaliar React Three Fiber se simplificar a integração com React.

Separar a interface da cena (foco, câmara, seleção, coordenadas projetadas, entidades e eventos) da implementação do renderer. Identidade do agente e execução pertencem ao domínio; modelo, materiais e animações pertencem à apresentação. Preservar controlos acessíveis em HTML e a navegação por teclado.

Não é preciso reescrever o backend, mudar para Unity/Unreal ou introduzir Python como servidor. Python pode servir para automatizar a criação de assets no Blender.

## Composição proposta para discussão

Um assistente coordenador no centro; líderes de equipa à volta; especialistas próximos do seu líder. A identidade central deve ser decidida: o Solar distingue atualmente o utilizador central do assistente Solar, no canto. Não fundir silenciosamente essas duas entidades no backend.

Perspetiva inclinada semelhante às imagens, com câmara ortográfica inicialmente para legibilidade. Fundo preto liso, pedestais escuros, pequenos anéis luminosos e cor por equipa. Luz ambiente e iluminação de estúdio revelam os materiais brancos. Bloom contido nos elementos emissivos; nomes e estados em HTML permanecem nítidos.

O mapa geral realça equipas e relações; aproximar revela membros, evitando dezenas de personagens e ligações sobrepostas. Ligações representam relações de equipa; pulsos de trabalho só aparecem com eventos reais. Poucos adornos ambientais para não competir com a informação.

Clicar num robô aproxima a câmara e abre o chat ao lado. Esc regressa ao mapa. Quando mostra um ficheiro, o documento ocupa o palco junto da conversa. Os painéis mantêm contraste e texto legível sobre o preto. A adaptação para ecrãs pequenos terá enquadramento próprio.

## Processo de criação dos robôs

1. Reunir referências coerentes de frente, costas, lados e três quartos; fixar proporções e escala. Ângulos inconsistentes devem ser resolvidos antes de construir variantes.
2. Fazer um robô base simples para validar tamanho, silhueta e enquadramento dentro da aplicação.
3. Construir o modelo mestre: cabeça, visor, tronco, braços, pernas, antena e mochila separados. Materiais claros com visor escuro e olhos emissivos.
4. Preparar articulações ou esqueleto e pontos de encaixe para acessórios. Os olhos podem ser geometria ou textura controlada, com expressões parametrizadas.
5. Criar animações nomeadas: repouso, pensar, trabalhar, falar, esperar por aprovação, concluir e erro. O movimento de fala usa o áudio quando houver acesso a esse sinal; não pressupor sincronização labial disponível.
6. Exportar GLB com materiais e clips. Validar a exportação no renderer real: shaders e efeitos do Blender nem sempre são transportados para glTF.
7. Derivar investigador, programador, designer e outros do mesmo modelo mestre: cores, acessórios e objetos de trabalho, com a mesma família de animações.

As imagens não contêm malha, profundidade, UVs ou rig. Posso construir um modelo procedural e scripts de Blender, integrar GLB e ligar as animações ao estado. A reprodução artística final exige validação visual e pode beneficiar de modelação manual especializada. Uma ferramenta de imagem para 3D pode acelerar uma primeira malha, mas é preciso verificar geometria, materiais e capacidade de animação.

## Estados e comportamento

Separar estado operacional de expressão. Pensar/trabalhar vêm do motor, espera vem de um pedido de aprovação, conclusão vem do resultado. Feliz é uma expressão breve de conclusão; não implica uma nova condição do backend. Offline e erro precisam de rótulos e indicação acessível, além de cor. Priorizar erro e aprovação acima de animações decorativas; transições suaves entre clips e fase inicial variada para evitar movimentos sincronizados.

## Sequência e critérios de conclusão

1. **Base local:** lançamento conjunto, dados próprios, onboarding existente e verificação isolada. Antes de declarar IA real funcional, configurar um motor e comprovar uma conversa autorizada.
2. **Contrato da cena:** documentar comportamentos atuais e adaptar o renderer sem quebrar seleção, zoom, teclado, painéis e eventos.
3. **Prova 3D:** um robô e uma pequena equipa sobre preto, com seleção, foco, iluminação e estados ligados à fixture. Validar o resultado antes de produzir todas as variantes.
4. **Modelo mestre:** testar malha, rig, materiais e clips dentro da aplicação. Rever de perto e à escala do mapa.
5. **Migração do mapa:** equipas, líderes, ligações, nomes, documentos e chat. Miniaturas usam imagens derivadas do mesmo modelo; não renderizar cada avatar pequeno em WebGL.
6. **Desempenho e entrega:** carregamento progressivo, reutilização de geometrias/texturas, menor detalhe à distância, animações suspensas quando invisíveis, movimento reduzido e apresentação alternativa se WebGL falhar. Medir no PC alvo; metas provisórias de 60 fps em uso normal e 30 fps em qualidade reduzida, sujeitas a teste.
7. **Windows:** validar e empacotar Electron com nome, ícone e dados da aplicação. Testar arranque, saída, recuperação do backend e atualização sem sobrescrever o fork com mudanças incompatíveis.

## Próxima decisão visual

Recomendação: mapa geral com enquadramento estável, deslocação e zoom; rotação livre fica para a inspeção do personagem. Aprovar primeiro um robô e uma equipa funcionais. Não produzir todos os modelos antes de validar essa composição.

## Referências técnicas

- https://threejs.org/docs/pages/GLTFLoader.html
- https://threejs.org/manual/pages/animation-system.html
- https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html
