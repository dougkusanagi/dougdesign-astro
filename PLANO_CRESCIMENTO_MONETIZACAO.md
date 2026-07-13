# Plano de crescimento, engajamento e monetização — Doug Design

**Data da auditoria:** 13 de julho de 2026  
**Horizonte:** 90 dias para estabilização e crescimento inicial; 6 meses para maturidade  
**Objetivo principal:** aumentar receita sustentável por visitante sem degradar confiança, indexação ou Core Web Vitals.

## 1. Resumo executivo

O blog já tem uma base técnica útil: Astro estático, sitemap, RSS, componentes de SEO, AdSense, Search Console, GA4, automação editorial, testes e uma CLI própria. O problema não é falta de volume. O problema é que conteúdo, indexação, experiência e monetização ainda não formam um ciclo mensurável.

As cinco prioridades, nesta ordem, são:

1. **Corrigir o host canônico.** Produção redireciona `https://dougdesign.com.br/*` para `https://www.dougdesign.com.br/*`, enquanto canonical, sitemap, robots, JSON-LD, Open Graph e CLI usam o host sem `www`. Todas as URLs declaradas passam por um `308`.
2. **Interromper sinais falsos de conversão.** O formulário de newsletter apenas esconde o formulário e mostra “Inscrito com sucesso”; nenhum endereço é enviado a um provedor. As ofertas da Amazon apontam para a home genérica, sem tag de afiliado nem curadoria verificável.
3. **Consolidar antes de publicar mais.** Há 519 posts publicados, 324 links internos classificados pela CLI como quebrados e 24 posts órfãos. Nos últimos 28 dias, o Search Console registrou apenas 49 cliques para 2.864 impressões.
4. **Tornar a CLI confiável e orientada a resultado.** O inventário exibido está desatualizado, o typecheck da CLI falha e comandos críticos conseguem criar/publicar conteúdo sem executar todos os gates exigidos pela documentação.
5. **Medir receita por contexto.** Hoje não há uma visão conjunta de página, cluster, origem, dispositivo, engajamento, receita publicitária, newsletter e afiliados. Sem isso, aumentar anúncios pode elevar receita bruta e reduzir receita por sessão no médio prazo.

### Decisão editorial imediata

Até concluir as fases 0 e 1, **congelar novas pautas evergreen**. Publicar apenas conteúdo realmente urgente e comprovado, após verificação de intenção. Usar o tempo editorial para consolidar URLs, reparar links, melhorar páginas que já recebem impressões e construir ativos de intenção comercial.

## 2. Evidências da auditoria

### 2.1 Repositório e qualidade técnica

| Evidência | Resultado | Consequência |
| --- | ---: | --- |
| Build Astro | 582 páginas, build concluído | Base estável, mas custo de build e volume já são altos |
| Testes unitários | 7/7 passaram | Cobertura ainda pequena para a CLI e regras editoriais |
| Testes E2E locais | Não executaram por Chromium ausente | Corrigir bootstrap; não confundir com falha funcional dos 9 testes |
| Typecheck da CLI | 2 erros | CLI não deve ser considerada pronta para automação confiável |
| Arquivos de post | 565 | O inventário precisa refletir o filesystem atual |
| Publicados | 519 | Volume muito superior ao tráfego orgânico observado |
| Drafts | 46 | Backlog editorial significativo |
| Agendados | 4 | Diverge do inventário em cache, que informa zero |
| Inventário em cache | 518 posts, gerado em 24/06/2026 | `inventory stats` pode orientar agentes com dados antigos |
| Posts com `# H1` no Markdown | 561 | O template também imprime H1; artigos podem ter dois H1 |
| Ocorrências brutas de clichês banidos | 305 | Requer auditoria contextual, não substituição cega |
| Links classificados como quebrados | 324 | Perda de navegação, autoridade interna e confiança |
| Posts classificados como órfãos | 24 | Menor descoberta por usuários e crawlers |

### 2.2 Search Console e indexação

Período de 16/06/2026 a 13/07/2026:

