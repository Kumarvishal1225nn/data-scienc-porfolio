# Vishal — Data Science & Analytics Portfolio

A single-page, long-scrolling portfolio built with **Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide**.

Sections: Home → About → Journey (interactive timeline) → Skills → Projects (+ live GitHub showcase) → Experience → Education → Contact.

---

## 1. Run it locally

Requires **Node.js 20+**.

```bash
npm install
cp .env.example .env.local   # optional — defaults are already set
npm run dev                  # http://localhost:3000
```

Production check:

```bash
npm run build && npm start
```

---

## 2. Where to edit things

| What | File |
| --- | --- |
| Name, email, LinkedIn, GitHub username, resume path, photo path | `src/config/site.ts` (or env vars) |
| All page text — journey, skills, projects, experience, education | `src/data/portfolio.ts` |
| Colours and fonts | `src/app/globals.css` (`@theme` block) |
| SEO title / description | `src/config/site.ts` → used by `src/app/layout.tsx` |

Nothing is shown for a field you leave `undefined` — e.g. a project with no `repoUrl` simply has no Repository button.

### Configure your GitHub username

Either edit `githubUsername` in `src/config/site.ts`, or set:

```
NEXT_PUBLIC_GITHUB_USERNAME=your-username
```

The "Live from GitHub" block fetches your public repos through `/api/github` (cached for 1 hour on the server). If that route is unavailable it falls back to calling the GitHub API from the browser. If GitHub's rate limit is hit, a fallback card links to your profile instead.

**No token is needed.** Optionally, add a server-only `GITHUB_TOKEN` (a fine-grained token with *no* permissions) in Vercel to raise the limit. Never name it `NEXT_PUBLIC_…` — that would ship it to the browser.

Forks and archived repos are hidden. To show a repo first, give it stars or push to it recently. Good repo descriptions matter — they are what recruiters see.

The contribution chart uses the public `ghchart.rshah.org` image. Set `showContributionGraph: false` in `site.ts` to hide it.

### Replace your profile photo

Overwrite **`public/images/profile.jpg`** with your photo (portrait or square, ~1000–1400px wide). Keep the filename, or change `profileImage` in `src/config/site.ts`. Next.js serves it as optimised AVIF/WebP automatically. If your face sits higher or lower in the frame, adjust `object-[50%_20%]` in `src/components/sections/hero.tsx`.

An alternate photo is included at `public/images/profile-alt.jpg`.

### Add your resume PDF

Replace **`public/resume/Vishal_Resume.pdf`** with your real resume (keep the filename). Every "Resume" button points there.

> ⚠️ The file in the repo right now is a one-page placeholder. Replace it before you share the site.

### Update project links

In `src/data/portfolio.ts`, each project has:

```ts
repoUrl: "https://github.com/Kumarvishal1225nn/your-repo",
demoUrl: "https://your-demo.vercel.app",   // optional
```

Fill these in and the buttons appear. To add a project, copy an object in the `projects` array; `visual` picks one of the four built-in thumbnails (`telemetry`, `taxi`, `retail`, `supply`).

### Add internship dates or certificates

In the `experience` array add `period: "May 2025 – Jul 2025"` or `certificateUrl: "/certificates/cdac.pdf"` (put the PDF in `public/certificates/`). In `journey`, add entries to `details`.

---

## 3. Put the code on GitHub

```bash
git init
git add .
git commit -m "Portfolio site"
git branch -M main
# create an empty repo on github.com first, e.g. "portfolio", then:
git remote add origin https://github.com/Kumarvishal1225nn/portfolio.git
git push -u origin main
```

`.env.local` is git-ignored, so nothing private is committed.

## 4. Deploy on Vercel

1. Go to **vercel.com → Add New → Project** and sign in with GitHub.
2. **Import** the `portfolio` repository. Vercel detects Next.js; keep the defaults.
3. Under **Environment Variables** add (all optional, defaults exist):
   - `NEXT_PUBLIC_GITHUB_USERNAME`
   - `NEXT_PUBLIC_CONTACT_EMAIL`
   - `NEXT_PUBLIC_LINKEDIN_URL`
   - `NEXT_PUBLIC_SITE_URL` → your final URL, e.g. `https://vishal.vercel.app`
   - `GITHUB_TOKEN` (optional, server-only)
4. Click **Deploy**.

After that, every `git push` to `main` redeploys automatically, and pull requests get preview URLs. To use a custom domain: **Project → Settings → Domains**.

---

## Project structure

```
src/
  app/
    layout.tsx          # fonts, SEO metadata, JSON-LD
    page.tsx            # section order
    globals.css         # design tokens (Tailwind @theme)
    api/github/route.ts # cached GitHub proxy (token stays server-side)
    sitemap.ts, robots.ts, icon.svg
  config/site.ts        # personal links & settings
  data/portfolio.ts     # all content
  lib/github.ts         # GitHub fetch + types
  components/
    navbar.tsx, footer.tsx
    ui/                 # Reveal, Section, brand icons
    sections/           # hero, about, journey, skills, projects,
                        # github-showcase, experience, education, contact
public/
  images/profile.jpg
  resume/Vishal_Resume.pdf
```

Accessibility: skip link, keyboard-focus styles, labelled navigation, `aria-expanded` on expandable items, Escape closes dialogs/menus, and all motion is disabled when the visitor prefers reduced motion.
