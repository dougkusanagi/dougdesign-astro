import { describe, expect, it } from 'vitest';
import { companionTerms, matchesSeed, rankSuggestions, titleCoverage } from '../../tools/dougseo-cli/src/lib/keywords';

describe('pesquisa de palavras-chave', () => {
  it('reconhece o tema sem acento e com plural simples', () => {
    expect(matchesSeed('proxima promocao steam 2026', 'promoção steam')).toBe(true);
    expect(matchesSeed('Promoções da Steam', 'promoção steam')).toBe(true);
    expect(matchesSeed('vale a pena steam deck', 'promoção steam')).toBe(false);
  });

  it('ordena sugestões pela repetição entre listas e pela posição', () => {
    const ranked = rankSuggestions([
      ['promoção steam', 'promoção steam data', 'promoção steam hoje'],
      ['promoção steam 2026 datas', 'promoção steam data'],
    ]);
    expect(ranked[0]).toMatchObject({ phrase: 'promoção steam data', lists: 2 });
    expect(ranked.map((entry) => entry.phrase)).toContain('promoção steam hoje');
  });

  it('conta termos que acompanham o tema e confere o título', () => {
    const terms = companionTerms(['promoção steam 2026 datas', 'promoção steam datas', 'quando promoção steam 2026', 'promoção steam hoje'], 'promoção steam');
    expect(terms.map((entry) => entry.term)).toEqual(['2026', 'datas']);
    expect(titleCoverage('Promoções da Steam 2026: datas e quando é a próxima', ['promoção', 'steam', 'datas', 'natal'])).toEqual({ present: ['promoção', 'steam', 'datas'], missing: ['natal'] });
  });
});
