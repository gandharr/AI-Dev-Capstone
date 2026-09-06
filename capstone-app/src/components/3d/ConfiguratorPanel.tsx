"use client";

import React from "react";
import { Sparkles, Layers, Sliders, Palette, Eye, RotateCw, Upload, RefreshCw } from "lucide-react";

export type GeometryType = "neural-core" | "quantum-poly" | "torus-knot";

export type MaterialPreset = "obsidian" | "cyber-neon" | "titanium" | "hologram" | "gold-chrome";

export interface ConfiguratorState {
  geometry: GeometryType;
  materialPreset: MaterialPreset;
  color: string;
  roughness: number;
  metalness: number;
  emissiveIntensity: number;
  wireframe: boolean;
  exploded: boolean;
  autoRotate: boolean;
  rotateSpeed: number;
  cursorParallax: boolean;
  showGrid: boolean;
}

interface ConfiguratorPanelProps {
  config: ConfiguratorState;
  onChange: (updates: Partial<ConfiguratorState>) => void;
  onReset: () => void;
  onFileUpload?: (file: File) => void;
  isGlbLoaded?: boolean;
}

export const PRESET_VALUES: Record<MaterialPreset, {
  color: string;
  roughness: number;
  metalness: number;
  emissiveIntensity: number;
  wireframe: boolean;
}> = {
  obsidian: {
    color: "#18181b",
    roughness: 0.18,
    metalness: 0.95,
    emissiveIntensity: 0.2,
    wireframe: false,
  },
  "cyber-neon": {
    color: "#059669",
    roughness: 0.35,
    metalness: 0.45,
    emissiveIntensity: 1.8,
    wireframe: false,
  },
  titanium: {
    color: "#cbd5e1",
    roughness: 0.28,
    metalness: 0.88,
    emissiveIntensity: 0.1,
    wireframe: false,
  },
  hologram: {
    color: "#38bdf8",
    roughness: 0.1,
    metalness: 0.2,
    emissiveIntensity: 1.2,
    wireframe: true,
  },
  "gold-chrome": {
    color: "#eab308",
    roughness: 0.08,
    metalness: 1.0,
    emissiveIntensity: 0.3,
    wireframe: false,
  },
};

