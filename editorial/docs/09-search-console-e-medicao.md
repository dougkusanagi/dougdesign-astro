# 09. Search Console, Analytics e AdSense

## Acesso e identificação

Confirme propriedade e período antes de ler números. Referências observadas em 29/09/2026: GSC `https://www.dougdesign.com.br/`; GA4 `370923251` (“dougdesign.com.br - GA4”); AdSense, domínio `dougdesign.com.br`. Essas referências não substituem conferir a conta atual. Um aviso global pode pertencer a outro domínio.

Com credenciais disponíveis, use `dougseo search-console inspect --latest 20`, `performance --days 28` e `opportunities --days 28 --top 100`. Para GA4, `dougseo analytics performance --days 28 --property-id 370923251`.

Sem credenciais da CLI, use a interface autenticada quando autorizada pelo usuário. Não extraia cookies/tokens, imprima segredos ou configure acesso novo apenas para contornar falta de credenciais. Sem nenhum acesso, registre limitação e siga com fontes públicas e evidência histórica datada; não invente relatório atual.

## Interpretar e agir

- Priorize falsidade factual, depois consultas/páginas com demanda e resposta inadequada. Compare consulta **e** página antes de atribuir oportunidade a uma URL.
- Redirect e alternativa com canonical podem ser exclusões esperadas. Compare URL final, canonical declarada/escolhida e data do último rastreamento.
- Detectada/rastreada não indexada: confira HTTP, robots/noindex, sitemap, links, duplicação e utilidade. Não atribua causa ou penalidade sem evidência.
- 404: restaurar conteúdo útil que deveria existir, redirecionar para equivalente quando houver, ou manter 404 de conteúdo removido sem equivalente.
- Validar correção de um grupo só após conferir os exemplos e a correção aplicável. Diferencie “validação iniciada”, “aprovada” e “pendente”.

`inspect` consulta o estado conhecido pelo Google; não solicita indexação nem equivale ao teste ao vivo. Para blog comum, solicitação manual usa Inspeção de URL na interface, após deploy e conferência. Não usar Indexing API como submissor genérico de posts. Solicitação não garante rastreamento nem indexação; evite repetições sem mudança relevante. [Orientação oficial de recrawl](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

## Medição honesta

Registre datas efetivas, propriedade, tipo de busca, filtros e origem (CLI/interface). “3 meses” selecionado não implica três meses completos disponíveis. Totais por consulta não são totais por artigo. Não iguale clique GSC, sessão GA4 e visualização de página; consentimento e cobertura afetam a medição.

Revisão semanal: cliques/impressões/CTR por URL e consultas, usuários/visualizações/engajamento no GA4 e problemas de indexação. Compare janelas equivalentes de 28 dias quando disponíveis; com volume baixo ou período incompleto, registre números absolutos e incerteza. Mudanças em poucos cliques não provam causalidade.

AdSense: confira domínio, moeda, período, receita e RPM de página efetivo. `analytics adsense` consulta métricas de publisher no GA4; depende da integração e não substitui relatório de pagamentos/ganhos finalizados do AdSense. Aprovação/ads.txt autorizado não informa renda. Simulação usa `pageviews / 1000 × RPM`, com hipótese explícita; não prometa ganhos nem infle anúncios em prejuízo da leitura. [RPM de página](https://support.google.com/adsense/answer/112030?hl=pt-BR).

Relatório mínimo: baseline, alterações, verificações, estado público, pedidos/validações realmente confirmados, próxima data de avaliação e limitações. Atualize `editorial/pautas.md` com o próximo trabalho.
