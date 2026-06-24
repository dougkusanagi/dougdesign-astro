import fs from 'node:fs';
import { indexAllPosts } from './content-index';
import { loadFrontmatterFile, stringifyFrontmatter } from './frontmatter';
import { canonicalCategoryLabel, normalizeAuthor } from './taxonomy';

function inferCategory(title: string, slug: string): string {
  const haystack = `${title} ${slug}`.toLowerCase();
  if (/(switch|xbox|playstation|ps5|ps plus|game pass|steam|nintendo|jogo|games|gamechat|joy-con)/.test(haystack)) return 'Games';
  if (/(figma|design system|\bui\b|\bux\b|webgpu|css|layout|web design|design tokens)/.test(haystack)) return 'Web Design';
  if (/(astro|typescript|javascript|react|next|backend|front-end|front end|programacao|programação|vscode|java|spring)/.test(haystack)) return 'Programacao';
  if (/(iphone|android|ios|smartphone|celular|tablet|wearable|app mobile)/.test(haystack)) return 'Mobile';
  if (/(gpu|ryzen|intel|ram|hardware|notebook|console portatil|chip)/.test(haystack)) return 'Hardware';
  if (/(gpt|claude|gemini|llm|inteligencia artificial|ia | ai )/.test(haystack)) return 'Inteligencia Artificial';
  return 'Tecnologia';
}

function inferContentType(title: string, slug: string): string {
  const haystack = `${title} ${slug}`.toLowerCase();
  if (/(vale|guia|como )/.test(haystack)) return 'guia';
  if (/(vs|compar)/.test(haystack)) return 'comparativo';
  if (/(update|patch)/.test(haystack)) return 'update';
  return 'noticia';
}

function inferCluster(category: string, slug: string): string {
  const haystack = `${category} ${slug}`.toLowerCase();
  if (haystack.includes('switch-2') || haystack.includes('switch 2')) return 'switch-2';
  if (haystack.includes('game-pass') || haystack.includes('ps-plus')) return 'assinaturas';
  if (haystack.includes('design')) return 'design-systems';
  if (haystack.includes('ia') || haystack.includes('gpt') || haystack.includes('claude') || haystack.includes('gemini')) return 'ia-aplicada';
  return category.toLowerCase().replace(/\s+/g, '-');
}

function externalUrls(body: string): string[] {
  const urls = body.match(/https:\/\/[^\s)]+/g) ?? [];
  return [...new Set(urls.filter((url) => !url.includes('dougdesign.com.br')).map((url) => url.replace(/[.,;]+$/, '')))];
}

function publicUrlFromFileLink(value: string): string {
  return value.replace(/file:\/\/[^\s)]+\/([^/]+)\.md/g, 'https://dougdesign.com.br/$1/');
}

export function normalizeContent(write = false): Array<{ slug: string; changes: string[] }> {
  const changes = [];
  for (const post of indexAllPosts()) {
    const { frontmatter, body } = loadFrontmatterFile(post.filePath);
    const pending: string[] = [];
    const nextBody = body.includes('file://') ? publicUrlFromFileLink(body) : body;

    if (!frontmatter.slug) {
      frontmatter.slug = post.slug;
      pending.push('backfill slug');
    }
    if (frontmatter.scheduled === undefined) {
      frontmatter.scheduled = false;
      pending.push('backfill scheduled');
    }
    let normalizedCategory = canonicalCategoryLabel(String(frontmatter.category || post.category));
    if (normalizedCategory === 'Guia' || normalizedCategory === 'Pilar Editorial') {
      normalizedCategory = inferCategory(String(frontmatter.title || post.title), post.slug);
      pending.push('infer category from title');
    }
    if (frontmatter.category !== normalizedCategory) {
      frontmatter.category = normalizedCategory;
      pending.push('normalize category');
    }
    const normalizedAuthor = normalizeAuthor(String(frontmatter.author || post.author), normalizedCategory);
    if (frontmatter.author !== normalizedAuthor) {
      frontmatter.author = normalizedAuthor;
      pending.push('normalize author');
    }
    if (nextBody !== body) {
      pending.push('replace file:// links');
    }
    if (!frontmatter.updatedDate) {
      frontmatter.updatedDate = frontmatter.pubDate || post.pubDate;
      pending.push('backfill updatedDate');
    }
    if (!frontmatter.readingTime) {
      frontmatter.readingTime = `${Math.max(1, Math.ceil(post.wordCount / 200))} min`;
      pending.push('backfill readingTime');
    }
    if (!frontmatter.featured_image) {
      const imagePath = String(frontmatter.image || '');
      frontmatter.featured_image = {
        prompt: '',
        alt: String(frontmatter.title || post.title),
        generated_path: imagePath.startsWith('../../') ? `src/assets/${imagePath.replace('../../assets/', '')}` : '',
      };
      pending.push('backfill featured_image');
    }
    if (!frontmatter.keyword_principal) {
      frontmatter.keyword_principal = frontmatter.assunto || frontmatter.title || post.title;
      pending.push('backfill keyword_principal');
    }
    if (!frontmatter.content_type) {
      frontmatter.content_type = inferContentType(String(frontmatter.title || post.title), post.slug);
      pending.push('backfill content_type');
    }
    if (!frontmatter.cluster) {
      frontmatter.cluster = inferCluster(String(frontmatter.category || normalizedCategory), post.slug);
      pending.push('backfill cluster');
    }
    if (!frontmatter.assunto) {
      frontmatter.assunto = String(frontmatter.title || post.title);
      pending.push('backfill assunto');
    }
    if (!frontmatter.intencao_busca) {
      frontmatter.intencao_busca = String(frontmatter.meta_description || frontmatter.description || frontmatter.title || post.title);
      pending.push('backfill intencao_busca');
    }
    if (!frontmatter.decisao_do_leitor) {
      frontmatter.decisao_do_leitor = 'decidir';
      pending.push('backfill decisao_do_leitor');
    }
    if (!frontmatter.fato_novo) {
      frontmatter.fato_novo = String(frontmatter.title || post.title);
      pending.push('backfill fato_novo');
    }
    if (!frontmatter.canonical_role) {
      frontmatter.canonical_role = 'apoio';
      pending.push('backfill canonical_role');
    }
    if (!frontmatter.internal_links) {
      frontmatter.internal_links = { to: [], from_needed: [] };
      pending.push('backfill internal_links');
    }
    if (!frontmatter.quality_notes) {
      frontmatter.quality_notes = { below_word_target_reason: post.wordCount < 150 ? 'Conteudo legado ainda nao auditado em profundidade.' : null };
      pending.push('backfill quality_notes');
    }
    if (!frontmatter.canibalizacao) {
      frontmatter.canibalizacao = {
        status: 'legado-importado',
        resumo: 'Conteudo importado para a stack Astro; revisar antes de republicar ou expandir.',
      };
      pending.push('backfill canibalizacao');
    }
    if (!frontmatter.fontes_oficiais) {
      frontmatter.fontes_oficiais = externalUrls(nextBody).slice(0, 8);
      pending.push('backfill fontes_oficiais');
    }
    if (pending.length && write) {
      fs.writeFileSync(post.filePath, stringifyFrontmatter(frontmatter, nextBody), 'utf-8');
    }
    if (pending.length) {
      changes.push({ slug: post.slug, changes: pending });
    }
  }
  return changes;
}
