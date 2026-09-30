import { indexAllPosts, isDueScheduledPost } from './content-index';
import { publishPost } from './post-ops';
import { auditPosts } from './audit';

export function listDuePosts(): ReturnType<typeof indexAllPosts> {
  return indexAllPosts().filter((post) => isDueScheduledPost(post));
}

export function runQueue(): Array<{ slug: string; filePath: string }> {
  const due = listDuePosts();
  const issues = due.flatMap((post) => auditPosts('all', { slug: post.slug }));
  if (issues.length) throw new Error(`Fila bloqueada antes de alterar arquivos: ${issues.map((issue) => `${issue.slug}: ${issue.issues.join(' | ')}`).join('; ')}`);
  return due.map((post) => publishPost(post.slug));
}
