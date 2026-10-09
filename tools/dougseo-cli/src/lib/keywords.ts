import { resolveSearchConsoleAccessToken } from './google-auth';
import { indexAllPosts } from './content-index';
import { dateOnlyInTimeZone, defaultSiteUrl, extraSiteUrls, fetchSearchAnalyticsRows } from './search-console';

/**
 * Pesquisa de palavras-chave sem ferramenta paga: junta o preenchimento
 * automático do Google e do YouTube em pt-BR (como o brasileiro digita) com as
 * consultas reais do Search Console. Não há volume de busca: a ordem e a
 * repetição das sugestões indicam popularidade relativa, não números.
 */

const SUGGEST_URL = 'https://suggestqueries.google.com/complete/search';
// Poucas variações por tema: o endpoint é público mas não oficial, então o uso fica leve.
const PREFIXES = ['quando', 'como', 'qual', 'vale a pena'];
const SUFFIXES = ['', ' 2026', ' data', ' preço', ' vs'];
const STOPWORDS = new Set(['a', 'o', 'as', 'os', 'de', 'da', 'do', 'das', 'dos', 'e', 'em', 'no', 'na', 'nos', 'nas', 'para', 'pra', 'com', 'por', 'um', 'uma', 'que', 'ou', 'vs', 'x', 'é', 'e']);

export type SuggestSource = 'google' | 'youtube';

export function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
}

export function tokens(text: string): string[] {
  return normalize(text).split(/[^a-z0-9]+/).filter((token) => token && !STOPWORDS.has(token));
}

// Plural simples do português: promoções → promoção, jogos → jogo.
const stem = (token: string) => (token.length > 3 ? token.replace(/[oa]es$/, 'ao').replace(/s$/, '') : token);

/** Uma consulta "contém" o tema quando tem todos os termos dele (sem acento, plural simples). */
export function matchesSeed(query: string, seed: string): boolean {
  const queryTokens = new Set(tokens(query).map(stem));
  return tokens(seed).map(stem).every((token) => queryTokens.has(token));
}

export async function fetchSuggestions(query: string, source: SuggestSource = 'google'): Promise<string[]> {
  const params = new URLSearchParams({ client: 'firefox', hl: 'pt-BR', gl: 'br', q: query });
  if (source === 'youtube') params.set('ds', 'yt');
  const response = await fetch(`${SUGGEST_URL}?${params}`, { headers: { 'accept-language': 'pt-BR' } });
  if (!response.ok) throw new Error(`Sugestões do ${source} retornaram ${response.status}`);
  const data = JSON.parse(await response.text()) as [string, unknown];
  return Array.isArray(data?.[1]) ? (data[1] as unknown[]).filter((item): item is string => typeof item === 'string') : [];
}

export interface RankedSuggestion { phrase: string; lists: number; bestRank: number }

/** Sugestões que aparecem em mais listas e mais no topo vêm primeiro. */
export function rankSuggestions(lists: string[][]): RankedSuggestion[] {
  const ranked = new Map<string, RankedSuggestion>();
  for (const list of lists) {
    const seen = new Set<string>();
    list.forEach((phrase, index) => {
      const key = normalize(phrase);
      if (seen.has(key)) return;
      seen.add(key);
      const entry = ranked.get(key) ?? { phrase, lists: 0, bestRank: index + 1 };
      entry.lists += 1;
      entry.bestRank = Math.min(entry.bestRank, index + 1);
      ranked.set(key, entry);
    });
  }
  return [...ranked.values()].sort((a, b) => b.lists - a.lists || a.bestRank - b.bestRank || a.phrase.localeCompare(b.phrase));
}

/** Termos que acompanham o tema nas sugestões, com quantas frases os usam. */
export function companionTerms(phrases: string[], seed: string): { term: string; count: number }[] {
  const seedTokens = new Set(tokens(seed).map(stem));
  const counts = new Map<string, { term: string; count: number }>();
  for (const phrase of phrases) {
    for (const token of new Set(tokens(phrase))) {
      if (seedTokens.has(stem(token))) continue;
      const entry = counts.get(stem(token)) ?? { term: token, count: 0 };
      entry.count += 1;
      counts.set(stem(token), entry);
    }
  }
  return [...counts.values()].filter((entry) => entry.count > 1).sort((a, b) => b.count - a.count || a.term.localeCompare(b.term));
}

