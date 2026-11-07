"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

/**
 * Ticker that drifts on its own and speeds up / reverses with scroll speed.
 */
export function ScrollMarquee({ items, speed = 2.2, reverse = false }: { items: string[]; speed?: number; reverse?: boolean }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [-2000, 0, 2000], [-5, 0, 5], { clamp: false });
  const dir = useRef(reverse ? -1 : 1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = dir.current * speed * (delta / 1000);
    const b = boost.get();
    if (b < 0) dir.current = reverse ? 1 : -1;
    else if (b > 0) dir.current = reverse ? -1 : 1;
    move += dir.current * move * Math.abs(b);
    // wrap within one copy (25% of 4 copies)
    let next = x.get() - move;
    if (next <= -25) next += 25;
    if (next > 0) next -= 25;
    x.set(next);
  });

  const transform = useTransform(x, (v) => `translateX(${v}%)`);
  const row = [...items, ...items, ...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-line bg-ink py-5" aria-hidden="true">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
      <motion.div className="flex w-max gap-10 whitespace-nowrap" style={{ transform }}>
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 text-[1.6rem] font-semibold tracking-[-0.02em] text-fg/80 md:text-[2.2rem]">
            {t}
            <span className="size-2 rounded-full bg-signal" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
