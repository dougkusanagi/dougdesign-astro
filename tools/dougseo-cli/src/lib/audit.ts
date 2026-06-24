import { indexAllPosts } from './content-index';

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
    if ((post.draft || post.scheduled) && post.wordCount < 150 && !isLegacy) issues.push('conteúdo muito curto para draft operacional');
    if ((post.draft || post.scheduled) && !isLegacy) {
      for (const field of REQUIRED_FOR_NEW) {
        const value = post.frontmatter[field];
        if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
          issues.push(`campo ausente: ${field}`);
        }
      }
    }
    return issues.length ? [{ slug: post.slug, filePath: post.filePath, issues }] : [];
  });
}
