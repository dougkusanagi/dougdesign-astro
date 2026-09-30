import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createDraftWithAI, generateDraft, loadSourceMaterial, validateDraft } from '../../tools/dougseo-cli/src/lib/draft';
const mocks = vi.hoisted(() => ({ run: vi.fn(), intent: vi.fn(), scaffold: vi.fn() }));
vi.mock('../../tools/dougseo-cli/src/lib/codex', () => ({ runCodexStructured: mocks.run }));
vi.mock('../../tools/dougseo-cli/src/lib/intent-check', () => ({ checkIntent: mocks.intent }));
vi.mock('../../tools/dougseo-cli/src/lib/template', () => ({ scaffoldPost: mocks.scaffold }));
vi.mock('../../tools/dougseo-cli/src/lib/config', () => ({ countWords: (s: string) => s.trim().split(/\s+/).length }));
const source = [{ url: 'https://example.com/fonte', consultedAt: '2026-09-30', text: 'Fato documentado.' }];
const valid = () => ({ title: 'Título', description: 'Descrição útil.', body: 'Texto útil com dados e limites. '.repeat(30)+'\n[Fonte](https://example.com/fonte)', contribution: 'Explica os limites.', limitations: ['Sem teste próprio.'] });
const options = { category: 'Games', subject: 'tema', intent: 'decidir', source: [source[0].url] };
let dir = '';
beforeEach(() => { dir = fs.mkdtempSync(path.join(os.tmpdir(), 'draft-tests-')); mocks.run.mockResolvedValue(valid()); mocks.intent.mockResolvedValue({ ok: true, conflicts: [], warnings: [] }); mocks.scaffold.mockReturnValue({ slug: 'teste', filePath: '/teste.md' }); vi.stubEnv('DOUGSEO_AI_PROVIDER', 'codex'); vi.stubEnv('DOUGSEO_AI_FALLBACK', 'none'); });
afterEach(() => { fs.rmSync(dir, { recursive: true, force: true }); vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.clearAllMocks(); });
it('exige fontes correspondentes com trechos e datas', () => {
  const file = path.join(dir, 'fontes.json'); fs.writeFileSync(file, JSON.stringify(source));
  expect(loadSourceMaterial(file, options.source)).toEqual(source);
  expect(() => loadSourceMaterial(file, ['https://example.com/outra'])).toThrow();
  fs.writeFileSync(file, JSON.stringify([{ ...source[0], consultedAt: 'invalid' }])); expect(() => loadSourceMaterial(file, options.source)).toThrow();
});
it('rejeita H1, descrição longa, links inventados e falta de citação', () => {
  for (const draft of [ { ...valid(), body: '# H1\n'+valid().body }, { ...valid(), description: 'a'.repeat(161) }, { ...valid(), body: valid().body+' [Inventada](https://example.com/outra)' }, { ...valid(), body: 'Texto útil. '.repeat(100) } ]) expect(() => validateDraft(draft, source)).toThrow();
});
it('gera texto com Codex sem API nem publicação', async () => {
  expect(await generateDraft(options, source)).toEqual(valid());
  expect(mocks.run.mock.calls[0][0]).toContain('SOMENTE o material fornecido');
  expect(mocks.scaffold).not.toHaveBeenCalled();
});
it('não cria arquivo se há conflito ou se IA está indisponível', async () => {
  const file = path.join(dir, 'fontes.json'); fs.writeFileSync(file, JSON.stringify(source));
  mocks.intent.mockResolvedValue({ ok: false, conflicts: ['mesma intenção'], warnings: [] });
  await expect(createDraftWithAI({ ...options, sourceMaterial: file })).rejects.toThrow('Intenção');
  mocks.intent.mockResolvedValue({ ok: true, conflicts: [], warnings: ['Busca semântica indisponível'] });
  await expect(createDraftWithAI({ ...options, sourceMaterial: file })).rejects.toThrow('Intenção');
  expect(mocks.scaffold).not.toHaveBeenCalled();
});
it('entrega resultado como rascunho que exige revisão', async () => {
  const file = path.join(dir, 'fontes.json'); fs.writeFileSync(file, JSON.stringify(source));
  const result = await createDraftWithAI({ ...options, sourceMaterial: file });
  expect(result).toMatchObject({ status: 'rascunho', reviewRequired: true });
  expect(mocks.scaffold).toHaveBeenCalledWith(expect.objectContaining(options), valid());
});
it('suporta geração local Ollama configurável sem usar modelo de embeddings', async () => {
  vi.stubEnv('DOUGSEO_AI_PROVIDER', 'ollama'); vi.stubEnv('DOUGSEO_OLLAMA_CHAT_MODEL', 'modelo-local');
  const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: { content: JSON.stringify(valid()) } })));
  vi.stubGlobal('fetch', fetch); await generateDraft(options, source);
  expect(JSON.parse(fetch.mock.calls[0][1].body).model).toBe('modelo-local'); expect(mocks.run).not.toHaveBeenCalled();
});
