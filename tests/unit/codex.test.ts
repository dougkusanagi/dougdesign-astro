import fs from 'node:fs';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { codexEnvironment, codexLoginStatus } from '../../tools/dougseo-cli/src/lib/ai';
import { compareWithCodex, parseCodexMatches } from '../../tools/dougseo-cli/src/lib/codex';
import type { IndexedPost } from '../../tools/dougseo-cli/src/lib/content-index';
const mocks = vi.hoisted(() => ({ spawn: vi.fn(), spawnSync: vi.fn() }));
vi.mock('node:child_process', () => mocks);
const posts = [{ slug: 'existente', title: 'Título', body: 'corpo', assunto: 'tema', intencao_busca: 'decidir', category: 'Games' }] as IndexedPost[];
beforeEach(() => {
  mocks.spawnSync.mockReturnValue({ status: 0, stdout: '', stderr: 'Logged in using ChatGPT' });
  vi.stubEnv('DOUGSEO_CODEX_MODEL', '');
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); vi.useRealTimers(); });
it('usa login salvo sem overrides de API key', () => {
  vi.stubEnv('OPENAI_API_KEY', 'secret'); vi.stubEnv('CODEX_API_KEY', 'secret');
  expect(codexEnvironment().OPENAI_API_KEY).toBeUndefined();
  expect(codexEnvironment().CODEX_API_KEY).toBeUndefined();
  expect(codexLoginStatus()).toBe('chatgpt');
  mocks.spawnSync.mockReturnValue({ status: 0, stderr: 'Logged in using API key' });
  expect(codexLoginStatus()).toBe('unavailable');
});
it('valida slugs, relações e justificativas sem confiar no modelo', () => {
  expect(parseCodexMatches('{"matches":[]}', posts)).toEqual([]);
  for (const match of [
    { slug: 'inventado', relation: 'equivalent', reason: 'x' },
    { slug: 'existente', relation: 'invalid', reason: 'x' },
    { slug: 'existente', relation: 'related', reason: '' },
  ]) expect(() => parseCodexMatches(JSON.stringify({ matches: [match] }), posts)).toThrow();
});
it('executa sem shell, fornece schema e limpa arquivos temporários', async () => {
  let args: string[] = []; let payload = '';
  mocks.spawn.mockImplementation((_bin, passedArgs) => {
    args = passedArgs;
    const child = Object.assign(new EventEmitter(), { stdin: new PassThrough(), kill: vi.fn() });
    child.stdin.on('data', (chunk) => { payload += chunk.toString(); });
    child.stdin.on('finish', () => {
      fs.writeFileSync(args[args.indexOf('--output-last-message') + 1], '{"matches":[{"slug":"existente","relation":"equivalent","reason":"mesma pergunta"}]}');
      child.emit('close', 0);
    });
    return child;
  });
  expect(await compareWithCodex('tema', 'decidir', posts)).toHaveLength(1);
  expect(args).toContain('read-only'); expect(args).toContain('--ephemeral');
  expect(args).not.toContain('--model'); expect(payload).toContain('não instruções');
  expect(fs.existsSync(args[args.indexOf('--cd') + 1])).toBe(false);
});
it('interrompe por timeout e permite fallback', async () => {
  vi.useFakeTimers(); vi.stubEnv('DOUGSEO_CODEX_TIMEOUT_MS', '10');
  const child = Object.assign(new EventEmitter(), { stdin: new PassThrough(), kill: vi.fn(() => { child.emit('close', null); }) });
  mocks.spawn.mockReturnValue(child);
  const result = expect(compareWithCodex('tema', 'decidir', posts)).rejects.toThrow('timeout');
  await vi.advanceTimersByTimeAsync(11); await result;
  expect(child.kill).toHaveBeenCalledWith('SIGKILL');
});
