import fs from 'node:fs';
import path from 'node:path';
import { BLOG_DIR, currentIso, ensureDir, slugify } from './config';
import { canonicalCategoryLabel, canonicalCategorySlug, defaultAuthorForCategory } from './taxonomy';
import { stringifyFrontmatter } from './frontmatter';

export interface ScaffoldOptions {
  category: string;
  subject: string;
  intent: string;
  source: string[];
  title?: string;
  slug?: string;
  author?: string;
  decision?: string;
  type?: string;
  cluster?: string;
  keyword?: string;
  date?: string;
}

export function scaffoldPost(options: ScaffoldOptions): { filePath: string; slug: string } {
  ensureDir(BLOG_DIR);
  const categoryLabel = canonicalCategoryLabel(options.category);
  const categorySlug = canonicalCategorySlug(options.category);
  const title = options.title?.trim() || options.subject.trim();
  const slug = options.slug?.trim() || slugify(title);
  const author = options.author?.trim() || defaultAuthorForCategory(categoryLabel);
  const pubDate = options.date?.trim() || currentIso();
  const imageName = `${slug}.png`;
  const frontmatter = {
    title,
    slug,
    pubDate,
    updatedDate: pubDate,
    author,
    category: categoryLabel,
    draft: true,
    scheduled: false,
    meta_description: options.keyword?.trim() || options.intent.trim(),
    description: options.keyword?.trim() || options.intent.trim(),
    image: `../../assets/images/posts/${imageName}`,
    readingTime: '0 min',
    featured_image: {
      prompt: '',
      alt: '',
      generated_path: `src/assets/images/posts/${imageName}`,
    },
    keyword_principal: options.keyword?.trim() || options.subject.trim(),
    content_type: options.type?.trim() || 'noticia',
    cluster: options.cluster?.trim() || categorySlug,
    assunto: options.subject.trim(),
    intencao_busca: options.intent.trim(),
    decisao_do_leitor: options.decision?.trim() || 'decidir',
    fato_novo: options.subject.trim(),
    canonical_role: 'apoio',
    internal_links: {
      to: [],
      from_needed: [],
    },
    quality_notes: {
      below_word_target_reason: null,
    },
    canibalizacao: {
      status: 'pendente',
      resumo: 'Validar com dougseo intent check antes de publicar.',
    },
    fontes_oficiais: options.source,
  };

  const body = [
    `# ${title}`,
    '',
    '## Resumo rapido',
    '',
    'Resposta curta com contexto, impacto e recomendacao inicial.',
    '',
    '## O que aconteceu',
    '',
    'Descreva o fato novo com base nas fontes oficiais.',
    '',
    '## O que e oficial',
    '',
    'Separe aqui o que foi confirmado.',
    '',
    '## O que ainda falta confirmar',
    '',
    'Liste duvidas, limites e pontos em aberto.',
    '',
    '## O que muda para o leitor brasileiro',
    '',
    'Explique preco, disponibilidade, risco ou decisao pratica.',
    '',
    '## Minha leitura',
    '',
    'Feche com opiniao clara e proximo passo recomendado.',
    '',
    '## Leia tambem',
    '',
    '- Inserir links internos contextuais',
    '',
    '## Fonte',
    '',
    ...options.source.map((source) => `- ${source}`),
    '',
  ].join('\n');

  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  fs.writeFileSync(filePath, stringifyFrontmatter(frontmatter, body), 'utf-8');
  return { filePath, slug };
}
