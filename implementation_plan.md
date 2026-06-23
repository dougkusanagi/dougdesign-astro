# Plano de Migração e Implementação Técnica: Doug Design SEO (Astro v7)

Este documento centraliza as especificações técnicas, decisões de design, plano de roteamento de SEO, integração de monetização e o fluxo operacional de agentes para a implementação do novo blog estático **Doug Design** baseado em **Astro v7 + Tailwind CSS** hospedado na **Vercel**.

O objetivo primário é migrar todo o acervo do WordPress legador mantendo 100% de autoridade orgânica, atingir nota 100 nas métricas do **Google PageSpeed Insights** e criar um layout premium e otimizado.

---

## 1. Identidade Visual e Layout

### Cores e Logo
- **Logo Oficial:** Utilizar o arquivo `public/logo-doug-design.svg` (cujo original foi movido para a pasta do projeto).
- **Dark Mode:** O SVG deve ser inserido "inlined" (em linha) no componente de cabeçalho `Header.astro`. Os elementos de caminhos (`path` e `text`) que representam a palavra "Doug" e a curva escura do "D" devem possuir as classes Tailwind `fill-[#0f1825] dark:fill-white`, de modo a clarear no tema escuro. O elemento `rect` e o texto "DESIGN" mantêm a classe fixa `fill-[#0866fa]` (Azul Royal oficial).
- **Header:** A altura máxima do SVG no cabeçalho deve ser limitada (`h-7 sm:h-8`) para fornecer respiros verticais equilibrados no topo.
- **Menu Mobile:** O cabeçalho é posicionado na parte inferior da tela no mobile (padrão bottom bar de apps nativos) e no topo no desktop. O painel do menu móvel expande-se para cima com transições suaves de opacidade e escala Y, sendo completamente opaco (fundo branco no modo claro e azul ardósia `#111a2e`/`darkbg-900` no modo escuro) para evitar sobreposição que dificulte a leitura.
- **Tons Saturos no Dark Mode:** Para evitar a desaturação e manter a harmonia visual com o fundo escuro da logo (`#0b0f19`), os contêineres de cards e blocos no dark mode usarão a cor azulada/slate premium `#111a2e` (`dark:bg-darkbg-900`) e bordas em tons de slate escuro (`dark:border-slate-800/60`).

### Layout da Home (Refinado)
- **Hero/Banner (Estilo aftermath.site):**
  - **Destaque Esquerdo (2/3):** Um card retangular grande. A imagem conta com um corte poligonal diagonal na base esquerda (`clip-path`).
  - **Metadados em Notch:** No vão diagonal cortado, encaixa-se uma tag retangular simples (sem cortes diagonais secundários) com fundo igual ao da página (branco no light, azul escuro/charcoal no dark), exibindo as informações no formato: `Categoria / Autor - Data` (ex: `GAMES / Zeca Games - 22 Abr, 2026`). Todo o conteúdo do título e resumo fica **abaixo da imagem** sobre fundo limpo para garantir máxima legibilidade.
  - **Destaque Direito (1/3):** Dois cards verticais menores empilhados. Ambos possuem imagens de capa completas no topo (`h-36 object-cover`) para preencher a verticalidade, equilibrando o peso visual da coluna.
  - **Interatividade:** Todo post (inclusive o hero e os destaques) deve ser empacotado sob um link overlay absoluto (`<a href="..." class="absolute inset-0 z-20"></a>`), tornando o card inteiro clicável.
- **Mural de Vagas (Jobs):**
  - Uma seção em três colunas com cards minimalistas e elegantes simulando oportunidades de design/desenvolvimento/UI. Fica posicionada logo abaixo da seção Hero.
- **Destaques da Semana:**
  - Uma linha com 3 colunas de cards para os artigos pilares perenes da semana.
- **Feed Principal (Estilo gamedeveloper.com):**
  - **Coluna da Esquerda (2/3):** Lista de **Últimas Publicações** contendo no mínimo **8 posts**. Um formulário de Newsletter destacado inline é inserido no meio deste feed (exatamente após o 2º post).
    - *Newsletter no Dark Mode:* O card do formulário inverte as cores (`bg-slate-950 text-white dark:bg-white dark:text-slate-950`) para gerar alto contraste visual tanto no tema claro quanto no escuro.
  - **Coluna da Direita (1/3 - Sidebar):**
    - **Mais Lidos:** Lista vertical estendida para **10 posts** com numeração grande em alto contraste (`text-slate-400 dark:text-zinc-500`).
    - **Sponsor (LivePix):** Widget contendo texto explicativo de incentivo e simulação gráfica de QR Code para chaves Pix.
    - **Afiliados Amazon:** Widget com 3 indicações de produtos de hardware com preços reais em Reais (Logitech G502, Keychron K2, HyperX QuadCast).

