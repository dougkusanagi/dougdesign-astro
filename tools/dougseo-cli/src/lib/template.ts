import fs from 'node:fs';
import path from 'node:path';
import { BLOG_DIR, currentIso, ensureDir, slugify } from './config';
import { canonicalCategoryLabel, canonicalCategorySlug, defaultAuthorForCategory } from './taxonomy';
import { stringifyFrontmatter } from './frontmatter';
import { indexAllPosts } from './content-index';

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

export function scaffoldPost(options: ScaffoldOptions, generated?: { title: string; description: string; body: string; contribution: string; limitations: string[] }): { filePath: string; slug: string } {
  ensureDir(BLOG_DIR);
  const categoryLabel = canonicalCategoryLabel(options.category);
  const categorySlug = canonicalCategorySlug(options.category);
  const title = generated?.title || options.title?.trim() || options.subject.trim();
  const slug = options.slug?.trim() || slugify(title);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Slug inválido: use letras minúsculas, números e hífens, sem caminhos.');
  if (indexAllPosts().some((post) => slugify(post.slug) === slug) || fs.existsSync(path.join(BLOG_DIR, `${slug}.mdx`))) throw new Error(`Slug já existente: ${slug}. Atualize a URL existente.`);
  const author = options.author?.trim() || defaultAuthorForCategory(categoryLabel);
  const pubDate = options.date?.trim() || currentIso();
  const imageName = `${slug}.png`;
  const frontmatter = {
    title,
    slug,
    pubDate,
    author,
    category: categoryLabel,
    draft: true,
    scheduled: false,
    meta_description: generated?.description || options.intent.trim(),
    description: generated?.description || options.intent.trim(),
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
    fato_novo: generated?.contribution || options.subject.trim(),
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

  const body = generated?.body || [
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
  fs.writeFileSync(filePath, stringifyFrontmatter({ ...frontmatter, ...(generated ? { ai_review: { status: 'pendente', limitations: generated.limitations } } : {}) }, body), { encoding: 'utf-8', flag: 'wx' });
  return { filePath, slug };
}
