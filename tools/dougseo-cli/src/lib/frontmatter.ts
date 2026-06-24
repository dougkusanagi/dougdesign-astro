import fs from 'node:fs';
import YAML from 'yaml';

export interface FrontmatterFile {
  frontmatter: Record<string, any>;
  body: string;
}

export function parseFrontmatter(text: string): FrontmatterFile {
  const normalized = text.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) {
    return { frontmatter: {}, body: text };
  }
  const end = normalized.indexOf('\n---\n', 4);
  if (end === -1) {
    return { frontmatter: {}, body: text };
  }
  const raw = normalized.slice(4, end);
  return {
    frontmatter: (YAML.parse(raw) as Record<string, any> | null) ?? {},
    body: normalized.slice(end + 5).trim() + '\n',
  };
}

export function loadFrontmatterFile(filePath: string): FrontmatterFile {
  return parseFrontmatter(fs.readFileSync(filePath, 'utf-8'));
}

export function stringifyFrontmatter(frontmatter: Record<string, any>, body: string): string {
  return `---\n${YAML.stringify(frontmatter).trim()}\n---\n\n${body.trim()}\n`;
}
