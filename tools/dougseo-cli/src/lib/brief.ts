import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { EDITORIAL_DIR, REPO_ROOT, currentIso, ensureDir } from './config';
import { indexAllPosts, type IndexedPost } from './content-index';
import { resolveSearchConsoleAccessToken } from './google-auth';
import { dateOnlyInTimeZone, defaultSiteUrl, extraSiteUrls, fetchSearchAnalyticsRows, inspectUrls, type InspectionSummary } from './search-console';
import { analyticsSummary } from './analytics';

/**
 * Brief de decisão: junta Search Console, histórico do Git e inventário numa
 * lista curta e ordenada do que fazer, e mede o efeito das mudanças já feitas.
 * Substitui a leitura manual dos relatórios JSON a cada rodada.
 */

const DAY_MS = 86_400_000;
const REPORTS_DIR = path.join(EDITORIAL_DIR, 'reports');
const BLOG_PREFIX = 'src/content/blog/';
// Commits que tocam muitos posts são manutenção em lote, não revisão editorial.
const BULK_COMMIT_FILES = 25;
const STOPWORDS = new Set(['a', 'o', 'as', 'os', 'de', 'da', 'do', 'das', 'dos', 'e', 'em', 'no', 'na', 'nos', 'nas', 'para', 'pra', 'com', 'por', 'um', 'uma', 'que', 'qual', 'quais', 'como', 'ou', 'x', 'vs', 'the', 'is', 'how', 'of']);
// CTR aproximado por posição (1 a 10) em SERPs com AI Overviews. Serve só para
// apontar páginas muito abaixo do padrão; não é meta nem previsão.
const REFERENCE_CTR = [0.2, 0.12, 0.08, 0.06, 0.045, 0.035, 0.03, 0.025, 0.02, 0.017];

export interface DailyRow { page: string; date: string; clicks: number; impressions: number; position: number }
export interface QueryRow { page: string; query: string; clicks: number; impressions: number; position: number }
export interface PostChange { date: string; added: boolean; addedDate?: string }
export interface Totals { clicks: number; impressions: number; ctr: number; position: number }

export const shiftDate = (date: string, days: number) => new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);
export const daysBetween = (from: string, to: string) => Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / DAY_MS);
const pct = (value: number) => `${(value * 100).toFixed(value < 0.01 ? 2 : 1).replace('.', ',')}%`;
const num = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
const br = (date: string) => `${date.slice(8, 10)}/${date.slice(5, 7)}`;

export function pagePath(url: string): string {
  try {
    return decodeURI(new URL(url).pathname);
  } catch {
    return url.split('#')[0];
  }
}

export function totals(rows: Iterable<{ date?: string; clicks: number; impressions: number; position: number }>, from?: string, to?: string): Totals {
  let clicks = 0;
  let impressions = 0;
  let weighted = 0;
  for (const row of rows) {
    if (row.date && ((from && row.date < from) || (to && row.date > to))) continue;
    clicks += row.clicks;
    impressions += row.impressions;
    weighted += row.position * row.impressions;
  }
  return { clicks, impressions, ctr: impressions ? clicks / impressions : 0, position: impressions ? weighted / impressions : 0 };
}

export function referenceCtr(position: number): number {
  const index = Math.max(1, Math.round(position)) - 1;
  return index < REFERENCE_CTR.length ? REFERENCE_CTR[index] : 0.01;
}

function tokens(text: string): string[] {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .split(/[^a-z0-9]+/).filter((token) => token && !STOPWORDS.has(token));
}

/** Termos da consulta ausentes do título (plural simples tratado como singular). */
export function missingTerms(query: string, title: string): string[] {
  const stem = (token: string) => token.length > 3 ? token.replace(/s$/, '') : token;
  const titleTokens = new Set(tokens(title).map(stem));
  return tokens(query).filter((token) => !titleTokens.has(stem(token)));
}

