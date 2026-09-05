# Auditoria da queda após migração — 5 de setembro de 2026

## Conclusão

A evidência aponta para uma combinação de mudança de medição, desaparecimento de um pico de tráfego Direct pouco engajado e problemas concretos de configuração. Não permite atribuir toda a queda ao Astro, à Vercel ou a uma penalização do Google.

O diagnóstico foi concluído antes da implementação. Nesta mesma rodada, as correções técnicas descritas abaixo foram aplicadas no checkout baseado em `origin/master`; a configuração da conta do Google e o acesso ao Search Console continuam dependendo do painel externo. A verificação final após o commit `3ee4df5` confirmou 620 páginas geradas, um H1 por página e os redirects principais respondendo em produção.

## Dados lidos no GA4

Propriedade 370923251, relatório Aquisição de tráfego, todos os usuários. São sessões, não usuários ativos (a métrica da imagem).

| Métrica | 5–11 julho 2026 | 12–18 julho 2026 |
|---|---:|---:|
| Sessões totais | 156 | 20 |
| Direct | 130 | 5 |
| Organic Search | 25 | 13 |
| Sessões engajadas totais | 22 | 10 |
| Taxa de engajamento total | 14,1% | 50% |
| Engajamento médio por sessão | 4 s | 14 s |
| Eventos por sessão | 3,25 | 9,85 |

Na semana do pico, Direct representou 83,33% das sessões, com 3,85% de engajamento e 0 s de engajamento médio (valor exibido/arredondado no GA4). A redução de Direct responde por 125 das 136 sessões perdidas entre as semanas, ou 91,9% da queda líquida total. Isso não prova bots: testes, automação, acessos humanos sem referência e falhas de atribuição são hipóteses a investigar.

De 8 de agosto a 4 de setembro, o mesmo relatório registra 30 sessões, 26 Organic Search, 2 Direct, 1 AI Assistant e 1 Unassigned. Não comparar o total desse intervalo de 28 dias diretamente com uma semana.

A imagem agrega o ponto destacado de 5 a 11 de julho: 146 usuários ativos na semana, não 146 visitas em um único dia.

## Mudança de medição comprovada no histórico

Commit `12ccdc1`, de 10/07/2026 às 14:56:37 -0300, em `src/layouts/Layout.astro`:

- `hasMarketingConsent()` deixou de retornar `true` e passou a exigir aceite em localStorage.
- Foi introduzido `hasAdsConsent()` e um retorno antecipado em `initAdSense()` para quem não aceitou.
- Foram adicionados eventos de profundidade de rolagem; outro commit do mesmo dia adicionou eventos de desempenho. A contagem de eventos antes/depois também não representa uma série homogênea.

O HTML servido no momento do diagnóstico continha esse bloqueio. Quem não aceitava ou ignorava o banner não carregava a tag do Analytics. O checkout atual usa Consent Mode avançado: envia os sinais agregados permitidos sem gravar cookies antes da escolha e habilita a medição completa somente depois da autorização. A coincidência temporal é forte, mas sem dados independentes não é possível quantificar quanto da queda foi submedição.

O repositório registra a importação para Astro em 22/06/2026. Data de commit não comprova a data de troca do domínio/deploy. A mudança de 10/07 é posterior à implementação inicial e coincide mais de perto com o corte mostrado no gráfico.

## Defeito adicional de AdSense

O evento `doug:consent-granted` chama `bootMarketing` no Layout, que carrega Analytics e Tally, mas não chama `initAdSense`. Os componentes AdSense apenas adicionam itens à fila `adsbygoogle`; eles não carregam a biblioteca externa.

Reprodução isolada do script extraído do HTML publicado, executada em Node com DOM simulado e sem enviar eventos reais:

- Visita nova sem consentimento: nenhuma biblioteca carregada.
- Aceitar cookies na mesma página: carregamentos de Tally e gtag; nenhum carregamento de `adsbygoogle.js`.

No fluxo examinado, o carregamento do AdSense fica para uma nova carga de página/navegação que dispare sua inicialização. É um defeito separado da escolha de exigir consentimento e deve ser corrigido mantendo as escolhas do visitante. A reprodução valida o encadeamento de inicialização; não mede preenchimento de anúncios, receita ou bloqueio por extensões em navegadores reais.

## Canonical e domínio publicado

Confirmado por HTTP em produção no momento da auditoria:

- `https://dougdesign.com.br/` retorna 308 para `https://www.dougdesign.com.br/`.
- A página final respondia 200 e declarava canonical `https://dougdesign.com.br/`.
- O sitemap declarava URLs sem www e o robots.txt apontava para o sitemap sem www.
- `astro.config.mjs` e `src/components/SEO.astro` usavam o domínio sem www.

Eram sinais contraditórios de consolidação. A correção adotou `https://www.dougdesign.com.br` como host final e alinhou redirects, canonical, sitemap, links e dados estruturados; o host sem `www` retorna 308 e o host com `www` responde 200. Não há prova de que o conflito histórico explique sozinho a queda.

## URLs legadas

