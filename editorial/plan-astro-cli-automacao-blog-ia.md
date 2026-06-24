# Sistema Editorial Astro + CLI + Skills

## Resumo
- O blog atual já é totalmente file-based em `src/content/blog` com Content Collections do Astro, 518 posts e 52 drafts locais, sem CMS ativo nem automação editorial própria.
- O legado útil de `../dougdesign-seo` é a camada editorial: regras de negócio, heurísticas de canibalização, extração de fontes, Search Console, geração de capas e organização por inventário. A parte WordPress deve ser descartada, não portada.
- Há sinais de migração incompleta que precisam entrar no escopo da adaptação: 7 posts ainda contêm links `file://`, e a taxonomia atual está inconsistente (`Web-design`, `Web Design`, `Programacao`, `Programação`, `Inteligencia-artificial`, etc.).
- A arquitetura recomendada mantém o site estático e preserva o fluxo natural atual: editar arquivo, commitar, dar push, deixar a Vercel publicar. O agendamento passa a ser feito por GitHub Actions promovendo drafts agendados no branch padrão, não por cron do WordPress.

## Estrutura alvo
- Criar uma raiz nova `editorial/` dentro deste repositório. O nome recomendado é `editorial/`, não `auto-editorial/`, porque ela vai concentrar automação, regras, inventário, skills e operação humana.
- Manter `src/content/blog/` como fonte única de verdade para posts e `src/assets/images/posts/` como destino final das capas. Não criar um segundo espelho "published".
- Criar `tools/dougseo-cli/` dentro deste repositório e manter o nome do binário como `dougseo` para reaproveitar o modelo mental do sistema antigo.
- Criar `.github/workflows/editorial-scheduled-publish.yml` para promoção automática de posts agendados.
- Criar `editorial/README.md` como índice humano e `AGENTS.md` como índice obrigatório para agentes.

## AGENTS e documentação
- Reescrever `AGENTS.md` preservando as instruções de desenvolvimento atuais e adicionando uma seção "Leitura obrigatória" apontando para:
  - `editorial/README.md`
  - `editorial/docs/01-principios.md`
  - `editorial/docs/02-taxonomia.md`
  - `editorial/docs/03-fluxo-editorial.md`
  - `editorial/docs/04-frontmatter-e-templates.md`
  - `editorial/docs/05-estilo-e-estrutura.md`
  - `editorial/docs/06-seo-e-interlinks.md`
  - `editorial/docs/07-imagens-e-capas.md`
  - `editorial/docs/08-publicacao-e-agendamento.md`
  - `editorial/docs/09-search-console-e-medicao.md`
  - `editorial/skills/*/SKILL.md`
  - `tools/dougseo-cli/README.md`
- Migrar o conteúdo útil de `../dougdesign-seo/docs/`, `templates/` e `prompt-create-posts.md` para esses novos arquivos, já adaptando o texto para Astro, GitHub e Vercel.
- Atualizar `CLAUDE.md` para apontar exatamente para a mesma árvore editorial, sem divergência de regras entre arquivos de guidance.

## Frontmatter e tipos públicos
- Expandir `src/content.config.ts` para um schema editorial rico, compatível com o uso do site e da CLI. O contrato canônico deve ficar assim:

```yaml
---
title: "..."
slug: "..."
pubDate: 2026-06-24T09:00:00-03:00
updatedDate: 2026-06-24T09:00:00-03:00
author: "Zeca Games"
category: "Games"
draft: true
scheduled: false
meta_description: "..."
description: "..."
image: "../../assets/images/posts/slug.jpg"
readingTime: "6 min"
featured_image:
  prompt: "Editorial photography, 16:9, no text, no logos..."
  alt: "..."
  generated_path: "src/assets/images/posts/slug.jpg"
keyword_principal: "..."
content_type: "noticia"
cluster: "switch-2"
assunto: "Nintendo Switch 2"
intencao_busca: "..."
decisao_do_leitor: "comprar"
fato_novo: "..."
canonical_role: "apoio"
internal_links:
  to:
    - "https://dougdesign.com.br/post-relacionado/"
  from_needed:
    - "https://dougdesign.com.br/post-que-deve-linkar/"
quality_notes:
  below_word_target_reason: null
canibalizacao:
  status: "aprovado"
  resumo: "..."
fontes_oficiais:
  - "https://fonte-oficial.com/..."
---
```

