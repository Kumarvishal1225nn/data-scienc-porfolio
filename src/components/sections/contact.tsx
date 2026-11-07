"use client";

import { useState } from "react";
import { Check, Copy, Download, Mail } from "lucide-react";
import { githubUrl, siteConfig } from "@/config/site";
import { GitHubIcon, LinkedInIcon } from "../ui/brand-icons";
import { Reveal } from "../ui/reveal";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the mailto link still works */
    }
  };

  const channels = [
    { label: "LinkedIn", detail: "Connect professionally", href: siteConfig.linkedin, Icon: LinkedInIcon },
    { label: "GitHub", detail: `@${siteConfig.githubUsername}`, href: githubUrl, Icon: GitHubIcon },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden bg-deep py-24 md:py-36">
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-signal/10 blur-[120px]"
        aria-hidden="true"
      />
      <div className="container-page relative">
        <Reveal className="max-w-3xl">
          <p className="flex items-baseline gap-4 text-sm text-mute">
            <span className="tabular">05</span>
            Contact
          </p>
          <h2 id="contact-title" className="mt-6 text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.04em] text-fg md:text-[4.25rem]">
            Got a role?
            <span className="block text-mute">Let&apos;s build it together.</span>
          </h2>
          <p className="mt-6 text-[1.0625rem] text-soft">Data Analyst · Business Analyst · ML roles. Email is fastest.</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex items-center gap-2.5 rounded-full bg-signal px-6 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-[#3b7cf0]"
          >
            <Mail className="size-4" aria-hidden="true" />
            Email me
          </a>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2.5 rounded-full border border-line-strong px-5 py-3.5 text-[14.5px] text-fg transition-colors hover:border-soft"
            aria-live="polite"
          >
            {copied ? <Check className="size-4 text-[#4ade80]" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
            <span className="max-w-[58vw] truncate">{copied ? "Copied" : siteConfig.email}</span>
          </button>
          <a
            href={siteConfig.resumePath}
            download
            className="inline-flex items-center gap-2.5 rounded-full border border-line-strong px-5 py-3.5 text-[14.5px] text-fg transition-colors hover:border-soft"
          >
            <Download className="size-4" aria-hidden="true" />
            Download resume
          </a>
        </Reveal>

        <ul className="mt-16 grid gap-4 sm:grid-cols-2">
          {channels.map(({ label, detail, href, Icon }, i) => (
            <Reveal as="li" key={label} delay={0.15 + i * 0.05}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-panel/50 p-6 transition-colors hover:border-line-strong hover:bg-panel"
              >
                <span className="flex items-center gap-4">
                  <span className="grid size-11 place-items-center rounded-xl border border-line text-fg">
                    <Icon className="size-5" />
                  </span>
                  <span>
                    <span className="block text-[16px] font-medium text-fg">{label}</span>
                    <span className="block text-[13.5px] text-mute">{detail}</span>
                  </span>
                </span>
                <span className="text-[13px] text-mute transition-colors group-hover:text-fg">Open</span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
