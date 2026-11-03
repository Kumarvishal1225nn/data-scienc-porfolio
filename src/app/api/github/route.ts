import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { fetchGitHub } from "@/lib/github";

export const revalidate = 3600;

export async function GET() {
  const data = await fetchGitHub(siteConfig.githubUsername);
  return NextResponse.json(data, {
    headers: {
      // Cache at the edge for an hour; serve stale while refreshing.
      "Cache-Control": data.ok
        ? "public, s-maxage=3600, stale-while-revalidate=86400"
        : "public, s-maxage=300",
    },
  });
}
