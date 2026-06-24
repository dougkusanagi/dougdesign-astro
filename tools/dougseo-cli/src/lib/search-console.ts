import fs from 'node:fs';
import path from 'node:path';
import { EDITORIAL_DIR, currentIso, ensureDir } from './config';
import { indexAllPosts } from './content-index';

const REPORTS_DIR = path.join(EDITORIAL_DIR, 'reports');
const SEARCH_CONSOLE_API = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';

export async function inspectLatestUrls(options: {
  latest: number;
  siteUrl?: string;
  accessToken?: string;
  languageCode?: string;
}) {
  const accessToken = options.accessToken || process.env.GOOGLE_OAUTH_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('GOOGLE_OAUTH_ACCESS_TOKEN ausente.');
  }
  const siteUrl = options.siteUrl || process.env.GSC_SITE_URL || 'https://dougdesign.com.br/';
  const urls = indexAllPosts()
    .filter((post) => !post.draft)
    .sort((a, b) => b.pubDate.localeCompare(a.pubDate))
    .slice(0, options.latest)
    .map((post) => post.url);

  const results = [];
  for (const url of urls) {
    const response = await fetch(SEARCH_CONSOLE_API, {
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
