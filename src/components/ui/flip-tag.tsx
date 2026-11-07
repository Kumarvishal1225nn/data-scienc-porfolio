"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/** A spiral-bound note that flips over to the next role every few seconds. */
export function FlipTag({ words, interval = 2400 }: { words: string[]; interval?: number }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [reduce, words.length, interval]);

  return (
    <span className="relative inline-block [perspective:700px]" aria-live="polite">
      {/* spiral rings */}
      <span className="absolute -top-2.5 left-4 right-4 z-10 flex justify-between" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, k) => (
          <span key={k} className="h-4 w-1.5 rounded-full border border-mute bg-ink" />
        ))}
      </span>
      {/* stacked sheets behind */}
      <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 -rotate-[1.5deg] rounded-lg border border-line-strong bg-panel-2" aria-hidden="true" />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          initial={reduce ? false : { rotateX: -95, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={reduce ? undefined : { rotateX: 95, opacity: 0, y: -6 }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
          style={{ transformOrigin: "50% 0%" }}
          className="relative block -rotate-[1.5deg] rounded-lg border border-line-strong bg-panel px-5 pb-3 pt-4 text-fg shadow-[0_18px_40px_-18px_#0008]"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
