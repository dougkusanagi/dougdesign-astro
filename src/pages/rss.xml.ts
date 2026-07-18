import rss from '@astrojs/rss';
import { getPostUrl, getPublishedPosts } from '../lib/blog';

export async function GET(context: any) {
  const sortedPosts = await getPublishedPosts();

  return rss({
    title: 'Doug Design Blog',
    description: 'Notícias, tutoriais e novidades de games, tecnologia, inteligência artificial e programação.',
    site: 'https://dougdesign.com.br',
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.meta_description || post.data.description || '',
      link: getPostUrl(post),
    })),
    customData: `<language>pt-br</language>`,
  });
}
