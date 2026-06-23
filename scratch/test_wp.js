async function test() {
  const slug = "sonic-x-shadow-generations-ps-plus-extra-vale-download";
  const url = `https://dougdesign.com.br/wp-json/wp/v2/posts?slug=${slug}&_embed=true`;
  console.log(`Fetching: ${url}`);
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data || data.length === 0) {
      console.log("No post found.");
      return;
    }
    const post = data[0];
    console.log(`Title: ${post.title.rendered}`);
    console.log(`Featured Media ID: ${post.featured_media}`);
    const mediaList = post._embedded?.["wp:featuredmedia"];
    if (mediaList && mediaList.length > 0) {
      console.log(`Source URL: ${mediaList[0].source_url}`);
    } else {
      console.log("No embedded featured media found.");
    }
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
