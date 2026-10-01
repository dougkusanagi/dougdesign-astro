# Plano de tráfego e AdSense — 30/09/2026

Substitui, como ponto de partida, as metas de `PLANO_CRESCIMENTO_MONETIZACAO.md` (13/07) e `editorial/reports/plano-crescimento-organico-adsense-2026-09-29.md`. Os dois continuam valendo como histórico e como calendário editorial; este documento reordena as prioridades com os números lidos hoje nas contas logadas no Chrome.

## 1. Onde estamos (lido em 30/09/2026)

| Fonte | Medida | Valor |
| --- | --- | --- |
| Search Console | Cliques / impressões, 04–28/09 | 65 / 7,97 mil (CTR 0,8%, posição média 7,4) |
| Search Console | Indexação | 327 indexadas, 561 não indexadas |
| Search Console | Motivos de não indexação | 241 redirecionamento, 208 alternativa com canonical, **106 detectada e não indexada**, 3 rastreada e não indexada, 3 × 404 |
| Search Console | Sitemap | 620 URLs processadas |
| GA4 (370923251) | Últimos 30 dias | 48 usuários, 68 visualizações, 60 sessões, 0 eventos principais |
| AdSense | Ganhos, últimos 7 dias | US$ 0,00 |
| AdSense | Alerta "ganhos em risco / ads.txt" | É do **kitonline.com.br** ("Não encontrado"); dougdesign.com.br está "Autorizado" |
| PageSpeed (Lighthouse mobile, produção) | Post ROG Ally / Home | 97 / 73 em uma rodada; SEO, acessibilidade e boas práticas 100 |

Limites destes números: o Search Console só tem dados a partir de 04/09, então "3 meses" não é série histórica. GA4 sofre com consentimento e não é comparável a cliques do Search Console. O RPM de página do AdSense (US$ 0,10–0,97) vem de dias com poucas visualizações e não serve para projetar renda.

Conteúdo: 597 posts, 555 publicados. 497 são `legado-importado`. Por categoria: Games 270, Tecnologia 151, Web Design 58, IA 58, Programação 35.

### O que está gerando impressões

| Página | Cliques | Impressões |
| --- | ---: | ---: |
| Wolverine no PS Plus Extra | 12 | 928 |
| ROG Ally X vs Steam Deck OLED | 10 | 671 |
| Super Mario Odyssey 2 (URL "no-switch-2") | 6 | 1.273 |
| Super Mario Odyssey 2 (segunda URL) | 3 | 105 |
| Galaxy Z Fold 6 | 4 | 92 |
| PS Plus vs Game Pass | 2 | 538 |

Consultas: "super mario odyssey 2" (4 cliques/624 impressões), "mario odyssey 2" (3/344), "meta quest 4" (1/483). Todo o tráfego útil hoje vem de **Games**, e há duas URLs competindo pela mesma dúvida de Mario Odyssey 2.

## 2. Diagnóstico: por que não há renda

Em ordem de impacto:

1. **Volume.** Com ~60 visitas por mês não há renda possível, mesmo com RPM bom. Por mil visualizações, um blog em português costuma ficar na casa de poucos dólares; só esse número medido no seu site vale. A conta a fazer é `visualizações ÷ 1.000 × RPM`, e o primeiro marco realista é 1.000 visualizações/mês, não renda.
2. **Anúncios só carregam após "Aceitar tudo".** `src/layouts/Layout.astro` exige `dougdesign-ads-consent-v1 = accepted` para carregar `adsbygoogle.js`; sem isso `data-ads="off"` e nenhum bloco existe. A maioria dos visitantes ignora o banner, então mesmo 1.000 visitas renderiam muito menos impressões do que 1.000. **Decisão sua**: manter (mais conservador) ou usar a mensagem de consentimento do próprio AdSense (Privacidade e mensagens), que pede consentimento onde a lei exige (EEE/Reino Unido) e serve anúncios ao restante. Isso muda receita e posição jurídica; não alterei nada.
3. **Indexação.** Quase metade do sitemap fica fora do índice e 106 URLs estão "detectadas, não indexadas". Com 497 posts importados antigos e pouco sinal de qualidade, o Google tende a rastrear devagar. Publicar mais sem tratar isso dilui.
4. **Leituras relacionadas fracas.** O layout v2 já tem o bloco "Leituras relacionadas", mas ele escolhia por categoria/cluster (em Games, quase sempre o post mais novo). Em 30/09 passou a pontuar assunto em comum (título, palavra-chave, assunto) e `internal_links.to`. Correção do diagnóstico inicial, que dizia que o bloco não existia.
5. **Mistura de temas.** Games traz as impressões, mas é o nicho de RPM mais baixo e dominado por grandes veículos. Web design/desenvolvimento/IA tem RPM melhor e menos concorrência em português, mas ainda não tem impressões.

PageSpeed não é o gargalo. Seis rodadas locais (com e sem a alteração) deram 97–99 na home; o 73 de produção é uma rodada única com LCP de 5,7 s, dominada por atraso de renderização (1,8 s) com dois `gtag.js` (~310 KB). Testei adiar esses scripts e o ganho ficou dentro do ruído (TBT ~140 ms nos dois casos), então **não alterei**. Reavaliar com PageSpeed Insights quando a cota diária da API voltar e com dados de campo (CrUX) assim que o Search Console tiver tráfego suficiente.

