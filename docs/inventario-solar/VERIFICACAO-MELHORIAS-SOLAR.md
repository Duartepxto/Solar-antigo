# Melhorias Solar — 5 de outubro de 2026

## Implementado e instalado

- Pílula reduzida a 48 × 108 px, vidro escuro e dourado Solar. A pedido do utilizador, o desenho anterior com arcos, barras de voz e botão de envio foi reposto, mantendo o tamanho e a cor. O painel principal do agente não foi redesenhado.
- Compatibilidade Codex: quando o Windows devolve `readOnly` para um pedido `workspaceWrite`, o Solar conserva a política mais restrita e pode iniciar a conversa. Continua a recusar políticas ausentes ou permissões mais amplas. Esta correção não ativa escrita nativa no Windows.
- Whisper: filtra transcrições constituídas apenas por anotações conhecidas de ruído/música, preservando frases legítimas.
- Rotinas: uma falha ao criar a tarefa marca essa execução como falhada e deixa as seguintes avançar. Não acrescenta repetição automática de ações.
- Cliente móvel no navegador: pedidos com limite de 12 segundos, proteção contra respostas atrasadas após sair, preservação do texto escrito durante um envio e ausência de reconstrução do histórico quando nada mudou.

O instalador local `orbit-app/release-solar/Solar-0.1.87-setup.exe` foi compilado e instalado silenciosamente. O servidor, cliente móvel e asset de voz instalados correspondem aos ficheiros compilados. A versão mantém o número 0.1.87 com estas alterações locais.

## Evidência e verificações

| Verificação | Resultado |
| --- | --- |
| Codex e voz local | 148 testes passaram, 1 ignorado |
| Rotinas após correção | 133 testes passaram |
| Cliente móvel em Chrome, 390 × 844 | 1 teste passou: emparelhar, preservar rascunho e sair durante pedido pendente |
| Pílula em Chrome | 1 teste passou: estados, dimensões e chamada contínua |
| TypeScript cliente/servidor e traduções | Passaram |
| Build completo e servidor empacotado | Passaram |
| Instalação e serviço Whisper | Código 0; `ready: true, local: true` |

Os conjuntos sobrepõem verificações anteriores; os números não devem ser somados como total de testes únicos. Os testes usam dados isolados e serviços simulados. A sonda do Codex real usou um diretório temporário vazio e uma conversa efémera, sem enviar turnos ao modelo. Confirmou a política `readOnly` devolvida nesta instalação.

Capturas locais: `orbit-app/.orbit-scratch/verify-evidence/orbit-island/8-solar-compact.png` e `orbit-app/.orbit-scratch/verify-evidence/solar-phone/connected.png`.

## Planeado e por validar

O [plano móvel](PLANO-TELEMOVEL-SOLAR.md) propõe começar pelo navegador e aproveitar depois os clientes nativos Android/iOS existentes. A aplicação móvel nova foi apenas planeada. Não houve emparelhamento num telemóvel físico, chamada com microfone real, pedido pago ao modelo ou comando remoto a uma aplicação pessoal.

As [propostas do painel](propostas-agente/README.md) são imagens, com conteúdo ilustrativo. Não foram aplicadas ao produto. Não se abriram portas no router nem se criaram integrações ou contas externas.
