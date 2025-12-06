"use client";

import React, { useState, useRef } from "react";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  isSearching: boolean;
}

function SearchBarComponent({ query, setQuery, onSearch, isSearching }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Section label */}
      <p className="text-xs uppercase tracking-[0.4em] text-[#00f0ff] mb-4 font-medium">
        Search Movies
      </p>

      {/* Main search container */}
      <div className="relative group">
        {/* Animated border gradient on hover */}
        <div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient"
          style={{
            background: "linear-gradient(135deg, #00f0ff, #7b61ff, #ff3366, #00f0ff)",
            backgroundSize: "300% 300%",
          }}
        />
        
        {/* Focus glow */}
        {isFocused && (
          <div
            className="absolute -inset-4 rounded-3xl pointer-events-none opacity-50"
            style={{
              background: "radial-gradient(ellipse at center, rgba(0, 240, 255, 0.15), transparent 70%)",
            }}
          />
        )}

        {/* Search input container */}
        <div 
          className="relative flex items-center glass rounded-2xl overflow-hidden cursor-text"
          onClick={handleContainerClick}
        >
          {/* Search icon */}
          <div className="flex-1 flex items-center px-8 py-6">
            <svg
              className={`w-6 h-6 mr-4 transition-colors duration-300 ${
                isFocused ? "text-[#00f0ff]" : "text-[#666666]"
              } ${isSearching ? "animate-spin" : ""}`}
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
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search for any movie..."
              className="flex-1 bg-transparent outline-none text-xl text-white placeholder-[#404040] font-light tracking-wide"
              style={{ fontFamily: "var(--font-body)" }}
              data-cursor-hover
            />
            
            {/* Clear button */}
            {query && (
              <button
                onClick={(e) => { e.stopPropagation(); setQuery(""); inputRef.current?.focus(); }}
                className="p-2 hover:bg-white/5 rounded-full transition-colors mr-2"
              >
                <svg className="w-5 h-5 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Search button */}
          <div className="p-3" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onSearch}
              disabled={isSearching || !query.trim()}
              className="relative px-10 py-4 rounded-xl font-semibold text-sm uppercase tracking-[0.2em] overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-[#00f0ff] to-[#7b61ff] hover:shadow-lg hover:shadow-[#00f0ff]/25 transition-shadow"
              data-cursor-hover
            >
              <span className="relative z-10 flex items-center gap-3 text-black font-bold">
                {isSearching ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Searching
                  </>
                ) : (
                  <>
                    Search
                    <svg 
                      className="w-5 h-5"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Helper text */}
      <p className="text-center text-sm text-[#404040] mt-4">
        Press <kbd className="px-2 py-1 rounded bg-[#1a1a1a] border border-[#252525] text-[#666666] text-xs mx-1">Enter</kbd> to search
      </p>
    </div>
  );
}

export const SearchBar = React.memo(SearchBarComponent);
