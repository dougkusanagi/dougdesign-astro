# Publicar ou agendar

Use depois de revisão factual, audit e build. Siga `08-publicacao-e-agendamento.md`.

1. Confirme autorização já existente e estado do artigo; não peça novamente por regra inferida. Evergreen novo entra em dias distintos da fila; Urgente confirmado vai ao ar imediatamente. Atualização publicada preserva URL/pubDate/estado público. Pedido explícito de publicação imediata prevalece.
2. Antes de `publish`, confira que pubDate corresponde à publicação desejada (o comando não remove data futura). Antes de `schedule`, valide ISO futuro com fuso. Slots 08:00/12:00/18:00 são testes iniciais, não picos comprovados.
3. Prefira comandos sem `--commit`/`--push` e Git explícito com arquivos selecionados: ambas as flags atuais fazem commit + push com `git add .`.
4. Para agendados, confira frontmatter, push e workflow habilitado; `queue list` mostra só vencidos. Cron pode atrasar; informe horário pretendido, não garantia de minuto.
5. Confira deploy e URLs em produção quando publicadas; confirme HTTP, canonical, uma H1, metadados, capa, datas, sitemap e links. Se não puder verificar, indique pendência.
6. Atualize pautas/relatório e liste URLs novas e atualizadas com estados comprovados e datas com fuso. Não confunda planejado, arquivo local, agendado remoto, deploy pendente e ao vivo.
