# Pautas e próximos trabalhos

Revisão: 01/10/2026. Fonte inicial: [rodada de retomada](reports/rodada-2026-09-29.md). A [rodada de portáteis](reports/rodada-2026-10-01-portateis.md) conferiu GSC e GA4 na interface autenticada em 01/10; o GSC ainda exibia dados de 04–28/09. Fontes de produtos/versões devem ser verificadas na execução.

## Cadência e foco

Dois slots de produção por semana, inicialmente segunda às 12h e quinta às 08h, mais uma revisão prioritária quando houver capacidade. Referência: dois novos posts pesquisados e uma atualização; uma revisão completa pode substituir um novo. Games mantém prioridade, com guias práticos de Programacao/Web Design como segunda frente. Notícias confirmadas podem substituir slot. Não preencher cotas com rumores ou rascunhos genéricos.

Horários em `America/Sao_Paulo`, ainda como hipótese. Planeje até 4 semanas; reavalie temas com evidência após 8 semanas (24/11/2026 como referência inicial). As datas abaixo são **datas-alvo de trabalho**, não agendamento de publicação.

## Estados

- `candidata`: ideia/hipótese, intenção e fontes ainda pendentes.
- `planejada`: ação/URL e motivo definidos; apuração ainda pendente.
- `em pesquisa` / `em revisão`: trabalho em curso, sem promessa de publicação.
- `pronta`: revisão factual, capa, links, audit e build concluídos.
- `agendada`: arquivo com data futura + draft/scheduled, push e workflow conferidos; registrar ISO e commit.
- `ao vivo`: deploy e URL pública verificados; registrar data, commit e evidência.
- `adiada` / `descartada`: registrar motivo; conflito de intenção muda a ação para atualização.

## Fila inicial

| ID / prioridade | Data-alvo | Ação / estado | Dúvida e diferencial | Evidência e condição de execução |
|---|---|---|---|---|
| P01 / alta | 30/09 | Atualizar existente / ao vivo | Meta Quest 4 foi anunciado? Separar confirmação de rumor, disponibilidade e preço. | Nova revisão pelo Codex em 30/09/2026, ao vivo; deploy e HTTP 200 conferidos às 20:04 -03:00; Quest 4 não anunciado nas fontes verificadas. VR Glasses têm previsão e preço próprios, sem confirmação brasileira. Intent check aponta a própria URL; três URLs Quest 4 e o texto Connect comparados manualmente. Ver [nova revisão e melhorias da CLI](reports/rodada-2026-09-30-cli-e-quest4.md). Outras URLs aguardam revisão, sem consolidação. |
| P02 / alta | 01/10 | Atualizar / em revisão | ROG Ally X ou Steam Deck OLED: qual atende biblioteca, sistema e orçamento? | Revisão documental concluída; retirados testes fictícios e promessas de compatibilidade/autonomia. GSC por página: 10 cliques, 671 impressões, CTR 1,5%, posição 7,1 em 04–28/09. Fichas ASUS/Valve, Deck Verified e requisitos Xbox consultados. Deploy e produção pendentes; ver [relatório](reports/rodada-2026-10-01-portateis.md). |
| P09 / alta | 01/10 | Atualizar / em revisão | Qual preço foi anunciado para o Steam Deck OLED e como avaliar uma oferta brasileira? | Correção complementar: comunicado Valve de 27/05 localizado, sem previsão de preço em reais nem urgência artificial. GSC da URL sem dados em 04–28/09; prioridade factual e conexão ao comparativo. Capa substituída por ilustração conceitual revisada. Deploy e produção pendentes. |
| P03 / média | 08/10 | Atualizar / planejada | Quando Penpot substitui Figma em trabalho real e quais custos/limites permanecem? | Descrição truncada e blocos espelhados no legado. Consultar docs e preços oficiais das duas ferramentas; fazer projeto piloto se houver acesso, ou explicitar análise documental. Não garantir recurso/plano sem conferir. |
| P04 / média | 15/10 | Revisar cluster existente / planejada | Como alinhar cards com CSS Subgrid, com exemplo executável e alternativa? | Existem três URLs sobre Subgrid, com intenções próximas. Comparar conteúdo/consultas e escolher o arquivo adequado; testar exemplo antes de dizer que funciona. Não criar uma quarta nem redirecionar sem investigação. |
| P05 / média | 19/10 | Atualizar / planejada | Astro ou Next.js para um blog: renderização, operação, limites e custo do caso concreto. | URL existente; oportunidade editorial, sem demanda quantificada nesta rodada. Usar este projeto como caso somente para o que foi observado/testado; docs oficiais atuais, sem benchmark fictício. |
| P06 / média | 22/10 | Criar ou ampliar guia / candidata | Como detectar links internos quebrados em um blog Astro antes do deploy? | Hipótese de tutorial derivado da operação. Rodar intent check e busca manual; atualizar guia existente se responder à mesma dúvida. Exigir script demonstrável, exemplo de falha e limite da verificação. |
| P07 / média | 26/10 | Criar ou ampliar guia / candidata | Como mostrar publicação e atualização de um artigo Astro sem alterar a URL? | Hipótese de tutorial do caso real de 29/09. Verificar intenção/legados; testar exemplo isolado e explicar quando atualizar a data. Não abrir URL se já houver guia equivalente. |
| P08 / baixa | 29/10 | Criar ou ampliar guia / candidata | Como verificar compatibilidade de jogos no Steam Deck antes de comprar? | Hipótese complementar ao cluster de portáteis. Conferir inventário e intenção, documentação Valve e exemplos atuais; distinguir compatibilidade documentada de teste próprio. |

