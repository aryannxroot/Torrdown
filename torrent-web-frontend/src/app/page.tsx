"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Logo } from "./components/Logo";
import { SearchBar } from "./components/SearchBar";
import { MovieResults } from "./components/MovieResults";
import { ActiveDownloads } from "./components/ActiveDownloads";
import { MagnetSelector } from "./components/MagnetSelector";
import { ParticleField } from "./components/ParticleField";
import { CustomCursor } from "./components/CustomCursor";
import { SmoothScroll } from "./components/SmoothScroll";

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

type DownloadStatus = "downloading" | "completed" | "stopped" | "error" | "reconnecting" | "paused";

interface Download {
  id: string;
  title: string;
  progress: number;
  status: DownloadStatus;
  magnet?: string;
  quality?: string;
}

// Storage key - only persist downloads
const STORAGE_KEY = "torrdown_downloads";

export default function Page() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [magnets, setMagnets] = useState<Magnet[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showMagnets, setShowMagnets] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  const wsRefs = useRef<Map<string, WebSocket>>(new Map());
  const heroRef = useRef<HTMLDivElement>(null);
  const reconnectAttempts = useRef<Map<string, number>>(new Map());

  const backend = "http://127.0.0.1:8000";

  const connectWS = useCallback((id: string, isReconnect: boolean = false) => {
    // Close existing connection if any
    const existingWs = wsRefs.current.get(id);
    if (existingWs) {
      existingWs.close();
    }

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${id}`);
    wsRefs.current.set(id, ws);

    ws.onopen = () => {
      // Reset reconnect attempts on successful connection
      reconnectAttempts.current.set(id, 0);
      setDownloads(prev =>
        prev.map(dl =>
          dl.id === id ? { ...dl, status: "downloading" as DownloadStatus } : dl
        )
      );
    };

    ws.onmessage = (msg) => {
      try {
        const payload = JSON.parse(msg.data);
        setDownloads(prev =>
          prev.map(dl => {
            if (dl.id !== id) return dl;
            const newProgress = payload.progress;
            // Handle status from backend (paused, downloading, completed)
            let newStatus: DownloadStatus;
            if (payload.paused) {
              newStatus = "paused";
            } else if (newProgress >= 100) {
              newStatus = "completed";
            } else {
              newStatus = "downloading";
            }
            return { ...dl, progress: newProgress, status: newStatus };
          })
        );
      } catch (error) {
        console.error("Error parsing WS message:", error);
      }
    };

    ws.onerror = () => {
      // Silently handle - this is expected for reconnection attempts when download doesn't exist
      if (!isReconnect) {
        console.warn("WebSocket connection failed for download:", id);
      }
    };

    ws.onclose = () => {
      wsRefs.current.delete(id);
      
      setDownloads(prev =>
        prev.map(dl => {
          if (dl.id !== id) return dl;
          // Only mark as stopped if not already completed
          if (dl.status === "downloading" || dl.status === "reconnecting") {
            // If this was a reconnect attempt, mark as stopped
            if (isReconnect) {
              return { ...dl, status: "stopped" as DownloadStatus };
            }
            return { ...dl, status: "stopped" as DownloadStatus };
          }
          return dl;
        })
      );
    };
  }, []);

  // Load downloads from localStorage and try to reconnect
  useEffect(() => {
    try {
      const savedDownloads = localStorage.getItem(STORAGE_KEY);
      
      if (savedDownloads) {
        const parsedDownloads: Download[] = JSON.parse(savedDownloads);
        
        // For downloads that were in progress, mark as reconnecting and try to reconnect
        const updatedDownloads = parsedDownloads.map(dl => {
          if (dl.status === "downloading" || dl.status === "reconnecting") {
            return { ...dl, status: "reconnecting" as DownloadStatus };
          }
          return dl;
        });
        
        setDownloads(updatedDownloads);
        
        // Try to reconnect to in-progress downloads after a short delay
        setTimeout(() => {
          updatedDownloads.forEach(dl => {
            if (dl.status === "reconnecting") {
              connectWS(dl.id, true);
            }
          });
        }, 500);
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
    setIsHydrated(true);
  }, [connectWS]);

  // Save downloads to localStorage when they change
  useEffect(() => {
    if (!isHydrated) return;
    // Don't save ws references, save download state
    const downloadsToSave = downloads.map(({ id, title, progress, status, magnet, quality }) => ({
      id, title, progress, status, magnet, quality
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(downloadsToSave));
  }, [downloads, isHydrated]);

  // Cleanup WebSockets on unmount
  useEffect(() => {
    return () => {
      wsRefs.current.forEach(ws => ws.close());
    };
  }, []);

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
        status: "downloading",
        magnet,
        quality,
      };

      setDownloads(prev => [...prev, newDownload]);
      connectWS(data.download_id);
      setShowMagnets(false);
    } catch (error) {
      console.error("Failed to start download:", error);
    }
  }

  async function retryDownload(download: Download) {
    if (!download.magnet) return;
    
    // First, try to just reconnect to existing download
    setDownloads(prev =>
      prev.map(dl =>
        dl.id === download.id
          ? { ...dl, status: "reconnecting" as DownloadStatus }
          : dl
      )
    );
    
    // Try to connect to the existing download ID first
    connectWS(download.id, true);
  }

  async function pauseDownload(id: string) {
    try {
      await fetch(`${backend}/pause/${id}`, { method: "POST" });
      setDownloads(prev =>
        prev.map(dl =>
          dl.id === id ? { ...dl, status: "paused" as DownloadStatus } : dl
        )
      );
    } catch (error) {
      console.error("Failed to pause download:", error);
    }
  }

  async function resumeDownload(id: string) {
    try {
      await fetch(`${backend}/resume/${id}`, { method: "POST" });
      setDownloads(prev =>
        prev.map(dl =>
          dl.id === id ? { ...dl, status: "downloading" as DownloadStatus } : dl
        )
      );
    } catch (error) {
      console.error("Failed to resume download:", error);
    }
  }

  async function removeDownload(id: string) {
    // Close WebSocket connection
    const ws = wsRefs.current.get(id);
    if (ws) ws.close();
    wsRefs.current.delete(id);
    
    // Stop the download on the backend
    try {
      await fetch(`${backend}/stop/${id}`, { method: "POST" });
    } catch (error) {
      // Ignore errors - download might not exist on backend
    }
    
    // Remove from state
    setDownloads(prev => prev.filter(dl => dl.id !== id));
  }

  // Don't render until hydrated to prevent mismatch
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <SmoothScroll>
      <div className="relative min-h-screen text-white overflow-hidden">
        {/* Custom cursor */}
        <CustomCursor />
        
        {/* 3D Particle background */}
        <ParticleField />

        {/* Hero section */}
        <div ref={heroRef} className="relative z-10">
          {/* Navigation */}
          <nav className="fixed top-0 left-0 right-0 z-40 px-8 py-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <Logo />
              
              {/* Status indicator */}
              <div className="flex items-center gap-3 px-4 py-2 rounded-full glass">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-[#666666] uppercase tracking-wider">
                  System Online
                </span>
              </div>
            </div>
          </nav>

          {/* Hero content */}
          <div className="relative pt-40 pb-16 px-8">
            <div className="max-w-7xl mx-auto text-center space-y-8">
              {/* Tagline */}
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#00f0ff]/5 border border-[#00f0ff]/20">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
                <span className="text-sm font-medium text-[#00f0ff] uppercase tracking-[0.2em]">
                  Premium Torrent Experience
                </span>
              </div>

              {/* Main headline */}
              <div className="space-y-4" data-cursor-hover>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-display leading-none">
                  <span className="text-gradient">Download</span>
                </h1>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-display leading-none">
                  Movies <span className="text-[#7b61ff]">Instantly</span>
                </h1>
              </div>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-[#666666] max-w-2xl mx-auto leading-relaxed">
                Search thousands of movies and download them in your preferred quality.
                <span className="text-white"> Fast, simple, beautiful.</span>
              </p>

              {/* Scroll indicator */}
              <div className="pt-12">
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex flex-col items-center gap-2"
                >
                  <span className="text-xs uppercase tracking-[0.3em] text-[#404040]">Scroll to explore</span>
                  <div className="w-6 h-10 rounded-full border-2 border-[#252525] flex items-start justify-center p-2">
                    <motion.div
                      animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-20 px-8 pb-20">
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Search section */}
            <section className="py-8">
              <SearchBar
                query={query}
                setQuery={setQuery}
                onSearch={searchMovies}
                isSearching={isSearching}
              />
            </section>

            {/* Results grid */}
            <section className="grid lg:grid-cols-[1fr_400px] gap-8">
              <MovieResults
                results={results}
                onSelectMovie={fetchMagnets}
                isSearching={isSearching}
              />
              <ActiveDownloads 
                downloads={downloads}
                onRetry={retryDownload}
                onRemove={removeDownload}
                onPause={pauseDownload}
                onResume={resumeDownload}
              />
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-20 border-t border-[#1a1a1a] py-8 px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#404040]">
              © 2024 Torrdown. Built with passion.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-[#404040] uppercase tracking-wider">
                Made for movie lovers
              </span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#7b61ff]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff3366]" />
              </div>
            </div>
          </div>
        </footer>

        {/* Magnet selector modal */}
        {showMagnets && (
          <MagnetSelector
            movie={selectedMovie}
            magnets={magnets}
            onClose={() => setShowMagnets(false)}
            onDownload={startDownload}
          />
        )}
      </div>
    </SmoothScroll>
  );
}
