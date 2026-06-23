import fs from 'fs';
import path from 'path';

const blogDir = path.join(process.cwd(), 'src/content/blog');
const imagesDir = path.join(process.cwd(), 'src/assets/images');

// Ensure images directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

async function downloadImage(url: string, destPath: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.promises.writeFile(destPath, buffer);
    console.log(`Successfully downloaded: ${url} -> ${destPath}`);
  } catch (error) {
    console.error(`Failed to download ${url}:`, error);
  }
}

async function run() {
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
  
  for (const file of files) {
    const filePath = path.join(blogDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Simple regex to parse image frontmatter
    const imageRegex = /^image:\s*["']?(https?:\/\/[^\s"']+)["']?/m;
    const match = content.match(imageRegex);
    
    if (match) {
      const imageUrl = match[1];
      const slug = file.replace('.md', '');
      
      // Determine file extension (default to .jpg)
      let ext = '.jpg';
      if (imageUrl.includes('fit=crop') || imageUrl.includes('photo-')) {
        ext = '.jpg';
      } else {
        const urlPath = new URL(imageUrl).pathname;
        const parsedExt = path.extname(urlPath);
        if (parsedExt) ext = parsedExt;
      }
      
      const imageName = `${slug}${ext}`;
      const destPath = path.join(imagesDir, imageName);
      
      // Download the image
      await downloadImage(imageUrl, destPath);
      
      // Replace the image URL in the frontmatter with relative path
      // Astro content collections require relative paths starting with dot (e.g. "../../assets/images/xxx.jpg")
      const relativePath = `../../assets/images/${imageName}`;
      content = content.replace(imageRegex, `image: "${relativePath}"`);
      
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Updated frontmatter in ${file}`);
    }
  }
}

run();
