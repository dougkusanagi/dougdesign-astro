#!/usr/bin/env bun
import { Command } from 'commander';
import { buildInventory, readInventoryStats } from './lib/inventory';
import { BLOG_DIR, COVERS_DIR, EDITORIAL_DIR, REPO_ROOT } from './lib/config';
import { checkIntent } from './lib/intent-check';
import { scaffoldPost } from './lib/template';
import { auditPosts } from './lib/audit';
import { commitAndPush } from './lib/git';
import { publishPost, schedulePost, updatePostSources } from './lib/post-ops';
import { generateCover } from './lib/cover';
import { listDuePosts, runQueue } from './lib/queue';
import { classifyPerformanceOpportunities, inspectLatestUrls, inspectPerformance } from './lib/search-console';
import { triggerDeploy } from './lib/deploy';
import { normalizeContent } from './lib/normalize';
import { loadRepoEnv } from './lib/env';
import { inspectAnalytics } from './lib/analytics';
import { auditContentArchitecture } from './lib/content-architecture';
import { inspectFreshness } from './lib/freshness';

loadRepoEnv();

const program = new Command();

program
  .name('dougseo')
  .description('CLI editorial local para o blog Astro do Doug Design')
  .version('0.1.0');

program.command('doctor').action(() => {
  console.log(JSON.stringify({
    ok: true,
    repoRoot: REPO_ROOT,
    blogDir: BLOG_DIR,
    coversDir: COVERS_DIR,
    editorialDir: EDITORIAL_DIR,
  }, null, 2));
});

const inventory = program.command('inventory');
inventory.command('build').action(() => {
  console.log(JSON.stringify(buildInventory(), null, 2));
});
inventory.command('stats').action(() => {
  console.log(JSON.stringify(readInventoryStats(), null, 2));
});

program.command('intent')
  .command('check')
  .requiredOption('--category <category>')
  .requiredOption('--subject <subject>')
  .requiredOption('--intent <intent>')
  .option('--slug <slug>')
  .action(async (options) => {
    const result = await checkIntent(options);
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exitCode = 1;
  });

const post = program.command('post');
post.command('scaffold')
  .requiredOption('--category <category>')
  .requiredOption('--subject <subject>')
  .requiredOption('--intent <intent>')
  .requiredOption('--source <source...>')
  .option('--title <title>')
  .option('--slug <slug>')
  .option('--author <author>')
  .option('--decision <decision>')
  .option('--type <type>')
  .option('--cluster <cluster>')
  .option('--keyword <keyword>')
  .option('--date <date>')
  .action((options) => {
    const result = scaffoldPost(options);
    console.log(JSON.stringify({ ok: true, ...result }, null, 2));
  });

post.command('create')
  .requiredOption('--category <category>')
  .requiredOption('--subject <subject>')
  .requiredOption('--intent <intent>')
  .requiredOption('--source <source...>')
  .option('--title <title>')
  .option('--slug <slug>')
  .option('--author <author>')
  .option('--decision <decision>')
  .option('--type <type>')
  .option('--cluster <cluster>')
  .option('--keyword <keyword>')
  .option('--date <date>')
  .option('--with-ai', 'placeholder flag for future native AI draft generation', false)
  .action((options) => {
    if (options.withAi) {
      console.error('Aviso: --with-ai ainda faz scaffold local; a geracao editorial continua sendo refinada manualmente.');
    }
    const result = scaffoldPost(options);
    console.log(JSON.stringify({ ok: true, ...result }, null, 2));
  });

post.command('update')
  .requiredOption('--slug <slug>')
  .requiredOption('--source <source...>')
  .action((options) => {
    const result = updatePostSources(options.slug, options.source);
    console.log(JSON.stringify({ ok: true, ...result }, null, 2));
  });

program.command('cover')
  .command('generate')
  .requiredOption('--slug <slug>')
  .option('--html', 'compat flag; the local generator already uses an SVG/PNG template', false)
  .action(async (options) => {
    const result = await generateCover(options.slug);
    console.log(JSON.stringify({ ok: true, ...result, method: 'template-png' }, null, 2));
  });

program.command('publish')
  .requiredOption('--slug <slug>')
  .option('--commit', 'create a git commit after the change', false)
  .option('--push', 'commit and push after the change', false)
  .action((options) => {
    const result = publishPost(options.slug);
    if (options.commit || options.push) {
      commitAndPush(`editorial: publish ${result.slug}`);
    }
    console.log(JSON.stringify({ ok: true, ...result }, null, 2));
  });

program.command('schedule')
  .requiredOption('--slug <slug>')
  .requiredOption('--at <isoDate>')
  .option('--commit', 'create a git commit after the change', false)
  .option('--push', 'commit and push after the change', false)
  .action((options) => {
    const result = schedulePost(options.slug, options.at);
    if (options.commit || options.push) {
      commitAndPush(`editorial: schedule ${result.slug}`);
    }
    console.log(JSON.stringify({ ok: true, ...result }, null, 2));
  });

