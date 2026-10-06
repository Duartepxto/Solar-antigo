# Continuar o Solar

Última sessão: **6 de outubro de 2026**. O utilizador pediu para guardar todo o
trabalho no GitHub e continuar mais tarde.

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
