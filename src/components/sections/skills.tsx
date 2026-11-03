import { BrainCircuit, Code2, Database, Table2, Wrench, type LucideIcon } from "lucide-react";
import { skillGroups } from "@/data/portfolio";
import { Section, SectionHeading } from "../ui/section";
import { Reveal } from "../ui/reveal";

const icons: Record<string, LucideIcon> = {
  code: Code2,
  table: Table2,
  brain: BrainCircuit,
  database: Database,
  wrench: Wrench,
};

/* Layout spans: analytics and ML carry the most tools, so they get the room. */
const spans = [
  "md:col-span-5 lg:col-span-4",
  "md:col-span-7 lg:col-span-8",
  "md:col-span-12 lg:col-span-5",
  "md:col-span-6 lg:col-span-4",
  "md:col-span-6 lg:col-span-3",
];

export function Skills() {
  return (
    <Section id="skills" tone="deep">
      <SectionHeading
        id="skills"
        index="03"
        title="Tools I work with"
        lede="Grouped by what they're for. No proficiency bars — the projects below show how they're used."
      />

      <div className="grid gap-4 md:grid-cols-12">
        {skillGroups.map((g, i) => {
          const Icon = icons[g.icon];
          return (
            <Reveal
              key={g.name}
              delay={(i % 3) * 0.05}
              className={`group rounded-3xl border border-line bg-panel/60 p-6 transition-colors duration-300 hover:border-line-strong hover:bg-panel md:p-7 ${spans[i]}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold tracking-[-0.015em] text-fg">{g.name}</h3>
                  <p className="mt-1 text-[13.5px] text-mute">{g.note}</p>
                </div>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line text-soft transition-colors group-hover:border-signal/50 group-hover:text-signal">
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
              </div>
              <ul className="mt-7 flex flex-wrap gap-2" aria-label={`${g.name} skills`}>
                {g.skills.map((s) => (
                  <li
                    key={s}
                    className="rounded-lg border border-line bg-ink/60 px-3 py-1.5 text-[13.5px] text-fg/90"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
