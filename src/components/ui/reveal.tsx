"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "up" | "left" | "right" | "zoom";

const from: Record<Variant, Record<string, number | string>> = {
  up: { opacity: 0, y: 36, filter: "blur(8px)" },
  left: { opacity: 0, x: -48, filter: "blur(8px)" },
  right: { opacity: 0, x: 48, filter: "blur(8px)" },
  zoom: { opacity: 0, scale: 0.9, filter: "blur(8px)" },
};

/** Scroll reveal: rise + un-blur. Respects reduced motion. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  variant = "up",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "article";
  variant?: Variant;
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? false : from[variant]}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Comp>
  );
}
