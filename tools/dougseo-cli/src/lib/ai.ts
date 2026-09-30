import { spawnSync } from 'node:child_process';

export type AIProvider = 'codex' | 'ollama';
export interface AIConfig {
  provider: AIProvider;
  fallback: 'ollama' | 'none';
  codexBin: string;
  codexModel?: string;
  codexTimeoutMs: number;
  ollamaModel: string;
  ollamaChatModel: string;
  ollamaUrl: string;
  timeoutMs: number;
}

function timeout(value: string | undefined, fallback: number, name: string): number {
  const result = Number(value || fallback);
  if (!Number.isInteger(result) || result <= 0 || result > 600000) throw new Error(`${name} deve ser um inteiro entre 1 e 600000.`);
  return result;
}

export function readAIConfig(env: NodeJS.ProcessEnv = process.env): AIConfig {
  const provider = env.DOUGSEO_AI_PROVIDER || 'codex';
  const fallback = env.DOUGSEO_AI_FALLBACK || (provider === 'codex' ? 'ollama' : 'none');
  if (provider !== 'codex' && provider !== 'ollama') throw new Error('DOUGSEO_AI_PROVIDER deve ser codex ou ollama.');
  if (fallback !== 'ollama' && fallback !== 'none') throw new Error('DOUGSEO_AI_FALLBACK deve ser ollama ou none.');
  return {
    provider, fallback,
    codexBin: env.DOUGSEO_CODEX_BIN || 'codex',
    codexModel: env.DOUGSEO_CODEX_MODEL || undefined,
    codexTimeoutMs: timeout(env.DOUGSEO_CODEX_TIMEOUT_MS, 180000, 'DOUGSEO_CODEX_TIMEOUT_MS'),
    timeoutMs: timeout(env.DOUGSEO_AI_TIMEOUT_MS, 15000, 'DOUGSEO_AI_TIMEOUT_MS'),
    ollamaModel: env.DOUGSEO_OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text',
    ollamaChatModel: env.DOUGSEO_OLLAMA_CHAT_MODEL || 'qwen3:8b',
    ollamaUrl: env.OLLAMA_HOST || 'http://localhost:11434',
  };
}

export function codexEnvironment(): NodeJS.ProcessEnv {
  const env = { ...process.env };
  // Always use saved Codex login, never API key overrides from the caller.
  delete env.OPENAI_API_KEY;
  delete env.CODEX_API_KEY;
  delete env.OPENAI_BASE_URL;
  return env;
}

export function codexLoginStatus(config = readAIConfig()): 'chatgpt' | 'unavailable' {
  const result = spawnSync(config.codexBin, ['login', 'status'], {
    encoding: 'utf8', env: codexEnvironment(), timeout: 10000,
  });
  return !result.error && result.status === 0 && /logged in using chatgpt/i.test(`${result.stdout}\n${result.stderr}`)
    ? 'chatgpt' : 'unavailable';
}

export function aiDiagnostics() {
  const config = readAIConfig();
  return { ...config, codexLogin: codexLoginStatus(config) };
}

export interface EmbeddingClient {
  provider: 'ollama';
  namespace: string;
  embed(text: string, kind: 'query' | 'document'): Promise<number[]>;
}

export function embeddingClients(config = readAIConfig()): EmbeddingClient[] {
  if (config.provider !== 'ollama' && config.fallback === 'none') return [];
  const model = config.ollamaModel;
  const endpoint = `${config.ollamaUrl.replace(/\/$/, '')}/api/embeddings`;
  return [{
    provider: 'ollama', namespace: JSON.stringify(['ollama', model, endpoint]),
    async embed(text, kind) {
      const prompt = model.startsWith('nomic-embed-text') ? `search_${kind}: ${text}` : text;
      let response: Response;
      try {
        response = await fetch(endpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model, prompt }), signal: AbortSignal.timeout(config.timeoutMs),
        });
      } catch { throw new Error('ollama: conexão indisponível ou timeout.'); }
      if (!response.ok) throw new Error(`ollama: HTTP ${response.status}.`);
      let vector: unknown;
      try { vector = (await response.json()).embedding; }
      catch { throw new Error('ollama: resposta JSON inválida.'); }
      if (!Array.isArray(vector) || vector.length === 0 || !vector.every((v) => typeof v === 'number' && Number.isFinite(v)) || vector.every((v) => v === 0)) {
        throw new Error('ollama: vetor de embedding inválido.');
      }
      return vector;
    },
  }];
}
