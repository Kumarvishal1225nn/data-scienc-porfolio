"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { projects, type Project, type ProjectCategory } from "@/data/portfolio";
import { Counter } from "../ui/counter";
import { VizFrame } from "../ui/viz-frame";
import { GitHubIcon } from "../ui/brand-icons";
import { ProjectVisualArt } from "./project-visuals";
import { GapSimulator } from "./projects";
import { GitHubShowcase } from "./github-showcase";
import { SectionHeading } from "../ui/section";

type Door = {
  id: string;
  label: string;
  plaque: string;
  color: string;
  shade: string;
  blurb: string;
  category?: ProjectCategory;
  github?: boolean;
};

const doors: Door[] = [
  { id: "ml", label: "Machine Learning", plaque: "ML LAB", color: "#2f5fd0", shade: "#1f3f94", blurb: "Models that forecast, fill gaps and classify.", category: "Machine learning" },
  { id: "analytics", label: "Analytics", plaque: "ANALYTICS", color: "#5c8f73", shade: "#3d6650", blurb: "SQL and graphs that find the story in the data.", category: "Analytics" },
  { id: "bi", label: "BI Dashboards", plaque: "DASHBOARDS", color: "#d9682c", shade: "#a34a1b", blurb: "Dashboards managers read in five seconds.", category: "BI dashboards" },
  { id: "github", label: "Open Source", plaque: "GITHUB", color: "#2a2f3d", shade: "#171a23", blurb: "Code and notebooks, live from GitHub.", github: true },
];

const projectsFor = (d: Door) => (d.category ? projects.filter((p) => p.category === d.category) : []);

/* ---------- a single door ---------- */

