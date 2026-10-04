# Pautas e próximos trabalhos

Revisão: 01/10/2026. Fonte inicial: [rodada de retomada](reports/rodada-2026-09-29.md). A [rodada de portáteis](reports/rodada-2026-10-01-portateis.md) conferiu GSC e GA4 na interface autenticada em 01/10; o GSC ainda exibia dados de 04–28/09. Fontes de produtos/versões devem ser verificadas na execução.

## Cadência e foco

Cadência diária atualizada pelo dono em 01/10/2026: meta inicial de **5 novos posts pesquisados e 3 atualizações substanciais por dia**, ampliável com fatos e revisão suficientes. Games mantém prioridade, com guias práticos de Programacao/Web Design como segunda frente. Notícias confirmadas podem ocupar os slots novos; guias mais trabalhosos podem consumir vários slots. Registrar entrega e pendência por URL; não publicar rascunhos incompletos para bater número. Ver [regras e fundamento oficial](docs/08-publicacao-e-agendamento.md).

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
| P02 / alta | 01/10 | Atualizar / ao vivo | ROG Ally X ou Steam Deck OLED: qual atende biblioteca, sistema e orçamento? | Revisão documental concluída; retirados testes fictícios e promessas de compatibilidade/autonomia. GSC por página: 10 cliques, 671 impressões, CTR 1,5%, posição 7,1 em 04–28/09. Fichas ASUS/Valve, Deck Verified e requisitos Xbox consultados. Commit `143601d`, Vercel success e HTTP 200 em 01/10 às 19:17 -03:00; ver [relatório](reports/rodada-2026-10-01-portateis.md). |
| P09 / alta | 01/10 | Atualizar / ao vivo | Qual preço foi anunciado para o Steam Deck OLED e como avaliar uma oferta brasileira? | Correção complementar: comunicado Valve de 27/05 localizado, sem previsão de preço em reais nem urgência artificial. GSC da URL sem dados em 04–28/09; prioridade factual e conexão ao comparativo. Capa substituída por ilustração conceitual revisada. Commit `143601d`, Vercel success e HTTP 200 em 01/10 às 19:17 -03:00. |
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

Cada pauta precisa de intenção validada, fonte primária atual, contribuição própria, revisão factual, interlinks conferidos, capa revisada, audit/build e autorização aplicável. Estado deste planejamento: P01/P02/P09 ao vivo, P03–P05 planejadas e P06–P08 candidatas; revalidar arquivos e alterações ao iniciar a próxima rodada; **nenhuma publicação futura foi agendada por este documento**. A fila executável continua no frontmatter/GitHub Actions.

Próxima avaliação das revisões de portáteis: 08/10/2026, em `America/Sao_Paulo`; conferir primeiro se o GSC já inclui os dias posteriores ao deploy. Comparar cliques, impressões e consultas por URL com janelas equivalentes apenas quando houver cobertura. O comparativo do Ally original em Tecnologia ainda contém alegações de autonomia sem método e deve receber revisão própria; não foi consolidado ou redirecionado nesta rodada. P03 continua na fila fora de Games; a ordem diária segue agora os riscos e a demanda do relatório detalhado.

## Entregas de 02/10/2026

[Relatório da rodada](reports/rodada-2026-10-02-crescimento.md): 4 novos guias (outubro de 2026, Gears of War: E-Day, Phantom Blade Zero, Ace Combat 8) e 8 atualizações (cluster GTA 6, PS Plus vs Game Pass, DeepSeek no VSCode). Itens 01, 07 e 08 da fila de 29 posts estão resolvidos; faltam os demais P0. Próximos novos: requisitos/preço de lançamentos de outubro (CoD MW4 quando a Steam publicar os requisitos; Star Wars: Galactic Racer), uma revisão do cluster de assinaturas (`/ps-plus-vs-xbox-game-pass/`) e a série de retrocompatibilidade do Switch 2. Meta do dia: 5 novos; entregues 4.

## Planejamento ampliado em 01/10

O [plano de melhorias do blog](../docs/plano-melhorias-blog-2026-10-01.md) detalha implementação futura, dependências e aceite. A [fila de 29 posts prioritários](reports/posts-priorizados-2026-10-01.md) substitui a ordem inicial quando houver risco factual ou tutorial incompatível. O [CSV de 556 posts publicados](reports/triagem-posts-publicados-2026-10-01.csv) registra dívida técnica e estado da triagem; não representa revisão factual completa. Datas antigas da tabela são histórico/alvos, sem limitar a nova produção diária. Esta alteração documental não cria posts nem agendamentos.

## Continuação de 02/10 — retrocompatibilidade

