import { GraduationCap } from "lucide-react";
import { education } from "@/data/portfolio";
import { Section, SectionHeading } from "../ui/section";
import { Reveal } from "../ui/reveal";

export function Education() {
  return (
    <Section id="education">
      <SectionHeading id="education" index="06" title="Education" />

      <div className="grid gap-5 md:grid-cols-2">
        {education.map((ed, i) => (
          <Reveal
            key={ed.id}
            delay={i * 0.08}
            className={`relative overflow-hidden rounded-[28px] border p-7 md:p-9 ${
              ed.current ? "border-ahead/35 bg-ahead-soft" : "border-line bg-panel/60"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <span
                className={`grid size-11 place-items-center rounded-xl border ${
                  ed.current ? "border-ahead/40 text-ahead" : "border-line text-soft"
                }`}
              >
                <GraduationCap className="size-5" aria-hidden="true" />
              </span>
              {ed.current ? (
                <span className="flex items-center gap-2 rounded-full bg-ahead/15 px-3 py-1 text-[12.5px] text-ahead">
                  <span className="size-1.5 animate-blink rounded-full bg-ahead" aria-hidden="true" />
                  Currently pursuing
                </span>
              ) : (
                <span className="rounded-full border border-line px-3 py-1 text-[12.5px] text-mute">Completed</span>
              )}
            </div>
            <h3 className="mt-10 text-2xl font-semibold tracking-[-0.025em] text-fg md:text-[1.75rem]">{ed.degree}</h3>
            <p className="mt-2 text-[16px] text-soft">{ed.school}</p>
            <div className="mt-8 flex items-end justify-between gap-6 border-t border-line pt-5">
              <p className="max-w-[34ch] text-[14px] leading-relaxed text-mute">{ed.note}</p>
              <p className="tabular shrink-0 text-[15px] font-medium text-fg">{ed.period}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
