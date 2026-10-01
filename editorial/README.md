# Operação editorial do Doug Design

Este diretório concentra as regras e o planejamento do blog Astro.

## Onde consultar

- [Pautas](pautas.md): fila de trabalho, prioridades, evidências e próximos slots. Planejamento não aciona publicação.
- `docs/01-principios.md` a `09-search-console-e-medicao.md`: critérios de pesquisa, escrita, revisão, SEO, publicação e medição.
- `skills/`: checklists operacionais; leia a skill antes da etapa correspondente.
- `config/taxonomy.yml`: categorias, aliases e autores padrão.
- `reports/`: evidência histórica de rodadas; conferir data e período antes de reutilizar métricas.
- `inventory/`: artefatos derivados. `inventory stats` pode mostrar um snapshot antigo; execute `inventory build` quando precisar de dados atuais.
- `plan-astro-cli-automacao-blog-ia.md` e `plano-embeddings-e-refinamento-seo.md`: planos de implementação, não fila editorial nem garantia de funcionalidade pronta.

- [Plano de melhorias — 01/10/2026](../docs/plano-melhorias-blog-2026-10-01.md): escopo, etapas e critérios de aceite; implementação futura.
- [Posts prioritários — 01/10/2026](reports/posts-priorizados-2026-10-01.md) e [triagem completa](reports/triagem-posts-publicados-2026-10-01.csv): riscos, demanda, ações e pendências.

## Fontes de verdade

Posts: `src/content/blog/`. Capas: `src/assets/images/posts/`. Contrato do Astro: `src/content.config.ts`. CLI: `tools/dougseo-cli/`. Agendamento executável: frontmatter + `.github/workflows/editorial-scheduled-publish.yml`.

`AGENTS.md` define as regras gerais; os documentos detalham essas regras. A fila de pautas deve acompanhar o estado real dos arquivos, GitHub Actions e produção.

## Fluxo obrigatório

1. Ler pautas e evidências recentes; definir a dúvida do leitor e a ação (criar, atualizar ou corrigir).
2. Conferir inventário, intenção e URLs relacionadas.
3. Pesquisar fontes primárias e escrever/revisar o markdown, removendo placeholders do scaffold.
4. Conferir links, fatos, datas, autoria, exemplos e capa.
5. Auditar e fazer build; testar apenas o que a mudança exige.
6. Publicar ou agendar no fluxo local, conforme autorização e classificação editorial.
7. Commit/push, verificar deploy e registrar resultados, URLs e próximos passos.

Para comandos, use o [README da CLI](../tools/dougseo-cli/README.md). Exemplos com `dougseo` nos documentos são abreviações de `npm run dougseo --` na raiz do projeto.
