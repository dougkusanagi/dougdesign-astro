// Core AI Quality Scoring Engine for Astro Blog posts

const BANNED_CLICHES = [
  'vital',
  'essencial',
  'revolucionar',
  'divisor de águas',
  'mergulhar',
  'ecossistema em constante evolução',
  'no cenário atual'
];

const RIGID_HEADINGS = [
  '## o que aconteceu',
  '## o que e oficial',
  '## o que ainda falta confirmar',
  '## o que e real'
];

interface Frontmatter {
  content_type?: string;
  fontes_oficiais?: string[];
  quality_notes?: {
    below_word_target_reason?: string | null;
  };
  internal_links?: {
    to?: string[];
  };
}

export interface QualityResult {
  score: number;
  ok: boolean;
  warnings: string[];
  wordCount: number;
  readabilityScore: number;
}

// Approximate syllable count for Portuguese words
function estimatePortugueseSyllables(word: string): number {
  const cleanWord = word
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z]/g, '');

  if (!cleanWord) return 0;

  // Match vowel groups (diphthongs, triphthongs count as single syllable triggers in simple estimation)
  const vowelGroups = cleanWord.match(/[aeiouy]+/g);
  let count = vowelGroups ? vowelGroups.length : 1;

  // Adjustments for common silent/ending vowels
  if (cleanWord.endsWith('e') && count > 1) {
    count--;
  }

  return count || 1;
}

export function scoreContent(body: string, frontmatter: Frontmatter): QualityResult {
  const warnings: string[] = [];
  let score = 100;

  // Clean markdown for text analysis
  const textOnly = body
    .replace(/```[\s\S]*?```/g, '') // remove code blocks
    .replace(/`.*?`/g, '') // remove inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // remove links, keep text
    .replace(/[#*_\->]/g, ''); // remove formatting characters

  const words = textOnly.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // 1. Word Count Check
  const minWords = 300;
  const belowReason = frontmatter.quality_notes?.below_word_target_reason;
  if (wordCount < minWords && !belowReason) {
    score -= 15;
    warnings.push(`Quantidade de palavras (${wordCount}) está abaixo do mínimo sugerido (${minWords}) sem justificativa no frontmatter.`);
  }

  // 2. Readability Score (Portuguese Flesch Reading Ease)
  const sentences = textOnly.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length || 1;

  let totalSyllables = 0;
  for (const word of words) {
    totalSyllables += estimatePortugueseSyllables(word);
  }

  const avgSentenceLength = wordCount / sentenceCount;
  const avgSyllableLength = totalSyllables / (wordCount || 1);

  // Portuguese adapted Flesch Formula: 248.835 - (1.015 * ASL) - (84.6 * ASW)
  const readabilityScore = Math.max(0, Math.min(100, Math.round(248.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllableLength))));

  if (readabilityScore < 40) {
    score -= 10;
    warnings.push(`Legibilidade muito baixa (Flesch: ${readabilityScore}). Escreva sentenças mais curtas.`);
  }

  // 3. Banned AI Clichés Checker
  const bodyLower = body.toLowerCase();
  for (const cliche of BANNED_CLICHES) {
    if (bodyLower.includes(cliche)) {
      score -= 10;
      warnings.push(`Contém jargão de IA banido: "${cliche}".`);
    }
  }

  // 4. Rigid Template Checker for Evergreen Posts
  const isEvergreen = frontmatter.content_type === 'guia' || frontmatter.content_type === 'tutorial';
  if (isEvergreen) {
    for (const heading of RIGID_HEADINGS) {
      if (bodyLower.includes(heading)) {
        score -= 15;
        warnings.push(`Posts Evergreen/Guias não devem usar cabeçalhos rígidos de notícias: "${heading}".`);
      }
    }
  }

  // 5. Internal Links Checker
  const internalLinkRegex = /https:\/\/dougdesign\.com\.br\/[a-z0-9-]+/g;
  const internalLinkMatches = body.match(internalLinkRegex) || [];
  const registeredToLinks = frontmatter.internal_links?.to || [];
  const totalInternalLinks = Math.max(internalLinkMatches.length, registeredToLinks.length);

  if (totalInternalLinks < 3) {
    warnings.push(`Possui poucos links internos (${totalInternalLinks}/3+). Tente inserir links contextuais no corpo.`);
  }

  // 6. Official Sources Checker
  const sources = frontmatter.fontes_oficiais || [];
  if (sources.length < 1) {
    warnings.push('Nenhuma fonte oficial declarada no campo "fontes_oficiais" do frontmatter.');
  }

  // Final score bounds
  const finalScore = Math.max(0, score);
  const ok = finalScore >= 80;

  return {
    score: finalScore,
    ok,
    warnings,
    wordCount,
    readabilityScore
  };
}
