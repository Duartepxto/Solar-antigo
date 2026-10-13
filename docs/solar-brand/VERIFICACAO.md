# Verificação da prancha de marca

**Rascunho rejeitado pelo utilizador em 10 de outubro de 2026.** As medições abaixo verificam o ficheiro histórico; não demonstram qualidade de marca ou aceitação do desenho. Não usar esta evidência para legitimar integração da direção «Sol aberto».

10 de outubro de 2026. Browser Chrome headless em sessão dedicada; HTML local, sem workspace pessoal, contas ou motor AI. Artefacto de revisão, não validação da aplicação ou release.

- Desktop 1280 × 900 e Android portrait 390 × 844: documento sem overflow horizontal; fonte local carregada e todas as imagens vetoriais presentes.
- Botões Grafite/Preto/Claro: altura 44 px, foco visível, estado `aria-pressed` e fundo de assinatura alterados de forma coerente. O texto do rótulo acessível acompanha o fundo.
- Capturas de página completa revistas visualmente: hierarquia, símbolo, wordmark, variantes, tamanhos reais, cores, texto e links de fonte. Fonte SVG legível em 16/20/24/32/64 px na escala de browser; não substitui a revisão nativa da bandeja ou adaptive icon Android.
- Movimento reduzido elimina a transição de fundos e o scroll suave. Sem animação contínua, assets externos, reprodução automática ou efeitos no texto.
- Contraste matemático dos pares opacos usados: texto/campo 18,26:1; secundário/campo 8,40:1; dourado/painel 9,84:1; tinta/fundo claro 15,00:1. São cálculos dos valores-fonte, complementados pela inspeção visual, não uma auditoria automática de cada estado.
- Os links levam a ficheiros existentes e os links SVG têm fontes vetoriais com `viewBox` e títulos. Manrope é a fonte local já existente no Solar, com SIL OFL.

Evidências: `evidence/desktop.png`, `evidence/mobile.png`, `evidence/light.png` e medições em `evidence/inspection.json`. Script local reproduzível `verify.mjs`, dependente do agent-browser já preparado em `orbit-app/.orbit-scratch/verify-tools` e Chrome Windows. A primeira tentativa dentro do sandbox não conseguiu iniciar o daemon de browser; a verificação isolada autorizada completou-se. A captura aguarda o fim da transição antes de guardar fundos.

O detector Impeccable foi executado uma vez. Funcionou em modo degradado, sem os parsers HTML/CSS, portanto não calculou contraste nem deu uma aprovação mecânica completa. Assinalou o nome local `Manrope`, a escala maior da prancha e cores que constam no código atual, mas não na rampa histórica de `DESIGN.md`/sidecar. A prancha documenta a sua escala de apresentação e usa `solar.css` como fonte dos tokens. O sidecar `.impeccable/design.json` desatualizado não foi alterado como efeito desta tarefa.

Limites: não feita revisão de disponibilidade legal da marca; exports ICO/adaptive icon e revisão em Windows/Android físicos pendentes; nenhuma landing page ou vídeo produzido. A auditoria de funcionamento tem evidência própria fora desta prancha.
