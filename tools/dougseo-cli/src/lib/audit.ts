import fs from 'node:fs';
import path from 'node:path';
import { indexAllPosts, type IndexedPost } from './content-index';
import { REPO_ROOT } from './config';
import { scoreContent } from '../../../../src/lib/contentQuality';

const REQUIRED = ['title', 'slug', 'author', 'category', 'pubDate', 'draft', 'scheduled', 'description', 'meta_description',
  'featured_image', 'keyword_principal', 'content_type', 'cluster', 'assunto', 'intencao_busca',
  'decisao_do_leitor', 'fato_novo', 'canonical_role', 'internal_links', 'canibalizacao', 'fontes_oficiais'];
export interface AuditIssue { slug: string; filePath: string; issues: string[]; legacy: boolean }
export type AuditScope = 'drafts' | 'scheduled' | 'published' | 'all';

export function auditPosts(scope: AuditScope, options: { slug?: string } = {}): AuditIssue[] {
  if (!['drafts', 'scheduled', 'published', 'all'].includes(scope)) throw new Error('Escopo inválido de auditoria.');
  const all = indexAllPosts();
  if (options.slug && !all.some((post) => post.slug === options.slug)) throw new Error(`Post não encontrado: ${options.slug}`);
  const posts = all.filter((post) => (!options.slug || post.slug === options.slug) && (
    scope === 'all' || (scope === 'published' && !post.draft) || (scope === 'drafts' && post.draft && !post.scheduled) || (scope === 'scheduled' && post.draft && post.scheduled)));
  const duplicates = new Set(all.filter((post, index) => all.findIndex((other) => other.slug === post.slug) !== index).map((post) => post.slug));
  return posts.flatMap((post) => {
    const issues = auditPost(post, all);
    if (duplicates.has(post.slug)) issues.push('slug duplicado no inventário');
    return issues.length ? [{ slug: post.slug, filePath: post.filePath, issues, legacy: post.frontmatter.canibalizacao?.status === 'legado-importado' }] : [];
  });
}

/**
 * Posts marcados `canibalizacao.status: legado-importado` são dívida conhecida
 * (ainda não revisados). O relatório os separa para que o código de saída reflita
 * só o que está sob responsabilidade editorial atual; revisar um post e trocar o
 * status passa a exigir a auditoria completa.
 */
export function partitionAudit(issues: AuditIssue[], includeLegacy = false) {
  const legacy = issues.filter((issue) => issue.legacy);
  const strict = includeLegacy ? issues : issues.filter((issue) => !issue.legacy);
  return {
    strict,
    legacy: { posts: legacy.length, issues: legacy.reduce((total, issue) => total + issue.issues.length, 0), listed: includeLegacy },
  };
}

