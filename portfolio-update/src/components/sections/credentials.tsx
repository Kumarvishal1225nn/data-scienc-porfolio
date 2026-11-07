import { BadgeCheck, Users } from "lucide-react";
import { certifications, responsibilities } from "@/data/portfolio";
import { Reveal } from "../ui/reveal";

export function Credentials() {
  return (
    <section aria-label="Certifications and leadership" className="overflow-x-clip bg-ink pb-24 md:pb-32">
      <div className="container-page grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Reveal variant="left" className="rounded-3xl border border-line bg-panel/60 p-6 md:p-7">
          <p className="flex items-center gap-2 text-[13px] text-mute">
            <BadgeCheck className="size-4 text-signal" aria-hidden="true" /> Certifications
          </p>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {certifications.map((c, i) => (
              <Reveal as="li" key={c.name} delay={0.1 + i * 0.08} variant="zoom" className="rounded-2xl border border-line bg-ink/50 px-4 py-3">
                <span className="block text-[14px] font-medium leading-snug text-fg">{c.name}</span>
                {c.issuer && <span className="mt-0.5 block text-[12px] text-mute">{c.issuer}</span>}
              </Reveal>
            ))}
          </ul>
        </Reveal>
        {responsibilities.map((r) => (
          <Reveal key={r.role} variant="right" className="flex flex-col rounded-3xl border border-line bg-panel/60 p-6 md:p-7">
            <p className="flex items-center gap-2 text-[13px] text-mute">
              <Users className="size-4 text-ahead" aria-hidden="true" /> Leadership
            </p>
            <h3 className="mt-4 text-[1.15rem] font-semibold tracking-[-0.02em] text-fg">{r.role}</h3>
            <p className="text-[14px] text-soft">{r.org}</p>
            <p className="mt-3 text-[13.5px] leading-snug text-soft">{r.point}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
