import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { validateScheduledDate } from '../../tools/dougseo-cli/src/lib/dates';
import { scaffoldPost } from '../../tools/dougseo-cli/src/lib/template';
import { publishPost, schedulePost, updatePostSources } from '../../tools/dougseo-cli/src/lib/post-ops';
import { auditPosts } from '../../tools/dougseo-cli/src/lib/audit';
import { commitChanges } from '../../tools/dougseo-cli/src/lib/git';
import { runQueue } from '../../tools/dougseo-cli/src/lib/queue';

const fixture = await vi.hoisted(async () => {
  const fs = await import('node:fs'); const os = await import('node:os'); const path = await import('node:path');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dougseo-tests-'));
  return { root, blog: path.join(root, 'src/content/blog') };
});
vi.mock('../../tools/dougseo-cli/src/lib/config', () => ({
  REPO_ROOT: fixture.root, BLOG_DIR: fixture.blog,
  TAXONOMY_PATH: `${fixture.root}/taxonomy.yml`,
  currentIso: () => new Date().toISOString(),
  slugify: (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  ensureDir: (p: string) => fs.mkdirSync(p, { recursive: true }),
  countWords: (s: string) => s.trim().split(/\s+/).length,
}));
vi.mock('../../tools/dougseo-cli/src/lib/taxonomy', () => ({ canonicalCategoryLabel: (s: string) => s, canonicalCategorySlug: (s: string) => s.toLowerCase(), defaultAuthorForCategory: () => 'Autor', normalizeAuthor: (s: string) => s }));
const body = 'Texto claro para decidir a compra com dados e limites. '.repeat(35);
const frontmatter = () => ({ title: 'Artigo', slug: 'artigo', author: 'Autor real', category: 'Games', pubDate: '2026-01-01', updatedDate: '2026-02-01', draft: true, scheduled: false,
  description: 'Descrição útil.', meta_description: 'Descrição útil.', image: '../../assets/images/posts/artigo.png',
  featured_image: { alt: 'Ilustração', prompt: 'Ilustração conceitual', generated_path: 'src/assets/images/posts/artigo.png' },
  keyword_principal: 'tema', content_type: 'guia', cluster: 'tema', assunto: 'tema', intencao_busca: 'decidir', decisao_do_leitor: 'decidir', fato_novo: 'análise', canonical_role: 'pilar',
  internal_links: { to: [], from_needed: [] }, canibalizacao: { status: 'revisado', resumo: 'revisado' }, fontes_oficiais: ['https://example.com/fonte'] });
function write(fm = frontmatter(), text = body) {
  fs.writeFileSync(path.join(fixture.blog, `${fm.slug}.md`), `---\n${JSON.stringify(fm)}\n---\n\n${text}\n`);
}
const read = () => fs.readFileSync(path.join(fixture.blog, 'artigo.md'), 'utf8');
const git = (...args: string[]) => execFileSync('git', args, { cwd: fixture.root, encoding: 'utf8' }).trim();
beforeEach(() => {
  for (const name of fs.readdirSync(fixture.root)) fs.rmSync(path.join(fixture.root, name), { recursive: true, force: true });
  fs.mkdirSync(fixture.blog, { recursive: true });
  fs.mkdirSync(path.join(fixture.root, 'src/assets/images/posts'), { recursive: true });
  fs.writeFileSync(path.join(fixture.root, 'src/assets/images/posts/artigo.png'), 'imagem fixture');
  write();
});
afterAll(() => fs.rmSync(fixture.root, { recursive: true, force: true }));

describe('datas e operações editoriais', () => {
  it('rejeita data sem fuso, inválida e passada; aceita futuro com fuso', () => {
    const now = new Date('2026-09-30T12:00:00Z');
    for (const value of ['2026-10-01', '2026-10-01T12:00:00', '2027-02-30T12:00:00-03:00', '2026-09-30T11:00:00Z', '2026-10-01T24:00:00Z']) expect(() => validateScheduledDate(value, now)).toThrow();
    expect(validateScheduledDate('2026-10-01T12:00:00-03:00', now)).toContain('-03:00');
  });
  it('não retira artigo publicado do ar nem altera datas ao adicionar fontes', () => {
    write({ ...frontmatter(), draft: false }); const before = read();
    expect(() => schedulePost('artigo', '2099-01-01T12:00:00-03:00')).toThrow('publicado'); expect(read()).toBe(before);
    updatePostSources('artigo', ['https://example.com/nova']);
    expect(read()).toContain('2026-02-01'); expect(read()).toContain('2026-01-01');
    expect(read()).toContain('Autor real');
  });
  it('agenda rascunho pronto e publica sem fabricar atualização', () => {
    schedulePost('artigo', '2099-01-01T12:00:00-03:00');
    expect(read()).toContain('2099-01-01'); expect(read()).toContain('2026-02-01');
    expect(() => publishPost('artigo')).toThrow('futura');
    write(); publishPost('artigo');
    expect(read()).toContain('draft: false'); expect(read()).toContain('2026-02-01');
  });
  it('recusa publicar artigo não auditado e pré-valida a fila inteira', () => {
    write({ ...frontmatter(), scheduled: true }, '# Título duplicado\n'+body); const before = read();
    expect(() => runQueue()).toThrow('Fila bloqueada'); expect(read()).toBe(before);
    expect(() => publishPost('artigo')).toThrow('H1');
  });
});
describe('scaffold e auditoria', () => {
  const options = { category: 'Games', subject: 'Novo assunto', intent: 'nova decisão', source: ['https://example.com'] };
  it('impede sobrescrita e paths; cria rascunho sem H1', () => {
    const before = read();
    for (const slug of ['artigo', '../escape', '/tmp/escape', 'pasta/artigo']) expect(() => scaffoldPost({ ...options, slug })).toThrow();
    expect(read()).toBe(before);
    const result = scaffoldPost({ ...options, slug: 'novo' });
    const text = fs.readFileSync(result.filePath, 'utf8'); expect(text).toContain('draft: true'); expect(text).not.toContain('# Novo assunto');
  });
  it('mantém texto gerado em rascunho sem agendamento e bloqueia publicação sem revisão', () => {
    const result = scaffoldPost({ ...options, slug: 'gerado' }, { title: 'Gerado', description: 'Descrição.', body, contribution: 'Explicação', limitations: ['Sem teste próprio'] });
    const text = fs.readFileSync(result.filePath, 'utf8');
    expect(text).toContain('draft: true'); expect(text).toContain('scheduled: false'); expect(text).toContain('status: pendente');
    expect(() => publishPost('gerado')).toThrow('revisão factual');
  });
  it('detecta colisão em arquivo MDX mesmo com outro slug no frontmatter', () => {
    fs.writeFileSync(path.join(fixture.blog, 'novo.mdx'), '---\nslug: outro\ntitle: Outro\n---\nTexto');
    expect(() => scaffoldPost({ ...options, slug: 'novo' })).toThrow();
  });
  it('audita publicados/legados e detecta H1, capa e links relativos quebrados', () => {
    write({ ...frontmatter(), draft: false, canibalizacao: { status: 'legado-importado', resumo: 'legado' }, image: '../../assets/images/posts/inexistente.png' }, '# Duplicado\n'+body+'\n[Link](/ausente/)');
    const issues = auditPosts('published')[0].issues.join(' ');
    expect(issues).toContain('H1'); expect(issues).toContain('capa'); expect(issues).toContain('sem artigo publicado');
    expect(() => auditPosts('invalid' as any)).toThrow(); expect(() => auditPosts('all', { slug: 'ausente' })).toThrow();
  });
  it('não confunde cabeçalho dentro de bloco de código com H1', () => {
    write(frontmatter(), body+'\n```md\n# Exemplo de código\n```\n'); expect(auditPosts('all')).toEqual([]);
  });
});
describe('Git por arquivo', () => {
  it('preserva trabalho staged alheio e --commit não envia push', () => {
    git('init', '-b', 'master'); git('config', 'user.name', 'Teste'); git('config', 'user.email', 'teste@example.com');
    fs.writeFileSync(path.join(fixture.root, 'a.txt'), 'base'); fs.writeFileSync(path.join(fixture.root, 'b.txt'), 'base');
    git('add', '.'); git('commit', '-m', 'base');
    fs.writeFileSync(path.join(fixture.root, 'a.txt'), 'alterado a'); fs.writeFileSync(path.join(fixture.root, 'b.txt'), 'alterado b'); git('add', 'b.txt');
    expect(commitChanges('somente a', ['a.txt'])).toEqual({ committed: true, pushed: false });
    expect(git('show', '--format=', '--name-only', 'HEAD')).toBe('a.txt');
    expect(git('diff', '--cached', '--name-only')).toBe('b.txt');
    expect(() => commitChanges('escape', ['../fora'])).toThrow();
  });
  it('recusa push fora de master antes de alterar o índice', () => {
    git('init', '-b', 'teste'); expect(() => commitChanges('teste', [path.join(fixture.blog, 'artigo.md')], { push: true })).toThrow('master');
    expect(git('diff', '--cached', '--name-only')).toBe('');
  });
});
