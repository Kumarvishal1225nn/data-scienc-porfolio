"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

/* Verified numbers only. */
const stats = [
  { value: "143", label: "IoT weather stations", sub: "kept online by my gap-filling pipeline" },
  { value: "100,000", label: "vehicle records", sub: "segmented, scored and forecast" },
  { value: "10K+", label: "sales transactions", sub: "queried in SQL for KPIs" },
  { value: "263", label: "NYC taxi zones", sub: "mapped as a graph in Neo4j" },
  { value: "0.991", label: "R² score", sub: "on reconstructed sensor data" },
];

function Stat({ s, i, progress }: { s: (typeof stats)[number]; i: number; progress: MotionValue<number> }) {
  const n = stats.length;
  const a = i / n;
  const b = (i + 1) / n;
  const mid = (a + b) / 2;
  const scale = useTransform(progress, [a, mid, b], [0.35, 1, 2.6]);
  const opacity = useTransform(progress, [a, a + 0.04, b - 0.05, b], [0, 1, 1, 0]);
  const blur = useTransform(progress, [a, mid, b - 0.02, b], ["blur(14px)", "blur(0px)", "blur(0px)", "blur(18px)"]);
  const y = useTransform(progress, [a, mid], ["40%", "0%"]);
  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ opacity }}>
      <motion.span
        className="tabular block font-semibold leading-none tracking-[-0.06em] text-fg"
        style={{ scale, filter: blur, y, fontSize: "clamp(4.5rem, 17vw, 15rem)" }}
      >
        {s.value}
      </motion.span>
      <motion.span className="mt-6 block text-[1.2rem] font-medium text-signal md:text-[1.6rem]" style={{ y }}>
        {s.label}
      </motion.span>
      <span className="mt-2 block text-[14px] text-mute">{s.sub}</span>
    </motion.div>
  );
}

export function ByTheNumbers() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const ring = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (reduce) {
    return (
      <section aria-label="By the numbers" className="bg-ink py-20">
        <ul className="container-page grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((s) => (
            <li key={s.label}>
              <span className="block text-5xl font-semibold text-fg">{s.value}</span>
              <span className="mt-2 block text-signal">{s.label}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section ref={ref} aria-label="By the numbers" className="relative bg-ink" style={{ height: `${stats.length * 85 + 40}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* spinning measurement rings */}
        <motion.svg viewBox="0 0 600 600" className="absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 opacity-60" style={{ rotate }} aria-hidden="true">
          <circle cx="300" cy="300" r="280" fill="none" stroke="var(--color-line)" strokeDasharray="2 10" />
          <circle cx="300" cy="300" r="220" fill="none" stroke="var(--color-line)" />
          <motion.circle cx="300" cy="300" r="250" fill="none" stroke="var(--color-signal)" strokeWidth="2" style={{ pathLength: ring }} />
          {Array.from({ length: 60 }).map((_, k) => (
            <line key={k} x1="300" y1="14" x2="300" y2={k % 5 ? 24 : 34} stroke="var(--color-line-strong)" transform={`rotate(${k * 6} 300 300)`} />
          ))}
        </motion.svg>
        <p className="absolute left-1/2 top-24 -translate-x-1/2 font-mono text-[12px] uppercase tracking-[0.3em] text-mute">By the numbers</p>
        {stats.map((s, i) => (
          <Stat key={s.label} s={s} i={i} progress={scrollYProgress} />
        ))}
        <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2">
          {stats.map((s, i) => (
            <Dot key={s.label} i={i} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Dot({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const n = stats.length;
  const w = useTransform(progress, [i / n, (i + 0.5) / n, (i + 1) / n], [8, 28, 8]);
  const o = useTransform(progress, [i / n, (i + 0.5) / n, (i + 1) / n], [0.3, 1, 0.3]);
  return <motion.span className="h-2 rounded-full bg-signal" style={{ width: w, opacity: o }} />;
}
