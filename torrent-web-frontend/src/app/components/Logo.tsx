"use client";

import React from "react";

function LogoComponent() {
  return (
    <div
      className="flex items-center gap-4"
      data-cursor-hover
    >
      {/* Logo mark */}
      <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-[#0a0a0a] to-[#151515] border border-[#252525] overflow-hidden shadow-lg shadow-[#00f0ff]/10">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff] via-[#7b61ff] to-[#ff3366] animate-gradient" />
        
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        
        {/* Letter T */}
        <div className="relative flex h-full w-full items-center justify-center">
          <span 
            className="text-xl font-black text-white drop-shadow-lg" 
            style={{ fontFamily: "var(--font-display)" }}
          >
            T
          </span>
        </div>
      </div>

      {/* Text */}
      <span 
        className="text-2xl font-extrabold tracking-[0.3em] text-display"
        style={{ textShadow: "0 0 30px rgba(0, 240, 255, 0.2)" }}
      >
        TORRDOWN
      </span>
    </div>
  );
}

export const Logo = React.memo(LogoComponent);
