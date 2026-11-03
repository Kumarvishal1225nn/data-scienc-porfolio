"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Code2, FlaskConical, GraduationCap, Hotel, Target, type LucideIcon } from "lucide-react";
import { journey, type Milestone } from "@/data/portfolio";
import { Section, SectionHeading } from "../ui/section";
import { Reveal } from "../ui/reveal";

const icons: Record<Milestone["icon"], LucideIcon> = {
  code: Code2,
  hotel: Hotel,
  flask: FlaskConical,
  grad: GraduationCap,
  target: Target,
};

export function Journey() {
  const reduce = useReducedMotion();
  const startIdx = Math.max(0, journey.findIndex((m) => m.state === "current"));
  const [active, setActive] = useState(startIdx);
  const m = journey[active];
  const progress = (active / (journey.length - 1)) * 100;

  return (
    <Section id="journey">
      <SectionHeading id="journey" index="01" title="The road so far" lede="Code → operations → data. Tap a stop." />

      <Reveal>
        <div className="relative">
          {/* rail */}
          <div className="absolute left-[10%] right-[10%] top-7 hidden h-px bg-line md:block" aria-hidden="true" />
          <motion.div
            className="absolute left-[10%] top-7 hidden h-px origin-left bg-gradient-to-r from-signal to-ahead md:block"
            style={{ width: "80%" }}
            initial={false}
            animate={{ scaleX: progress / 100 }}
            transition={{ duration: reduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          />

          <ol className="relative grid grid-cols-5 gap-1 md:gap-4" role="tablist" aria-label="Career milestones">
            {journey.map((s, i) => {
              const Icon = icons[s.icon];
              const on = i === active;
              const reached = i <= active;
              const future = s.state === "future";
              return (
                <li key={s.id} className="flex flex-col items-center text-center">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-controls="journey-panel"
                    onClick={() => setActive(i)}
                    className="group flex flex-col items-center gap-3 outline-none"
                  >
                    <span className="relative grid size-14 place-items-center">
                      {s.state === "current" && (
                        <span className="absolute inset-0 animate-ping rounded-2xl bg-ahead/25 [animation-duration:2.4s]" aria-hidden="true" />
                      )}
                      <span
                        className={`relative grid size-14 place-items-center rounded-2xl border transition-all duration-300 group-hover:scale-105 ${
                          on
                            ? s.state === "done"
                              ? "border-signal bg-signal text-white shadow-[0_0_30px_-6px_var(--color-signal)]"
                              : "border-ahead bg-ahead text-ink shadow-[0_0_30px_-6px_var(--color-ahead)]"
                            : future
                              ? "border-dashed border-ahead/60 bg-ink text-ahead"
                              : reached
                                ? "border-signal/50 bg-panel text-signal"
                                : "border-line-strong bg-panel text-soft"
                        }`}
                      >
                        <Icon className="size-6" aria-hidden="true" />
                      </span>
                    </span>
                    <span className="tabular hidden min-h-[1.2em] text-[12.5px] text-mute sm:block">{s.period ?? "·"}</span>
                    <span
                      className={`hidden max-w-[16ch] text-[13.5px] font-medium leading-snug transition-colors md:block ${
                        on ? "text-fg" : "text-soft group-hover:text-fg"
                      }`}
                    >
                      {s.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div id="journey-panel" role="tabpanel" aria-live="polite" className="mx-auto mt-10 max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={m.id}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className={`rounded-3xl border p-6 text-center md:p-8 ${
                m.state === "current"
                  ? "border-ahead/40 bg-ahead-soft"
                  : m.state === "future"
                    ? "border-dashed border-line-strong"
                    : "border-line bg-panel/70"
              }`}
            >
              <p className="tabular text-[12.5px] uppercase tracking-[0.14em] text-mute">
                {m.period ? `${m.period} · ` : ""}
                {m.state === "done" ? "Done" : m.state === "current" ? "Now" : "Next"}
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-fg md:text-[1.75rem]">{m.title}</h3>
              <p className="mt-1 text-[14.5px] text-soft">{m.org}</p>
              <p className="mt-4 text-[15.5px] text-fg/90">{m.summary}</p>
              {m.details.length > 0 && (
                <ul className="mt-5 grid gap-2 text-left sm:grid-cols-2">
                  {m.details.map((d) => (
                    <li key={d} className="rounded-xl border border-line bg-ink/50 px-3.5 py-2.5 text-[13.5px] leading-snug text-soft">
                      {d}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </Section>
  );
}
