"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, ExternalLink, Maximize2, X } from "lucide-react";
import { projects, type Project, type ProjectCategory } from "@/data/portfolio";
import { Section, SectionHeading } from "../ui/section";
import { Reveal } from "../ui/reveal";
import { Counter } from "../ui/counter";
import { VizFrame } from "../ui/viz-frame";
import { GitHubIcon } from "../ui/brand-icons";
import { ProjectVisualArt } from "./project-visuals";
import { GitHubShowcase } from "./github-showcase";

const filters: ("All" | ProjectCategory)[] = ["All", "Machine learning", "Analytics", "BI dashboards"];

function ProjectLinks({ p }: { p: Project }) {
  if (!p.repoUrl && !p.demoUrl) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {p.repoUrl && (
        <a
          href={p.repoUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[13.5px] font-medium text-fg transition-colors hover:border-soft hover:bg-panel-2"
        >
          <GitHubIcon className="size-4" />
          Code
        </a>
      )}
      {p.demoUrl && (
        <a
          href={p.demoUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-2 rounded-full bg-signal px-4 py-2 text-[13.5px] font-medium text-white transition-colors hover:bg-[#3b7cf0]"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          Live demo
        </a>
      )}
    </div>
  );
}

function Chips({ tech, max }: { tech: string[]; max?: number }) {
  const list = max ? tech.slice(0, max) : tech;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
      {list.map((t) => (
        <li key={t} className="rounded-md bg-ink/70 px-2.5 py-1 text-[12px] text-soft">
          {t}
        </li>
      ))}
      {max && tech.length > max && <li className="px-1.5 py-1 text-[12px] text-mute">+{tech.length - max}</li>}
    </ul>
  );
}

/* ---------- Interactive: how the pipeline picks a method by gap length ---------- */

const tiers = [
  { name: "Micro gap", method: "Linear interpolation", hue: "#4ade80", from: 0, to: 25 },
  { name: "Short gap", method: "LightGBM + RandomForest ensemble", hue: "#4d8dff", from: 25, to: 70 },
  { name: "Long gap", method: "Neighbour stations (inverse-distance)", hue: "#9d8cff", from: 70, to: 100 },
];

export function GapSimulator() {
  const [v, setV] = useState(45);
  const tier = tiers.find((t) => v >= t.from && v <= t.to) ?? tiers[0];
  // gap drawn proportionally inside a trace
  const g0 = 380 - v * 2.2;
  const g1 = 420 + v * 2.2;
  const N = 120;
  const yv = (i: number) => 60 - 22 * Math.sin(i / 9) - 8 * Math.sin(i / 2.7);
  const xv = (i: number) => (i / (N - 1)) * 800;
  const seg = (f: (x: number) => boolean) =>
    Array.from({ length: N }, (_, i) => i)
      .filter((i) => f(xv(i)))
      .map((i, k) => `${k ? "L" : "M"}${xv(i).toFixed(1)},${yv(i).toFixed(1)}`)
      .join("");

  return (
    <div className="flex h-full flex-col justify-center gap-6">
      <svg viewBox="0 0 800 120" className="h-auto w-full" role="img" aria-label={`${tier.name}: filled with ${tier.method}`}>
        <rect x={g0} y={4} width={g1 - g0} height={112} rx={8} fill={tier.hue} opacity={0.12} />
        <path d={seg((x) => x <= g0)} stroke="var(--color-soft)" strokeWidth={2} fill="none" />
        <path d={seg((x) => x >= g1)} stroke="var(--color-soft)" strokeWidth={2} fill="none" />
        <path
          d={seg((x) => x >= g0 && x <= g1)}
          stroke={tier.hue}
          strokeWidth={3}
          strokeDasharray="7 5"
          fill="none"
          className="viz-flow"
          style={{ transition: "stroke .3s" }}
        />
      </svg>

      <div>
        <label htmlFor="gap-len" className="flex items-center justify-between text-[12.5px] text-mute">
          <span>Drag: how long was the sensor offline?</span>
        </label>
        <input
          id="gap-len"
          type="range"
          data-cursor="Drag"
          min={2}
          max={100}
          value={v}
          onChange={(e) => setV(+e.target.value)}
          className="mt-3 w-full cursor-pointer accent-[var(--color-signal)]"
          aria-valuetext={tier.name}
        />
        <div className="mt-1 flex justify-between text-[11.5px] text-mute">
          <span>minutes</span>
          <span>hours</span>
          <span>days</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {tiers.map((t) => {
          const on = t === tier;
          return (
            <button
              key={t.name}
              type="button"
              onClick={() => setV(Math.round((t.from + t.to) / 2))}
              className={`rounded-xl border p-3 text-left transition-all ${on ? "bg-panel-2" : "border-line opacity-55 hover:opacity-90"}`}
              style={on ? { borderColor: t.hue } : undefined}
            >
              <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-fg">
                <span className="size-2 rounded-full" style={{ background: t.hue }} aria-hidden="true" />
                {t.name}
              </span>
              <span className="mt-1 block text-[11.5px] leading-snug text-soft">{t.method}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Detail dialog ---------- */

function ProjectDialog({ p, onClose }: { p: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/80 p-0 backdrop-blur-sm md:items-center md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`dlg-${p.id}`}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-line bg-panel md:rounded-3xl"
      >
        <div className="relative border-b border-line bg-deep p-6 md:p-8">
          {p.id === "telemetry" ? (
            <GapSimulator />
          ) : (
            <VizFrame className="aspect-[16/8]">
              <ProjectVisualArt kind={p.visual} />
            </VizFrame>
          )}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-line bg-ink/80 text-fg transition-colors hover:border-soft"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="p-6 md:p-9">
          <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-mute">
            <span className="rounded-full border border-line px-2.5 py-0.5">{p.category}</span>
            {p.context && <span>{p.context}</span>}
          </div>
          <h3 id={`dlg-${p.id}`} className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-fg md:text-3xl">
            {p.title}
          </h3>
          <p className="mt-2 text-[16px] text-soft">{p.tagline}</p>

          {(p.headline || p.metrics) && (
            <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
              {p.headline && (
                <div className="bg-panel p-4">
                  <dd className="font-mono text-2xl text-signal">
                    <Counter value={p.headline.value} />
                  </dd>
                  <dt className="mt-1 text-[12px] text-mute">{p.headline.label}</dt>
                </div>
              )}
              {p.metrics
                ?.filter((m) => !p.headline || m.value !== p.headline.value)
                .slice(0, p.headline ? 3 : 4)
                .map((m) => (
                  <div key={m.label} className="bg-panel p-4">
                    <dd className="font-mono text-2xl text-fg">
                      <Counter value={m.value} />
                    </dd>
                    <dt className="mt-1 text-[12px] text-mute">{m.label}</dt>
                  </div>
                ))}
            </dl>
          )}

          <ul className="mt-7 space-y-2.5">
            {p.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-[15px] leading-relaxed text-soft">
                <span className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-signal" aria-hidden="true" />
                {h}
              </li>
            ))}
          </ul>

          {p.screenshots && p.screenshots.length > 0 && (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {p.screenshots.map((s) => (
                <a key={s.src} href={s.src} target="_blank" rel="noreferrer" className="relative block aspect-video overflow-hidden rounded-xl border border-line">
                  <Image src={s.src} alt={s.alt} fill sizes="(min-width: 768px) 360px, 90vw" className="object-cover transition-transform duration-500 hover:scale-105" />
                </a>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <Chips tech={p.tech} />
            <ProjectLinks p={p} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Cards ---------- */

function FeaturedCard({ p, onOpen }: { p: Project; onOpen: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 35%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0.88, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [reduce ? 28 : 60, 28]);
  return (
    <Reveal>
      <motion.article
        ref={ref}
        style={{ scale, borderRadius: radius }}
        id={`project-${p.id}`}
        className="grid overflow-hidden rounded-[28px] border border-line bg-panel/70 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]"
      >
        <div className="relative border-b border-line bg-deep p-6 md:p-9 lg:border-b-0 lg:border-r">
          <span className="absolute left-6 top-5 rounded-full bg-[#4ade80]/10 px-2.5 py-0.5 text-[11.5px] text-[#4ade80] md:left-9">
            ● Live in production
          </span>
          <div className="pt-8">
            <GapSimulator />
          </div>
        </div>
        <div className="flex flex-col p-7 md:p-9">
          {p.context && <p className="text-[13px] text-mute">{p.context}</p>}
          <h3 className="mt-1.5 text-2xl font-semibold leading-tight tracking-[-0.025em] text-fg md:text-[2rem]">{p.title}</h3>
          <p className="mt-3 text-[15.5px] text-soft">{p.tagline}</p>

          <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
            {[...(p.headline ? [p.headline] : []), ...(p.metrics ?? []).filter((m) => m.value !== p.headline?.value)]
              .slice(0, 4)
              .map((m, i) => (
                <div key={m.label} className="bg-panel p-4">
                  <dd className={`text-[1.75rem] font-semibold leading-none tracking-[-0.03em] ${i === 0 ? "text-signal" : "text-fg"}`}>
                    <Counter value={m.value} />
                  </dd>
                  <dt className="mt-2 text-[12px] text-mute">{m.label}</dt>
                </div>
              ))}
          </dl>

          <div className="mt-6">
            <Chips tech={p.tech} />
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
            <button
              type="button"
              onClick={onOpen}
              className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-[14px] font-medium text-ink transition-colors hover:bg-white"
            >
              <Maximize2 className="size-4" aria-hidden="true" />
              How it works
            </button>
            <ProjectLinks p={p} />
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}

function ProjectCard({ p, onOpen, i }: { p: Project; onOpen: () => void; i: number }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 20 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 200, damping: 20 });
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };
  return (
    <motion.div
      layout={!reduce}
      className="h-full [perspective:900px]"
      initial={reduce ? false : { opacity: 0, y: 60, rotateX: 18, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 120, damping: 20, delay: (i % 3) * 0.12 }}
    >
    <motion.article
      id={`project-${p.id}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={reduce ? undefined : { rotateX: rotX, rotateY: rotY, transformPerspective: 900 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-panel/70 transition-colors duration-300 hover:border-signal/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-deep">
        <VizFrame className="absolute inset-0 p-5 transition-transform duration-700 group-hover:scale-[1.06]">
          <ProjectVisualArt kind={p.visual} />
        </VizFrame>
        {p.headline && (
          <div className="absolute bottom-3 left-3 rounded-xl border border-line bg-ink/85 px-3 py-2 backdrop-blur">
            <span className="block text-[1.35rem] font-semibold leading-none tracking-[-0.03em] text-fg">
              <Counter value={p.headline.value} />
            </span>
            <span className="mt-1 block text-[11px] uppercase tracking-[0.08em] text-mute">{p.headline.label}</span>
          </div>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-0.5 text-[11px] text-soft backdrop-blur">{p.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[1.1rem] font-semibold leading-snug tracking-[-0.02em] text-fg">
          <button type="button" onClick={onOpen} className="text-left after:absolute after:inset-0 after:content-['']">
            {p.title}
          </button>
        </h3>
        <p className="mt-1.5 text-[14px] leading-snug text-soft">{p.tagline}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <Chips tech={p.tech} max={3} />
          <ArrowUpRight
            className="size-5 shrink-0 text-mute transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal"
            aria-hidden="true"
          />
        </div>
      </div>
    </motion.article>
    </motion.div>
  );
}

export function Projects() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const featured = projects.find((p) => p.featured);
  const rest = useMemo(
    () => projects.filter((p) => !p.featured && (filter === "All" || p.category === filter)),
    [filter],
  );
  const open = projects.find((p) => p.id === openId);
  const close = useCallback(() => setOpenId(null), []);

  return (
    <Section id="projects">
      <SectionHeading id="projects" index="03" title="Projects" lede="Numbers first. Drag, hover, click — everything here moves." />

      {featured && <FeaturedCard p={featured} onOpen={() => setOpenId(featured.id)} />}

      <div className="mt-14 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
        {filters.map((f) => {
          const n = f === "All" ? projects.length - 1 : projects.filter((p) => !p.featured && p.category === f).length;
          const on = f === filter;
          return (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 text-[13.5px] transition-colors ${
                on ? "border-fg bg-fg text-ink" : "border-line text-soft hover:border-line-strong hover:text-fg"
              }`}
            >
              {f} <span className={`tabular ml-1 ${on ? "text-ink/60" : "text-mute"}`}>{n}</span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {rest.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} onOpen={() => setOpenId(p.id)} />
          ))}
        </AnimatePresence>
      </motion.div>

      <p className="mt-5 text-[12px] text-mute">Card art is illustrative — it shows the kind of analysis, not the actual results.</p>

      <AnimatePresence>{open && <ProjectDialog p={open} onClose={close} />}</AnimatePresence>

      <GitHubShowcase />
    </Section>
  );
}
