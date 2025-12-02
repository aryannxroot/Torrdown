"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex items-center backdrop-blur-lg bg-white/5 rounded-xl border border-white/10 p-3 shadow-2xl"
    >
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies… e.g. Interstellar"
        className="flex-1 bg-transparent outline-none px-3 text-lg placeholder-gray-500"
      />
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="bg-teal-400 text-black px-6 py-2 rounded-lg font-bold tracking-wide shadow-lg"
      >
        Search
      </motion.button>
    </motion.div>
  );
}
