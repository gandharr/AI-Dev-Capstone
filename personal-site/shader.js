/**
 * Cyber Aurora / Neural Flow Field — Interactive WebGL Hero Fragment Shader
 * 
 * Developed for: Gandhar Dhore — AI & Full-Stack Engineer Portfolio
 * Stack: Pure WebGL 1.0 (Zero external dependencies)
 * 
 * Features:
 * - 3 Core Uniforms: u_resolution, u_time, u_mouse
 * - Smooth Lerped Pointer Interaction (inertial tracking)
 * - Domain-Warped Harmonic Plasma Fluid Field (Cyan/Blue/Mint palette)
 * - Film Grain / Dither Pass (prevents 8-bit color banding)
 * - Responsible Engineering:
 *     1. devicePixelRatio capped at 2.0 (preserves battery & GPU)
 *     2. Tab visibility detection (pauses render loop when inactive)
 *     3. prefers-reduced-motion media query (renders 1 static frame & halts)
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. GLSL Shader Source Code
  // ---------------------------------------------------------------------------

  /**
   * Vertex Shader:
   * Maps a simple 2D fullscreen quad covering clip space [-1, 1].
   */
  const VS_SOURCE = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  /**
   * Fragment Shader:
   * Computes procedural organic aurora waves with mouse attraction,
   * customized color palette mapping, contrast vignette, and film grain.
   */
  const FS_SOURCE = `
    #ifdef GL_ES
    precision highp float;
    #endif

    // Uniforms passed from JavaScript
    uniform vec2 u_resolution; // Viewport resolution in physical pixels (width, height)
    uniform float u_time;       // Elapsed animation time in seconds
    uniform vec2 u_mouse;      // Normalized pointer position [0.0 to 1.0], Y-inverted

    // Helper: 2D rotation matrix for coordinate twisting
    mat2 rot(float angle) {
      float s = sin(angle);
      float c = cos(angle);
      return mat2(c, -s, s, c);
    }

    // Pseudo-random hash for film grain dithering
    float hash21(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
      // -----------------------------------------------------------------------
      // Step A: UV Normalization & Aspect Ratio Correction
      // Centered at (0.0, 0.0), uniform scale prevents horizontal stretching
      // -----------------------------------------------------------------------
      vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

      // -----------------------------------------------------------------------
      // Step B: Pointer Interaction Vector (u_mouse)
      // Map normalized mouse to centered aspect-corrected coordinate space
      // -----------------------------------------------------------------------
      vec2 mouse_st = (u_mouse * u_resolution.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
      vec2 to_mouse = mouse_st - st;
      float mouse_dist = length(to_mouse);

      // Smooth gaussian-like influence falloff around cursor (radius ~0.75)
      float mouse_influence = smoothstep(0.75, 0.0, mouse_dist);

      // Attract space towards the mouse pointer with subtle rotational torque
      st += (to_mouse / (mouse_dist + 0.08)) * mouse_influence * 0.14;
      st = rot(mouse_influence * 0.22) * st;

      // -----------------------------------------------------------------------
      // Step C: Domain Warping & Harmonic Fluid Waves (u_time)
      // Generates organic flowing aurora ribbons using layered sinusoids
      // -----------------------------------------------------------------------
      float t = u_time * 0.32; // Smooth gentle drift pace

      // Layer 1 warp coordinates
      vec2 q = vec2(0.0);
      q.x = sin(st.x * 2.2 + t * 0.75) + cos(st.y * 1.9 - t * 0.55);
      q.y = cos(st.x * 1.6 - t * 0.65) + sin(st.y * 2.3 + t * 0.85);

      // Layer 2 nested domain warp: coordinates curled through q
      vec2 r = vec2(0.0);
      r.x = sin(dot(st, vec2(1.5, 1.2)) + q.x * 1.4 + t * 0.7);
      r.y = cos(dot(st, vec2(1.1, 1.8)) + q.y * 1.4 - t * 0.6);

      // Combined fluid wave intensity field
      float wave1 = sin(st.x * 2.8 + r.x * 1.8 + t * 0.5) * 0.5 + 0.5;
      float wave2 = cos(st.y * 3.2 + r.y * 1.8 - t * 0.6) * 0.5 + 0.5;
      float field = mix(wave1, wave2, 0.5);

      // Main undulating aurora ribbon crest spanning the top half
      float ribbon = 1.0 - smoothstep(0.0, 0.32, abs(st.y - sin(st.x * 2.4 + t * 0.9 + q.x * 0.4) * 0.32 + 0.12));

      // -----------------------------------------------------------------------
      // Step D: Curated Color Palette Mapping
      // Gandhar Dhore Identity Kit: Deep Obsidian, Electric Cyan, Royal Blue, Mint
      // -----------------------------------------------------------------------
      vec3 col_obsidian = vec3(0.027, 0.027, 0.039); // Deep dark background (#07070a)
      vec3 col_cyan     = vec3(0.024, 0.714, 0.831); // Technical Electric Cyan (#06b6d4)
      vec3 col_blue     = vec3(0.145, 0.388, 0.922); // Royal Cobalt Blue (#2563eb)
      vec3 col_mint     = vec3(0.063, 0.725, 0.506); // Emerald Mint Accent (#10b981)
      vec3 col_indigo   = vec3(0.388, 0.400, 0.945); // Deep Indigo Highlight (#6366f1)

      // Layered gradient composition
      vec3 color = col_obsidian;
      color = mix(color, col_blue, smoothstep(0.18, 0.80, field));
      color = mix(color, col_cyan, smoothstep(0.35, 0.92, field * (q.x * 0.5 + 0.5)));
      color += col_mint * ribbon * 0.42; // Add luminous aurora filament
      color += col_indigo * mouse_influence * 0.30; // Interactive pointer reactive glow

      // -----------------------------------------------------------------------
      // Step E: Contrast Guardrail & Edge Vignette
      // Preserves text readability: darkens edges and keeps background subtle
      // -----------------------------------------------------------------------
      // Radial falloff from screen center
      float dist_from_center = length(st);
      float vignette = smoothstep(1.5, 0.35, dist_from_center);
      color *= vignette;

      // Master ambient intensity: keeps contrast with foreground text > 7:1
      color *= 0.68;

      // -----------------------------------------------------------------------
      // Step F: Analog Film Grain / Dithering Pass
      // Breaks up 8-bit banding across soft dark gradients
      // -----------------------------------------------------------------------
      float grain = (hash21(gl_FragCoord.xy + fract(u_time * 1.1)) - 0.5) * 0.028;
      color += grain;

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  // ---------------------------------------------------------------------------
  // 2. WebGL Initialization & Context Setup
  // ---------------------------------------------------------------------------

  const canvas = document.getElementById('hero-shader-canvas');
  if (!canvas) {
    console.warn('[ShaderHero] #hero-shader-canvas element not found.');
    return;
  }

  // Request context with powerPreference and depth disabled for 2D quad
  const gl = canvas.getContext('webgl', {
    alpha: false,
    depth: false,
    stencil: false,
    antialias: false,
    powerPreference: 'high-performance',
  }) || canvas.getContext('experimental-webgl');

  if (!gl) {
    console.warn('[ShaderHero] WebGL not supported on this browser. Falling back to static gradient.');
    return;
  }

  // Compile individual shader
  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('[ShaderHero] Compile Error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, VS_SOURCE);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FS_SOURCE);

  if (!vertexShader || !fragmentShader) {
    return;
  }

  // Link shader program
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('[ShaderHero] Link Error:', gl.getProgramInfoLog(program));
    return;
  }

  gl.useProgram(program);

  // Fullscreen Quad Geometry: 2 triangles covering [-1, 1] clip space
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]),
    gl.STATIC_DRAW
  );

  const aPositionLoc = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(aPositionLoc);
  gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);

  // Look up uniform locations
  const uResolutionLoc = gl.getUniformLocation(program, 'u_resolution');
  const uTimeLoc = gl.getUniformLocation(program, 'u_time');
  const uMouseLoc = gl.getUniformLocation(program, 'u_mouse');

  // ---------------------------------------------------------------------------
  // 3. Performance & Responsible Sizing (Capped DPR)
  // ---------------------------------------------------------------------------

  let canvasWidth = 0;
  let canvasHeight = 0;

  function resizeCanvas() {
    const parent = canvas.parentElement || document.body;
    const rect = parent.getBoundingClientRect();
    const displayWidth = Math.max(320, rect.width || window.innerWidth);
    const displayHeight = Math.max(480, rect.height || 900);

    // CRITICAL: Cap DPR to 2.0 to avoid melting GPU on 3x/4x mobile screens
    const dpr = Math.min(window.devicePixelRatio || 1, 2.0);
    const renderWidth = Math.floor(displayWidth * dpr);
    const renderHeight = Math.floor(displayHeight * dpr);

    if (canvas.width !== renderWidth || canvas.height !== renderHeight) {
      canvas.width = renderWidth;
      canvas.height = renderHeight;
      canvasWidth = renderWidth;
      canvasHeight = renderHeight;
      gl.viewport(0, 0, renderWidth, renderHeight);
      gl.uniform2f(uResolutionLoc, renderWidth, renderHeight);
    }
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();

  // ---------------------------------------------------------------------------
  // 4. Mouse Pointer Tracking & Inertial Lerp
  // ---------------------------------------------------------------------------

  let targetMouseX = 0.5;
  let targetMouseY = 0.5;
  let currentMouseX = 0.5;
  let currentMouseY = 0.5;

  function updatePointer(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const x = (clientX - rect.left) / rect.width;
      const y = 1.0 - (clientY - rect.top) / rect.height; // Invert Y for GL coordinates
      targetMouseX = Math.max(0.0, Math.min(1.0, x));
      targetMouseY = Math.max(0.0, Math.min(1.0, y));
    }
  }

  window.addEventListener('pointermove', (e) => {
    updatePointer(e.clientX, e.clientY);
  }, { passive: true });

  // Touch support: track first finger
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
      updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // ---------------------------------------------------------------------------
  // 5. Render Loop, prefers-reduced-motion & Tab Visibility Handlers
  // ---------------------------------------------------------------------------

  let animationFrameId = null;
  let startTime = performance.now();
  let pausedTimeAccumulator = 0;
  let pauseStartTime = 0;

  // Reduced motion query
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let prefersReducedMotion = motionQuery.matches;

  /**
   * Renders a single frame at timestamp t
   */
  function renderFrame(timeSeconds) {
    // Smooth inertial lerp for mouse coordinates (feels fluid, zero jitter)
    currentMouseX += (targetMouseX - currentMouseX) * 0.07;
    currentMouseY += (targetMouseY - currentMouseY) * 0.07;

    gl.uniform1f(uTimeLoc, timeSeconds);
    gl.uniform2f(uMouseLoc, currentMouseX, currentMouseY);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  /**
   * Main continuous animation loop
   */
  function animate(now) {
    if (prefersReducedMotion) {
      renderFrame(1.8); // Render 1 optimal static frame
      animationFrameId = null;
      return;
    }

    const elapsedSeconds = (now - startTime - pausedTimeAccumulator) * 0.001;
    renderFrame(elapsedSeconds);
    animationFrameId = requestAnimationFrame(animate);
  }

  /**
   * Start animation loop safely
   */
  function startLoop() {
    if (!animationFrameId && !prefersReducedMotion && !document.hidden) {
      if (pauseStartTime > 0) {
        pausedTimeAccumulator += performance.now() - pauseStartTime;
        pauseStartTime = 0;
      }
      animationFrameId = requestAnimationFrame(animate);
    }
  }

  /**
   * Pause animation loop safely
   */
  function stopLoop() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
      pauseStartTime = performance.now();
    }
  }

  // Guardrail 1: Pause animation when browser tab is hidden to conserve 100% GPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopLoop();
    } else {
      startLoop();
    }
  });

  // Guardrail 2: Listen for user toggling reduced-motion settings at OS level
  function onReducedMotionChange(e) {
    prefersReducedMotion = e.matches;
    if (prefersReducedMotion) {
      stopLoop();
      renderFrame(1.8); // Still frame
    } else {
      startLoop();
    }
  }

  if (typeof motionQuery.addEventListener === 'function') {
    motionQuery.addEventListener('change', onReducedMotionChange);
  } else if (typeof motionQuery.addListener === 'function') {
    motionQuery.addListener(onReducedMotionChange);
  }

  // Initial render kickoff
  if (prefersReducedMotion) {
    renderFrame(1.8);
  } else {
    startLoop();
  }

  console.log('[ShaderHero] Initialized successfully. Capped DPR:', Math.min(window.devicePixelRatio || 1, 2.0));
})();
