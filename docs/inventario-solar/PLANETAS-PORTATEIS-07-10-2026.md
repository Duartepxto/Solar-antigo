# Levar um planeta entre computadores

Solar Windows 0.1.91 permite guardar um agente pessoal num ficheiro
`Nome-AAAA-MM-DD.solar-agent.json` e importá-lo noutra instalação Solar.

1. Abre o planeta e o painel **Memória**.
2. Clica **Exportar planeta** e guarda o ficheiro no computador.
3. No outro PC, abre **Memória** de qualquer planeta, incluindo o assistente
   integrado, e clica **Importar planeta**.
4. Escolhe o ficheiro, revê o resumo e confirma **Adicionar este planeta**.
   Usa **Abrir planeta** para continuar.

O ficheiro leva o identificador do agente, nome, instruções, memória principal,
tópicos, registos de memória e todas as conversas/ramificações em texto.
Não leva contas, credenciais, permissões, ficheiros anexados, ferramentas,
skills, ficheiros do projeto nem sessões nativas dos fornecedores.
O agente preserva a identidade guardada, mas inicia uma nova sessão do modelo
com o contexto importado. Num PC novo usa o modelo local da conversa onde
se iniciou a importação; configura as ferramentas necessárias nesse PC.

Se esse planeta já existir, o botão passa a **Atualizar este planeta**.
A confirmação substitui a memória e as instruções pelo conteúdo do ficheiro,
junta as conversas por identificador e conserva as conversas locais.
As contas, ferramentas, permissões e modelos locais ficam preservados.
Conversas incompatíveis ou alterações posteriores à pré-visualização impedem
a atualização. Espera pelo fim das tarefas antes de exportar/importar.

Antes de atualizar, o servidor guarda uma cópia privada dos dados anteriores
em `.agent-transfers` dentro da pasta de dados local. Falhas de escrita
desencadeiam recuperação dos dados anteriores. A cópia pode apoiar recuperação
manual; esta versão ainda não tem botão para restaurá-la.

Esta transferência é manual, sem sincronização automática. Guarda o código
do projeto no GitHub e transfere este ficheiro separadamente: pode conter
conversas e memória privadas, mesmo com a filtragem automática de segredos.
O assistente integrado não pode ser exportado/substituído.

Verificação: cinco testes isolados de exportação, importação, atualização,
conflitos, limites e recuperação; um teste entre dois servidores isolados;
um teste visual com importação confirmada e larguras de 390 e 900 px.
Verificação TypeScript e catálogos de tradução concluída.

Pacote Windows construído e instalado neste PC: Solar 0.1.91.0, janela Solar
aberta, serviço local com HTTP 200 e SHA-256 do `app.asar` instalado igual
ao pacote construído. Instalador: `orbit-app/release-solar/Solar-0.1.91-setup.exe`.
As alterações continuam locais; não houve publicação no GitHub nesta entrega.