const queue = program.command('queue');
queue.command('list').action(() => {
  console.log(JSON.stringify({ ok: true, due: listDuePosts().map((post) => ({ slug: post.slug, pubDate: post.pubDate, filePath: post.filePath })) }, null, 2));
});
queue.command('run')
  .option('--commit', 'commit the promoted posts', false)
  .option('--push', 'commit and push the promoted posts', false)
  .option('--ci', 'use CI-oriented commit message', false)
  .action((options) => {
    const promoted = runQueue();
    if (promoted.length && (options.commit || options.push || options.ci)) {
      commitAndPush(options.ci ? `editorial: promote scheduled posts (${promoted.length})` : 'editorial: promote scheduled posts');
    }
    console.log(JSON.stringify({ ok: true, promoted }, null, 2));
  });

program.command('audit')
  .option('--scope <scope>', 'drafts|scheduled|published|all', 'all')
  .action((options) => {
    const issues = auditPosts(options.scope);
    console.log(JSON.stringify({ ok: issues.length === 0, issues }, null, 2));
    if (issues.length) process.exitCode = 1;
  });

const searchConsole = program.command('search-console');

searchConsole.command('inspect')
  .option('--latest <latest>', 'number of latest URLs', '20')
  .option('--site-url <siteUrl>')
  .option('--access-token <accessToken>')
  .option('--language-code <languageCode>')
  .action(async (options) => {
    const result = await inspectLatestUrls({
      latest: Number(options.latest),
      siteUrl: options.siteUrl,
      accessToken: options.accessToken,
      languageCode: options.languageCode,
    });
    console.log(JSON.stringify({ ok: true, ...result }, null, 2));
  });

const analytics = program.command('analytics');
const analyticsOptions = (command: ReturnType<typeof analytics.command>) => command
  .option('--days <days>', 'number of recent days to inspect', '28')
  .option('--top <top>', 'top rows to keep per section', '20')
  .option('--property-id <propertyId>', 'GA4 numeric property ID');
const runAnalytics = async (options: { days: string; top: string; propertyId?: string }, includeAdsense = false) => {
    const result = await inspectAnalytics({ days: Number(options.days), top: Number(options.top), propertyId: options.propertyId, includeAdsense });
    console.log(JSON.stringify({ ok: true, ...result }, null, 2));
};
for (const name of ['performance', 'overview', 'pages', 'sources', 'engagement', 'adsense']) {
  analyticsOptions(analytics.command(name)).action((options) => runAnalytics(options, name === 'adsense'));
}

searchConsole.command('performance')
  .option('--days <days>', 'number of recent days to inspect', '28')
  .option('--top <top>', 'top rows to keep per section', '20')
  .option('--site-url <siteUrl>')
  .option('--access-token <accessToken>')
  .option('--search-type <searchType>', 'web|discover|image|video|news', 'web')
  .option('--no-compare', 'skip previous-period comparison', false)
  .action(async (options) => {
    const result = await inspectPerformance({
      days: Number(options.days),
      top: Number(options.top),
      siteUrl: options.siteUrl,
      accessToken: options.accessToken,
      searchType: options.searchType,
      compare: !options.noCompare,
    });
    console.log(JSON.stringify({ ok: true, ...result }, null, 2));
  });

searchConsole.command('opportunities')
  .option('--days <days>', 'number of recent days to inspect', '28')
  .option('--top <top>', 'top rows to keep per section', '100')
  .option('--site-url <siteUrl>')
  .action(async (options) => {
    const result = await inspectPerformance({ days: Number(options.days), top: Number(options.top), siteUrl: options.siteUrl, compare: true });
    console.log(JSON.stringify({ ok: true, reportPath: result.reportPath, opportunities: classifyPerformanceOpportunities(result.report) }, null, 2));
  });

program.command('deploy')
  .command('trigger')
  .action(async () => {
    const result = await triggerDeploy();
    console.log(JSON.stringify(result, null, 2));
  });

const content = program.command('content');
content.command('audit').action(() => {
  console.log(JSON.stringify({ ok: true, ...auditContentArchitecture() }, null, 2));
});
content.command('freshness')
  .option('--days <days>', 'considerar stale após este número de dias', '180')
  .action((options) => console.log(JSON.stringify({ ok: true, ...inspectFreshness(Number(options.days)) }, null, 2)));
content.command('normalize')
  .option('--write', 'write the proposed normalizations to disk', false)
  .action((options) => {
    const changes = normalizeContent(options.write);
    console.log(JSON.stringify({ ok: true, write: options.write, changes }, null, 2));
  });

program.parseAsync(process.argv).catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
