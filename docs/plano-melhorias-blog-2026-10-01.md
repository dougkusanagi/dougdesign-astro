# Plano de melhorias do Doug Design — 01/10/2026

Estado: **planejado, sem implementação das melhorias abaixo**. Pedido do dono: recomendações com passos objetivos, fila de posts e produtos reais da conta afiliada. Nesta rodada, somente documentação/diretrizes e três registros no catálogo de afiliados mudam. Nenhum artigo é escrito, revisado, publicado ou agendado por este plano. A correção do anúncio vazio e a capa do Steam Deck já foram entregues em rodadas anteriores.

## Evidência e objetivos

Inventário reconstruído em 01/10 às 20:04:52, `America/Sao_Paulo`: 597 arquivos, 556 publicados, 41 rascunhos e nenhum agendado. O audit ampliado dos publicados lista 454 URLs com 1.744 apontamentos, todos classificados como legado. Isso mede contrato editorial/estrutura, não falsidade nem uma penalização do Google. A [fila detalhada](../editorial/reports/posts-priorizados-2026-10-01.md) inclui também textos que passam no audit mas contêm problemas materiais.

Search Console, propriedade `https://www.dougdesign.com.br/`, Web, sem filtro de país/dispositivo, consultado em 01/10: cobertura real **04–28/09/2026**, 65 cliques, 7.973 impressões, CTR 0,8%, posição 7,4. Não inclui resultados posteriores às últimas revisões. A amostra de 25 linhas ordenada por impressões contém fragmentos e URL redirecionada; não somar essas linhas às métricas das URLs principais.

GA4, propriedade 370923251, período 01–30/09, lido na rodada anterior do mesmo dia: 53 usuários ativos, 90 visualizações, 66 sessões, zero eventos principais. Não houve nova consulta de receita AdSense nesta rodada. Visitas do dono/testes não foram isoladas. Cliques GSC, usuários GA4 e impressões AdSense medem coisas distintas.

Objetivos: responder melhor às dúvidas que já trazem impressões, ampliar cobertura diária de fatos e guias úteis, aumentar retorno e navegação entre artigos, medir afiliados e receita com dados próprios. Mil visualizações mensais é um primeiro marco operacional, sem prazo prometido nem alegação de requisito AdSense. Não estabelecer RPM de mercado como previsão. Receita de anúncios deve usar visualizações monetizadas e RPM efetivamente observados, na mesma moeda/período.

## Cadência e operação diária

A decisão do dono em 01/10 substitui os limites semanais: **5 novos posts pesquisados + 3 atualizações substanciais por dia**, como meta inicial ampliável. Não há teto diário por SEO. A [política de spam do Google](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content) caracteriza abuso pela finalidade manipulativa e falta de valor; publicar cinco ou mais notícias não configura, por si só, uma infração. A [orientação de conteúdo útil](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) não recomenda mudar datas sem mudança real para parecer recente.

1. Abrir a rodada com inventário, fontes e fila. Selecionar até cinco dúvidas/fatos novos com contribuição específica e três revisões prioritárias. Games primeiro; Programacao/Web Design recebem exemplos úteis. Outras categorias entram por utilidade apurada.
2. Antes de cada nova URL: intent check, leitura dos candidatos e busca manual entre categorias. Mesmo assunto/intenção pede atualização. Notícia distinta exige fato novo, data e consequência próprios; não dividir um comunicado em variações artificiais.
3. Registrar por URL: pergunta, fontes específicas e data da consulta, afirmações sustentadas, contribuição própria, revisão, capa, links e estado. O lote só contém textos individualmente prontos. Uma revisão complexa pode consumir vários slots; registrar o que ficou pendente.
4. Distribuir Evergreen no mesmo dia em 08h, 10h, 12h, 15h e 18h, `America/Sao_Paulo`, como horários de teste. Notícias confirmadas podem sair imediatamente conforme autorização. A fila continua no frontmatter/GitHub Actions; este documento não ativa execução.
5. Fechar diariamente com URLs novas/atualizadas, horários/fuso, commit, deploy e pendências. Corrigir fatos sem quota; preservar slug/pubDate e alterar updatedDate somente após mudança substancial.
6. Reavaliar capacidade semanalmente por entregas concluídas, tempo de pesquisa, correções após publicação e pendências. Não reduzir volume por um suposto limite do Google; ajustar recursos/escopo às evidências.

## Sequência proposta e esforço

