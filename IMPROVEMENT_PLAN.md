# Plano de melhoria — Doug Design

Branch: `improve/analytics-seo-psplus`

## 1. Crítico — não pode ser ignorado

- [x] Corrigir o consentimento de marketing para não retornar `true` por padrão.
- [x] Impedir o carregamento do AdSense antes do consentimento.
- [x] Separar consentimento persistido de Analytics e publicidade.
- [x] Criar `private-keys/.gitignore` mantendo a pasta no repositório.
- [x] Documentar o uso de service account sem versionar credenciais.
- [ ] Revogar e rotacionar qualquer chave privada que tenha sido exposta.
- [ ] Confirmar domínio, propriedade URL-prefix e permissões da service account em produção.
- [ ] Corrigir/validar a identificação GA4 usada no site (`G-...`) e separar Google Ads de Analytics.
- [ ] Auditar páginas com afirmações factuais vencidas, rumores e datas de 2026.
- [ ] Auditar links quebrados, páginas órfãs, canonicals e redirecionamentos.
- [ ] Garantir política de privacidade, preferências de consentimento e revogação compatíveis com LGPD.

## 2. Dados, CLI e agente editorial

- [x] Integrar GA4 Data API na CLI com `dougseo analytics performance`.
- [x] Disponibilizar aliases `overview`, `pages`, `sources`, `engagement` e `adsense`.
- [x] Permitir que GA4 use a mesma service account do Search Console.
- [x] Gerar relatório JSON de usuários, sessões, pageviews, engajamento, páginas, fontes e tendência diária.
- [x] Documentar `GA4_PROPERTY_ID` e `GOOGLE_APPLICATION_CREDENTIALS`.
- [x] Manter relatório Search Console com queries, páginas, CTR, posição e comparação.
- [x] Adicionar `dougseo search-console opportunities` para classificar CTR, posição e quedas.
- [x] Adicionar `dougseo content audit` para detectar links quebrados, órfãos e duplicidades.
- [x] Adicionar `dougseo content freshness --days 180` para priorizar atualizações.
- [ ] Adicionar classificação automática de oportunidades: posição 4–15, CTR baixo e queda de cliques.
- [ ] Adicionar análise de canibalização por `assunto` e `intencao_busca` ao relatório.
- [ ] Adicionar detecção de posts órfãos, links quebrados e clusters sem página pilar.
- [ ] Adicionar comando de recomendações editoriais baseado em GA4 + Search Console.
- [ ] Adicionar exportação Markdown resumida para o agente de IA.
- [ ] Criar rotina agendada de coleta e histórico de relatórios sem dados pessoais.
- [ ] Adicionar testes unitários para autenticação, parsing de respostas e métricas GA4.

## 3. Conteúdo, SEO e EEAT

- [x] Atualizar o post de PS Plus Essential julho de 2026 com anúncio oficial.
- [x] Expandir o cluster de PS Plus a partir da consulta real do Search Console.
- [x] Adicionar links para comparação PS Plus/Game Pass e escolha de plano.
- [x] Criar páginas de autores com biografia e lista de artigos.
- [x] Adicionar autor verificável, seção, idioma e acesso livre ao schema de artigos.
- [x] Adicionar páginas de autores com URLs próprias e lista de artigos.
- [ ] Criar página pilar atualizada para o cluster PS Plus.
- [ ] Consolidar ou redirecionar duplicatas de PS Plus, Xbox Game Pass, Switch 2, CSS e Design Systems.
- [ ] Definir uma URL principal por intenção e registrar decisões de canibalização.
- [ ] Criar calendário mensal para notícias de PS Plus: pré-anúncio, anúncio, resgate e retrospectiva.
- [ ] Atualizar posts antigos de PS Plus com links para a página pilar.
- [ ] Criar páginas de autor com biografia, experiência e links verificáveis.
- [ ] Exibir fonte primária, data de verificação e distinção entre fato, rumor e opinião.
- [ ] Melhorar títulos e meta descriptions de páginas com muitas impressões e CTR baixo.
- [ ] Adicionar índice de conteúdo, resumo direto, tabelas e blocos de decisão em guias longos.
- [ ] Criar interlinks contextuais no corpo, evitando depender apenas de “Leia também”.
- [x] Adicionar índice automático, compartilhamento e cópia de link em artigos.
- [x] Adicionar eventos básicos de profundidade de rolagem e tentativa de inscrição na newsletter.
- [ ] Reduzir publicação de notícias redundantes e priorizar atualização de URLs existentes.

## 4. Site, acessibilidade, performance e anúncios

- [ ] Medir Core Web Vitals reais por dispositivo e por template.
- [ ] Medir o impacto de fontes externas, GA4, AdSense e View Transitions.
- [ ] Revisar carregamento duplicado de scripts e pageviews em navegação Astro.
- [ ] Adicionar placeholders estáveis para anúncios e reduzir CLS.
- [ ] Testar posições de anúncios por receita, viewability e abandono.
- [ ] Limitar quantidade de anúncios em mobile e em artigos curtos.
- [ ] Adicionar eventos GA4 para scroll, cliques internos, newsletter, busca e anúncios.
- [ ] Criar recomendações relacionadas por intenção e não apenas por categoria.
- [ ] Melhorar busca interna, navegação “próximo artigo” e páginas de categoria.
- [ ] Revisar acessibilidade de contraste, foco, alt text, headings e navegação por teclado.
- [ ] Adicionar dados estruturados `Article`, `BreadcrumbList`, `ItemList` e autor com URLs reais.
- [ ] Validar sitemap, robots, canonicals, Open Graph e imagens sociais em produção.

## 5. Engajamento e monetização

- [ ] Implementar newsletter com consentimento e eventos de conversão.
- [ ] Adicionar CTAs contextuais por cluster.
- [ ] Testar afiliados de hardware, jogos, assinaturas e cursos com identificação clara.
- [ ] Criar comparadores e ferramentas interativas úteis ao leitor.
- [ ] Medir receita por URL, posição de anúncio e tipo de dispositivo.
- [ ] Criar dashboard editorial com tráfego, CTR, receita, indexação e oportunidades.
- [ ] Testar títulos, meta descriptions, CTAs e posições de anúncios.
- [ ] Criar modelo de patrocínio para clusters de alta intenção comercial.

## 6. Futuro

- [ ] Implementar ciclo fechado: dados → diagnóstico → atualização → publicação → medição.
- [ ] Criar agente de refresh automático com aprovação humana obrigatória.
- [ ] Adicionar alertas de queda de cliques, perda de posição e conteúdo vencido.
- [ ] Criar testes A/B de layout e conversão.
- [ ] Criar painel de governança de credenciais, escopos, rotação e retenção.
- [ ] Criar histórico de decisões editoriais e impacto por URL.
- [ ] Avaliar distribuição em RSS, newsletter, redes sociais e comunidades relevantes.
