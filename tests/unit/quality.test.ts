import { describe, it, expect } from 'vitest';
import { scoreContent } from '../../src/lib/contentQuality';

describe('AI Quality Scoring Engine', () => {
  it('should pass an optimal post with high score and no warnings', () => {
    const body = `
O novo motor de renderização Fabric é uma das maiores atualizações recentes.
Ele permite chamadas síncronas usando interfaces nativas.
Isso diminui a latência de execução no aplicativo final de forma considerável.
Além disso, com a eliminação total da serialização de dados em JSON,
os frames fluem de modo estável na tela, semelhante ao desenvolvimento Kotlin clássico.
Você pode conferir mais detalhes integrando bibliotecas locais.
Conecte com segurança e siga as instruções oficiais.
    `;
    const frontmatter = {
      content_type: 'guia',
      fontes_oficiais: ['https://reactnative.dev'],
      internal_links: {
        to: ['post-a', 'post-b', 'post-c']
      }
    };
    
    // Artificially inflating word count to pass minimum limit
    const inflatedBody = body.repeat(10);

    const result = scoreContent(inflatedBody, frontmatter);
    expect(result.ok).toBe(true);
    expect(result.score).toBe(100);
    expect(result.warnings.length).toBe(0);
  });

  it('should flag banned AI clichés and subtract score points', () => {
    const body = `
Esta é uma atualização essencial e vital para o ecossistema em constante evolução.
Precisamos mergulhar de cabeça nessa nova tecnologia para revolucionar o cenário atual.
Este recurso é um divisor de águas absoluto.
    `;
    const frontmatter = {
      content_type: 'guia',
      fontes_oficiais: ['https://reactnative.dev'],
      internal_links: { to: ['a', 'b', 'c'] }
    };
    const inflatedBody = body.repeat(10);

    const result = scoreContent(inflatedBody, frontmatter);
    expect(result.ok).toBe(false);
    expect(result.score).toBeLessThan(80);
    expect(result.warnings).toContain('Contém jargão de IA banido: "vital".');
    expect(result.warnings).toContain('Contém jargão de IA banido: "essencial".');
    expect(result.warnings).toContain('Contém jargão de IA banido: "revolucionar".');
  });

  it('should flag rigid headings in evergreen/guides', () => {
    const body = `
## O que aconteceu
Descreva o fato novo aqui.

## O que e oficial
Confirmações oficiais aqui.
    `;
    const frontmatter = {
      content_type: 'guia',
      fontes_oficiais: ['https://site.com'],
      internal_links: { to: ['a', 'b', 'c'] }
    };
    const inflatedBody = body.repeat(30);

    const result = scoreContent(inflatedBody, frontmatter);
    expect(result.warnings).toContain('Posts Evergreen/Guias não devem usar cabeçalhos rígidos de notícias: "## o que aconteceu".');
    expect(result.warnings).toContain('Posts Evergreen/Guias não devem usar cabeçalhos rígidos de notícias: "## o que e oficial".');
  });

  it('should warn for low word count without justification', () => {
    const body = 'Muito curto.';
    const frontmatter = {
      content_type: 'noticia',
      fontes_oficiais: ['https://site.com'],
      internal_links: { to: ['a', 'b', 'c'] }
    };
    const result = scoreContent(body, frontmatter);
    expect(result.warnings.some(w => w.includes('Quantidade de palavras'))).toBe(true);
  });
});
