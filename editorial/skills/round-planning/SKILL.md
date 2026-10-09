# Planejar rodada editorial

Use antes de escolher ou executar pautas. O passo a passo está em `editorial/rotina-diaria.md`; a ordem de prioridade, em `AGENTS.md`.

1. Rode `npm run dougseo -- brief` e leia o Markdown. Não abra os JSON de `editorial/reports/`.
2. Leia `editorial/pautas.md`. Planejamento não é publicação agendada.
3. Monte o lote (até 8 ações, no máximo 3 posts novos): correções factuais, seção 0 do brief, posts novos desconhecidos pelo Google (seção 5), canibalização com evidência e posts novos com sinal de demanda.
4. Deixe de fora as URLs com ⏸, salvo erro factual.
5. Para cada item, registre URL, ação, evidência com data e resultado esperado. Antes de nova URL, rode `intent check` e revise candidatos em todas as categorias.
6. Escolha só o que pode ser pesquisado e validado nesta rodada. Uma urgência real pode ocupar um slot; não compense falta de evidência com textos repetidos ou incompletos.
7. Sem dados do GSC, registre a limitação e trate a fila como hipótese.
