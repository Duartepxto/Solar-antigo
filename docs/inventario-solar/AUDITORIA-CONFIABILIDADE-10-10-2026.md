# Solar — auditoria de confiabilidade, 10/10/2026

Esta revisão verificou o transporte HTTP, perguntas/aprovações do motor Claude,
contratos de autenticação e rotas, encerramento, caminhos de processos do pacote,
mensagens externas guardadas, conversas concorrentes e recuperação de mensagens
em fila após restart. As verificações usaram perfis temporários, sockets próprios
e motores falsos. Nenhuma mensagem foi enviada ao Solar pessoal nem foram usados
tokens ou credenciais de fornecedores reais.

## Defeitos reproduzidos e reparados

### 1. Mensagens JSON podiam perder acentos e emoji

`server/harness/http.ts` convertia cada Buffer recebido em texto isoladamente.
Se o socket cortasse um carácter UTF-8 a meio, o JSON continuava válido, mas já
continha caracteres de substituição. Reproduzido antes do reparo num servidor HTTP
descartável: `Olá, ação. ☀️ 🪐 日本語` regressava como `Ol��, ação. ☀️ 🪐 日本語`,
incluindo o corpo retido para auditoria. Isto afetava todas as rotas JSON que usam
o leitor partilhado: conversas, perfis e imports, entre outras.

O leitor usa agora `StringDecoder`, que mantém o fragmento incompleto até ao chunk
seguinte. O limite continua contado em bytes e um pedido demasiado grande recebe
413 sem se destruir o socket antes da resposta. Ao falhar liberta o texto retido.
Seis verificações sobre sockets HTTP reais cobrem divisões em caracteres de dois,
três e quatro bytes, corpo vazio, JSON inválido e limite de tamanho.

### 2. Perguntas e respostas humanas também podiam ser corrompidas

`server/permission-proxy.ts` tinha o mesmo problema no stdin e na ligação ao broker.
Antes do reparo, o proxy real num processo filho transformou `Já está pronto? 🪐`
em `J�� está pronto? 🪐`, e uma resposta do broker `Está aprovado. ação ☀️` em
`Est�� aprovado. ação ☀️`. Dois casos reproduziram os dois sentidos em pipes reais.

Os dois streams passam agora por `setEncoding("utf8")`. O receptor do broker em
`server/drivers/claude.ts` também recebeu a mesma correção para manter intacta a
pergunta enviada pelo proxy. Uma regressão adicional exerce este broker real por
named pipe, com pergunta cortada dentro de um acento e resposta portuguesa.

## Evidência executada

Comandos executados em `orbit-app` com acesso às dependências reais. No sandbox,
restrições de resolução de dependências produzem erros de tipos artificiais; não
se alterou código para contornar esses falsos positivos.

| Verificação | Resultado | Limite da conclusão |
| --- | --- | --- |
| `node node_modules/oxlint/bin/oxlint --deny-warnings --ignore-pattern node_modules .` | Passou antes e depois do primeiro reparo | Qualidade estática; não demonstra fluxos |
| Lint dos seis arquivos alterados | Passou após os reparos | Não revalida mudanças de outros agentes posteriores |
| `node node_modules/typescript/bin/tsc -p tsconfig.server.json --noEmit` | Passou após os reparos | Tipos do servidor |
| HTTP, request-auth, route table, graceful-shutdown, proxy-paths | 58 passaram; expansão HTTP posterior: 6 passaram | Contratos e HTTP real isolado; não é pacote instalado |
| Proxy completo e driver Claude completo | 164 passaram, 2 saltados, 1 falhou | Ver ressalva abaixo; não declarar a suíte toda verde |
| Novo caso do broker UTF-8 | Passou, isoladamente | Named pipe real, fornecedor falso |
| Guarded messages, independent threads, followups restart | 18 passaram, 1 saltado em 149,77 s | Servidores reais isolados e motores falsos |

A falha do conjunto completo foi `injects a leftover API id when a local host is
serving that model`: faltava o arquivo sintético `dump-leftover.json`. A mesma
verificação passou executada isoladamente. Não se comprovou a causa; fica pendente
investigar interferência de estado, lançamento do motor falso e carga concorrente.
Não foi atribuída ao reparo Unicode nem escondida por uma alteração ao teste.

Fluxo manual pela superfície oficial `control-orbit`, numa fixture dedicada:

```text
node --experimental-strip-types scripts/control-orbit.ts launch
doctor --url http://127.0.0.1:20400
bots --url http://127.0.0.1:20400
send --bot e035e393-477a-4850-9a3a-7db2066a7eca --text "Olá, ação Solar ☀️ 🪐 日本語" --url http://127.0.0.1:20400
wait --bot e035e393-477a-4850-9a3a-7db2066a7eca --timeout 30 --url http://127.0.0.1:20400
messages --bot e035e393-477a-4850-9a3a-7db2066a7eca --limit 10 --url http://127.0.0.1:20400
```

`doctor.ok = true`; envio aceite para a conversa `8e688277-baee-498f-9875-3d497e1b2886`;
`wait.status = settled`; leitura confirmou o texto exato, resposta `hello from fake
claude`, atividade Bash e digest. Uso do motor nesta fixture é sintético e não
mede tokens reais. O filho próprio PID 1548 foi encerrado por Ctrl-C no launcher;
confirmou-se ausência do processo e remoção do diretório temporário próprio.
Log preservado em
`C:\Users\duart\AppData\Local\Temp\orbit-verification-evidence\server-1791586995028-28092.log`.

## Continuidade necessária

| Área | Estado / próxima prova útil |
| --- | --- |
| Consumo e contexto entre planetas | Outro agente trata medição, delta e diagnostics; este documento não afirma redução de tokens |
| Android físico, voz e reconnect | Pendente em dispositivo real; simulações e testes do servidor não substituem microfone/telefone |
| Desktop instalado e processos auxiliares | Contrato de caminhos validado; smoke do pacote e janela instalada pertencem à aceitação global |
| Engines reais | Pendente execução autorizada com cada CLI e conta; aqui só houve motores falsos |
| Import/export/backups e sobrevivência a falha | Alterações preexistentes preservadas; exigir prova de restauro isolado antes de concluir prontidão |
| Monólito `server/index.ts` | Cerca de 22 mil linhas. Já existe tabela de rotas; extrair futuras áreas por fronteiras claras, sem refatoração global sem evidência |
| Leitores de transporte restantes | Fleet opcional possui leitor JSON separado com conversão por chunk; avaliar se consolidar o leitor limitado partilhado quando houver trabalho autorizado sobre fleet |
| Falha intermitente do caso Claude/local-model | Investigar como conjunto; execução isolada verde é evidência limitada |

Não é uma certificação de que a aplicação inteira está concluída. É um pacote de
correções comprovadas, com resultados e lacunas explícitos para a próxima etapa.
