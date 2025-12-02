"use client";

import { motion } from "framer-motion";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  isSearching: boolean;
}

export function SearchBar({ query, setQuery, onSearch, isSearching }: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/50 to-blue-500/50 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300" />

        <div className="relative flex items-center bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-zinc-800/80 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-zinc-700/80 transition-all duration-300">
          <div className="flex-1 flex items-center px-6 py-4">
            <svg
              className="w-5 h-5 text-zinc-500 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search movies on YTS..."
              className="flex-1 bg-transparent outline-none text-lg text-white placeholder-zinc-500 font-light"
            />
          </div>

          <motion.button
            onClick={onSearch}
            disabled={isSearching || !query.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="m-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-zinc-800 disabled:to-zinc-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg disabled:cursor-not-allowed disabled:text-zinc-600"
          >
            {isSearching ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                Searching
              </span>
            ) : (
              "Search"
            )}
          </motion.button>
        </div>
      </div>

      <p className="text-center text-xs text-zinc-600 mt-3">
        Search for movies from YTS
      </p>
    </motion.div>
  );
}
