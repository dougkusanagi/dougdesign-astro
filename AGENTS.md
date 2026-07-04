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
- Divide posts into "Evergreen" (always relevant, must be scheduled at staggered intervals) and "Urgente" (news or hot topics, published immediately).
- Never publish multiple evergreen posts at the exact same time. Stagger them across peak traffic hours (targeting 3 posts per day at 08:00, 12:00, and 18:00 local time) using `dougseo schedule --slug <slug> --at <ISO_DATE>`.
- At the end of every operational round, the agent must output a clean list of public URLs for all created posts (e.g. `https://dougdesign.com.br/<slug>/`), indicating if they are already live or scheduled (with their respective publication dates).

## Quality, Consistency & Performance Guidelines

- **Quality Over Quantity (EEAT Focus):** Every post must demonstrate real-world Experience, Expertise, Authoritativeness, and Trustworthiness (EEAT). Prioritize deep, research-backed, and highly structured articles over a high volume of shallow posts.
  - **No Rigid Templates for Evergreen/Tutorials:** Do NOT use generic template subheadings (e.g. `## O que aconteceu`, `## O que e oficial`, `## O que ainda falta confirmar`) for Evergreen guides or tutorials. Write custom, doubt-driven subheadings (e.g. `## Como o CSS Subgrid resolve o alinhamento de cards?`). The generic template subheadings should ONLY be used for strict chronological "Notícias" (news).
  - **E-E-A-T Tone & Developer Value:** Avoid writing like a generic summary. Inject strong, opinionated viewpoints, concrete code examples, real-world warnings based on developer experience, and clear recommended next steps.
  - **Banned AI Clichés:** Completely avoid using typical AI-generated clichés and buzzwords like *vital*, *essencial*, *revolucionar*, *divisor de águas*, *mergulhar*, *ecossistema em constante evolução*, *no cenário atual*, etc.
- **Consistency Over Intensity:** Maintain a stable and realistic publication cycle (e.g., 2 to 3 high-quality posts per week) instead of daily bursts that degrade content value.
- **Update Over Recreate:** Regularly audit and refresh older posts that are already ranking but need fresh information, updated numbers, or improved internal links. Updating existing URLs typically recovers and doubles traffic faster than creating new ones from scratch.
- **Technical Performance (Core Web Vitals):** Ensure the application remains extremely lightweight, fast, and fully responsive on mobile. Avoid bloated scripts, style sheets, or unoptimized images that harm user experience and SEO ranking.

