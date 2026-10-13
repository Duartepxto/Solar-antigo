# Entrada Android — auditoria funcional e pesquisa, 10/10/2026

## Estado do design

O utilizador rejeitou a primeira direção de design/logo e pediu investigação
online antes de uma nova aplicação. A UI de entrada original foi reposta. O
símbolo «Sol aberto» não faz parte do Android ativo. Os dois rascunhos interrompidos
estão em `rascunhos-rejeitados/entrada-android-sol-aberto/`, com extensão
`.kt.rejected`, fora dos módulos Gradle. São incompletos e não foram aprovados,
compilados ou validados visualmente. Não os usar como identidade definitiva.

Esta etapa aplica apenas correções de comportamento demonstradas e uma mensagem
de recuperação relacionada com permissão. Não altera mapas, aparência, engines,
contas, sessão, protocolo ou armazenamento de credenciais.

## Percurso revisto no código

| Estado | Comportamento existente / observação |
| --- | --- |
| Primeiro arranque | Explica o companion antes de pedir permissões. «Not now» grava a decisão e chega ao início não emparelhado. |
| Início não emparelhado | Permite voltar ao pairing e abrir Settings. Back em Settings já era tratado. |
| Formulário de pairing | Scanner é a ação principal; descoberta e endereço manual ficam em «Other ways to connect». Abrir esta alternativa inicia e fechar cancela a coleção de descoberta. |
| Scanner | Só pede câmera quando aberto. Código válido chega à confirmação; não resgata automaticamente. Dispose fecha analyzer/câmera; o guard de CameraLifecycle também cobre chegada tardia do provider. |
| Confirmação | Nome/endereço aparecem antes do resgate. Código e attempt ID ficam no store em memória; estado guardado contém só handle e computador. |
| Rotação e morte do processo | Mesmo processo recupera a tentativa; store novo após morte não possui o segredo e obriga a rescan de QR. Não se mudou este contrato. |
| Pairing em curso | Store impede substituição por outro convite e resgate duplo. Botões de cancelamento ficam desativados. |
| Falha ou retry | 429/recusa temporária preservam tentativa e código; outros resultados seguem a política existente. |
| Primeiro pairing concluído | Onboarding de notificações só ocorre depois do commit, com opção de recusar. |

## Dois defeitos comprovados

### Back escapava da entrada em vez de voltar um nível

`PairingScreen` e `QrScannerScreen` não tratavam o Back do sistema. A raiz só
tratava Settings não emparelhados e a navegação do mundo já emparelhado. Três
regressões, executadas na UI anterior com Activity/Compose em Robolectric,
falharam antes da correção: Back no formulário, no scanner e na confirmação
escapava para o encerramento da Activity.

