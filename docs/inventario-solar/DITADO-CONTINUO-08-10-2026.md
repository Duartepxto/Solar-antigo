# Ditado contínuo — 8 de outubro de 2026

O utilizador confirmou problemas no microfone de ditado do campo de mensagem:
palavras erradas e cortes. Pediu texto enquanto fala e Parar sem enviar.

## Causas confirmadas no código anterior

O composer usava o mesmo endpoint de silêncio que uma conversa por turnos:
parava após 1,8 segundos sem voz acima do limiar de amplitude. A captura
terminava aos 29 segundos e o encoder limitava cada WAV a essa duração.
O único modelo disponível era Whisper base multilingual, com deteção
automática quando Português e Inglês estavam ambos selecionados. Não há
evidência de qual destas condições causou cada palavra errada do utilizador.

## Alterações na versão 0.2.1

- `speechStart({continuous:true})` no composer. Chamadas mantêm os endpoints.
- Prévia cumulativa aproximadamente a cada quatro segundos de áudio, sujeita
  ao tempo do reconhecimento local. Uma pausa não termina a gravação.
- Confirmação de janelas após pausas e pelo menos oito segundos de contexto;
  janelas longas divididas aos 24 segundos, com 1,2 segundos de sobreposição.
- Não acumula silêncio ilimitado. A captura continua durante o reconhecimento.
- Fila de reconhecimento serializada e eliminação de palavras repetidas
  apenas nas fronteiras de áudio sobrepostas.
- Parar fecha o microfone, termina os pedidos pendentes e deixa texto editável.
  Estado «A finalizar o ditado…», envio bloqueado e Escape disponível.
- Listeners da sessão removidos no fim; respostas tardias ignoradas.
- small multilingual Q5_1 final, base nas prévias. Modelo de 190.085.487 bytes
  descarregado do repositório oficial, revisão e SHA-256 verificados.
  Ver `orbit-app/docs/verification/solar-dictation-recognition.md`.

## Verificação

31 testes aprovados em cinco ficheiros, com áudio sintético e chat isolado:
pausas longas, 41 segundos de captura, final do áudio retido, textos cumulativos,
rascunho sem envio, cancelamento, silêncio, idiomas e falhas.

Log: `orbit-app/.orbit-scratch/dictation-continuous-tests.log`.
Capturas: `orbit-app/.orbit-scratch/verify-evidence/solar-chat-dictation/`.
Os dois modelos carregam no whisper.cpp v1.9.0 real. Em CPU local, o encoder
small foi aproximadamente quatro vezes mais lento que base num benchmark
sintético; a escolha de preview rápido mantém a captura independente.

Precisão em português com a voz, microfone e ambiente do utilizador ainda
precisa de teste físico. O modelo maior é uma melhoria esperada, não uma
garantia de equivalência ao ditado de outro produto.

## Instalação confirmada

Solar **0.2.1.0** instalado e aberto no Windows; instalador terminou com código 0.
Bundle instalado idêntico ao compilado (SHA-256
`8CB1592E93C5BFC2096EF50AA3FDF3DAF6DE998A95AB8CEDD2E82CCDE9089F1D`).
Modelo small instalado com SHA-256 oficial confirmado; `/api/health` HTTP 200
e `/api/solar-voice/status` apresenta `ready:true`, `model:small-q5_1`,
`previewModel:base`. O campo `maximumRecordingSeconds:29` descreve o limite
de cada pedido WAV; o ditado contínuo envia várias janelas.
Evidência: `orbit-app/.orbit-scratch/solar-0.2.1-install-verification.json`.
Nenhuma conversa enviada nem microfone utilizado nesta verificação.