P0 nº 05 recebeu revisão substancial na URL existente: removida a garantia de biblioteca inteira compatível, com exceções de jogos/controles e consulta por título nas fontes Nintendo. Ver [evidências e estado do deploy](reports/rodada-2026-10-02-retrocompatibilidade.md). Total registrado do dia: 4 novos e 9 atualizações; quinto novo pendente de apuração. Próximas pendências: outras URLs do cluster ainda prometem suporte total, especialmente `e-oficial-nintendo-switch-2-confirma-retrocompatibilidade-e-garante-seus-jogos-antigos`; não houve consolidação nem nova URL.

## Continuação de 02/10 — portáteis e Astro

Revisões P0 nº 02 (`/astro-7/`), 03 (`/steam-deck-2/`) e 06 (`/melhor-pc-portatil-2026-rog-ally-vs-steam-deck/`): configuração removida corrigida com exemplo executado, especificações presumidas retiradas e Ally original distinguido do X. Evidências e estado em [relatório](reports/rodada-2026-10-02-portateis-e-astro.md). Link de retorno no Ally X sem alteração de data. Total de trabalho registrado do dia passa a 4 novos e 12 revisões substanciais; nenhum novo ou agendamento nesta continuação. Quinto novo ainda pendente de apuração. Permanecem P0 04 (headsets), 09 (Monster Hunter Wilds) e 10 (cloud gaming), além da dívida do cluster Switch 2 e dos demais tutoriais Astro. Revisão de dependências do site principal é pendência técnica identificada ao montar o exemplo isolado.

## Continuação de 02/10 — cloud gaming e Monster Hunter Wilds

Quatro revisões substanciais: P0 09 (modos Wilds), P0 10 (nuvem vs console), P1 14 (custo da nuvem) e correção complementar do guia Wilds no PS5 Pro. Títulos/intenção diferenciados, retirados testes fictícios, latência universal e garantia de 60 FPS com ray tracing. [Relatório, fontes e estado](reports/rodada-2026-10-02-cloud-e-wilds.md). Total registrado do dia: 4 novos e 16 revisões substanciais; quinto novo segue pendente de apuração, sem novo agendamento. Próximos: P0 04 headsets, dívida do cluster Switch 2 e tutoriais; revisar também promessas universais do cloud teclado/mouse. Medir estas quatro URLs a partir de 12/10, quando houver cobertura pós-deploy e acesso a GSC.

## Continuação de 02/10 — headsets

P0 04 e P1 12: comparação Quest 4 vs Vision Pro Lite e roteiro de rumores corrigidos em URLs existentes; retirados preços/fichas presumidas, previsão de lançamento e recomendação sem teste. Pilar recebeu links de retorno sem mudança de updatedDate. [Apuração e estado](reports/rodada-2026-10-02-headsets.md). Total registrado: 4 novos e 18 revisões substanciais; nenhum novo/agendamento nesta continuação. Quinto novo ainda depende de apuração. Próximas correções factuais: Vision Pro 2 vs Quest Pro 2, Connect descrito como evento futuro, Quest 3S e cluster Switch 2; tutoriais seguem na fila. Medição a partir de 12/10 com GSC pós-deploy, quando acessível.

## Continuação de 03/10 — compatibilidade e upgrades do Switch 2

Corrigida a URL `e-oficial-nintendo-switch-2-confirma-retrocompatibilidade-e-garante-seus-jogos-antigos`: retirada garantia de biblioteca inteira e esclarecida diferença entre compatibilidade, atualização gratuita e upgrade pago. Link de retorno no guia de formatos/controles sem alterar a data. [Pesquisa, validação e estado](reports/rodada-2026-10-03-switch-2.md). Entregas desta rodada: 0 novos/1 revisão substancial; meta inicial de 5 novos/3 revisões deixa 5 novos e 2 revisões pendentes de apuração. Nenhum agendamento. Próximas prioridades: dívida do cluster Switch 2 e tutoriais da fila; GSC indisponível via CLI, sem novo baseline.

## Continuação de 04/10 — Star Wars: Galactic Racer

Novo guia `/star-wars-galactic-racer-requisitos-pc-preco-edicoes/` (requisitos mínimos, preço Steam BR R$ 229,90/R$ 306,90, edições; fontes: API pública da Steam e anúncio da Secret Mode, 04/10/2026). Link de retorno no guia de lançamentos de outubro. Limites: Steam sem requisitos recomendados nem preço do upgrade Deluxe; sem preço de console. GSC indisponível (sem credencial de service account); sem baseline. Total do dia: 1 novo/0 revisões; demais metas pendentes de apuração. Nenhum agendamento.