export default function ConfiguratorPanel({
  config,
  onChange,
  onReset,
  onFileUpload,
  isGlbLoaded = false,
}: ConfiguratorPanelProps) {
  const handlePresetSelect = (preset: MaterialPreset) => {
    const values = PRESET_VALUES[preset];
    onChange({
      materialPreset: preset,
      ...values,
    });
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".glb") || file.name.endsWith(".gltf")) {
        onFileUpload?.(file);
      }
    }
  };

  return (
    <div className="w-full bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-md shadow-2xl flex flex-col gap-5 text-zinc-200 select-none">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold tracking-wide text-zinc-100">
            3D Studio Configurator
          </h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-zinc-800"
          title="Reset to defaults"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Geometry Selector */}
      <div className="space-y-2">
        <label className="text-xs font-medium uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Geometry Archetype</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "neural-core", label: "Neural Core" },
            { id: "quantum-poly", label: "Icosahedron" },
            { id: "torus-knot", label: "Torus Knot" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onChange({ geometry: item.id as GeometryType })}
              className={`py-2.5 px-2 text-xs font-semibold rounded-lg border transition-all ${
                config.geometry === item.id && !isGlbLoaded
                  ? "bg-blue-600/20 border-blue-500 text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.25)]"
                  : "bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Material Presets */}
      <div className="space-y-2">
        <label className="text-xs font-medium uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-purple-400" />
          <span>Material Presets</span>
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {[
            { id: "obsidian", label: "Obsidian", color: "#18181b" },
            { id: "cyber-neon", label: "Neon", color: "#059669" },
            { id: "titanium", label: "Titanium", color: "#94a3b8" },
            { id: "hologram", label: "Holo", color: "#38bdf8" },
            { id: "gold-chrome", label: "24K Gold", color: "#eab308" },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id as MaterialPreset)}
              className={`py-2 px-1 flex flex-col items-center gap-1 rounded-lg border text-[11px] font-medium transition-all ${
                config.materialPreset === preset.id
                  ? "bg-zinc-800 border-zinc-500 text-zinc-100 shadow-md scale-[1.02]"
                  : "bg-zinc-950/40 border-zinc-800/60 text-zinc-400 hover:bg-zinc-800/60"
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-zinc-700 shadow-sm"
                style={{ backgroundColor: preset.color }}
              />
              <span className="truncate w-full text-center">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders: Roughness, Metalness, Emissive */}
      <div className="space-y-3 bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/60">
        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <label htmlFor="roughness-slider" className="text-zinc-400">Surface Roughness</label>
            <span className="text-zinc-300 font-mono">{config.roughness.toFixed(2)}</span>
          </div>
          <input
            id="roughness-slider"
            aria-label="Surface Roughness"
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={config.roughness}
            onChange={(e) => onChange({ roughness: parseFloat(e.target.value) })}
            className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <label htmlFor="metalness-slider" className="text-zinc-400">Metalness Reflection</label>
            <span className="text-zinc-300 font-mono">{config.metalness.toFixed(2)}</span>
          </div>
          <input
            id="metalness-slider"
            aria-label="Metalness Reflection"
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={config.metalness}
            onChange={(e) => onChange({ metalness: parseFloat(e.target.value) })}
            className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <label htmlFor="emissive-slider" className="text-zinc-400">Neural Emissive Glow</label>
            <span className="text-zinc-300 font-mono">{config.emissiveIntensity.toFixed(1)}x</span>
          </div>
          <input
            id="emissive-slider"
            aria-label="Neural Emissive Glow"
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={config.emissiveIntensity}
            onChange={(e) => onChange({ emissiveIntensity: parseFloat(e.target.value) })}
            className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Interactive Toggles */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onChange({ wireframe: !config.wireframe })}
          className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
            config.wireframe
              ? "bg-blue-600/20 border-blue-500 text-blue-300"
              : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Wireframe Mode</span>
        </button>

        <button
          onClick={() => onChange({ exploded: !config.exploded })}
          className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
            config.exploded
              ? "bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
              : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Deconstruct Layers</span>
        </button>

        <button
          onClick={() => onChange({ autoRotate: !config.autoRotate })}
          className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
            config.autoRotate
              ? "bg-purple-600/20 border-purple-500 text-purple-300"
              : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <RotateCw className={`w-3.5 h-3.5 ${config.autoRotate ? "animate-spin" : ""}`} />
          <span>Auto Rotate</span>
        </button>

        <button
          onClick={() => onChange({ cursorParallax: !config.cursorParallax })}
          className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
            config.cursorParallax
              ? "bg-sky-600/20 border-sky-500 text-sky-300"
              : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <span className="text-[11px]">⚡</span>
          <span>Cursor Tracking</span>
        </button>
      </div>

      {/* Drag & Drop GLB Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        className="border border-dashed border-zinc-700/80 hover:border-blue-500/80 rounded-xl p-3 text-center transition-colors cursor-pointer bg-zinc-950/40 relative group"
      >
        <input
          id="custom-3d-model-upload"
          aria-label="Upload custom 3D model in GLB or GLTF format"
          type="file"
          accept=".glb,.gltf"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onFileUpload?.(e.target.files[0]);
            }
          }}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <label htmlFor="custom-3d-model-upload" className="flex items-center justify-center gap-2 text-xs text-zinc-400 group-hover:text-blue-400 transition-colors cursor-pointer">
          <Upload className="w-3.5 h-3.5" />
          <span>
            {isGlbLoaded ? "Custom 3D Model Loaded • Drop new .glb" : "Drop custom .glb / .gltf model here"}
          </span>
        </label>
      </div>
    </div>
  );
}
