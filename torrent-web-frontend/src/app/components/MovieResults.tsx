"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Movie {
  title: string;
  year: string;
  cover: string;
  page_link: string;
}

interface MovieResultsProps {
  results: Movie[];
  onSelectMovie: (movie: Movie) => void;
  isSearching: boolean;
}

export function MovieResults({ results, onSelectMovie, isSearching }: MovieResultsProps) {
  if (isSearching) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-3xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-xl p-8 shadow-[0_20px_70px_rgba(0,0,0,0.9)]"
      >
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <svg className="animate-spin h-12 w-12 text-teal-500" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-zinc-400">Searching YTS...</p>
        </div>
      </motion.div>
    );
  }

  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-xl p-8 shadow-[0_20px_70px_rgba(0,0,0,0.9)] min-h-[500px] flex items-center justify-center"
      >
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-zinc-900/80 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-zinc-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-300 mb-2">
              No Movies Yet
            </h3>
            <p className="text-sm text-zinc-500 max-w-sm">
              Search for your favorite movies above to get started. Results from YTS will appear here.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-xl p-6 shadow-[0_20px_70px_rgba(0,0,0,0.9)]"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold tracking-[0.25em] text-zinc-400 uppercase">
          Results
        </h2>
        <span className="text-xs text-zinc-500 bg-zinc-900/60 px-3 py-1 rounded-full">
          {results.length} {results.length === 1 ? "movie" : "movies"}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[calc(100vh-320px)] overflow-y-auto pr-2 scrollbar-thin">
        <AnimatePresence>
          {results.map((movie, index) => (
            <motion.div
              key={`${movie.page_link}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -8 }}
              onClick={() => onSelectMovie(movie)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer bg-zinc-900/60 border border-zinc-800/60 hover:border-teal-500/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(20,184,166,0.3)]"
            >
              <div className="aspect-[2/3] relative overflow-hidden bg-zinc-900">
                {movie.cover && (
                  <img
                    src={movie.cover}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-teal-500 rounded-full p-4 shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="p-3 space-y-1">
                <h3 className="font-semibold text-sm text-white line-clamp-2 leading-tight">
                  {movie.title}
                </h3>
                <p className="text-xs text-zinc-500">{movie.year}</p>
              </div>

              <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                <span className="text-xs font-bold text-teal-400">{movie.year}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
