async function test() {
  const url = 'https://dougdesign.com.br/palia-royal-highlands-como-se-preparar-expansao/';
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`Failed to fetch: ${res.status}`);
      return;
    }
    const html = await res.text();
    
    // Find all img tags
    const imgTags = html.match(/<img[^>]+>/g);
    console.log('All <img> tags on page:');
    if (imgTags) {
      for (const img of imgTags) {
        if (!img.includes('avatar') && !img.includes('logo') && !img.includes('favicon')) {
          console.log(' -', img);
        }
      }
    }
  } catch (err) {
    console.error('Error fetching URL:', err);
  }
}
test();
