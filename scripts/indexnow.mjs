#!/usr/bin/env node
/**
 * Avisa Bing, Yandex e outros buscadores (IndexNow) sobre URLs novas ou alteradas.
 *
 *   node scripts/indexnow.mjs                  # posts alterados em HEAD~1..HEAD
 *   node scripts/indexnow.mjs <base> <head>    # posts alterados entre dois commits
 *   node scripts/indexnow.mjs --all            # todas as URLs do sitemap publicado
 *   node scripts/indexnow.mjs --dry-run ...    # só imprime as URLs
 *
 * A chave é pública por desenho: o arquivo public/<chave>.txt prova a propriedade do domínio.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const KEY = 'de79c4e9953200030b98f28bcebdf0ce';
const HOST = 'www.dougdesign.com.br';
const SITE = `https://${HOST}`;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const positional = args.filter((arg) => !arg.startsWith('--'));

function frontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  return match ? match[1] : '';
}

function field(block, name) {
  const match = block.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
  return match ? match[1].trim().replace(/^["']|["']$/g, '') : undefined;
}

function changedPostUrls(base, head) {
  const files = execFileSync('git', ['diff', '--name-only', '--diff-filter=AM', base, head, '--', 'src/content/blog'], { encoding: 'utf8' })
    .split('\n')
    .filter((file) => /\.mdx?$/.test(file));
  const urls = [];
  for (const file of files) {
    const block = frontmatter(readFileSync(file, 'utf8'));
    if (field(block, 'draft') === 'true') continue;
    const slug = field(block, 'slug') || file.split('/').pop().replace(/\.mdx?$/, '');
    urls.push(`${SITE}/${slug}/`);
  }
  return urls;
}

async function sitemapUrls() {
  const index = await (await fetch(`${SITE}/sitemap-index.xml`)).text();
  const maps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const urls = [];
  for (const map of maps) {
    const xml = await (await fetch(map)).text();
    urls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
  }
  return urls;
}

const urls = args.includes('--all')
  ? await sitemapUrls()
  : changedPostUrls(positional[0] ?? 'HEAD~1', positional[1] ?? 'HEAD');

if (urls.length === 0) {
  console.log('IndexNow: nenhuma URL para enviar.');
  process.exit(0);
}

console.log(`IndexNow: ${urls.length} URL(s)`);
if (dryRun) {
  console.log(urls.join('\n'));
  process.exit(0);
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls.slice(0, 10000) }),
});
console.log(`IndexNow respondeu HTTP ${response.status}`);
if (response.status >= 400) process.exit(1);
