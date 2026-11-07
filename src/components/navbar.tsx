"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { githubUrl, navItems, siteConfig } from "@/config/site";
import { GitHubIcon, LinkedInIcon } from "./ui/brand-icons";

function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    // The section whose area crosses a line ~35% down the viewport is "current".
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-35% 0px -64% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

export function Navbar() {
  const ids = navItems.map((n) => n.id);
  const active = useActiveSection(ids);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "border-b border-line bg-ink/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-signal"
        style={{ scaleX: progress }}
      />
      <nav aria-label="Primary" className="container-page flex h-16 items-center justify-between gap-6">
        <a href="#home" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid size-8 place-items-center rounded-lg border border-line-strong text-[13px] font-semibold tracking-tight text-fg transition-colors group-hover:border-signal">
            KV
          </span>
          <span className="text-[15px] font-medium tracking-tight text-fg">Vishal</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-full px-3 py-1.5 text-[13.5px] transition-colors ${
                    isActive ? "text-fg" : "text-mute hover:text-soft"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-panel-2"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-1.5 lg:flex">
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub profile"
            className="grid size-9 place-items-center rounded-full text-mute transition-colors hover:bg-panel-2 hover:text-fg"
          >
            <GitHubIcon className="size-[17px]" />
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn profile"
            className="grid size-9 place-items-center rounded-full text-mute transition-colors hover:bg-panel-2 hover:text-fg"
          >
            <LinkedInIcon className="size-4" />
          </a>
          <a
            href={siteConfig.resumePath}
            download
            className="ml-2 inline-flex items-center gap-2 rounded-full bg-fg px-4 py-2 text-[13px] font-medium text-ink transition-opacity hover:opacity-85"
          >
            <Download className="size-3.5" aria-hidden="true" />
            Resume
          </a>
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-full border border-line text-fg lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - 4rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-ink lg:hidden"
          >
            <div className="container-page flex h-full flex-col justify-between py-8">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={() => setOpen(false)}
                      className={`block py-2.5 text-2xl font-medium tracking-tight ${
                        active === item.id ? "text-fg" : "text-mute"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-3">
                <a
                  href={siteConfig.resumePath}
                  download
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-fg px-5 py-3 text-sm font-medium text-ink"
                >
                  <Download className="size-4" aria-hidden="true" />
                  Download resume
                </a>
                <a href={githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub profile" className="grid size-12 place-items-center rounded-full border border-line text-fg">
                  <GitHubIcon className="size-5" />
                </a>
                <a href={siteConfig.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile" className="grid size-12 place-items-center rounded-full border border-line text-fg">
                  <LinkedInIcon className="size-[18px]" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
