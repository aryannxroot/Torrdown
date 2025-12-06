"use client";

import React, { useState, useMemo } from "react";
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

const ITEMS_PER_PAGE = 8;

function MovieCardComponent({ 
  movie, 
  index, 
  onSelect 
}: { 
  movie: Movie; 
  index: number; 
  onSelect: () => void 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
      className="group relative rounded-2xl overflow-hidden cursor-pointer bg-[#0a0a0a] border border-[#252525] hover:border-[#00f0ff]/50 transition-all duration-300"
      style={{
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
      }}
      data-cursor-hover
    >
      {/* Glow effect */}
      <div 
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0, 240, 255, 0.3), transparent 60%)",
        }}
      />
      
      {/* Card content */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* Image container */}
        <div className="aspect-[2/3] relative overflow-hidden bg-[#141414]">
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-[#1a1a1a] animate-pulse" />
          )}
          
          {movie.cover && (
            <img
              src={`https://www.yts-official.cc${movie.cover}`}
              alt={movie.title}
              className={`w-full h-full object-cover transition-all duration-300 ${
                isHovered ? "scale-110" : "scale-100"
              } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          )}
          
          {/* Hover overlay */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Play button on hover */}
          <div 
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          >
            <div className="w-14 h-14 rounded-full bg-[#00f0ff] flex items-center justify-center shadow-lg shadow-[#00f0ff]/30">
              <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Year badge */}
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
            <span className="text-xs font-bold text-[#00f0ff]">{movie.year}</span>
          </div>
        </div>

        {/* Title section */}
        <div className="p-4 bg-gradient-to-t from-[#0a0a0a] to-[#0f0f0f]">
          <h3 
            className={`font-semibold text-sm line-clamp-2 leading-tight transition-colors duration-200 ${
              isHovered ? "text-[#00f0ff]" : "text-white"
            }`}
          >
            {movie.title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}

const MovieCard = React.memo(MovieCardComponent);

export function MovieResults({ results, onSelectMovie, isSearching }: MovieResultsProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when results change
  useMemo(() => {
    setCurrentPage(1);
  }, [results]);

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return results.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [results, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to results section smoothly
    const resultsSection = document.querySelector('[data-results-section]');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isSearching) {
    return (
      <div className="rounded-3xl glass p-12">
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          {/* Animated loader */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-[#00f0ff]/30 animate-ping" />
            <div className="absolute inset-2 rounded-full border-2 border-t-[#00f0ff] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#00f0ff]" />
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-lg text-white font-medium">Searching movies...</p>
            <p className="text-sm text-[#666666]">This may take a moment</p>
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="rounded-3xl glass p-12 min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          {/* Animated icon */}
          <div className="w-24 h-24 mx-auto rounded-3xl bg-[#141414] border border-[#252525] flex items-center justify-center">
            <svg
              className="w-12 h-12 text-[#404040]"
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
          
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-white text-display">
              No Movies Found
            </h3>
            <p className="text-[#666666] leading-relaxed">
              Search for your favorite movies above. Discover thousands of films ready to download in various qualities.
            </p>
          </div>

          {/* Feature hints */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            {["Action", "Comedy", "Drama", "Sci-Fi"].map((genre) => (
              <span
                key={genre}
                className="px-4 py-2 rounded-full bg-[#141414] border border-[#252525] text-xs text-[#666666]"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl glass p-8" data-results-section>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#00f0ff] to-[#7b61ff]" />
          <div>
            <h2 className="text-sm font-semibold tracking-[0.3em] text-[#666666] uppercase">
              Results
            </h2>
            <p className="text-xs text-[#404040] mt-1">Click any movie to see download options</p>
          </div>
        </div>
        
        <span className="px-4 py-2 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-sm text-[#00f0ff] font-medium">
          {results.length} {results.length === 1 ? "movie" : "movies"}
        </span>
      </div>

      {/* Movie grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        <AnimatePresence mode="wait">
          {paginatedResults.map((movie, index) => (
            <MovieCard
              key={`${movie.page_link}-${currentPage}`}
              movie={movie}
              index={index}
              onSelect={() => onSelectMovie(movie)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 pt-6 border-t border-[#1a1a1a]">
          <div className="flex items-center justify-center gap-2">
            {/* Previous button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl bg-[#141414] border border-[#252525] flex items-center justify-center text-[#666666] hover:text-white hover:border-[#00f0ff]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first, last, current, and adjacent pages
                const showPage = page === 1 || 
                                 page === totalPages || 
                                 Math.abs(page - currentPage) <= 1;
                
                const showEllipsis = (page === 2 && currentPage > 3) || 
                                    (page === totalPages - 1 && currentPage < totalPages - 2);

                if (!showPage && !showEllipsis) return null;
                
                if (showEllipsis && !showPage) {
                  return (
                    <span key={page} className="px-2 text-[#404040]">...</span>
                  );
                }

                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`
                      w-10 h-10 rounded-xl font-medium text-sm transition-all
                      ${currentPage === page
                        ? "bg-[#00f0ff] text-black"
                        : "bg-[#141414] border border-[#252525] text-[#666666] hover:text-white hover:border-[#00f0ff]/50"
                      }
                    `}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-xl bg-[#141414] border border-[#252525] flex items-center justify-center text-[#666666] hover:text-white hover:border-[#00f0ff]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Page info */}
          <p className="text-center text-xs text-[#404040] mt-4">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, results.length)} of {results.length}
          </p>
        </div>
      )}
    </div>
  );
}