## 3. Plano em três frentes

### A. Medir e destravar (esta semana)
- [ ] Decidir o modelo de consentimento de anúncios (item 2 do diagnóstico).
- [ ] No Search Console, pedir indexação manual (Inspeção de URL) das 10 páginas mais novas com valor e acompanhar as 106 "detectadas, não indexadas" por amostra de exemplos.
- [ ] Criar conta no Bing Webmaster Tools e importar o site do Search Console. Bing alimenta o Copilot e parte da busca do ChatGPT; o GA4 já registra visitas `bing / organic`.
- [ ] Ativar IndexNow no deploy (Bing, Yandex e outros recebem aviso de URL nova).
- [ ] Registrar no AdSense um relatório por site (filtro dougdesign.com.br) toda segunda-feira, junto do GA4 e do Search Console. Corrigir o ads.txt do kitonline.com.br só se o site ainda interessar.

### B. Conteúdo e estrutura (próximas 4 semanas)
1. **Consolidar Mario Odyssey 2:** manter a URL que mais recebe impressões, atualizar com os fatos oficiais, redirecionar a outra (301) e ajustar o título para a dúvida real ("anunciado ou rumor?").
2. **Leituras relacionadas por assunto** (feito em 30/09; ver item 4 do diagnóstico). Falta medir páginas por sessão no GA4 nas próximas semanas.
3. **Triagem do legado:** para cada um dos 497 importados, decidir manter, atualizar, fundir com redirect ou `noindex`, cruzando com `content freshness` e Search Console. Começar pelos com zero impressões.
4. **Foco editorial:** manter Games só onde há fonte oficial e dúvida recorrente (ROG Ally/Steam Deck, PS Plus, Switch 2), e dedicar pelo menos metade das pautas a web design, Penpot/Figma, IA aplicada e desenvolvimento. O guia Figma → Penpot já está preparado.
5. **Reescrever títulos e descrições** das páginas com mais impressões e CTR abaixo de 1%, sem prometer o que o texto não entrega.
6. **Formato para citação por IA:** resposta direta nas primeiras linhas, data de atualização visível, fontes primárias citadas, tabelas de comparação com critérios e autor identificado. O site já tem `llms.txt`, JSON-LD `BlogPosting` e `robots.txt` liberado; acrescentar FAQ curto só onde houver perguntas reais.

### C. Divulgação (contínua, baixo custo)
- **Redes:** vale usar, mas só duas. o X (@douglopesreal) gera visitas (`t.co / referral` aparece no GA4). Somar uma rede de desenvolvimento em português: TabNews, LinkedIn, ou r/brdev e comunidades de Games para os textos de Games. Compartilhar cada post novo com um parágrafo próprio, não só o link.
- **Backlinks de qualidade:** artigos resumidos em TabNews, dev.to ou LinkedIn com link para o original; README e perfil do GitHub (`dougkusanagi`); comunidades do Penpot e do Astro quando o guia for realmente útil. Evitar diretórios pagos e trocas de link em massa (política de spam de links do Google).
- **Blogger (visualoficial.blogspot.com):** ver seção 4.

## 4. O blog Blogger (visualoficial.blogspot.com)

Visto hoje: 58 posts de fev–mar/2023 (ChatGPT, React, Vue, Laravel), entre 38 e 269 visualizações por post no histórico da plataforma, tema escuro padrão, sem relação com o tema atual do Doug Design.

- **Como fonte de backlinks:** valor baixo. O conteúdo é genérico e desatualizado, e 58 links apontando para o dougdesign.com.br parecem esquema de links. Não recomendo criar links em massa.
- **Uso razoável:** escolher de 3 a 5 posts que ainda recebem visitas, atualizar o texto e acrescentar um link contextual natural para um artigo mais completo do Doug Design. Isso também serve ao leitor.
- **Melhoria visual:** dá para fazer. O Blogger permite editar o HTML do tema, e eu consigo alterar pelo Chrome. Seria um tema limpo, com as cores e a tipografia do Doug Design, cabeçalho apontando para o blog principal e rodapé com links. Fica para uma etapa futura, como você sugeriu; é ganho de marca, não de tráfego.
- **AdSense:** o Blogger aparece como "Pronto" na conta (vinculado ao Blogger). Não medi a renda dele; se interessar, dá para ver no relatório "Sites" do AdSense.

## 5. Sobre buscadores de IA

Serve para ser citado, e isso traz pouco clique direto: o usuário costuma ler a resposta pronta. Vale como reconhecimento de marca e para o visitante que segue o link de uma citação. Cada assistente usa uma fonte diferente:

