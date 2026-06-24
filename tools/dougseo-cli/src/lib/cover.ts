import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { COVERS_DIR, ensureDir } from './config';
import { findPostBySlug } from './content-index';
import { loadFrontmatterFile, stringifyFrontmatter } from './frontmatter';

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildSvgCover(title: string, category: string): string {
  const safeTitle = escapeXml(title);
  const safeCategory = escapeXml(category);
  return `
  <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="55%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#ea580c"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#bg)"/>
    <circle cx="980" cy="140" r="150" fill="rgba(255,255,255,0.08)"/>
    <circle cx="220" cy="560" r="190" fill="rgba(255,255,255,0.06)"/>
    <rect x="68" y="72" rx="18" ry="18" width="240" height="46" fill="#111827" opacity="0.9"/>
    <text x="96" y="103" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#fde68a">${safeCategory}</text>
    <text x="80" y="220" font-family="Arial, sans-serif" font-size="56" font-weight="800" fill="#ffffff">
      <tspan x="80" dy="0">${safeTitle.slice(0, 34)}</tspan>
      <tspan x="80" dy="70">${safeTitle.slice(34, 68)}</tspan>
      <tspan x="80" dy="70">${safeTitle.slice(68, 102)}</tspan>
    </text>
    <rect x="80" y="560" rx="16" ry="16" width="360" height="8" fill="#ffffff" opacity="0.22"/>
  </svg>`;
}

export async function generateCover(slug: string): Promise<{ outputPath: string }> {
  ensureDir(COVERS_DIR);
  const post = findPostBySlug(slug);
  const outputPath = path.join(COVERS_DIR, `${post.slug}.png`);
  const svg = buildSvgCover(post.title, post.category);
  await sharp(Buffer.from(svg)).png().toFile(outputPath);

  const { frontmatter, body } = loadFrontmatterFile(post.filePath);
  frontmatter.image = `../../assets/images/posts/${post.slug}.png`;
  frontmatter.featured_image = {
    ...(frontmatter.featured_image ?? {}),
    generated_path: `src/assets/images/posts/${post.slug}.png`,
    alt: frontmatter.featured_image?.alt || post.title,
  };
  fs.writeFileSync(post.filePath, stringifyFrontmatter(frontmatter, body), 'utf-8');
  return { outputPath };
}
