import type Lenis from "lenis";

// Shared mutable state read by the WebGL orb every frame — deliberately not
// React state to avoid re-renders at 60fps.
export const scrollState = {
  progress: 0, // 0 at top of page, 1 at bottom
  mouse: { x: 0, y: 0 }, // normalized -1..1
};

// Set by SmoothScroll; the project overlay stops/starts it while open.
// null when reduced-motion (no Lenis) — callers must optional-chain.
export const lenisRef: { current: Lenis | null } = { current: null };
