import { describe, expect, it, vi } from 'vitest';

vi.mock('astro:content', () => ({ getCollection: vi.fn() }));

import { getRelatedPosts, type BlogEntry } from '../../src/lib/blog';

const entry = (id: string, title: string, extra: Record<string, unknown> = {}) =>
  ({
    id,
    data: { title, category: 'Games', cluster: 'games', pubDate: new Date('2026-01-01'), ...extra },
  }) as unknown as BlogEntry;

describe('getRelatedPosts', () => {
  it('prioriza assunto em comum em vez do post mais novo da categoria', () => {
    const current = entry('ally', 'ROG Ally X vs Steam Deck OLED');
    const newest = entry('noticia', 'Novo trailer de jogo de corrida', { pubDate: new Date('2026-09-01') });
    const topical = entry('deck', 'Steam Deck 2: o que esperar do portátil da Valve');
    expect(getRelatedPosts(current, [newest, topical], 1)[0].id).toBe('deck');
  });

  it('respeita internal_links.to planejados e não inclui o próprio post', () => {
    const current = entry('a', 'Guia de Penpot', { category: 'Web Design', cluster: 'x', internal_links: { to: ['/planejado/'] } });
    const planned = entry('planejado', 'Outro texto sem relação', { category: 'Tecnologia', cluster: 'y' });
    const result = getRelatedPosts(current, [current, planned], 3);
    expect(result.map((p) => p.id)).toEqual(['planejado']);
  });
});
