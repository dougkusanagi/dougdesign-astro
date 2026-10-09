# 10. Fontes e armadilhas conhecidas

Aprendizados operacionais que mudam decisões. Acrescente aqui o que descobrir durante uma rodada, com data, em vez de inflar `AGENTS.md`.

## Busca e medição

- **Atraso do Search Console.** Os dados finais chegam com 2 a 3 dias de atraso. Uma mudança só pode ser lida com cerca de 7 dias de dados depois dela, ou seja, uns 10 dias após o deploy. O `dougseo brief` já desconta isso.
- **Duas propriedades.** A propriedade `www` só tem dados a partir de 04/09/2026. Páginas que o Google rastreou antes, com canonical sem `www`, aparecem na propriedade `https://dougdesign.com.br/`. Em 08/10, ela respondia por 16 dos 86 cliques de 28 dias (19%). O brief soma as duas; um relatório só da `www` subconta o tráfego. Na amostra aleatória de 25 legados de 08/10: 11 indexados, 7 como “página alternativa” com canonical antigo, 5 “detectada, mas não indexada” e 2 desconhecidos.
- **Consultas anonimizadas.** Em 08/10, as consultas visíveis cobriam cerca de 42% das impressões por página. Uma página com muitas impressões pode ter poucas consultas listadas.
- **CTR baixo em posição boa (hipótese).** Em 08/10, consultas de “existe/rumor” (“super mario odyssey 2”, posição 4–5) tinham CTR abaixo de 1%. Causa provável: a busca já responde na página de resultados (AI Overview). Guias que exigem ação (calendário, requisitos, preço em reais, passo a passo) tendem a gerar mais clique que “o que se sabe sobre X”. Confirme com a seção 4 do brief antes de tratar como regra.
- **URLs com `#âncora`** no GSC são links para seções da página. O brief as soma à página.
- **Descoberta lenta.** Em 08/10, posts de 01/10 a 07/10 ainda eram “URL desconhecida” para o Google, embora estivessem no sitemap e na home. O sitemap não tinha `lastmod` e o Google o baixou pela última vez em 02/10. Desde então o sitemap traz `lastmod`. Reenvie com `dougseo search-console sitemap --submit` após cada deploy relevante e dê links de entrada a partir de páginas que já recebem impressões.
- **GA4 subconta.** Com o Consent Mode, o GA4 registra pouco de quem não aceita cookies: 32 sessões orgânicas contra 86 cliques do GSC em 28 dias (08/10). Use o GSC para volume.
- **Visitas próprias.** De 29/09 a 02/10, dias de revisão intensa, o GA4 registrou um pico de acessos diretos; a home teve 85 das 147 visualizações de 28 dias. É provável que sejam visitas do dono ou de agentes com navegador. Desde 08/10 existe `?interno=1`; leituras anteriores do GA4 devem descontar esse período.
- **AdSense fora do GA4.** As métricas de anúncio no GA4 voltam zeradas porque não há vínculo AdSense–GA4. A métrica de receita na Data API é `totalAdRevenue` (`publisherAdRevenue` não existe).
- **404 com impressões.** O brief lista na seção 6 URLs com impressões sem post. Em 08/10, duas tinham equivalente de mesma intenção e ganharam redirect 301 (`vercel.json`). Redirecione só para destino equivalente.

- **Consulta em inglês, leitor brasileiro.** A busca que mais trazia a página da Steam era “steam sales 2026”, e o preenchimento automático dela vem em inglês mesmo no Google brasileiro. Em português, quem busca o mesmo digita “promoção steam 2026 datas”, “próxima promoção steam” e “quando começa promoção steam”. Pesquise as duas formas com `dougseo keywords` e escreva em português natural (09/10).
- **Preenchimento automático** (`suggestqueries.google.com`) é público, mas não oficial: o `dougseo keywords` faz cerca de 10 consultas por tema, com pausa entre elas. Não o rode em laço nem para dezenas de temas seguidos.

## Fontes primárias