| Métrica | Valor |
| --- | ---: |
| Cliques | 49 |
| Impressões | 2.864 |
| CTR | 1,71% |
| Posição média | 9,87 |

Na amostra das 20 URLs mais recentes, somente duas estavam marcadas como indexadas. O restante incluía URLs detectadas e não indexadas, desconhecidas e páginas identificadas como redirecionamento.

O diagnóstico de produção confirmou:

```text
https://dougdesign.com.br/<slug>/
  -> HTTP 308
https://www.dougdesign.com.br/<slug>/
  -> HTTP 200
```

Porém, a página final em `www` ainda contém:

```html
<link rel="canonical" href="https://dougdesign.com.br/<slug>/">
```

O sitemap também lista URLs sem `www`. Esse conflito deve ser corrigido antes de interpretar a não indexação como simples problema de conteúdo.

### 2.3 Interface, engajamento e monetização

- O artigo observado renderiza dois H1: um no template e outro no Markdown.
- O componente `Newsletter.astro` não envia os dados; ele simula sucesso local.
- “Mais Lidos” é uma lista fixa, igual em todos os contextos, não um ranking baseado em dados.
- Não existe bloco de artigos relacionados por intenção/cluster ao final do texto.
- O sidebar mostra preços estáticos e links para `amazon.com.br`, sem produto específico, tag de afiliado, data de verificação ou aviso de publicidade.
- O mesmo `LivePixWidget` pode aparecer duas vezes na página. A navegação entre páginas registrou erro de JavaScript por declaração duplicada de `installLivePixLazyLoader`.
- O banner de consentimento ocupa área relevante no mobile e não oferece um centro permanente para alterar ou revogar preferências.
- A política de privacidade é curta e não descreve com precisão bases, prazos, operadores, revogação e fluxos atuais. A revisão final deve ser jurídica.
- O arquivo `llms.txt` anuncia ferramentas de contato/newsletter que não correspondem integralmente a fluxos funcionais.

## 3. Métricas e regras de decisão

### 3.1 Métrica norte

Usar **receita por mil sessões (RPS)** como métrica principal. Ela impede otimizações que aumentam pageviews ou carga de anúncios, mas reduzem valor por visita.

### 3.2 Métricas de resultado

| Área | Métricas |
| --- | --- |
| Aquisição | cliques orgânicos, impressões, CTR, páginas indexadas, citações em respostas de IA |
| Engajamento | sessões engajadas, páginas por sessão, leitura a 50%/90%, próximo artigo, retorno em 7/28 dias |
| Monetização | RPS, RPM, receita por página/cluster/dispositivo, viewability, receita de afiliados, EPC |
| Conversão própria | opt-in confirmado da newsletter, taxa por placement/cluster, receita atribuída ao e-mail |
| Qualidade | links quebrados, órfãos, duplicatas, páginas desatualizadas, fontes primárias |
| Performance | LCP, INP e CLS no percentil 75, separados por mobile/desktop e template |

### 3.3 Guardrails

- LCP p75 ≤ 2,5 s; INP p75 ≤ 200 ms; CLS p75 ≤ 0,1.
- Nenhum experimento pode piorar sessões engajadas ou RPS sem justificativa registrada.
- Não aumentar carga de anúncios sem medir viewability, abandono e receita por sessão.
- Não publicar conteúdo evergreen para cumprir quota.
- Não simular conversão, preço, disponibilidade, experiência prática ou autoria.
- Não adicionar schema que não corresponda ao conteúdo visível.

## 4. Roadmap priorizado

## Fase 0 — Integridade, conversões reais e baseline (dias 1–5)

### P0.1 Unificar o host canônico

**Recomendação:** adotar `https://www.dougdesign.com.br` porque esse já é o host final de produção. Se houver decisão comercial de usar o domínio sem `www`, inverter o redirecionamento na Vercel antes de alterar o código.

Implementar:

