import { indexAllPosts, isDueScheduledPost } from './content-index';
import { publishPost } from './post-ops';

export function listDuePosts(): ReturnType<typeof indexAllPosts> {
  return indexAllPosts().filter((post) => isDueScheduledPost(post));
}

export function runQueue(): Array<{ slug: string; filePath: string }> {
  return listDuePosts().map((post) => publishPost(post.slug));
}
