"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Plays CSS/SVG animations inside only while visible on screen. */
export function VizFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    // SMIL (<animate>, <animateMotion>) isn't covered by CSS play-state.
    const svgs = ref.current?.querySelectorAll("svg") ?? [];
    svgs.forEach((s) => (visible ? s.unpauseAnimations?.() : s.pauseAnimations?.()));
  }, [visible]);
  return (
    <div ref={ref} className={`viz-scope ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}
