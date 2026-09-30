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

Se nenhum provedor concluir, o JSON contém aviso de indisponibilidade. As verificações exatas continuam funcionando; `ok: true` não certifica ausência de duplicação semântica. As análises por trechos exigem revisão manual dos candidatos. `post create --with-ai` gera rascunhos a partir de material fornecido; veja o contrato abaixo. Configurar IA não publica posts.

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


## Geração de rascunhos com fontes

`post create --with-ai` valida intenção antes de escrever, exige um JSON de material de fontes e usa o Codex autenticado. Nunca publica ou agenda o resultado. Sem Codex disponível e com fallback habilitado, tenta `/api/chat` do Ollama, com `DOUGSEO_OLLAMA_CHAT_MODEL` (padrão `qwen3:8b`), separado do modelo de embeddings; instalar o modelo local é responsabilidade do ambiente.

Formato de `fontes.json` (cada `--source` precisa de material correspondente):

```json
[
  {
    "url": "https://fonte-oficial.example/anuncio",
    "consultedAt": "2026-09-30",
    "text": "Trecho ou notas factuais da página realmente consultada, incluindo limites."
  }
]
```

```bash
npm run dougseo -- --ai-provider codex --ai-fallback none post create \
  --category Games --subject "Assunto novo" --intent "Dúvida distinta do leitor" \
  --source https://fonte-oficial.example/anuncio --source-material fontes.json --with-ai
```

Os endereços do exemplo são ilustrativos. A CLI não transforma uma URL em prova nem verifica automaticamente a precisão das notas. O retorno estruturado valida descrição, corpo sem H1/frontmatter, extensão mínima e citações das fontes fornecidas. Links inventados são rejeitados. O arquivo nasce `draft: true`, `scheduled: false`, com `ai_review.status: pendente`. Após revisão factual humana, ajuste esse status para `revisado`, prepare capa/metadados/interlinks e execute audit/build. A auditoria bloqueia publicação enquanto essa revisão estiver pendente. Nenhum score certifica fatos.

## Proteções de escrita e publicação

- `post scaffold` e `post create`: slug apenas com letras minúsculas, números e hífens. Colisão no inventário ou arquivo existente bloqueia a escrita; a criação usa modo exclusivo. O scaffold não inclui H1 no corpo.
- `schedule`: exige ISO futuro com segundos e fuso, rejeita datas inexistentes e artigos publicados. Preserva autoria e `updatedDate`.
- `publish`: rejeita `pubDate` inválida/futura e artigo com issues na auditoria. Preserva autoria, `pubDate` e `updatedDate`; revisão substancial continua exigindo ajuste editorial explícito de `updatedDate`.
- `post update`: adiciona fontes; não reescreve nem altera `updatedDate` ou inventa `fato_novo`.
- `--commit`: commit **local**, somente dos arquivos da operação. `--push`: commit desses arquivos e push para `origin/master`; exige estar em `master`. Alterações staged alheias são preservadas. `queue run --ci` mantém commit + push para a automação.
- `queue run`: audita todos os vencidos antes de promover qualquer arquivo. Falha de auditoria bloqueia a rodada; não promove os artigos parcialmente por erro editorial. A fila não pesquisa notícias novamente.
- `audit --scope all`: valida também publicados e legados, campos editoriais, descrição, H1 fora de blocos de código, placeholders/importação, capa existente e procedência/alt, links Markdown internos e sincronização com `internal_links.to`. Verificação de links é local; não prova HTTP, redirect ou qualidade factual.
- `audit --scope all --slug <slug>` permite revisar uma URL sem ocultar a dívida editorial dos outros arquivos. Um escopo inválido ou slug desconhecido gera erro.

## Limites e cuidados operacionais

- `inventory stats` lê snapshot; `inventory build` atualiza artefatos locais.
- `intent check` cruza metadados entre categorias e a avaliação Codex quando disponível; revise os textos completos e avisos. Trechos não provam intenção inédita.
- A auditoria completa pode revelar pendências antigas que antes eram ignoradas; não marque uma rodada como aprovada se houver issues. Ela não confirma anúncio, preço, catálogo, execução de código ou experiência própria.
- `cover generate --svg <path>` recebe caminho relativo ao diretório de execução. `--html` é compatibilidade. O fallback não substitui revisão visual.
- `queue list` ainda lista somente vencidos; consulte frontmatter/inventário para toda a fila futura.
- `search-console inspect` consulta o índice conhecido; não é teste ao vivo nem submissão de indexação. Não há submissor genérico para posts nesta CLI.
- `analytics overview|pages|sources|engagement|performance` ainda retornam o mesmo conjunto de relatórios GA4. `adsense` acrescenta publisher quando a integração permite, sem substituir pagamentos/ganhos finalizados.
- Sem credenciais de medição, registre a limitação. Não commite `.env`, chaves ou tokens.

O workflow é `.github/workflows/editorial-scheduled-publish.yml`, a cada dez minutos, em `master`; cron, push e deploy podem atrasar. Confira produção antes de declarar uma URL ao vivo.

### Gerador padrão de capas

O fluxo editorial usa o gerador de imagens integrado do Codex (`image_gen`) como padrão, sem API key. Gere na sessão Codex, copie para `src/assets/images/posts/` e registre prompt, alt e caminho no frontmatter. Essa ferramenta não está disponível automaticamente em `codex exec`; `dougseo cover generate` continua sendo apenas o fallback autoral local, não um gerador raster por IA. Antigravity é alternativa quando disponível. Não substituir uma imagem raster solicitada por vetor genérico.