/** Última alteração editorial por arquivo, a partir do Git (ignora commits em lote). */
export function parseGitChanges(log: string): Map<string, PostChange> {
  const changes = new Map<string, PostChange>();
  for (const block of log.split('\n__').map((part) => part.replace(/^__/, ''))) {
    const [header, ...lines] = block.split('\n');
    const date = header?.trim().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? '')) continue;
    const files = lines.map((line) => line.split('\t')).filter((parts) => parts.length >= 2 && parts.at(-1)!.startsWith(BLOG_PREFIX));
    if (files.length > BULK_COMMIT_FILES) continue;
    for (const parts of files) {
      const status = parts[0];
      const file = parts.at(-1)!;
      if (status.startsWith('D')) continue;
      // O log vem do mais novo para o mais antigo: a primeira ocorrência é a última mudança;
      // um "A" em qualquer ponto indica que o post nasceu dentro da janela.
      const existing = changes.get(file) ?? { date, added: false };
      if (status.startsWith('A')) Object.assign(existing, { added: true, addedDate: date });
      changes.set(file, existing);
    }
  }
  return changes;
}

function readGitChanges(since: string): Map<string, PostChange> {
  const result = spawnSync('git', ['log', `--since=${since}`, '--format=__%cI', '--name-status', '--', BLOG_PREFIX], { cwd: REPO_ROOT, encoding: 'utf8' });
  if (result.status !== 0) return new Map();
  return parseGitChanges(result.stdout);
}

export interface Measurement {
  path: string;
  changeDate: string;
  added: boolean;
  windowDays: number;
  before: Totals;
  after: Totals;
  reading: string;
}

/** Compara janelas iguais antes e depois da mudança, limitadas aos dados disponíveis. */
export function measureChange(rows: DailyRow[], change: PostChange, dataStart: string, dataEnd: string, maxWindow = 28): Omit<Measurement, 'path'> {
  // Post novo é medido desde a publicação (dia incluso); atualização, a partir do dia seguinte.
  const changeDate = change.added ? change.addedDate ?? change.date : change.date;
  const afterStart = change.added ? changeDate : shiftDate(changeDate, 1);
  const available = daysBetween(afterStart, dataEnd) + 1;
  const priorAvailable = daysBetween(dataStart, changeDate);
  const windowDays = Math.max(0, Math.min(maxWindow, available, change.added ? maxWindow : priorAvailable));
  const after = totals(rows, afterStart, shiftDate(afterStart, windowDays - 1));
  const before = change.added ? totals([]) : totals(rows, shiftDate(changeDate, -windowDays), shiftDate(changeDate, -1));
  let reading: string;
  if (windowDays < 7) reading = `aguardar (${Math.max(0, windowDays)} d de dados)`;
  else if (change.added) reading = after.impressions === 0 ? 'sem impressões' : after.clicks > 0 ? 'com cliques' : 'só impressões';
  else if (before.impressions + after.impressions < 60) reading = 'volume baixo';
  else if (after.clicks >= before.clicks + 3 || (after.impressions >= before.impressions * 1.3 && after.clicks >= before.clicks)) reading = 'melhorou';
  else if (after.clicks + 3 <= before.clicks || after.impressions <= before.impressions * 0.7) reading = 'piorou';
  else reading = 'estável';
  return { changeDate, added: change.added, windowDays, before, after, reading };
}

export interface PageOpportunity {
  path: string;
  title: string;
  score: number;
  impressions: number;
  clicks: number;
  position: number;
  queries: QueryRow[];
  missing: string[];
  coolingUntil?: string;
}

/** Soma linhas da mesma página e consulta (URLs com #âncora viram a página). */
export function mergeQueryRows(rows: QueryRow[]): QueryRow[] {
  const merged = new Map<string, QueryRow & { weighted: number }>();
  for (const row of rows) {
    const key = `${row.page}\u0000${row.query}`;
    const entry = merged.get(key) ?? { ...row, clicks: 0, impressions: 0, weighted: 0 };
    entry.clicks += row.clicks;
    entry.impressions += row.impressions;
    entry.weighted += row.position * row.impressions;
    merged.set(key, entry);
  }
  return [...merged.values()].map(({ weighted, ...row }) => ({ ...row, position: row.impressions ? weighted / row.impressions : row.position }));
}

