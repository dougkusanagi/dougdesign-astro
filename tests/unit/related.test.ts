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

import { getMetaDescription } from '../../src/lib/blog';

describe('getMetaDescription', () => {
  const post = (data: Record<string, unknown>, body = '') => ({ id: 'x', body, data: { title: 't', category: 'Games', pubDate: new Date(), ...data } }) as unknown as BlogEntry;

  it('mantém a descrição autoral quando tem tamanho adequado', () => {
    const d = 'Uma descrição autoral com tamanho adequado para aparecer inteira nos resultados de busca do Google e do Bing.';
    expect(getMetaDescription(post({ meta_description: d }))).toBe(d);
  });

  it('usa o primeiro parágrafo quando a descrição está truncada', () => {
    const body = '\n## Título\n\n**Resposta curta:** o recurso reúne até seis pessoas em uma biblioteca compartilhada. Cada membro continua dono dos próprios jogos e todos jogam ao mesmo tempo.\n';
    const result = getMetaDescription(post({ meta_description: 'Como Funciona o Novo Compartilhamento de' }, body));
    expect(result.length).toBeGreaterThanOrEqual(90);
    expect(result.length).toBeLessThanOrEqual(160);
    expect(result).toContain('reúne até seis pessoas');
    expect(result).not.toContain('**');
  });
});
