# 08. Publicação e agendamento

Cadência diária definida pelo dono em 01/10/2026: **5 novos posts pesquisados e 3 atualizações substanciais por dia** como meta operacional inicial, ampliável conforme fatos e capacidade de revisão. Não é um teto nem motivo para publicar um texto incompleto. Registrar diariamente metas, entregas e pendências; revisões complexas podem consumir mais de um slot. Não compensar falta de apuração com repetição de intenção.

Publicar cinco ou mais notícias diárias não configura, por si só, spam. A [política oficial do Google](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content) descreve abuso de conteúdo em escala pela finalidade de manipular rankings e pela falta de valor, independentemente do método. Não estabelece um máximo diário. [Conteúdo útil](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) continua sendo o critério; trocar datas sem mudança real ou publicar apenas para parecer atualizado não atende esse objetivo. A antiga cadência semanal era uma escolha operacional do projeto, não uma exigência do Google.

- Urgente: notícia com fato novo confirmado e relevante; publicar imediatamente quando autorizado.
- Novo Evergreen: pode ser agendado no mesmo dia de outros posts. Distribuir os horários para organizar a leitura e a operação, sem alegar benefício de ranking. Testar 08:00, 10:00, 12:00, 15:00 ou 18:00 em `America/Sao_Paulo`; ainda não há evidência de “horários de pico”. Pedido explícito de publicação imediata prevalece.
- Atualização: preservar `draft: false`, slug e publicação original; aplicar no próximo deploy. Não usar `schedule` para retirar artigo publicado do ar.

## Comandos e estados reais

- `dougseo publish --slug <slug>` muda o estado local após auditoria; não comprova deploy. Rejeita `pubDate` inválida/futura e preserva as datas editoriais.
- `dougseo schedule --slug <slug> --at <ISO_COM_FUSO>` exige ISO futuro válido com fuso e segundos; rejeita artigo publicado. Marca `draft: true`, `scheduled: true` e altera `pubDate`.
- `dougseo queue list` mostra apenas agendados **vencidos**, não toda a fila futura. Confira arquivos/inventário para todos os agendados.
- `.github/workflows/editorial-scheduled-publish.yml` audita e promove vencidos no branch `master`. O cron declarado é a cada 10 minutos, sujeito a atraso/pausa do GitHub e tempo de deploy; não prometa minuto exato sem conferir execução.
- Frontmatter sem push não ativa agendamento remoto. Confirme workflow habilitado e data/fuso antes de anunciar “agendado”.

Faça audit/build antes de publicar/agendar. Prefira Git explícito com arquivos selecionados. `--commit` agora faz apenas commit local dos arquivos da operação; `--push` faz commit e push desses arquivos para `origin/master`. Trabalho staged alheio é preservado. `queue run --ci` mantém commit + push para a automação.

Após push, confira status do deploy e URLs: HTTP 200, canonical, título/descrição, uma H1, capa/alt, data, mobile quando afetado, sitemap e links. Para artigo futuro, confira estado de draft e fila; não apresente a URL esperada como página já pública.

Registre no fechamento URLs novas e atualizadas, estado, data com fuso, commit/deploy e o que não foi verificado. Nesta rodada exclusivamente documental, informe “nenhum post publicado ou agendado”.
