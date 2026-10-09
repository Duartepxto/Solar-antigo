# Atualização do Solar — 8 de outubro de 2026

## Código encontrado

- Repositório: https://github.com/Duartepxto/Solar
- Branch local: `codex/solar-android-and-chat`.
- Commit mais recente local: `ed9250caff569aaf8b1920c44919836747494ba1`,
  guardado em 7/10/2026 às 23:00:27, Europe/Lisbon.
- `git fetch origin` e `git ls-remote --heads origin` confirmaram em 8/10
  que a branch remota continua em `36ad27d` e `main` em `7ac1c04`.
  O commit noturno está apenas neste PC. Não foi feito push nesta atualização.
- O chat anterior relevante chama-se «Exportar e abrir a aplicação».

## O que entrou na continuação noturna

O commit reúne as versões 0.1.89–0.1.97 e o trabalho noturno: vidro líquido,
partículas e expressões próprias, janela do Jarvis em Alt+J, pré-visualização
ao vivo e lado a lado no editor, metadados dos turnos, português de Portugal,
identidades persistentes dos planetas e correções de desempenho. Inclui ainda
voz, ditado, exportação de agentes e trabalho no Android. Ver CHANGELOG.md
e a mensagem completa de `git show ed9250c`.

## Pacote Windows desta atualização

Versão instalada e aberta: **0.1.98**, para distinguir o novo pacote da 0.1.97
compilada antes das alterações noturnas. Dependências locais reutilizadas.
Instalador: `orbit-app/release-solar/Solar-0.1.98-setup.exe`.
O executável instalado reporta `0.1.98.0`, o hash do `app.asar` instalado
corresponde ao pacote compilado e `/api/health` respondeu HTTP 200.

## Verificação

- Seis ficheiros de testes: 34 testes aprovados; um ignorado porque o áudio
  de referência `dist-native/solar-speech/qa-jfk.wav` não existe.
- Interface: mapa/partículas aprovado e captura revista.
- Interface: ditado no chat aprovado e captura revista. A primeira execução
  excedeu o tempo de carregamento durante a compilação; a repetição passou.
- Janelas, atalhos e controlo de voz do shell: 29 testes Node aprovados.
- Compilação TypeScript, Vite e instalador NSIS concluídos sem erro.
- Os testes de servidor e interface usam fixtures isoladas.
- Registos em `orbit-app/.orbit-scratch/update-08-10-tests.log`,
  `update-08-10-ui.log`, `update-08-10-ui-retry.log` e
  `solar-0.1.98-build.log`.

Testes com microfone real e instalação/validação no telefone continuam
pendentes. A bateria geral do projeto não foi executada nesta atualização.
