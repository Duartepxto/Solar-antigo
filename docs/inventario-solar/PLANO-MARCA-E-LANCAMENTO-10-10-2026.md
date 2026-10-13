# Solar — marca, produto e preparação do lançamento

**Revisão posterior do mesmo dia:** o utilizador rejeitou a identidade «Sol aberto» e o primeiro redesign da entrada. As referências a essa proposta são históricas, não instruções de integração. A marca passa primeiro por [pesquisa online documentada](PESQUISA-IDENTIDADE-SOLAR-10-10-2026.md); nenhum novo logo ou layout deve ser aplicado durante a pesquisa. O planeamento factual de lançamento mantém valor como inventário, sujeito à nova direção visual.

Plano de trabalho de 10 de outubro de 2026. Windows e Android têm a mesma prioridade na apresentação e aceitação do produto. A identidade expande o mapa grafite/dourado existente. A página de entrada herdada recebe uma composição própria; a landing page e o vídeo são planeados, não construídos nesta passagem.

## Objetivo e ordem

Tornar o Solar coerente e utilizável antes de pedir a uma pessoa nova que o instale. Identidade e primeira utilização podem avançar em paralelo com revisão funcional, consumo de tokens, fiabilidade e empacotamento. Não se transforma um defeito de funcionamento em problema de estilo.

1. Rever entradas Windows/Android: quem usa entende o que o Solar faz, o que precisa de configurar e o que depende do PC. Design próprio, sem herdar a página do projeto de origem.
2. Rever a aplicação de ponta a ponta, começando em contexto e consumo sem restringir a auditoria a esses problemas. Provar desperdícios antes de alterar semântica; conservar memória, modelos escolhidos e conversas.
3. Consolidar uma identidade Solar: símbolo, nome, texto, cores, ícones nativos e comportamento consistente.
4. Fechar o percurso instalar → configurar motor → criar/selecionar agente → enviar → acompanhar → rever ação → receber resultado → continuar no Android.
5. Produzir capturas reais e documentação de suporte. Só depois implementar e publicar site/vídeo, segundo os gates abaixo.

A profissionalização não é um prazo de 10 ou 20 minutos e não se declara concluída com uma suite verde. Cada fluxo precisa de execução visível com dados descartáveis, código revisto, limites documentados e verificação no dispositivo aplicável. Questões de microfone, contas ou hardware não desaparecem por terem sido simuladas.

## Marca e verdade do produto

Solar é a aplicação; Jarvis é o agente principal do workspace atual. A equipa aparece num mapa; cada agente mantém a mesma identidade em mapa, conversa e seleção. Preservar o Sol e as personagens aprovadas. A proposta [Sol aberto](../solar-brand/README.md) oferece assinatura vetorial estável e uma [prancha de revisão](../solar-brand/index.html), separada do produto.

Posicionamento: **um espaço de trabalho onde se coordena uma equipa de agentes, se acompanha a execução e se decide o que autorizar**. Não prometer que dispensa configuração, garante resultados, opera tudo offline, reduz custos por uma percentagem ou substitui todas as ferramentas. O produto começou num fork; uma nova identidade visual não apaga licenças ou atribuições de origem.

| Mensagem pública candidata | Evidência disponível | O que falta antes de anunciar sem ressalva |
|---|---|---|
| Agentes e conversas num mapa Solar | Código e capturas em `docs/verification-evidence` | Novo percurso de entrada revisto em tamanhos Windows/Android |
| Windows com aplicação instalada | Relatório `INSTALACAO-DESKTOP-09-10-2026.md` | Instalação limpa, assinatura/distribuição e atualização/reversão para público |
| Android ligado ao teu PC | Emparelhamento físico confirmado no relatório Android | Envio/receção real, reconexão e aprovações no hardware atual |
| Escolhes o motor que usas | Implementação e configurações existentes | Matriz pública de motores efetivamente exercitados e pré-requisitos |
| Podes rever pedidos de autorização | Fluxos e contratos existentes | Demonstração com ação reversível real; limites visíveis por ferramenta |
| Consulta de consumo | `UsageSection`, `UsageHistory`, `ThreadUsageChip` | Auditoria completa de cobertura por motor, cache, estimativas e totais |
| Ditado e voz | Pipeline e evidências isoladas | Microfones reais, idioma misto, cancelamento, silêncio e Android foreground |

Os relatórios históricos registam o estado na respetiva data. Não substituir a auditoria atual por esse quadro. A chamada Android referida como pendente em 6/10 foi desenvolvida posteriormente; a aceitação física continua distinta da implementação. Registar a versão e o ambiente de cada nova confirmação.

## Regras de experiência profissional

O mapa é o espaço de trabalho. Preservar camera/arranjos escolhidos, identidade do agente e thread por dispositivo. Navegação e ações continuam compreensíveis com teclado, toque, leitor de ecrã e movimento reduzido. Aparência não impede perceber estados reais de trabalho, espera, erro e conexão.

