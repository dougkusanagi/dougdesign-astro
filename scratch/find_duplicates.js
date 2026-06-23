import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const BLOG_DIR = 'src/content/blog';

function getHash(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256'); // using sha256
    hashSum.update(fileBuffer);
    return { hash: hashSum.digest('hex'), size: fileBuffer.length };
  } catch (e) {
    return null;
  }
}

function analyze() {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
  const imageGroups = {};
  
  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Simple frontmatter parser for image
    const imageMatch = content.match(/^image:\s*["']?([^"'\r\n]+)["']?/m);
    if (!imageMatch) continue;
    
    const relImagePath = imageMatch[1];
    // Resolve relative path: usually '../../assets/images/posts/xyz.jpg'
    // in content/blog, so relative to src/content/blog:
    const imagePath = path.resolve(BLOG_DIR, relImagePath);
    
    const fileInfo = getHash(imagePath);
    if (!fileInfo) continue;
    
    const key = `${fileInfo.size}_${fileInfo.hash}`;
    if (!imageGroups[key]) {
      imageGroups[key] = {
        size: fileInfo.size,
        path: imagePath,
        posts: []
      };
    }
    imageGroups[key].posts.push(file);
  }
  
  // Sort groups by number of posts descending
  const groups = Object.values(imageGroups).filter(g => g.posts.length > 1);
  groups.sort((a, b) => b.posts.length - a.posts.length);
  
  console.log(`Found ${groups.length} groups of duplicated images:`);
  for (const group of groups) {
    console.log(`\nImage: ${path.basename(group.path)} (${group.size} bytes) shared by ${group.posts.length} posts:`);
    console.log(group.posts.slice(0, 10).map(p => `  - ${p}`).join('\n'));
    if (group.posts.length > 10) console.log(`  ... and ${group.posts.length - 10} more`);
  }
}

analyze();
