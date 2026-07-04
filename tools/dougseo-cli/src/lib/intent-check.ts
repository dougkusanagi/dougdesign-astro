import { indexAllPosts } from './content-index';
import { canonicalCategorySlug } from './taxonomy';
import { slugify } from './config';
import { checkSemanticSimilarity } from './embeddings';

function normalizedText(value: string): string {
  return slugify(value).replace(/-/g, ' ');
}

export interface IntentCheckResult {
  ok: boolean;
  conflicts: string[];
  warnings: string[];
}

export async function checkIntent(input: { category: string; subject: string; intent: string; slug?: string }): Promise<IntentCheckResult> {
  const categorySlug = canonicalCategorySlug(input.category);
  const targetSubject = normalizedText(input.subject);
  const targetIntent = normalizedText(input.intent);
  const targetSlug = input.slug ? slugify(input.slug) : '';
  const conflicts: string[] = [];
  const warnings: string[] = [];

  for (const post of indexAllPosts()) {
    if (post.categorySlug !== categorySlug) continue;
    if (targetSlug && slugify(post.slug) === targetSlug) {
      conflicts.push(`slug duplicado com ${post.url}`);
      continue;
    }
    if (normalizedText(post.assunto) === targetSubject && normalizedText(post.intencao_busca) === targetIntent) {
      conflicts.push(`mesmo assunto e mesma intencao em ${post.url}`);
      continue;
    }
    if (normalizedText(post.assunto) === targetSubject) {
      warnings.push(`assunto parecido com ${post.url}`);
    }
  }

  // Add semantic search checks
  try {
    const semanticConflicts = await checkSemanticSimilarity(categorySlug, input.subject, input.intent);
    for (const conflict of semanticConflicts) {
      if (targetSlug && slugify(conflict.slug) === targetSlug) continue;
      
      warnings.push(`similaridade semântica alta (${(conflict.similarity * 100).toFixed(1)}%) com ${conflict.url}`);
    }
  } catch (err) {
    console.warn('Erro ao realizar busca semântica:', err);
  }

  return { ok: conflicts.length === 0, conflicts, warnings };
}
