import { describe, expect, it } from 'vitest';
import { lastmodFromFrontmatter } from '../../src/lib/sitemap-lastmod';

const post = (fields: string) => `---\n${fields}\n---\n\nCorpo.`;

describe('lastmodFromFrontmatter', () => {
  it('usa updatedDate quando é posterior à publicação', () => {
    const entry = lastmodFromFrontmatter('arquivo.md', post('title: "X: Y"\nslug: meu-post\npubDate: 2026-10-01T08:00:00-03:00\nupdatedDate: 2026-10-07T10:00:00-03:00\ndraft: false'));
    expect(entry).toEqual({ path: '/meu-post/', lastmod: '2026-10-07T13:00:00.000Z' });
  });

  it('cai para pubDate e para o nome do arquivo sem slug', () => {
    const entry = lastmodFromFrontmatter('guia-astro.md', post("pubDate: '2026-09-30'\ndraft: false"));
    expect(entry).toEqual({ path: '/guia-astro/', lastmod: '2026-09-30T00:00:00.000Z' });
  });

  it('não anuncia agendados e limita updatedDate futuro ao momento do build', () => {
    const now = new Date('2026-10-08T23:00:00Z');
    expect(lastmodFromFrontmatter('a.md', post('pubDate: 2026-10-09T08:00:00-03:00\ndraft: false'), now)).toBeUndefined();
    const entry = lastmodFromFrontmatter('b.md', post('pubDate: 2026-10-08T10:00:00-03:00\nupdatedDate: 2026-10-08T21:40:00-03:00\ndraft: false'), now);
    expect(entry?.lastmod).toBe('2026-10-08T23:00:00.000Z');
  });

  it('ignora rascunhos e datas inválidas', () => {
    expect(lastmodFromFrontmatter('a.md', post('pubDate: 2026-10-01\ndraft: true'))).toBeUndefined();
    expect(lastmodFromFrontmatter('b.md', post('pubDate: amanhã\ndraft: false'))).toBeUndefined();
  });
});
