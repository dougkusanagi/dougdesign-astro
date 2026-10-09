import { describe, expect, it } from 'vitest';
import {
  cannibalization,
  measureChange,
  mergeQueryRows,
  missingTerms,
  parseGitChanges,
  strikingDistance,
  type DailyRow,
} from '../../tools/dougseo-cli/src/lib/brief';

const day = (date: string, clicks: number, impressions: number, position = 8): DailyRow => ({ page: '/post/', date, clicks, impressions, position });

describe('parseGitChanges', () => {
  it('guarda a mudança mais recente, marca criação e ignora commits em lote', () => {
    const bulk = Array.from({ length: 30 }, (_, index) => `M\tsrc/content/blog/lote-${index}.md`).join('\n');
    const log = [
      '__2026-10-07T18:00:00-03:00', '', 'M\tsrc/content/blog/a.md', 'M\tsrc/content/blog/b.md',
      '__2026-10-05T10:00:00-03:00', '', bulk, 'M\tsrc/content/blog/a.md',
      '__2026-10-02T10:00:00-03:00', '', 'A\tsrc/content/blog/a.md', 'M\teditorial/pautas.md',
    ].join('\n');
    const changes = parseGitChanges(log);
    expect(changes.get('src/content/blog/a.md')).toEqual({ date: '2026-10-07', added: true, addedDate: '2026-10-02' });
    expect(changes.get('src/content/blog/b.md')).toEqual({ date: '2026-10-07', added: false });
    expect(changes.has('src/content/blog/lote-1.md')).toBe(false);
    expect(changes.has('editorial/pautas.md')).toBe(false);
  });
});

describe('measureChange', () => {
  const rows = [
    ...['2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25', '2026-09-26', '2026-09-27'].map((date) => day(date, 0, 20, 9)),
    ...['2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05'].map((date) => day(date, 1, 40, 6)),
  ];

  it('compara janelas de mesmo tamanho antes e depois', () => {
    const result = measureChange(rows, { date: '2026-09-28', added: false }, '2026-09-01', '2026-10-05');
    expect(result.windowDays).toBe(7);
    expect(result.before).toMatchObject({ clicks: 0, impressions: 140 });
    expect(result.after).toMatchObject({ clicks: 7, impressions: 280 });
    expect(result.reading).toBe('melhorou');
  });

  it('pede espera com menos de 7 dias de dados e limita a janela ao início dos dados', () => {
    expect(measureChange(rows, { date: '2026-10-03', added: false }, '2026-09-01', '2026-10-05').reading).toBe('aguardar (2 d de dados)');
    expect(measureChange(rows, { date: '2026-09-28', added: false }, '2026-09-25', '2026-10-05').windowDays).toBe(3);
  });

  it('mede post novo desde a publicação', () => {
    const result = measureChange(rows, { date: '2026-10-01', added: true, addedDate: '2026-09-29' }, '2026-09-01', '2026-10-05');
    expect(result.changeDate).toBe('2026-09-29');
    expect(result.after.impressions).toBe(280);
    expect(result.reading).toBe('com cliques');
  });
});

describe('oportunidades', () => {
  const queries = mergeQueryRows([
    { page: '/steam/', query: 'steam sales 2026', clicks: 0, impressions: 400, position: 7 },
    { page: '/steam/', query: 'steam sales 2026', clicks: 0, impressions: 200, position: 8 },
    { page: '/quest/', query: 'meta quest 4', clicks: 4, impressions: 900, position: 9.6 },
    { page: '/quest-rumores/', query: 'meta quest 4', clicks: 0, impressions: 40, position: 10.8 },
    { page: '/topo/', query: 'mario odyssey', clicks: 9, impressions: 300, position: 2 },
  ]);

  it('soma linhas repetidas da mesma página e consulta', () => {
    const steam = queries.find((row) => row.page === '/steam/');
    expect(steam?.impressions).toBe(600);
    expect(steam?.position).toBeCloseTo(7.33, 1);
  });

  it('ordena consultas nas posições 4–20 por impressões e ignora o topo', () => {
    const titles = new Map([['/steam/', 'Steam Summer Sale 2026: datas vazadas'], ['/quest/', 'Meta Quest 4: o que se sabe']]);
    const result = strikingDistance(queries, titles);
    expect(result.map((entry) => entry.path)).toEqual(['/quest/', '/steam/', '/quest-rumores/']);
    expect(result.find((entry) => entry.path === '/steam/')?.missing).toEqual([]);
  });

  it('aponta termos da consulta ausentes do título e canibalização', () => {
    expect(missingTerms('gameshare switch 2', 'Game Share no Switch 2: como funciona')).toEqual(['gameshare']);
    expect(cannibalization(queries).map((entry) => entry.query)).toEqual(['meta quest 4']);
  });
});
