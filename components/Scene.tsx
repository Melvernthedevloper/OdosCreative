"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import MoltenOrb from "@/components/MoltenOrb";
import { scrollState } from "@/lib/scrollState";

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function Scene() {
  const [detail, setDetail] = useState<number | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !webglAvailable()) return; // CSS .bg-glow stays as the fallback
    setDetail(window.innerWidth < 768 ? 32 : 64);

    const onMove = (e: PointerEvent) => {
      scrollState.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  if (detail === null) return null;

  return (
    <div className="webgl-scene" aria-hidden>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <MoltenOrb detail={detail} />
      </Canvas>
    </div>
  );
}
