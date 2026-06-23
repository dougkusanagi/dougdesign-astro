async function testBulk() {
  const url = `https://dougdesign.com.br/wp-json/wp/v2/posts?per_page=10&_embed=true&page=1`;
  console.log(`Fetching bulk: ${url}`);
  try {
    const res = await fetch(url);
    const posts = await res.json();
    console.log(`Fetched ${posts.length} posts.`);
    for (const post of posts) {
      const mediaList = post._embedded?.["wp:featuredmedia"];
      const mediaUrl = mediaList && mediaList.length > 0 ? mediaList[0].source_url : null;
      console.log(`- Slug: ${post.slug} -> Media: ${mediaUrl}`);
    }
  } catch (e) {
    console.error("Error:", e);
  }
}
testBulk();
