# Operação editorial do Doug Design

Este diretório concentra as regras, a fila e o histórico do blog Astro. As regras gerais estão em `AGENTS.md`, na raiz.

## Onde consultar

| Arquivo | Para quê | Quando ler |
|---|---|---|
| [rotina-diaria.md](rotina-diaria.md) | Passo a passo da rodada (brief, lote, PR, deploy, registro) | Toda rodada |
| [pautas.md](pautas.md) | Fila ativa com evidência | Toda rodada |
| `docs/01` a `docs/10` | Critérios de pesquisa, escrita, SEO, capas, publicação, medição e armadilhas conhecidas | Na etapa correspondente (tabela em `AGENTS.md`) |
| `skills/` | Checklists por etapa | Antes da etapa |
| [historico/](historico/) | Registro mensal das rodadas | Só para investigar algo passado |
| `reports/` | Relatórios detalhados de rodadas (Markdown) e JSON gerados pela CLI (fora do Git) | Quando um item citar o relatório |
| `config/taxonomy.yml` | Categorias, aliases e autores padrão | Ao criar post |
| `inventory/` | Artefatos derivados (`dougseo inventory build`) | Raramente |

`plan-astro-cli-automacao-blog-ia.md` e `plano-embeddings-e-refinamento-seo.md` são planos de implementação antigos, não fila editorial nem garantia de funcionalidade pronta.

## Fontes de verdade

Posts ficam em `src/content/blog/` e capas em `src/assets/images/posts/`. O contrato do Astro está em `src/content.config.ts` e a CLI em `tools/dougseo-cli/`. O agendamento executável é o frontmatter mais `.github/workflows/editorial-scheduled-publish.yml`. A fila em `pautas.md` deve acompanhar o estado real dos arquivos, do GitHub Actions e da produção.

Nos documentos, `dougseo <comando>` abrevia `npm run dougseo -- <comando>`, executado na raiz do projeto. Os comandos estão no [README da CLI](../tools/dougseo-cli/README.md).
