"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, GitFork, RefreshCw, Star } from "lucide-react";
import { githubUrl, siteConfig } from "@/config/site";
import type { GitHubPayload, GitHubRepo } from "@/lib/github";
import { GitHubIcon } from "../ui/brand-icons";
import { Reveal } from "../ui/reveal";

const langColor: Record<string, string> = {
  Python: "#4d8dff",
  "Jupyter Notebook": "#f0a35e",
  TypeScript: "#5aa9e6",
  JavaScript: "#e8d26a",
  R: "#7aa7d8",
  SQL: "#9d8cff",
  HTML: "#e4744f",
  CSS: "#8b7be0",
  HCL: "#a78bfa",
};

type State = { status: "loading" } | { status: "done"; data: GitHubPayload };

const INITIAL = 6;

function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - +new Date(iso)) / 86_400_000);
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

async function load(): Promise<GitHubPayload> {
  // 1) Our cached server route (works on Vercel).
  try {
    const r = await fetch("/api/github");
    if (r.ok) {
      const data = (await r.json()) as GitHubPayload;
      if (data.ok || data.reason !== "error") return data;
    }
  } catch {
    /* fall through */
  }
  // 2) Direct public API from the browser — no token, 60 req/h per visitor IP.
  try {
    const u = siteConfig.githubUsername;
    const [ur, rr] = await Promise.all([
      fetch(`https://api.github.com/users/${u}`),
      fetch(`https://api.github.com/users/${u}/repos?per_page=100&sort=pushed&type=owner`),
    ]);
    if (ur.status === 403 || rr.status === 403 || ur.status === 429)
      return { ok: false, reason: "rate_limited", message: "GitHub's hourly API limit was reached." };
    if (ur.status === 404) return { ok: false, reason: "not_found", message: `No GitHub user named "${u}".` };
    if (!ur.ok || !rr.ok) throw new Error();
    const user = await ur.json();
    const repos = (await rr.json()) as Array<Record<string, unknown>>;
    return {
      ok: true,
      profile: {
        login: user.login,
        name: user.name,
        avatarUrl: user.avatar_url,
        bio: user.bio,
        publicRepos: user.public_repos,
        followers: user.followers,
        url: user.html_url,
      },
      repos: repos
        .filter((r) => !r.fork && !r.archived && String(r.name).toLowerCase() !== String(user.login).toLowerCase())
        .map((r) => ({
          id: r.id as number,
          name: r.name as string,
          description: (r.description as string) ?? null,
          language: (r.language as string) ?? null,
          stars: r.stargazers_count as number,
          forks: r.forks_count as number,
          url: r.html_url as string,
          homepage: (r.homepage as string) || null,
          updatedAt: r.pushed_at as string,
          topics: (r.topics as string[]) ?? [],
        }))
        .sort((a, b) => b.stars - a.stars || +new Date(b.updatedAt) - +new Date(a.updatedAt)),
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return { ok: false, reason: "error", message: "Couldn't reach GitHub." };
  }
}

function RepoCard({ r }: { r: GitHubRepo }) {
  return (
    <li>
      <a
        href={r.url}
        target="_blank"
        rel="noreferrer"
        className="group flex h-full flex-col rounded-2xl border border-line bg-ink/50 p-5 transition-colors duration-300 hover:border-line-strong hover:bg-panel"
      >
        <div className="flex items-start justify-between gap-3">
          <h4 className="break-all text-[15px] font-medium text-fg">{r.name}</h4>
          <ArrowUpRight
            className="size-4 shrink-0 text-mute transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
            aria-hidden="true"
          />
        </div>
        <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-soft">
          {r.description ?? <span className="text-mute">No description yet.</span>}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-5 text-[12.5px] text-mute">
          {r.language && (
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full" style={{ background: langColor[r.language] ?? "#8c9ab3" }} aria-hidden="true" />
              {r.language}
            </span>
          )}
          <span className="flex items-center gap-1" aria-label={`${r.stars} stars`}>
            <Star className="size-3.5" aria-hidden="true" />
            {r.stars}
          </span>
          {r.forks > 0 && (
            <span className="flex items-center gap-1" aria-label={`${r.forks} forks`}>
              <GitFork className="size-3.5" aria-hidden="true" />
              {r.forks}
            </span>
          )}
          <span className="ml-auto">Updated {timeAgo(r.updatedAt)}</span>
        </div>
      </a>
    </li>
  );
}

export function GitHubShowcase() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [lang, setLang] = useState<string>("All");
  const [showAll, setShowAll] = useState(false);
  const [graphOk, setGraphOk] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setState({ status: "loading" });
    load().then((data) => alive && setState({ status: "done", data }));
    return () => {
      alive = false;
    };
  }, [attempt]);

  const repos = state.status === "done" && state.data.ok ? state.data.repos : [];
  const languages = useMemo(() => {
    const counts = new Map<string, number>();
    repos.forEach((r) => r.language && counts.set(r.language, (counts.get(r.language) ?? 0) + 1));
    return ["All", ...[...counts.entries()].sort((a, b) => b[1] - a[1]).map(([l]) => l)];
  }, [repos]);
  const filtered = lang === "All" ? repos : repos.filter((r) => r.language === lang);
  const visible = showAll ? filtered : filtered.slice(0, INITIAL);

  return (
    <div id="github" className="mt-24 md:mt-32">
      <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-[-0.025em] text-fg md:text-[2rem]">Live from GitHub</h3>
          <p className="mt-2 max-w-[54ch] text-[15px] leading-relaxed text-soft">
            Public repositories, pulled straight from the GitHub API and refreshed hourly.
          </p>
        </div>
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-[14px] font-medium text-fg transition-colors hover:border-soft hover:bg-panel"
        >
          <GitHubIcon className="size-4" />
          @{siteConfig.githubUsername}
        </a>
      </Reveal>

      <div className="mt-10 rounded-[28px] border border-line bg-panel/50 p-5 md:p-8">
        {state.status === "loading" && (
          <div aria-live="polite" aria-busy="true">
            <span className="sr-only">Loading repositories…</span>
            <div className="mb-8 flex items-center gap-4">
              <div className="size-14 animate-pulse rounded-full bg-panel-2" />
              <div className="space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-panel-2" />
                <div className="h-3 w-56 animate-pulse rounded bg-panel-2" />
              </div>
            </div>
            <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="h-36 animate-pulse rounded-2xl bg-panel-2/70" />
              ))}
            </ul>
          </div>
        )}

        {state.status === "done" && !state.data.ok && (
          <div className="flex flex-col items-start gap-5 py-6 md:flex-row md:items-center md:justify-between" role="status">
            <div>
              <p className="text-[16px] font-medium text-fg">
                {state.data.reason === "rate_limited"
                  ? "GitHub's API limit is reached for now"
                  : state.data.reason === "not_found"
                    ? "GitHub profile not found"
                    : "Repositories couldn't load"}
              </p>
              <p className="mt-1.5 max-w-[56ch] text-[14px] leading-relaxed text-soft">
                {state.data.reason === "rate_limited"
                  ? "The list refreshes within the hour. Every repository is on the GitHub profile in the meantime."
                  : state.data.reason === "not_found"
                    ? "Check the username in the site configuration."
                    : "Try again, or open the profile on GitHub."}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAttempt((a) => a + 1)}
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[13.5px] text-fg transition-colors hover:border-soft"
              >
                <RefreshCw className="size-4" aria-hidden="true" />
                Try again
              </button>
              <a href={githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-fg px-4 py-2 text-[13.5px] font-medium text-ink">
                Open GitHub
              </a>
            </div>
          </div>
        )}

        {state.status === "done" && state.data.ok && (
          <>
            <div className="mb-8 flex flex-col gap-5 border-b border-line pb-7 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={state.data.profile.avatarUrl}
                  alt=""
                  width={56}
                  height={56}
                  className="size-14 rounded-full border border-line"
                  loading="lazy"
                />
                <div>
                  <p className="text-[16px] font-medium text-fg">{state.data.profile.name ?? state.data.profile.login}</p>
                  <p className="text-[13.5px] text-mute">
                    {state.data.profile.publicRepos} public repositories · {state.data.profile.followers} followers
                  </p>
                </div>
              </div>
              {languages.length > 2 && (
                <div role="group" aria-label="Filter by language" className="flex flex-wrap gap-1.5">
                  {languages.map((l) => (
                    <button
                      key={l}
                      type="button"
                      aria-pressed={lang === l}
                      onClick={() => {
                        setLang(l);
                        setShowAll(false);
                      }}
                      className={`rounded-full px-3 py-1.5 text-[13px] transition-colors ${
                        lang === l ? "bg-fg text-ink" : "border border-line text-soft hover:border-line-strong hover:text-fg"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {repos.length === 0 ? (
              <p className="py-6 text-[15px] text-soft">
                No public repositories yet. Projects published to GitHub will appear here automatically.
              </p>
            ) : (
              <>
                <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3" aria-live="polite">
                  {visible.map((r) => (
                    <RepoCard key={r.id} r={r} />
                  ))}
                </ul>
                {filtered.length > INITIAL && (
                  <button
                    type="button"
                    onClick={() => setShowAll((v) => !v)}
                    className="mx-auto mt-6 block rounded-full border border-line px-5 py-2 text-[13.5px] text-soft transition-colors hover:border-line-strong hover:text-fg"
                  >
                    {showAll ? "Show fewer" : `Show all ${filtered.length} repositories`}
                  </button>
                )}
              </>
            )}
          </>
        )}

        {siteConfig.showContributionGraph && graphOk && (
          <div className="mt-8 border-t border-line pt-7">
            <p className="mb-4 text-[13.5px] text-mute">Contribution activity, last 12 months</p>
            <div className="overflow-x-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://ghchart.rshah.org/4d8dff/${siteConfig.githubUsername}`}
                alt={`GitHub contribution chart for ${siteConfig.githubUsername}`}
                loading="lazy"
                onError={() => setGraphOk(false)}
                className="min-w-[680px] w-full opacity-90 [filter:invert(1)_hue-rotate(180deg)_brightness(0.95)]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
