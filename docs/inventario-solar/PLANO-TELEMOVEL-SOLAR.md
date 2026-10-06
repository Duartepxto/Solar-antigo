# Solar no telemóvel — plano

## Decisão proposta

Usar o PC como o único servidor do assistente e o telemóvel como outro cliente do mesmo Solar. Não criar outro agente, outra base de conversas nem copiar chaves dos motores para o telefone.

Começar pela ligação no navegador que já existe. Para uma app própria, aproveitar os clientes nativos já presentes em `orbit-app/android` (Kotlin/Compose) e `orbit-app/ios` (SwiftUI), substituindo a apresentação Orbit pela identidade Solar depois de escolher o desenho. Não começar um terceiro cliente em Flutter/React Native sem uma necessidade que justifique esse custo.

O utilizador confirmou que usa Android. A ordem é navegador → Android → iOS. Em 6 de outubro autorizou implementar a app Android: Solar Preview foi compilado a partir da base existente, com 1.580 testes aprovados após corrigir a leitura do QR Solar. Foi instalado e atualizado por USB; o utilizador confirmou a ligação ao PC. Ver [estado Android](ANDROID-SOLAR-06-10-2026.md). A ligação local pelo navegador já foi ativada no PC. Xcode exige macOS para construir e testar a versão iOS. [Requisitos oficiais](https://developer.apple.com/xcode/system-requirements).

## O que já existe no código

| Área | Base existente | O que falta verificar para Solar |
| --- | --- | --- |
| Ligação simples | `/solar`, emparelhamento por QR e token por dispositivo | Telemóvel físico na rede do utilizador |
| Autenticação | Sidecar com bearer, origem validada e rotas autorizadas explicitamente | QR atual, expiração, revogação e reemparelhamento no dispositivo real |
| Android | Cliente Kotlin/Compose, QR, protocolo e testes | Identidade Solar, compilação/apk e QA em aparelho |
| iPhone/iPad | SwiftUI, QR, Keychain, chat, aprovações e stream | Build em Mac, identidade Solar e distribuição |
| Conversas | REST e SSE com retoma nos clientes nativos | Quedas Wi-Fi/4G, mensagens grandes e paginação |
| Rotinas | Agendamento no PC, histórico, resultados e aprovações | Fluxo móvel completo com PC a dormir/retomar |
| Computador | Ferramentas existentes no agente e permissões no PC | Ação iniciada pelo telefone até ao Windows, sem alargar permissões |

São capacidades encontradas no código e nos documentos, não garantias de que todas foram testadas neste PC. O cliente simples do navegador suporta menos funcionalidades que os clientes nativos: por exemplo, ainda indica que uma aprovação deve ser aberta no PC.

## Etapa 1 — ligação utilizável agora

1. Usar as definições de acesso remoto existentes e mostrar o destino do PC antes de emparelhar.
2. Na mesma rede, usar o QR LAN do próprio Solar. Não abrir portas no router. Fora de casa, preferir uma rede privada como Tailscale ou o transporte HTTPS existente, escolhido explicitamente.
3. Testar com o aparelho: emparelhar, mandar uma mensagem, receber a resposta, perder Wi-Fi, retomar, sair e revogar o dispositivo no PC.
4. Tornar claros os estados: PC inacessível, token revogado, agente ocupado e aprovação pendente.
5. Só considerar esta etapa concluída depois de um teste físico. Não foi possível fazê-lo nesta sessão sem acesso ao telefone.

Nesta sessão, o browser móvel foi melhorado e testado num Chrome de 390 × 844 com servidor fictício: um polling sem mudanças mantém as mensagens no DOM; uma mensagem enviada não apaga um novo rascunho; sair durante um refresh impede que a resposta atrasada restaure a sessão. As chamadas HTTP têm timeout. As verificações de autenticação e origem mantêm-se.

## Etapa 2 — primeira app Solar

Escopo inicial: computadores emparelhados, agentes, chat com streaming, enviar/receber anexos suportados, interromper uma resposta, responder a perguntas/aprovações, rotinas com próxima execução e resultados, estado de ligação e revogação.

Reutilizar o protocolo e os testes nativos atuais. Guardar apenas a confiança do dispositivo no armazenamento seguro da plataforma. O PC continua a guardar motores, chaves e histórico principal. Uma cache de leitura local deve mostrar quando está desatualizada e permitir limpar os dados ao sair.

Fila de mensagens offline só depois de existir um identificador idempotente de envio. Aprovações e controlo do PC não devem ser reenviados automaticamente depois de uma reconexão. A orientação Android para cache, reconciliação e trabalho condicionado à rede está na [documentação oficial](https://developer.android.com/topic/architecture/data-layer/offline-first).

Critérios de aceitação: uma mensagem chega uma vez; retomar o stream não duplica texto; a aprovação continua associada ao pedido certo; sair/revogar corta o acesso; alternar entre computadores não mistura conversas; uma rotina mantém o mesmo estado no desktop e no telefone.

## Etapa 3 — voz e controlo remoto

Começar por chamada por turnos: gravação no telefone, transcrição no PC com o Whisper existente e resposta falada no telefone. Isso exige um endpoint de áudio específico autorizado pelo sidecar, limites de duração/tamanho, cancelamento e uma regra clara para disputa do reconhecedor. A rota de transcrição do PC não deve simplesmente ficar pública.

Para áudio simultâneo com interrupção pela voz, avaliar Realtime/WebRTC como opção posterior. Tem custos e configuração próprios; não é requisito para o primeiro lançamento. Não foi configurado nesta sessão.

Para controlo do PC, usar o agente e as ferramentas do Solar já existentes. Começar com um teste reversível — abrir uma aplicação e escrever texto num ficheiro temporário. O telefone deve ver o PC escolhido, a ação, o pedido de aprovação quando aplicável e o resultado. Enviar mensagens externas, incluindo Discord, é um fluxo separado com destinatário e conteúdo revistos; não um efeito secundário do emparelhamento.

## Etapa 4 — notificações e distribuição

Não prometer notificações com a app fechada usando apenas uma ligação SSE: os sistemas móveis suspendem aplicações. Push precisa de infraestrutura e decisão de privacidade próprias. O payload deve transportar um identificador, não o conteúdo de conversas; a app autenticada pede os detalhes ao PC.

Android: testar a build debug primeiro, definir identidade Solar e assinatura antes de distribuir. iOS: build e assinatura em Mac, teste em dispositivo e só depois distribuição escolhida pelo utilizador. Não foram criadas contas, comprados serviços ou publicadas aplicações.

## Próximas decisões quando o utilizador voltar

Android já confirmado. Falta decidir se precisa de funcionar fora de casa e qual é o primeiro fluxo indispensável: chat, aprovações, chamada ou controlo do PC. Estas decisões afinam a ordem, não exigem refazer a arquitetura.
