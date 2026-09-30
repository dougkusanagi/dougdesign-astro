import type { BlogEntry } from './blog';
import { getCategorySlug, getPublishedPosts } from './blog';

export interface CategoryMeta {
  slug: string;
  label: string;
  short: string;
  blurb: string;
}

/**
 * Single source of truth for the category taxonomy shown in the UI
 * (mega menu, footer, category pages, filters). Labels carry proper pt-BR
 * accents; content frontmatter keeps its unaccented values.
 */
export const CATEGORIES: CategoryMeta[] = [
  { slug: 'games', label: 'Games', short: 'Games', blurb: 'Lançamentos, assinaturas e análises para console e PC.' },
  { slug: 'tecnologia', label: 'Tecnologia', short: 'Tecnologia', blurb: 'Gadgets, software e o que muda no seu dia a dia.' },
  { slug: 'inteligencia-artificial', label: 'Inteligência Artificial', short: 'IA', blurb: 'Modelos, ferramentas e usos práticos de IA.' },
  { slug: 'programacao', label: 'Programação', short: 'Programação', blurb: 'Guias, frameworks e boas práticas para quem desenvolve.' },
  { slug: 'web-design', label: 'Web Design', short: 'Web Design', blurb: 'Interface, UX e design systems na prática.' },
  { slug: 'mobile', label: 'Mobile', short: 'Mobile', blurb: 'Smartphones, apps e privacidade no celular.' },
  { slug: 'hardware', label: 'Hardware', short: 'Hardware', blurb: 'Componentes, periféricos e decisões de compra.' },
  { slug: 'educacao', label: 'Educação', short: 'Educação', blurb: 'Cursos, carreira e formas de aprender tecnologia.' },
];

/** Posts per page on category listings. */
export const CATEGORY_PAGE_SIZE = 18;

const bySlug = new Map(CATEGORIES.map((category) => [category.slug, category]));

export function getCategoryMeta(value: string): CategoryMeta | undefined {
  return bySlug.get(getCategorySlug(value));
}

export function categoryLabelOf(value: string): string {
  return getCategoryMeta(value)?.label ?? value;
}

export interface CategoryStat extends CategoryMeta {
  count: number;
  latest: BlogEntry[];
}

let cachedStats: Promise<CategoryStat[]> | undefined;

async function computeStats(): Promise<CategoryStat[]> {
  const posts = await getPublishedPosts();
  const buckets = new Map<string, BlogEntry[]>();
  for (const post of posts) {
    const slug = getCategorySlug(post.data.category);
    const list = buckets.get(slug);
    if (list) list.push(post);
    else buckets.set(slug, [post]);
  }
  return CATEGORIES.filter((category) => buckets.has(category.slug)).map((category) => {
    const list = buckets.get(category.slug) ?? [];
    return { ...category, count: list.length, latest: list.slice(0, 3) };
  });
}

/** Categories with post counts and their three newest posts (posts arrive newest-first). */
export function getCategoryStats(): Promise<CategoryStat[]> {
  if (import.meta.env.DEV) return computeStats();
  cachedStats ??= computeStats();
  return cachedStats;
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'America/Sao_Paulo',
});

/** "30 set 2026" — deterministic at build time (no "hoje/ontem" that goes stale between deploys). */
export function formatPostDate(date: Date): string {
  const parts = Object.fromEntries(dateFormatter.formatToParts(date).map((part) => [part.type, part.value]));
  return `${parts.day} ${String(parts.month).replace('.', '')} ${parts.year}`;
}