function DoorArt({ d, ajar, open }: { d: Door; ajar: boolean; open: boolean }) {
  const angle = open ? -105 : ajar ? -32 : 0;
  return (
    <div className="relative aspect-[5/9] w-full [perspective:900px]">
      {/* frame */}
      <div className="absolute -inset-2 rounded-t-full border-[6px] border-b-0 border-line-strong/70 bg-transparent" />
      {/* room behind the door */}
      <div className="absolute inset-0 overflow-hidden rounded-t-full bg-[#06070b]">
        <motion.div
          className="absolute inset-x-0 bottom-0 h-3/4"
          style={{ background: `radial-gradient(ellipse at 50% 100%, ${d.color}aa, transparent 70%)` }}
          animate={{ opacity: ajar || open ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="absolute left-1/2 top-[28%] h-[2px] w-[40%] -translate-x-1/2 rounded-full bg-[#ffe6a8] blur-[1px]"
          animate={{ opacity: ajar || open ? [0.4, 1, 0.7, 1] : 0 }}
          transition={{ duration: 1.4, repeat: ajar ? Infinity : 0 }}
        />
      </div>
      {/* leaf */}
      <motion.div
        className="absolute inset-0 origin-left rounded-t-full shadow-[inset_-10px_0_20px_#0004]"
        style={{ background: `linear-gradient(100deg, ${d.color} 0%, ${d.color} 60%, ${d.shade} 100%)`, transformStyle: "preserve-3d" }}
        animate={{ rotateY: angle }}
        transition={{ type: "spring", stiffness: open ? 60 : 120, damping: open ? 14 : 16 }}
      >
        {/* panels */}
        <div className="absolute inset-x-[14%] top-[16%] h-[30%] rounded-t-full border-2 border-black/15" />
        <div className="absolute inset-x-[14%] bottom-[8%] h-[38%] rounded-md border-2 border-black/15" />
        {/* plaque */}
        <div className="absolute left-1/2 top-[50%] -translate-x-1/2 rounded-sm bg-[#e8c34a] px-2 py-1 text-[9px] font-bold tracking-[0.12em] text-[#3a2c05] shadow-md sm:text-[10px]">
          {d.plaque}
        </div>
        {/* knob */}
        <div className="absolute right-[12%] top-[60%] size-3 rounded-full bg-[#e8c34a] shadow-[0_0_0_2px_#0003]" />
      </motion.div>
      {/* floor light spill */}
      <motion.div
        className="pointer-events-none absolute -bottom-6 left-1/2 h-6 w-[120%] -translate-x-1/2 rounded-[50%] blur-md"
        style={{ background: d.color }}
        animate={{ opacity: ajar || open ? 0.55 : 0 }}
      />
    </div>
  );
}

/* ---------- the room behind a door ---------- */

function RoomCard({ p, i }: { p: Project; i: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      className="sticky rounded-[28px] border border-line bg-panel shadow-[0_-20px_60px_-30px_#000c]"
      style={{ top: `${96 + i * 22}px` }}
      initial={reduce ? false : { opacity: 0, y: 80, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: "spring", stiffness: 90, damping: 18 }}
    >
      <div className="grid overflow-hidden rounded-[28px] md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="relative border-b border-line bg-deep p-6 md:border-b-0 md:border-r md:p-8">
          {p.id === "telemetry" ? (
            <GapSimulator />
          ) : (
            <VizFrame className="aspect-[16/10]">
              <ProjectVisualArt kind={p.visual} />
            </VizFrame>
          )}
        </div>
        <div className="flex flex-col p-6 md:p-8">
          {p.context && <p className="text-[12.5px] text-mute">{p.context}</p>}
          <h3 className="mt-1 text-2xl font-semibold tracking-[-0.025em] text-fg md:text-[1.9rem]">{p.title}</h3>
          <p className="mt-2 text-[15px] text-soft">{p.tagline}</p>
          {(p.headline || p.metrics) && (
            <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
              {[...(p.headline ? [p.headline] : []), ...(p.metrics ?? []).filter((m) => m.value !== p.headline?.value)].slice(0, 3).map((m, k) => (
                <div key={m.label}>
                  <dd className={`text-[1.7rem] font-semibold leading-none tracking-[-0.03em] ${k === 0 ? "text-signal" : "text-fg"}`}>
                    <Counter value={m.value} />
                  </dd>
                  <dt className="mt-1.5 text-[12px] text-mute">{m.label}</dt>
                </div>
              ))}
            </dl>
          )}
          <ul className="mt-5 space-y-2">
            {p.highlights.map((h) => (
              <li key={h} className="flex gap-2.5 text-[14px] leading-snug text-soft">
                <span className="mt-[0.5em] size-1.5 shrink-0 rounded-full bg-signal" aria-hidden="true" />
                {h}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
            <ul className="flex flex-wrap gap-1.5">
              {p.tech.map((t) => (
                <li key={t} className="rounded-md bg-ink/70 px-2.5 py-1 text-[12px] text-soft">{t}</li>
              ))}
            </ul>
            <div className="flex gap-2">
              {p.repoUrl && (
                <a href={p.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-1.5 text-[13px] text-fg hover:bg-panel-2">
                  <GitHubIcon className="size-3.5" /> Code
                </a>
              )}
              {p.demoUrl && (
                <a href={p.demoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-signal px-3.5 py-1.5 text-[13px] text-white">
                  <ExternalLink className="size-3.5" aria-hidden="true" /> Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function Room({ d, origin, onClose }: { d: Door; origin: DOMRect | null; onClose: () => void }) {
  const reduce = useReducedMotion();
  const backRef = useRef<HTMLButtonElement>(null);
  const list = projectsFor(d);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => backRef.current?.focus(), 500);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Start the "room" clipped to the doorway, then expand to the whole screen.
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const from = origin
    ? `inset(${origin.top}px ${vw - origin.right}px ${vh - origin.bottom}px ${origin.left}px round ${origin.width / 2}px ${origin.width / 2}px 0 0)`
    : "inset(50% 50% 50% 50%)";

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${d.label} projects`}
      className="fixed inset-0 z-[70] overflow-y-auto bg-ink"
      initial={reduce ? { opacity: 0 } : { clipPath: from }}
      animate={reduce ? { opacity: 1 } : { clipPath: "inset(0px 0px 0px 0px round 0px 0px 0 0)" }}
      exit={reduce ? { opacity: 0 } : { clipPath: from, transition: { duration: 0.55, ease: [0.65, 0, 0.35, 1] } }}
      transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1], delay: reduce ? 0 : 0.35 }}
    >
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-[60vh] opacity-30"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${d.color}, transparent 70%)` }}
        aria-hidden="true"
      />
      <div className="container-page relative pb-32 pt-8">
        <div className="sticky top-0 z-20 -mx-5 flex items-center justify-between bg-ink/80 px-5 py-4 backdrop-blur md:-mx-8 md:px-8">
          <button
            ref={backRef}
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-panel px-4 py-2 text-[13.5px] text-fg transition-colors hover:border-soft"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to the doors
          </button>
          <span className="rounded-sm px-2 py-1 text-[10px] font-bold tracking-[0.14em]" style={{ background: "#e8c34a", color: "#3a2c05" }}>
            {d.plaque}
          </span>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : 0.9, duration: 0.6 }}
          className="mb-12 mt-10 md:mb-16 md:mt-16"
        >
          <h2 className="text-[2.8rem] font-semibold leading-none tracking-[-0.04em] text-fg md:text-[4.5rem]">{d.label}</h2>
          <p className="mt-4 text-[1.1rem] text-soft">{d.blurb}</p>
          {list.length > 0 && <p className="mt-2 text-[13px] text-mute">{list.length} projects · scroll ↓</p>}
        </motion.div>

        {d.github ? (
          <div className="-mt-24">
            <GitHubShowcase />
          </div>
        ) : (
          <div className="space-y-8">
            {list.map((p, i) => (
              <RoomCard key={p.id} p={p} i={i} />
            ))}
          </div>
        )}

        <div className="mt-20 text-center">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-[14px] font-medium text-ink transition-opacity hover:opacity-85"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> Back to the doors
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- section ---------- */

export function Doors() {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<string>(doors[0].id);
  const [opening, setOpening] = useState<string | null>(null);
  const [room, setRoom] = useState<{ d: Door; rect: DOMRect | null } | null>(null);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const active = doors.find((d) => d.id === hover) ?? doors[0];
  const preview = projectsFor(active);

  const enter = (d: Door) => {
    setOpening(d.id);
    const rect = refs.current[d.id]?.querySelector("[data-door]")?.getBoundingClientRect() ?? null;
    setTimeout(() => setRoom({ d, rect }), reduce ? 0 : 380);
  };
  const close = useCallback(() => {
    setRoom(null);
    setTimeout(() => setOpening(null), 300);
  }, []);

  return (
    <section id="doors" aria-labelledby="doors-title" className="relative overflow-hidden bg-deep py-24 md:py-32">
      <div className="container-page">
        <SectionHeading id="doors" index="02" title="Magic happens behind the doors" lede="Hover a door to peek. Click to walk in." />

        <div className="grid grid-cols-2 gap-x-6 gap-y-14 sm:grid-cols-4 md:gap-x-10">
          {doors.map((d, i) => {
            const ajar = hover === d.id || opening === d.id;
            return (
              <motion.button
                key={d.id}
                ref={(el) => {
                  refs.current[d.id] = el;
                }}
                type="button"
                onMouseEnter={() => setHover(d.id)}
                onFocus={() => setHover(d.id)}
                onClick={() => enter(d)}
                aria-label={`Open the ${d.label} door`}
                className="group flex flex-col items-center gap-5 outline-none"
                initial={reduce ? false : { opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ type: "spring", stiffness: 110, damping: 16, delay: i * 0.12 }}
              >
                <div data-door className="w-full max-w-[200px]">
                  <DoorArt d={d} ajar={ajar} open={opening === d.id} />
                </div>
                <span className={`text-[14px] font-medium transition-colors ${ajar ? "text-fg" : "text-mute"}`}>{d.label}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="mx-auto mt-12 min-h-[150px] max-w-3xl" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="rounded-3xl border border-line bg-panel/70 p-6 md:p-7"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.14em]" style={{ color: active.color === "#2a2f3d" ? "var(--color-soft)" : active.color }}>
                    Behind this door
                  </p>
                  <h3 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-fg">{active.label}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => enter(active)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-fg px-4 py-2 text-[13px] font-medium text-ink transition-opacity hover:opacity-85"
                >
                  Walk in <ArrowUpRight className="size-4" aria-hidden="true" />
                </button>
              </div>
              {active.github ? (
                <p className="mt-4 text-[14px] text-soft">{active.blurb}</p>
              ) : (
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {preview.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-ink/50 px-3.5 py-2.5">
                      <span className="truncate text-[14px] text-fg">{p.title}</span>
                      {p.headline && <span className="tabular shrink-0 text-[12.5px] text-signal">{p.headline.value}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>{room && <Room key={room.d.id} d={room.d} origin={room.rect} onClose={close} />}</AnimatePresence>
    </section>
  );
}
