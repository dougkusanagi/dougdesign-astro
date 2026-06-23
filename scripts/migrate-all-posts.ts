import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const sourcePostsDir = 'C:\\Users\\dl_ag\\dev\\dougdesign-seo\\posts';
const sourcePublishedDir = 'C:\\Users\\dl_ag\\dev\\dougdesign-seo\\content\\published';

const destBlogDir = path.join(process.cwd(), 'src/content/blog');
const destImagesDir = path.join(process.cwd(), 'src/assets/images/posts');

// Ensure destination directories exist
if (!fs.existsSync(destBlogDir)) {
  fs.mkdirSync(destBlogDir, { recursive: true });
}
if (!fs.existsSync(destImagesDir)) {
  fs.mkdirSync(destImagesDir, { recursive: true });
}

// Concurrency pool helper
async function asyncPool(poolLimit: number, array: any[], iteratorFn: (item: any) => Promise<any>) {
  const ret = [];
  const executing: any[] = [];
  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item));
    ret.push(p);

    if (poolLimit <= array.length) {
      const e: any = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= poolLimit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(ret);
}

// Category fallback images (Unsplash)
const categoryDefaults: Record<string, string> = {
  games: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800',
  tecnologia: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800',
  programacao: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800',
  default: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800',
};

// Helper to scrape metadata and post image from WP page HTML
async function scrapeWpPage(url: string, slug: string): Promise<{ imageUrl: string | null; metaDescription: string | null }> {
  try {
    const res = await fetch(url);
    if (!res.ok) return { imageUrl: null, metaDescription: null };
    const html = await res.text();

    // 1. Extract Meta Description
    let metaDescription: string | null = null;
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
    if (descMatch) {
      metaDescription = descMatch[1];
    }

    // 2. Extract wp-post-image src
    let imageUrl: string | null = null;
    const imgRegex = /<img([^>]+)>/gi;
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      const attributes = match[1];
      if (attributes.includes('wp-post-image') && !attributes.includes('sp-thumb-img')) {
        const srcMatch = attributes.match(/src=["']([^"']+)["']/i);
        if (srcMatch) {
          imageUrl = srcMatch[1];
          break;
        }
      }
    }

    // Fallback to first image with wp-post-image if strict match failed
    if (!imageUrl) {
      const imgRegexFallback = /<img([^>]+)>/gi;
      while ((match = imgRegexFallback.exec(html)) !== null) {
        const attributes = match[1];
        if (attributes.includes('wp-post-image')) {
          const srcMatch = attributes.match(/src=["']([^"']+)["']/i);
          if (srcMatch) {
            imageUrl = srcMatch[1];
            break;
          }
        }
      }
    }

    return { imageUrl, metaDescription };
  } catch (err) {
    console.error(`Error scraping ${url}:`, err);
    return { imageUrl: null, metaDescription: null };
  }
}

// Download image locally
async function downloadImage(url: string, destPath: string): Promise<boolean> {
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const buffer = Buffer.from(await res.arrayBuffer());
    await fs.promises.writeFile(destPath, buffer);
    return true;
  } catch (err) {
    console.error(`Failed to download image ${url}:`, err);
    return false;
  }
}

