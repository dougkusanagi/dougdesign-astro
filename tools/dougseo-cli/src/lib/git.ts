import { spawnSync } from 'node:child_process';
import { REPO_ROOT } from './config';

function runGit(args: string[]): void {
  const result = spawnSync('git', args, {
    cwd: REPO_ROOT,
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    throw new Error(`Falha ao executar git ${args.join(' ')}`);
  }
}

export function commitAndPush(message: string): void {
  runGit(['add', '.']);
  const status = spawnSync('git', ['status', '--short'], { cwd: REPO_ROOT, encoding: 'utf-8' });
  if (!status.stdout.trim()) {
    return;
  }
  runGit(['commit', '-m', message]);
  runGit(['push', 'origin', 'master']);
}