As semanas indicam ordem de implementação após autorização futura; não são agendamentos. Estimativas em dias de trabalho concentrado, dependentes de acesso e testes, não compromissos de entrega. A produção editorial diária corre em paralelo à sequência quando houver capacidade.

| Ordem | Entrega futura | Esforço inicial | Dependência | Aceite objetivo |
|---|---|---:|---|---|
| Semana 1 | Revisões P0 da fila e base de medição | 0,5–1 dia por revisão; 1–2 dias para medição | Fontes atuais, dados autorizados | Afirmações rastreáveis, exemplos executados quando declarados, baseline e limites documentados |
| Semana 1 | Ajustes da home, sidebar e navegação | 1–2 dias | Decidir nomes e seleção | Sem duplicação da sexta notícia, títulos honestos, sem overflow em 375/390/768/1440 px |
| Semana 2 | Afiliados por contexto e retenção/RSS | 2–3 dias | Catálogo verificado, decisão de newsletter | Recomendação compatível com artigo; clique mede saída, não venda; CTA funciona |
| Semana 2–3 | CLI: fila, saúde, intenção e deploy | 3–5 dias | Contratos/fixtures definidos | Estados corretos, falhas explícitas, deploy vinculado ao SHA |
| Semana 3 | Auditoria de links e dados por comando | 2–4 dias | Limites de rede, APIs disponíveis | Relatórios reproduzíveis, sem misturar métricas/propriedades |
| Semana 4 | Fluxo de IA e um recurso original piloto | 3–5 dias | Primeiras entregas validadas | Fontes/limites preservados; material utilizável; sem publicação automática por score |

## Design, anúncios e navegação

**D01 — Home sem repetição.** Examinar `src/components/Hero.astro`, `Feed.astro` e `src/pages/index.astro`: hero usa seis artigos e feed começa no índice cinco. Definir um único limite e usar seis como início do feed. Aceite: nenhuma URL repetida entre blocos, ordem preservada, hero/mobile e paginação conferidos. Não há alteração agora.

**D02 — Sidebar honesta e útil.** Em `src/components/Sidebar.astro`, “Mais lidos” usa seleção fixa. Primeira entrega: renomear para “Seleção da redação” e documentar critério; ranking real fica dependente de dados, período e tamanho mínimo de amostra. Escolher 3–5 recomendações conforme assunto/compatibilidade, mantendo alternativa sem produto quando não houver pertinência. Não reconstruir o sistema de relacionados já existente, que usa tópicos e interlinks; verificar sua relevância após as revisões.