Fonte: `C:/Users/dl_ag/dev/dougdesign-seo/content/snapshots/wp-json/posts.json`, filtrada por `status: publish`.

- 441 URLs publicadas examinadas por GET, seguindo redirects.
- 440 terminaram em HTTP 200; uma terminou em 404.
- Nenhuma meta noindex detectada no HTML das respostas examinadas.
- Sitemap atual: 620 URLs, incluindo páginas que não são artigos.
- 434 caminhos legados constam diretamente no sitemap; dos sete restantes, seis redirecionam para páginas válidas.

404 confirmado: `https://dougdesign.com.br/gamescom-latam-2026-recorde-impacto-brasil-2/`.

As listas detalhadas foram geradas como artefatos locais de auditoria e não fazem parte do deploy. O snapshot é uma base parcial histórica, não garantia de que todas as URLs que já existiram no WordPress foram examinadas. HTTP 200 não comprova equivalência integral de conteúdo nem indexação.

Robots.txt permite rastreamento. Sitemap e ads.txt respondem 200 após resolução do host. O artigo que liderava o relatório histórico de Search Console ainda responde 200.

## Search Console: evidência e limite

Os comandos locais de performance GA4/GSC falharam por ausência de credencial de service account configurada. O Analytics foi acessado pelo navegador já autenticado. No Search Console, a conta atual não tinha acesso à propriedade de domínio e o seletor mostrava `https://dougdesign.com.br/` na seção Não verificado. Isso limita esta auditoria; não significa que o site não esteja indexado ou que outra conta não tenha acesso.

Foi possível ler o relatório local `editorial/reports/search-console-performance-2026-07-10T16-32-49-693Z.json`: período nominal 13/06–10/07, com linhas diárias disponíveis até 08/07; 79 cliques e 3.222 impressões. Uma única URL, de PS Plus de julho, recebeu 40 cliques (50,6%). O tráfego orgânico disponível já tinha forte concentração em assunto mensal. A série diária mostra enfraquecimento antes de 10/07; portanto não é correto atribuir toda a dificuldade orgânica à mudança de consentimento.

Não obtivemos a série atual completa de cliques, impressões, indexação e canonical escolhido pelo Google após julho. Não é possível separar quantitativamente perda real de busca, sazonalidade e submedição com os dados disponíveis.

## Correções aplicadas no checkout

- host público consolidado em `https://www.dougdesign.com.br`, incluindo canonical, Open Graph, JSON-LD, RSS, sitemap e robots;
- links internos dos posts atualizados para o host canônico;
- redirect permanente da URL legada `gamescom-latam-2026-recorde-impacto-brasil-2`;
- Google tag carregada com Consent Mode avançado, pageview manual sem duplicação e eventos de engajamento somente após autorização;
- AdSense carregado e inicializado somente após autorização, inclusive para anúncios inseridos depois da primeira renderização;
- botão de revisão de cookies no rodapé e política de privacidade alinhada ao fluxo real.
- títulos H1 duplicados removidos do conteúdo importado, mantendo um H1 estrutural por página;
- newsletter convertida em CTA honesto para RSS e contato convertido em fluxo `mailto`, sem mensagens falsas de sucesso;
- carregador do LivePix tornado idempotente e resultados da busca do arquivo escapados antes de entrar no DOM;
- documentação de componentes rebaixada para H2 sob o H1 da página.

## Próximos passos fora do repositório

1. Validar no GA4 DebugView e no AdSense, após o deploy, uma visita nova, recusa, aceite, navegação e recarga. Confirmar que `GT-WPDGLZ6` aponta para a propriedade 370923251.
2. Registrar uma anotação de ruptura em 10/07 e comparar janelas equivalentes no GA4 e no Search Console. Não preencher o período perdido retroativamente nem forçar consentimento como aceito.
3. Recuperar o acesso à propriedade correta do Search Console e conferir indexação, canonical escolhido pelo Google, consultas, dispositivos, países e páginas que desapareceram.
4. Concentrar a produção em conteúdo com demanda demonstrada e atualizar URLs que já recebiam cliques. Evitar usar cinco publicações diárias como indicador de sucesso. Para conteúdo temporal, medir também a expiração natural do interesse. Para tutoriais/reviews, exigir exemplos, evidências e experiência verificável.

O checkout usado nesta rodada foi reconciliado com `origin/master` antes das alterações. A home publicada mostrava artigos de 31/07; nenhum post novo foi criado nem houve revisão editorial de pauta. O conteúdo existente foi preservado, com ajustes mecânicos de host, links internos, headings importados e um bloco de código Markdown que estava malformado.

## Referências oficiais

- [Google: consent mode](https://developers.google.com/tag-platform/security/concepts/consent-mode) — diferenças de coleta conforme consentimento; não promete recuperar dados históricos nem garante modelagem para este volume.
- [Google: consolidação de URLs canônicas](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
- [Google: migrações de site](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes).
- [Google: conteúdo útil e confiável](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

Nenhum post novo foi criado, atualizado editorialmente, publicado ou agendado nesta rodada; as alterações nos arquivos de posts foram normalizações mecânicas de SEO e formatação.
