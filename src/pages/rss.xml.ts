import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: any) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sortedPosts = posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  return rss({
    title: 'Doug Design Blog',
    description: 'Notícias, tutoriais e novidades de games, tecnologia, inteligência artificial e programação.',
    site: context.site || 'https://dougdesign-astro.vercel.app',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.meta_description || post.data.description || '',
      link: `/${post.id}/`,
    })),
  });
}