- Alterar `astro.config.mjs`, `SEO.astro`, schemas, `robots.txt`, `llms.txt`, CLI, exemplos e variáveis para um único `SITE_ORIGIN`.
- Gerar canonical, Open Graph, Twitter, JSON-LD, RSS e sitemap a partir dessa constante.
- Configurar `GSC_SITE_URL` para o host final e preferir uma propriedade de domínio no Search Console.
- Verificar que sitemap e canonicals retornem `200` diretamente, sem redirecionamento.
- Criar teste que falha se qualquer URL absoluta usar outro host.
- Reenviar sitemap após o deploy e reinspecionar uma amostra estratificada.

**Aceite:** zero redirecionamentos para URLs do sitemap; canonical da página é idêntico à URL final; 20/20 amostras consistentes.

### P0.2 Tornar a newsletter real ou removê-la temporariamente

Implementar:

- Escolher provedor com API e double opt-in.
- Enviar o e-mail server-side/endpoint seguro; nunca expor segredo no browser.
- Mostrar sucesso somente após resposta válida do provedor.
- Registrar consentimento, origem, placement, cluster e UTM.
- Criar páginas/estados de confirmação, erro, duplicidade e descadastro.
- Adicionar honeypot, rate limit e validação.
- Oferecer proposta específica por cluster, por exemplo alertas de PS Plus/Game Pass, e não apenas “newsletter técnica”.
- Remover do `llms.txt` qualquer ferramenta que ainda não execute uma ação real.

**Aceite:** inscrição de teste chega ao provedor, exige confirmação, pode ser removida e gera evento `newsletter_signup_confirmed` sem conter o e-mail.

### P0.3 Corrigir regressões visíveis e JavaScript não idempotente

Implementar:

- Remover H1 do corpo Markdown durante normalização, preservando apenas o H1 do template.
- Encapsular scripts de componentes em IIFE ou funções registradas sob namespace único.
- Garantir que `LivePixWidget`, TOC, busca, anúncios e eventos sobrevivam a View Transitions sem duplicação.
- Evitar renderizar LivePix duas vezes no mesmo template.
- Corrigir o script duplicado em `src/pages/posts/[...page].astro`.
- Sanitizar resultados da busca; não interpolar conteúdo editorial em `innerHTML` sem escape.
- Computar tempo de leitura no build em vez de confiar em string manual.

**Aceite:** console sem erros em home, arquivo, categoria e artigo após dez navegações; exatamente um H1 por página; busca global e filtros funcionais.

### P0.4 Estabelecer baseline de negócio

Implementar:

- Validar que o Google tag usado no front-end está associado à propriedade `GA4_PROPERTY_ID` consultada pela CLI.
- Confirmar integração GA4–AdSense e disponibilidade de `publisherAdRevenue`.
- Criar relatório diário, sem dados pessoais, com GSC + GA4 + AdSense.
- Separar página, cluster, categoria, dispositivo, canal e tipo de conteúdo.
- Registrar eventos: busca, filtro, clique interno, próximo artigo, profundidade, CTA, opt-in confirmado, afiliado e apoio.
- Não criar listeners próprios sobre cliques em anúncios AdSense.
- Documentar retenção e ignorar relatórios locais sensíveis/efêmeros no Git.

**Aceite:** dashboard/base JSON responde quais páginas trazem tráfego, engajam, monetizam e convertem, com comparação de 28 dias.

## Fase 1 — Indexação, consolidação e confiança (semanas 1–3)

### P1.1 Sanear o inventário e as URLs

- Classificar os 324 links apontados pela CLI em `200`, `301/308`, `404` e falso positivo.
- Atualizar links internos para o destino canônico final, mesmo quando existir redirect.
- Corrigir os 24 órfãos com links contextuais de páginas relevantes.
- Excluir do sitemap páginas utilitárias sem valor de busca, como documentação interna, quando aplicável.
- Implementar mapa versionado de redirect e teste de cadeias/loops.
- Não redirecionar URLs em massa sem cruzar impressões, links e intenção.

**Aceite:** zero links internos para 4xx; zero cadeias; zero órfãos relevantes; sitemap contém somente URLs 200, indexáveis e canônicas.

### P1.2 Consolidar canibalização por cluster

