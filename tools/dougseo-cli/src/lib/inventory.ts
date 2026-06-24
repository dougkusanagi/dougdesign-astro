import fs from 'node:fs';
import path from 'node:path';
import { INVENTORY_CATEGORIES_DIR, INVENTORY_DIR, currentIso, ensureDir } from './config';
import { indexAllPosts } from './content-index';

export interface InventoryStats {
  generatedAt: string;
  total: number;
  drafts: number;
  scheduled: number;
  published: number;
  categories: Record<string, number>;
  authors: Record<string, number>;
  fileLinks: number;
}

export function buildInventory(): InventoryStats {
  ensureDir(INVENTORY_DIR);
  ensureDir(INVENTORY_CATEGORIES_DIR);
  const posts = indexAllPosts();
  const categories: Record<string, number> = {};
  const authors: Record<string, number> = {};
  let fileLinks = 0;

  for (const post of posts) {
    categories[post.category] = (categories[post.category] ?? 0) + 1;
    authors[post.author] = (authors[post.author] ?? 0) + 1;
    if (post.body.includes('file://')) fileLinks += 1;
  }

  const stats: InventoryStats = {
    generatedAt: currentIso(),
    total: posts.length,
    drafts: posts.filter((post) => post.draft).length,
    scheduled: posts.filter((post) => post.scheduled).length,
    published: posts.filter((post) => !post.draft).length,
    categories,
    authors,
    fileLinks,
  };

  fs.writeFileSync(path.join(INVENTORY_DIR, 'posts.json'), `${JSON.stringify(posts.map((post) => ({
    slug: post.slug,
    url: post.url,
    title: post.title,
    category: post.category,
    categorySlug: post.categorySlug,
    author: post.author,
    draft: post.draft,
    scheduled: post.scheduled,
    pubDate: post.pubDate,
    assunto: post.assunto,
    intencao_busca: post.intencao_busca,
    wordCount: post.wordCount,
  })), null, 2)}\n`);
  fs.writeFileSync(path.join(INVENTORY_DIR, 'stats.json'), `${JSON.stringify(stats, null, 2)}\n`);

  const categoryEntries = Object.entries(categories).sort((a, b) => a[0].localeCompare(b[0]));
  for (const [category] of categoryEntries) {
    const categoryPosts = posts.filter((post) => post.category === category).sort((a, b) => b.pubDate.localeCompare(a.pubDate));
    const lines = [
      `# Inventario - ${category}`,
      '',
      '| status | slug | titulo | url | assunto | intencao_busca | data | autor |',
      '| --- | --- | --- | --- | --- | --- | --- | --- |',
      ...categoryPosts.map((post) => `| ${post.draft ? (post.scheduled ? 'scheduled' : 'draft') : 'publish'} | \`${post.slug}\` | ${post.title.replace(/\|/g, '\\|')} | ${post.url} | ${post.assunto.replace(/\|/g, '\\|')} | ${post.intencao_busca.replace(/\|/g, '\\|')} | ${post.pubDate} | ${post.author.replace(/\|/g, '\\|')} |`),
      '',
    ];
    fs.writeFileSync(path.join(INVENTORY_CATEGORIES_DIR, `${postCategoryFileName(category)}.md`), lines.join('\n'));
  }

  const authorLines = [
    '# Autores',
    '',
    '| autor | posts |',
    '| --- | --- |',
    ...Object.entries(authors).sort((a, b) => b[1] - a[1]).map(([author, total]) => `| ${author.replace(/\|/g, '\\|')} | ${total} |`),
    '',
  ];
  fs.writeFileSync(path.join(INVENTORY_DIR, 'authors.md'), authorLines.join('\n'));

  return stats;
}

export function readInventoryStats(): InventoryStats {
  const inventoryPath = path.join(INVENTORY_DIR, 'stats.json');
  if (!fs.existsSync(inventoryPath)) {
    return buildInventory();
  }
  return JSON.parse(fs.readFileSync(inventoryPath, 'utf-8')) as InventoryStats;
}

function postCategoryFileName(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
