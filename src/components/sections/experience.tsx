import { ParallaxPhoto } from "../ui/parallax-photo";
import { Award, Briefcase, FlaskConical, GraduationCap, School, type LucideIcon } from "lucide-react";
import { education, experience } from "@/data/portfolio";
import { Section, SectionHeading } from "../ui/section";
import { Reveal } from "../ui/reveal";

const kindIcon: Record<string, LucideIcon> = {
  Work: Briefcase,
  Internship: Briefcase,
  Research: FlaskConical,
  Training: School,
};

export function Experience() {
  return (
    <Section id="experience" tone="deep">
      <SectionHeading id="experience" index="04" title="Experience & education" />

      {[experience.filter((e) => e.photo), experience.filter((e) => !e.photo)].map((list, row) => (
      <ul key={row} className={`grid gap-4 ${row === 0 ? "md:grid-cols-2" : "mt-4 sm:grid-cols-2 lg:grid-cols-3"}`}>
        {list.map((e, i) => {
          const Icon = kindIcon[e.kind] ?? Briefcase;
          const lead = e.id === "annam";
          return (
            <Reveal
              as="li"
              key={e.id}
              delay={(i % 3) * 0.12}
              variant={row === 0 ? (i === 0 ? "left" : "right") : "up"}
              className={`group flex flex-col overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                lead ? "border-signal/40 bg-signal-soft" : "border-line bg-panel/60 hover:border-line-strong"
              }`}
            >
              {e.photo && (
                <div className="relative -mx-6 -mt-6 mb-6 aspect-[16/10] overflow-hidden rounded-t-3xl border-b border-line">
                  <ParallaxPhoto
                    src={e.photo.src}
                    alt={e.photo.alt}
                    position={e.photo.position}
                    sizes="(min-width: 768px) 50vw, 90vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent" aria-hidden="true" />
                </div>
              )}
              <div className="flex items-center justify-between gap-3">
                <span className={`grid size-11 place-items-center rounded-xl border ${lead ? "border-signal/50 text-signal" : "border-line text-soft group-hover:text-fg"}`}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="rounded-full border border-line px-2.5 py-0.5 text-[11.5px] text-soft">{e.kind}</span>
              </div>
              <h3 className="mt-6 text-[1.15rem] font-semibold leading-snug tracking-[-0.02em] text-fg">{e.role}</h3>
              <p className="mt-1 text-[14px] text-soft">{e.org}</p>
              {e.points && (
                <ul className="mt-4 space-y-2">
                  {e.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-[13.5px] leading-snug text-soft">
                      <span className="mt-[0.5em] size-1 shrink-0 rounded-full bg-signal" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                {e.period ? <p className="tabular text-[12.5px] text-mute">{e.period}</p> : <span />}
                {e.certificateUrl && (
                  <a href={e.certificateUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[12.5px] text-soft hover:text-fg">
                    <Award className="size-4" aria-hidden="true" /> Certificate
                  </a>
                )}
              </div>
            </Reveal>
          );
        })}
      </ul>
      ))}

      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {education.map((ed, i) => (
          <Reveal
            as="li"
            key={ed.id}
            delay={i * 0.1}
            variant="zoom"
            className={`flex items-center gap-5 rounded-3xl border p-6 ${ed.current ? "border-ahead/40 bg-ahead-soft" : "border-line bg-panel/60"}`}
          >
            <span className={`grid size-12 shrink-0 place-items-center rounded-xl border ${ed.current ? "border-ahead/50 text-ahead" : "border-line text-soft"}`}>
              <GraduationCap className="size-6" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-[1.1rem] font-semibold leading-snug tracking-[-0.02em] text-fg">{ed.degree}</h3>
              <p className="text-[14px] text-soft">{ed.school}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="tabular text-[13px] text-fg">{ed.period}</p>
              <p className={`text-[11.5px] ${ed.current ? "text-ahead" : "text-mute"}`}>{ed.current ? "Now" : "Done"}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
