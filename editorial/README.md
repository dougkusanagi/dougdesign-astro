# Editorial Automation

This directory is the operational home for the Astro editorial system.

## What lives here

- `docs/`: business rules, publishing flow, frontmatter contract, SEO, scheduling and measurement.
- `config/`: canonical taxonomy and author/category aliases.
- `skills/`: short operational instructions for agents and repeatable editorial tasks.
- `plan-astro-cli-automacao-blog-ia.md`: the implementation plan that seeded this stack.

## Source of truth

- Published and draft-ready posts live in `src/content/blog/`.
- Cover images live in `src/assets/images/posts/`.
- The local CLI lives in `tools/dougseo-cli/`.

## Required flow

1. Check inventory and canibalization with `dougseo intent check`.
2. Scaffold or update the local markdown file.
3. Generate the cover into `src/assets/images/posts/`.
4. Audit the post locally.
5. Publish now or schedule via frontmatter plus GitHub Actions.
6. Commit and push so Vercel deploys the new static output.