---

## 2. Especificações de SEO e Preservação de URLs

> [!IMPORTANT]
> **Preservação de Tráfego Orgânico:** A estrutura das URLs do WordPress atual serve os artigos diretamente na raiz do domínio (ex: `dougdesign.com.br/nome-do-post/`). Nenhuma subpasta `/blog/` ou `/posts/` deve ser criada.

### Roteamento e Páginas Dinâmicas
- O arquivo que renderiza as páginas dos artigos deve ser `src/pages/[slug].astro`.
- Usaremos as *Content Collections* do Astro no arquivo `src/content/config.ts` com validação de Zod para garantir integridade.
- A função `getStaticPaths()` vai ler todos os arquivos markdown da coleção de posts e mapear a propriedade `slug` definida no frontmatter. Se o slug não for definido, assume o nome do arquivo.

### Componente SEO.astro
Injetar no `<head>` de todas as páginas o componente `src/components/SEO.astro`, que lidará com:
- **Title Tags:** `Título do Post | Doug Design` (máximo de 60 caracteres).
- **Meta Descriptions:** Extraído da propriedade `meta_description` do frontmatter (entre 120 e 155 caracteres).
- **Canonical URLs:** Apontar de forma absoluta para a URL final construída para evitar duplicidade de páginas.
- **OpenGraph & Twitter Cards:** Configuração de `og:title`, `og:description`, `og:image` (apontando para a capa otimizada) e `twitter:card` como `summary_large_image`.
- **Structured Data (JSON-LD):** Tags de dados estruturados do tipo `BlogPosting` ou `Article`, mapeando propriedades como `author` (ex: `Zeca Games`, `Guto Tech` que possuem EEAT perante o Google) e `datePublished`.

---

## 3. Otimizações de Performance (Lighthouse 100)

1.  **Imagens Locais Otimizadas (`astro:assets`):**
    - Todas as imagens de destaque dos posts antigos (atualmente salvas no WordPress externo) devem ser baixadas localmente para `src/assets/images/`.
    - Criaremos o script `scripts/download-images.ts` para varrer os posts importados, fazer o download dos arquivos JPG/PNG da CDN do WordPress legada e atualizar a referência do frontmatter para o caminho relativo.
    - Em todos os cards e páginas, usaremos o componente `<Image />` do Astro, gerando automaticamente formatos responsivos WebP e AVIF com largura (`width`) e proporção de aspecto explícitas.
2.  **Otimização do LCP (Largest Contentful Paint):**
    - A imagem de capa do card Hero esquerdo (post principal de destaque) e das duas menores da direita **não** devem ter lazy loading. Devemos aplicar a elas as propriedades `loading="eager"` e `fetchpriority="high"` diretamente no markup HTML.
    - As demais imagens da página (mural de vagas, destaques, feed de posts) devem usar `loading="lazy"`.
3.  **Javascript Crítico Zero:**
    - As páginas de leitura de post devem ser renderizadas puramente em HTML estático (Zero JS no bundle principal).
    - O controle do Dark Mode no `Header` usará um script em linha ultra-rápido no `<head>` para aplicar a classe `.dark` antes da renderização do HTML, prevenindo o flash de cor (FOUC).
4.  **Pré-conexão de Fontes:**
    - Fazer `<link rel="preconnect">` no cabeçalho para `fonts.googleapis.com` e `fonts.gstatic.com`. Fontes locais integradas no Tailwind são recomendadas para atingir o benchmark.

---

## 4. Integração do Google AdSense

Utilizaremos o script assíncrono oficial no `<head>` do layout:
```html
<script type="text/javascript" async="async" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5927498436558135&amp;host=ca-host-pub-2644536267352236" crossorigin="anonymous"></script>
```

