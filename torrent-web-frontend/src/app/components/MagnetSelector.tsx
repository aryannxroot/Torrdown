"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-zinc-900 rounded-3xl border border-zinc-800/80 shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden relative"
        >
          {/* Full card background image */}
          {movie.cover && (
            <div className="absolute inset-0">
              <img
                src={`https://www.yts-official.cc${movie.cover}`}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/90 to-zinc-900/40" />
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 flex items-center justify-center transition-colors border border-zinc-700/50"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Movie title header */}
          <div className="relative pt-32 pb-6 px-6">
            <h2 className="text-2xl font-bold text-white mb-1">{movie.title}</h2>
            <p className="text-sm text-zinc-400">{movie.year}</p>
          </div>

          {/* Quality selector content */}
          <div className="relative p-6 pt-0 space-y-4">
            <div>
              <h3 className="text-sm font-semibold tracking-[0.2em] text-zinc-400 uppercase mb-3">
                Select Quality
              </h3>
              <p className="text-xs text-zinc-500 mb-4">
                Choose your preferred quality to start downloading
              </p>
            </div>

            {magnets.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800/60 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-zinc-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-zinc-400">No torrents available</p>
                <p className="text-xs text-zinc-600 mt-1">
                  This movie doesn't have any downloadable torrents
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
                {magnets.map((magnet, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onDownload(magnet.magnet, magnet.quality)}
                    className="w-full group relative rounded-2xl bg-zinc-800/40 hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-teal-500/50 p-4 transition-all duration-200 text-left overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-zinc-900/80 flex items-center justify-center border border-zinc-700/50">
                          <svg
                            className="w-6 h-6 text-teal-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3V8"
                            />
                          </svg>
                        </div>

                        <div>
                          <div className="font-semibold text-white mb-1">
                            {magnet.quality}
                          </div>
                          <div className="text-xs text-zinc-500">
                            Click to start download
                          </div>
                        </div>
                      </div>

                      <svg
                        className="w-5 h-5 text-zinc-600 group-hover:text-teal-500 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