Entrada: explicar em poucas frases a aplicação, o motor e o companion. Separar demonstração/configuração de credenciais reais; não chamar «pronto» a um motor meramente detetado. Regressar sem perder progresso quando falta permissão, motor ou ligação. Permissões são explicadas junto da ação; não se pede acesso a tudo para atravessar uma apresentação.

Estados: custo desconhecido continua desconhecido; valor estimado mostra origem; cache não conta duas vezes. Um turno que terminou não é uma tarefa concluída com sucesso. Sem ligação, um rascunho conserva-se, não se reenvia em silêncio. Uma falha explica a causa conhecida e a recuperação, sem dados privados nos logs. Conteúdo extenso, nomes longos e Português/Inglês não podem tornar controlos inacessíveis.

Tokens: medir turnos novos, reutilizados, pares de agentes, grupos e rotinas. Separar histórico útil, instruções, memória, schemas de ferramentas e resultados reenviados. Comparar o mesmo trabalho com contadores reais de input/output/cache quando disponíveis. A hipótese de reenvio total entre planetas é um ponto de partida, não uma conclusão. Otimização não pode apagar decisões, trocar o modelo do destinatário ou quebrar permissões. Site e vídeo só mencionam poupança depois de uma comparação reproduzível com limites e carga equivalente.

## Site: arquitetura e percurso previsto

A decisão que a página deve permitir: **isto serve para o meu trabalho, consigo configurar os pré-requisitos e sei como começar no Windows e ligar o Android?** Não se começa com um universo abstrato ou «o futuro da produtividade». A prova é a própria aplicação a fazer um trabalho e a mostrar o resultado.

| Página prevista | Questão que resolve | Conteúdo necessário |
|---|---|---|
| `/` | O que é e para quem serve? | Produto real, tarefa demonstrada, coordenação, controlo e pré-requisitos |
| `/download` | Posso instalar a versão certa? | Windows + Android, versão, estado Preview/estável, requisitos, hashes, passos, limitações |
| `/start` | Como obtenho o primeiro resultado? | Motor, login do fornecedor, primeira conversa, pedido de autorização, emparelhamento |
| `/help` | Como recupero de uma falha? | Rede, PC desligado, motores, voz, custos, exportação, suporte |
| `/privacy` | O que fica local e o que sai? | Fluxo de dados, motores/Apps, armazenamento, permissões e remoção |
| `/releases` | O que mudou? | Histórico verdadeiro, incompatibilidades, migração e problemas conhecidos |

Wireframe de leitura para a landing futura:

- Primeiro ecrã: wordmark discreto, frase «O teu trabalho, com uma equipa de agentes à vista.», explicação concreta e captura real do mapa em atividade. Uma ação primária de instalação quando pronta; link de requisitos e vídeo com legendas. Mostrar Windows e Android juntos, explicando logo que o companion usa o PC.
- Prova de mecanismo: sequência curta pedido → divisão do trabalho → resultados. Capturas recortadas com nomes e estados legíveis; mesma tarefa, mesmo workspace, sem gráficos inventados. Mostrar o que a pessoa pode abrir e decidir em cada passo.
- Resultado: ficheiro ou resposta final verificável, antes de qualquer promessa sobre benefícios. Um exemplo preciso comunica mais que uma grelha de funcionalidades vagas.
- Controlo: pedido de autorização e consumo reportado, com legenda sobre estimativas e limites. Mostrar a pausa que permite decidir e o restante trabalho que continua.
- Continuidade: PC ao lado do Android, mesma identidade/conversa demonstrada. Explicar LAN/Tailscale privado e PC necessário; não sugerir cloud própria ou sync universal.
- Preparação: três passos reais e requisitos visíveis. FAQ responde motores/contas, custos, rede, voz e estado da prévia. Fecho com ação de download e ligação a ajuda.

Composição própria dentro do mundo Solar: espaço escuro contínuo, tipografia Manrope, ouro usado para ações e assinatura, divisores e imagens de trabalho. As imagens são o conteúdo; não reproduzir barras falsas de macOS, testemunhos inventados, contadores de utilizadores, logos de parceiros não confirmados ou cartões em série. No mobile, recortar a prova mantendo nomes e resultado, não diminuir uma captura desktop até ficar ilegível. Nenhuma função principal depende de hover, autoplay ou animação.

Disponibilidade dos downloads é parte do conteúdo. Sem binários adequados ao público, usar «Ver preparação para instalar» com informação real; não criar download morto nem lista de espera que recolhe dados sem uma operação definida. Em Preview, dizer Preview antes do clique e na página de instalação. APK de desenvolvimento e repositório privado não equivalem a distribuição pública pronta.

## Vídeo de apresentação: plano de 80 segundos

Formato: demonstração orientada a um resultado, com locução sóbria, legendas PT/EN e áudio que não transporta informação exclusiva. Sem intro longa, passeio por todas as definições ou montagem que esconda falhas. O storyboard usa uma tarefa descartável: organizar notas de uma reunião fictícia em plano de ações e rascunho de resumo, sem enviar mensagens externas. Se os dados forem fictícios, legenda «Workspace de demonstração — dados fictícios». Se o motor for simulado, acrescentar «motor simulado» durante toda a captura; não o vender como execução real.