O `BackHandler` agora desfaz um nível dentro do pairing: scanner → formulário;
confirmação → escolha; alternativas → formulário; formulário → início não
emparelhado. Enquanto a tentativa está a resgatar, consome Back sem abandonar
a credencial, tal como os botões visíveis já faziam. Ao desistir limpa apenas o
handle que esta tela possui. Não chama transportes nem faz resgate no Back.
Referência do comportamento de integração: [Compose e BackHandler](https://developer.android.com/develop/ui/compose/libraries).

### QR direto para LAN omitia a permissão da API 37

O app compila/targeta SDK 37 e declara `ACCESS_LOCAL_NETWORK`, mas só a solicitava
ao abrir descoberta. Confirmar um QR de IP privado seguia diretamente para
`Session.pair`. O teste de contrato em Compose, com modelo de permissões API 37,
reproduziu ausência do pedido antes do resgate. Isto demonstra a ligação incorreta
da UI; não simula a firewall do kernel Android 17.

A documentação oficial exige o grant antes de comunicação LAN nas apps que
targetam 37; aplica-se também a sockets de bibliotecas, incluindo OkHttp.
[Permissão de rede local](https://developer.android.com/privacy-and-security/local-network-permission).

O gate está no clique de confirmação: só pede a permissão de rede para destinos
LAN reconhecidos, na API 37+, e deixa a tentativa intacta na memória. Não inicia
descoberta; não envia o código antes do grant; conceder permissão não resgata nada
sozinho — a pessoa confirma de novo. Uma recusa mantém o formulário com instrução
para recuperar o acesso ou escolher outro endereço. Antes da API 37 não se pede
esta permissão.

Não pede para HTTPS público, `.ts.net` ou loopback. IPv4 privado/link-local/CGNAT,
IPv6 local e `.local` são tratados como LAN; HTTPS por si só não muda o destino
da rede. O contexto Android verifica a rota VPN mais específica do IP, evitando
um pedido desnecessário quando o IP vai pelo túnel. Um VPN ativo não dispensa
permissão para outro IP que vá diretamente pela LAN. `.local` mantém o check de
acesso para resolução local. Fontes: [definição de LAN e exclusão de VPN](https://developer.android.com/privacy-and-security/local-network-definition),
[rotas e correspondência de destinos](https://developer.android.com/reference/android/net/RouteInfo).

Limite: domínios arbitrários de HTTPS que resolvam para IP privado não são
classificados por resolução DNS nesta UI. Também falta provar caminhos reais de
VPN, failover e revogação posterior ao pairing num dispositivo API 37. Não se
introduziu resolução DNS nem se reescreveu Session para cobrir essas áreas sem
uma verificação própria.

## Pesquisa para a próxima direção de design

Estas são consequências propostas para Solar a partir de fontes oficiais, não
um layout novo aprovado:

| Fonte primária | Aplicação proposta à entrada Solar |
| --- | --- |
| [Material 3](https://m3.material.io/get-started), [tipografia](https://m3.material.io/styles/typography/applying-type), [papéis de cor](https://m3.material.io/styles/color/the-color-system) | Manrope pode ocupar os papéis de tipo e a identidade própria pode usar as cores temáticas. Não copiar uma composição pronta nem inventar controles que ignorem os estados nativos. |
| [Defaults de acessibilidade Compose](https://developer.android.com/develop/ui/compose/accessibility/api-defaults) | Ações com área de toque de pelo menos 48 dp, sem sobreposição; descrições para ícones com ação; ornamentação não deve duplicar leitura. Validar fonte ampliada, contraste e ordem de leitura no render real. |
| [Permissões em contexto](https://developer.android.com/training/permissions/requesting) | Explicar o uso do companion antes de pedir algo; pedir câmera no scanner e rede ao precisar do destino; manter cancelamento e alternativa manual. |
| [Descoberta NSD](https://developer.android.com/develop/connectivity/wifi/use-nsd) | Descoberta ajuda a localizar o computador. Não deve ser apresentada como conta, sincronização automática ou prova de que um computador é confiável. Preservar confirmação de identidade/endereço. |
| [CompanionDeviceManager](https://developer.android.com/develop/connectivity/bluetooth/companion-device-pairing) | É um mecanismo para dispositivos Bluetooth/Wi-Fi e não cria a conexão por si. Não substitui automaticamente o pairing HTTP/Tailscale Solar. Avaliar UX de confirmação sem trocar o transporte existente. |

O primeiro viewport deve comunicar que o telefone continua o Solar que executa
no computador. QR é a entrada principal e a confirmação é explícita. Caminho
manual e rede privada continuam acessíveis quando a câmera ou descoberta falham.
A nova direção visual precisa de pesquisa de referências e decisão do utilizador;
este relatório não escolhe logo, tipografia nova, layout final ou animações.

## Verificação e limites

- Antes da correção Back: 3 casos executados, 3 falhas confirmadas.
- Depois da correção Back e antes do gate LAN: 5 casos executados; Back e tailnet
  passaram, o caso LAN falhou por ausência de pedido de permissão.
- Verificação final: 100 testes em 11 suítes, zero falhas, erros ou skips.
  `:app:compilePreviewKotlin` também passou. Gradle concluiu `BUILD SUCCESSFUL`
  em 1 min 37 s. `git diff --check -- android` passou.
- SDK/JDK/caches locais existentes foram usados com Gradle `--offline`, sem
  instalação de ferramentas, telefone, emulador, APK ou alteração de assinatura.
- `Session.kt`, clientes HTTP, protocolo, stores de produção e configuração de
  build não foram modificados.

Os testes de UI usam Android 34 em Robolectric e um modelo injetado da política
API 37. São evidência do fluxo de UI/permissões e do HTTP sintético, não prova de
câmera, microfone, gesto preditivo, firewall da API 37 ou rede Tailscale física.
O novo visual continua suspenso.

Comando da execução final, a partir de `orbit-app/android`, com `JAVA_HOME`,
`ANDROID_HOME`, `ANDROID_USER_HOME` e `GRADLE_USER_HOME` apontados às ferramentas
locais já existentes em `.orbit-scratch/android-tools`:

```text
gradlew.bat --offline --no-daemon --max-workers=2 :app:testDebugUnitTest
  --tests '*OnboardingRoutingTest'
  --tests '*ServerPairingScreenTest'
  --tests '*PairingDiscoveryTimingTest'
  --tests '*CompanionPermissionsTest'
  --tests '*PairingStateTest'
  --tests '*PairingSecretStoreTest'
  --tests '*PairingInviteTransactionTest'
  --tests '*PairingConfirmationTest'
  --tests '*CameraLifecycleTest'
  --tests '*PairingFailureDispositionTest'
  --tests '*PairingHandoffTest'
  :app:compilePreviewKotlin
```

Resultados XML/HTML em `android/app/build/test-results/testDebugUnitTest/` e
`android/app/build/reports/tests/testDebugUnitTest/`. A execução final inclui os
cinco caminhos Back (formulário, scanner, confirmação, descoberta e tentativa em
curso), o gate API 37, recusa/retoma com nova confirmação e exclusão do tailnet.
Também verifica o pairing HTTP com servidor MockWebServer descartável e os
contratos existentes de segredo, estado e câmera. As advertências de deprecação
em áudio/EncryptedSharedPreferences são anteriores a estas correções; não foram
tratadas como erros nem refatoradas nesta passagem.

Pendências antes de declarar prontidão Android: câmera/QR e gesto preditivo em
telefone físico; política LAN e revogação do grant em API 37 real; rede local,
rede convidado, VPN com rotas e bypass, Tailscale e mudança de computador;
recuperação de uma ligação guardada após revogação de acesso à rede; domínios
HTTPS que resolvam para rede privada. Esses cenários ficam inventariados e não
são cobertos pela contagem de 100 testes.

Copy a corrigir na próxima passagem: o início não emparelhado ainda cita
`Solar → Settings → Phone`, enquanto o formulário já cita o caminho Solar
`Jarvis → System → Remote / phone`. Não se reabriu o redesign para alterar essa
tela depois da reposição do rascunho rejeitado.
