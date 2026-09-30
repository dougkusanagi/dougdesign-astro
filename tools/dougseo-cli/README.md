# DougSEO CLI

CLI editorial local do blog Astro. Para regras de qualidade/cadência, siga [AGENTS.md](../../AGENTS.md) e [editorial/README.md](../../editorial/README.md); a [fila de pautas](../../editorial/pautas.md) é planejamento, não automação de publicação.

Nos documentos, `dougseo <comando>` é abreviação. Na raiz, use `npm run dougseo -- <comando>`; dentro de `tools/dougseo-cli`, use `bun src/cli.ts <comando>`.

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
bun src/cli.ts cover generate --slug meu-post --svg ../../src/assets/images/posts/meu-post.svg
bun src/cli.ts publish --slug meu-post
bun src/cli.ts schedule --slug meu-post --at 2026-10-05T12:00:00-03:00
bun src/cli.ts queue list
bun src/cli.ts queue run --ci
bun src/cli.ts audit --scope all
bun src/cli.ts search-console inspect --latest 20
bun src/cli.ts search-console performance --days 28
bun src/cli.ts search-console opportunities --days 28 --top 100
bun src/cli.ts content audit
bun src/cli.ts content freshness --days 180
bun src/cli.ts analytics performance --days 28 --top 20
bun src/cli.ts analytics overview --days 28
bun src/cli.ts analytics pages --days 28
bun src/cli.ts analytics sources --days 28
bun src/cli.ts analytics engagement --days 28
bun src/cli.ts analytics adsense --days 28
```

A data de agendamento acima é ilustrativa: confira que ainda é futura no momento da execução.

## IA principal e fallback

A CLI usa **Codex CLI como principal**, reutilizando o login ChatGPT salvo na máquina. Não solicita `OPENAI_API_KEY`, não chama diretamente a API OpenAI e não lê/copia os tokens do Codex. O processo filho remove overrides `OPENAI_API_KEY` e `CODEX_API_KEY` e exige que `codex login status` indique ChatGPT. Uma configuração anterior com `DOUGSEO_AI_PROVIDER=openai` deve ser alterada para `codex`.

```dotenv
DOUGSEO_AI_PROVIDER=codex
DOUGSEO_AI_FALLBACK=ollama
DOUGSEO_CODEX_BIN=codex
# Opcional: se omitido, usa o modelo configurado no Codex CLI.
# DOUGSEO_CODEX_MODEL=seu-modelo
DOUGSEO_CODEX_TIMEOUT_MS=180000
DOUGSEO_OLLAMA_EMBEDDING_MODEL=nomic-embed-text
OLLAMA_HOST=http://localhost:11434
DOUGSEO_AI_TIMEOUT_MS=15000
```

`DOUGSEO_AI_PROVIDER`: `codex|ollama`. `DOUGSEO_AI_FALLBACK`: `ollama|none`. Com Ollama como principal e fallback omitido, roda somente local. Para autenticação, use `codex login` na máquina e confira `codex login status`. `doctor` verifica esse estado e mostra a configuração; não certifica que uma chamada de inferência terá sucesso. O login usa os limites da conta Codex/ChatGPT.

```bash
npm run dougseo -- doctor
npm run dougseo -- --ai-provider codex --ai-fallback none intent check --category Games --subject "Meta Quest 4" --intent "estado do anúncio oficial"
npm run dougseo -- --ai-provider ollama --ai-fallback none intent check --category Games --subject "Meta Quest 4" --intent "estado do anúncio oficial"
```

Opções globais sobrescrevem o ambiente naquela execução. O caminho em `DOUGSEO_CODEX_BIN` é um executável, não um comando shell. `DOUGSEO_CODEX_TIMEOUT_MS` limita o processo Codex completo; `DOUGSEO_AI_TIMEOUT_MS` limita cada requisição Ollama. Instale o modelo local com `ollama pull nomic-embed-text` se quiser o fallback.

`intent check` faz as verificações exatas em todas as categorias. Em seguida, o Codex recebe assunto/intenção e inventário com título, categoria, assunto, intenção e até 350 caracteres do corpo por artigo. Usa `codex exec` em diretório temporário, sandbox `read-only`, sessão efêmera e JSON Schema; não modifica posts. Cada candidato retornado é validado contra o inventário. A avaliação textual identifica intenção equivalente ou relacionada com justificativa, sem inventar porcentagem de similaridade. Possível intenção equivalente retorna conflito (`ok: false`) para revisão; intenção relacionada retorna aviso. O modelo não fornece embeddings.

Se o Codex falhar, o fallback Ollama compara embeddings em todas as categorias. Cache local separado por modelo/endpoint e invalidado por mudanças no título, assunto, intenção ou trecho do corpo. Não há mistura de vetores com resultados do Codex. O corte 0,82 do Ollama continua uma heurística que precisa ser avaliada para cada modelo.

Se nenhum provedor concluir, o JSON contém aviso de indisponibilidade. As verificações exatas continuam funcionando; `ok: true` não certifica ausência de duplicação semântica. As análises por trechos exigem revisão manual dos candidatos. `post create --with-ai` permanece um scaffold: essa opção ainda não gera nem pesquisa um artigo. Configurar IA não publica posts.

Referência: [modo não interativo do Codex](https://learn.chatgpt.com/docs/non-interactive-mode).

## Google Search Console

O fluxo padrao usa service account e renova o access token automaticamente. Isso evita depender de token manual expirado.
O comando `search-console performance` consulta clicks, impressions, CTR, position, queries e pages do periodo recente.

Variaveis aceitas no `.env` da raiz do repo:

```bash
GSC_SITE_URL=https://www.dougdesign.com.br/
GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON_B64=...

