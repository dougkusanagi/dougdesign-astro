import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;

const CATEGORY_ALIASES: Record<string, string> = {
  games: 'Games',
  jogos: 'Games',
  tecnologia: 'Tecnologia',
  seguranca: 'Tecnologia',
  'inteligencia-artificial': 'Inteligencia Artificial',
  'inteligencia artificial': 'Inteligencia Artificial',
  programacao: 'Programacao',
  desenvolvimento: 'Programacao',
  'web-design': 'Web Design',
  'web design': 'Web Design',
  ui: 'Web Design',
  ux: 'Web Design',
  interface: 'Web Design',
  mobile: 'Mobile',
  hardware: 'Hardware',
  educacao: 'Educacao',
  'educação': 'Educacao',
};

export function slugifyCategory(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeCategoryLabel(value: string): string {
  const normalized = slugifyCategory(value).replace(/-/g, ' ');
  return CATEGORY_ALIASES[normalized] ?? CATEGORY_ALIASES[slugifyCategory(value)] ?? value;
}

export function getPostSlug(post: BlogEntry): string {
  return post.data.slug?.trim() || post.id;
}

export function getPostUrl(post: BlogEntry): string {
  return `/${getPostSlug(post)}/`;
}

export async function getPublishedPosts(): Promise<BlogEntry[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export function getCategorySlug(value: string): string {
  return slugifyCategory(normalizeCategoryLabel(value));
}

const STOPWORDS = new Set(
  'a o as os um uma uns umas de do da dos das em no na nos nas por para com sem sobre entre e ou que como qual quais quando onde mais menos muito ja ao aos ate ser vale pena guia novo nova 2024 2025 2026 2027 vs'.split(' '),
);

function topicTokens(entry: BlogEntry): Set<string> {
  const { title, keyword_principal, assunto } = entry.data;
  const text = [title, keyword_principal, assunto].filter(Boolean).join(' ');
  const tokens = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
  return new Set(tokens);
}

/**
 * Picks follow-up reading for an article. Topic overlap (words shared by title,
 * keyword and subject) dominates, because `cluster` is often just the category
 * and would otherwise return the newest post of the section. Same category and
 * explicit `internal_links.to` break ties. Pure and build-time only.
 */
export function getRelatedPosts(current: BlogEntry, all: BlogEntry[], limit = 3): BlogEntry[] {
  const currentCategory = getCategorySlug(current.data.category);
  const currentTokens = topicTokens(current);
  const planned = new Set(current.data.internal_links?.to ?? []);
  return all
    .filter((post) => post.id !== current.id)
    .map((post) => {
      let score = 0;
      const shared = [...topicTokens(post)].filter((token) => currentTokens.has(token)).length;
      score += Math.min(shared, 4) * 3;
      if (getCategorySlug(post.data.category) === currentCategory) score += 2;
      if (current.data.cluster && post.data.cluster === current.data.cluster) score += 1;
      if (current.data.keyword_principal && post.data.keyword_principal === current.data.keyword_principal) score += 1;
      if (planned.has(getPostSlug(post)) || planned.has(getPostUrl(post))) score += 6;
      return { post, score, shared };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.post.data.pubDate.getTime() - a.post.data.pubDate.getTime())
    .slice(0, limit)
    .map((entry) => entry.post);
}
