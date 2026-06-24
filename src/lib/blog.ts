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
