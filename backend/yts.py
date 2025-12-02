import requests
from bs4 import BeautifulSoup

BASE_SEARCH = "https://www.yts-official.cc/browse-movies?keyword="

def search_movies(query: str):
    url = f"{BASE_SEARCH}{query}&quality=all&genre=all&rating=0&year=0&order_by=latest"
    r = requests.get(url, timeout=10)
    soup = BeautifulSoup(r.text, "lxml")

    movies = []
    movie_cards = soup.select(".browse-movie-wrap")

    for m in movie_cards:
        title = m.select_one(".browse-movie-bottom a").text.strip()
        year = m.select_one(".browse-movie-year").text.strip()
        cover = m.select_one("img")["src"]
        link = m.select_one("a")["href"]

        movies.append({
            "title": title,
            "year": year,
            "cover": cover,
            "page_link": link
        })

    return movies
def get_magnet_links(movie_page_path: str):
    full_url = f"https://www.yts-official.cc{movie_page_path}"
    r = requests.get(full_url, timeout=10)
    soup = BeautifulSoup(r.text, "lxml")

    magnets = []
    for block in soup.select(".modal-torrent"):
        quality = block.select_one(".modal-quality span").text.strip()
        magnet_tag = block.select_one("a.magnet-download")

        if magnet_tag:
            magnets.append({
                "quality": quality,
                "magnet": magnet_tag["href"]
            })

    return magnets