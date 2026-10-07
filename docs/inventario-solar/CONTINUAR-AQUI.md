# Continuar o Solar

Última continuação: **7 de outubro de 2026**. Ler primeiro o
[estado do ditado e scroll](DITADO-E-SCROLL-07-10-2026.md): Windows 0.1.95
instalado, microfone no chat e barra de scroll limitada acima do compositor. O
estado **Windows 0.1.93**: faixa de apps retirada a pedido do utilizador;
manter o mapa aprovado e privilegiar funcionalidades. O
[guia das ligações visíveis](LIGACOES-VISIVEIS-07-10-2026.md) para a versão
Windows 0.1.92 e o
[guia dos planetas portáteis](PLANETAS-PORTATEIS-07-10-2026.md) para a versão
Windows 0.1.91, com exportação/importação manual de memória e conversas, e o
[estado da continuação](CONTINUACAO-07-10-2026.md): Windows 0.1.88 instalado,
Android Solar 1.0.1 preparado, partículas e chamada por turnos implementadas.
O utilizador adiou os testes físicos e a recuperação da chave original.
As alterações desta continuação estão locais; publicação depende da confirmação
exigida em `orbit-app/PRODUCT.md`. O estado de 6/10 abaixo é histórico.

Código e relatórios: [branch codex/solar-android-and-chat](https://github.com/Duartepxto/Solar/tree/codex/solar-android-and-chat).
APK corrigido: [pré-lançamento Android de 6/10](https://github.com/Duartepxto/Solar/releases/tag/solar-android-preview-2026-10-06).
O hash do ficheiro publicado corresponde ao APK verificado e instalado. A branch
`main` foi preservada; retomar nesta branch para incluir todas as alterações.

## Estado entregue

- Solar Windows instalado e aberto; `/api/health` respondeu 200.
- Pílula Alt+T com o desenho escolhido, tamanho 48 × 108 px e cores atuais.
- Melhorias de contexto, voz por turnos, recuperação, rotinas e cliente móvel
  descritas nos relatórios deste diretório.
- Solar Preview Android instalado e atualizado por USB no aparelho do utilizador.
- O primeiro APK recusava o QR Solar; o parser foi corrigido para
  `/solar#token=…`. A atualização conserva os dados com `adb install -r`.
- **1.580 testes Android aprovados**, sem falhas: 625 de protocolo e 955 da app.
- Assinatura v2 do APK verificada. Artefacto local:
  `orbit-app/release-solar/android/Solar-Android-preview.apk`.
- O utilizador respondeu **«Sim, já ligou»** ao teste de emparelhamento após a
  atualização. O companion regista um dispositivo emparelhado.
- A bateria geral desktop inicial não está verde; não a confundir com os
  conjuntos específicos aprovados. Ver `ESTADO-FUNCIONAL-SOLAR.md`.

## Próximos passos

1. Validar envio/receção, reconexão Wi-Fi e uma ação reversível do PC a partir do
   Android numa fixture isolada. Não usar as conversas pessoais para testes automáticos.
2. Testar a chamada desktop com microfone real. O fluxo atual é por turnos,
   com Whisper e resposta falada; não tem conversa simultânea nem interrupção pela voz.
3. Implementar chamada no Android. Atualmente tem ditado, não chamada contínua.
4. Investigar as falhas restantes da bateria desktop, sobretudo fixtures Windows
   e encerramento de processos de testes, antes de repetir a bateria inteira.
5. Configurar só as integrações externas e o acesso fora de casa que o utilizador
   escolher. VM, Discord e outras contas não ficam configurados por instalar o APK.

## Como retomar

Ler `orbit-app/AGENTS.md`, `orbit-app/PRODUCT.md` e
`orbit-app/docs/verification/README.md`. O desenho principal do agente não foi
alterado; as propostas são apenas imagens em `propostas-agente/`.

Android Windows: `orbit-app/scripts/build-solar-android.ps1` compila e testa;
`install-solar-android.ps1` instala no único dispositivo USB autorizado, sem
desinstalar aplicações nem apagar dados. JDK/SDK/caches estão localmente em
`.orbit-scratch/android-tools` e ficam fora do Git. Conservar a chave de
desenvolvimento local para futuras atualizações da mesma preview; não publicar
chaves ou credenciais no repositório.

O APK usa `com.solar.companion.preview`; o namespace Kotlin interno e o protocolo
`orbit` são mantidos por compatibilidade. Não criar outro cliente Android paralelo.
