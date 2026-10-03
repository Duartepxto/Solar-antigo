# Jarvis

Protótipo local do assistente pessoal, construído sobre a interface Orbit recriada a partir do HTML de referência fornecido pelo utilizador. A nova base está em `jarvis/`; a reprodução anterior fica em `reference/`, e a primeira versão do Jarvis foi guardada em `versions/jarvis-orbit-v1.zip`.

## Abrir

No Windows, com Node.js:

```powershell
npm run dev
```

Abrir `http://127.0.0.1:4173/`. A página principal encaminha para `jarvis/index.html`.

## Já disponível nesta versão

- Mapa interativo de equipas e agentes, com sinais visuais de comunicação e movimento reduzido quando o sistema o pede.
- Campo principal exclusivo para conversar com o Jarvis e botão para iniciar uma chamada.
- Chamada integrada no ecrã do agente, com indicador no orb, temporizador, opção de voz do sistema e botão para terminar. A conversa é uma demonstração por texto; o microfone não é usado.
- Ecrãs de demonstração apresentados pelos agentes, com pré-visualizações no mapa e acesso a partir das conversas.
- Resumo e ata diária local, tarefas, atividade, agenda local, regras de atenção ao correio, notas de memória e criação local de subagentes.
- Caixa de decisões partilhada com as conversas dos agentes: propostas locais com contexto e ação, aprovação, recusa, pedido de alterações, reapresentação manual e histórico. Uma decisão aprovada é apenas registada; não executa ações externas.
- Consulta de informação básica de repositórios públicos do GitHub por URL. Esta consulta não requer autenticação e não modifica o repositório.
- Preferência de idioma português/inglês, modelo e voz, guardada neste navegador.
Para transferir o projeto, ver `HANDOFF.md`.

## Limites atuais

Gmail, Outlook, Google Calendar, GitHub privado e motores de IA ainda não estão ligados. As mensagens, decisões, notificações de trabalho, ecrãs e movimentos do mapa são exemplos claramente identificados; não representam trabalho automático real. O protótipo não envia e-mails nem altera contas ou ficheiros externos. Os dados locais ficam em `localStorage` deste navegador; ainda não há uma aplicação Windows instalável nem sincronização móvel.