/** Páginas com consultas nas posições 4–20, ordenadas por impressões ponderadas. */
export function strikingDistance(queryRows: QueryRow[], titles: Map<string, string>, minImpressions = 10): PageOpportunity[] {
  const byPage = new Map<string, PageOpportunity>();
  for (const row of queryRows) {
    if (row.impressions < minImpressions || row.position < 4 || row.position > 20) continue;
    const title = titles.get(row.page) ?? '';
    const entry = byPage.get(row.page) ?? { path: row.page, title, score: 0, impressions: 0, clicks: 0, position: 0, queries: [], missing: [] };
    entry.score += row.impressions * (row.position <= 10 ? 1 : 0.5);
    entry.impressions += row.impressions;
    entry.clicks += row.clicks;
    entry.queries.push(row);
    byPage.set(row.page, entry);
  }
  return [...byPage.values()].map((entry) => {
    entry.queries.sort((a, b) => b.impressions - a.impressions);
    entry.position = totals(entry.queries).position;
    entry.missing = [...new Set(entry.queries.slice(0, 3).flatMap((query) => missingTerms(query.query, entry.title)))];
    return entry;
  }).sort((a, b) => b.score - a.score);
}

/** Consultas com duas ou mais URLs do site recebendo impressões. */
export function cannibalization(queryRows: QueryRow[], minImpressions = 3) {
  const byQuery = new Map<string, QueryRow[]>();
  for (const row of queryRows) {
    if (row.impressions < minImpressions) continue;
    byQuery.set(row.query, [...(byQuery.get(row.query) ?? []), row]);
  }
  return [...byQuery.entries()]
    .filter(([, rows]) => new Set(rows.map((row) => row.page)).size > 1)
    .map(([query, rows]) => ({ query, impressions: rows.reduce((sum, row) => sum + row.impressions, 0), pages: rows.sort((a, b) => b.impressions - a.impressions) }))
    .sort((a, b) => b.impressions - a.impressions);
}

const SITE_PAGES = /^\/($|category\/|autores\/|posts\/|contato\/|termos\/|privacidade\/|docs\/)/;

