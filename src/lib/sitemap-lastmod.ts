import fs from 'node:fs';
import path from 'node:path';

/**
 * Datas de <lastmod> do sitemap, lidas direto do frontmatter dos posts.
 *
 * O Google só usa lastmod quando ele é consistentemente correto, então a data
 * vem de updatedDate (alterado apenas em revisão substancial) ou pubDate, nunca
 * da data do build. Roda no carregamento do astro.config, sem astro:content.
 */
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

function field(block: string, name: string): string | undefined {
  const match = block.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
  return match ? match[1].trim().replace(/^["']|["']$/g, '') : undefined;
}

function validDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function lastmodFromFrontmatter(fileName: string, text: string, now = new Date()): { path: string; lastmod: string } | undefined {
  const block = text.match(FRONTMATTER)?.[1];
  if (!block || field(block, 'draft') === 'true') return undefined;
  const pubDate = validDate(field(block, 'pubDate'));
  // Data de publicação futura indica agendamento ainda não promovido: não anunciar.
  if (!pubDate || pubDate > now) return undefined;
  const updatedDate = validDate(field(block, 'updatedDate'));
  // updatedDate adiantado por engano não vira lastmod futuro: limita ao momento do build.
  const latest = updatedDate && updatedDate > pubDate ? (updatedDate > now ? now : updatedDate) : pubDate;
  const slug = field(block, 'slug') || fileName.replace(/\.mdx?$/, '');
  return { path: `/${slug}/`, lastmod: latest.toISOString() };
}

/** Mapa pathname → lastmod ISO dos posts publicados, mais "/" e "/posts/" com a data mais recente. */
export function collectSitemapLastmod(blogDir: string, now = new Date()): Map<string, string> {
  const map = new Map<string, string>();
  let newest = '';
  for (const fileName of fs.readdirSync(blogDir)) {
    if (!/\.mdx?$/.test(fileName)) continue;
    const entry = lastmodFromFrontmatter(fileName, fs.readFileSync(path.join(blogDir, fileName), 'utf8'), now);
    if (!entry) continue;
    map.set(entry.path, entry.lastmod);
    if (entry.lastmod > newest) newest = entry.lastmod;
  }
  if (newest) {
    map.set('/', newest);
    map.set('/posts/', newest);
  }
  return map;
}
