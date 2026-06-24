# DougSEO CLI

CLI editorial local do blog Astro.

## Uso rapido

```bash
cd tools/dougseo-cli
bun install
bun src/cli.ts doctor
```

## Comandos principais

```bash
bun src/cli.ts inventory build
bun src/cli.ts inventory stats
bun src/cli.ts intent check --category games --subject "Nintendo Switch 2" --intent "vale a pena comprar agora"
bun src/cli.ts post scaffold --category games --subject "..." --intent "..." --source "https://..."
bun src/cli.ts cover generate --slug meu-post --html
bun src/cli.ts publish --slug meu-post
bun src/cli.ts schedule --slug meu-post --at 2026-06-25T09:00:00-03:00
bun src/cli.ts queue list
bun src/cli.ts queue run --ci
bun src/cli.ts audit --scope all
bun src/cli.ts search-console inspect --latest 20
```

## Convenções

- Fonte de verdade: `src/content/blog/`
- Capas: `src/assets/images/posts/`
- Inventário gerado: `editorial/inventory/`
- Taxonomia canônica: `editorial/config/taxonomy.yml`
