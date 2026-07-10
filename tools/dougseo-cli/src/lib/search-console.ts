import fs from 'node:fs';
import path from 'node:path';
import { EDITORIAL_DIR, currentIso, ensureDir } from './config';
import { indexAllPosts } from './content-index';
import { resolveSearchConsoleAccessToken } from './google-auth';

const REPORTS_DIR = path.join(EDITORIAL_DIR, 'reports');
const SEARCH_CONSOLE_URL_INSPECTION_API = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
const SEARCH_CONSOLE_ANALYTICS_API_BASE = 'https://www.googleapis.com/webmasters/v3/sites';
const SEARCH_CONSOLE_TIME_ZONE = 'America/Los_Angeles';

interface SearchAnalyticsRow {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
}

interface SearchAnalyticsResponse {
  rows?: SearchAnalyticsRow[];
}

function dateOnlyInTimeZone(date: Date, timeZone = SEARCH_CONSOLE_TIME_ZONE): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function safeNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function normalizeRow(row: SearchAnalyticsRow): Required<Pick<SearchAnalyticsRow, 'clicks' | 'impressions' | 'ctr' | 'position'>> & { keys: string[] } {
  return {
    keys: row.keys ?? [],
    clicks: safeNumber(row.clicks),
    impressions: safeNumber(row.impressions),
    ctr: safeNumber(row.ctr),
    position: safeNumber(row.position),
  };
}

async function requestSearchConsoleJson<T>(accessToken: string, url: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Search Console API retornou ${response.status}: ${text}`);
  }
  return JSON.parse(text) as T;
}

function searchAnalyticsEndpoint(siteUrl: string): string {
  return `${SEARCH_CONSOLE_ANALYTICS_API_BASE}/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
}

async function fetchSearchAnalyticsReport(options: {
  accessToken: string;
  siteUrl: string;
  startDate: string;
  endDate: string;
  dimensions?: string[];
  rowLimit?: number;
  searchType?: string;
}): Promise<SearchAnalyticsResponse> {
  return requestSearchConsoleJson<SearchAnalyticsResponse>(
    options.accessToken,
    searchAnalyticsEndpoint(options.siteUrl),
    {
      startDate: options.startDate,
      endDate: options.endDate,
      dimensions: options.dimensions,
      rowLimit: options.rowLimit,
      type: options.searchType || 'web',
    },
  );
}

