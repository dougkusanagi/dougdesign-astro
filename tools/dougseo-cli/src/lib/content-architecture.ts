import fs from 'node:fs';
import path from 'node:path';
import { EDITORIAL_DIR, currentIso, ensureDir, slugify } from './config';
import { indexAllPosts } from './content-index';

const REPORTS_DIR = path.join(EDITORIAL_DIR, 'reports');
const SITE_ORIGIN = 'https://dougdesign.com.br';

function normalize(value: string): string {
  return slugify(value).replace(/-/g, ' ').trim();
}

export function auditContentArchitecture() {
  const posts = indexAllPosts().filter((post) => !post.draft);
  const byIntent = new Map<string, typeof posts>();
  for (const post of posts) {
    const key = `${normalize(post.assunto)}::${normalize(post.intencao_busca)}`;
    byIntent.set(key, [...(byIntent.get(key) ?? []), post]);
  }

  const duplicates = [...byIntent.entries()]
    .filter(([, entries]) => entries.length > 1)
    .map(([key, entries]) => ({
      key,
      canonicalCandidate: entries.sort((a, b) => (b.wordCount - a.wordCount) || (new Date(a.updatedDate || a.pubDate).getTime() - new Date(b.updatedDate || b.pubDate).getTime()))[0].slug,
      posts: entries.map((post) => ({ slug: post.slug, title: post.title, wordCount: post.wordCount, canonicalRole: post.frontmatter.canonical_role })),
    }));

  const knownUrls = new Set(posts.map((post) => `${SITE_ORIGIN}/${post.slug}/`));
  const brokenLinks = posts.flatMap((post) => {
    const urls = [...post.body.matchAll(/https:\/\/dougdesign\.com\.br\/([a-z0-9-]+)\/?/gi)].map((match) => `${SITE_ORIGIN}/${match[1]}/`);
    return [...new Set(urls)].filter((url) => !knownUrls.has(url)).map((url) => ({ slug: post.slug, url }));
  });
  const inbound = new Map<string, number>();
  for (const post of posts) {
    const urls = [...post.body.matchAll(/https:\/\/dougdesign\.com\.br\/([a-z0-9-]+)\/?/gi)].map((match) => `${SITE_ORIGIN}/${match[1]}/`);
    for (const url of new Set(urls)) inbound.set(url, (inbound.get(url) ?? 0) + 1);
  }
  const orphaned = posts.filter((post) => !inbound.has(`${SITE_ORIGIN}/${post.slug}/`)).map((post) => ({ slug: post.slug, title: post.title, cluster: post.cluster }));
  const report = { generatedAt: currentIso(), totals: { posts: posts.length, duplicateGroups: duplicates.length, brokenLinks: brokenLinks.length, orphaned: orphaned.length }, duplicates, brokenLinks, orphaned };
  ensureDir(REPORTS_DIR);
  const reportPath = path.join(REPORTS_DIR, `content-architecture-${currentIso().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  return { reportPath, report };
}
