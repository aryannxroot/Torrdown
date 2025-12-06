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
        self.session = None
        self.stopped = False
        self.paused = False
        self.status = "downloading"  # downloading, paused, stopped, completed

    def download(self):
        self.session = lt.session()
        self.session.listen_on(6881, 6891)

        params = {
            "save_path": "./downloads",
        }

        self.handle = lt.add_magnet_uri(self.session, self.magnet, params)

        # Wait for metadata
        while not self.handle.has_metadata():
            if self.stopped:
                self._cleanup()
                return
            print("Fetching metadata...")
            time.sleep(1)

        # Download loop
        while self.handle.status().state != lt.torrent_status.seeding:
            # Check if stopped
            if self.stopped:
                self._cleanup()
                return
            
            # Handle pause
            if self.paused:
                if not self.handle.status().paused:
                    self.handle.pause()
                time.sleep(0.5)
                continue
            else:
                if self.handle.status().paused:
                    self.handle.resume()
            
            status = self.handle.status()
            self.progress = round(status.progress * 100, 2)
            print(f"Progress: {self.progress}% | Download rate: {status.download_rate / 1000:.2f} kB/s | Peers: {status.num_peers}")
            time.sleep(1)

        print("Download completed!")
        self.progress = 100
        self.status = "completed"

    def pause(self):
        """Pause the download"""
        if self.handle and not self.stopped:
            self.paused = True
            self.status = "paused"
            print(f"Download {self.id} paused")

    def resume(self):
        """Resume the download"""
        if self.handle and not self.stopped:
            self.paused = False
            self.status = "downloading"
            print(f"Download {self.id} resumed")

    def stop(self):
        """Stop and cancel the download"""
        self.stopped = True
        self.status = "stopped"
        print(f"Download {self.id} stopped")

    def _cleanup(self):
        """Clean up the torrent session"""
        if self.handle and self.session:
            try:
                self.session.remove_torrent(self.handle)
                print(f"Download {self.id} cleaned up")
            except Exception as e:
                print(f"Error cleaning up download {self.id}: {e}")
        self.status = "stopped"
