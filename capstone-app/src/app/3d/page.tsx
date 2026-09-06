"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Cpu, Activity, ShieldCheck, Box, ExternalLink } from "lucide-react";
import SceneFallback from "@/components/3d/SceneFallback";
import ConfiguratorPanel, {
  ConfiguratorState,
  PRESET_VALUES,
} from "@/components/3d/ConfiguratorPanel";

// Dynamic import with ssr: false for responsible lazy loading & bundle splitting
const NeuralCoreScene = dynamic(
  () => import("@/components/3d/NeuralCoreScene"),
  {
    ssr: false,
    loading: () => <SceneFallback message="Lazy-loading Three.js WebGL Canvas..." />,
  }
);

const INITIAL_CONFIG: ConfiguratorState = {
  geometry: "neural-core",
  materialPreset: "obsidian",
  color: PRESET_VALUES.obsidian.color,
  roughness: PRESET_VALUES.obsidian.roughness,
  metalness: PRESET_VALUES.obsidian.metalness,
  emissiveIntensity: PRESET_VALUES.obsidian.emissiveIntensity,
  wireframe: false,
  exploded: false,
  autoRotate: true,
  rotateSpeed: 1.0,
  cursorParallax: true,
  showGrid: true,
};

export default function ThreeDExperiencePage() {
  const [config, setConfig] = useState<ConfiguratorState>(INITIAL_CONFIG);
  const [customGlbFile, setCustomGlbFile] = useState<File | null>(null);
  const [stats, setStats] = useState({ fps: 60, triangles: 4860, drawCalls: 7 });

  const handleConfigChange = (updates: Partial<ConfiguratorState>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const handleReset = () => {
    setConfig(INITIAL_CONFIG);
    setCustomGlbFile(null);
  };

  const handleFileUpload = (file: File) => {
    setCustomGlbFile(file);
  };

  const handleStatsUpdate = useCallback(
    (newStats: { fps: number; triangles: number; drawCalls: number }) => {
      setStats(newStats);
    },
    []
  );

  return (
    <div className="w-full flex flex-col gap-6 text-zinc-100 min-h-[calc(100vh-8rem)]">
      {/* Top Bar / Navigation Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Chat Copilot</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <h1 className="text-sm font-semibold text-zinc-200">
              Interactive 3D Experience
            </h1>
          </div>
        </div>

        {/* Real-time FE-10 Performance HUD */}
        <div className="flex items-center gap-3 bg-zinc-900/90 border border-zinc-800/80 px-3 py-1.5 rounded-xl text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>{stats.fps} FPS</span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-1.5 text-blue-400">
            <Box className="w-3.5 h-3.5" />
            <span>{stats.triangles.toLocaleString()} Tris</span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-1.5 text-purple-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{stats.drawCalls} Calls</span>
          </div>
        </div>
      </div>

      {/* Main Studio View: 3D Stage on Left, Configurator on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        {/* 3D Canvas Viewport (lg: 8 columns) */}
        <div className="lg:col-span-8 w-full h-[520px] sm:h-[620px] rounded-2xl overflow-hidden relative shadow-2xl">
          <NeuralCoreScene
            config={config}
            customGlbFile={customGlbFile}
            onStatsUpdate={handleStatsUpdate}
          />

          {/* Quick Action Overlay Chips */}
          <div className="absolute bottom-4 right-4 z-10 flex gap-2">
            <button
              onClick={() => handleConfigChange({ exploded: !config.exploded })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border backdrop-blur-md transition-all ${
                config.exploded
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                  : "bg-zinc-900/80 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              {config.exploded ? "Collapse Core" : "Deconstruct Layers"}
            </button>
            <button
              onClick={() => handleConfigChange({ wireframe: !config.wireframe })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border backdrop-blur-md transition-all ${
                config.wireframe
                  ? "bg-blue-500/20 border-blue-400 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                  : "bg-zinc-900/80 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              {config.wireframe ? "Shaded View" : "Wireframe"}
            </button>
          </div>
        </div>

        {/* Configurator Controls Sidebar (lg: 4 columns) */}
        <div className="lg:col-span-4 w-full">
          <ConfiguratorPanel
            config={config}
            onChange={handleConfigChange}
            onReset={handleReset}
            onFileUpload={handleFileUpload}
            isGlbLoaded={Boolean(customGlbFile)}
          />
        </div>
      </div>

      {/* Engineering Specs & FE-10 Performance Notes */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-zinc-800/80 pt-6">
        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Responsible 3D Delivery</span>
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Loaded dynamically with <code className="text-zinc-200">ssr: false</code>. Canvas renders only on client hydration with zero blocking JS on the initial page load. Clamped DPR prevents mobile GPU thermal throttling.
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>Interactive Loop</span>
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Full 360° OrbitControls with damping, pointer parallax tracking, live PBR material customizer, layer deconstruction animation, and custom GLB model drag-and-drop parsing.
          </p>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>Zero Memory Leaks</span>
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Every geometry, material, texture, and animation frame ID is systematically disposed during component unmount, ensuring zero WebGL context leaks across route changes.
          </p>
        </div>
      </div>
    </div>
  );
}
