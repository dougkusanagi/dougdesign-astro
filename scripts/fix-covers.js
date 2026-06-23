import fs from 'fs';
import path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');
const PLACEHOLDER_SIZES = new Set([62367, 83520, 66328, 54139, 69008]);
const CONCURRENCY = 10; // Number of simultaneous downloads

async function fetchJSON(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
}

async function run() {
  console.log('--- Iniciando recuperação de imagens do WordPress ---');
  
  // 1. Fetch all posts from WordPress API (bulk fetch)
  const wpPostMap = new Map(); // slug -> featured_media_url
  let page = 1;
  while (true) {
    const url = `https://dougdesign.com.br/wp-json/wp/v2/posts?per_page=100&_embed=true&page=${page}`;
    console.log(`Buscando posts do WP - Página ${page}...`);
    try {
      const posts = await fetchJSON(url);
      if (!posts || posts.length === 0) break;
      for (const post of posts) {
        const mediaList = post._embedded?.['wp:featuredmedia'];
        const mediaUrl = mediaList && mediaList.length > 0 ? mediaList[0].source_url : null;
        if (mediaUrl) {
          wpPostMap.set(post.slug, mediaUrl);
        }
      }
      if (posts.length < 100) break;
      page++;
    } catch (e) {
      console.log(`Fim da busca bulk (página ${page} retornou erro ou vazia).`);
      break;
    }
  }
  console.log(`Mapeados ${wpPostMap.size} posts com imagens do WordPress.`);

  // 2. Scan local markdown posts
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
  const downloadQueue = [];

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Simple frontmatter parser for image
    const imageMatch = content.match(/^image:\s*["']?([^"'\r\n]+)["']?/m);
    if (!imageMatch) continue;
    
    const relImagePath = imageMatch[1];
    const imagePath = path.resolve(BLOG_DIR, relImagePath);
    const slug = file.replace('.md', '');
    
    let isPlaceholder = false;
    let size = 0;
    if (fs.existsSync(imagePath)) {
      size = fs.statSync(imagePath).size;
      if (PLACEHOLDER_SIZES.has(size)) {
        isPlaceholder = true;
      }
    } else {
      isPlaceholder = true; // download if missing
    }

    if (isPlaceholder) {
      downloadQueue.push({ slug, imagePath, size, filename: file });
    }
  }

  console.log(`Encontrados ${downloadQueue.length} posts com imagens placeholders/ausentes.`);

  if (downloadQueue.length === 0) {
    console.log('Todas as imagens estão corretas! Nada para fazer.');
    return;
  }

  // 3. Process download queue with concurrency control
  let successCount = 0;
  let failCount = 0;

  async function worker(item) {
    const { slug, imagePath, size, filename } = item;
    
    // Check if we have the URL in the bulk map
    let imageUrl = wpPostMap.get(slug);
    
    // Fallback: fetch individually if not found in bulk map
    if (!imageUrl) {
      try {
        const url = `https://dougdesign.com.br/wp-json/wp/v2/posts?slug=${slug}&_embed=true`;
        const posts = await fetchJSON(url);
        if (posts && posts.length > 0) {
          const mediaList = posts[0]._embedded?.['wp:featuredmedia'];
          imageUrl = mediaList && mediaList.length > 0 ? mediaList[0].source_url : null;
        }
      } catch (e) {
        // failed individual fetch
      }
    }

    if (!imageUrl) {
      console.log(`⚠️ Imagem do WordPress não encontrada para: ${slug} (${filename})`);
      failCount++;
      return;
    }

    try {
      await downloadImage(imageUrl, imagePath);
      console.log(`✅ [Baixado] ${slug} -> ${path.basename(imagePath)} (tamanho antigo: ${size} bytes)`);
      successCount++;
    } catch (e) {
      console.log(`❌ [Erro] Falha ao baixar ${imageUrl} para ${slug}: ${e.message}`);
      failCount++;
    }
  }

  const queue = [...downloadQueue];
  async function runWorker() {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) break;
      await worker(item);
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, runWorker);
  await Promise.all(workers);
  
  console.log(`\n--- Concluído ---`);
  console.log(`Sucesso: ${successCount} imagens atualizadas.`);
  console.log(`Falhas: ${failCount} imagens.`);
}

run();
