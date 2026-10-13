# Solar antigo: HTML autónomo

Exportação visual da versão local anterior ao Solar V0, no projeto `orbit-app` (Solar 0.2.2). Os componentes, estilos, materiais 3D e animações vêm desse projeto; o Solar V0 não foi usado nesta exportação.

`Solar antigo.html` contém JavaScript, CSS, fontes, ícones e texturas num único ficheiro comprimido. Abrir num browser moderno. Foi também guardada uma cópia idêntica em `C:/Users/duart/Downloads/Solar antigo.html`.

Os agentes, mensagens, motores e memória são dados sintéticos. As chamadas HTTP são respondidas em memória e o documento bloqueia ligações de rede. É uma demonstração para rever e transferir o design, não um backend funcional.

Verificado no browser por HTTP local: renderização WebGL do sol, planetas e lua, abertura do agente, navegação para Sistema, pesquisa, repetição da apresentação e mapa mobile a 390 × 844 sem overflow horizontal. O browser de verificação não permite o protocolo `file:`; a abertura por duplo clique não foi automatizada. Os recursos estão incluídos e não necessitam do servidor utilizado na verificação.

Para regenerar a partir do mesmo checkout: na pasta `orbit-app`, executar `node .orbit-scratch/design-export/build.mjs`. Os adaptadores e o empacotador estão nessa pasta. Não foram alterados os componentes da aplicação antiga nem do Solar V0.