- **Steam:** as páginas de jogos exigem verificação de idade, um formulário que não deve ser preenchido. Use a API pública: `https://store.steampowered.com/api/appdetails?appids=<id>&cc=br&l=brazilian` traz preço em reais, edições, requisitos e idiomas, e `.../api/storesearch/?term=<nome>&cc=br&l=brazilian` encontra o id.
  - No campo de idiomas, só o asterisco colado ao idioma indica áudio completo; o asterisco depois do último idioma é a legenda.
  - A Steam Brasil costuma mostrar a data de lançamento um dia antes da anunciada. Registre a divergência sem afirmar a causa.
- **Lojas de console:** Rockstar, Xbox e PlayStation exigem navegador para mostrar preço. Os comunicados do MCom exigiram autenticação em 08/10; nesse caso, use a imprensa e registre o limite.
- **Ferramentas de leitura:** o WebFetch falhou em callofduty.com e no site da Saber (07/10). Registre a lacuna em vez de inferir.
- **Clusters desatualizados** (GTA 6, assinaturas, portáteis) traziam datas e planos antigos. Leia a página oficial antes de escrever e dê a cada URL uma pergunta distinta.
- **Legado importado** traz afirmações sem fonte e “testes” que nunca ocorreram. Antes de reescrever, abra a fonte primária; a URL citada no post pode estar quebrada.

## Frontmatter, auditoria e Git

- Use aspas em `title`, `assunto`, `intencao_busca` e `keyword_principal` quando houver `:`; sem elas, o build quebra. `meta_description` tem no máximo 160 caracteres.
- `pubDate` no futuro em post publicado faz o audit tratá-lo como não publicado e acusar link interno quebrado. Use um horário que já passou. O mesmo vale para `updatedDate`: o lote de 08/10 gravou 21:30 e 21:40 num commit das 20:09. Use a hora real da mudança, porque o sitemap usa essa data como `lastmod`.
- `dougseo audit` só falha por posts revisados; `canibalizacao.status: legado-importado` aparece como dívida em resumo. Ao revisar um post, troque o status para `revisado` e mantenha `internal_links.to` igual aos links do corpo.
- **Gate do push:** não encadeie `audit | sed && git push`, porque o pipe esconde a falha. Use `audit | grep -q '"ok": true' && ...`.
- O CI (`.github/workflows/test.yml`) roda typecheck da CLI, testes unitários, audit, build e E2E em PR e em `master`.

## Capas

- O `codex exec` gera imagens (`image_generation`; saída em `~/.codex/generated_images/<sessão>/exec-*.png`), e `scripts/codex-cover.sh` cuida do recorte.
- **Gere uma capa por vez.** Em 08/10, duas execuções em paralelo devolveram a mesma imagem.
- Cartões feitos por script (Python/PIL) são só fallback. Não use SVG como capa, porque `og:image` em SVG não aparece em redes sociais.

## Anúncios, afiliados e indexação

- Os anúncios carregam sem depender do banner de cookies; o consentimento só controla a personalização (a mensagem europeia do AdSense cobre EEE, Reino Unido e Suíça). O AdSense devolve `unfill-optimized` além de `unfilled`, e os dois recolhem o espaço. Mudar formatos automáticos do AdSense é decisão do dono.
- **Visita interna:** `?interno=1` grava no navegador que a visita é do dono, e o site deixa de carregar a tag do Google e os anúncios; `?interno=0` desfaz. Use em todo navegador do dono e antes de qualquer verificação manual.
- **Amazon:** `src/lib/gear.ts` lista produtos reais sem preço. A tag `AMAZON_ASSOCIATE_TAG` é `douglopesreal-20` (informada pelo dono em 01/10/2026); confirme que a conta de Associado está ativa.
- O IndexNow roda após cada deploy (`scripts/indexnow.mjs`). O host canônico é `www`; Bing e Search Console são propriedades separadas.

## Outros sites do dono

- **Blogger (visualoficial.blogspot.com):** o visual vem do CSS em Tema > Personalizar > Avançado > Adicionar CSS (reversível; não há cópia do XML do tema original). Os painéis do Blogger e do AdSense só renderizam depois de um screenshot; use `find` e clique por referência.
