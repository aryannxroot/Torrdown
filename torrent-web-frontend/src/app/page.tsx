"use client";

import { useState } from "react";

export default function Page() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [magnets, setMagnets] = useState<any[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const [downloadId, setDownloadId] = useState("");

  const backend = "http://127.0.0.1:8000"; // backend base URL

  async function searchMovies() {
    const res = await fetch(`${backend}/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.results || []);
  }

  async function fetchMagnets(pageLink: string) {
    const res = await fetch(`${backend}/magnets?page=${pageLink}`);
    const data = await res.json();
    setMagnets(data.magnets);
  }

  async function startDownload(magnet: string) {
    const res = await fetch(`${backend}/download?magnet=${encodeURIComponent(magnet)}`, {
      method: "POST",
    });
    const data = await res.json();
    setDownloadId(data.download_id);
    connectWS(data.download_id);
  }

  function connectWS(id: string) {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${id}`);
    ws.onmessage = (msg) => {
      const payload = JSON.parse(msg.data);
      setProgress(payload.progress);
    };
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Torrdown</h1>
      <input
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: 300 }}
      />
      <button onClick={searchMovies}>Search</button>

      <h2>Results</h2>
      {results.map((movie, i) => (
        <div key={i}>
          {movie.title} ({movie.year})
          <button onClick={() => fetchMagnets(movie.page_link)} style={{ marginLeft: 10 }}>
            Get magnets
          </button>
        </div>
      ))}

      <h2>Magnets</h2>
      {magnets.map((m, i) => (
        <div key={i}>
          {m.quality}
          <button onClick={() => startDownload(m.magnet)} style={{ marginLeft: 10 }}>
            Download
          </button>
        </div>
      ))}

      <h2>Active</h2>
      {progress === null ? "No active download" : `Progress: ${progress}%`}
    </div>
  );
}
