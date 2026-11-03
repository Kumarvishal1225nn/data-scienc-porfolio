"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "./reveal";

export function Section({
  id,
  children,
  tone = "ink",
  className = "",
}: {
  id: string;
  children: ReactNode;
  tone?: "ink" | "deep";
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`relative py-24 md:py-32 ${tone === "deep" ? "bg-deep" : "bg-ink"} ${className}`}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

/** Heading whose words rise out of a mask, with a line that draws in. */
export function SectionHeading({
  id,
  index,
  title,
  lede,
}: {
  id: string;
  index: string;
  title: string;
  lede?: string;
}) {
  const reduce = useReducedMotion();
  const words = title.split(" ");
  return (
    <div className="mb-14 md:mb-20">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-end">
        <div className="flex items-baseline gap-4">
          <motion.span
            className="tabular text-sm text-signal"
            aria-hidden="true"
            initial={reduce ? false : { opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.6 }}
          >
            {index}
          </motion.span>
          <h2
            id={`${id}-title`}
            aria-label={title}
            className="text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.03em] text-fg md:text-5xl"
          >
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden="true">
                <motion.span
                  className="inline-block"
                  initial={reduce ? false : { y: "110%", rotate: 4 }}
                  whileInView={{ y: "0%", rotate: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 + i * 0.08 }}
                >
                  {w}
                  {i < words.length - 1 ? " " : ""}
                </motion.span>
              </span>
            ))}
          </h2>
        </div>
        {lede ? (
          <Reveal delay={0.25} className="max-w-[52ch] text-[1.0625rem] leading-relaxed text-soft md:justify-self-end">
            <p>{lede}</p>
          </Reveal>
        ) : null}
      </div>
      <motion.div
        aria-hidden="true"
        className="mt-8 h-px origin-left bg-gradient-to-r from-signal via-line-strong to-transparent"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />
    </div>
  );
}
