// src/components/DownloadShell.tsx
"use client";

import { motion } from "framer-motion";

export function DownloadShell() {
  // For now just a nice empty state panel.
  // Later we’ll put search results on left & active download list on right.
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5 }}
      className="mt-16 w-full max-w-5xl mx-auto grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]"
    >
      {/* Left: search results placeholder */}
      <div className="rounded-3xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-xl p-5 min-h-[260px] shadow-[0_20px_70px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold tracking-[0.25em] text-zinc-400 uppercase">
            RESULTS
          </h3>
          <span className="text-xs text-zinc-500">Torrents from YTS</span>
        </div>
        <p className="text-sm text-zinc-500">
          Search for a movie above. Matches from YTS will appear here with
          quality tags, size and a one-click download action.
        </p>
      </div>

      {/* Right: active downloads placeholder */}
      <div className="rounded-3xl border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl p-5 min-h-[260px] shadow-[0_20px_70px_rgba(0,0,0,0.9)]">
        <h3 className="text-sm font-semibold tracking-[0.25em] text-zinc-400 uppercase mb-4">
          ACTIVE
        </h3>
        <p className="text-sm text-zinc-500 mb-3">
          When you start a download, it will show up here with live progress.
        </p>
        <div className="mt-4 flex h-16 items-center justify-center rounded-2xl border border-dashed border-zinc-700/80 text-xs text-zinc-600">
          No active torrents yet.
        </div>
      </div>
    </motion.div>
  );
}
