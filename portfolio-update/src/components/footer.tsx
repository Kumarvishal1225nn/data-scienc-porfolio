import { Mail } from "lucide-react";
import { githubUrl, siteConfig } from "@/config/site";
import { GitHubIcon, LinkedInIcon } from "./ui/brand-icons";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-ink">
      <div className="container-page flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[15px] font-medium text-fg">Vishal</p>
          <p className="mt-1 text-[13.5px] text-mute">Data Science &amp; Analytics Portfolio</p>
        </div>
        <ul className="flex items-center gap-2">
          {[
            { href: githubUrl, label: "GitHub", Icon: GitHubIcon },
            { href: siteConfig.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
          ].map(({ href, label, Icon }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full border border-line text-soft transition-colors hover:border-line-strong hover:text-fg">
                <Icon className="size-4" />
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${siteConfig.email}`} aria-label="Email" className="grid size-10 place-items-center rounded-full border border-line text-soft transition-colors hover:border-line-strong hover:text-fg">
              <Mail className="size-4" aria-hidden="true" />
            </a>
          </li>
        </ul>
        <p className="text-[13px] text-mute">© {year} Kumar Vishal. All rights reserved.</p>
      </div>
    </footer>
  );
}
