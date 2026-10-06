# Voz e painel lateral no Windows

## Alterações

Na revisão compacta pedida pelo utilizador, o preenchimento sólido e o botão âmbar foram substituídos por vidro escuro translúcido, reflexos suaves e controlos neutros. O nome fica apenas no painel expandido; o atalho deixou de ocupar espaço no painel. A versão atual mede 48 × 108 px, com vidro escuro e detalhes dourados Solar. O efeito CSS de vidro atua sobre o conteúdo da janela; não promete desfoque nativo de outras aplicações no Windows.

O painel flutuante reutiliza a ponte Whisper local já usada pelo ditado e pelo modo de chamada. O Windows passa a registar Alt+T e a mostrar a opção de voz no menu da área de notificações e nas definições.

A janela transparente fica na margem direita, centrada na área útil do monitor, sem roubar o foco. A pílula vertical mede 48 × 108; expande para 232 × 192 quando mostra texto ou avisos. O resto da janela deixa passar os cliques. O macOS conserva o painel junto ao notch.


O redesenho do painel Windows substitui a personagem de partículas, os efeitos verdes e o estilo anterior por um instrumento Solar em grafite e âmbar. A pedido do utilizador, o desenho anterior com arcos, duas barras de voz e botão de envio foi reposto, conservando os 48 × 108 px e as cores atuais. Usa Manrope local, estados escritos, focos de teclado e redução de movimento. A pergunta permanece visível durante o pensamento e a resposta é mostrada enquanto é falada. As implementações visuais antigas do Windows foram substituídas; a compatibilidade macOS conserva os seus componentes.

Depois de falar a resposta, o Windows inicia outra escuta e atualiza a captura do ecrã pelo mecanismo existente. O botão inferior envia a fala, interrompe uma resposta ou reinicia o microfone; o botão superior termina a chamada. O acesso ao ecrã respeita a pausa existente. As mensagens seguem para o mesmo agente dedicado do Solar, com as mesmas ferramentas.

Uma reserva do microfone entre janelas mantém a posse durante a transcrição, impede gravações simultâneas e liberta-a quando a gravação termina, é cancelada ou a janela fecha. Um token protege contra cancelamentos atrasados. O painel deixa de chamar diretamente o reconhecedor nativo do macOS no Windows; não foi criada outra implementação de ditado.

## Verificação

- 18 testes Electron: posição, atalho, menu, captura, cliques e reserva do microfone; regressões do macOS incluídas.
- 9 testes de unidades: atalhos da interface e codificação WAV.
- Teste em Chrome isolado: escuta, envio único, resposta em voz, próxima escuta e desligar; sem contas ou conversas reais.
- TypeScript e catálogos de tradução aprovados.
- Compilação completa e instalador Solar concluídos; instalação silenciosa terminou com código 0 e a aplicação foi reaberta. O serviço instalado devolve `ready: true, local: true` para Whisper.
- Sintaxe dos módulos alterados verificada com o Electron local.
- Na instalação atual, os ficheiros do servidor, cliente móvel e asset de voz correspondem ao pacote compilado.
- Evidência visual: `orbit-app/.orbit-scratch/verify-evidence/orbit-island/7-windows-listening.png`.
- Redesenho Solar verificado em duas passagens limitadas no Chrome: modo compacto (`8-solar-compact.png`), aviso expandido (`7-windows-listening.png`) e pergunta durante o pensamento (`9-solar-thinking.png`). O teste confirma que o painel Windows não renderiza a personagem em canvas do Orbit e mantém pergunta/resposta visíveis nos estados respetivos.

## Limites

É uma chamada por turnos, com Whisper local e voz do sistema, não uma ligação Realtime de áudio simultâneo. A gravação existente continua limitada a 29 segundos por turno. A transcrição local pode demorar; o painel permite até 95 segundos na finalização manual, acompanhando os 90 segundos do servidor. Alt+T ou o botão de interrupção permite interromper a fala; não foi implementada interrupção automática pela voz durante a resposta.

O teste de interface usa reconhecimento e síntese simulados. A qualidade acústica e a latência com o microfone real continuam por verificar. O controlo remoto e integrações como Discord precisam de configuração própria; este trabalho não criou contas, enviou mensagens nem validou comandos remotos em dispositivos pessoais.