/** Termos frequentes (nas sugestões e no GSC) que o título candidato não usa. */
export function titleCoverage(title: string, terms: string[]): { present: string[]; missing: string[] } {
  const titleTokens = new Set(tokens(title).map(stem));
  const present: string[] = [];
  const missing: string[] = [];
  for (const term of terms) (titleTokens.has(stem(normalize(term))) ? present : missing).push(term);
  return { present, missing };
}

async function collect(seed: string, source: SuggestSource, expand: boolean) {
  const queries = expand ? [...SUFFIXES.map((suffix) => `${seed}${suffix}`), ...PREFIXES.map((prefix) => `${prefix} ${seed}`)] : [seed];
  const lists: string[][] = [];
  for (const query of queries) {
    // Variações com prefixo trazem sugestões de outro assunto; só fica o que contém o tema.
    lists.push((await fetchSuggestions(query, source)).filter((phrase) => matchesSeed(phrase, seed)));
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  return { queries: queries.length, ranked: rankSuggestions(lists) };
}

export async function researchKeywords(options: { seed?: string; slug?: string; title?: string; days?: number; youtube?: boolean; gsc?: boolean }) {
  const days = Math.max(7, Number(options.days) || 90);
  const slug = options.slug?.replace(/^\/|\/$/g, '');
  const post = slug ? indexAllPosts().find((entry) => entry.slug === slug) : undefined;
  if (options.slug && !post) throw new Error(`Post não encontrado: ${options.slug}`);

  let gscRows: { query: string; page: string; clicks: number; impressions: number; position: number }[] = [];
  const warnings: string[] = [];
  if (options.gsc !== false) {
    try {
      const accessToken = await resolveSearchConsoleAccessToken();
      const today = dateOnlyInTimeZone(new Date());
      const startDate = dateOnlyInTimeZone(new Date(Date.now() - days * 86_400_000));
      const primary = defaultSiteUrl();
      for (const siteUrl of [primary, ...extraSiteUrls(primary)]) {
        try {
          const rows = await fetchSearchAnalyticsRows({ accessToken, siteUrl, startDate, endDate: today, dimensions: ['query', 'page'] });
          gscRows.push(...rows.map((row) => ({ query: row.keys[0], page: new URL(row.keys[1]).pathname, clicks: row.clicks, impressions: row.impressions, position: row.position })));
        } catch (error) {
          if (siteUrl === primary) throw error;
          warnings.push(`Search Console ${siteUrl} indisponível`);
        }
      }
    } catch (error) {
      warnings.push(`Search Console indisponível: ${error instanceof Error ? error.message.split('\n')[0] : String(error)}`);
    }
  }

  // Vários temas separados por vírgula comparam formas de escrever. Com --slug e sem tema,
  // usa a consulta com mais impressões da página e a keyword_principal.
  const pageRows = post ? gscRows.filter((row) => row.page === `/${post.slug}/`) : [];
  const pageQueries = aggregate(pageRows);
  const given = (options.seed ?? '').split(',').map((value) => value.trim()).filter(Boolean);
  const fallback = [pageQueries[0]?.query, post?.frontmatter?.keyword_principal].filter((value): value is string => typeof value === 'string' && Boolean(value.trim()));
  const seeds = [...new Map((given.length ? given : fallback).map((value) => [normalize(value), value.trim()])).values()].slice(0, 3);
  if (!seeds.length) throw new Error('Informe um tema (ex.: dougseo keywords "promoção steam") ou um --slug com dados no Search Console.');

  const perSeed = [];
  for (const seed of seeds) {
    const google = await collect(seed, 'google', true);
    const youtube = options.youtube === false ? undefined : await collect(seed, 'youtube', false);
    const related = aggregate(gscRows.filter((row) => matchesSeed(row.query, seed)));
    const phrases = [...google.ranked.map((entry) => entry.phrase), ...(youtube?.ranked.map((entry) => entry.phrase) ?? []), ...related.map((row) => row.query)];
    const companions = companionTerms(phrases, seed);
    perSeed.push({ seed, google, youtube, related: related.slice(0, 15), companions: companions.slice(0, 12) });
  }
  const title = options.title ?? post?.title;
  const coverage = title ? titleCoverage(title, [...new Set(perSeed.flatMap((entry) => [...tokens(entry.seed), ...entry.companions.slice(0, 6).map((item) => item.term)]))]) : undefined;

  return { seeds: perSeed, days, slug: post?.slug, title, pageQueries: pageQueries.slice(0, 10), coverage, warnings };
}

function aggregate(rows: { query: string; page: string; clicks: number; impressions: number; position: number }[]) {
  const byQuery = new Map<string, { query: string; clicks: number; impressions: number; weighted: number; pages: Set<string> }>();
  for (const row of rows) {
    const entry = byQuery.get(row.query) ?? { query: row.query, clicks: 0, impressions: 0, weighted: 0, pages: new Set<string>() };
    entry.clicks += row.clicks;
    entry.impressions += row.impressions;
    entry.weighted += row.position * row.impressions;
    entry.pages.add(row.page);
    byQuery.set(row.query, entry);
  }
  return [...byQuery.values()]
    .map((entry) => ({ query: entry.query, clicks: entry.clicks, impressions: entry.impressions, position: entry.impressions ? entry.weighted / entry.impressions : 0, pages: [...entry.pages] }))
    .sort((a, b) => b.impressions - a.impressions);
}

export function renderKeywords(result: Awaited<ReturnType<typeof researchKeywords>>): string {
  const lines = [`# Palavras-chave: ${result.seeds.map((entry) => `"${entry.seed}"`).join(' × ')}`, ''];
  lines.push(`Fontes: preenchimento automático do Google e do YouTube em pt-BR e Search Console (${result.days} dias, com e sem www). O preenchimento automático não dá volume: ordem e repetição indicam o que é mais buscado, não quanto. Sugestões em inglês indicam que quem busca assim digita em inglês; o título continua em português natural.`, '');
  for (const entry of result.seeds) {
    lines.push(`## "${entry.seed}"`, '');
    lines.push(`Google: ${entry.google.ranked.slice(0, 12).map((item) => item.lists > 1 ? `${item.phrase} (${item.lists})` : item.phrase).join(' · ') || 'sem sugestões'}`);
    if (entry.youtube?.ranked.length) lines.push(`YouTube: ${entry.youtube.ranked.slice(0, 8).map((item) => item.phrase).join(' · ')}`);
    if (entry.companions.length) lines.push(`Termos que mais acompanham: ${entry.companions.map((item) => `${item.term} (${item.count})`).join(', ')}`);
    lines.push(entry.related.length
      ? `Search Console: ${entry.related.slice(0, 8).map((row) => `"${row.query}" ${row.impressions} imp, pos. ${row.position.toFixed(1)}`).join(' · ')}`
      : 'Search Console: o site ainda não aparece para esse tema.');
    lines.push('');
  }
  if (result.slug) {
    lines.push(`## Consultas que já trazem \`/${result.slug}/\``, '');
    if (!result.pageQueries.length) lines.push('Nenhuma consulta visível no período.');
    result.pageQueries.forEach((row) => lines.push(`- "${row.query}": ${row.impressions} imp, ${row.clicks} cliq., pos. ${row.position.toFixed(1)}`));
    lines.push('');
  }
  if (result.coverage && result.title) {
    lines.push('## Título candidato', '', `"${result.title}" (${result.title.length} caracteres)`);
    lines.push(`- Usa: ${result.coverage.present.join(', ') || 'nenhum termo frequente'}`);
    lines.push(`- Não usa: ${result.coverage.missing.join(', ') || 'nada relevante'}`);
    lines.push('- Termo ausente não é obrigatório: use só o que soa natural em português e responde à pergunta mais comum.');
  }
  if (result.warnings.length) lines.push('', `Limites: ${result.warnings.join('; ')}.`);
  return lines.join('\n');
}