| Assistente | De onde tira fontes | O que fazer |
| --- | --- | --- |
| Gemini e AI Overviews | Índice do Google | Indexação no Search Console; o relatório de recursos de IA já aparece no painel |
| ChatGPT (busca) e Copilot | Em boa parte o índice do Bing (não é a única fonte) | Bing Webmaster Tools + IndexNow |
| Claude (busca na web) | Um provedor de busca externo (não confirmei qual) | Garantir rastreio aberto e páginas claras |
| Perplexity | Rastreador próprio e buscas | `robots.txt` já libera; conteúdo com fonte citada |

`llms.txt` é um padrão ainda sem garantia de uso pelos buscadores. Mantém-se, mas não conta como estratégia.

## 6. Metas e revisão

Metas de trabalho, sem prazo de renda prometido:

- Em 30 dias: 100% das páginas novas indexadas em até 7 dias; "detectadas, não indexadas" abaixo de 80; Bing e IndexNow ativos; "Leia também" no ar.
- Em 60 dias: 500 cliques/mês no Search Console e GA4 com pelo menos 1,3 página por sessão vindo de busca orgânica (hoje ~1,1).
- Em 90 dias: 1.000 visualizações/mês em AdSense com RPM do próprio site medido. Só então estimar renda.

Revisão toda segunda, com as janelas equivalentes de 28 dias do `editorial/docs/09-search-console-e-medicao.md`.

## 7. Feito em 30/09/2026

- Anúncios deixaram de depender do botão "Aceitar tudo"; a mensagem europeia do AdSense para dougdesign.com.br já estava publicada desde 11/2023. Texto do banner e política de privacidade atualizados.
- Removidos de 492 posts os blocos de importação visíveis ("URL publicada:", "Resumo espelhado", "Conteudo espelhado"). Eram 456 publicados com esse texto na página.
- 301 da segunda URL de Super Mario Odyssey 2 para a principal.
- IndexNow: chave em `public/`, `scripts/indexnow.mjs` e workflow após deploy. As 650 URLs foram enviadas uma vez e o sitemap `www` foi enviado ao Bing.
- Bing Webmaster: 54 cliques e 4,1 mil impressões desde 30/06 e **1,8 mil citações em respostas de IA (Copilot)**. Mais citadas: `hardware-2026-requisitos-upgrade` (496), `como-funciona-o-novo-compartilhamento-de-biblioteca-steam-familias-em-2...` (152), `figma-variables-temas-claro-escuro-design-system` (133). Essas páginas merecem revisão factual primeiro.
- Blogger: CSS com a identidade do Doug Design, gadget com links para o blog principal e aviso de atualização com link em 3 posts (Vite, SSR com React, IA no front-end).
- Meta descriptions de PS Plus vs Game Pass e GameShare reescritas. 225 outras publicadas têm descrição truncada ou curta (o Bing também apontou isso); precisam de revisão caso a caso, não de geração em massa.

## 8. Segunda rodada (30/09/2026, noite)

- **Revisão factual dos posts mais citados pelo Copilot** (Bing AI Performance): reescritos com fontes oficiais os de requisitos de PC (496 citações), Steam Famílias (152), Figma Variables (133), Wi-Fi 7 vs 6E (61), Claude Code (60) e Galaxy Z Fold 6 (64). Correções relevantes: "32 GB virou padrão" contrariava a Steam (16 GB = 41,2%, 32 GB = 37,5% em agosto/2026); a regra de VAC no Steam Famílias estava errada e o link de fonte estava quebrado; o Z Fold 6 trazia um relato de "teste de 365 dias" sem evidência, removido. Pendentes da lista de citados: briefing de design (2), Switch 2 (preço/especificações e retrocompatibilidade), RTX 5080 vs 4090, Xbox Quick Resume, tendências de UI/UX 2026 e preço do Steam Deck OLED.
- **Anúncios do site:** `unfill-optimized` passou a ser tratado como sem preenchimento e blocos sem resposta em 10 s recolhem o espaço reservado.
- **Anúncios do Blogger:** formatos overlay (âncora, coluna lateral, vinheta) e multiplex desativados no AdSense; máximo de 6 anúncios in-page e mais distância entre eles; CSS recolhe blocos vazios. A alteração no AdSense pode levar até uma hora para valer.
- **Meta descriptions:** fallback automático em `getMetaDescription` para as cerca de 225 descrições truncadas; o Bing apontava "descrições curtas".
- **Decisão pendente:** o site principal ainda tem anúncios automáticos ativos com 1 de 3 formatos overlay. Não alterei sem pedido.
- **Equipamento recomendado (sidebar):** os 3 itens eram marcadores (fotos do Unsplash, preços inventados, link para a home da Amazon). Foram trocados por 4 produtos reais com ASIN conferido (MX Master 3S, Keychron K2 Max, HyperX QuadCast 2 S, DualSense), sem preço. A conta da Amazon logada **não é uma conta de Associado**; para comissão, inscrever-se em associados.amazon.com.br e preencher `AMAZON_ASSOCIATE_TAG` em `src/lib/gear.ts`. Enquanto a tag estiver vazia, os links são simples e o aviso diz que não há comissão.
- **Auditoria:** `audit` sem `--slug` separa o legado (`legado-importado`) em um resumo e só falha por posts revisados; CI roda typecheck, testes, auditoria, build e E2E no `master`.
