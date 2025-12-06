"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

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

interface MagnetSelectorProps {
  movie: Movie | null;
  magnets: Magnet[];
  onClose: () => void;
  onDownload: (magnet: string, quality: string) => void;
}

export function MagnetSelector({ movie, magnets, onClose, onDownload }: MagnetSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  if (!movie) return null;

  const handleDownload = (magnet: Magnet, index: number) => {
    setSelectedIndex(index);
    setTimeout(() => {
      onDownload(magnet.magnet, magnet.quality);
    }, 200);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop with blur */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />

        {/* Modal container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl rounded-3xl overflow-hidden"
        >
          {/* Animated border */}
          <div
            className="absolute inset-0 rounded-3xl p-[1px] pointer-events-none animate-gradient"
            style={{
              background: "linear-gradient(135deg, #00f0ff, #7b61ff, #ff3366, #00f0ff)",
              backgroundSize: "300% 300%",
            }}
          />

          <div className="relative bg-[#0a0a0a] rounded-3xl overflow-hidden m-[1px]">
            {/* Full card background image */}
            {movie.cover && (
              <div className="absolute inset-0">
                <img
                  src={`https://www.yts-official.cc${movie.cover}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-[#0a0a0a]/60" />
              </div>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-20 w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
              data-cursor-hover
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Movie info header */}
            <div className="relative pt-24 pb-8 px-8">
              {/* Year badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/20 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />
                <span className="text-sm font-bold text-[#00f0ff]">{movie.year}</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white text-display leading-tight mb-2">
                {movie.title}
              </h2>
              
              <p className="text-[#666666]">
                Select your preferred quality to start downloading
              </p>
            </div>

            {/* Quality selector */}
            <div className="relative px-8 pb-8 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#00f0ff] to-[#7b61ff]" />
                <h3 className="text-xs font-semibold tracking-[0.3em] text-[#666666] uppercase">
                  Available Qualities
                </h3>
              </div>

              {magnets.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#141414] border border-[#252525] flex items-center justify-center">
                    <svg className="w-10 h-10 text-[#404040]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <p className="text-lg text-white font-medium mb-2">No torrents available</p>
                  <p className="text-sm text-[#666666]">This movie doesn't have any downloadable torrents yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
                  {magnets.map((magnet, index) => (
                    <button
                      key={index}
                      onClick={() => handleDownload(magnet, index)}
                      className={`
                        w-full group relative rounded-2xl p-5 text-left overflow-hidden transition-all duration-200
                        ${selectedIndex === index 
                          ? "bg-[#00f0ff]/20 border-[#00f0ff]" 
                          : "bg-[#141414]/80 hover:bg-[#1a1a1a] border-[#252525] hover:border-[#00f0ff]/50"
                        }
                        border
                      `}
                      data-cursor-hover
                    >
                      {/* Hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff]/0 via-[#00f0ff]/5 to-[#00f0ff]/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          {/* Quality icon */}
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00f0ff]/20 to-[#7b61ff]/20 flex items-center justify-center border border-[#00f0ff]/20">
                            <svg className="w-7 h-7 text-[#00f0ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3V8" />
                            </svg>
                          </div>

                          <div>
                            <div className="font-bold text-lg text-white mb-1 group-hover:text-[#00f0ff] transition-colors">
                              {magnet.quality}
                            </div>
                            <div className="text-sm text-[#666666] flex items-center gap-2">
                              <span>Click to start download</span>
                              <span>→</span>
                            </div>
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="w-10 h-10 rounded-full bg-[#1a1a1a] group-hover:bg-[#00f0ff] flex items-center justify-center transition-colors">
                          <svg
                            className="w-5 h-5 text-[#666666] group-hover:text-black transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom decorative line */}
            <div className="h-1 bg-gradient-to-r from-transparent via-[#00f0ff]/50 to-transparent" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
