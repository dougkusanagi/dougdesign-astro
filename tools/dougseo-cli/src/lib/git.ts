import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { REPO_ROOT } from './config';

function git(args: string[], allowed = [0]) {
  const result = spawnSync('git', args, { cwd: REPO_ROOT, encoding: 'utf8' });
  if (result.error || !allowed.includes(result.status ?? -1)) throw new Error(`Falha ao executar git ${args[0]}: ${result.stderr?.trim() || 'processo indisponível'}`);
  return result;
}

export function commitChanges(message: string, files: string[], options: { push?: boolean } = {}): { committed: boolean; pushed: boolean } {
  if (!files.length) throw new Error('Nenhum arquivo selecionado para commit.');
  const selected = [...new Set(files.map((file) => {
    const relative = path.relative(REPO_ROOT, path.resolve(REPO_ROOT, file));
    if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Arquivo fora do repositório.');
    return `:(literal)${relative}`;
  }))];
  if (options.push && git(['branch', '--show-current']).stdout.trim() !== 'master') {
    throw new Error('Push editorial exige o branch master. Faça commit local e revise o branch.');
  }
  git(['add', '--', ...selected]);
  const changed = git(['diff', '--cached', '--quiet', '--', ...selected], [0, 1]).status === 1;
  if (changed) git(['commit', '--only', '-m', message, '--', ...selected]);
  if (options.push) git(['push', 'origin', 'master']);
  return { committed: changed, pushed: Boolean(options.push) };
}
