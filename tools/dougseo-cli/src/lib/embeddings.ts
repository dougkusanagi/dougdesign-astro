import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { embeddingClients, type EmbeddingClient } from './ai';
import path from 'node:path';
import { INVENTORY_DIR } from './config';
import { indexAllPosts } from './content-index';

const CACHE_PATH = path.join(INVENTORY_DIR, 'embeddings-cache.json');


interface CacheEntry {
  slug: string;
  hash: string; // to track edits
  embedding: number[];
}

let cache: Record<string, CacheEntry> = {};

function loadCache(): void {
  cache = {};
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

function generateHash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

export async function getEmbedding(text: string): Promise<number[]> {
  for (const client of embeddingClients()) {
    try { return await client.embed(text, 'query'); }
    catch (error) { console.warn(error instanceof Error ? error.message : 'Falha no provedor de IA.'); }
  }
  throw new Error('Busca semântica indisponível: nenhum provedor de IA respondeu.');
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
  const posts = indexAllPosts().filter((post) => post.categorySlug === categorySlug);
  if (!posts.length) return [];
  for (const client of embeddingClients()) {
    try {
      return await compareWithClient(client);
    } catch (error) {
      console.warn(`Aviso: ${error instanceof Error ? error.message : 'Falha no provedor de IA.'}`);
    }
  }
  throw new Error('Busca semântica indisponível: nenhum provedor concluiu a comparação. Revise os candidatos manualmente.');

  async function compareWithClient(client: EmbeddingClient): Promise<SemanticConflict[]> {
    const queryVec = await client.embed(`${subject} ${intent}`, 'query');
    const conflicts: SemanticConflict[] = [];
    let cacheUpdated = false;
    try {
      for (const post of posts) {
        const documentText = `${post.title} ${post.assunto} ${post.intencao_busca} ${post.body.substring(0, 1000)}`;
        const contentHash = generateHash(documentText);
        const cacheKey = JSON.stringify([client.namespace, post.slug]);
        const entry = cache[cacheKey];
        const postVec = entry?.hash === contentHash && entry.embedding.length === queryVec.length
          ? entry.embedding
          : await client.embed(documentText, 'document');
        if (postVec.length !== queryVec.length) throw new Error(`${client.provider}: dimensões de embeddings incompatíveis.`);
        if (postVec !== entry?.embedding) {
          cache[cacheKey] = { slug: post.slug, hash: contentHash, embedding: postVec };
          cacheUpdated = true;
        }
        const similarity = cosineSimilarity(queryVec, postVec);
        if (similarity > 0.82) conflicts.push({ slug: post.slug, title: post.title, url: post.url, similarity });
      }
      return conflicts.sort((a, b) => b.similarity - a.similarity);
    } finally {
      if (cacheUpdated) saveCache();
    }
  }
}
