import fs from 'fs';
import path from 'path';

const BLOG_DIR = 'src/content/blog';

function debug() {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md')).slice(0, 5);
  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const imageMatch = content.match(/^image:\s*["']?([^"'\r\n]+)["']?/m);
    if (!imageMatch) {
      console.log(`${file}: No image field in frontmatter`);
      continue;
    }
    const relImagePath = imageMatch[1];
    const imagePath = path.resolve(BLOG_DIR, relImagePath);
    const exists = fs.existsSync(imagePath);
    console.log(`${file}:`);
    console.log(`  rel: ${relImagePath}`);
    console.log(`  resolved: ${imagePath}`);
    console.log(`  exists: ${exists}`);
    if (exists) {
      const stats = fs.statSync(imagePath);
      console.log(`  size: ${stats.size}`);
    }
  }
}

debug();
