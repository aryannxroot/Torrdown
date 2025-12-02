// src/components/Logo.tsx
"use client";

import { motion } from "framer-motion";

export function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 160 }}
      className="flex items-center gap-3"
    >
      <div className="relative h-11 w-11 rounded-2xl bg-zinc-900 border border-zinc-700 shadow-[0_0_40px_rgba(0,0,0,0.7)] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,#ffffff,transparent_55%),radial-gradient(circle_at_100%_100%,#4ade80,transparent_55%)] opacity-80" />
        <div className="relative flex h-full w-full items-center justify-center text-xl font-black text-zinc-950 mix-blend-screen">
          T
        </div>
      </div>
      <span className="text-xl md:text-2xl font-extrabold tracking-[0.3em]">
        TORRDOWN
      </span>
    </motion.div>
  );
}
