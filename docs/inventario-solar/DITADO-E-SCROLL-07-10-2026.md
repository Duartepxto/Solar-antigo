# Ditado no chat e barra de scroll — Solar 0.1.95

O compositor das conversas ainda dependia da capacidade de ditado nativo
macOS, ocultando o microfone no Windows. As conversas Solar agora usam
`useSolarDictation`, o mesmo caminho do microfone do mapa, com voz local
quando disponível e o reconhecedor do navegador como alternativa.

O microfone aparece também com um rascunho escrito. Durante o ditado,
o campo fica só de leitura e o envio aguarda; o botão Parar continua visível.
O texto ditado fica no rascunho para revisão. Escape cancela; mudar de
conversa ou fechar o compositor liberta a sessão. Erros usam as mensagens
existentes. O fluxo original macOS fora do Solar foi preservado.

O scroll da conversa Solar agora tem uma altura reduzida pela altura medida
do dock do compositor e pelo espaço de ficheiros oferecidos. A barra deixa
de se estender por trás do campo de mensagem; o fim da transcrição mantém
um intervalo de 0,75rem acima do dock.

Dez testes passaram: ditado/transcrição, áudio PCM, altura do dock e teste
de navegador com uma conversa extensa, desktop e 390 px. A fixture controla
o reconhecedor e a disponibilidade do motor; não acede ao microfone real.
O teste físico continua adiado a pedido do utilizador.

Solar 0.1.95.0 instalado e aberto neste PC. Serviço local HTTP 200, motor de
voz pronto e SHA-256 do pacote instalado igual ao build. A versão 0.1.94 foi
construída mas não instalada: a correção de scroll chegou durante o trabalho
e foi incluída na única atualização instalada, 0.1.95.
