import libtorrent as lt
import time
import uuid

downloads = {}

class TorrentDownloader:
    def __init__(self, magnet):
        self.magnet = magnet
        self.id = str(uuid.uuid4())
        self.progress = 0
        self.handle = None

    def download(self):
        session = lt.session()
        session.listen_on(6881, 6891)

        params = {
            "save_path": "./downloads",
        }

        self.handle = lt.add_magnet_uri(session, self.magnet, params)

        while not self.handle.has_metadata():
            print("Fetching metadata...")
            time.sleep(1)

        while self.handle.status().state != lt.torrent_status.seeding:
            status = self.handle.status()
            self.progress = round(status.progress * 100, 2)
            print(f"Progress: {self.progress}% | Download rate: {status.download_rate / 1000:.2f} kB/s | Peers: {status.num_peers}")
            time.sleep(1)

        print("Download completed!")
        self.progress = 100
