import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { embeddingClients, readAIConfig } from '../../tools/dougseo-cli/src/lib/ai';
import { checkSemanticSimilarity } from '../../tools/dougseo-cli/src/lib/embeddings';
import { checkIntent } from '../../tools/dougseo-cli/src/lib/intent-check';

const mocks = vi.hoisted(() => ({ posts: vi.fn(), cache: {} as Record<string, unknown> }));
vi.mock('../../tools/dougseo-cli/src/lib/config', () => ({ INVENTORY_DIR: '/mock/inventory', slugify: (s: string) => s.toLowerCase().replace(/ /g, '-') }));
vi.mock('../../tools/dougseo-cli/src/lib/taxonomy', () => ({ canonicalCategorySlug: (s: string) => s.toLowerCase() }));
vi.mock('../../tools/dougseo-cli/src/lib/content-index', () => ({ indexAllPosts: mocks.posts }));
vi.mock('node:fs', () => ({ default: {
  existsSync: () => true,
  readFileSync: () => JSON.stringify(mocks.cache),
  mkdirSync: vi.fn(),
  writeFileSync: (_path: string, json: string) => { mocks.cache = JSON.parse(json); },
} }));
const config = (values: NodeJS.ProcessEnv = {}) => readAIConfig(values);
const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status });
const post = (slug: string) => ({ slug, title: slug, assunto: slug, intencao_busca: 'decidir', body: 'corpo', categorySlug: 'games', url: `https://example.com/${slug}/` });

