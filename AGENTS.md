## Development

When starting the dev server, use background mode:

```bash
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Editorial Automation

This repository now contains the editorial automation stack for the Astro blog. Before creating, updating, scheduling, auditing, or publishing posts, read in this order:

1. `editorial/README.md`
2. `editorial/docs/01-principios.md`
3. `editorial/docs/02-taxonomia.md`
4. `editorial/docs/03-fluxo-editorial.md`
5. `editorial/docs/04-frontmatter-e-templates.md`
6. `editorial/docs/05-estilo-e-estrutura.md`
7. `editorial/docs/06-seo-e-interlinks.md`
8. `editorial/docs/07-imagens-e-capas.md`
9. `editorial/docs/08-publicacao-e-agendamento.md`
10. `editorial/docs/09-search-console-e-medicao.md`
11. `tools/dougseo-cli/README.md`

Use the corresponding skill before each operational step:

- `editorial/skills/round-planning/SKILL.md`
- `editorial/skills/new-post/SKILL.md`
- `editorial/skills/update-post/SKILL.md`
- `editorial/skills/cover-generation/SKILL.md`
- `editorial/skills/publish-or-schedule/SKILL.md`
- `editorial/skills/search-console/SKILL.md`

## Non-negotiable Rules

- Do not create a new URL when the same `assunto` and `intencao_busca` already exist; use `dougseo intent check` first.
- Prefer the local Astro workflow: write file, validate locally, commit, push, let Vercel deploy.
- WordPress-specific automation is legacy only and must not be reintroduced in this repository.
- Scheduled publishing must use the local frontmatter queue plus GitHub Actions, not manual Vercel panel scheduling.
- Cover images must always be generated first using Antigravity's `generate_image` tool, saved into `src/assets/images/posts/`, and referenced from frontmatter. Use the `dougseo cover generate` tool only as a fallback.
