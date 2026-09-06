"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ConfiguratorState, PRESET_VALUES } from "./ConfiguratorPanel";

interface NeuralCoreSceneProps {
  config: ConfiguratorState;
  customGlbFile?: File | null;
  onStatsUpdate?: (stats: { fps: number; triangles: number; drawCalls: number }) => void;
}

export default function NeuralCoreScene({
  config,
  customGlbFile,
  onStatsUpdate,
}: NeuralCoreSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // References to dynamic Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Dynamic mesh groups
  const mainGroupRef = useRef<THREE.Group | null>(null);
  const ring1Ref = useRef<THREE.Mesh | null>(null);
  const ring2Ref = useRef<THREE.Mesh | null>(null);
  const cageRef = useRef<THREE.Mesh | null>(null);
  const coreRef = useRef<THREE.Mesh | null>(null);
  const altMeshRef = useRef<THREE.Mesh | null>(null);
  const glbModelRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const pointLightRef = useRef<THREE.PointLight | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Explode animation lerp state
  const explodeFactorRef = useRef(0);

  // Mouse tracking for cursor parallax
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Config reference for access in the RAF loop
  const configRef = useRef(config);
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Initial Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.2, 5.2);
    cameraRef.current = camera;

    // 3. WebGL Renderer with mobile-safe pixel ratio clamp
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls (Ergonomic touch & mouse interaction)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.0;
    controls.maxDistance = 10.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.15; // Don't flip under the floor
    controlsRef.current = controls;

    // 5. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x60a5fa, 2.2);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.DirectionalLight(0x34d399, 1.4);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x818cf8, 1.0);
    rimLight.position.set(0, 6, -5);
    scene.add(rimLight);

    // Inner glowing point light
    const pointLight = new THREE.PointLight(0x3b82f6, 2.0, 5);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);
    pointLightRef.current = pointLight;

    // 6. Ground Stage Grid
    const grid = new THREE.GridHelper(10, 20, 0x3b82f6, 0x27272a);
    grid.position.y = -1.8;
    (grid.material as THREE.Material).opacity = 0.35;
    (grid.material as THREE.Material).transparent = true;
    scene.add(grid);

    // 7. Master Model Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    mainGroupRef.current = mainGroup;

    // Build Neural Core Architecture:
    // A. Inner Core
    const coreGeo = new THREE.SphereGeometry(0.65, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.color),
      roughness: config.roughness,
      metalness: config.metalness,
      emissive: new THREE.Color(config.color),
      emissiveIntensity: config.emissiveIntensity,
      wireframe: config.wireframe,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);
    coreRef.current = coreMesh;

    // B. Middle Synaptic Cage (Icosahedron wire/faceted)
    const cageGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const cageMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    mainGroup.add(cageMesh);
    cageRef.current = cageMesh;

    // C. Outer Quantum Gimbal Ring 1
    const ring1Geo = new THREE.TorusGeometry(1.65, 0.04, 16, 64);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.15,
      metalness: 0.9,
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.rotation.x = Math.PI / 3;
    mainGroup.add(ring1Mesh);
    ring1Ref.current = ring1Mesh;

    // D. Outer Quantum Gimbal Ring 2
    const ring2Geo = new THREE.TorusGeometry(1.9, 0.04, 16, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      roughness: 0.15,
      metalness: 0.95,
      emissive: 0x2563eb,
      emissiveIntensity: 0.2,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.y = Math.PI / 4;
    mainGroup.add(ring2Mesh);
    ring2Ref.current = ring2Mesh;

    // E. Orbital Particle Cloud
    const particleCount = 240;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.2 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.035,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);
    particlesRef.current = particles;

    // 8. Event Listeners: Resize & Pointer Move
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePosRef.current.targetX = x;
      mousePosRef.current.targetY = y;
    };

    window.addEventListener("resize", handleResize);
    container.addEventListener("mousemove", handlePointerMove);

    // 9. Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = (currentTime - lastTime) * 0.001;
      lastTime = currentTime;

      // FPS Metrics
      frameCount++;
      if (currentTime - fpsTimer >= 1000) {
        if (onStatsUpdate && rendererRef.current) {
          const fps = Math.round((frameCount * 1000) / (currentTime - fpsTimer));
          const triangles = rendererRef.current.info.render.triangles;
          const drawCalls = rendererRef.current.info.render.calls;
          onStatsUpdate({ fps, triangles, drawCalls });
        }
        frameCount = 0;
        fpsTimer = currentTime;
      }

      const currentConfig = configRef.current;

      // Update Controls
      controls.update();

      // Smooth cursor parallax
      if (currentConfig.cursorParallax) {
        mousePosRef.current.x += (mousePosRef.current.targetX - mousePosRef.current.x) * 0.05;
        mousePosRef.current.y += (mousePosRef.current.targetY - mousePosRef.current.y) * 0.05;
        if (keyLightRef.current) {
          keyLightRef.current.position.x = 4 + mousePosRef.current.x * 2.5;
          keyLightRef.current.position.y = 5 + mousePosRef.current.y * 2.0;
        }
      }

      // Explode Animation Interpolation (Lerp)
      const targetExplode = currentConfig.exploded ? 1.0 : 0.0;
      explodeFactorRef.current += (targetExplode - explodeFactorRef.current) * 0.08;
      const explode = explodeFactorRef.current;

      // Apply Explode transformations
      if (ring1Ref.current) {
        ring1Ref.current.scale.setScalar(1.0 + explode * 0.6);
        ring1Ref.current.position.y = explode * 0.5;
      }
      if (ring2Ref.current) {
        ring2Ref.current.scale.setScalar(1.0 + explode * 0.8);
        ring2Ref.current.position.y = -explode * 0.5;
      }
      if (cageRef.current) {
        cageRef.current.scale.setScalar(1.0 + explode * 0.4);
      }

      // Auto-Rotation (respects reduced motion)
      if (currentConfig.autoRotate && !prefersReducedMotion && mainGroupRef.current) {
        const speed = currentConfig.rotateSpeed * delta * 0.6;
        mainGroupRef.current.rotation.y += speed;
        if (ring1Ref.current) ring1Ref.current.rotation.z += speed * 1.5;
        if (ring2Ref.current) ring2Ref.current.rotation.x -= speed * 1.2;
        if (particlesRef.current) particlesRef.current.rotation.y += speed * 0.8;
      }

      // Breathing Emissive Pulse
      if (coreRef.current && pointLightRef.current && !prefersReducedMotion) {
        const pulse = 1.0 + Math.sin(currentTime * 0.003) * 0.2;
        const mat = coreRef.current.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = currentConfig.emissiveIntensity * pulse;
        pointLightRef.current.intensity = 1.5 * pulse;
      }

      // Render
      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 10. Clean Up on Component Unmount (Zero Memory Leaks)
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handlePointerMove);

      // Dispose geometries, materials, controls, and renderer
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });

      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Materials & Geometries dynamically based on props
  useEffect(() => {
    if (!coreRef.current) return;

    const coreMat = coreRef.current.material as THREE.MeshStandardMaterial;
    coreMat.color.set(config.color);
    coreMat.roughness = config.roughness;
    coreMat.metalness = config.metalness;
    coreMat.emissive.set(config.color);
    coreMat.emissiveIntensity = config.emissiveIntensity;
    coreMat.wireframe = config.wireframe;
    coreMat.needsUpdate = true;

    if (pointLightRef.current) {
      pointLightRef.current.color.set(config.color);
    }
  }, [config.color, config.roughness, config.metalness, config.emissiveIntensity, config.wireframe]);

  // Handle Geometry Mode Switch
  useEffect(() => {
    if (!mainGroupRef.current || !sceneRef.current) return;

    // Remove existing alternate mesh if any
    if (altMeshRef.current) {
      mainGroupRef.current.remove(altMeshRef.current);
      altMeshRef.current.geometry.dispose();
      (altMeshRef.current.material as THREE.Material).dispose();
      altMeshRef.current = null;
    }

    const showNeuralCore = config.geometry === "neural-core";

    // Toggle visibility of neural core sub-elements
    if (coreRef.current) coreRef.current.visible = showNeuralCore;
    if (cageRef.current) cageRef.current.visible = showNeuralCore;
    if (ring1Ref.current) ring1Ref.current.visible = showNeuralCore;
    if (ring2Ref.current) ring2Ref.current.visible = showNeuralCore;

    if (!showNeuralCore) {
      let geo: THREE.BufferGeometry;
      if (config.geometry === "quantum-poly") {
        geo = new THREE.IcosahedronGeometry(1.4, 0); // Flat-shaded low-poly crystal
      } else {
        geo = new THREE.TorusKnotGeometry(1.05, 0.32, 128, 32);
      }

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(config.color),
        roughness: config.roughness,
        metalness: config.metalness,
        emissive: new THREE.Color(config.color),
        emissiveIntensity: config.emissiveIntensity * 0.5,
        wireframe: config.wireframe,
        flatShading: config.geometry === "quantum-poly",
      });

      const altMesh = new THREE.Mesh(geo, mat);
      mainGroupRef.current.add(altMesh);
      altMeshRef.current = altMesh;
    }
  }, [config.geometry]);

  // Handle Custom GLB file loading
  useEffect(() => {
    if (!customGlbFile || !mainGroupRef.current) return;

    const loader = new GLTFLoader();
    const objectUrl = URL.createObjectURL(customGlbFile);

    loader.load(
      objectUrl,
      (gltf) => {
        // Remove previous custom GLB if any
        if (glbModelRef.current && mainGroupRef.current) {
          mainGroupRef.current.remove(glbModelRef.current);
        }

        // Hide default procedural meshes
        if (coreRef.current) coreRef.current.visible = false;
        if (cageRef.current) cageRef.current.visible = false;
        if (ring1Ref.current) ring1Ref.current.visible = false;
        if (ring2Ref.current) ring2Ref.current.visible = false;
        if (altMeshRef.current) altMeshRef.current.visible = false;

        const model = gltf.scene;

        // Auto-center and auto-scale model to fit unit sphere
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.4 / (maxDim || 1);

        model.position.sub(center.multiplyScalar(scale));
        model.scale.setScalar(scale);

        // Apply configurator materials to model meshes
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(config.color),
              roughness: config.roughness,
              metalness: config.metalness,
              wireframe: config.wireframe,
            });
          }
        });

        mainGroupRef.current?.add(model);
        glbModelRef.current = model;

        URL.revokeObjectURL(objectUrl);
      },
      undefined,
      (error) => {
        console.error("Error loading GLB model:", error);
        URL.revokeObjectURL(objectUrl);
      }
    );

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [customGlbFile]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[520px] rounded-2xl overflow-hidden relative touch-none select-none bg-gradient-to-b from-zinc-950 via-zinc-900/60 to-zinc-950 border border-zinc-800/80 shadow-2xl"
    >
      {/* HUD Watermark & Controls Guide */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
            WebGL 3D Core Active
          </span>
        </div>
        <p className="text-[11px] text-zinc-400">
          Rotate: Drag • Zoom: Scroll / Pinch • Pan: Right-Click / 2-Finger
        </p>
      </div>
    </div>
  );
}
