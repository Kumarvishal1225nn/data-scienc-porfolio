"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Inertia smooth-scrolling for the whole page (off for reduced motion). */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -80 } });
    let id = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    // Pause while a full-screen overlay (door room / dialog) locks the body.
    const mo = new MutationObserver(() => {
      if (document.body.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    return () => {
      cancelAnimationFrame(id);
      mo.disconnect();
      lenis.destroy();
    };
  }, []);
  return null;
}
