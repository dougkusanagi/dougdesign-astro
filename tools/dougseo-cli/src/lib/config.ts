import fs from 'node:fs';
import path from 'node:path';

export const CLI_ROOT = path.resolve(import.meta.dir, '..', '..');
export const REPO_ROOT = path.resolve(CLI_ROOT, '..', '..');
export const BLOG_DIR = path.join(REPO_ROOT, 'src', 'content', 'blog');
export const COVERS_DIR = path.join(REPO_ROOT, 'src', 'assets', 'images', 'posts');
export const EDITORIAL_DIR = path.join(REPO_ROOT, 'editorial');
export const INVENTORY_DIR = path.join(EDITORIAL_DIR, 'inventory');
export const INVENTORY_CATEGORIES_DIR = path.join(INVENTORY_DIR, 'categories');
export const TAXONOMY_PATH = path.join(EDITORIAL_DIR, 'config', 'taxonomy.yml');

export function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function countWords(text: string): number {
  return text.match(/\b[\p{L}\p{N}_'-]+\b/gu)?.length ?? 0;
}

export function currentIso(): string {
  return new Date().toISOString();
}

export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}
