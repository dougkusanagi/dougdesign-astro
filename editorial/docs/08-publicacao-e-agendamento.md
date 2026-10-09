# 08. Publicação e agendamento

## Cadência

Desde 08/10/2026, a cadência segue a evidência, não uma cota. Cada rodada tem até 8 ações de URL, com no máximo 3 posts novos, na ordem de prioridade de `AGENTS.md`. Essa regra substituiu a meta de 01/10 (5 novos e 3 atualizações por dia), que media esforço e não resultado. Só abra post novo com sinal de demanda registrado. Uma rodada sem pauta com evidência pode terminar só com medição e correções. Pedido explícito do dono prevalece.

Publicar vários posts por dia não configura spam por si só. A [política oficial do Google](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content) trata como abuso de conteúdo em escala a produção feita para manipular rankings e sem valor, independentemente do método, e não fixa um máximo diário. [Conteúdo útil](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) continua sendo o critério; trocar datas sem mudança real ou publicar só para parecer atualizado não atende a ele.

## Tipos de publicação

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

Após o merge, confira o deploy e as URLs com `curl`: HTTP 200, canonical, título/descrição, uma H1, capa/alt, data, sitemap e links. Se precisar de navegador (mobile, visual), visite antes `https://www.dougdesign.com.br/?interno=1` nele. Depois, rode `dougseo search-console sitemap --submit` para o Google baixar o sitemap de novo; ele traz `lastmod` vindo de `updatedDate`/`pubDate`. Para artigo futuro, confira estado de draft e fila; não apresente a URL esperada como página já pública.

Registre no fechamento as URLs novas e atualizadas, o estado, a data com fuso, o commit/deploy e o que não foi verificado. Em rodada só documental, informe “nenhum post publicado ou agendado”.
