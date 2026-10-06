# Solar Android — 6 de outubro de 2026

## Base escolhida e implementada

O projeto referido é o [OpenMausBot](https://github.com/milind-soni/OpenMausBot).
O seu [cliente Android oficial](https://github.com/milind-soni/OpenMausBot/tree/main/android)
usa Kotlin/Compose e um módulo de protocolo separado. A documentação oficial
descreve emparelhamento com um computador e conversa pelo telefone.
Essa base já fazia parte do Solar; foi aproveitada em vez de criar outro cliente.

A aplicação passa a chamar-se **Solar**, com pacote `com.solar.companion` e
ícone de sol em vetor. A versão instalável de desenvolvimento é **Solar Preview**,
pacote `com.solar.companion.preview`. Conservam-se o namespace interno Kotlin e
o protocolo de emparelhamento `orbit`, para compatibilidade com o Solar do PC.
Os ícones Android antigos e a sua regeneração foram removidos.

## Artefacto e verificações

- APK: `orbit-app/release-solar/android/Solar-Android-preview.apk`.
- Cópia no GitHub: [Solar Android Preview](https://github.com/Duartepxto/Solar/releases/tag/solar-android-preview-2026-10-06). O digest do asset publicado corresponde ao SHA-256 abaixo.
- Build: Gradle 9.5.0, JDK 17 local e SDK Android 37.0; sem alterar o Java global do Windows.
- Protocolo nativo: **625 testes aprovados**, incluindo o formato QR Solar.
- Aplicação: **955 testes aprovados**.
- Nenhum teste ignorado nestes dois conjuntos finais.
- Assinatura de desenvolvimento verificada com `apksigner`; esquema v2 válido.
- Manifesto: nome Solar Preview, pacote próprio e Activity de arranque válida.
- O Solar instalado respondeu 200 em `/api/health`; companion ativo na porta 8810.
- Instalação e atualização por USB concluídas com `adb install -r`, sem apagar dados.
- O utilizador confirmou que a app abriu e, depois da correção do QR, ligou ao PC. O companion regista um dispositivo emparelhado.
- Microfone real, envio/receção de uma conversa completa e controlo do PC ainda não foram testados no telefone nesta sessão.

A fixture IPv6 escolhia qualquer interface IPv6, incluindo uma que não conseguia
dar scope a um endereço link-local no Windows. Passou a exigir uma interface com
endereço link-local. O teste de instruções também foi atualizado para o caminho
real Solar → Jarvis → System → Remote / phone.

O scanner inicialmente recusava o QR `/solar#token=…` produzido pelo PC, porque
aceitava apenas `orbit://pair` e `/pair#code=…`. O parser agora aceita também o
formato Solar, mantendo a credencial só no fragmento e rejeitando duplicados,
userinfo, tokens inválidos e destinos públicos HTTP. A versão corrigida passou
**1.580 testes** e foi instalada no aparelho. O utilizador confirmou o emparelhamento.

SHA-256 do APK corrigido:
`01A4DB2345E7F14A506D4CC9A3BE0FD85185FA2B27F7B21FBCFA2BB5311EC1EC`.

Os testes usam dados e servidores de teste. Não foram enviados pedidos pagos a
modelos nem mensagens a contas externas para obter estes resultados.

## Instalação USB e ligação ao PC

O utilizador escolheu instalação por USB com depuração e o procedimento foi concluído. É necessário cabo de
dados, Depuração USB ativa e autorização do PC no próprio telefone.

Depois de o dispositivo estar autorizado, executar no projeto:

```powershell
./scripts/install-solar-android.ps1
```

O script instala com `adb install -r` e abre Solar Preview. Não remove apps nem
apaga dados para resolver conflitos de assinatura. Havendo vários dispositivos,
exige uma seleção explícita por `-DeviceSerial`.

USB serve para instalação e diagnóstico. A ligação normal ao Solar usa a rede:
PC e telefone na mesma Wi-Fi, Solar aberto no PC, e QR Android nas definições
Remoto/telefone. Em Solar Preview, usar **o scanner dentro da app**: esta variante
não regista os links externos da versão de lançamento. Confirmar o nome e o
endereço antes de emparelhar. Não copiar credenciais do QR para logs ou documentos.

Não foram alteradas regras da firewall nem abertas portas no router. Se a rede
do telefone bloquear o PC, o teste físico continua pendente; não se deve inferir
conectividade só porque o serviço respondeu no computador.

## Capacidades e trabalho restante

A base nativa contém conversas, threads, anexos, aprovações, seleção de agentes,
reconexão e estado de rotinas/computador. Os modelos e as ferramentas correm no
PC, com as suas permissões; instalar o APK não configura contas nem concede
controlo do computador automaticamente.

O Android tem ditado para escrever mensagens. **Chamada contínua no telefone
ainda não está implementada.** No PC, a chamada por turnos usa Whisper e resposta
falada, mas falta confirmação com o microfone real. Conversa simultânea e
interrupção pela voz também continuam por fazer.

Fora da rede doméstica, é preciso configurar uma ligação suportada, como
Tailscale ou HTTPS; não foi ativado acesso público. Discord e outras integrações
dependem da respetiva configuração de conta. A bateria geral desktop ainda tem
falhas de verificação descritas no relatório de 5 de outubro; os testes Android
aprovados não eliminam essas pendências.

É possível começar a usar o PC e o cliente Android emparelhado para trabalhar
com os agentes já configurados. A instalação e o emparelhamento físico foram
confirmados; falta completar a prova de envio/receção, desligar/retomar a rede
e validar uma ação reversível do PC num ambiente de teste.

Logs locais: `.orbit-scratch/solar-android-build.log` e
`.orbit-scratch/solar-android-final-package.log` e `solar-android-qr-build.log`. Compilação reproduzível:
`scripts/build-solar-android.ps1`.
