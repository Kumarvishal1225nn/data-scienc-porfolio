import type { ReactNode } from "react";
import { Reveal } from "./reveal";

export function Section({
  id,
  children,
  tone = "ink",
  className = "",
}: {
  id: string;
  children: ReactNode;
  tone?: "ink" | "deep";
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`relative py-24 md:py-32 ${tone === "deep" ? "bg-deep" : "bg-ink"} ${className}`}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

/**
 * Heading with a small index that mirrors the nav order — the site reads
 * as one continuous document, so the number is real wayfinding.
 */
export function SectionHeading({
  id,
  index,
  title,
  lede,
}: {
  id: string;
  index: string;
  title: string;
  lede?: string;
}) {
  return (
    <Reveal className="mb-14 grid gap-6 md:mb-20 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-end">
      <div className="flex items-baseline gap-4">
        <span className="tabular text-sm text-mute" aria-hidden="true">
          {index}
        </span>
        <h2
          id={`${id}-title`}
          className="text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.03em] text-fg md:text-5xl"
        >
          {title}
        </h2>
      </div>
      {lede ? (
        <p className="max-w-[52ch] text-[1.0625rem] leading-relaxed text-soft md:justify-self-end">
          {lede}
        </p>
      ) : null}
    </Reveal>
  );
}
