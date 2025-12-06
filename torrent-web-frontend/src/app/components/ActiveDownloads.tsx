"use client";

import { motion, AnimatePresence } from "framer-motion";

type DownloadStatus = "downloading" | "completed" | "stopped" | "error" | "reconnecting" | "paused";

interface Download {
  id: string;
  title: string;
  progress: number;
  status: DownloadStatus;
  magnet?: string;
  quality?: string;
}

interface ActiveDownloadsProps {
  downloads: Download[];
  onRetry: (download: Download) => void;
  onRemove: (id: string) => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
}

export function ActiveDownloads({ downloads, onRetry, onRemove, onPause, onResume }: ActiveDownloadsProps) {
  const getStatusColor = (status: DownloadStatus) => {
    switch (status) {
      case "downloading": return "bg-[#00f0ff]";
      case "completed": return "bg-green-500";
      case "stopped": return "bg-yellow-500";
      case "error": return "bg-red-500";
      case "reconnecting": return "bg-blue-500";
      case "paused": return "bg-orange-500";
    }
  };

  const getStatusText = (status: DownloadStatus) => {
    switch (status) {
      case "downloading": return "Downloading...";
      case "completed": return "Completed";
      case "stopped": return "Stopped";
      case "error": return "Connection Error";
      case "reconnecting": return "Reconnecting...";
      case "paused": return "Paused";
    }
  };

  return (
    <div className="rounded-3xl glass-light p-6 sticky top-8 max-h-[calc(100vh-100px)] flex flex-col overflow-hidden">
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-[#00f0ff]/20 rounded-tl-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-[#7b61ff]/20 rounded-br-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f0ff]/20 to-[#7b61ff]/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#00f0ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          </div>
          
          <div>
            <h2 className="text-sm font-semibold tracking-[0.2em] text-white uppercase">
              Downloads
            </h2>
            <p className="text-xs text-[#666666]">Active transfers</p>
          </div>
        </div>
        
        {downloads.filter(d => d.status === "downloading").length > 0 && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00f0ff] rounded-full animate-pulse" />
            <span className="text-xs text-[#00f0ff] font-medium">Live</span>
          </div>
        )}
      </div>

      {/* Downloads list */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {downloads.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 space-y-5"
            >
              {/* Empty state illustration */}
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-[#252525] flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-[#404040]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3V8"
                    />
                  </svg>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-[#666666] font-medium">No active downloads</p>
                <p className="text-xs text-[#404040]">
                  Select a movie to start downloading
                </p>
              </div>
            </motion.div>
          ) : (
            downloads.map((download, index) => (
              <motion.div
                key={download.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  relative rounded-2xl bg-[#0f0f0f]/80 border p-5 overflow-hidden
                  ${download.status === "stopped" || download.status === "error" 
                    ? "border-yellow-500/30" 
                    : download.status === "completed" 
                      ? "border-green-500/30" 
                      : download.status === "reconnecting"
                        ? "border-blue-500/30"
                        : download.status === "paused"
                          ? "border-orange-500/30"
                          : "border-[#1a1a1a] hover:border-[#00f0ff]/30"
                  }
                  transition-colors
                `}
              >
                {/* Progress background glow */}
                {(download.status === "downloading" || download.status === "reconnecting") && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(90deg, rgba(0, 240, 255, 0.05) ${download.progress}%, transparent ${download.progress}%)`,
                    }}
                  />
                )}
                
                {/* Content */}
                <div className="relative space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight">
                        {download.title}
                      </h3>
                      <p className="text-xs text-[#666666] mt-1.5 flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(download.status)} ${download.status === "downloading" ? "animate-pulse" : ""}`} />
                        {getStatusText(download.status)}
                      </p>
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-2">
                      {/* Pause/Resume button - only show for downloading or paused */}
                      {(download.status === "downloading" || download.status === "paused") && (
                        <button
                          onClick={() => download.status === "paused" ? onResume(download.id) : onPause(download.id)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors group ${
                            download.status === "paused" 
                              ? "bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30" 
                              : "bg-[#1a1a1a] hover:bg-orange-500/20"
                          }`}
                          title={download.status === "paused" ? "Resume" : "Pause"}
                        >
                          {download.status === "paused" ? (
                            // Play icon
                            <svg className="w-4 h-4 text-[#00f0ff]" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          ) : (
                            // Pause icon
                            <svg className="w-4 h-4 text-[#666666] group-hover:text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                          )}
                        </button>
                      )}

                      {/* Remove button */}
                      <button
                        onClick={() => onRemove(download.id)}
                        className="w-8 h-8 rounded-lg bg-[#1a1a1a] hover:bg-red-500/20 flex items-center justify-center transition-colors group"
                        title="Stop & Remove"
                      >
                        <svg className="w-4 h-4 text-[#666666] group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      {/* Status icon */}
                      {download.status === "completed" ? (
                        <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : download.status === "downloading" || download.status === "reconnecting" ? (
                        <div className="w-10 h-10 rounded-xl bg-[#141414] border border-[#252525] flex items-center justify-center">
                          <svg className={`w-5 h-5 animate-spin ${download.status === "reconnecting" ? "text-blue-400" : "text-[#00f0ff]"}`} viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        </div>
                      ) : download.status === "paused" ? (
                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                          <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                          </svg>
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          download.status === "error" ? "bg-red-500/20 border border-red-500/30" : "bg-yellow-500/20 border border-yellow-500/30"
                        }`}>
                          <svg className={`w-5 h-5 ${download.status === "error" ? "text-red-400" : "text-yellow-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#666666]">Progress</span>
                      <span className="font-bold text-[#00f0ff] tabular-nums">
                        {download.progress.toFixed(1)}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="relative h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                        style={{
                          width: `${download.progress}%`,
                          background: download.status === "completed" 
                            ? "linear-gradient(90deg, #22c55e, #4ade80)"
                            : download.status === "stopped" || download.status === "error"
                              ? "linear-gradient(90deg, #eab308, #facc15)"
                              : download.status === "paused"
                                ? "linear-gradient(90deg, #f97316, #fb923c)"
                                : "linear-gradient(90deg, #00f0ff, #7b61ff)",
                        }}
                      />
                      
                      {/* Shimmer effect */}
                      {download.status === "downloading" && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      )}
                    </div>
                  </div>

                  {/* Retry button for stopped/error downloads */}
                  {(download.status === "stopped" || download.status === "error") && download.magnet && (
                    <button
                      onClick={() => onRetry(download)}
                      className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00f0ff]/20 to-[#7b61ff]/20 border border-[#00f0ff]/30 hover:border-[#00f0ff]/60 text-sm font-medium text-[#00f0ff] flex items-center justify-center gap-2 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Try Again
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer stats */}
      {downloads.length > 0 && (
        <div className="mt-6 pt-4 border-t border-[#1a1a1a]">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#141414] flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {downloads.filter(d => d.status === "downloading" || d.status === "reconnecting").length}
                  </span>
                </div>
                <span className="text-[#666666]">Active</span>
              </div>
              
              {downloads.filter(d => d.status === "paused").length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-orange-500/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-400">
                      {downloads.filter(d => d.status === "paused").length}
                    </span>
                  </div>
                  <span className="text-[#666666]">Paused</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-green-500/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-green-400">
                    {downloads.filter(d => d.status === "completed").length}
                  </span>
                </div>
                <span className="text-[#666666]">Done</span>
              </div>
            </div>
            
            {downloads.filter(d => d.status === "stopped" || d.status === "error").length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-yellow-500/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-400">
                    {downloads.filter(d => d.status === "stopped" || d.status === "error").length}
                  </span>
                </div>
                <span className="text-[#666666]">Stopped</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
