import urllib.request
import urllib.parse
import json

def test():
    slug = "sonic-x-shadow-generations-ps-plus-extra-vale-download"
    url = f"https://dougdesign.com.br/wp-json/wp/v2/posts?slug={slug}&_embed=true"
    print(f"Fetching: {url}")
    
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0"}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))
            if not data:
                print("No post found.")
                return
            
            post = data[0]
            print(f"Title: {post['title']['rendered']}")
            print(f"Featured Media ID: {post['featured_media']}")
            
            embedded = post.get("_embedded", {})
            media_list = embedded.get("wp:featuredmedia", [])
            if media_list:
                media = media_list[0]
                print(f"Source URL: {media['source_url']}")
            else:
                print("No embedded featured media found.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test()
