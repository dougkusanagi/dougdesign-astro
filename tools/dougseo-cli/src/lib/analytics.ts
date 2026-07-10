import fs from 'node:fs';
import path from 'node:path';
import { ANALYTICS_READONLY_SCOPE, resolveGoogleAccessToken } from './google-auth';
import { EDITORIAL_DIR, currentIso, ensureDir } from './config';

const API_URL = 'https://analyticsdata.googleapis.com/v1beta/properties';
const REPORTS_DIR = path.join(EDITORIAL_DIR, 'reports');

type Row = { dimensionValues?: { value?: string }[]; metricValues?: { value?: string }[] };
type ReportResponse = { dimensionHeaders?: { name?: string }[]; metricHeaders?: { name?: string }[]; rows?: Row[]; totals?: Row[] };

function propertyId(): string {
  const id = process.env.GA4_PROPERTY_ID || process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
  if (!id) throw new Error('GA4_PROPERTY_ID não configurado. Use o ID numérico da propriedade GA4.');
  return id.replace(/^properties\//, '');
}

async function runReport(accessToken: string, body: Record<string, unknown>): Promise<ReportResponse> {
  const response = await fetch(`${API_URL}/${propertyId()}:runReport`, {
    method: 'POST',
    headers: { authorization: `Bearer ${accessToken}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`GA4 Data API retornou ${response.status}: ${text}`);
  return JSON.parse(text) as ReportResponse;
}

function rows(response: ReportResponse) {
  const dimensions = (response.dimensionHeaders ?? []).map((header) => header.name ?? 'dimension');
  const metrics = (response.metricHeaders ?? []).map((header) => header.name ?? 'metric');
  return (response.rows ?? []).map((row) => Object.fromEntries([
    ...dimensions.map((name, index) => [name, row.dimensionValues?.[index]?.value ?? '']),
    ...metrics.map((name, index) => [name, Number(row.metricValues?.[index]?.value ?? 0)]),
  ]));
}

export async function inspectAnalytics(options: { days: number; top: number; propertyId?: string; includeAdsense?: boolean }) {
  if (options.propertyId) process.env.GA4_PROPERTY_ID = options.propertyId;
  const days = Math.max(1, Number(options.days) || 28);
  const top = Math.max(1, Number(options.top) || 20);
  const accessToken = await resolveGoogleAccessToken(ANALYTICS_READONLY_SCOPE);
  const dateRange = { startDate: `${days}daysAgo`, endDate: 'yesterday' };
  const overviewMetrics = [
    { name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' },
    { name: 'engagementRate' }, { name: 'averageSessionDuration' },
    ...(options.includeAdsense ? [{ name: 'publisherAdImpressions' }, { name: 'publisherAdClicks' }, { name: 'publisherAdRevenue' }] : []),
  ];
  const [overview, pages, sources, daily] = await Promise.all([
    runReport(accessToken, { dateRanges: [dateRange], metrics: [
      ...overviewMetrics,
    ] }),
    runReport(accessToken, { dateRanges: [dateRange], dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }], metrics: [
      { name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }, { name: 'engagementRate' },
    ], limit: top, orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }] }),
    runReport(accessToken, { dateRanges: [dateRange], dimensions: [{ name: 'sessionDefaultChannelGroup' }], metrics: [
      { name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' },
    ], limit: top, orderBys: [{ metric: { metricName: 'sessions' }, desc: true }] }),
    runReport(accessToken, { dateRanges: [dateRange], dimensions: [{ name: 'date' }], metrics: [
      { name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' },
    ], orderBys: [{ dimension: { dimensionName: 'date' } }] }),
  ]);
  const report = { generatedAt: currentIso(), propertyId: propertyId(), period: { days }, overview: rows(overview)[0] ?? {}, pages: rows(pages), sources: rows(sources), daily: rows(daily) };
  ensureDir(REPORTS_DIR);
  const reportPath = path.join(REPORTS_DIR, `analytics-${currentIso().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  return { reportPath, report };
}