export async function buildBrief(options: { days?: number; cooldownDays?: number; inspect?: boolean; top?: number } = {}) {
  const days = Math.max(7, Number(options.days) || 28);
  const cooldownDays = Math.max(0, Number(options.cooldownDays ?? 14));
  const top = Math.max(3, Number(options.top) || 10);
  const siteUrl = defaultSiteUrl();
  const accessToken = await resolveSearchConsoleAccessToken();
  const today = dateOnlyInTimeZone(new Date());
  const lookbackStart = shiftDate(today, -90);

  // A propriedade principal é obrigatória; as extras (sem www) entram quando acessíveis.
  const properties: { siteUrl: string; ok: boolean; error?: string; clicks: number; impressions: number }[] = [];
  const dateRowsBySite = new Map<string, Awaited<ReturnType<typeof fetchSearchAnalyticsRows>>>();
  for (const site of [siteUrl, ...extraSiteUrls(siteUrl)]) {
    try {
      dateRowsBySite.set(site, await fetchSearchAnalyticsRows({ accessToken, siteUrl: site, startDate: lookbackStart, endDate: today, dimensions: ['date'] }));
    } catch (error) {
      if (site === siteUrl) throw error;
      properties.push({ siteUrl: site, ok: false, error: String(error instanceof Error ? error.message : error).slice(0, 160), clicks: 0, impressions: 0 });
    }
  }
  const sites = [...dateRowsBySite.keys()];
  const dateRows = [...dateRowsBySite.values()].flat();
  const datesWithData = dateRows.map((row) => row.keys[0]).sort();
  const primaryDates = (dateRowsBySite.get(siteUrl) ?? []).map((row) => row.keys[0]).sort();
  if (!primaryDates.length) throw new Error('Search Console sem dados no período consultado.');
  const dataStart = datesWithData[0];
  const dataEnd = primaryDates.at(-1)!;
  const currentStart = shiftDate(dataEnd, -(days - 1));
  const previousEnd = shiftDate(currentStart, -1);
  const previousStart = shiftDate(previousEnd, -(days - 1));

  const [pageDateRaw, queryRaw] = await Promise.all([
    Promise.all(sites.map((site) => fetchSearchAnalyticsRows({ accessToken, siteUrl: site, startDate: lookbackStart, endDate: dataEnd, dimensions: ['page', 'date'] }))).then((parts) => parts.flat()),
    Promise.all(sites.map((site) => fetchSearchAnalyticsRows({ accessToken, siteUrl: site, startDate: currentStart, endDate: dataEnd, dimensions: ['page', 'query'] }))).then((parts) => parts.flat()),
  ]);
  for (const [site, rows] of dateRowsBySite) {
    const value = totals(rows.map((row) => ({ date: row.keys[0], clicks: row.clicks, impressions: row.impressions, position: row.position })), currentStart, dataEnd);
    properties.push({ siteUrl: site, ok: true, clicks: value.clicks, impressions: value.impressions });
  }
  let analytics: Awaited<ReturnType<typeof analyticsSummary>> | { error: string };
  try {
    analytics = await analyticsSummary(days);
  } catch (error) {
    analytics = { error: String(error instanceof Error ? error.message : error).split('\n')[0].slice(0, 160) };
  }
  const dailyRows: DailyRow[] = pageDateRaw.map((row) => ({ page: pagePath(row.keys[0]), date: row.keys[1], clicks: row.clicks, impressions: row.impressions, position: row.position }));
  const queryRows = mergeQueryRows(queryRaw.map((row) => ({ page: pagePath(row.keys[0]), query: row.keys[1], clicks: row.clicks, impressions: row.impressions, position: row.position })));
  const siteDaily = dateRows.map((row) => ({ date: row.keys[0], clicks: row.clicks, impressions: row.impressions, position: row.position }));
  const current = totals(siteDaily, currentStart, dataEnd);
  const previous = totals(siteDaily, previousStart, previousEnd);
  const last7 = totals(siteDaily, shiftDate(dataEnd, -6), dataEnd);
  const prior7 = totals(siteDaily, shiftDate(dataEnd, -13), shiftDate(dataEnd, -7));
  const previousCovered = Math.max(0, daysBetween(previousStart < dataStart ? dataStart : previousStart, previousEnd) + 1);

  const rowsByPage = new Map<string, DailyRow[]>();
  for (const row of dailyRows) rowsByPage.set(row.page, [...(rowsByPage.get(row.page) ?? []), row]);
  const pageCurrent = new Map([...rowsByPage].map(([page, rows]) => [page, totals(rows, currentStart, dataEnd)]));
  const pageImpressions = [...pageCurrent.values()].reduce((sum, value) => sum + value.impressions, 0);
  const queryCoverage = pageImpressions ? queryRows.reduce((sum, row) => sum + row.impressions, 0) / pageImpressions : 0;

  const posts = indexAllPosts();
  const postByPath = new Map<string, IndexedPost>(posts.map((post) => [`/${post.slug}/`, post]));
  const titles = new Map([...postByPath].map(([key, post]) => [key, post.title]));
  const changes = readGitChanges(lookbackStart);
  const changeByPath = new Map<string, PostChange>();
  for (const post of posts) {
    const change = changes.get(path.relative(REPO_ROOT, post.filePath).split(path.sep).join('/'));
    if (!change) continue;
    // Agendados entram no Git antes de ir ao ar: a medição começa na publicação.
    const published = dateOnlyInTimeZone(new Date(post.pubDate), 'America/Sao_Paulo');
    if (change.added && change.addedDate && published > change.addedDate) change.addedDate = published;
    // Post criado há tempo e revisado depois é medido como atualização.
    if (change.added && change.addedDate && daysBetween(change.addedDate, change.date) > 7) change.added = false;
    changeByPath.set(`/${post.slug}/`, change);
  }
  const coolingUntil = (page: string) => {
    const change = changeByPath.get(page);
    if (!change) return undefined;
    const until = shiftDate(change.date, cooldownDays);
    return until > today ? until : undefined;
  };

  const opportunities = strikingDistance(queryRows, titles).map((entry) => ({ ...entry, page: pageCurrent.get(entry.path), coolingUntil: coolingUntil(entry.path) }));
  const lowCtr = [...pageCurrent.entries()]
    .filter(([page, value]) => postByPath.has(page) && value.impressions >= 100 && value.ctr < referenceCtr(value.position) * 0.4)
    .map(([page, value]) => ({ path: page, title: titles.get(page) ?? '', ...value, reference: referenceCtr(value.position), coolingUntil: coolingUntil(page) }))
    .sort((a, b) => b.impressions - a.impressions);
  const cannibal = cannibalization(queryRows);

  // Fila sugerida: só URLs fora do período de observação, ordenadas por impressões.
  const queue = new Map<string, { path: string; action: string; evidence: string; impressions: number }>();
  for (const entry of opportunities) {
    if (entry.coolingUntil || !postByPath.has(entry.path)) continue;
    const queries = entry.queries.slice(0, 2).map((query) => `"${query.query}" ${query.impressions} imp, pos. ${query.position.toFixed(1)}`).join('; ');
    queue.set(entry.path, { path: entry.path, action: 'alinhar título, descrição e a seção que responde às consultas', evidence: queries, impressions: entry.impressions });
  }
  for (const entry of lowCtr) {
    if (entry.coolingUntil || queue.has(entry.path)) continue;
    queue.set(entry.path, { path: entry.path, action: 'reescrever título e descrição (CTR baixo para a posição)', evidence: `${entry.impressions} imp, CTR ${pct(entry.ctr)}, pos. ${entry.position.toFixed(1)}`, impressions: entry.impressions });
  }
  for (const entry of cannibal) {
    const [first, second] = entry.pages;
    if (!second || second.impressions < 10 || coolingUntil(first.page) || queue.has(first.page)) continue;
    queue.set(first.page, { path: first.page, action: `diferenciar ou consolidar com \`${second.page}\``, evidence: `"${entry.query}" ${entry.impressions} imp em ${entry.pages.length} URLs`, impressions: entry.impressions });
  }

  const measurements: Measurement[] = [...changeByPath.entries()]
    .filter(([page]) => !postByPath.get(page)?.draft)
    .map(([page, change]) => ({ path: page, ...measureChange(rowsByPage.get(page) ?? [], change, dataStart, dataEnd) }))
    .filter((entry) => entry.added ? daysBetween(entry.changeDate, today) <= 45 : daysBetween(dataStart, entry.changeDate) >= 7)
    .sort((a, b) => b.changeDate.localeCompare(a.changeDate));

  const recentNew = measurements.filter((entry) => entry.added && daysBetween(entry.changeDate, today) <= 30);
  let inspections: InspectionSummary[] = [];
  if (options.inspect !== false) {
    const toInspect = recentNew.filter((entry) => entry.after.impressions === 0 && daysBetween(entry.changeDate, today) >= 2).slice(0, 20);
    inspections = await inspectUrls(toInspect.map((entry) => new URL(entry.path, siteUrl).href), { accessToken, siteUrl });
  }

  const published = posts.filter((post) => !post.draft);
  const withImpressions = published.filter((post) => (pageCurrent.get(`/${post.slug}/`)?.impressions ?? 0) > 0);
  const legacyIdle = published.filter((post) => post.frontmatter?.canibalizacao?.status === 'legado-importado' && !(pageCurrent.get(`/${post.slug}/`)?.impressions));
  const orphans = [...pageCurrent.entries()]
    .filter(([page, value]) => !postByPath.has(page) && !SITE_PAGES.test(page) && value.impressions > 0)
    .map(([page, value]) => ({ path: page, ...value }))
    .sort((a, b) => b.impressions - a.impressions);

  return {
    generatedAt: currentIso(),
    siteUrl,
    period: { currentStart, dataEnd, previousStart, previousEnd, previousCovered, days, dataStart, cooldownDays },
    properties,
    analytics,
    overview: { current, previous, last7, prior7, queryCoverage },
    queue: [...queue.values()].sort((a, b) => b.impressions - a.impressions).slice(0, 8),
    opportunities: opportunities.slice(0, top),
    lowCtr: lowCtr.filter((entry) => !opportunities.slice(0, top).some((item) => item.path === entry.path)).slice(0, top),
    cannibalization: cannibal.slice(0, top),
    measurements,
    inspections,
    health: { published: published.length, withImpressions: withImpressions.length, legacyIdle: legacyIdle.length, orphans: orphans.slice(0, 5) },
  };
}