# GA4 usa a mesma service account, adicionada como Visualizador na propriedade.
GA4_PROPERTY_ID=370923251 # propriedade conferida em 29/09/2026; verificar antes de usar
GOOGLE_APPLICATION_CREDENTIALS=private-keys/service-account.json
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


## Limites e cuidados operacionais

Estes comportamentos foram conferidos no código em 29/09/2026; revise a documentação se mudar a implementação:

- `inventory stats` lê snapshot existente; `inventory build` atualiza artefatos locais.
- `intent check` usa igualdade de metadados na categoria e, quando configurada, busca semântica. Revise legados e outras categorias manualmente; `ok: true` não prova intenção inédita.
- `post create --with-ai` ainda faz scaffold. Scaffold usa cabeçalhos de notícia e H1; substitua corpo/placeholders, escolha tipo adequado e remova H1 duplicada antes de publicar.
- `post update` adiciona fontes e altera `updatedDate`; não reescreve nem verifica conteúdo. Mantenha a data anterior em mudanças cosméticas.
- `audit` aplica requisitos/score adicionais apenas a drafts/agendados não marcados `legado-importado`. Revise manualmente publicados e legados com o mesmo padrão editorial; score não valida fatos.
- `cover generate --svg <path>` recebe caminho relativo ao diretório de execução. `--html` é compatibilidade; não muda o gerador para HTML.
- `publish` altera estado local e updatedDate, sem corrigir pubDate futura nem verificar deploy. `schedule` marca draft e aceita data sem validação: confira ISO futuro/fuso. Não reagende URL publicada para revisar.
- `queue list` lista somente vencidos. `queue run` promove todos os vencidos, sem nova pesquisa factual; só coloque na fila artigos prontos.
- **`--commit` e `--push` têm o mesmo efeito atual: commit + push para `origin/master`, incluindo `git add .`.** Prefira Git explícito com paths selecionados para evitar alterações alheias.
- `search-console inspect` é consulta de índice, não teste ao vivo nem solicitação de indexação. Solicite na interface quando necessário após deploy; não há submissor genérico de posts pela Indexing API nesta CLI.
- Comandos `analytics overview|pages|sources|engagement|performance` atualmente retornam o mesmo conjunto de relatórios GA4; `adsense` acrescenta métricas de publisher quando a integração permite. Não substitui receita finalizada/pagamentos do AdSense.
- Falta de credenciais pode ser contornada pela interface autenticada autorizada, sem extrair cookies/tokens. Não commite `.env`, chaves ou tokens; base64 não é criptografia.

O workflow real é `.github/workflows/editorial-scheduled-publish.yml`, com cron a cada 10 minutos e promoção em `master`. Execução e deploy podem atrasar; confirme workflow/push antes de declarar agendamento ativo.