- Expandir o detector além de igualdade exata de `assunto` + `intencao_busca`.
- Analisar slug, título, entidades, intenção, queries do Search Console, embeddings e links.
- Começar por PS Plus, Xbox Game Pass, Switch 2, Meta Quest 4, CSS/Bento Grid, Design Systems, WebGPU e Claude Code.
- Para cada grupo: escolher URL principal, fundir conteúdo útil, atualizar data de forma honesta, redirecionar alternativas e reparar interlinks.
- Preservar URLs com intenção realmente distinta.

**Aceite:** cada cluster tem uma página pilar e papéis claros; decisões ficam em relatório versionado; queries não alternam entre duplicatas relevantes.

### P1.3 Atualizar páginas que já têm demanda

Prioridade inicial pelos dados existentes:

1. Página de PS Plus julho de 2026: queda de 22 cliques no período comparado.
2. Meta Quest 4: 232 impressões, CTR de 0,86%, além de outra URL concorrente.
3. Steam Summer Sale: queda de 770 impressões.
4. Game Key Card Switch 2: posição ~9 e CTR de 1,56%.
5. Figma Config e PlayStation Portal: preservar e expandir o que já está funcionando.

Para cada atualização:

- Confirmar intenção e fonte primária.
- Melhorar título/meta com promessa específica, sem clickbait.
- Exibir “publicado” e “atualizado” quando houver mudança material.
- Incluir resposta direta, tabela de decisão, limitações, Brasil, exemplos e links internos.
- Medir 28 dias antes/depois, respeitando sazonalidade.

### P1.4 Reforçar autoria e transparência

- Definir se os autores são pessoas reais, pseudônimos editoriais ou personas.
- Se forem personas, declarar isso e identificar o editor humano responsável.
- Se forem pessoas reais, adicionar bio verificável, experiência, perfis e política de correção.
- Exibir fontes primárias, data da última checagem e rótulos “confirmado”, “rumor”, “opinião” quando necessário.
- Criar páginas “Sobre”, política editorial, correções e metodologia de reviews.
- Adicionar `ProfilePage`/`Person` somente quando as informações forem verdadeiras e visíveis.

**Aceite:** nenhuma credencial ou experiência não verificável; autoria e responsabilidade editorial compreensíveis ao leitor.

## Fase 2 — Descoberta, permanência e produto editorial (semanas 3–6)

### P2.1 Recomendações contextuais

- Substituir o “Mais Lidos” fixo por ranking de 7/30 dias, com fallback estático gerado no build.
- Inserir 3–5 relacionados por intenção/cluster no fim do artigo.
- Adicionar próximo artigo coerente e “continue neste guia”.
- Excluir a própria página, drafts, conteúdo vencido e duplicatas.
- Registrar impressão e clique das recomendações.

**Aceite:** CTR de recomendação ≥ 4% como meta inicial; aumento de páginas por sessão sem piorar performance.

### P2.2 Busca e páginas de cluster

- Manter busca global, corrigir segurança e sincronizar query/categoria com a URL.
- Indexar também entidades, intenção, keywords e aliases; não somente título/descrição/categoria.
- Criar páginas de cluster editoriais, não apenas listagens: PS Plus, Game Pass, Switch 2, IA local, Astro/TypeScript e Design Systems.
- Exibir pilares, guias, notícias recentes, comparações e alertas/newsletter do cluster.
- Adicionar estados vazios úteis e sugestões de busca.

### P2.3 Componentes que respondem e convertem

Criar componentes leves, reutilizáveis e orientados à dúvida:

- resumo “Resposta em 30 segundos”;
- tabela de comparação;
- prós, contras e “para quem vale”; 
- checklist copiável;
- linha do tempo de notícias/atualizações;
- caixa de fontes e metodologia;
- CTA contextual de newsletter/afiliado;
- calculadoras somente quando houver intenção comercial clara.

Não introduzir widgets pesados para aumentar artificialmente o tempo de página.

### P2.4 Home e navegação

- Reduzir a quantidade de blocos concorrendo acima da dobra.
- Exibir promessa editorial clara e os clusters com maior demanda.
- Usar dados reais para destaques/mais lidos.
- Separar vagas, apoio e ofertas comerciais do fluxo principal sem escondê-los.
- No mobile, priorizar busca, categorias e leitura; testar o ticker urgente e a barra inferior.
- Adicionar link permanente “Preferências de privacidade” no footer.