- `draft` continua sendo a chave de publicação usada pelo site. `scheduled` distingue um draft comum de um draft agendado. O workflow só promove arquivos com `draft: true`, `scheduled: true` e `pubDate <= agora`.
- `slug` passa a ser obrigatório e auditado contra o nome do arquivo. O nome do arquivo continua sendo a fonte de URL; a CLI deve falhar se `slug` e filename divergirem.
- `category` e `author` passam a ser validados contra config canônica em `editorial/config/taxonomy.yml`, com aliases de migração para limpar o legado.

## CLI pública
- Reaproveitar do projeto antigo os módulos de IA, imagem, auditoria, Search Console e parsing; substituir a camada WordPress por operações locais de conteúdo, Git e agenda.
- A superfície pública da CLI deve ser esta:

```text
dougseo doctor
dougseo inventory build
dougseo inventory stats
dougseo intent check --category ... --subject ... --intent ...
dougseo post scaffold --category ... --subject ... --intent ... --source ...
dougseo post create --category ... --subject ... --intent ... --source ... [--with-ai]
dougseo post update --slug ... --source ...
dougseo cover generate --slug ... [--html]
dougseo publish --slug ... [--commit] [--push]
dougseo schedule --slug ... --at 2026-06-24T18:00:00-03:00 [--commit] [--push]
dougseo queue list
dougseo queue run [--commit] [--push] [--ci]
dougseo audit [--scope drafts|scheduled|published|all]
dougseo search-console inspect --latest 20
dougseo deploy trigger
```

- `post scaffold` cria o arquivo estruturado e vazio. `post create --with-ai` pode gerar rascunho com IA, mas o `AGENTS.md` deve continuar instruindo agentes a preferirem escrita nativa e usarem a CLI principalmente para validação, inventário, capa, agenda e publish.
- `publish` apenas muda frontmatter, recalcula campos derivados, roda auditoria mínima e opcionalmente faz commit/push.
- `schedule` marca `scheduled: true`, ajusta `pubDate` para o horário de publicação e opcionalmente faz commit/push.
- `queue run` é idempotente e é o único comando usado pelo workflow agendado.

## Mapeamento interno da CLI
- Manter e adaptar `providers/adapter.ts`, `providers/codex.ts`, `providers/imagegen.ts`, `source-extractor.ts`, `search-console.ts`, `frontmatter.ts`, `intent-check.ts` e parte de `audit.ts`.
- Remover `wordpress.ts`, `sync.ts` e qualquer noção de `wp.id`, `wp.url`, upload de mídia ou REST admin.
- Criar `lib/content-index.ts`, `lib/taxonomy.ts`, `lib/git.ts`, `lib/scheduler.ts`, `lib/publish-local.ts`, `lib/legacy-link-fix.ts` e `lib/posts-query.ts`.
- Manter `dougseo sync` apenas como alias opcional para `inventory build`, para não quebrar memória operacional antiga.

## Inventário, taxonomia e limpeza do legado
- Criar `editorial/config/taxonomy.yml` com categorias canônicas, autores padrão, aliases e clusters prioritários.
- Rodar uma migração única para:
  - acrescentar `slug`, `scheduled: false` e campos editoriais faltantes nos 518 posts atuais
  - normalizar categorias inconsistentes para um conjunto fechado
  - normalizar autores quando houver alias ou placeholders como `admin`
  - converter os 7 links `file://` restantes em URLs públicas `https://dougdesign.com.br/<slug>/`
  - recalcular `readingTime`
- Gerar `editorial/inventory/posts.json`, `editorial/inventory/categories/*.md`, `editorial/inventory/clusters/*.md`, `editorial/inventory/authors.md` e `editorial/inventory/stats.json` diretamente do conteúdo local, sem espelho WordPress.
- Centralizar a consulta de posts publicados em um helper único do site, para parar de repetir `getCollection('blog', ({ data }) => !data.draft)` em múltiplas páginas/componentes.

## Agendamento
- Implementar `.github/workflows/editorial-scheduled-publish.yml` com `schedule` e `workflow_dispatch`.
- O workflow deve:
  - rodar no branch padrão do repositório, hoje `master`
  - instalar Bun
  - executar `dougseo queue run --commit --push --ci`
  - sair com sucesso e sem commit quando não houver posts vencidos
- O `queue run` deve promover somente posts com `draft: true`, `scheduled: true` e `pubDate <= now()` no timezone configurado.
- O workflow deve usar um cron deslocado do topo da hora para reduzir risco de atraso. O default escolhido é granularidade de 10 minutos.
- O fluxo operacional fica:
  - criar/agendar post localmente
  - push do draft agendado para o branch padrão
  - GitHub Actions promove no horário
  - o push automático do workflow dispara o deploy da Vercel
