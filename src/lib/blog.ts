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

/**
 * Picks follow-up reading for an article: same cluster first, then same
 * category, newest first. Pure and build-time only.
 */
export function getRelatedPosts(current: BlogEntry, all: BlogEntry[], limit = 3): BlogEntry[] {
  const currentCategory = getCategorySlug(current.data.category);
  return all
    .filter((post) => post.id !== current.id)
    .map((post) => {
      let score = 0;
      if (getCategorySlug(post.data.category) === currentCategory) score += 2;
      if (current.data.cluster && post.data.cluster === current.data.cluster) score += 3;
      if (current.data.keyword_principal && post.data.keyword_principal === current.data.keyword_principal) score += 1;
      return { post, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.post.data.pubDate.getTime() - a.post.data.pubDate.getTime())
    .slice(0, limit)
    .map((entry) => entry.post);
}
