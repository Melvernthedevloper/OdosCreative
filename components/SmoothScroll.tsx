"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollState } from "@/lib/scrollState";

export default function SmoothScroll() {
  useEffect(() => {
    // Global scroll progress feeds the orb even in reduced-motion mode.
    const progressTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        scrollState.progress = self.progress;
      },
    });

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return () => progressTrigger.kill();

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      progressTrigger.kill();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
