import { Award } from "lucide-react";
import { experience } from "@/data/portfolio";
import { Section, SectionHeading } from "../ui/section";
import { Reveal } from "../ui/reveal";

export function Experience() {
  return (
    <Section id="experience" tone="deep">
      <SectionHeading
        id="experience"
        index="05"
        title="Experience"
        lede="Work, internships, research and training — most recent first."
      />

      <ol className="divide-y divide-line border-y border-line">
        {experience.map((e, i) => (
          <Reveal as="li" key={e.id} delay={i * 0.04} className="group grid gap-3 py-8 md:grid-cols-[13rem_minmax(0,1fr)_auto] md:gap-10 md:py-10">
            <div className="flex items-center gap-3 md:block">
              <span className="inline-block rounded-full border border-line px-2.5 py-0.5 text-[12px] text-soft">{e.kind}</span>
              {e.period && <p className="tabular text-[13.5px] text-mute md:mt-3">{e.period}</p>}
            </div>

            <div>
              <h3 className="text-xl font-semibold tracking-[-0.02em] text-fg transition-colors group-hover:text-white md:text-[1.375rem]">
                {e.role}
              </h3>
              <p className="mt-1 text-[15px] text-soft">{e.org}</p>
              {e.points && e.points.length > 0 && (
                <ul className="mt-4 max-w-[64ch] space-y-2">
                  {e.points.map((p) => (
                    <li key={p} className="flex gap-3 text-[14.5px] leading-relaxed text-soft">
                      <span className="mt-[0.62em] size-1 shrink-0 rounded-full bg-mute" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {e.certificateUrl && (
              <a
                href={e.certificateUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-fit w-fit items-center gap-2 rounded-full border border-line px-4 py-2 text-[13px] text-soft transition-colors hover:border-line-strong hover:text-fg"
              >
                <Award className="size-4" aria-hidden="true" />
                Certificate
              </a>
            )}
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
