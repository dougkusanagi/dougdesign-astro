import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { embeddingClients, readAIConfig } from '../../tools/dougseo-cli/src/lib/ai';
import { checkSemanticSimilarity } from '../../tools/dougseo-cli/src/lib/embeddings';
import { checkIntent } from '../../tools/dougseo-cli/src/lib/intent-check';

const mocks = vi.hoisted(() => ({ posts: vi.fn(), codex: vi.fn(), cache: {} as Record<string, unknown> }));
vi.mock('../../tools/dougseo-cli/src/lib/config', () => ({ INVENTORY_DIR: '/mock/inventory', slugify: (s: string) => s.toLowerCase().replace(/ /g, '-') }));
vi.mock('../../tools/dougseo-cli/src/lib/taxonomy', () => ({ canonicalCategorySlug: (s: string) => s.toLowerCase() }));
vi.mock('../../tools/dougseo-cli/src/lib/content-index', () => ({ indexAllPosts: mocks.posts }));
vi.mock('../../tools/dougseo-cli/src/lib/codex', () => ({ compareWithCodex: mocks.codex }));
vi.mock('node:fs', () => ({ default: {
  existsSync: () => true, readFileSync: () => JSON.stringify(mocks.cache), mkdirSync: vi.fn(),
  writeFileSync: (_path: string, json: string) => { mocks.cache = JSON.parse(json); },
} }));
const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status });
const post = (slug: string, categorySlug = 'games') => ({ slug, title: slug, assunto: slug, intencao_busca: 'decidir', body: 'corpo', categorySlug, url: `https://example.com/${slug}/` });
beforeEach(() => {
  mocks.cache = {};
  mocks.posts.mockReturnValue([post('a'), post('b', 'tecnologia')]);
  mocks.codex.mockResolvedValue([{ slug: 'b', relation: 'equivalent', reason: 'mesma decisão' }]);
  vi.stubEnv('DOUGSEO_AI_PROVIDER', 'codex');
  vi.stubEnv('DOUGSEO_AI_FALLBACK', 'ollama');
  vi.stubEnv('DOUGSEO_OLLAMA_EMBEDDING_MODEL', 'nomic-embed-text');
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('IA Codex e fallback Ollama', () => {
  it('define Codex como principal e valida configuração', () => {
    expect(readAIConfig({})).toMatchObject({ provider: 'codex', fallback: 'ollama', codexTimeoutMs: 180000 });
    expect(readAIConfig({ DOUGSEO_AI_PROVIDER: 'ollama' }).fallback).toBe('none');
    expect(() => readAIConfig({ DOUGSEO_AI_PROVIDER: 'openai' })).toThrow();
    expect(() => readAIConfig({ DOUGSEO_AI_FALLBACK: 'openai' })).toThrow();
    expect(() => readAIConfig({ DOUGSEO_AI_TIMEOUT_MS: '0' })).toThrow();
  });
  it('compara categorias diferentes com Codex sem gerar embeddings', async () => {
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
    const result = await checkIntent({ category: 'Games', subject: 'novo', intent: 'nova' });
    expect(result.ok).toBe(false);
    expect(result.conflicts.join(' ')).toContain('Codex: possível intenção equivalente');
    expect(mocks.codex.mock.calls.at(-1)?.[2]).toHaveLength(2);
    expect(fetch).not.toHaveBeenCalled();
  });
  it('também detecta conflitos exatos entre categorias sem IA', async () => {
    const result = await checkIntent({ category: 'Games', subject: 'b', intent: 'decidir' });
    expect(result.ok).toBe(false);
    expect(result.conflicts[0]).toContain('/b/');
  });
  it('usa fallback local se Codex falha e preserva prefixos nomic', async () => {
    mocks.codex.mockRejectedValue(new Error('Codex: indisponível'));
    const fetch = vi.fn().mockImplementation(() => Promise.resolve(json({ embedding: [1, 0] })));
    vi.stubGlobal('fetch', fetch);
    expect(await checkSemanticSimilarity('games', 'tema', 'decidir')).toHaveLength(2);
    expect(fetch.mock.calls).toHaveLength(3);
    expect(JSON.parse(fetch.mock.calls[0][1].body).prompt).toBe('search_query: tema decidir');
    expect(JSON.parse(fetch.mock.calls[1][1].body).prompt).toMatch(/^search_document:/);
    expect(fetch.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });
  it('não usa fallback quando desativado e retorna aviso em JSON', async () => {
    vi.stubEnv('DOUGSEO_AI_FALLBACK', 'none'); mocks.codex.mockRejectedValue(new Error('Codex: timeout'));
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
    const result = await checkIntent({ category: 'Games', subject: 'novo', intent: 'nova' });
    expect(result.warnings).toContain('Codex: timeout');
    expect(fetch).not.toHaveBeenCalled();
  });
  it('configura Ollama diretamente e rejeita vetores inválidos', async () => {
    const client = embeddingClients(readAIConfig({ DOUGSEO_AI_PROVIDER: 'ollama', OLLAMA_HOST: 'http://localhost:1234/', DOUGSEO_OLLAMA_EMBEDDING_MODEL: 'outro' }))[0];
    for (const embedding of [[], [0, 0], ['1'], undefined]) {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ embedding })));
      await expect(client.embed('texto', 'query')).rejects.toThrow('vetor');
    }
    const fetch = vi.fn().mockResolvedValue(json({ embedding: [1, 2] })); vi.stubGlobal('fetch', fetch);
    await client.embed('texto', 'query');
    expect(fetch.mock.calls[0][0]).toBe('http://localhost:1234/api/embeddings');
    expect(JSON.parse(fetch.mock.calls[0][1].body).prompt).toBe('texto');
  });
  it('separa cache por modelo e invalida alterações no título', async () => {
    vi.stubEnv('DOUGSEO_AI_PROVIDER', 'ollama'); mocks.posts.mockReturnValue([post('a')]);
    const fetch = vi.fn().mockImplementation(() => Promise.resolve(json({ embedding: [1, 0] }))); vi.stubGlobal('fetch', fetch);
    await checkSemanticSimilarity('games', 'tema', 'decidir');
    await checkSemanticSimilarity('games', 'tema', 'decidir');
    expect(fetch).toHaveBeenCalledTimes(3);
    mocks.posts.mockReturnValue([{ ...post('a'), title: 'alterado' }]);
    await checkSemanticSimilarity('games', 'tema', 'decidir'); expect(fetch).toHaveBeenCalledTimes(5);
    vi.stubEnv('DOUGSEO_OLLAMA_EMBEDDING_MODEL', 'outro');
    await checkSemanticSimilarity('games', 'tema', 'decidir'); expect(fetch).toHaveBeenCalledTimes(7);
  });
});
