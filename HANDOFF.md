# Continuidade Solar V0 — 10/10/2026

O utilizador iniciou um novo Solar de raiz. A pasta `Solar V0/` tem apenas Git e aponta para o novo `Duartepxto/Solar` privado e vazio. Este checkout anterior aponta agora para `Duartepxto/Solar-antigo` (descrição “Solar (antigo)”). Não importar código anterior nem iniciar a aplicação sem o próximo briefing.

A investigação local e privada de OpenMausBot e DragonQLF/orbit está em `docs/solar-v0-research/README.md`; ler também `MEMORIA.md` dessa pasta antes de retomar. Fontes e relatórios estão ignorados pelo Git anterior e não foram publicados. Os apontamentos abaixo são históricos do Jarvis anterior.

# Continuar o Jarvis noutro computador

## Abrir o projeto

1. Descompactar o ZIP numa pasta do portátil.
2. Instalar o Node.js caso ainda não esteja instalado.
3. Abrir esta pasta no Codex ou num editor de código.
4. Na pasta, executar `npm run dev` e abrir `http://127.0.0.1:4173/jarvis/index.html`.

O projeto não tem dependências npm externas. A pasta `jarvis/` contém a versão ativa; `reference/` é a reprodução da referência visual e `versions/` guarda a primeira versão.

## Estado atual

O Jarvis é uma pré-visualização local com mapa de agentes, animações, chamada de demonstração, tarefas, ata diária, agenda local, propostas e aprovações com histórico, e consulta básica de repositórios públicos. Gmail, Outlook, Google Calendar, modelos de IA e chamadas por microfone ainda não estão ligados. Aprovar uma proposta regista a decisão, mas não executa ações externas.

## Para continuar o desenvolvimento

Abrir esta pasta como projeto no portátil e indicar que a versão ativa está em `jarvis/`. Ler `README.md`, `PRODUCT.md` e `DESIGN.md` para o estado e as decisões de produto. O próximo trabalho previsto é ligar dados reais ao Jarvis mantendo as ações externas sujeitas a regras claras.
