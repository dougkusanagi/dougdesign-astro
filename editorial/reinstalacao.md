# Reinstalação do ambiente

O que um agente precisa para voltar a operar o blog numa máquina ou instalação nova. Nenhum segredo fica no Git; o único arquivo que o dono precisa guardar fora do repositório é o `.env` da raiz.

## 1. Arquivo que o dono guarda: `.env` da raiz

Guarde uma cópia integral num gerenciador de senhas ou cofre. Variáveis:

| Variável | Segredo? | Valor ou função |
|---|---|---|
| `GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON_B64` | **sim** | Chave JSON, em base64, da service account `acesso-ia@practical-bolt-487300-j1.iam.gserviceaccount.com`. Dá acesso ao Search Console e ao GA4. |
| `GSC_SITE_URL` | não | `https://www.dougdesign.com.br/` |
| `GA4_PROPERTY_ID` | não | `370923251` |
| `GOOGLE_APPLICATION_CREDENTIALS` | não | `private-keys/service-account.json`. Alternativa ao base64 (a pasta é ignorada pelo Git); hoje o arquivo não existe e o base64 tem prioridade. |
| `GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN` | — | Deixe vazio. Preenchido, substitui a service account por um token que expira. |
| `GSC_EXTRA_SITE_URLS` | não | Opcional. Sem ela, o brief soma a variante sem `www`. |
| `DOUGSEO_AI_PROVIDER`, `DOUGSEO_AI_FALLBACK`, `DOUGSEO_CODEX_BIN`, `DOUGSEO_CODEX_TIMEOUT_MS`, `DOUGSEO_AI_TIMEOUT_MS`, `DOUGSEO_OLLAMA_EMBEDDING_MODEL`, `DOUGSEO_OLLAMA_CHAT_MODEL`, `OLLAMA_HOST` | não | Configuração da CLI; valores de referência em `tools/dougseo-cli/README.md`. |

**Se a chave se perder:** no Google Cloud, abra o projeto `practical-bolt-487300-j1` e vá em IAM e administrador > Contas de serviço > `acesso-ia` > Chaves > Adicionar chave > JSON. Converta o arquivo para base64 (`base64 -w0 chave.json`) e cole o resultado na variável. Os acessos abaixo continuam valendo, porque pertencem ao e-mail da service account, não à chave. Apague as chaves antigas que não usar mais.

## 2. Logins que o dono refaz

Não copie tokens entre máquinas; faça login de novo:

- `gh auth login` (conta `dougkusanagi`).
- `codex login` com ChatGPT; confira com `codex login status`. Necessário para `scripts/codex-cover.sh` e para o `intent check`.
- Claude Code e a extensão Claude in Chrome: login normal.

O deploy é feito pela integração Vercel–GitHub e o IndexNow usa uma chave pública versionada; nenhum dos dois precisa de token local.

## 3. Acessos já concedidos (refazer só se a service account mudar)

- **Google Cloud:** projeto `practical-bolt-487300-j1` (nome “google-oauth”, número 826908512224), com a Google Search Console API e a Google Analytics Data API ativadas.
- **Search Console:** a service account é usuária **completa** em `https://www.dougdesign.com.br/` e em `https://dougdesign.com.br/`.
- **GA4:** a service account tem a função **Leitor** na propriedade 370923251 (“dougdesign.com.br - GA4”).
- **AdSense:** não está vinculado ao GA4; a receita só aparece no painel do AdSense.

## 4. Verificar

```bash
npm install
(cd tools/dougseo-cli && bun install)
npm run dougseo -- doctor
npm run dougseo -- brief --no-inspect
npm run dougseo -- analytics overview --days 7
```

O brief deve listar as duas propriedades do Search Console e uma linha do GA4 sem erro.

## 5. Tarefa agendada `blog-trafego-diario`

Recrie no Claude Code (Tarefas agendadas) com:

- Título: “Diário: trazer mais visitantes ao blog”.
- Agenda: todo dia às 09:00, horário local (cron `0 9 * * *`).
- Descrição: “Rodada diária guiada pelo dougseo brief: até 8 ações com evidência (máx. 3 posts novos), PR e merge em master”.
- Prompt (troque o caminho se o repositório mudar de lugar):

```text
Projeto: /home/silver/sites/dougdesign-astro (blog Astro; repo dougkusanagi/dougdesign-astro; branch principal master). Execução autônoma e diária; o dono não está presente. Objetivo: mais cliques orgânicos (métrica: cliques do Google por semana no Search Console), não mais posts.

1. Atualize o master (`git fetch && git checkout master && git pull --ff-only`) e siga à risca `editorial/rotina-diaria.md`. As regras gerais e a ordem de prioridade estão em `AGENTS.md` (o CLAUDE.md o importa).
2. Comece sempre por `npm run dougseo -- brief` e decida a partir dele e de `editorial/pautas.md`. Não leia os JSON de `editorial/reports/` nem `editorial/historico/` para planejar; leia os documentos de `editorial/docs/` só na etapa que pedir.
3. Lote: até 8 ações de URL, no máximo 3 posts novos, cada uma com evidência registrada. URLs marcadas com ⏸ no brief ficam de fora, salvo erro factual. Uma rodada sem evidência pode terminar só com medição e correções.
4. Ao final, sempre abra o PR (`gh pr create --repo dougkusanagi/dougdesign-astro --base master`) e faça o merge (`gh pr merge --squash --delete-branch`) quando audit, build e checks passarem; senão, deixe o PR como rascunho com o bloqueio descrito. Depois do merge, verifique o deploy com curl (sem navegador) e rode `npm run dougseo -- search-console sitemap --submit`.
5. Registre a rodada em `editorial/historico/AAAA-MM.md` (seção curta) e termine com o resumo pedido na rotina.
```

Depois de criar a tarefa, use “Executar agora” uma vez com o dono presente, para aprovar as ferramentas que ela usa.

## 6. Navegadores

Em cada navegador ou aparelho novo do dono, abra `https://www.dougdesign.com.br/?interno=1` uma vez, para que as visitas não entrem no GA4 nem carreguem anúncios.