function compareValue(current: number, previous: number): number {
  if (!previous) return current ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function buildRankedDeltas(
  currentRows: SearchAnalyticsRow[] | undefined,
  previousRows: SearchAnalyticsRow[] | undefined,
  keyIndex = 0,
) {
  const previousMap = new Map(
    (previousRows ?? []).map((row) => [row.keys?.[keyIndex] ?? '', normalizeRow(row)]),
  );

  return (currentRows ?? [])
    .map((row) => {
      const current = normalizeRow(row);
      const key = current.keys[keyIndex] ?? '';
      const previous = previousMap.get(key);
      const previousClicks = previous?.clicks ?? 0;
      const previousImpressions = previous?.impressions ?? 0;
      return {
        key,
        clicks: current.clicks,
        impressions: current.impressions,
        ctr: current.ctr,
        position: current.position,
        previousClicks,
        previousImpressions,
        clickDelta: current.clicks - previousClicks,
        impressionDelta: current.impressions - previousImpressions,
        clickDeltaPct: compareValue(current.clicks, previousClicks),
        impressionDeltaPct: compareValue(current.impressions, previousImpressions),
      };
    })
    .sort((a, b) => b.clicks - a.clicks);
}

function summarizeOverview(rows: SearchAnalyticsRow[] | undefined) {
  const row = rows?.[0];
  return {
    startDate: '',
    endDate: '',
    clicks: safeNumber(row?.clicks),
    impressions: safeNumber(row?.impressions),
    ctr: safeNumber(row?.ctr),
    position: safeNumber(row?.position),
  };
}

export async function inspectLatestUrls(options: {
  latest: number;
  siteUrl?: string;
  accessToken?: string;
  languageCode?: string;
}) {
  const accessToken = options.accessToken || await resolveSearchConsoleAccessToken();
  const siteUrl = options.siteUrl || process.env.GSC_SITE_URL || 'https://dougdesign.com.br/';
  const urls = indexAllPosts()
    .filter((post) => !post.draft)
    .sort((a, b) => b.pubDate.localeCompare(a.pubDate))
    .slice(0, options.latest)
    .map((post) => post.url);

  const results = [];
  for (const url of urls) {
    const response = await fetch(SEARCH_CONSOLE_URL_INSPECTION_API, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        inspectionUrl: url,
        siteUrl,
        languageCode: options.languageCode || 'pt-BR',
      }),
    });
    const text = await response.text();
    results.push({
      url,
      ok: response.ok,
      response: response.ok ? JSON.parse(text) : text,
    });
  }

  ensureDir(REPORTS_DIR);
  const reportPath = path.join(REPORTS_DIR, `search-console-${currentIso().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(reportPath, `${JSON.stringify({ generatedAt: currentIso(), results }, null, 2)}\n`);
  return { reportPath, results };
}

export async function inspectPerformance(options: {
  days: number;
  top?: number;
  siteUrl?: string;
  accessToken?: string;
  searchType?: string;
  compare?: boolean;
}) {
  const accessToken = options.accessToken || await resolveSearchConsoleAccessToken();
  const siteUrl = options.siteUrl || process.env.GSC_SITE_URL || 'https://dougdesign.com.br/';
  const days = Math.max(1, Number(options.days) || 28);
  const top = Math.max(1, Number(options.top) || 20);
  const compare = options.compare !== false;
  const today = new Date();
  const endDate = dateOnlyInTimeZone(today);
  const startDate = dateOnlyInTimeZone(addDays(today, -(days - 1)));
  const previousEndDate = dateOnlyInTimeZone(addDays(today, -days));
  const previousStartDate = dateOnlyInTimeZone(addDays(today, -(days * 2 - 1)));

  const [
    currentOverview,
    currentQueries,
    currentPages,
    currentTrends,
    previousQueries,
    previousPages,
  ] = await Promise.all([
    fetchSearchAnalyticsReport({
      accessToken,
      siteUrl,
      startDate,
      endDate,
      rowLimit: 1,
      searchType: options.searchType || 'web',
    }),
    fetchSearchAnalyticsReport({
      accessToken,
      siteUrl,
      startDate,
      endDate,
      dimensions: ['query'],
      rowLimit: top,
      searchType: options.searchType || 'web',
    }),
    fetchSearchAnalyticsReport({
      accessToken,
      siteUrl,
      startDate,
      endDate,
      dimensions: ['page'],
      rowLimit: top,
      searchType: options.searchType || 'web',
    }),
    fetchSearchAnalyticsReport({
      accessToken,
      siteUrl,
      startDate,
      endDate,
      dimensions: ['date'],
      rowLimit: days,
      searchType: options.searchType || 'web',
    }),
    compare ? fetchSearchAnalyticsReport({
      accessToken,
      siteUrl,
      startDate: previousStartDate,
      endDate: previousEndDate,
      dimensions: ['query'],
      rowLimit: top,
      searchType: options.searchType || 'web',
    }) : Promise.resolve({ rows: [] } satisfies SearchAnalyticsResponse),
    compare ? fetchSearchAnalyticsReport({
      accessToken,
      siteUrl,
      startDate: previousStartDate,
      endDate: previousEndDate,
      dimensions: ['page'],
      rowLimit: top,
      searchType: options.searchType || 'web',
    }) : Promise.resolve({ rows: [] } satisfies SearchAnalyticsResponse),
  ]);

  const overview = summarizeOverview(currentOverview.rows);
  const comparePeriod = compare ? {
    startDate: previousStartDate,
    endDate: previousEndDate,
  } : null;

  const report = {
    generatedAt: currentIso(),
    siteUrl,
    searchType: options.searchType || 'web',
    period: {
      startDate,
      endDate,
      days,
    },
    comparePeriod,
    overview: {
      clicks: overview.clicks,
      impressions: overview.impressions,
      ctr: overview.ctr,
      position: overview.position,
    },
    trends: (currentTrends.rows ?? []).map((row) => {
      const normalized = normalizeRow(row);
      return {
        date: normalized.keys[0] ?? '',
        clicks: normalized.clicks,
        impressions: normalized.impressions,
        ctr: normalized.ctr,
        position: normalized.position,
      };
    }),
    topQueries: compare ? buildRankedDeltas(currentQueries.rows, previousQueries.rows) : (currentQueries.rows ?? []).map((row) => normalizeRow(row)).map((row) => ({
      key: row.keys[0] ?? '',
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    })),
    topPages: compare ? buildRankedDeltas(currentPages.rows, previousPages.rows) : (currentPages.rows ?? []).map((row) => normalizeRow(row)).map((row) => ({
      key: row.keys[0] ?? '',
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    })),
  };

  ensureDir(REPORTS_DIR);
  const reportPath = path.join(REPORTS_DIR, `search-console-performance-${currentIso().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  return { reportPath, report };
}

export function classifyPerformanceOpportunities(report: Awaited<ReturnType<typeof inspectPerformance>>['report']) {
  const pages = report.topPages.map((page) => ({
    ...page,
    opportunities: [
      page.position >= 4 && page.position <= 15 ? 'posição 4–15: atualizar e reforçar links internos' : null,
      page.impressions >= 100 && page.ctr < 0.03 ? 'muitas impressões com CTR baixo: testar título e meta description' : null,
      page.clickDelta < 0 ? 'queda de cliques: revisar atualização e intenção' : null,
    ].filter(Boolean),
  })).filter((page) => page.opportunities.length > 0);
  const queries = report.topQueries.map((query) => ({
    ...query,
    opportunities: [
      query.position >= 4 && query.position <= 15 ? 'query próxima da primeira página' : null,
      query.impressions >= 20 && query.ctr < 0.03 ? 'impressões sem CTR proporcional' : null,
    ].filter(Boolean),
  })).filter((query) => query.opportunities.length > 0);
  return { pages, queries };
}