Criação do componente `<AdSense slot="..." layout="..." />` para exibir anúncios nos seguintes locais específicos mapeados no protótipo, integrando-os de forma responsiva para não estourar o layout e sem quebrar as métricas do Core Web Vitals:
1.  **Ad 1 (Banner de Topo):** Posicionado acima do Hero, abaixo do Header, centralizado. Configuração responsiva (idealmente banners horizontais como 728x90 ou 970x90).
2.  **Ad 2 (Inline Feed):** Inserido no feed da esquerda entre o 4º e o 5º post de Últimas Publicações. O bloco usará o formato de "In-feed Ads" do AdSense (anúncios integrados que combinam com o layout da lista).
3.  **Ad 3 (Retângulo Lateral):** Inserido na barra lateral direita, posicionado entre a seção "Mais Lidos" e o widget do LivePix. O tamanho recomendado é o bloco clássico 300x250.

---

## 5. Arquitetura do Mural de Jobs e Painel de Controle

### Fluxo de Envio de Vagas
O envio de vagas funcionará de forma estática (SSG) e assíncrona, economizando infraestrutura de servidor:
1.  O botão "Anunciar Oportunidade" no mural de vagas direciona o usuário para um formulário de cadastro estruturado (Google Forms / Tally.so).
2.  Após aprovação, os dados da vaga são convertidos em um arquivo de texto Markdown na pasta `src/content/jobs/` (ex: `src/content/jobs/vaga-programador-astro.md`) com o frontmatter contendo tags, remuneração, empresa, data de expiração e descrição.
3.  O Astro lê as vagas ativas durante o build do site, ordenando-as da mais nova para a mais antiga no componente `MuralJobs.astro`.

### Painel de Controle (TinaCMS)
Não utilizaremos painéis dinâmicos integrados a bancos de dados clássicos (SQL/NoSQL) em produção para manter a velocidade do site. Se for necessária uma interface amigável para edição visual de posts e vagas, será integrado o **TinaCMS** (ou Decap CMS):
- **Como funciona:** O painel roda como uma aplicação estática local ou em rota autenticada. As edições de texto salvam arquivos markdown locais. Ao submeter em produção, o CMS realiza um commit automático no repositório GitHub via API. A Vercel detecta a alteração e atualiza o blog em menos de 1 minuto de forma automática.

---

## 6. Atualização dos Agentes de IA

A pasta `.agents`, as diretrizes de escrita do arquivo `AGENTS.md` e a CLI em `tools/` serão migradas do repositório legador `dougdesign-seo` para o novo `dougdesign-astro`.

As seguintes modificações serão aplicadas:
1.  **Remoção de rotinas legadas:** Os scripts de autenticação no WordPress via Selenium/Puppeteer e publicação via REST API serão descontinuados no novo repositório.
2.  **Regra de escrita baseada em arquivos:** O agente deve escrever posts diretamente em `src/content/blog/` (ou em `src/content/drafts/` para aprovação do usuário) respeitando o esquema Zod definido no Astro.
3.  **CLI de Validação:** A CLI local terá comandos TypeScript (via Bun) para validar o frontmatter localmente (`npm run cli audit`) antes de disparar o commit de publicação para o GitHub/Vercel.

---

## 7. Passos de Execução Detalhados

1.  **Passo 1: Setup Inicial do Astro v7**
    *   Instalar dependências de Tailwind CSS no projeto `dougdesign-astro`.
    *   Configurar `astro.config.mjs` com as integrações e adaptador Vercel.
2.  **Passo 2: Migração do Acervo**
    *   Importar os arquivos markdown antigos de `posts/` para `src/content/blog/`.
    *   Configurar o Zod schema em `src/content/config.ts`.
    *   Criar e executar o script `download-images.ts` para baixar todas as capas antigas do WordPress online para `src/assets/images/`.
3.  **Passo 3: Construção dos Componentes e Rotas**
    *   Substituir a home original pelas seções criadas no protótipo (`Header`, `TickerUrgente`, `Hero`, `MuralJobs`, `Destaques`, `Feed`, `Sidebar` com LivePix, Amazon e AdSense).
    *   Montar a rota dinâmica `src/pages/[slug].astro` com suporte a comentários Giscus integrados e View Transitions.
4.  **Passo 4: Portabilidade dos Agentes**
    *   Mover pasta `.agents`, configurar o novo `AGENTS.md` definindo o fluxo Git-based e adaptar a CLI.
5.  **Passo 5: Deploy e Validação**
    *   Subir o projeto para a Vercel e validar com o Google PageSpeed Insights, assegurando nota 100 em Core Web Vitals.