| Tempo | Ecrã e ação | Narração candidata | Critério de prova |
|---|---|---|---|
| 0–7 s | Abrir mapa e pedido legível a Jarvis | «Este é o Solar. Um espaço para coordenar agentes no teu trabalho.» | Aplicação real e versão identificada no registo de produção |
| 7–18 s | Introduzir tarefa e mostrar atribuição real | «Descreves o que precisas e acompanhas como a equipa o prepara.» | Delegação vem dos eventos reais; não animar planetas para fingir routing |
| 18–33 s | Abrir agentes a trabalhar, cada um com trabalho distinto | «Podes abrir cada conversa e ver o que está a acontecer.» | Conversas/estado correspondem à mesma execução |
| 33–45 s | Pedido de autorização numa ação reversível sobre pasta de demonstração | «Quando uma ação pede autorização, revês o pedido antes de continuar.» | Ferramenta realmente pede autorização neste modo; se não pede, escolher outra ação |
| 45–58 s | Resultado final e ficheiro gerado, visíveis | «No fim, tens um resultado que podes rever e usar.» | Abrir conteúdo real; evitar confundir fim de turno com sucesso |
| 58–69 s | Android emparelhado, ler resultado ou enviar follow-up | «No Android, acompanhas as conversas com o Solar aberto no PC.» | Telefone físico; pareamento e mensagem reais sem QR/segredos na gravação |
| 69–76 s | Consumo do trabalho demonstrado | «Consulta o consumo que o motor reporta. As estimativas ficam identificadas.» | Sem valores inventados; desconhecido/estimativa preservados |
| 76–80 s | Marca e indicação Windows + Android | «Solar. Começa no teu PC e leva a conversa contigo.» | Destino de download só quando existe distribuição válida |

Se o trecho Android não estiver validado, não o substituir por um mockup que pareça captura. Preparar montagem provisória assinalada como storyboard e adiar o filme público. São aceitáveis cortes para remover espera, com indicação «execução abreviada» quando o espectador poderia inferir velocidade. Não publicar «em segundos» sem cronómetro de ponta a ponta.

Produção: master 1920×1080, cortes mobile pensados a partir do mesmo conteúdo e texto protegido contra margens de plataformas. Guardar gravação bruta, versão/commit, configuração de permissões, task IDs e duração original em registo local sem tokens, QR ou contas pessoais. Exportar legendas `.srt`/`.vtt` e transcrição. Sem música necessária para compreender. Créditos de assets e licença de som só depois de escolher as fontes. A captura atual do inventário é evidência de interface, não footage final nem aceitação de todos os fluxos.

## Gates antes de lançar

| Gate | Aceitação concreta | Evidência a guardar |
|---|---|---|
| Identidade | Mesmo nome e símbolo em entrada, Windows, Android, documentação; micro legível; assets licenciados | Prancha, exports e capturas nativas clara/escura |
| Instalação Windows | Instalar numa conta/máquina limpa, arrancar, configurar motor, atualizar preservando dados e recuperar | Binário/hash, ambiente, passos e logs sem dados pessoais |
| Instalação Android | Distribuição e assinatura apropriadas, upgrade, QR interno, consentimento e revogação | APK/hash, dispositivo físico, versão de OS e captura sem credenciais |
| Tarefa completa | Pedido real, delegação, resultado, erro recuperável e aprovação sem bloqueio de trabalho independente | Execução reproduzível em workspace descartável |
| Consumo | Input/output/cache/custo sem duplicação, cobertura por motor e ausência tratada corretamente | Comparações reais ou fixtures explicitamente identificadas |
| Continuidade | Envio/receção física, PC indisponível, rede interrompida e reconexão sem replay indevido | Registo Windows+Android na mesma versão |
| Voz | Microfones físicos, idioma selecionado, pausa, Stop/Escape, rascunho final e foreground Android | Resultados por dispositivo; limitações separadas |
| Acessibilidade | Teclado, foco, leitura de estados/erros, alvos de toque, contraste e motion reduzido | Capturas desktop/mobile e percurso manual |
| Suporte e confiança | Requisitos, custos, dados locais/externos, remoção/revogação, backup e problemas conhecidos | Docs da versão lançada; canal de suporte definido |
| Comunicação | Todo o claim liga a prova; footage é real; download válido; sem credenciais em imagens | Checklist editorial, transcrição e revisão final |

## Entregáveis desta passagem

Em `docs/solar-brand`: cinco fontes SVG, prancha HTML responsiva e regras de identidade. Aqui: posicionamento, limites de claims, percurso do site, storyboard e gates. Estes artefactos deixam a proposta concreta e revisável sem construir ou publicar a landing page e o vídeo. A implementação funcional e a auditoria têm relatórios próprios; não se declaram concluídas por este documento.
