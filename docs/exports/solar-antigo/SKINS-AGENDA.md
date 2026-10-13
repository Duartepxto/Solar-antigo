# Skins, cores e agenda — 13/10/2026

Este trabalho altera exclusivamente o preview HTML Solar e as suas fontes de exportação. Não altera o Solar V0 instalado nem executa rotinas reais.

- O nome do agente é o rótulo principal. A skin é um aspeto independente da função, da equipa e do nome.
- Aspeto permite mudar o nome e escolher qualquer uma das oito skins de planeta ou cinco skins de lua, inclusive em luas. A escolha guarda-se localmente por ID. A criação de um agente também permite escolher a skin antes de criar.
- As transferências e fragmentos ambientes usam a paleta do emissor. Uma passagem Sol → planeta → lua muda para a paleta do planeta na segunda etapa. Não se herda a cor dourada do primeiro salto. Trajetória reta, densidade e dispersão existentes preservadas.
- Agenda: calendário mensal, marcadores de eventos, seleção do dia, criação/edição/remoção, agente, hora, duração, repetição diária/semanal e arrastar para reagendar. Eventos guardados no navegador; estados descrevem o horário, sem fingir execução real.
- Corrigida a abertura da agenda à primeira a partir do mapa, preservando o chat.

Referência funcional consultada: aplicação Orbit no GitHub, commit 282dc429c5ae6234ca9d56400cea15195edfa12c. Estudados RoutineCalendarPage, CalendarSidebar e os contratos de calendário: organização temporal, agentes, ocorrências e repetições. A implementação do calendário Solar foi escrita de forma independente. Nenhum fonte da cópia privada de consulta foi incluído no export ou no commit.

Validação: build Vite; 512 ciclos da simulação; estados visuais; chegada única; densidade/linha reta/dispersão; paleta por emissor e por salto; limites mensais, datas locais, repetição e estados temporais. No navegador: abertura direta da agenda, criação/edição/remoção de evento, repetição, navegação mensal, persistência após recarregar, mudança Vénus→Neptuno sem renomear Design, skin Terra aplicada a uma lua, criação com Urano. Campo de hora verificado com os controlos nativos de teclado. Não se ativaram permissões de microfone ou ligações reais.

O encerramento do PC fica a cargo do temporizador que o utilizador disse que iria iniciar. Este trabalho não cancela nem antecipa esse temporizador.
