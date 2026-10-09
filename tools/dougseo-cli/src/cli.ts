#!/usr/bin/env bun
import { Command, Option } from 'commander';
import { aiDiagnostics } from './lib/ai';
import { buildInventory, readInventoryStats } from './lib/inventory';
import { BLOG_DIR, COVERS_DIR, EDITORIAL_DIR, REPO_ROOT } from './lib/config';
import { checkIntent } from './lib/intent-check';
import { scaffoldPost } from './lib/template';
import { createDraftWithAI } from './lib/draft';
import { auditPosts, partitionAudit } from './lib/audit';
import { commitChanges } from './lib/git';
import { publishPost, schedulePost, updatePostSources } from './lib/post-ops';
import { generateCover } from './lib/cover';
import { listDuePosts, runQueue } from './lib/queue';
import { classifyPerformanceOpportunities, inspectLatestUrls, inspectPerformance, sitemapStatus } from './lib/search-console';
import { buildBrief, renderBrief, saveBrief } from './lib/brief';
import { renderKeywords, researchKeywords } from './lib/keywords';
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
  .version('0.1.0')
  .addOption(new Option('--ai-provider <provider>', 'provedor principal da busca semântica').choices(['codex', 'ollama']))
  .addOption(new Option('--ai-fallback <provider>', 'fallback da busca semântica').choices(['ollama', 'none']))
  .hook('preAction', () => {
    const options = program.opts();
    if (options.aiProvider) process.env.DOUGSEO_AI_PROVIDER = options.aiProvider;
    if (options.aiFallback) process.env.DOUGSEO_AI_FALLBACK = options.aiFallback;
  });

program.command('doctor').action(() => {
  console.log(JSON.stringify({
    ok: true,
    repoRoot: REPO_ROOT,
    blogDir: BLOG_DIR,
    coversDir: COVERS_DIR,
    editorialDir: EDITORIAL_DIR,
    ai: aiDiagnostics(),
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
  .option('--with-ai', 'gerar rascunho a partir de fontes fornecidas', false)
  .option('--source-material <json>', 'arquivo JSON com url, consultedAt e text para cada fonte')
  .action(async (options) => {
    const result = options.withAi ? await createDraftWithAI(options) : scaffoldPost(options);
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
  .option('--svg <path>', 'use an authored SVG as the local fallback cover')
  .action(async (options) => {
    const result = await generateCover(options.slug, options.svg);
    console.log(JSON.stringify({ ok: true, ...result, method: options.svg ? 'authored-svg-png' : 'template-png' }, null, 2));
  });

program.command('publish')
  .requiredOption('--slug <slug>')
  .option('--commit', 'create a git commit after the change', false)
  .option('--push', 'commit and push after the change', false)
  .action((options) => {
    const result = publishPost(options.slug);
    if (options.commit || options.push) {
      commitChanges(`editorial: publish ${result.slug}`, [result.filePath], { push: options.push });
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
      commitChanges(`editorial: schedule ${result.slug}`, [result.filePath], { push: options.push });
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
      commitChanges(options.ci ? `editorial: promote scheduled posts (${promoted.length})` : 'editorial: promote scheduled posts', promoted.map((post) => post.filePath), { push: options.push || options.ci });
    }
    console.log(JSON.stringify({ ok: true, promoted }, null, 2));
  });

program.command('audit')
  .addOption(new Option('--scope <scope>', 'escopo da auditoria').choices(['drafts', 'scheduled', 'published', 'all']).default('all'))
  .option('--slug <slug>', 'auditar uma URL específica com todos os requisitos')
  .option('--include-legacy', 'inclui posts legado-importado (dívida conhecida) no resultado e no código de saída')
  .action((options) => {
    const all = auditPosts(options.scope, { slug: options.slug });
    // Com --slug a auditoria é sempre completa; sem ele, o legado vira só um resumo.
    const { strict, legacy } = partitionAudit(all, Boolean(options.includeLegacy || options.slug));
    console.log(JSON.stringify({ ok: strict.length === 0, issues: strict, legacy }, null, 2));
    if (strict.length) process.exitCode = 1;
  });

const searchConsole = program.command('search-console');

searchConsole.command('inspect')
  .option('--latest <latest>', 'number of latest URLs', '20')
  .option('--slug <slug...>', 'inspecionar estes slugs em vez dos mais recentes')
  .option('--site-url <siteUrl>')
  .option('--access-token <accessToken>')
  .option('--language-code <languageCode>')
  .action(async (options) => {
    const result = await inspectLatestUrls({
      latest: Number(options.latest),
      slugs: options.slug,
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

searchConsole.command('sitemap')
  .description('estado dos sitemaps no Search Console; --submit reenvia o índice para o Google baixar de novo')
  .option('--submit', 'reenviar sitemap-index.xml', false)
  .action(async (options) => {
    console.log(JSON.stringify({ ok: true, ...await sitemapStatus({ submit: options.submit }) }, null, 2));
  });

program.command('brief')
  .description('resumo de decisão: oportunidades, canibalização, efeito das mudanças, posts novos e acervo')
  .option('--days <days>', 'janela de comparação em dias', '28')
  .option('--cooldown <days>', 'dias de observação após alterar uma URL', '14')
  .option('--top <top>', 'itens por seção', '10')
  .option('--no-inspect', 'não consultar o índice dos posts novos sem impressões')
  .option('--json', 'imprimir JSON em vez de Markdown', false)
  .action(async (options) => {
    const brief = await buildBrief({ days: Number(options.days), cooldownDays: Number(options.cooldown), top: Number(options.top), inspect: options.inspect });
    const reportPath = saveBrief(brief);
    console.log(options.json ? JSON.stringify({ ok: true, reportPath, ...brief }, null, 2) : `${renderBrief(brief)}\nJSON completo: ${reportPath}`);
  });

program.command('keywords')
  .description('como o brasileiro busca um tema: preenchimento automático do Google/YouTube em pt-BR + consultas do Search Console + checagem do título')
  .argument('[seed...]', 'tema em português, como alguém digitaria (ex.: promoção steam)')
  .option('--slug <slug>', 'usar as consultas desta página; sem tema, parte da consulta com mais impressões')
  .option('--title <title>', 'título candidato a conferir')
  .option('--days <days>', 'janela do Search Console', '90')
  .option('--no-youtube', 'não consultar sugestões do YouTube')
  .option('--no-gsc', 'não consultar o Search Console')
  .option('--json', 'imprimir JSON', false)
  .action(async (seed: string[], options) => {
    const result = await researchKeywords({ seed: seed.join(' '), slug: options.slug, title: options.title, days: Number(options.days), youtube: options.youtube, gsc: options.gsc });
    console.log(options.json ? JSON.stringify({ ok: true, ...result }, null, 2) : renderKeywords(result));
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