beforeEach(() => {
  mocks.cache = {};
  mocks.posts.mockReturnValue([post('a'), post('b')]);
  vi.stubEnv('DOUGSEO_AI_PROVIDER', 'openai');
  vi.stubEnv('DOUGSEO_AI_FALLBACK', 'ollama');
  vi.stubEnv('DOUGSEO_OPENAI_EMBEDDING_MODEL', 'text-embedding-3-small');
  vi.stubEnv('DOUGSEO_OLLAMA_EMBEDDING_MODEL', 'nomic-embed-text');
  vi.stubEnv('OPENAI_API_KEY', 'test-key');
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('provedores de IA', () => {
  it('usa OpenAI com fallback Ollama e permite execução apenas local', () => {
    expect(config()).toMatchObject({ provider: 'openai', fallback: 'ollama', openaiModel: 'text-embedding-3-small' });
    expect(embeddingClients(config({ DOUGSEO_AI_PROVIDER: 'ollama' })).map((c) => c.provider)).toEqual(['ollama']);
    expect(() => config({ DOUGSEO_AI_PROVIDER: 'invalid' })).toThrow();
    expect(() => config({ DOUGSEO_AI_FALLBACK: 'invalid' })).toThrow();
    expect(() => config({ DOUGSEO_AI_TIMEOUT_MS: '0' })).toThrow();
  });

  it('envia embeddings OpenAI com autenticação e sem prefixos nomic', async () => {
    const fetch = vi.fn().mockResolvedValue(json({ data: [{ embedding: [1, 2] }] }));
    vi.stubGlobal('fetch', fetch);
    expect(await embeddingClients(config())[0].embed('texto', 'query')).toEqual([1, 2]);
    const [url, request] = fetch.mock.calls[0];
    expect(url).toBe('https://api.openai.com/v1/embeddings');
    expect(request.headers.Authorization).toBe('Bearer test-key');
    expect(JSON.parse(request.body)).toEqual({ model: 'text-embedding-3-small', input: 'texto', encoding_format: 'float' });
    expect(request.signal).toBeInstanceOf(AbortSignal);
  });

  it('mantém os prefixos nomic e permite configurar host/modelo Ollama', async () => {
    const fetch = vi.fn().mockImplementation(() => Promise.resolve(json({ embedding: [1, 2] })));
    vi.stubGlobal('fetch', fetch);
    const client = embeddingClients(config({ DOUGSEO_AI_PROVIDER: 'ollama', OLLAMA_HOST: 'http://localhost:1234/', DOUGSEO_OLLAMA_EMBEDDING_MODEL: 'nomic-embed-text' }))[0];
    await client.embed('texto', 'document');
    expect(fetch.mock.calls[0][0]).toBe('http://localhost:1234/api/embeddings');
    expect(JSON.parse(fetch.mock.calls[0][1].body).prompt).toBe('search_document: texto');
    expect(fetch.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it('rejeita resposta malformada, vetor vazio, zero e falhas sem expor corpo de erro', async () => {
    const client = embeddingClients(config())[0];
    for (const embedding of [[], [0, 0], ['1'], undefined]) {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ data: [{ embedding }] })));
      await expect(client.embed('texto', 'query')).rejects.toThrow('vetor');
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ error: 'secret-token' }, 401)));
    await expect(client.embed('texto', 'query')).rejects.toThrow('openai: HTTP 401.');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('secret-token')));
    await expect(client.embed('texto', 'query')).rejects.toThrow('conexão indisponível ou timeout');
  });

  it('usa fallback sem chave e registra indisponibilidade no JSON se ambos falharem', async () => {
    vi.stubEnv('OPENAI_API_KEY', '');
    const fetch = vi.fn().mockImplementation(() => Promise.resolve(json({ embedding: [1, 0] })));
    vi.stubGlobal('fetch', fetch);
    expect(await checkSemanticSimilarity('games', 'teste', 'teste')).toHaveLength(2);
    expect(fetch.mock.calls.every(([url]) => url.includes('11434'))).toBe(true);
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    expect((await checkIntent({ category: 'Games', subject: 'novo', intent: 'nova' })).warnings.join(' ')).toContain('Busca semântica indisponível');
  });

  it('reinicia toda a comparação no fallback se o principal falhar no meio', async () => {
    let openaiCalls = 0;
    const fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('openai')) {
        openaiCalls++;
        return Promise.resolve(openaiCalls === 3 ? json({}, 429) : json({ data: [{ embedding: [1, 0] }] }));
      }
      // Same dimensions, different embedding space: must never compare to OpenAI query/cache.
      return Promise.resolve(json({ embedding: [0, 1] }));
    });
    vi.stubGlobal('fetch', fetch);
    const result = await checkSemanticSimilarity('games', 'teste', 'teste');
    expect(result).toHaveLength(2);
    expect(result.every((c) => c.similarity === 1)).toBe(true);
    expect(fetch.mock.calls.filter(([url]) => url.includes('11434'))).toHaveLength(3);
  });

  it('separa cache por modelo e invalida quando título ou intenção mudam', async () => {
    const fetch = vi.fn().mockImplementation(() => Promise.resolve(json({ data: [{ embedding: [1, 0] }] })));
    vi.stubGlobal('fetch', fetch);
    mocks.posts.mockReturnValue([post('a')]);
    await checkSemanticSimilarity('games', 'teste', 'teste');
    expect(fetch).toHaveBeenCalledTimes(2);
    await checkSemanticSimilarity('games', 'teste', 'teste');
    expect(fetch).toHaveBeenCalledTimes(3); // Only query; document cached.
    mocks.posts.mockReturnValue([{ ...post('a'), title: 'alterado' }]);
    await checkSemanticSimilarity('games', 'teste', 'teste');
    expect(fetch).toHaveBeenCalledTimes(5);
    vi.stubEnv('DOUGSEO_OPENAI_EMBEDDING_MODEL', 'text-embedding-3-large');
    await checkSemanticSimilarity('games', 'teste', 'teste');
    expect(fetch).toHaveBeenCalledTimes(7);
  });

  it('não chama Ollama quando fallback está desativado', async () => {
    vi.stubEnv('DOUGSEO_AI_FALLBACK', 'none');
    const fetch = vi.fn().mockResolvedValue(json({}, 503));
    vi.stubGlobal('fetch', fetch);
    await expect(checkSemanticSimilarity('games', 'teste', 'teste')).rejects.toThrow('indisponível');
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