## Fase 3 — Monetização diversificada (semanas 5–10)

### P3.1 AdSense orientado a RPS

- Mapear cada slot por template e posição.
- Reservar dimensões para evitar CLS.
- Carregar slots abaixo da dobra de forma preguiçosa e idempotente.
- Definir carga máxima por tamanho de artigo e dispositivo.
- Testar uma mudança por vez usando Experiments do AdSense.
- Comparar Auto Ads, manual e combinação, considerando receita, viewability, sessão engajada e CWV.
- Adiar modal de adblock até existir engajamento (por exemplo, segunda página ou 50% de leitura) e testar impacto.
- Nunca pedir ao leitor para clicar em anúncios.

**Aceite:** aumento de RPS sem piora material de engajamento ou CWV; nenhum slot sem rótulo claro.

### P3.2 Afiliados reais e úteis

- Remover o bloco atual até haver links de produto específicos e conta de afiliado válida.
- Criar catálogo editorial em arquivo estruturado: produto, URL, programa, tag, preço opcional, moeda, `checkedAt`, clusters e disclosure.
- Não exibir preço se não houver atualização confiável; usar “ver preço” quando necessário.
- Usar `rel="sponsored nofollow noopener"` e aviso de comissão.
- Priorizar artigos de alta intenção: consoles, portáteis, roteadores, acessórios, assinaturas, cursos e ferramentas.
- Medir `affiliate_click` com programa, produto, placement, página e cluster.
- Produzir comparações baseadas em critérios e fontes, sem alegar teste prático inexistente.

**Aceite:** zero links genéricos; 100% com disclosure e rastreamento; relatório de CTR, EPC e receita por cluster.

### P3.3 Newsletter como ativo próprio

- Criar uma promessa por segmento e frequência explícita.
- Oferecer alertas úteis: mudanças de catálogo, promoções verificadas, releases Astro/TypeScript e ferramentas de design.
- Criar sequência de boas-vindas com os melhores pilares, sem excesso de envio.
- Medir opt-in confirmado, abertura quando permitido, clique, retorno ao site e receita assistida.
- Posicionar CTA após valor entregue, não antes da resposta principal.

### P3.4 Vagas, patrocínio e produtos

- Validar demanda por vaga patrocinada com landing page, preço, prazo e audiência comprovável.
- Criar mídia kit com tráfego auditável, clusters, formatos e política de independência editorial.
- Marcar conteúdo pago como patrocinado; preservar opinião editorial.
- Testar ativos próprios de baixo custo: checklists, templates e mini-guias ligados a páginas que já ranqueiam.
- Só construir pagamento/portal após validar vendas manualmente.

## Fase 4 — SEO, AEO e GEO contínuos (semanas 2–12)

### P4.1 SEO técnico

- Centralizar origem, canonical e criação de URL.
- Validar títulos únicos e evitar duplicar “Doug Design” quando o caller já inclui a marca.
- Validar descriptions únicas, datas com timezone, imagens sociais e alt text.
- Garantir `BlogPosting`/`NewsArticle` conforme o tipo, `BreadcrumbList`, `Organization` e autor coerentes.
- Adicionar múltiplas proporções de imagem apenas quando existirem assets reais.
- Excluir drafts/futuros de página, busca, RSS e sitemap.
- Adicionar teste automatizado de HTML gerado: canonical, status, H1, title, schema e links.
- Medir CWV de campo no p75; o observer atual é diagnóstico parcial, não substitui `web-vitals`/CrUX.

### P4.2 AEO: respostas recuperáveis sem “schema por schema”

- Abrir cada página com resposta curta e específica à intenção.
- Usar subtítulos em forma de dúvida real, tabelas e passos quando ajudarem o leitor.
- Definir entidades, unidades, datas e contexto brasileiro sem ambiguidade.
- Sustentar afirmações com fontes primárias próximas ao trecho relevante.
- Incluir FAQ visível somente quando perguntas adicionais forem reais.
- Não priorizar `FAQPage` ou `HowTo` esperando rich result: FAQ é restrito principalmente a sites governamentais/saúde e HowTo foi descontinuado nos resultados do Google.