**D03 — Anúncios sem encobrir leitura.** A correção de anúncios `unfilled`/`unfill-optimized` já foi entregue, inclusive o caso da imagem enviada. Antes de nova mudança, reproduzir anúncios preenchidos e vazios na home/post em desktop e mobile, recarregando ao mudar breakpoint. Examinar inserções em header sticky (`src/components/Header.astro` e `src/layouts/Layout.astro`), sidebar e cards. Documentar as áreas a excluir no painel e a opção de formatos sobrepostos para decisão do dono, sem mudar AdSense automaticamente. Aceite: scrollWidth <= clientWidth, textos/CTAs legíveis, sem deslocamento persistente causado por espaço vazio. [Configuração oficial de anúncios automáticos](https://support.google.com/adsense/answer/9261307?hl=pt-BR). Não esconder indiscriminadamente anúncios preenchidos.

**D04 — Mensagens de apoio e acessibilidade.** `AdBlockModal.astro` afirma que anúncios são a única fonte, embora haja afiliados/LivePix. Planejar aviso opcional com texto verdadeiro, fechamento por teclado, foco previsível e sem bloquear artigo. Newsletter (`Newsletter.astro`) oferece RSS enquanto inscrição está em preparação: preservar esse serviço real, localizar links antigos para `/newsletter` e `/#newsletter-form`, direcionar para CTA existente. Aceite: não prometer formulário inexistente; leitores com teclado/mobile conseguem ler e fechar elementos.

**D05 — Busca e metadados consistentes.** Em `src/pages/search-index.json.ts`, alinhar elegibilidade ao helper de posts publicados e descrição ao fallback do SEO; não basta `!draft`. Confirmar helper em `src/lib/` antes da edição. Aceite: artigo futuro não aparece, descrição da busca coincide com página e título permanece íntegro. Testar somente estados relevantes: publicado, rascunho e futuro.

## Medição e monetização

**M01 — Instrumentação com significado.** Em `src/layouts/Layout.astro`/helpers, aproveitar o mecanismo de consentimento existente. Propor eventos `affiliate_click` (ASIN/posição/artigo), `related_article_click`, `rss_click`, `search_result_click` e `article_read` (critério documentado de leitura/tempo, não só scroll). Sem emails, chaves ou consultas sensíveis no payload; não instrumentar cliques nos anúncios. Eventos de saída não comprovam compras. Primeiro validar na ferramenta de depuração e sessões internas identificadas; definir separadamente com o dono como excluir seu tráfego sem distorcer visitas reais.

**M02 — Core Web Vitals corretos.** A instrumentação local registra entradas individuais de CLS e a última duração para INP; não equivale à métrica final de campo. Planejar coleta por biblioteca oficial `web-vitals`, respeitando consentimento, ciclo da página, device e versão. Aceite: CLS final agregado e INP conforme implementação documentada; relatório p75 somente com amostra suficiente. Lighthouse é laboratório, não resultado do CrUX. Evitar prometer nota máxima.

**M03 — Relatório semanal separado por fonte.** GSC: cliques/impressões/consultas/página e cobertura efetiva; GA4: usuários, sessões, engajamento e eventos; AdSense: domínio, receita, RPM e moeda; Amazon: cliques/pedidos/comissões do mesmo StoreID quando disponíveis. Comparar janelas completas equivalentes, registrar números absolutos com pouco tráfego. Mostrar que a coleta GA4 depende de consentimento. Medir aumento de navegação, retorno e vendas reais sem atribuição causal automática.

**M04 — Afiliados contextualizados.** Futura seleção em `src/lib/gear.ts` e `Sidebar.astro`: campos de tipo, compatibilidade, temas, data de conferência e evidência, sem preço fixo nem review fictício. Separar cartão microSD comum de Express; não oferecer acessório incompatível como solução para Switch 2. Limitar itens por contexto e conservar identificação comercial e `rel="sponsored"`. Conferir condição de conta pelo dono antes de estimar renda; nem login nem link gerado garantem comissões.

**M05 — Newsletter e produto próprio em etapas.** Primeiro RSS/CTAs e retorno mensurável. Para email: dono escolhe provedor e orçamento; preparar formulário, confirmação, política de dados e descadastro antes de ativar. Para produto: validar demanda por um template de interface, checklist de migração Penpot ou pacote de componentes executáveis; definir demonstração, suporte, preço/custo e checkout antes de construir. Não criar contas, aceitar termos ou divulgar em canais externos nesta rodada.

## CLI e agentes de IA

Todas as tarefas abaixo são propostas. Cada uma deve receber implementação/testes próprios em rodada futura, seguida de atualização do README.

| ID | Arquivos a examinar | Implementação objetiva | Validação/aceite |
|---|---|---|---|
| C01 | `tools/dougseo-cli/src/lib/queue.ts`, `dates.ts`, `src/cli.ts` | Manter filtro de vencidos explícito e acrescentar visão futura/toda a fila, com ISO/fuso e estado local/remoto | Fixture com vencido, futuro, inválido e publicado; listagem não publica; README explica cron e atraso |
| C02 | `src/cli.ts`, `lib/google-auth.ts`, `ai.ts`, `codex.ts` | Doctor distingue configurado, disponível, indisponível e não testado por integração; login não prova inferência nem acesso a propriedade | Falha de autorização/timeout descrita sem expor credenciais; não retornar saúde total por simples presença de configuração |
| C03 | `lib/intent-check.ts`, `content-index.ts` | Separar resultado automático da revisão manual; candidatos entre categorias, URL atual excluída corretamente e falha semântica visível | Casos de intenção duplicada, assuntos parecidos com dúvidas diferentes e IA indisponível; nenhum “ok” certifica unicidade |
| C04 | `lib/deploy.ts`, `git.ts` | Webhook aceito gera estado pendente; acompanhar SHA/status Vercel/HTTP/canonical/sitemap com timeout | Mock pendente/success/failure/timeout; resposta nunca diz “ao vivo” apenas porque POST retornou 2xx |
| C05 | `lib/analytics.ts`, `search-console.ts` | Cada comando solicita o dataset pertinente; devolver período inclusivo, propriedade, moeda quando aplicável, filtros e cobertura | Fixtures com período incompleto e 0 vs indisponível; GA4/AdSense separados; fragments/redirects não somados sem critério |
| C06 | `lib/search-console.ts` | Oportunidades por página/consulta/posição/dispositivo com amostra mínima e números absolutos; CTR fixa de 3% é só heurística, não prova problema | Poucas impressões não viram alta prioridade por percentuais; gerar sugestão, sem trocar título automaticamente |
| C07 | `lib/audit.ts`, `freshness.ts` | Conferir destinos/redirects/anchors com cache, timeout, limite de requisições; acompanhar afirmações voláteis e data de verificação, além da idade do post | Links quebrados/transientes distintos; fixtures locais, sem depender da rede no CI; não mudar updatedDate em lote |
| C08 | `lib/ai.ts`, `codex.ts`, skills editoriais | Contrato de saída com fontes específicas, evidências, lacunas e contribuição; orçamento/timeout por URL, fallback rascunho | Falha de pesquisa não publica; nenhum teste/benchmark inventado; revisão identifica título contraditório e capa de produto inadequada |

**Fluxo proposto de IA:** apuração → registro das afirmações/fontes/datas → texto útil → revisão factual → revisão de exemplos/interlinks/capa → audit/build/deploy. Uma segunda revisão ajuda, mas não é certificação. Se houver delegação autorizada, cada agente recebe uma URL e seus critérios; caso contrário executar as etapas diretamente. Não ativar agentes/schedules agora. A skill deve exigir leitura efetiva da fonte, não só seu endereço, e distinguir análise documental de experiência própria. O `image_gen` integrado continua o padrão na sessão; não pressupor que a CLI tenha uma API disponível. Produto reconhecível exige referência oficial e inspeção visual.

## Valor original e distribuição

Começar por um piloto derivado da fila: exemplo completo de Subgrid/Container Queries com HTML, CSS, fallback, demonstração e instruções reproduzíveis; ou checklist de biblioteca/compatibilidade de portátil com fontes datadas. Escolher após intent check e revisão manual. Não abrir novas URLs para o mesmo guia já existente. Um tutorial útil não precisa de extensão artificial nem cabeçalhos de notícia.

Preparar títulos/trechos para distribuição nos canais que o dono escolher, reaproveitando demonstrações e respostas úteis. Preparar não equivale a enviar: publicação em redes, emails e mensagens exige instrução explícita. Sem compra de tráfego ou backlinks para prometer ranking.

## Produtos adicionados nesta rodada

Conta Amazon associada aberta no Chrome e StoreID `douglopesreal-20` confirmados em 01/10. Três páginas exibiam disponibilidade e geraram links pelo SiteStripe; ASIN/tag foram conferidos. O site mantém a URL canônica `/dp/ASIN?tag=...` pelo helper existente, sem copiar parâmetros transitórios de busca.

| Produto | ASIN | Conferência e limite |
|---|---|---|
| GameSir G7 SE azul | B0D8KXR131 | Controle **com fio**, anunciado para PC/Xbox One/Series X\|S; sem teste próprio |
| Não me faça pensar: atualizado — Steve Krug | 8576088509 | Livro de usabilidade, edição em português; ISBN-13 9788576088509 |
| SanDisk Extreme microSDXC 256 GB | B0B2DCZDJZ | Modelo SDSQXAV-256G-GN6MN, UHS-I; **não é microSD Express para Switch 2** |

São dados adicionados a `src/lib/gear.ts`; não foi implementada seleção contextual. Preço, estoque e vendedor podem mudar. O painel mostra pendência de informações fiscais para o titular concluir; não foram enviados dados nem aceitos termos. Links reais não comprovam aprovação definitiva, vendas ou receita. Referência de compatibilidade: [especificações Nintendo Switch 2](https://www.nintendo.com/us/gaming-systems/switch-2/tech-specs/).

## Conclusão e manutenção do plano

Implementação futura começa pelos P0, depois medição/layout, afiliados/retorno e CLI/IA. Para cada entrega: confirmar autorização vigente, ler docs Astro correspondentes, inspecionar arquivos, implementar só o escopo escolhido, validar, commit/push e comprovar deploy. Checklist CI: testes unitários, typecheck CLI, audit normal e build. Audit ampliado mede dívida legada e não deve ser apresentado como CI aprovado.

Revisar este plano semanalmente pela evidência disponível, mantendo a meta diária e anotando capacidade real. Verificação local desta rodada: 40 testes unitários passaram, typecheck da CLI passou e audit normal retornou ok (dívida de 495 legados em todo o escopo, incluindo rascunhos, separada dos 454 publicados da triagem). Build passou (651 páginas). O estado do deploy será confirmado no fechamento da rodada.

Sem promessa de indexação, tráfego ou renda. Relatórios de 29–30/09 permanecem históricos; este documento e as diretrizes atuais prevalecem em decisões conflitantes.
