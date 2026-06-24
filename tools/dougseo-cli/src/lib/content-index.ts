import fs from 'node:fs';
import path from 'node:path';
import { BLOG_DIR, countWords, slugify } from './config';
import { loadFrontmatterFile } from './frontmatter';
import { canonicalCategoryLabel, canonicalCategorySlug, normalizeAuthor } from './taxonomy';

export interface IndexedPost {
  filePath: string;
  fileName: string;
  slug: string;
  url: string;
  title: string;
  category: string;
  categorySlug: string;
  author: string;
  draft: boolean;
  scheduled: boolean;
  pubDate: string;
  updatedDate?: string;
  assunto: string;
  intencao_busca: string;
  content_type?: string;
  cluster?: string;
  body: string;
  frontmatter: Record<string, any>;
  wordCount: number;
}

function inferSubject(frontmatter: Record<string, any>, slug: string, title: string): string {
  return String(frontmatter.assunto || frontmatter.keyword_principal || title || slug.replace(/-/g, ' ')).trim();
}

function inferIntent(frontmatter: Record<string, any>, title: string): string {
  return String(frontmatter.intencao_busca || frontmatter.meta_description || title).trim();
}

export function getAllPostPaths(): string[] {
  return fs.readdirSync(BLOG_DIR)
    .filter((file) => !file.startsWith('.') && (file.endsWith('.md') || file.endsWith('.mdx')))
    .map((file) => path.join(BLOG_DIR, file))
    .sort();
}

export function indexPost(filePath: string): IndexedPost {
  const { frontmatter, body } = loadFrontmatterFile(filePath);
  const fileName = path.basename(filePath);
  const fallbackSlug = path.basename(filePath, path.extname(filePath));
  const slug = String(frontmatter.slug || fallbackSlug).trim();
  const title = String(frontmatter.title || fallbackSlug);
  const category = canonicalCategoryLabel(String(frontmatter.category || 'Games'));
  const categorySlug = canonicalCategorySlug(category);
  const author = normalizeAuthor(String(frontmatter.author || ''), category);
  const pubDate = String(frontmatter.pubDate || new Date().toISOString());
  return {
    filePath,
    fileName,
    slug,
    url: `https://dougdesign.com.br/${slug}/`,
    title,
    category,
    categorySlug,
    author,
    draft: Boolean(frontmatter.draft),
    scheduled: Boolean(frontmatter.scheduled),
    pubDate,
    updatedDate: frontmatter.updatedDate ? String(frontmatter.updatedDate) : undefined,
    assunto: inferSubject(frontmatter, slug, title),
    intencao_busca: inferIntent(frontmatter, title),
    content_type: frontmatter.content_type ? String(frontmatter.content_type) : undefined,
    cluster: frontmatter.cluster ? String(frontmatter.cluster) : undefined,
    body,
    frontmatter,
    wordCount: countWords(body),
  };
}

export function indexAllPosts(): IndexedPost[] {
  return getAllPostPaths().map(indexPost);
}

export function findPostBySlug(slugOrPath: string): IndexedPost {
  const normalized = slugify(slugOrPath);
  const post = indexAllPosts().find((entry) => slugify(entry.slug) === normalized);
  if (!post) {
    throw new Error(`Post nao encontrado para slug ${slugOrPath}`);
  }
  return post;
}

export function isDueScheduledPost(post: IndexedPost, now = new Date()): boolean {
  return post.draft && post.scheduled && new Date(post.pubDate).getTime() <= now.getTime();
}
