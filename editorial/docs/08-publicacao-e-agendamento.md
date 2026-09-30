# 08. Publicação e agendamento

Cadência inicial: dois posts novos pesquisados e uma revisão por semana, ajustável à capacidade. Revisão completa pode substituir um novo post. Nenhuma regra exige três publicações por dia.

- Urgente: notícia com fato novo confirmado e relevante; publicar imediatamente quando autorizado.
- Novo Evergreen: agendar em dias distintos, evitando concentração. Testar 08:00, 12:00 ou 18:00 em `America/Sao_Paulo`; ainda não há evidência de “horários de pico”. Pedido explícito de publicação imediata prevalece.
- Atualização: preservar `draft: false`, slug e publicação original; aplicar no próximo deploy. Não usar `schedule` para retirar artigo publicado do ar.

## Comandos e estados reais

- `dougseo publish --slug <slug>` muda o estado local; não comprova deploy. Confira `pubDate` antes: o comando não corrige data futura.
- `dougseo schedule --slug <slug> --at <ISO_COM_FUSO>` exige que o agente confira uma data futura válida; a função atual não valida isso. Marca `draft: true`, `scheduled: true` e altera `pubDate`.
- `dougseo queue list` mostra apenas agendados **vencidos**, não toda a fila futura. Confira arquivos/inventário para todos os agendados.
- `.github/workflows/editorial-scheduled-publish.yml` promove vencidos no branch `master`. O cron declarado é a cada 10 minutos, sujeito a atraso/pausa do GitHub e tempo de deploy; não prometa minuto exato sem conferir execução.
- Frontmatter sem push não ativa agendamento remoto. Confirme workflow habilitado e data/fuso antes de anunciar “agendado”.

Faça audit/build antes de publicar/agendar. Prefira Git explícito com arquivos selecionados. Atualmente **tanto `--commit` quanto `--push` chamam commit + push e incluem `git add .`**; não use como se `--commit` fosse só local nem inclua alterações alheias inadvertidamente.

Após push, confira status do deploy e URLs: HTTP 200, canonical, título/descrição, uma H1, capa/alt, data, mobile quando afetado, sitemap e links. Para artigo futuro, confira estado de draft e fila; não apresente a URL esperada como página já pública.

Registre no fechamento URLs novas e atualizadas, estado, data com fuso, commit/deploy e o que não foi verificado. Nesta rodada exclusivamente documental, informe “nenhum post publicado ou agendado”.
