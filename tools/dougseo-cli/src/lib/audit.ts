import fs from 'node:fs';
import path from 'node:path';
import { indexAllPosts } from './content-index';
import { scoreContent } from '../../../../src/lib/contentQuality';

const REQUIRED_FOR_NEW = [
  'slug',
  'featured_image',
  'keyword_principal',
  'content_type',
  'cluster',
  'assunto',
  'intencao_busca',
  'decisao_do_leitor',
  'fato_novo',
  'canonical_role',
  'internal_links',
  'canibalizacao',
  'fontes_oficiais',
];

export interface AuditIssue {
  slug: string;
  filePath: string;
  issues: string[];
}

export function auditPosts(scope: 'drafts' | 'scheduled' | 'published' | 'all'): AuditIssue[] {
  const posts = indexAllPosts().filter((post) => {
    if (scope === 'drafts') return post.draft && !post.scheduled;
    if (scope === 'scheduled') return post.draft && post.scheduled;
    if (scope === 'published') return !post.draft;
    return true;
  });

  return posts.flatMap((post) => {
    const issues: string[] = [];
    const isLegacy = post.frontmatter.canibalizacao?.status === 'legado-importado';
    if (post.body.includes('file://')) issues.push('contém links file://');
    if (!post.frontmatter.image) issues.push('campo image ausente');
    if (/^#\s+/m.test(post.body)) issues.push('H1 duplicado no Markdown; o template já fornece o H1 da página');
    if (post.frontmatter.image && typeof post.frontmatter.image === 'string' && post.frontmatter.image.startsWith('../')) {
      const imagePath = path.resolve(path.dirname(post.filePath), post.frontmatter.image);
      if (!fs.existsSync(imagePath)) issues.push('imagem declarada não existe no filesystem');
    }
    if ((post.draft || post.scheduled) && post.wordCount < 150 && !isLegacy) issues.push('conteúdo muito curto para draft operacional');
    if ((post.draft || post.scheduled) && !isLegacy) {
      for (const field of REQUIRED_FOR_NEW) {
        const value = post.frontmatter[field];
        if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
          issues.push(`campo ausente: ${field}`);
        }
      }

      // Quality assessment scoring
      const quality = scoreContent(post.body, post.frontmatter);
      if (!quality.ok) {
        issues.push(`qualidade abaixo da meta: score ${quality.score}/100. Avisos: ${quality.warnings.join(' | ')}`);
      }
    }
    return issues.length ? [{ slug: post.slug, filePath: post.filePath, issues }] : [];
  });
}
