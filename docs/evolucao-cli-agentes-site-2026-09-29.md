# Oportunidades de evolução: CLI, agentes e site — 29/09/2026

Baseado em leitura do código e dos documentos editoriais. Nada foi executado nem testado; trate os itens como hipóteses a confirmar antes de implementar.

## CLI (`dougseo`)

1. **A CI de testes nunca roda.** `.github/workflows/test.yml` dispara em `main` e `improvements-phase1`, mas a branch é `master`. Os 7 testes unitários e os 9 E2E só passam quando executados manualmente. Correção de uma linha.
2. **A fila publica sem portão.** `.github/workflows/editorial-scheduled-publish.yml` roda `queue run --ci` a cada 10 minutos, com `git add .` e push, sem `audit` nem `astro build` antes. Um post agendado com erro de schema pode derrubar o deploy. Proposta: rodar `audit` e build antes do commit e commitar só os paths promovidos.
3. **`--commit` e `--push` fazem a mesma coisa e usam `git add .`** (`tools/dougseo-cli/src/lib/git.ts`). O README já avisa. Proposta: commitar apenas os arquivos alterados pelo comando.
4. **`schedule` não valida a data** (`tools/dougseo-cli/src/lib/post-ops.ts:23`). Exigir ISO com fuso e data futura. `publish` deveria recusar `pubDate` futura e rodar o `audit` do próprio post.
5. **`queue list` só mostra vencidos.** Falta listar os agendados futuros.
6. **Subcomandos `analytics overview|pages|sources|engagement` retornam o mesmo relatório.** Diferenciá-los ou reduzir a `performance` e `adsense`.
7. **A CLI não tem testes.** Os existentes cobrem `content` e `contentQuality`. `normalize`, `intent-check`, `post-ops` e `queue` mexem em arquivos e datas e são a parte mais arriscada.
8. **Comandos novos:**
   - `links check`: links internos quebrados no `dist/` (pauta P06 e útil à operação).
   - `report weekly`: relatório semanal a partir de GSC e GA4, evitando consulta manual quando faltar a service account.

## Agentes e skills

- Não há `.claude/` com permissões ou hooks. Um hook `PreToolUse` bloqueando `git add .` em `src/content`, e um pré-commit com `dougseo audit` nos arquivos alterados, seriam mais confiáveis que regras escritas.
- `CLAUDE.md` e `AGENTS.md` duplicam a lista de leitura obrigatória à mão. Um pode importar o outro, ou um teste pode verificar que estão iguais.
- Skills a criar: `factual-review` (checklist de alegações, como o "prática diária de testes" da P02) e `weekly-report` (medição semanal).
- Agente revisor independente para fatos e duplicação semântica antes de agendar, no modelo da revisão visual de capa que funcionou em 29/09.

## Site

- **Não existe bloco "Leia também" nos posts.** Nenhum arquivo de `src/pages`, `src/components`, `src/layouts` ou `src/lib` referencia posts relacionados. Com 553 publicados e CTR de 0,8%, links internos são a alavanca mais barata. O schema já tem `internal_links` e `cluster`, e `tools/dougseo-cli/src/lib/embeddings.ts` pode calcular similaridade.
- **497 dos 595 posts são `legado-importado`.** Criar relatório de triagem (manter, atualizar, fundir com redirect ou `noindex`), cruzando `content freshness` com dados do GSC.
- **Indexação:** 208 páginas "alternativa com canonical" e 106 "detectadas, não indexadas". Três posts de Subgrid e três URLs de Quest 4 indicam canibalização. Um comando que agrupe URLs por intenção ajudaria.
- **Teste E2E de página de artigo:** canonical, uma H1, JSON-LD `BlogPosting` e data de atualização. Hoje os E2E cobrem home, filtros, consentimento e barra de progresso.

## Ordem sugerida

Itens 1, 2 e 4 da CLI (menos de uma hora no total), depois o "Leia também" no site. Cuidado com as alterações não commitadas na árvore (Quest 4, Penpot) ao mexer em Git.