### P4.3 GEO: citação por mecanismos de IA

- Tratar GEO como extensão de SEO e qualidade, não como camada de palavras mágicas.
- Manter conteúdo rastreável, indexável, canônico, claro, factual e atualizado.
- Adicionar Bing Webmaster Tools e habilitar o painel AI Performance.
- Implementar IndexNow no fluxo de publicar, atualizar, redirecionar e remover.
- Medir citações, páginas citadas e grounding queries no Bing.
- Permitir explicitamente crawlers de busca por IA desejados, após decisão de política; separar bots de busca de bots de treinamento.
- Manter `llms.txt` pequeno, factual, com URLs canônicas absolutas e somente recursos funcionais.
- Não esperar benefício de ranking direto de `llms.txt`; tratá-lo como interface experimental.

**Aceite:** relatório mensal de citações e queries; nenhuma URL citada aponta para redirect/404; claims do `llms.txt` passam por teste.

## 5. Plano específico da DougSEO CLI

## CLI-0 — Correções obrigatórias

| Item | Mudança | Aceite |
| --- | --- | --- |
| Runtime | Remover dependência de `import.meta.dir` ou declarar tipos Bun; tornar `npm run dougseo` reproduzível | funciona em ambiente limpo e CI |
| TypeScript | Corrigir a união de tipos em `clickDelta` | `tsc --noEmit` passa |
| Inventário | `stats` recalcula por padrão ou acusa cache vencido; incluir hash/mtime/contagem | 565 arquivos atuais refletidos |
| Host | Uma única origem configurável e validada | URLs CLI iguais ao host final |
| Exit codes | `doctor`, `audit`, `intent`, APIs e queue usam códigos estáveis | testes cobrem sucesso/aviso/erro |
| Saída | `--json`, `--human`, `--quiet` e schema versionado | agentes não dependem de texto livre |
| Dry-run | Adicionar a todos os comandos mutáveis | diff exibido sem escrita |

## CLI-1 — Gates editoriais reais

- `post scaffold/create` deve executar `intent check` internamente antes de escrever.
- Exigir `--kind urgent|evergreen`; template genérico de notícia nunca deve ser padrão de tutorial.
- Validar fonte por URL, domínio, duplicidade e data de acesso.
- `publish` e `schedule` devem executar preflight: schema, intent, capa, conteúdo, links, fontes, data e git.
- Bloquear publicação quando houver erro; permitir override somente com `--force --reason` registrado.
- Validar ISO date, timezone `America/Sao_Paulo`, data futura e colisão de slot.
- Gerar ao final URL pública e status `live|scheduled` em formato humano e JSON.
- Tornar operações atômicas: escrever em temporário, validar e substituir.

## CLI-2 — Auditoria e arquitetura

- Auditar publicados também; não ignorar todo legado por um status de frontmatter.
- Criar baseline de exceções explícitas, com prazo, em vez de bypass global.
- Detectar H1 duplicado, headings genéricos incompatíveis com `content_type`, clichês, links relativos/absolutos, anchors, imagens, canonical e fontes.
- Verificar HTTP com cache, timeout, retry/backoff e limite de concorrência.
- Diferenciar link quebrado, redirect, URL não publicada e falso positivo.
- Detectar canibalização cross-category e similaridade mesmo quando Ollama estiver indisponível, usando fallback lexical/BM25.
- Mostrar evidências e recomendação: manter, fundir, redirecionar ou diferenciar.
- Detectar pilares ausentes, páginas órfãs, links unidirecionais e excesso de links para páginas fracas.

## CLI-3 — Dados e oportunidades

