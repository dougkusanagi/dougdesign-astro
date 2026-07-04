import fs from 'node:fs';
import path from 'node:path';
import { INVENTORY_DIR } from './config';
import { indexAllPosts } from './content-index';

const CACHE_PATH = path.join(INVENTORY_DIR, 'embeddings-cache.json');
const OLLAMA_URL = 'http://localhost:11434/api/embeddings';
const MODEL_NAME = 'nomic-embed-text';

interface CacheEntry {
  slug: string;
  hash: string; // to track edits
  embedding: number[];
}

let cache: Record<string, CacheEntry> = {};

function loadCache(): void {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
    }
  } catch (err) {
    console.error('Erro ao ler cache de embeddings:', err);
  }
}

function saveCache(): void {
  try {
    fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Erro ao salvar cache de embeddings:', err);
  }
}

// Generate simple hash of body content
function generateHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return String(hash);
}

export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: text,
      }),
    });
    if (!response.ok) {
      throw new Error(`Erro na resposta do Ollama: ${response.statusText}`);
    }
    const data = (await response.json()) as { embedding: number[] };
    return data.embedding;
  } catch (err) {
    console.warn(`Aviso: Falha ao chamar Ollama para obter embedding: ${err instanceof Error ? err.message : String(err)}`);
    return [];
  }
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export interface SemanticConflict {
  slug: string;
  title: string;
  url: string;
  similarity: number;
}

export async function checkSemanticSimilarity(
  categorySlug: string,
  subject: string,
  intent: string
): Promise<SemanticConflict[]> {
  loadCache();
  const queryText = `search_query: ${subject} ${intent}`;
  const queryVec = await getEmbedding(queryText);
  if (queryVec.length === 0) return [];

  const conflicts: SemanticConflict[] = [];
  let cacheUpdated = false;

  for (const post of indexAllPosts()) {
    if (post.categorySlug !== categorySlug) continue;

    const contentHash = generateHash(post.body);
    let postVec: number[] = [];

    if (cache[post.slug] && cache[post.slug].hash === contentHash) {
      postVec = cache[post.slug].embedding;
    } else {
      // Format text for embedding: nomic-embed-text requires search_document prefix for doc indexing
      const documentText = `search_document: ${post.title} ${post.assunto} ${post.intencao_busca} ${post.body.substring(0, 1000)}`;
      postVec = await getEmbedding(documentText);
      if (postVec.length > 0) {
        cache[post.slug] = {
          slug: post.slug,
          hash: contentHash,
          embedding: postVec,
        };
        cacheUpdated = true;
      }
    }

    if (postVec.length > 0) {
      const sim = cosineSimilarity(queryVec, postVec);
      if (sim > 0.82) {
        conflicts.push({
          slug: post.slug,
          title: post.title,
          url: post.url,
          similarity: sim,
        });
      }
    }
  }

  if (cacheUpdated) {
    saveCache();
  }

  return conflicts.sort((a, b) => b.similarity - a.similarity);
}
