"use client";

import { useState } from "react";
import { Logo } from "./components/Logo";
import { SearchBar } from "./components/SearchBar";
import { MovieResults } from "./components/MovieResults";
import { ActiveDownloads } from "./components/ActiveDownloads";
import { MagnetSelector } from "./components/MagnetSelector";
import "./globals.css";

interface Movie {
  title: string;
  year: string;
  cover: string;
  page_link: string;
}

interface Magnet {
  quality: string;
  magnet: string;
}

interface Download {
  id: string;
  title: string;
  progress: number;
  ws?: WebSocket;
}

export default function Page() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [magnets, setMagnets] = useState<Magnet[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showMagnets, setShowMagnets] = useState(false);

  const backend = "http://127.0.0.1:8000";

  async function searchMovies() {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(`${backend}/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  }

  async function fetchMagnets(movie: Movie) {
    setSelectedMovie(movie);
    try {
      const res = await fetch(`${backend}/magnets?page=${movie.page_link}`);
      const data = await res.json();
      setMagnets(data.magnets || []);
      setShowMagnets(true);
    } catch (error) {
      console.error("Failed to fetch magnets:", error);
    }
  }

  async function startDownload(magnet: string, quality: string) {
    try {
      const res = await fetch(`${backend}/download?magnet=${encodeURIComponent(magnet)}`, {
        method: "POST",
      });
      const data = await res.json();

      const newDownload: Download = {
        id: data.download_id,
        title: `${selectedMovie?.title || "Unknown"} (${quality})`,
        progress: 0,
      };

      setDownloads((prev) => [...prev, newDownload]);
      connectWS(data.download_id, newDownload.title);
      setShowMagnets(false);
    } catch (error) {
      console.error("Failed to start download:", error);
    }
  }

  function connectWS(id: string, title: string) {
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${id}`);

    ws.onmessage = (msg) => {
      const payload = JSON.parse(msg.data);
      setDownloads((prev) =>
        prev.map((dl) =>
          dl.id === id ? { ...dl, progress: payload.progress } : dl
        )
      );
    };

    ws.onerror = () => {
      console.error("WebSocket error for download:", id);
    };

    setDownloads((prev) =>
      prev.map((dl) => (dl.id === id ? { ...dl, ws } : dl))
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <header className="flex items-center justify-center mb-16">
          <Logo />
        </header>

        <main className="space-y-8">
          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={searchMovies}
            isSearching={isSearching}
          />

          <div className="grid lg:grid-cols-[1fr_380px] gap-6">
            <MovieResults
              results={results}
              onSelectMovie={fetchMagnets}
              isSearching={isSearching}
            />
            <ActiveDownloads downloads={downloads} />
          </div>
        </main>
      </div>

      {showMagnets && (
        <MagnetSelector
          movie={selectedMovie}
          magnets={magnets}
          onClose={() => setShowMagnets(false)}
          onDownload={startDownload}
        />
      )}
    </div>
  );
}
