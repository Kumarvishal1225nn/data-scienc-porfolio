import { siteConfig } from "@/config/site";

const showcase = siteConfig.showcaseRepos.map((n) => n.toLowerCase());
export const isShowcased = (name: string) => showcase.length === 0 || showcase.includes(name.toLowerCase());
export const showcaseRank = (name: string) => {
  const i = showcase.indexOf(name.toLowerCase());
  return i === -1 ? 999 : i;
};

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
  homepage: string | null;
  updatedAt: string;
  topics: string[];
}

export interface GitHubProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  publicRepos: number;
  followers: number;
  url: string;
}

export type GitHubPayload =
  | { ok: true; profile: GitHubProfile; repos: GitHubRepo[]; fetchedAt: string }
  | { ok: false; reason: "rate_limited" | "not_found" | "error"; message: string };

/** Mirrors the GitHub REST v3 fields we read. */
interface RawRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  homepage: string | null;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
  topics?: string[];
}

interface RawUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  html_url: string;
}

/**
 * Server-side fetch. Uses GITHUB_TOKEN only if set (server env, never
 * shipped to the browser). Without it, the public 60 req/h limit applies;
 * results are cached by Next for an hour, so that is plenty.
 */
export async function fetchGitHub(username: string): Promise<GitHubPayload> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-site",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const opts = { headers, next: { revalidate: 3600 } };
  const base = `https://api.github.com/users/${encodeURIComponent(username)}`;

  try {
    const [userRes, repoRes] = await Promise.all([
      fetch(base, opts),
      fetch(`${base}/repos?per_page=100&sort=pushed&type=owner`, opts),
    ]);

    const limited = (r: Response) =>
      (r.status === 403 || r.status === 429) && r.headers.get("x-ratelimit-remaining") === "0";
    if (limited(userRes) || limited(repoRes)) {
      return { ok: false, reason: "rate_limited", message: "GitHub's hourly API limit was reached." };
    }
    if (userRes.status === 404) {
      return { ok: false, reason: "not_found", message: `No GitHub user named "${username}".` };
    }
    if (!userRes.ok || !repoRes.ok) {
      return { ok: false, reason: "error", message: `GitHub responded with ${userRes.status}/${repoRes.status}.` };
    }

    const user = (await userRes.json()) as RawUser;
    const raw = (await repoRes.json()) as RawRepo[];

    const repos: GitHubRepo[] = raw
      .filter((r) => !r.fork && !r.archived && isShowcased(r.name))
      .map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        url: r.html_url,
        homepage: r.homepage || null,
        updatedAt: r.pushed_at,
        topics: r.topics ?? [],
      }))
      .sort((a, b) => showcaseRank(a.name) - showcaseRank(b.name));

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
      repos,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return { ok: false, reason: "error", message: "Couldn't reach GitHub." };
  }
}
