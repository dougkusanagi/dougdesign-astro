# CLI segura e nova revisão Meta Quest 4 — 30/09/2026

## Escopo e autorização

Pedido explícito: implementar seis melhorias da CLI e revisar novamente a URL Meta Quest 4 usando Codex CLI já autenticado com ChatGPT. Nenhum token lido/copied e nenhuma API key configurada. Documentação editorial e skills `update-post`, `new-post` e `publish-or-schedule` aplicadas. Documentação oficial do modo não interativo do Codex consultada. As fontes do artigo foram reabertas, verificadas manualmente e fornecidas ao Codex como notas factuais.

O artigo já tinha uma correção publicada em rodada anterior. Esta revisão não restaura uma falha de publicação: melhora a estrutura e a decisão de compra com auxílio real do Codex, sem depender de Ollama.

## Seis melhorias implementadas

1. Git por arquivo, sem `git add .`; commit local separado de push. Teste com repositório real confirma que alteração staged alheia é preservada. `queue run --ci` continua enviando os arquivos promovidos em master.
2. Schedule exige ISO futuro com segundos/fuso e data de calendário válida; bloqueia URL publicada. Publish rejeita data inválida/futura. Publicação e agendamento passam por auditoria por slug; fila inteira é auditada antes de promoção.
3. Slug restrito e criação exclusiva, sem sobrescrever arquivo existente ou escapar do diretório. Scaffold novo sem H1 duplicada.
4. Audit passa a verificar também publicados e legados: metadados, capa existente/procedência/alt, descrição, H1 fora de blocos de código, importação/placeholders e links Markdown internos registrados. `--slug` permite validar a URL alterada. Score e verificação local não certificam fatos, HTTP ou redirects.
5. Publish, schedule e adição de fontes preservam autoria e `updatedDate`; não inventam fato novo ou atualização por mudança de estado. Revisão substancial recebe data explícita do editor.
6. `post create --with-ai --source-material <json>` gera texto pelo Codex autenticado; admite Ollama chat configurável como fallback. Exige trechos, URLs e datas de consulta, valida intenção, estrutura e citações e grava apenas rascunho com revisão factual pendente. Publicação é bloqueada enquanto `ai_review.status` estiver pendente. Nem fonte fornecida nem score provam precisão factual.

Documentos e checklists operacionais foram alinhados ao comportamento novo; relatos históricos não foram reescritos.

## Intenção e apuração do artigo

URL preservada: https://www.dougdesign.com.br/meta-quest-4-chega-ao-mercado-a-nova-fronteira-dos-jogos-vr-e-o-que-ele-significa-para-o-futuro/

`intent check` real com `--ai-provider codex --ai-fallback none`: conflito exato com a própria URL e possível intenção equivalente com `/meta-quest-4-rumores-preco-lancamento-novidades/`, em Tecnologia. Revisados manualmente rumores, comparativo e antecipação do Connect. Mantida a URL principal; não houve redirect, consolidação ou link para conteúdos que ainda exigem revisão.

Fontes oficiais reabertas em 30/09/2026:

- https://about.fb.com/br/news/2026/09/tudo-o-que-anunciamos-no-meta-connect-2026/ — evento/anúncio de 23/09; distingue menção brasileira dos óculos com IA.
- https://about.fb.com/news/2026/09/introducing-meta-vr-glasses-3d-movies-immersive-live-sports-100-grams/ — janela na primavera de 2027 do hemisfério norte e US$ 1.299,99 para VR Glasses, não Quest 4.
- https://developers.meta.com/vr/essentials/compare-devices/ — data declarada 18/09; linhas Meta Quest e Meta VR Glasses separadas.

A busca adicional nos domínios oficiais não encontrou anúncio Quest 4; a ausência continua limitada às fontes e à consulta. Não foram inventados preço brasileiro, data, catálogo, especificações de Quest 4, teste ou benchmark. Geração real pelo `generateDraft`/Codex concluída; resultado revisado manualmente antes de editar a URL existente. Acrescentados tabela, critérios concretos de compra e limites; preservada nota de correção, slug, `pubDate: 2026-06-18`, Zeca Games e estado público. `updatedDate` atualizado substancialmente em 30/09/2026 com fuso -03:00.

Capa conceitual existente mantida: já revisada visualmente, sem alegar produto real anunciado. Nenhuma geração de capa necessária. Baseline 436 impressões/1 clique é histórico de 29/09; nenhuma consulta nova GSC/GA4. Próxima avaliação editorial: 12/10/2026, quando houver dados, sem prometer ganho de tráfego.

## Validação e estado

37 testes aprovados no workspace; bundle Bun compilado. Testes incluem Git real, datas inválidas, preservação de publicados/datas/autoria, colisão de arquivos, auditoria de legados, bloqueio da fila, fontes/citações e estado de revisão dos rascunhos. Intenção e geração reais pelo Codex verificadas. Auditoria do artigo e dos agendados: sem issues.

A auditoria integral ampliada encontrou 560 artigos com pendências no snapshot inicial (incluindo 492 com blocos de importação e 501 com procedência de capa ausente). Não se declarou aprovação geral nem se alterou esses artigos nesta tarefa. Há manutenção de conteúdo/layout em paralelo no workspace; arquivos alheios serão excluídos do commit e build final validado em checkout isolado. A contagem será refeita no commit isolado.

Build/HTML/mobile e deploy: pendentes de validação final. Estado desta revisão: deploy pendente; a versão anterior da URL continua pública. Nenhuma URL nova criada e nenhum post novo publicado ou agendado. A geração de teste ficou em arquivo temporário, sem entrar na coleção.