- Search Console deve encerrar o período em dados consolidados (configurável, por exemplo D-2/D-3), não necessariamente hoje.
- Comparações devem usar a união de chaves atuais e anteriores para capturar páginas que zeraram.
- Filtrar queries artificiais/ruidosas e separar branded/non-branded.
- Aplicar mínimos de impressão e intervalo de confiança antes de recomendar CTR.
- Criar `dougseo opportunities` unificando GSC, GA4, AdSense, freshness, arquitetura e valor comercial.
- Pontuar por impacto estimado, esforço, confiança e risco.
- Criar `dougseo round plan --budget <n>` que sugere updates antes de URLs novas.
- Exportar relatório resumido em Markdown e JSON, com caminhos e período.
- Integrar IndexNow e submissão de sitemap ao pós-deploy, sem prometer indexação.

## CLI-4 — Git, CI e segurança

- Remover `git add .` e o push hardcoded para `master`.
- Detectar branch atual, upstream e branch default; stage somente arquivos da operação.
- Recusar worktree com conflito nos arquivos-alvo.
- Adicionar `--commit` e `--push` independentes de verdade.
- No workflow agendado: `concurrency`, lockfile congelado, versão Bun fixa, pull/rebase seguro e resumo no job.
- Unificar `main` versus `master` nos workflows após confirmar o branch default.
- Remover ou marcar `deploy trigger` como legado, pois o contrato oficial é commit + push + Vercel.
- Separar tokens explícitos por escopo (`GSC_ACCESS_TOKEN`, `GA4_ACCESS_TOKEN`); não reutilizar token do Search Console para Analytics.
- Testar autenticação, expiração, retries, parsing e redaction de erros.

## 6. Melhoria das instruções Markdown para agentes

As instruções atuais são curtas, mas não são eficientes como contrato operacional. Elas repetem regras, exigem leitura integral em toda rodada, não definem outputs/exit codes e contêm contradições.

### Contradições a resolver

- `AGENTS.md` recomenda 2–3 posts por semana, enquanto `08-publicacao-e-agendamento.md` define meta de 3 posts por dia.
- Horários 08:00/12:00/18:00 permitem intervalo de quatro/seis horas; a skill pede mínimo de 12–24 horas.
- A documentação manda usar Antigravity primeiro, mas agentes podem não ter essa ferramenta disponível.
- `post scaffold` gera template de notícia mesmo para evergreen, contrariando a proibição de headings genéricos.
- Existem vários planos/TODOs com itens simultaneamente marcados como concluídos e ainda listados como próximos passos.

### Estrutura proposta

```text
AGENTS.md                         # regras globais, riscos e roteador
editorial/CONTRACT.md             # fonte única de verdade operacional
editorial/docs/
  taxonomy.md
  content-quality.md
  seo-aeo-geo.md
  measurement-monetization.md
  publishing.md
editorial/skills/<skill>/SKILL.md # passos executáveis por tarefa
editorial/runbooks/
  failures.md
  rollback.md
  credentials.md
```

### Regras de escrita

- Usar português UTF-8 com acentuação normal.
- Cada regra deve existir em um único documento; outros arquivos apontam para ela.
- `AGENTS.md` deve mandar ler o contrato base + somente o guia/skill da tarefa.
- Cada skill deve declarar: quando usar, quando não usar, pré-condições, comandos, pós-condições, outputs, falhas, rollback e critérios de parada.
- Adicionar frontmatter válido às skills (`name`, `description`) para facilitar descoberta.
- Transformar cadência em política única: **2–3 posts de alta qualidade por semana**; horários 08:00/12:00/18:00 são slots permitidos, não meta diária.
- Definir fallback de capa por capacidade: ferramenta de imagem aprovada disponível -> fallback CLI; registrar método e falha.
- Exemplos devem usar o wrapper real `npm run dougseo -- ...` ou bin instalado, nunca comandos que dependem de PATH não documentado.
- Documentar outputs JSON e códigos de saída consumidos por agentes.
- Arquivar planos antigos e manter um backlog único com owner, status, evidência e data.
- Fazer `CLAUDE.md` apontar para `AGENTS.md`, evitando política paralela.

### Teste das instruções

Criar cenários automatizados/fixtures:

