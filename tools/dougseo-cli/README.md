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
bun src/cli.ts search-console performance --days 28
```

## Google Search Console

O fluxo padrao usa service account e renova o access token automaticamente. Isso evita depender de token manual expirado.
O comando `search-console performance` consulta clicks, impressions, CTR, position, queries e pages do periodo recente.

Variaveis aceitas no `.env` da raiz do repo:

```bash
GSC_SITE_URL=https://dougdesign.com.br/
GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON_B64=...
```

Opcionalmente, para teste manual:

```bash
GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN=...
```

Passos de configuracao:

1. Crie uma service account no Google Cloud e gere a chave JSON.
2. Adicione o email da service account como owner ou full user na propriedade exata do Search Console.
3. Converta o JSON para base64 e cole em `GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON_B64`.

```powershell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes((Get-Content -Raw .\service-account.json)))
```

## Convencoes

- Fonte de verdade: `src/content/blog/`
- Capas: `src/assets/images/posts/`
- Inventario gerado: `editorial/inventory/`
- Taxonomia canonica: `editorial/config/taxonomy.yml`
