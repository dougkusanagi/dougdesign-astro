import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { COVERS_DIR, ensureDir } from './config';
import { findPostBySlug } from './content-index';
import { loadFrontmatterFile, stringifyFrontmatter } from './frontmatter';

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function buildSvgCover(category: string, slug: string): string {
  const cat = category.toLowerCase().trim();
  const hash = hashString(slug);
  
  // Deterministic variants
  const angle = (hash % 90); // 0 to 90 degrees variation
  const offsetX = (hash % 60) - 30; // -30 to 30px offset
  const offsetY = ((hash >> 2) % 60) - 30;
  const radiusScale = 0.85 + (((hash >> 4) % 30) / 100); // 0.85x to 1.15x scale

  let gradientStops = '';
  let abstractElements = '';

  if (cat.includes('game')) {
    gradientStops = `
      <stop offset="0%" stop-color="#0b0f19"/>
      <stop offset="60%" stop-color="#2e1065"/>
      <stop offset="100%" stop-color="#db2777"/>
    `;
    abstractElements = `
      <g stroke="#f472b6" stroke-width="4" fill="none" opacity="0.3" transform="translate(${offsetX}, ${offsetY})">
        <path d="M150,250 L150,425 M62.5,337.5 L237.5,337.5" stroke-linecap="round"/>
        <circle cx="150" cy="337.5" r="${40 * radiusScale}"/>
      </g>
      <g fill="#f472b6" opacity="0.25" transform="translate(${offsetX * -0.5}, ${offsetY * -0.5})">
        <circle cx="950" cy="337.5" r="${28 * radiusScale}"/>
        <circle cx="1030" cy="270" r="${28 * radiusScale}"/>
        <circle cx="1030" cy="405" r="${28 * radiusScale}"/>
        <circle cx="1110" cy="337.5" r="${28 * radiusScale}"/>
      </g>
      <path d="M300,100 L900,575 M900,100 L300,575" stroke="rgba(255,255,255,0.03)" stroke-width="8"/>
    `;
  } else if (cat.includes('inteligencia') || cat.includes('artificial') || cat.includes('ia')) {
    gradientStops = `
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="55%" stop-color="#3b0764"/>
      <stop offset="100%" stop-color="#d946ef"/>
    `;
    abstractElements = `
      <g stroke="#f472b6" stroke-width="2" opacity="0.25" transform="translate(${offsetX}, ${offsetY})">
        <line x1="600" y1="150" x2="450" y2="337" />
        <line x1="600" y1="150" x2="750" y2="337" />
        <line x1="450" y1="337" x2="350" y2="525" />
        <line x1="450" y1="337" x2="550" y2="525" />
        <line x1="750" y1="337" x2="650" y2="525" />
        <line x1="750" y1="337" x2="850" y2="525" />
        <line x1="450" y1="337" x2="750" y2="337" />
      </g>
      <g fill="#e879f9" opacity="0.7" transform="translate(${offsetX}, ${offsetY})">
        <circle cx="600" cy="150" r="${16 * radiusScale}" />
        <circle cx="450" cy="337" r="${24 * radiusScale}" />
        <circle cx="750" cy="337" r="${24 * radiusScale}" />
        <circle cx="350" cy="525" r="${16 * radiusScale}" />
        <circle cx="550" cy="525" r="${16 * radiusScale}" />
        <circle cx="650" cy="525" r="${16 * radiusScale}" />
        <circle cx="850" cy="525" r="${16 * radiusScale}" />
      </g>
    `;
  } else if (cat.includes('programac') || cat.includes('educac')) {
    gradientStops = `
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="60%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#10b981"/>
    `;
    abstractElements = `
      <g stroke="#34d399" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.3" transform="translate(${offsetX * 0.5}, ${offsetY * 0.5})">
        <path d="M250,200 L180,200 A30,30 0 0,0 150,230 L150,310 A20,20 0 0,1 130,330 A20,20 0 0,1 130,345 L150,365 L150,445 A30,30 0 0,0 180,475 L250,475" />
        <path d="M950,200 L1020,200 A30,30 0 0,1 1050,230 L1050,310 A20,20 0 0,0 1070,330 A20,20 0 0,0 1070,345 L1050,365 L1050,445 A30,30 0 0,1 1020,475 L950,475" />
      </g>
      <g fill="#34d399" opacity="0.2" transform="translate(${offsetX * -0.5}, ${offsetY * -0.5})">
        <rect x="350" y="260" width="${300 * radiusScale}" height="24" rx="12"/>
        <rect x="350" y="310" width="${500 * radiusScale}" height="24" rx="12"/>
        <rect x="350" y="360" width="${400 * radiusScale}" height="24" rx="12"/>
        <rect x="350" y="410" width="${200 * radiusScale}" height="24" rx="12"/>
      </g>
    `;
  } else if (cat.includes('design')) {
    gradientStops = `
      <stop offset="0%" stop-color="#0b0f19"/>
      <stop offset="50%" stop-color="#4c1d95"/>
      <stop offset="100%" stop-color="#f97316"/>
    `;
    abstractElements = `
      <g fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="3" transform="translate(${offsetX}, ${offsetY})">
        <rect x="250" y="150" width="${450 * radiusScale}" height="${300 * radiusScale}" rx="20" fill="rgba(255,255,255,0.03)" />
        <rect x="500" y="250" width="${450 * radiusScale}" height="${300 * radiusScale}" rx="20" fill="rgba(255,255,255,0.05)" />
      </g>
      <circle cx="850" cy="200" r="${80 * radiusScale}" fill="#f97316" opacity="0.3" filter="blur(20px)" transform="translate(${offsetX * -1}, ${offsetY * -1})"/>
      <circle cx="350" cy="450" r="${100 * radiusScale}" fill="#a78bfa" opacity="0.25" filter="blur(30px)" transform="translate(${offsetX * 0.5}, ${offsetY * 0.5})"/>
    `;
  } else if (cat.includes('mobile')) {
    gradientStops = `
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="60%" stop-color="#064e3b"/>
      <stop offset="100%" stop-color="#84cc16"/>
    `;
    abstractElements = `
      <g fill="none" stroke="#a3e635" stroke-width="4" opacity="0.3" transform="translate(${offsetX}, ${offsetY})">
        <rect x="475" y="100" width="250" height="475" rx="36" />
        <line x1="560" y1="130" x2="640" y2="130" stroke-linecap="round" />
        <circle cx="600" cy="530" r="18" />
      </g>
      <circle cx="600" cy="337.5" r="${120 * radiusScale}" stroke="rgba(163,230,53,0.1)" stroke-width="2" fill="none"/>
      <circle cx="600" cy="337.5" r="${180 * radiusScale}" stroke="rgba(163,230,53,0.05)" stroke-width="3" fill="none"/>
    `;
  } else if (cat.includes('hardware')) {
    gradientStops = `
      <stop offset="0%" stop-color="#111827"/>
      <stop offset="60%" stop-color="#374151"/>
      <stop offset="100%" stop-color="#b45309"/>
    `;
    abstractElements = `
      <rect x="475" y="212.5" width="250" height="250" rx="16" fill="none" stroke="#fb923c" stroke-width="4" opacity="0.25" transform="translate(${offsetX}, ${offsetY})"/>
      <g stroke="#fb923c" stroke-width="3" opacity="0.2" transform="translate(${offsetX}, ${offsetY})">
        <line x1="475" y1="262.5" x2="425" y2="262.5"/>
        <line x1="475" y1="312.5" x2="425" y2="312.5"/>
        <line x1="475" y1="362.5" x2="425" y2="362.5"/>
        <line x1="475" y1="412.5" x2="425" y2="412.5"/>
        <line x1="725" y1="262.5" x2="775" y2="262.5"/>
        <line x1="725" y1="312.5" x2="775" y2="312.5"/>
        <line x1="725" y1="362.5" x2="775" y2="362.5"/>
        <line x1="725" y1="412.5" x2="775" y2="412.5"/>
        <line x1="525" y1="212.5" x2="525" y2="162.5"/>
        <line x1="575" y1="212.5" x2="575" y2="162.5"/>
        <line x1="625" y1="212.5" x2="625" y2="162.5"/>
        <line x1="675" y1="212.5" x2="675" y2="162.5"/>
        <line x1="525" y1="462.5" x2="525" y2="512.5"/>
        <line x1="575" y1="462.5" x2="575" y2="512.5"/>
        <line x1="625" y1="462.5" x2="625" y2="512.5"/>
        <line x1="675" y1="462.5" x2="675" y2="512.5"/>
      </g>
    `;
  } else {
    gradientStops = `
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="55%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    `;
    abstractElements = `
      <g stroke="#22d3ee" stroke-width="2" opacity="0.2" transform="translate(${offsetX}, ${offsetY})">
        <line x1="100" y1="100" x2="300" y2="250"/>
        <line x1="300" y1="250" x2="200" y2="500"/>
        <line x1="300" y1="250" x2="600" y2="200"/>
        <line x1="600" y1="200" x2="900" y2="400"/>
        <line x1="900" y1="400" x2="1100" y2="200"/>
        <line x1="900" y1="400" x2="700" y2="550"/>
      </g>
      <g fill="#22d3ee" opacity="0.6" transform="translate(${offsetX}, ${offsetY})">
        <circle cx="100" cy="100" r="${10 * radiusScale}"/>
        <circle cx="300" cy="250" r="${16 * radiusScale}"/>
        <circle cx="200" cy="500" r="${12 * radiusScale}"/>
        <circle cx="600" cy="200" r="${14 * radiusScale}"/>
        <circle cx="900" cy="400" r="${18 * radiusScale}"/>
        <circle cx="1100" cy="200" r="${10 * radiusScale}"/>
        <circle cx="700" cy="550" r="${12 * radiusScale}"/>
      </g>
    `;
  }

  // Use the slug hash to slightly rotate the background gradient
  const x1 = Math.round(0 + (offsetX / 3));
  const y1 = Math.round(0 + (offsetY / 3));
  const x2 = Math.round(100 + (angle / 10)) / 100;
  const y2 = Math.round(100 - (angle / 10)) / 100;

  return `
  <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="${x1}%" y1="${y1}%" x2="${x2}" y2="${y2}">
        ${gradientStops}
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#bg)"/>
    ${abstractElements}
  </svg>`;
}

export async function generateCover(slug: string): Promise<{ outputPath: string }> {
  ensureDir(COVERS_DIR);
  const post = findPostBySlug(slug);
  const outputPath = path.join(COVERS_DIR, `${post.slug}.png`);
  const svg = buildSvgCover(post.category, post.slug);
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
