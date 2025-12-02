from fastapi import FastAPI
from yts import search_movies, get_magnet_links
from fastapi import WebSocket 
from downloader import TorrentDownloader, downloads
import threading
import asyncio
from fastapi import Query
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/search")
def search(query: str):
    return {"results": search_movies(query)}

@app.get("/magnets")
def magnets(page: str):
    return {"magnets": get_magnet_links(page)}

@app.post("/download")
def download(magnet: str):
    dl = TorrentDownloader(magnet)
    downloads[dl.id] = dl

    thread = threading.Thread(target=dl.download)
    thread.start()

    return {"download_id": dl.id}

@app.websocket("/ws/{download_id}")
async def websocket_endpoint(websocket: WebSocket, download_id: str):
    await websocket.accept()
    try:
        while True:
            if download_id in downloads:
                dl = downloads[download_id]
                await websocket.send_json({"progress": dl.progress})
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        print("WebSocket closed:", download_id)