export type Brief = Awaited<ReturnType<typeof buildBrief>>;

function delta(current: number, previous: number): string {
  if (!previous) return current ? 'novo' : '—';
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? '+' : ''}${change.toFixed(0)}%`;
}

export function renderBrief(brief: Brief): string {
  const { period, overview } = brief;
  const lines: string[] = [];
  const cooling = (until?: string) => until ? ` ⏸ até ${br(until)}` : '';
  lines.push(`# Brief de busca orgânica — ${brief.generatedAt.slice(0, 10)}`, '');
  const included = brief.properties.filter((entry) => entry.ok).map((entry) => `${entry.siteUrl} (${entry.clicks} cliq., ${num(entry.impressions)} imp)`).join(' + ');
  const missing = brief.properties.filter((entry) => !entry.ok).map((entry) => `${entry.siteUrl} (sem acesso)`);
  lines.push(`Search Console: ${included}${missing.length ? ` · fora da soma: ${missing.join(', ')}` : ''}. Dados finais até ${br(period.dataEnd)} · janela ${br(period.currentStart)}–${br(period.dataEnd)} contra ${br(period.previousStart)}–${br(period.previousEnd)}${period.previousCovered < period.days ? ` (anterior só tem ${period.previousCovered} d de dados; começa em ${br(period.dataStart)})` : ''}.`, '');
  const comparable = period.previousCovered >= period.days;
  const variation = (a: number, b: number) => comparable ? delta(a, b) : 'n/d';
  lines.push('| Métrica | Atual | Anterior | Variação | Últimos 7 d | 7 d antes |', '|---|---:|---:|---:|---:|---:|');
  lines.push(`| Cliques | ${overview.current.clicks} | ${overview.previous.clicks} | ${variation(overview.current.clicks, overview.previous.clicks)} | ${overview.last7.clicks} | ${overview.prior7.clicks} |`);
  lines.push(`| Impressões | ${num(overview.current.impressions)} | ${num(overview.previous.impressions)} | ${variation(overview.current.impressions, overview.previous.impressions)} | ${num(overview.last7.impressions)} | ${num(overview.prior7.impressions)} |`);
  lines.push(`| CTR | ${pct(overview.current.ctr)} | ${pct(overview.previous.ctr)} | | ${pct(overview.last7.ctr)} | ${pct(overview.prior7.ctr)} |`);
  lines.push(`| Posição média | ${overview.current.position.toFixed(1)} | ${overview.previous.position.toFixed(1)} | | ${overview.last7.position.toFixed(1)} | ${overview.prior7.position.toFixed(1)} |`, '');
  lines.push(`Consultas visíveis cobrem ${pct(overview.queryCoverage)} das impressões por página; o resto é anonimizado pelo Google. Poucos cliques não provam causa.`, '');
  const ga = brief.analytics;
  if ('error' in ga) lines.push(`GA4: indisponível (${ga.error}).`, '');
  else {
    const ads = ga.current.adImpressions || ga.current.adRevenue ? `AdSense via GA4: ${num(ga.current.adImpressions)} impressões de anúncio, receita ${ga.current.adRevenue.toFixed(2)}` : 'AdSense via GA4: sem dados (vínculo AdSense–GA4 ausente ou sem impressões)';
    lines.push(`GA4 ${ga.propertyId} (${ga.days} d até ontem; anterior entre parênteses): ${ga.current.sessions} sessões (${ga.previous.sessions}), ${ga.current.organicSessions} da busca orgânica (${ga.previous.organicSessions}), ${ga.current.pageViews} visualizações (${ga.previous.pageViews}). ${ads}. Sem aceite de cookies o GA4 registra só parte das visitas: use o GSC para tráfego e o GA4 para comportamento.`, '');
  }

  lines.push('## 0. Fila sugerida (URLs fora do período de observação)', '', 'Antes de trocar um título: `dougseo keywords "<tema em português>" --slug <slug> --title "<candidato>"`.', '');
  if (!brief.queue.length) lines.push('Nada com evidência suficiente fora do período de observação. Priorize correções factuais e pautas com demanda comprovada.');
  brief.queue.forEach((entry, index) => lines.push(`${index + 1}. \`${entry.path}\` — ${entry.action}. Evidência: ${entry.evidence}.`));
  lines.push('');

  lines.push('## 1. Consultas perto do topo (posição 4–20)', '', 'Prioridade para revisar título, descrição e a seção que responde à consulta. ⏸ = alterada há pouco; só mexer por erro factual.', '');
  if (!brief.opportunities.length) lines.push('Nenhuma consulta com volume suficiente.');
  brief.opportunities.forEach((entry, index) => {
    const queries = entry.queries.slice(0, 3).map((query) => `"${query.query}" ${query.impressions} imp, pos. ${query.position.toFixed(1)}, ${query.clicks} cliq.`).join('; ');
    const page = entry.page ? ` · página: ${num(entry.page.impressions)} imp, CTR ${pct(entry.page.ctr)}` : '';
    lines.push(`${index + 1}. \`${entry.path}\`${cooling(entry.coolingUntil)} — ${queries}${page}${entry.missing.length ? ` · título sem: ${entry.missing.join(', ')}` : ''}`);
  });
  lines.push('');

  lines.push('## 2. Outras páginas com CTR muito abaixo do esperado', '', 'Referência aproximada, só para ordenar. Causas comuns: título que não responde à busca, AI Overview ou resultado desatualizado.', '');
  if (!brief.lowCtr.length) lines.push('Nenhuma outra página com 100+ impressões nessa situação.');
  brief.lowCtr.forEach((entry) => lines.push(`- \`${entry.path}\`${cooling(entry.coolingUntil)} — ${num(entry.impressions)} imp, ${entry.clicks} cliq., CTR ${pct(entry.ctr)} (ref. ~${pct(entry.reference)}), pos. ${entry.position.toFixed(1)}`));
  lines.push('');

  lines.push('## 3. Canibalização (mesma consulta, várias URLs)', '');
  if (!brief.cannibalization.length) lines.push('Nenhuma consulta com duas URLs relevantes.');
  brief.cannibalization.forEach((entry) => lines.push(`- "${entry.query}" (${entry.impressions} imp): ${entry.pages.map((row) => `\`${row.page}\` ${row.impressions} imp, pos. ${row.position.toFixed(1)}`).join(' · ')}`));
  lines.push('');

  const updates = brief.measurements.filter((entry) => !entry.added);
  const readable = updates.filter((entry) => entry.windowDays >= 7);
  const waiting = updates.filter((entry) => entry.windowDays < 7);
  lines.push('## 4. Efeito das atualizações (janelas iguais antes e depois)', '', 'Leitura automática com limiares simples; confira os números antes de concluir.', '');
  if (!readable.length) lines.push('Nenhuma atualização com 7+ dias de dados depois da mudança.');
  else {
    lines.push('| URL | Mudança | Janela | Cliques antes→depois | Impressões | Posição | Leitura |', '|---|---|---:|---|---|---|---|');
    readable.slice(0, 25).forEach((entry) => lines.push(`| \`${entry.path}\` | ${br(entry.changeDate)} | ${entry.windowDays} d | ${entry.before.clicks}→${entry.after.clicks} | ${entry.before.impressions}→${entry.after.impressions} | ${entry.before.position ? entry.before.position.toFixed(1) : '—'}→${entry.after.position ? entry.after.position.toFixed(1) : '—'} | ${entry.reading} |`));
  }
  if (waiting.length) {
    const byDate = new Map<string, number>();
    for (const entry of waiting) byDate.set(entry.changeDate, (byDate.get(entry.changeDate) ?? 0) + 1);
    const groups = [...byDate.entries()].map(([date, count]) => `${br(date)}: ${count} URL${count > 1 ? 's' : ''} → ${br(shiftDate(date, 10))}`);
    lines.push('', `Aguardando dados (mudança: quantidade → leitura possível): ${groups.join(' · ')}. As URLs estão marcadas com ⏸ nas seções acima.`);
  }
  lines.push('');

  const created = brief.measurements.filter((entry) => entry.added);
  const inspection = new Map(brief.inspections.map((entry) => [pagePath(entry.url), entry]));
  lines.push('## 5. Posts novos', '');
  if (!created.length) lines.push('Nenhum post novo no período.');
  else {
    lines.push('| URL | Publicado | Dias com dados | Impressões | Cliques | Posição | Índice |', '|---|---|---:|---:|---:|---|---|');
    created.slice(0, 30).forEach((entry) => {
      const status = inspection.get(entry.path);
      lines.push(`| \`${entry.path}\` | ${br(entry.changeDate)} | ${entry.windowDays} | ${entry.after.impressions} | ${entry.after.clicks} | ${entry.after.position ? entry.after.position.toFixed(1) : '—'} | ${status ? (status.coverageState ?? status.error ?? '?') : '—'} |`);
    });
    const unknown = brief.inspections.filter((entry) => entry.coverageState?.includes('não reconhece')).length;
    if (unknown) lines.push('', `${unknown} post(s) novo(s) ainda desconhecido(s) pelo Google: confira links internos de entrada e reenvie o sitemap (\`dougseo search-console sitemap --submit\`).`);
  }
  lines.push('');

  const { health } = brief;
  lines.push('## 6. Acervo', '');
  lines.push(`- Publicados: ${health.published}; com impressão na janela: ${health.withImpressions} (${pct(health.withImpressions / (health.published || 1))}).`);
  lines.push(`- Legado importado publicado sem nenhuma impressão na janela (propriedades somadas): ${health.legacyIdle}. Zero em ${period.days} dias é indício, não prova; retirar do índice é decisão do dono.`);
  if (health.orphans.length) lines.push(`- URLs com impressões sem post correspondente (redirect/404): ${health.orphans.map((entry) => `\`${entry.path}\` ${entry.impressions} imp`).join(' · ')}`);
  lines.push('');
  return lines.join('\n');
}

export function saveBrief(brief: Brief): string {
  ensureDir(REPORTS_DIR);
  const reportPath = path.join(REPORTS_DIR, `brief-${brief.generatedAt.replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(reportPath, `${JSON.stringify(brief, null, 2)}\n`);
  return reportPath;
}