function auditPost(post: IndexedPost, all: IndexedPost[]): string[] {
  const issues: string[] = [];
  const fm = post.frontmatter;
  for (const field of REQUIRED) {
    const value = fm[field];
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && !value.length)) issues.push(`campo ausente: ${field}`);
  }
  if (typeof fm.draft !== 'boolean' || typeof fm.scheduled !== 'boolean') issues.push('draft e scheduled devem ser booleanos');
  if (post.scheduled && !post.draft) issues.push('scheduled exige draft: true');
  if (!Number.isFinite(Date.parse(post.pubDate))) issues.push('pubDate inválida');
  if (post.updatedDate && !Number.isFinite(Date.parse(post.updatedDate))) issues.push('updatedDate inválida');
  if (typeof fm.meta_description !== 'string' || !fm.meta_description.trim() || fm.meta_description.length > 160) issues.push('meta_description deve ter de 1 a 160 caracteres');
  if (!fm.canibalizacao?.status || !fm.canibalizacao?.resumo) issues.push('canibalizacao exige status e resumo');
  if (!Array.isArray(fm.internal_links?.to) || !Array.isArray(fm.internal_links?.from_needed)) issues.push('internal_links exige to e from_needed');
  if (!Array.isArray(fm.fontes_oficiais) || fm.fontes_oficiais.some((source: unknown) => typeof source !== 'string' || !/^https?:\/\//.test(source))) issues.push('fontes_oficiais deve conter URLs HTTP(S)');
  if (fm.ai_review !== undefined && fm.ai_review?.status !== 'revisado') issues.push('rascunho gerado por IA aguarda revisão factual manual');
  const text = post.body.replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, '').replace(/^~~~[^\n]*\n[\s\S]*?^~~~\s*$/gm, '');
  if (/^#\s+/m.test(text) || /<h1\b/i.test(text)) issues.push('H1 no corpo duplica o título renderizado');
  if (post.wordCount < 150 && !fm.quality_notes?.below_word_target_reason) issues.push('conteúdo muito curto sem justificativa editorial');
  if (/Resposta curta com contexto|Descreva o fato novo|Inserir links internos contextuais|Feche com opiniao clara/i.test(text)) issues.push('placeholders de scaffold precisam ser substituídos');
  if (text.includes('file://')) issues.push('contém links file://');
  if (/URL publicada:|Resumo espelhado|Conte[uú]do espelhado/i.test(text)) issues.push('blocos de importação precisam de revisão');
  const quality = scoreContent(post.body, fm);
  if (!quality.ok) issues.push(`qualidade abaixo da meta: score ${quality.score}/100. ${quality.warnings.join(' | ')}`);
  const image = typeof fm.image === 'string' ? path.resolve(path.dirname(post.filePath), fm.image) : '';
  if (!image || !fs.existsSync(image) || !fs.statSync(image).isFile()) issues.push('capa ausente ou caminho inválido');
  if (typeof fm.featured_image?.alt !== 'string' || !fm.featured_image.alt.trim()) issues.push('alt da capa ausente');
  if (typeof fm.featured_image?.prompt !== 'string' || !fm.featured_image.prompt.trim()) issues.push('prompt ou procedência da capa ausente');
  if (typeof fm.featured_image?.generated_path !== 'string' || !image || path.resolve(REPO_ROOT, fm.featured_image.generated_path) !== image) issues.push('generated_path não corresponde à capa');

  const links = [...text.matchAll(/!?\[[^\]]*\]\(<?([^\s)>]+)>?(?:\s+[^)]*)?\)/g)]
    .filter((match) => !match[0].startsWith('!')).map((match) => match[1]);
  const internal = new Set<string>();
  for (const link of links) {
    let url: URL;
    try { url = new URL(link, post.url); } catch { issues.push(`link inválido: ${link}`); continue; }
    if (!['dougdesign.com.br', 'www.dougdesign.com.br'].includes(url.hostname)) continue;
    if (link.startsWith('#')) continue;
    const route = url.pathname.replace(/^\/+|\/+$/g, '');
    // Navigation routes and anchors are not article destinations.
    if (!route || /^(category|autores|posts)(\/|$)/.test(route) || ['contato', 'privacidade', 'termos', 'docs/components'].includes(route)) continue;
    internal.add(route);
    const target = all.find((entry) => entry.slug === route);
    if (!target || target.draft || Date.parse(target.pubDate) > Date.now()) issues.push(`link interno sem artigo publicado: ${link}`);
  }
  for (const registered of Array.isArray(fm.internal_links?.to) ? fm.internal_links.to : []) {
    try {
      const route = new URL(registered, post.url).pathname.replace(/^\/+|\/+$/g, '');
      if (!internal.has(route)) issues.push(`internal_links.to sem link no corpo: ${registered}`);
    } catch { issues.push(`internal_links.to inválido: ${registered}`); }
  }
  const registered = new Set((Array.isArray(fm.internal_links?.to) ? fm.internal_links.to : []).map((link: string) => {
    try { return new URL(link, post.url).pathname.replace(/^\/+|\/+$/g, ''); } catch { return ''; }
  }));
  for (const route of internal) if (!registered.has(route)) issues.push(`link no corpo não registrado em internal_links.to: /${route}/`);
  return [...new Set(issues)];
}