// Recursive file scanner
function getAllMdFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllMdFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// Parse YAML frontmatter
function parseFrontmatter(content: string) {
  const match = content.match(/^---\r?\n([\s\S]+?)\r?\n---/);
  if (!match) return { data: {}, body: content };
  const yamlText = match[1];
  const body = content.substring(match[0].length);
  const data: Record<string, any> = {};

  const lines = yamlText.split('\n');
  let currentKey = '';
  let inWpSection = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Simple parser for basic lines
    if (trimmed.startsWith('-')) continue; // skip arrays for simplicity

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;

    const key = trimmed.substring(0, colonIdx).trim();
    const val = trimmed.substring(colonIdx + 1).trim().replace(/^["']|["']$/g, '');

    if (key === 'wp') {
      inWpSection = true;
      continue;
    }

    if (inWpSection && (trimmed.startsWith('  ') || trimmed.startsWith('\t'))) {
      // It's inside wp
      if (!data.wp) data.wp = {};
      data.wp[key] = val;
      continue;
    } else {
      inWpSection = false;
    }

    data[key] = val;
  }

  return { data, body };
}

// Main process function
async function processPostFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const { data, body } = parseFrontmatter(content);

  const title = data.title || filename.replace('.md', '');
  const slug = data.slug || filename.replace('.md', '');
  const dateStr = data.date || new Date().toISOString();
  const author = data.author || 'Zeca Games';
  
  // Category mapping
  let category = 'Games';
  if (data.category) {
    category = data.category;
  } else if (data.categories) {
    // Basic category parsing
    const cat = data.categories.replace(/[\[\]]/g, '').split(',')[0].trim();
    category = cat.charAt(0).toUpperCase() + cat.slice(1);
  } else {
    // Infer from path
    const pathParts = filePath.split(path.sep);
    const parentFolder = pathParts[pathParts.length - 2];
    if (parentFolder && parentFolder !== 'published' && parentFolder !== 'posts') {
      category = parentFolder.charAt(0).toUpperCase() + parentFolder.slice(1);
    }
  }

  let wpUrl = data.wp?.url || '';
  let imageUrl: string | null = null;
  let metaDescription: string | null = data.meta_description || data.description || null;

  if (wpUrl) {
    const scraped = await scrapeWpPage(wpUrl, slug);
    imageUrl = scraped.imageUrl;
    if (scraped.metaDescription) {
      metaDescription = scraped.metaDescription;
    }
  }

  // Fallback image url
  let isDownloaded = false;
  const imageExt = '.jpg';
  const localImageName = `${slug}${imageExt}`;
  const localImagePath = path.join(destImagesDir, localImageName);

  if (imageUrl) {
    isDownloaded = await downloadImage(imageUrl, localImagePath);
  }

  if (!isDownloaded) {
    // Use category fallback image
    const fallbackUrl = categoryDefaults[category.toLowerCase()] || categoryDefaults.default;
    isDownloaded = await downloadImage(fallbackUrl, localImagePath);
  }

  // Clean description limit
  const finalDesc = (metaDescription || title).replace(/\s+/g, ' ').substring(0, 155);

  // Compute reading time
  const wordCount = body.split(/\s+/).length;
  const readingTime = `${Math.max(1, Math.ceil(wordCount / 200))} min`;

  // Write new frontmatter with exact schema fields
  const newFrontmatter = `---
title: ${JSON.stringify(title)}
meta_description: ${JSON.stringify(finalDesc)}
description: ${JSON.stringify(finalDesc)}
pubDate: ${new Date(dateStr).toISOString().split('T')[0]}
author: ${JSON.stringify(author)}
category: ${JSON.stringify(category)}
image: "../../assets/images/posts/${localImageName}"
draft: ${data.status !== 'publish' && data.status !== 'published'}
readingTime: "${readingTime}"
---

${body.trim()}
`;

  const destFilePath = path.join(destBlogDir, `${slug}.md`);
  fs.writeFileSync(destFilePath, newFrontmatter, 'utf-8');
}

async function run() {
  console.log('Scanning legacy folders...');
  const files1 = getAllMdFiles(sourcePostsDir);
  const files2 = getAllMdFiles(sourcePublishedDir);
  const allFiles = [...files1, ...files2];

  console.log(`Found ${allFiles.length} posts to migrate. Starting migration...`);
  
  let processedCount = 0;
  await asyncPool(15, allFiles, async (file) => {
    try {
      await processPostFile(file);
      processedCount++;
      if (processedCount % 50 === 0 || processedCount === allFiles.length) {
        console.log(`Progress: ${processedCount}/${allFiles.length} posts migrated.`);
      }
    } catch (e) {
      console.error(`Error migrating ${file}:`, e);
    }
  });

  console.log('Migration completed successfully!');
}

run();
