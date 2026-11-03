"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Maximize2, X } from "lucide-react";
import { projects, type Project } from "@/data/portfolio";
import { Section, SectionHeading } from "../ui/section";
import { Reveal } from "../ui/reveal";
import { GitHubIcon } from "../ui/brand-icons";
import { ProjectVisualArt } from "./project-visuals";
import { GitHubShowcase } from "./github-showcase";

function ProjectLinks({ p, size = "sm" }: { p: Project; size?: "sm" | "md" }) {
  if (!p.repoUrl && !p.demoUrl) return null;
  const pad = size === "md" ? "px-5 py-2.5 text-[14px]" : "px-4 py-2 text-[13px]";
  return (
    <div className="flex flex-wrap gap-2">
      {p.repoUrl && (
        <a
          href={p.repoUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`inline-flex items-center gap-2 rounded-full border border-line-strong font-medium text-fg transition-colors hover:border-soft hover:bg-panel-2 ${pad}`}
        >
          <GitHubIcon className="size-4" />
          Repository
        </a>
      )}
      {p.demoUrl && (
        <a
          href={p.demoUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={`inline-flex items-center gap-2 rounded-full bg-signal font-medium text-white transition-colors hover:bg-[#3b7cf0] ${pad}`}
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          Live demo
        </a>
      )}
    </div>
  );
}

function TechList({ tech }: { tech: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
      {tech.map((t) => (
        <li key={t} className="rounded-md bg-ink/70 px-2.5 py-1 text-[12.5px] text-soft">
          {t}
        </li>
      ))}
    </ul>
  );
}

function ProjectDialog({ p, onClose }: { p: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/80 p-0 backdrop-blur-sm md:items-center md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`dlg-${p.id}`}
        layoutId={`card-${p.id}`}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-line bg-panel md:rounded-3xl"
      >
        <div className="relative aspect-[16/7] border-b border-line bg-deep p-6">
          <ProjectVisualArt kind={p.visual} />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-line bg-ink/80 text-fg transition-colors hover:border-soft"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="p-6 md:p-9">
          {p.context && <p className="text-[13px] text-mute">{p.context}</p>}
          <h3 id={`dlg-${p.id}`} className="mt-1 text-2xl font-semibold tracking-[-0.025em] text-fg md:text-3xl">
            {p.title}
          </h3>
          <p className="mt-4 max-w-[62ch] text-[1.0625rem] leading-relaxed text-soft">{p.summary}</p>

          {p.metrics && (
            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
              {p.metrics.map((m) => (
                <div key={m.label} className="bg-panel p-4">
                  <dt className="text-[12.5px] text-mute">{m.label}</dt>
                  <dd className="tabular mt-1 font-mono text-xl text-fg">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <h4 className="mt-9 text-[15px] font-semibold text-fg">What it does</h4>
          <ul className="mt-3 space-y-3">
            {p.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-[15px] leading-relaxed text-soft">
                <span className="mt-[0.62em] size-1.5 shrink-0 rounded-full bg-signal" aria-hidden="true" />
                {h}
              </li>
            ))}
          </ul>

          <h4 className="mt-9 text-[15px] font-semibold text-fg">Built with</h4>
          <div className="mt-3">
            <TechList tech={p.tech} />
          </div>

          <div className="mt-9">
            <ProjectLinks p={p} size="md" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FeaturedCard({ p, onOpen }: { p: Project; onOpen: () => void }) {
  return (
    <Reveal>
      <motion.article
        layoutId={`card-${p.id}`}
        className="group grid overflow-hidden rounded-[28px] border border-line bg-panel/70 transition-colors duration-300 hover:border-line-strong lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
      >
        <div className="relative order-last flex min-h-[240px] items-center border-t border-line bg-deep p-6 lg:order-none lg:border-r lg:border-t-0 lg:p-10">
          <div className="w-full transition-transform duration-500 group-hover:scale-[1.02]">
            <ProjectVisualArt kind={p.visual} />
          </div>
        </div>
        <div className="flex flex-col p-7 md:p-10">
          {p.context && <p className="text-[13px] text-mute">{p.context}</p>}
          <h3 className="mt-1.5 text-2xl font-semibold leading-tight tracking-[-0.025em] text-fg md:text-[2rem]">{p.title}</h3>
          <p className="mt-4 text-[15.5px] leading-relaxed text-soft">{p.summary}</p>

          {p.metrics && (
            <dl className="mt-7 grid grid-cols-3 gap-4 border-y border-line py-5">
              {p.metrics.slice(0, 3).map((m) => (
                <div key={m.label}>
                  <dd className="tabular font-mono text-[1.35rem] text-fg">{m.value}</dd>
                  <dt className="mt-1 text-[12px] leading-snug text-mute">{m.label}</dt>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-6">
            <TechList tech={p.tech} />
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
            <button
              type="button"
              onClick={onOpen}
              className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-[14px] font-medium text-ink transition-colors hover:bg-white"
            >
              <Maximize2 className="size-4" aria-hidden="true" />
              Read the case study
            </button>
            <ProjectLinks p={p} size="md" />
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}

function ProjectCard({ p, onOpen, i }: { p: Project; onOpen: () => void; i: number }) {
  return (
    <Reveal delay={i * 0.06} className="h-full">
      <motion.article
        layoutId={`card-${p.id}`}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-panel/70 transition-colors duration-300 hover:border-line-strong"
      >
        <div className="aspect-[16/9] border-b border-line bg-deep p-5">
          <ProjectVisualArt kind={p.visual} />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-[1.2rem] font-semibold leading-snug tracking-[-0.02em] text-fg">
            <button type="button" onClick={onOpen} className="text-left after:absolute after:inset-0 after:content-['']">
              {p.title}
            </button>
          </h3>
          <p className="mt-3 text-[14.5px] leading-relaxed text-soft">{p.summary}</p>
          <div className="mt-5">
            <TechList tech={p.tech} />
          </div>
          <div className="relative z-10 mt-auto flex items-center justify-between gap-3 pt-6">
            <ProjectLinks p={p} />
            <span className="ml-auto inline-flex items-center gap-1 text-[13px] text-mute transition-colors group-hover:text-fg">
              Details
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}

export function Projects() {
  const [openId, setOpenId] = useState<string | null>(null);
  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const open = projects.find((p) => p.id === openId);
  const close = useCallback(() => setOpenId(null), []);

  return (
    <Section id="projects">
      <SectionHeading
        id="projects"
        index="04"
        title="Selected work"
        lede="One system running in production, and the analytics projects I'm building alongside my degree."
      />

      {featured && <FeaturedCard p={featured} onOpen={() => setOpenId(featured.id)} />}

      <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((p, i) => (
          <ProjectCard key={p.id} p={p} i={i} onOpen={() => setOpenId(p.id)} />
        ))}
      </div>

      <AnimatePresence>{open && <ProjectDialog p={open} onClose={close} />}</AnimatePresence>

      <GitHubShowcase />
    </Section>
  );
}
