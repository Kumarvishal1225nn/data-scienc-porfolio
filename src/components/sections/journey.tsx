"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { journey, type Milestone } from "@/data/portfolio";
import { Section, SectionHeading } from "../ui/section";
import { Reveal } from "../ui/reveal";

const stateLabel: Record<Milestone["state"], string> = {
  done: "Completed",
  current: "Current",
  future: "Next",
};

function Node({ state, index }: { state: Milestone["state"]; index: number }) {
  if (state === "done") {
    return (
      <span className="relative z-10 grid size-9 place-items-center rounded-full border border-line-strong bg-panel text-soft">
        <Check className="size-4" aria-hidden="true" />
      </span>
    );
  }
  if (state === "current") {
    return (
      <span className="relative z-10 grid size-9 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-ahead/30 [animation-duration:2.4s]" aria-hidden="true" />
        <span className="relative grid size-9 place-items-center rounded-full bg-ahead text-[13px] font-semibold text-ink">
          {index}
        </span>
      </span>
    );
  }
  return (
    <span className="relative z-10 grid size-9 place-items-center rounded-full border border-dashed border-ahead/70 bg-ink text-[13px] text-ahead">
      {index}
    </span>
  );
}

function MilestoneCard({ m, index }: { m: Milestone; index: number }) {
  const [open, setOpen] = useState(m.state === "current");
  const panelId = `milestone-${m.id}`;
  const tone =
    m.state === "current"
      ? "border-ahead/40 bg-ahead-soft"
      : m.state === "future"
        ? "border-dashed border-line-strong bg-transparent"
        : "border-line bg-panel/70 hover:border-line-strong";

  return (
    <Reveal as="li" className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-5 md:grid-cols-[9rem_2.25rem_minmax(0,1fr)] md:gap-8">
      <div className="hidden pt-2 text-right md:block">
        <p className="tabular text-[13.5px] text-soft">{m.period ?? ""}</p>
        <p className={`mt-1 text-[12px] ${m.state === "done" ? "text-mute" : "text-ahead"}`}>{stateLabel[m.state]}</p>
      </div>

      <div className="flex justify-center pt-0.5">
        <Node state={m.state} index={index + 1} />
      </div>

      <div className={`rounded-2xl border p-5 transition-colors md:p-6 ${tone}`}>
        <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 md:hidden">
          <span className={`text-[12px] ${m.state === "done" ? "text-mute" : "text-ahead"}`}>{stateLabel[m.state]}</span>
          {m.period && <span className="tabular text-[12.5px] text-soft">{m.period}</span>}
        </div>
        <h3 className="text-xl font-semibold tracking-[-0.02em] text-fg md:text-[1.4rem]">{m.title}</h3>
        <p className="mt-1.5 text-[14px] text-soft">{m.org}</p>
        <p className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-soft">{m.summary}</p>

        {m.details.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={panelId}
              className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-fg/90 transition-colors hover:text-signal"
            >
              {open ? "Hide details" : "Show details"}
              <ChevronDown className={`size-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={panelId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-2.5 pt-4">
                    {m.details.map((d) => (
                      <li key={d} className="flex gap-3 text-[14.5px] leading-relaxed text-soft">
                        <span className="mt-[0.6em] size-1 shrink-0 rounded-full bg-mute" aria-hidden="true" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </Reveal>
  );
}

export function Journey() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  return (
    <Section id="journey">
      <SectionHeading
        id="journey"
        index="02"
        title="The road so far"
        lede="From computer science, through operations, into data science — and where it's heading next."
      />

      <ol ref={listRef} className="relative space-y-6 md:space-y-8">
        {/* rail: positioned under the node column */}
        <span
          aria-hidden="true"
          className="absolute bottom-6 top-4 left-[1.125rem] w-px bg-line md:left-[calc(9rem+2rem+1.125rem)]"
        />
        <motion.span
          aria-hidden="true"
          style={{ scaleY: reduce ? 1 : fill }}
          className="absolute bottom-6 top-4 left-[1.125rem] w-px origin-top bg-gradient-to-b from-signal via-signal to-ahead md:left-[calc(9rem+2rem+1.125rem)]"
        />
        {journey.map((m, i) => (
          <MilestoneCard key={m.id} m={m} index={i} />
        ))}
      </ol>
    </Section>
  );
}
