"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ticker = ["LOADING SENSORS", "RESAMPLING · 5 MIN", "FILLING GAPS", "TRAINING LIGHTGBM", "READY"];

/** Intro: a 0→100 counter, then the screen splits open. Once per visit. */
export function Preloader() {
  const [show, setShow] = useState(true);
  const [n, setN] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("intro") === "1";
      sessionStorage.setItem("intro", "1");
    } catch {
      /* storage blocked — just play it */
    }
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(false);
      return;
    }
    document.body.style.overflow = "hidden";
    const start = performance.now();
    const dur = 1700;
    let id = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) id = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          setShow(false);
          document.body.style.overflow = "";
        }, 250);
    };
    id = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = "";
    };
  }, []);

  const ease = [0.76, 0, 0.24, 1] as const;
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[100]" aria-hidden="true" exit={{ pointerEvents: "none" }}>
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-[#05070d]"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.9, ease }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[#05070d]"
            exit={{ y: "100%" }}
            transition={{ duration: 0.9, ease }}
          />
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-[#e9eef7]"
            exit={{ opacity: 0, scale: 1.4, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-mono text-[11px] tracking-[0.3em] text-[#6b7a96]">
              {ticker[Math.min(ticker.length - 1, Math.floor(n / 21))]}
            </span>
            <span className="tabular font-semibold leading-none tracking-[-0.06em]" style={{ fontSize: "clamp(5rem, 18vw, 13rem)" }}>
              {n}
              <span className="text-[#4d8dff]">%</span>
            </span>
            <span className="h-px w-56 overflow-hidden bg-[#1f2c47]">
              <span className="block h-full bg-[#4d8dff] transition-[width] duration-75" style={{ width: `${n}%` }} />
            </span>
            <span className="font-mono text-[11px] tracking-[0.3em] text-[#6b7a96]">KUMAR VISHAL · PORTFOLIO</span>
          </motion.div>
          {/* split seam glow */}
          <motion.div
            className="absolute inset-x-0 top-1/2 h-px bg-[#4d8dff] shadow-[0_0_30px_6px_#4d8dff]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: n / 100 }}
            exit={{ opacity: 0 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
