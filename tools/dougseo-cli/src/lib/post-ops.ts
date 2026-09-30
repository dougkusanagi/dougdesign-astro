import fs from 'node:fs';
import { validateScheduledDate } from './dates';
import { auditPosts } from './audit';
import { findPostBySlug } from './content-index';
import { loadFrontmatterFile, stringifyFrontmatter } from './frontmatter';

function writePost(filePath: string, frontmatter: Record<string, any>, body: string): void {
  fs.writeFileSync(filePath, stringifyFrontmatter(frontmatter, body), 'utf-8');
}

export function publishPost(slug: string): { slug: string; filePath: string } {
  const post = findPostBySlug(slug);
  const { frontmatter, body } = loadFrontmatterFile(post.filePath);
  const stamp = Date.parse(post.pubDate);
  if (!Number.isFinite(stamp) || stamp > Date.now()) throw new Error('Publicação exige pubDate válida e não futura.');
  const issues = auditPosts('all', { slug: post.slug });
  if (issues.length) throw new Error(`Post não está pronto: ${issues[0].issues.join(' | ')}`);
  frontmatter.slug = post.slug;
  frontmatter.draft = false;
  frontmatter.scheduled = false;
  writePost(post.filePath, frontmatter, body);
  return { slug: post.slug, filePath: post.filePath };
}

export function schedulePost(slug: string, isoDate: string): { slug: string; filePath: string; pubDate: string } {
  validateScheduledDate(isoDate);
  const post = findPostBySlug(slug);
  if (!post.draft) throw new Error('Não reagende um artigo publicado; preserve URL e pubDate.');
  const issues = auditPosts('all', { slug: post.slug });
  if (issues.length) throw new Error(`Post não está pronto: ${issues[0].issues.join(' | ')}`);
  const { frontmatter, body } = loadFrontmatterFile(post.filePath);
  frontmatter.slug = post.slug;
  frontmatter.draft = true;
  frontmatter.scheduled = true;
  frontmatter.pubDate = isoDate;
  writePost(post.filePath, frontmatter, body);
  return { slug: post.slug, filePath: post.filePath, pubDate: isoDate };
}

export function updatePostSources(slug: string, sourceUrls: string[]): { slug: string; filePath: string } {
  const post = findPostBySlug(slug);
  const { frontmatter, body } = loadFrontmatterFile(post.filePath);
  const existing = new Set<string>((frontmatter.fontes_oficiais as string[] | undefined) ?? []);
  for (const source of sourceUrls) existing.add(source);
  frontmatter.fontes_oficiais = [...existing];
  writePost(post.filePath, frontmatter, body);
  return { slug: post.slug, filePath: post.filePath };
}
