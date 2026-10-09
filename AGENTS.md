# Instruções para agentes

Este arquivo vale para Codex, Claude e qualquer outro agente (o `CLAUDE.md` importa este arquivo). Guarda só regras; aprendizados vão para `editorial/docs/10-fontes-e-armadilhas.md` ou para o documento da etapa.

## Objetivo e métrica

O blog existe para gerar receita de AdSense com tráfego orgânico, sem perder a confiança do leitor. A métrica principal é **cliques do Google por semana** (Search Console, propriedade `https://www.dougdesign.com.br/`, dados finais). Métricas de apoio: CTR das páginas com 100+ impressões, posts novos indexados em até 7 dias e número de URLs com pelo menos 1 clique. Quantidade de posts produzidos é esforço, não resultado.

## Rotina

A rodada diária segue `editorial/rotina-diaria.md` e começa com `npm run dougseo -- brief`. O brief cruza Search Console, Git e inventário e devolve, em Markdown curto, a fila sugerida, a canibalização, o efeito das mudanças anteriores e o estado dos posts novos. Não abra os JSON de `editorial/reports/` para planejar.

## Como decidir

Siga esta ordem de prioridade:

1. **Erro factual** em URL publicada: corrija sempre, mesmo durante o período de observação.
2. **Fila sugerida do brief** (seção 0): URLs com impressões cujo título, descrição ou resposta não atendem à consulta real. Ajuste o título e a descrição à consulta e reforce a seção que a responde. Reescreva o texto se a resposta estiver fraca ou desatualizada.
3. **Descoberta**: se o Google ainda não reconhece um post novo 3 dias depois de publicado, acrescente links de entrada a partir de páginas com impressões e reenvie o sitemap.
4. **Canibalização com evidência**: quando a segunda URL tem 10+ impressões na mesma consulta, diferencie as intenções. Consolide com redirect 301 só depois de comparar os textos.
5. **Post novo, só com sinal de demanda**: consulta no GSC sem página adequada, lançamento ou evento com data confirmada, ou dúvida complementar de um cluster que já recebe impressões. Registre o sinal no relatório da rodada. Sem sinal, não abra URL.

Orçamento por rodada: até 8 ações de URL, na ordem acima, sendo no máximo 3 posts novos. Uma rodada sem pauta com evidência pode terminar só com medição e correções; isso é resultado válido. Pedido explícito do dono prevalece.

**Período de observação:** depois de alterar uma URL, espere 14 dias antes de mexer nela de novo, salvo erro factual. O brief marca essas URLs com ⏸ e mede o efeito na seção 4. Julgue pelos números dessa seção, não por impressão.

Não reescreva legado sem impressões só para reduzir a dívida da auditoria. Retirar legado do índice ou consolidá-lo em lote é decisão do dono. O brief (seção 6) conta os legados sem impressão nas duas propriedades; leve esse número ao dono em vez de agir.

## Regras fixas

- **Fatos antes de estilo.** Abra a fonte primária durante a execução. Nunca invente preço, data, especificação, catálogo, teste, benchmark ou experiência pessoal, nem transforme rumor em anúncio. Registre o que foi verificado e os limites da apuração.
- **Uma intenção, uma URL.** Rode `dougseo intent check` e revise os candidatos, inclusive de outras categorias, antes de criar. Mesmo assunto com a mesma intenção significa atualizar a URL existente; `ok: true` da CLI não prova ausência de duplicação.
- **Datas e URLs.** Preserve `slug` e `pubDate` de posts publicados. Altere `updatedDate` só em mudança substancial. `pubDate` de post publicado nunca fica no futuro. Não tire do ar nem reagende uma URL publicada para revisá-la.
- **Título e descrição** não prometem mais do que as fontes sustentam. Evite clichês como “vital”, “essencial”, “revolucionar”, “divisor de águas”, “mergulhar” e “no cenário atual”, além de resumos genéricos e blocos de importação.
- **Capas novas** saem de `scripts/codex-cover.sh <slug> "<cena>"`, uma por vez, sem texto, logotipos, marcas ou arte oficial. Inspecione a imagem e registre o prompt e o alt (`editorial/docs/07-imagens-e-capas.md`).
- **Score da CLI não certifica fatos.** Revise manualmente cada post alterado e mantenha o site leve no celular.
- **Limites de autonomia.** Não reintroduza automação do WordPress. Não envie mensagens nem divulgação, não aceite termos e não crie contas em nome do dono. Também não peça de novo autorização para trabalho já autorizado.

## Verificação e fechamento

- **Gate local:** `npm run dougseo -- audit | grep -q '"ok": true'` e `npm run build`. Se mexeu em código, rode também `npm run test:unit` e `bun run typecheck` em `tools/dougseo-cli`. O CI (`.github/workflows/test.yml`) repete esses portões no PR.
- **Git:** crie um branch e faça commits apenas com os arquivos alterados (nunca `git add -A` ou `git add .`, porque o working tree tem alterações antigas de modo de arquivo). Abra o PR para `master` e faça o merge com o CI verde.
- **Produção:** verifique com `curl` (HTTP, `<title>`, canonical). Para abrir o site num navegador, visite antes `https://www.dougdesign.com.br/?interno=1` nesse navegador. Assim a visita não entra no GA4 e os anúncios não carregam. `?interno=0` desfaz.
- **Depois do deploy** com post novo ou mudança relevante, rode `npm run dougseo -- search-console sitemap --submit`. O IndexNow (Bing) roda sozinho no GitHub Actions.
- **Fechamento:** liste as URLs criadas e atualizadas com o estado comprovado (rascunho, agendado, deploy pendente ou ao vivo), as datas com fuso e o que não foi verificado. Registre a rodada em `editorial/historico/AAAA-MM.md`.

## Onde está o detalhe

Leia apenas o que a etapa pede:

| Etapa | Documento |
|---|---|
| Rodada diária | `editorial/rotina-diaria.md` |
| Planejar e medir | `editorial/docs/09-search-console-e-medicao.md`, skill `editorial/skills/round-planning` |
| Criar post | `editorial/docs/04`, `05` e `06`, skill `new-post` |
| Atualizar post ou título | `editorial/docs/05` e `06`, skill `update-post` |
| Capa | `editorial/docs/07`, skill `cover-generation` |
| Publicar ou agendar | `editorial/docs/08`, skill `publish-or-schedule` |
| Fontes e armadilhas conhecidas (Steam, YAML, Git, anúncios, indexação) | `editorial/docs/10-fontes-e-armadilhas.md` |
| Comandos da CLI | `tools/dougseo-cli/README.md` |
| Princípios e taxonomia | `editorial/docs/01` e `02` |

As instruções do dono prevalecem sobre este arquivo. Planos e relatórios antigos são contexto histórico, não regra.

## Desenvolvimento

Inicie o servidor com `astro dev --background` e gerencie com `astro dev stop`, `astro dev status` e `astro dev logs`. Antes de mexer em rotas, componentes, coleções de conteúdo ou estilos, consulte a [documentação do Astro](https://docs.astro.build).
