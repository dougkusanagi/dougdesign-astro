export type AIProvider = 'openai' | 'ollama';

export interface AIConfig {
  provider: AIProvider;
  fallback: AIProvider | 'none';
  openaiModel: string;
  ollamaModel: string;
  ollamaUrl: string;
  timeoutMs: number;
}

export function readAIConfig(env: NodeJS.ProcessEnv = process.env): AIConfig {
  const provider = env.DOUGSEO_AI_PROVIDER || 'openai';
  const fallback = env.DOUGSEO_AI_FALLBACK || (provider === 'openai' ? 'ollama' : 'none');
  if (provider !== 'openai' && provider !== 'ollama') throw new Error('DOUGSEO_AI_PROVIDER deve ser openai ou ollama.');
  if (!['openai', 'ollama', 'none'].includes(fallback)) throw new Error('DOUGSEO_AI_FALLBACK deve ser openai, ollama ou none.');
  const timeoutMs = Number(env.DOUGSEO_AI_TIMEOUT_MS || '15000');
  if (!Number.isInteger(timeoutMs) || timeoutMs <= 0 || timeoutMs > 300000) throw new Error('DOUGSEO_AI_TIMEOUT_MS deve ser um inteiro entre 1 e 300000.');
  return {
    provider, fallback: fallback as AIConfig['fallback'], timeoutMs,
    openaiModel: env.DOUGSEO_OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
    ollamaModel: env.DOUGSEO_OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text',
    ollamaUrl: env.OLLAMA_HOST || 'http://localhost:11434',
  };
}

export function aiDiagnostics() {
  const config = readAIConfig();
  return { ...config, openaiKeyConfigured: Boolean(process.env.OPENAI_API_KEY?.trim()) };
}

export interface EmbeddingClient {
  provider: AIProvider;
  model: string;
  namespace: string;
  embed(text: string, kind: 'query' | 'document'): Promise<number[]>;
}

export function embeddingClients(config = readAIConfig()): EmbeddingClient[] {
  const providers = [config.provider];
  if (config.fallback !== 'none' && config.fallback !== config.provider) providers.push(config.fallback);
  return providers.map((provider) => {
    const model = provider === 'openai' ? config.openaiModel : config.ollamaModel;
    const endpoint = provider === 'openai'
      ? 'https://api.openai.com/v1/embeddings'
      : `${config.ollamaUrl.replace(/\/$/, '')}/api/embeddings`;
    return {
      provider, model, namespace: JSON.stringify([provider, model, endpoint]),
      async embed(text, kind) {
        const key = process.env.OPENAI_API_KEY?.trim();
        if (provider === 'openai' && !key) throw new Error('OpenAI: OPENAI_API_KEY não configurada.');
        // Prefixes are specific to nomic, not to OpenAI or all Ollama models.
        const prompt = model.startsWith('nomic-embed-text') ? `search_${kind}: ${text}` : text;
        let response: Response;
        try {
          response = await fetch(endpoint, {
            method: 'POST',
            headers: provider === 'openai'
              ? { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }
              : { 'Content-Type': 'application/json' },
            body: JSON.stringify(provider === 'openai'
              ? { model, input: text, encoding_format: 'float' }
              : { model, prompt }),
            signal: AbortSignal.timeout(config.timeoutMs),
          });
        } catch {
          throw new Error(`${provider}: conexão indisponível ou timeout.`);
        }
        // Do not log API bodies or request headers (may contain credentials).
        if (!response.ok) throw new Error(`${provider}: HTTP ${response.status}.`);
        let vector: unknown;
        try {
          const data = await response.json();
          vector = provider === 'openai' ? data.data?.[0]?.embedding : data.embedding;
        } catch {
          throw new Error(`${provider}: resposta JSON inválida.`);
        }
        if (!Array.isArray(vector) || vector.length === 0 || !vector.every((v) => typeof v === 'number' && Number.isFinite(v)) || vector.every((v) => v === 0)) {
          throw new Error(`${provider}: vetor de embedding inválido.`);
        }
        return vector;
      },
    };
  });
}