URLs existentes a investigar (não significa que todas serão alteradas):

- P01: `/meta-quest-4-chega-ao-mercado-a-nova-fronteira-dos-jogos-vr-e-o-que-ele-significa-para-o-futuro/`, `/meta-quest-4-rumores-preco-lancamento-novidades/`, `/meta-quest-4-vs-apple-vision-pro-lite-headsets-vr/`.
- P02: `/rog-ally-x-vs-steam-deck-oled-qual-comprar/`.
- P03: `/penpot-vs-figma-em-2026-a-alternativa-open-source-ja-esta-pronta-para-o-mercado-profissional/`.
- P04: `/como-usar-css-subgrid-layouts-complexos/`, `/css-subgrid/`, `/css-subgrid-domine-o-recurso-que-vai-transformar-seus-layouts-complexos-e-diga-adeus-a-hacks/`.
- P05: `/astro-vs-nextjs-2026-qual-framework-escolher/`.

## Trabalho de medição

Em 12/10, ou na próxima rodada com acesso: conferir status da validação de canonical iniciada em 29/09 e exemplos não indexados; medir URLs revisadas por página/consulta. Comparar 28 dias apenas quando houver cobertura equivalente. Revisar semanalmente a prioridade desta fila e registrar números absolutos, alterações e limites em `reports/`.

Antes de monetização adicional, conferir RPM/receita efetivos do domínio e período correto. Meta de 1.000 visualizações mensais é um marco inicial de trabalho, não previsão com prazo nem requisito do AdSense.

## Condição para preparar publicação

Cada pauta precisa de intenção validada, fonte primária atual, contribuição própria, revisão factual, interlinks conferidos, capa revisada, audit/build e autorização aplicável. Estado deste planejamento: P01 ao vivo, P02/P09 em revisão, P03–P05 planejadas e P06–P08 candidatas; revalidar arquivos e alterações ao iniciar a próxima rodada; **nenhuma publicação futura foi agendada por este documento**. A fila executável continua no frontmatter/GitHub Actions.

Próxima avaliação das revisões de portáteis: 08/10/2026, em `America/Sao_Paulo`; conferir primeiro se o GSC já inclui os dias posteriores ao deploy. Comparar cliques, impressões e consultas por URL com janelas equivalentes apenas quando houver cobertura. O comparativo do Ally original em Tecnologia ainda contém alegações de autonomia sem método e deve receber revisão própria; não foi consolidado ou redirecionado nesta rodada. P03 continua como próxima revisão substancial fora de Games.
