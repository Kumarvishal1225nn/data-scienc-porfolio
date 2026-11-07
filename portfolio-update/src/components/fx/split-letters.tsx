"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Letters flip up in 3D one after another. */
export function SplitLetters({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={`inline-block [perspective:600px] ${className}`} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block origin-bottom"
          initial={reduce ? false : { opacity: 0, y: "0.6em", rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 14, delay: delay + i * 0.035 }}
          whileHover={reduce ? undefined : { y: "-0.12em", color: "var(--color-signal)", transition: { duration: 0.15 } }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}
