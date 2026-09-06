"use client";

import React from "react";

interface SceneFallbackProps {
  message?: string;
  staticMode?: boolean;
}

export default function SceneFallback({
  message = "Initializing WebGL 3D Engine...",
  staticMode = false,
}: SceneFallbackProps) {
  return (
    <div className="w-full h-full min-h-[480px] flex flex-col items-center justify-center bg-zinc-950/80 rounded-2xl border border-zinc-800/80 relative overflow-hidden backdrop-blur-md p-6 select-none">
      {/* Background glow */}
      <div className="absolute w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none -top-10 -right-10" />
      <div className="absolute w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none -bottom-10 -left-10" />

      {/* 3D Wireframe Glyphs */}
      <div className="relative mb-6">
        <div className={`w-24 h-24 rounded-2xl border-2 border-dashed border-blue-500/40 flex items-center justify-center ${staticMode ? "" : "animate-spin"} [animation-duration:12s]`}>
          <div className="w-16 h-16 rounded-xl border border-emerald-400/50 flex items-center justify-center rotate-45">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/80 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
          </div>
        </div>
      </div>

      <p className="text-sm font-medium text-zinc-300 tracking-wide mb-1">
        {message}
      </p>
      <p className="text-xs text-zinc-500">
        {staticMode
          ? "Reduced motion active • Static 3D render preview"
          : "Staging materials, lighting, and procedural neural shaders"}
      </p>
    </div>
  );
}
