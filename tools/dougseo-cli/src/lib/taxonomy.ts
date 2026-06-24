import fs from 'node:fs';
import YAML from 'yaml';
import { TAXONOMY_PATH, slugify } from './config';

interface TaxonomyCategory {
  label: string;
  aliases: string[];
  defaultAuthor: string;
}

interface TaxonomyFile {
  categories: Record<string, TaxonomyCategory>;
  authors?: Record<string, string>;
}

let cached: TaxonomyFile | null = null;

function loadTaxonomy(): TaxonomyFile {
  if (cached) return cached;
  cached = YAML.parse(fs.readFileSync(TAXONOMY_PATH, 'utf-8')) as TaxonomyFile;
  return cached;
}

export function canonicalCategorySlug(value: string): string {
  const taxonomy = loadTaxonomy();
  const normalized = slugify(value);
  for (const [slug, config] of Object.entries(taxonomy.categories)) {
    if (slug === normalized) return slug;
    if (config.aliases.some((alias) => slugify(alias) === normalized)) {
      return slug;
    }
  }
  return normalized;
}

export function canonicalCategoryLabel(value: string): string {
  const taxonomy = loadTaxonomy();
  const slug = canonicalCategorySlug(value);
  return taxonomy.categories[slug]?.label ?? value;
}

export function defaultAuthorForCategory(value: string): string {
  const taxonomy = loadTaxonomy();
  const slug = canonicalCategorySlug(value);
  return taxonomy.categories[slug]?.defaultAuthor ?? 'Zeca Games';
}

export function normalizeAuthor(value: string, category: string): string {
  const taxonomy = loadTaxonomy();
  if (!value?.trim()) return defaultAuthorForCategory(category);
  return taxonomy.authors?.[value] ?? value;
}

export function listCanonicalCategories(): Array<{ slug: string; label: string }> {
  const taxonomy = loadTaxonomy();
  return Object.entries(taxonomy.categories).map(([slug, config]) => ({ slug, label: config.label }));
}