1. assunto e intenção já existem;
2. evergreen tenta usar template de notícia;
3. capa não foi gerada;
4. schedule colide com outro evergreen;
5. fonte inválida;
6. worktree sujo;
7. Search Console indisponível;
8. publicação gera lista final de URLs e status.

## 7. Sequência de implementação sugerida

| Semana | Entrega | Dependências |
| --- | --- | --- |
| 1 | host canônico, newsletter honesta, H1/JS, typecheck, inventário | nenhuma |
| 2 | sitemap/canonicals testados, links 4xx/redirect, CI e gates da CLI | semana 1 |
| 3 | consolidação dos 3 primeiros clusters e updates GSC | baseline |
| 4 | relacionados, mais lidos real, próximo artigo e busca segura | arquitetura limpa |
| 5 | autoria/transparência, páginas de cluster e CTAs segmentados | clusters definidos |
| 6 | integração de receita, afiliados reais e primeiro experimento AdSense | métricas confiáveis |
| 7–8 | Bing/IndexNow/AI Performance, dashboard e oportunidades CLI | host e dados estáveis |
| 9–12 | repetir updates, monetização por cluster e produto editorial validado | aprendizados das fases anteriores |

## 8. Critérios para encerrar os primeiros 90 dias

- Host, canonical, sitemap, robots, OG e JSON-LD 100% consistentes.
- Nenhuma URL do sitemap redireciona ou retorna 4xx.
- Cobertura de indexação das URLs prioritárias cresce de forma consistente.
- CTR orgânico geral sai de 1,71% para uma meta inicial de pelo menos 2,5%, sem clickbait.
- Top 20 páginas em posição 4–15 possuem plano/update concluído.
- Zero conversões falsas de newsletter e afiliado.
- RPS, receita por cluster e opt-in confirmado são mensuráveis.
- Links quebrados prioritários zerados e órfãos resolvidos.
- CLI passa typecheck/testes e bloqueia publicação sem preflight.
- E2E roda localmente e na CI com browser instalado e lockfile congelado.
- Core Web Vitals no p75 respeitam os guardrails por dispositivo.
- Pelo menos um canal próprio (newsletter) e um canal comercial (afiliado, vaga ou patrocínio) têm conversão real mensurada.

## 9. O que não implementar agora

- Personalização por machine learning.
- Login, perfil de usuário ou gamificação.
- Chatbot genérico no blog.
- Internacionalização antes de consolidar a versão pt-BR.
- Storybook/portal de componentes como prioridade de crescimento.
- Produção diária de posts para “alimentar o algoritmo”.
- FAQ/HowTo schema em massa.
- Mais modais, autoplay, notificações ou scripts de terceiros sem hipótese e métrica.

Esses itens aumentam complexidade sem atacar os gargalos atuais: indexação inconsistente, autoridade diluída, conversões inexistentes e monetização não atribuída.

## 10. Referências oficiais usadas no plano

- [Google: recursos de IA e seu site](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: dados estruturados de Article](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google: mudanças em FAQ e HowTo](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
- [web.dev: Core Web Vitals](https://web.dev/articles/vitals)
- [Google AdSense: experimentos de Auto Ads](https://support.google.com/adsense/answer/9726342)
- [Google AdSense: boas práticas de posicionamento](https://support.google.com/adsense/answer/1282097)
- [IndexNow: documentação do protocolo](https://www.indexnow.org/documentation)
- [Bing: AI Performance no Webmaster Tools](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)
- [Perplexity: crawlers oficiais](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)

## 11. Primeira rodada recomendada

Para começar sem dispersão:

1. Corrigir host canônico e criar teste de origem.
2. Corrigir newsletter falsa, H1 duplicado e erro de LivePix/View Transitions.
3. Corrigir typecheck, inventário e PATH/runtime da CLI.
4. Classificar os 324 links e reparar primeiro os que apontam para 4xx.
5. Consolidar Meta Quest 4 e PS Plus antes de criar novas URLs.
6. Instalar baseline de RPS/engajamento e só então iniciar experimento de anúncios.

Essa rodada produz o maior ganho provável porque remove bloqueios de indexação, protege confiança e cria dados capazes de orientar as próximas decisões de monetização.
