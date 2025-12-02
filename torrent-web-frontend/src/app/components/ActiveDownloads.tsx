"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Download {
  id: string;
  title: string;
  progress: number;
}

interface ActiveDownloadsProps {
  downloads: Download[];
}

export function ActiveDownloads({ downloads }: ActiveDownloadsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-3xl border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl p-6 shadow-[0_20px_70px_rgba(0,0,0,0.9)] sticky top-8 max-h-[calc(100vh-100px)] flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold tracking-[0.25em] text-zinc-400 uppercase">
          Active
        </h2>
        {downloads.length > 0 && (
          <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {downloads.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-900/60 border border-dashed border-zinc-700/80 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-zinc-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm text-zinc-500 font-medium">No active downloads</p>
                <p className="text-xs text-zinc-600 mt-1">
                  Start a download to see it here
                </p>
              </div>
            </motion.div>
          ) : (
            downloads.map((download, index) => (
              <motion.div
                key={download.id}
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl bg-zinc-900/60 border border-zinc-800/60 p-4 space-y-3 hover:border-zinc-700/80 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight">
                      {download.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      {download.progress === 100 ? "Completed" : "Downloading..."}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    {download.progress === 100 ? (
                      <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-teal-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-800/80 flex items-center justify-center">
                        <svg
                          className="animate-spin w-4 h-4 text-teal-500"
                          viewBox="0 0 24 24"
                        >
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
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Progress</span>
                    <span className="font-semibold text-teal-400">
                      {download.progress.toFixed(1)}%
                    </span>
                  </div>

                  <div className="relative h-2 bg-zinc-800/80 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${download.progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {downloads.length > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Total Active</span>
            <span className="font-semibold text-white">{downloads.length}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
