"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Glowing cursor: a dot plus a lagging ring. The ring swells over anything
 * clickable and shows a label from [data-cursor="..."]. Mouse devices only.
 */
export function Cursor() {
  const [on, setOn] = useState(false);
  const [hot, setHot] = useState(false);
  const [label, setLabel] = useState("");
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setOn(true);
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = (e.target as HTMLElement | null)?.closest?.("[data-cursor], a, button, input, [role=tab]") as HTMLElement | null;
      setHot(!!t);
      setLabel(t?.dataset.cursor ?? "");
    };
    const d = () => setDown(true);
    const u = () => setDown(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", d);
    window.addEventListener("pointerup", u);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", d);
      window.removeEventListener("pointerup", u);
    };
  }, [x, y]);

  if (!on) return null;
  const size = label ? 84 : hot ? 54 : 34;
  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[200] grid place-items-center rounded-full border border-signal/70 mix-blend-normal"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: size,
          backgroundColor: label ? "rgba(77,141,255,0.92)" : hot ? "rgba(77,141,255,0.12)" : "rgba(77,141,255,0)",
          scale: down ? 0.8 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        {label && <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white">{label}</span>}
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[201] size-1.5 rounded-full bg-signal shadow-[0_0_12px_2px_var(--color-signal)]"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: label ? 0 : 1 }}
      />
    </>
  );
}
