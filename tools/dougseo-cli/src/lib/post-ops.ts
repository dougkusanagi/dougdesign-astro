import fs from 'node:fs';
import { currentIso } from './config';
import { findPostBySlug } from './content-index';
import { loadFrontmatterFile, stringifyFrontmatter } from './frontmatter';

function writePost(filePath: string, frontmatter: Record<string, any>, body: string): void {
  fs.writeFileSync(filePath, stringifyFrontmatter(frontmatter, body), 'utf-8');
}

export function publishPost(slug: string): { slug: string; filePath: string } {
  const post = findPostBySlug(slug);
  const { frontmatter, body } = loadFrontmatterFile(post.filePath);
  frontmatter.slug = post.slug;
  frontmatter.draft = false;
  frontmatter.scheduled = false;
  frontmatter.author = post.author;
  frontmatter.category = post.category;
  frontmatter.updatedDate = currentIso();
  writePost(post.filePath, frontmatter, body);
  return { slug: post.slug, filePath: post.filePath };
}

export function schedulePost(slug: string, isoDate: string): { slug: string; filePath: string; pubDate: string } {
  const parsedDate = new Date(isoDate);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`Data inválida para agendamento: ${isoDate}`);
  }
  if (parsedDate.getTime() <= Date.now()) {
    throw new Error('A data de agendamento precisa estar no futuro.');
  }
  const post = findPostBySlug(slug);
  const { frontmatter, body } = loadFrontmatterFile(post.filePath);
  frontmatter.slug = post.slug;
  frontmatter.draft = true;
  frontmatter.scheduled = true;
  frontmatter.pubDate = parsedDate.toISOString();
  frontmatter.updatedDate = currentIso();
  writePost(post.filePath, frontmatter, body);
  return { slug: post.slug, filePath: post.filePath, pubDate: parsedDate.toISOString() };
}

export function updatePostSources(slug: string, sourceUrls: string[]): { slug: string; filePath: string } {
  const post = findPostBySlug(slug);
  const { frontmatter, body } = loadFrontmatterFile(post.filePath);
  const existing = new Set<string>((frontmatter.fontes_oficiais as string[] | undefined) ?? []);
  for (const source of sourceUrls) existing.add(source);
  frontmatter.fontes_oficiais = [...existing];
  frontmatter.updatedDate = currentIso();
  if (!frontmatter.fato_novo && sourceUrls[0]) {
    frontmatter.fato_novo = sourceUrls[0];
  }
  writePost(post.filePath, frontmatter, body);
  return { slug: post.slug, filePath: post.filePath };
}
