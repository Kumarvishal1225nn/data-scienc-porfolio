"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BrainCircuit, Code2, Database, Table2, Wrench, type LucideIcon } from "lucide-react";
import { projects, skillGroups } from "@/data/portfolio";
import { Section, SectionHeading } from "../ui/section";
import { Reveal } from "../ui/reveal";
import { ProjectVisualArt } from "./project-visuals";

const icons: Record<string, LucideIcon> = {
  code: Code2,
  table: Table2,
  brain: BrainCircuit,
  database: Database,
  wrench: Wrench,
};

/* Map skill names to the words used in project tech lists. */
const aliases: Record<string, string[]> = {
  AWS: ["AWS", "DynamoDB"],
  "Time series analysis": ["Time series", "ARIMA"],
  "Data visualization": ["Tableau", "Power BI"],
  "Exploratory data analysis": ["Python"],
  Pandas: ["Python"],
  NumPy: ["Python"],
  "Scikit-learn": ["K-Means", "Isolation Forest"],
};

function projectsFor(skill: string) {
  const keys = (aliases[skill] ?? [skill]).map((k) => k.toLowerCase());
  return projects.filter((p) => p.tech.some((t) => keys.includes(t.toLowerCase())));
}

export function Skills() {
  const reduce = useReducedMotion();
  const [group, setGroup] = useState(0);
  const g = skillGroups[group];
  const [skill, setSkill] = useState<string>(g.skills[0]);
  const used = useMemo(() => projectsFor(skill), [skill]);

  const pickGroup = (i: number) => {
    setGroup(i);
    setSkill(skillGroups[i].skills[0]);
  };

  return (
    <Section id="skills" tone="deep">
      <SectionHeading id="skills" index="02" title="Toolkit" lede="Pick a tool — see where I've used it." />

      <Reveal>
        <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]" role="tablist" aria-label="Skill groups">
          {skillGroups.map((sg, i) => {
            const Icon = icons[sg.icon];
            const on = i === group;
            return (
              <button
                key={sg.name}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => pickGroup(i)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[14px] transition-colors ${
                  on ? "border-signal bg-signal text-white" : "border-line text-soft hover:border-line-strong hover:text-fg"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {sg.name}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="rounded-3xl border border-line bg-panel/60 p-6 md:p-7">
            <ul className="flex flex-wrap gap-2.5" aria-label={`${g.name} tools`}>
              {g.skills.map((s, i) => {
                const n = projectsFor(s).length;
                const on = s === skill;
                return (
                  <motion.li
                    key={`${g.name}-${s}`}
                    initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.035 }}
                  >
                    <button
                      type="button"
                      onClick={() => setSkill(s)}
                      onMouseEnter={() => setSkill(s)}
                      aria-pressed={on}
                      className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[14px] transition-all ${
                        on
                          ? "border-signal/70 bg-signal-soft text-fg shadow-[0_0_24px_-10px_var(--color-signal)]"
                          : "border-line bg-ink/60 text-fg/85 hover:border-line-strong"
                      }`}
                    >
                      {s}
                      {n > 0 && (
                        <span className={`tabular rounded-md px-1.5 text-[11.5px] ${on ? "bg-signal text-white" : "bg-panel-2 text-mute"}`}>
                          {n}
                        </span>
                      )}
                    </button>
                  </motion.li>
                );
              })}
            </ul>
            <p className="mt-6 text-[12.5px] text-mute">Number = projects on this page that use it.</p>
          </div>

          <div className="min-h-[220px] rounded-3xl border border-line bg-ink/40 p-6 md:p-7" aria-live="polite">
            <p className="text-[13px] text-mute">
              <span className="text-fg">{skill}</span> in action
            </p>
            <AnimatePresence mode="wait">
              <motion.ul
                key={skill}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                {used.length === 0 && (
                  <li className="col-span-full rounded-2xl border border-dashed border-line-strong p-6 text-[14px] text-soft">
                    Used in coursework and practice notebooks.
                  </li>
                )}
                {used.slice(0, 4).map((p) => (
                  <li key={p.id}>
                    <a
                      href={`#project-${p.id}`}
                      className="group flex items-center gap-3 rounded-2xl border border-line bg-panel/70 p-3 transition-colors hover:border-line-strong"
                    >
                      <span className="block h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-deep p-1.5">
                        <ProjectVisualArt kind={p.visual} still />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[14px] font-medium text-fg group-hover:text-white">{p.title}</span>
                        {p.headline ? (
                          <span className="tabular block text-[12.5px] text-signal">
                            {p.headline.value} {p.headline.label}
                          </span>
                        ) : (
                          <span className="block text-[12.5px] text-mute">{p.category}</span>
                        )}
                      </span>
                    </a>
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
