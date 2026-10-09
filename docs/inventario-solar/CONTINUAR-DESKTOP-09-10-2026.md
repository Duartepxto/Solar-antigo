# Continuação no desktop — 9 de outubro de 2026

## Estado real

O utilizador confirmou que pretende continuar noutro PC fixo, através de Git.
Este chat está no host local
Windows, em `C:\Users\duart\Documents\ChatGPT\Chat`.

Repo da aplicação: `Solar/orbit-app`, branch `codex/solar-android-and-chat`.
Esta continuação reúne as alterações anteriores e novas na mesma branch,
incluindo `.claude/` e os documentos de contexto. No PC fixo, obter esta branch
do GitHub; não usar apenas a branch principal.

Se o repositório já existe, executar na pasta Solar:

```powershell
git fetch origin
git switch codex/solar-android-and-chat
git pull --ff-only origin codex/solar-android-and-chat
```

Se ainda não existe:

```powershell
git clone --branch codex/solar-android-and-chat https://github.com/Duartepxto/Solar.git
```

Se houver alterações locais no destino, preservá-las antes de integrar; não
usar reset destrutivo. Abrir a pasta Solar no Codex e pedir para ler este guia.
O app exige Node.js 24 ou superior e pnpm 10.33.0; dependências, recursos nativos
e modelos locais não são transportados pelo Git. Conversas, configurações
pessoais e credenciais também não: transferir por backup separado quando necessário.

Última instalação confirmada: **Solar 0.2.1.0**. Ditado contínuo e progressivo,
Parar sem enviar, Alt+T e jardim 3D já estavam instalados e verificados.
Código atual indica **0.2.2**, mas esta versão ainda NÃO foi compilada nem
instalada. Não apresentar o código editado como atualização aplicada.

## Pedido em curso

Contabilizar consumo e custos corretamente, apresentar euros, identificar
a engine da conversa real e verificar o excesso de tokens em todos os pedidos.
O utilizador confirmou que o problema de consumo lhe parece acontecer em todos.

Alterações guardadas:

- Engine usa a seleção da conversa atual; Jarvis tem predefinição Claude,
  mas a conversa auditada usa Codex / GPT-6 Luna. A predefinição não foi migrada.
- Custos do turno, conversa, digest e ledger usam os mesmos valores e indicam
  estimativas ou turnos sem preço. Preços oficiais dos três modelos GPT-6 Sol,
  GPT-6.1 Sol e GPT-6 Luna adicionados com fonte e data.
- Estimativas históricas derivadas de tokens registados, sem reescrever o ledger.
- Euros via taxa BCE datada, cache offline e CSV com moeda/cotação identificadas.
  Taxa verificada de 8/10: 1 EUR = 1,1186 USD. Não é uma taxa permanente.
- Histórico é o painel principal; atualiza após turnos e limpa dados ao mudar
  de período. Totais das conversas atuais estão separados do histórico durável.
- Limites/preços em euros convertem ao guardar, preservando campos não alterados.
- Contadores distinguem entrada, cache, saída, contexto e valores desconhecidos.
- Redução de prévias automáticas de resultados de ferramentas Solar, com leitura
  completa disponível; contabilização do resumo auxiliar da compactação e escolha
  do motor efetivo na manutenção da memória foram editadas pelo subagente.
  Estas últimas alterações passaram os testes relevantes e o typecheck.

## Evidência sobre tokens

Auditoria numérica, sem conteúdo das mensagens, em
`orbit-app/.orbit-scratch/verify-evidence/solar-usage/token-audit.json`.

39 turnos Luna: 7.925.293 tokens de entrada, dos quais 7.391.744 de cache
(cerca de 93,3%); 533.549 de entrada nova e 28.649 de saída.
Na conversa principal, a soma de 31 turnos coincide exatamente com o total
reportado pelo fornecedor e o contador da conversa. Não foi encontrada dupla
contagem nesses registos. Isto não prova eficiência ou consumo gratuito.

Último turno auditado: 1.384.705 de entrada somados entre leituras de contexto,
49.665 novos, 7.076 de saída, cinco ferramentas e cerca de 106 segundos.
Contexto chegou a 218.792 tokens antes de compactação e terminou em 38.872.
Um pedido de três caracteres teve 19.213 de entrada, 8.205 novos, 11 de saída
e nenhuma ferramenta. Comprimento não prova simplicidade semântica.
Catálogo MCP completo de agentes tem 35 ferramentas e cerca de 48,7 KB de JSON;
bytes de catálogo não são uma medição exata de tokens.

Custos são equivalentes API standard quando não reportados, não cobranças
adicionais da subscrição nem uma fatura exata. Cache, tiers, impostos, créditos,
ferramentas nativas e conversas longas impedem prometer um valor faturado exato.

## Validação e pendentes

Antes das últimas alterações, 74 testes de UI/lógica/câmbio passaram;
contabilidade backend teve 161 testes iniciais, regressões Codex e fixtures
de API/salas. Typecheck do cliente e servidor passaram nessa fase.
Fixture de UI consumo passou, com capturas desktop/mobile em
`orbit-app/.orbit-scratch/verify-evidence/solar-usage/`.
Português completo e `i18n:check` passou com 4.241 chaves.

Em 9/10 foram executados os 125 testes relevantes de consumo, câmbio, engine,
compactação, memória, resultados de ferramentas e metadados do turno.
124 passaram na execução conjunta; o teste restante tinha uma expectativa
incorreta de recuperar 20 mil caracteres numa página de 16 mil. Foi corrigido
para percorrer duas páginas e os oito testes desse ficheiro passaram.
Typecheck do cliente e servidor, lint e verificação de traduções também passaram.

Pendentes no PC fixo:

1. Instalar dependências e preparar recursos locais conforme os scripts existentes
   de empacotamento Windows e `scripts/prepare-solar-speech.mjs`.
2. Gerar o instalador 0.2.2 e instalar no PC fixo. Comparar bundle instalado e
   compilado, verificar saúde do servidor e reconhecimento local pronto.
3. Confirmar manualmente o ditado com a voz real e medir consumo após as mudanças.
   Os testes não garantem uma redução específica de tokens em conversas futuras.
4. Transferir dados/configuração por backup separado se necessário, sem imprimir
   credenciais nem substituir os dados do destino. Não apagar o PC de origem.

Ler `orbit-app/AGENTS.md`, `PRODUCT.md` e `docs/verification/README.md`.
Testes só em fixtures isoladas, nunca enviando mensagens na app pessoal.
