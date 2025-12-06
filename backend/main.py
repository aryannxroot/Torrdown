from fastapi import FastAPI, WebSocket, Query, HTTPException
from fastapi.websockets import WebSocketDisconnect
from yts import search_movies, get_magnet_links
from downloader import TorrentDownloader, downloads
import threading
import asyncio
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

    thread = threading.Thread(target=dl.download, daemon=True)
    thread.start()

    return {"download_id": dl.id}

@app.post("/stop/{download_id}")
def stop_download(download_id: str):
    """Stop and cancel a download"""
    if download_id not in downloads:
        raise HTTPException(status_code=404, detail="Download not found")
    
    dl = downloads[download_id]
    dl.stop()
    return {"status": "stopped", "download_id": download_id}

@app.post("/pause/{download_id}")
def pause_download(download_id: str):
    """Pause a download"""
    if download_id not in downloads:
        raise HTTPException(status_code=404, detail="Download not found")
    
    dl = downloads[download_id]
    dl.pause()
    return {"status": "paused", "download_id": download_id}

@app.post("/resume/{download_id}")
def resume_download(download_id: str):
    """Resume a paused download"""
    if download_id not in downloads:
        raise HTTPException(status_code=404, detail="Download not found")
    
    dl = downloads[download_id]
    dl.resume()
    return {"status": "downloading", "download_id": download_id}

@app.get("/status/{download_id}")
def get_download_status(download_id: str):
    """Get the status of a download"""
    if download_id not in downloads:
        raise HTTPException(status_code=404, detail="Download not found")
    
    dl = downloads[download_id]
    return {
        "download_id": download_id,
        "progress": dl.progress,
        "status": dl.status,
        "paused": dl.paused,
        "stopped": dl.stopped
    }

@app.websocket("/ws/{download_id}")
async def websocket_endpoint(websocket: WebSocket, download_id: str):
    await websocket.accept()
    try:
        while True:
            if download_id in downloads:
                dl = downloads[download_id]
                await websocket.send_json({
                    "progress": dl.progress,
                    "status": dl.status,
                    "paused": dl.paused
                })
                # If download is stopped or completed, close the connection
                if dl.stopped or dl.progress >= 100:
                    break
            else:
                # Download not found, close connection
                break
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        print("WebSocket closed:", download_id)
    except Exception as e:
        print(f"WebSocket error for {download_id}: {e}")
    finally:
        try:
            await websocket.close()
        except:
            pass
