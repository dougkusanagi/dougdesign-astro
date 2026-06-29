import { getCollection } from 'astro:content';
import { getPostSlug } from '../lib/blog';

export async function GET() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const searchIndex = posts.map(post => ({
    title: post.data.title,
    slug: getPostSlug(post),
    description: post.data.meta_description || post.data.description || '',
    category: post.data.category,
    pubDate: post.data.pubDate,
  }));

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=3600',
    },
  });
}
