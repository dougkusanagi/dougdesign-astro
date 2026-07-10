import fs from 'node:fs';
import path from 'node:path';
import { EDITORIAL_DIR, currentIso, ensureDir } from './config';
import { indexAllPosts } from './content-index';

export function inspectFreshness(days = 180) {
  const cutoff = Date.now() - Math.max(1, days) * 86400000;
  const posts = indexAllPosts().filter((post) => !post.draft).map((post) => {
    const lastUpdate = new Date(post.updatedDate || post.pubDate).getTime();
    const ageDays = Math.floor((Date.now() - lastUpdate) / 86400000);
    return { slug: post.slug, title: post.title, cluster: post.cluster, pubDate: post.pubDate, updatedDate: post.updatedDate, ageDays, stale: lastUpdate < cutoff };
  }).filter((post) => post.stale).sort((a, b) => b.ageDays - a.ageDays);
  const report = { generatedAt: currentIso(), thresholdDays: days, total: posts.length, posts };
  const reportDir = path.join(EDITORIAL_DIR, 'reports');
  ensureDir(reportDir);
  const reportPath = path.join(reportDir, `content-freshness-${currentIso().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  return { reportPath, report };
}
