"use client";

import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";

/**
 * A hanging cord with a bulb. Pull it down (drag or click) to switch
 * between dark and light mode, like a real light switch.
 */
export function PullCord() {
  const reduce = useReducedMotion();
  const [light, setLight] = useState(false);
  const y = useMotionValue(0);
  const cordLen = useTransform(y, (v) => 120 + Math.max(0, v));

  useEffect(() => {
    setLight(document.documentElement.dataset.theme === "light");
  }, []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    if (next) document.documentElement.dataset.theme = "light";
    else delete document.documentElement.dataset.theme;
    try {
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch {
      /* storage blocked — theme still switches for this visit */
    }
  };

  const tug = () => {
    if (reduce) return toggle();
    animate(y, [0, 46, -6, 0], { duration: 0.7, times: [0, 0.35, 0.75, 1] });
    setTimeout(toggle, 220);
  };

  return (
    <div className="pointer-events-none absolute right-6 top-16 z-20 hidden flex-col items-center md:flex lg:right-10">
      <svg width="2" className="overflow-visible" style={{ height: 120 }} aria-hidden="true">
        <motion.line x1={1} x2={1} y1={0} y2={cordLen} stroke="var(--color-mute)" strokeWidth={1.4} />
      </svg>
      <motion.button
        type="button"
        onClick={tug}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 30) toggle();
        }}
        style={{ y }}
        whileHover={{ scale: 1.08 }}
        aria-label={light ? "Pull to switch to dark mode" : "Pull to switch to light mode"}
        title="Pull me"
        className="pointer-events-auto -mt-px flex cursor-grab flex-col items-center active:cursor-grabbing"
      >
        <span className="h-2 w-3 rounded-t-sm bg-mute" />
        <span
          className={`grid size-7 place-items-center rounded-full border transition-all duration-500 ${
            light
              ? "border-[#f5c84c] bg-[#ffd75e] shadow-[0_0_30px_8px_#ffd75e88]"
              : "border-line-strong bg-panel-2"
          }`}
        >
          <span className={`size-2 rounded-full ${light ? "bg-[#fff6d0]" : "bg-mute"}`} />
        </span>
        <span className="mt-2 whitespace-nowrap text-[10.5px] uppercase tracking-[0.14em] text-mute">pull</span>
      </motion.button>
    </div>
  );
}
