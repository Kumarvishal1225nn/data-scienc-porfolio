"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Briefcase, FlaskConical, GraduationCap, Hotel, School, Target, type LucideIcon } from "lucide-react";
import { ParallaxPhoto } from "../ui/parallax-photo";

type Stop = {
  year: string;
  date?: string;
  title: string;
  org: string;
  points?: string[];
  icon: LucideIcon;
  tone?: "now" | "next";
  photo?: { src: string; alt: string; position?: string };
};

/* Newest first — we travel back in time. Only verified dates are shown. */
const stops: Stop[] = [
  {
    year: "2027",
    title: "Next stop: analytics & ML roles",
    org: "Data Analyst · Business Analyst · ML Engineer",
    points: ["Open to full-time roles after graduation"],
    icon: Target,
    tone: "next",
  },
  {
    year: "2026",
    date: "May – Jul 2026",
    title: "Data Analyst Intern",
    org: "Annam.AI, IIT Ropar",
    points: ["Production pipeline for ~143 IoT weather stations", "3-tier gap filling · AWS Fargate · 26-page design doc"],
    icon: Briefcase,
    photo: { src: "/images/experience/annam.jpg", alt: "Vishal at the Annam.AI office, IIT Ropar", position: "60% 45%" },
  },
  {
    year: "2026",
    date: "Summer",
    title: "Summer Research Intern",
    org: "IIT Ropar · Prof. Abhilasha Nanda",
    icon: FlaskConical,
    photo: { src: "/images/experience/iit-ropar-research.jpg", alt: "Vishal with Prof. Abhilasha Nanda at IIT Ropar", position: "50% 30%" },
  },
  {
    year: "2025",
    date: "Dec 2025 – Jan 2026",
    title: "AI & Data Science Trainee",
    org: "C-DAC Patna",
    points: ["Python, Pandas, NumPy, EDA, ML", "Built an NLP sentiment classifier"],
    icon: School,
  },
  {
    year: "2025",
    date: "2025 – 2027",
    title: "MS Data Science & Management",
    org: "IIT Ropar × IIM Amritsar",
    points: ["Machine learning + statistics, paired with management"],
    icon: GraduationCap,
    tone: "now",
  },
  {
    year: "2025",
    title: "Intern",
    org: "Bharat Space Education Research Centre",
    icon: FlaskConical,
  },
  {
    year: "2022",
    date: "Jul 2022 – Dec 2024 · 29 months",
    title: "Assistant Manager",
    org: "A.R. Hotel & Restaurant",
    points: ["Ran kitchen, service and front-desk operations", "Forecast stock demand · root-cause analysis of complaints"],
    icon: Hotel,
  },
  {
    year: "2018",
    date: "2018 – 2022",
    title: "B.Tech, Computer Science",
    org: "Lovely Professional University",
    icon: GraduationCap,
  },
];

function RollingYear({ year }: { year: string }) {
  const reduce = useReducedMotion();
  return (
    <span className="relative inline-flex overflow-hidden" aria-live="polite">
      {year.split("").map((ch, i) => (
        <span key={i} className="relative inline-block h-[1em] w-[0.62em] overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`${i}-${ch}`}
              className="absolute inset-0 text-center"
              initial={reduce ? false : { y: "-100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={reduce ? undefined : { y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 22, delay: i * 0.04 }}
            >
              {ch}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}

export function TimeMachine() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 60%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.idx));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    itemRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const cur = stops[active];

  return (
    <section id="journey" aria-labelledby="journey-title" className="relative overflow-x-clip bg-ink py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: "radial-gradient(ellipse at 20% 30%, var(--color-signal-soft), transparent 60%)" }}
        aria-hidden="true"
      />
      <div className="container-page relative grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        {/* sticky year */}
        <div className="lg:sticky lg:top-28 lg:h-[calc(100vh-9rem)] lg:self-start">
          <p className="flex items-baseline gap-4 text-sm text-mute">
            <span className="tabular text-signal">03</span> Journey
          </p>
          <h2 id="journey-title" className="mt-5 text-[2rem] font-semibold tracking-[-0.03em] text-fg md:text-[2.6rem]">
            Let&apos;s go back in time.
          </h2>
          <div className="tabular mt-4 text-[5.5rem] font-semibold leading-none tracking-[-0.06em] text-fg sm:text-[8rem] lg:text-[10rem]">
            <RollingYear year={cur.year} />
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={reduce ? false : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              className="mt-4 hidden text-[15px] text-soft lg:block"
            >
              {cur.title} · <span className="text-mute">{cur.org}</span>
            </motion.p>
          </AnimatePresence>
          <div className="mt-8 hidden h-1 w-full max-w-sm overflow-hidden rounded-full bg-line lg:block">
            <motion.div className="h-full origin-left bg-gradient-to-r from-signal to-ahead" style={{ scaleX: reduce ? 1 : fill }} />
          </div>
        </div>

        {/* stops */}
        <ol ref={listRef} className="relative space-y-6 border-l border-line pl-6 md:pl-10">
          {stops.map((s, i) => {
            const Icon = s.icon;
            const on = i === active;
            return (
              <motion.li
                key={s.title}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                data-idx={i}
                className="relative"
                initial={reduce ? false : { opacity: 0, x: 60, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <span
                  className={`absolute -left-[calc(1.5rem+9px)] top-7 grid size-[18px] place-items-center rounded-full border-2 transition-all duration-300 md:-left-[calc(2.5rem+9px)] ${
                    on ? "scale-125 border-signal bg-signal shadow-[0_0_20px_var(--color-signal)]" : "border-line-strong bg-ink"
                  }`}
                  aria-hidden="true"
                />
                <article
                  className={`overflow-hidden rounded-3xl border transition-all duration-500 ${
                    s.tone === "now"
                      ? "border-ahead/40 bg-ahead-soft"
                      : s.tone === "next"
                        ? "border-dashed border-line-strong"
                        : on
                          ? "border-line-strong bg-panel"
                          : "border-line bg-panel/60"
                  } ${on ? "opacity-100" : "opacity-70"}`}
                >
                  {s.photo && (
                    <div className="relative aspect-[16/9] border-b border-line">
                      <ParallaxPhoto src={s.photo.src} alt={s.photo.alt} position={s.photo.position} sizes="(min-width: 1024px) 600px, 90vw" />
                    </div>
                  )}
                  <div className="p-6 md:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid size-11 place-items-center rounded-xl border border-line text-soft">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="tabular text-right text-[12.5px] text-mute">{s.date ?? ""}</span>
                    </div>
                    <h3 className="mt-5 text-[1.3rem] font-semibold tracking-[-0.02em] text-fg">{s.title}</h3>
                    <p className="mt-1 text-[14.5px] text-soft">{s.org}</p>
                    {s.points && (
                      <ul className="mt-4 space-y-1.5">
                        {s.points.map((p) => (
                          <li key={p} className="flex gap-2.5 text-[14px] leading-snug text-soft">
                            <span className="mt-[0.5em] size-1.5 shrink-0 rounded-full bg-signal" aria-hidden="true" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
