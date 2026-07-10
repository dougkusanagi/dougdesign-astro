import { describe, it, expect } from 'vitest';
import { slugifyCategory, normalizeCategoryLabel, getPostUrl } from '../../src/lib/blog';

describe('Category Normalization and slugify', () => {
  it('should slugify categories correctly', () => {
    expect(slugifyCategory('Web Design')).toBe('web-design');
    expect(slugifyCategory('Inteligência Artificial')).toBe('inteligencia-artificial');
    expect(slugifyCategory('Programação')).toBe('programacao');
  });

  it('should normalize category labels based on aliases', () => {
    expect(normalizeCategoryLabel('jogos')).toBe('Games');
    expect(normalizeCategoryLabel('desenvolvimento')).toBe('Programacao');
    expect(normalizeCategoryLabel('ui')).toBe('Web Design');
    expect(normalizeCategoryLabel('educação')).toBe('Educacao');
    expect(normalizeCategoryLabel('desconhecido')).toBe('desconhecido');
  });

  it('should generate correct post URL', () => {
    const mockPost = {
      id: 'my-post-id',
      data: {
        slug: 'custom-slug  '
      }
    } as any;
    expect(getPostUrl(mockPost)).toBe('/custom-slug/');
  });
});