- `dougseo deploy trigger` fica como fallback opcional usando Deploy Hook, não como caminho principal.

## Skills para agentes
- Criar skills locais em formato `SKILL.md` dentro de `editorial/skills/`, porque o projeto antigo referencia `.agents/skills/` mas essa pasta não existe no source atual.
- O conjunto mínimo deve ser:
  - `editorial/skills/round-planning/SKILL.md`
  - `editorial/skills/new-post/SKILL.md`
  - `editorial/skills/update-post/SKILL.md`
  - `editorial/skills/cover-generation/SKILL.md`
  - `editorial/skills/publish-or-schedule/SKILL.md`
  - `editorial/skills/search-console/SKILL.md`
- Cada skill deve definir gatilho de uso, leitura prévia obrigatória, comandos exatos da CLI, inputs esperados, critérios de sucesso, e falhas comuns.
- `AGENTS.md` deve ordenar explicitamente que o agente leia a skill correspondente antes de executar a etapa operacional.

## Implementação por fase
- Fase 1: criar `editorial/`, migrar docs e reescrever `AGENTS.md`/`CLAUDE.md`.
- Fase 2: expandir o schema em `src/content.config.ts`, criar helper central de posts publicados e preparar a taxonomia canônica.
- Fase 3: portar a CLI antiga para `tools/dougseo-cli/`, removendo WordPress e adicionando módulos locais de publish, queue, git e inventory.
- Fase 4: rodar scripts de migração do conteúdo legado, corrigir links `file://`, normalizar categorias/autores e backfill de frontmatter.
- Fase 5: adicionar workflow agendado e validar promoção idempotente de posts.
- Fase 6: escrever as skills, templates finais e README operacional da CLI.
- Fase 7: congelar uma rodada de aceitação com draft, capa, agenda, promoção automática, deploy e relatório Search Console.

## Testes e cenários
- Teste unitário de parser/stringifier de frontmatter com os novos campos `scheduled`, `featured_image`, `internal_links` e `canibalizacao`.
- Teste unitário de normalização de taxonomia cobrindo aliases reais observados no repositório atual.
- Teste unitário de `intent check` contra posts publicados e drafts locais.
- Teste unitário de `queue run` para garantir que drafts antigos não agendados nunca são promovidos.
- Teste unitário de `cover generate` para garantir escrita em `src/assets/images/posts/` e atualização do campo `image`.
- Teste de integração: `post scaffold` -> edição manual -> `cover generate` -> `schedule --commit` -> `queue run` -> `publish`.
- Teste de integração: `publish --slug --commit` em um post não agendado.
- Teste de integração: `inventory build` gera relatórios consistentes após normalização de categorias.
- Teste de regressão do site: home, listagem paginada, RSS e página individual continuam ignorando drafts e ordenando por `pubDate`.
- Aceite manual: um post agendado no branch padrão é promovido pelo workflow e aparece no site após o deploy da Vercel.
- Aceite manual: `search-console inspect --latest 20` usa os posts locais publicados, não snapshots do WordPress.

## Assunções e defaults escolhidos
- O runtime da CLI continua em Bun/TypeScript, porque este ambiente já tem `bun 1.3.14`, `node v22.22.1` e `gh 2.94.0`, o que reduz atrito e maximiza reuso do código antigo.
- O branch padrão a ser tratado pela automação é o default branch detectado do Git remoto; hoje o remoto aponta para `origin/master`.
- O site permanece estático. Não entra adapter SSR na primeira versão. Isso segue o modelo atual do projeto e evita complexidade extra. Referências: [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/), [Astro Vercel adapter](https://docs.astro.build/en/guides/integrations-guide/vercel/).
- O agendamento fica em GitHub Actions, não em Vercel Cron, porque o site atual não usa rotas server-side e o Cron da Vercel em Hobby é diário, insuficiente para publicação editorial recorrente. Referências: [GitHub Actions `schedule`](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows), [Vercel Cron limits](https://vercel.com/docs/cron-jobs/usage-and-pricing).
- Deploy Hook da Vercel entra apenas como fallback manual ou comando auxiliar. Referência: [Vercel Deploy Hooks](https://vercel.com/docs/deploy-hooks).
- A precisão operacional escolhida para agenda é de até 10 minutos, com execução idempotente e `workflow_dispatch` como backstop; isso aceita os atrasos documentados do `schedule` do GitHub sem exigir runtime permanente.
