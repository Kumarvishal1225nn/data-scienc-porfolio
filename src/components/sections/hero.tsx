"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Download } from "lucide-react";
import { siteConfig } from "@/config/site";
import { SignalTrace } from "./signal-trace";
import { Counter } from "../ui/counter";

const roles = ["Data Analyst", "Business Analyst", "ML Engineer"];

/* Verified numbers only — each comes from a project on this page. */
const stats = [
  { value: "143", label: "IoT sensors in production" },
  { value: "100,000", label: "rows modelled" },
  { value: "10K+", label: "sales transactions" },
  { value: "0.991", label: "R² on sensor gaps" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const photoRotate = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 4]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0.15]);
  const traceScale = useTransform(scrollYProgress, [0, 0.6], [1, reduce ? 1 : 0.94]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 160]);

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section ref={ref} id="home" aria-label="Introduction" className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36">
      <motion.div style={{ y: gridY }} className="grid-field pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-signal/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="container-page relative">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <motion.div style={{ y: textY, opacity: fade }}>
            <motion.p {...enter(0)} className="text-[15px] text-soft">
              Hello, I&apos;m Vishal.
            </motion.p>

            <motion.h1
              {...enter(0.08)}
              className="mt-5 text-[3.1rem] font-semibold leading-[0.98] tracking-[-0.045em] text-fg sm:text-[4.2rem] lg:text-[5.4rem]"
            >
              Turning data
              <br />
              into decisions.
            </motion.h1>

            <motion.p {...enter(0.18)} className="mt-6 text-[1.05rem] text-soft">
              MS Data Science &amp; Management · <span className="text-fg">IIT Ropar × IIM Amritsar</span>
            </motion.p>

            <motion.ul {...enter(0.26)} className="mt-6 flex flex-wrap gap-2" aria-label="Roles">
              {roles.map((r) => (
                <li key={r} className="rounded-full border border-line-strong px-3.5 py-1.5 text-[13px] text-soft">
                  {r}
                </li>
              ))}
            </motion.ul>

            <motion.dl {...enter(0.3)} className="mt-9 grid max-w-[560px] grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
              {stats.map((st) => (
                <div key={st.label} className="border-l border-line-strong pl-3.5">
                  <dd className="text-[1.65rem] font-semibold leading-none tracking-[-0.03em] text-fg">
                    <Counter value={st.value} />
                  </dd>
                  <dt className="mt-1.5 text-[12px] leading-snug text-mute">{st.label}</dt>
                </div>
              ))}
            </motion.dl>

            <motion.div {...enter(0.34)} className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 text-[14.5px] font-medium text-white transition-colors hover:bg-[#3b7cf0]"
              >
                Explore my work
              </a>
              <a
                href={siteConfig.resumePath}
                download
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-[14.5px] font-medium text-fg transition-colors hover:border-soft hover:bg-panel"
              >
                <Download className="size-4" aria-hidden="true" />
                Download resume
              </a>
            </motion.div>
          </motion.div>

          <motion.div {...enter(0.15)} style={{ y: photoY, rotate: photoRotate }} className="relative mx-auto w-full max-w-[460px] lg:max-w-none">
            {/*
              PROFILE PHOTO — replace /public/images/profile.jpg
              (or change siteConfig.profileImage). Portrait or square works best.
            */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-line bg-panel">
              <Image
                src={siteConfig.profileImage}
                alt="Portrait of Kumar Vishal"
                fill
                priority
                sizes="(min-width: 1024px) 460px, 90vw"
                className="object-cover object-[50%_20%]"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/80 to-transparent" aria-hidden="true" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[15px] font-medium text-white">Kumar Vishal</p>
                  <p className="text-[13px] text-white/70">MS DSM · IIT Ropar × IIM Amritsar</p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-ink/70 px-3 py-1 text-[12px] text-white/85 backdrop-blur">
                  <span className="size-1.5 animate-blink rounded-full bg-[#4ade80]" aria-hidden="true" />
                  Open to roles
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div {...enter(0.45)} style={{ scale: traceScale }} className="mt-14 md:mt-20">
          <SignalTrace />
        </motion.div>

        <a
          href="#journey"
          className="mx-auto mt-12 flex w-fit flex-col items-center gap-2 text-[12.5px] text-mute transition-colors hover:text-soft"
        >
          Scroll
          <motion.span
            animate={reduce ? undefined : { y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="size-4" aria-hidden="true" />
          </motion.span>
        </a>
      </div>
    </section>
  );
}
