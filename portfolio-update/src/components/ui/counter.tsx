"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/**
 * Counts up to a value when scrolled into view.
 * Accepts strings like "143", "100,000", "10K+", "0.9911", "29".
 * Prefix/suffix text (K, +, %, months) is kept as-is.
 */
export function Counter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const match = value.match(/^([^0-9]*)([0-9][0-9,]*\.?[0-9]*)(.*)$/);
  const [shown, setShown] = useState(reduce || !match ? value : value.replace(/[0-9]/g, "0"));

  useEffect(() => {
    if (!inView || reduce || !match) {
      if (inView) setShown(value);
      return;
    }
    const [, pre, num, post] = match;
    const decimals = num.includes(".") ? num.split(".")[1].length : 0;
    const commas = num.includes(",");
    const target = parseFloat(num.replace(/,/g, ""));
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        const n = decimals ? v.toFixed(decimals) : Math.round(v).toString();
        const out = commas ? Number(n).toLocaleString("en-US", { minimumFractionDigits: decimals }) : n;
        setShown(`${pre}${out}${post}`);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={`tabular ${className ?? ""}`} aria-label={value}>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
