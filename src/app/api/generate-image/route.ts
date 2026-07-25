import { NextRequest, NextResponse } from "next/server";
import { getPostMeta } from "@/lib/posts";

const categoryAccents: Record<string, { h: number; s: number; l: number }> = {
  AI: { h: 260, s: 85, l: 60 },
  Coding: { h: 40, s: 85, l: 55 },
  "Data Analytics": { h: 160, s: 70, l: 50 },
  Tutorials: { h: 190, s: 80, l: 55 },
  Career: { h: 330, s: 75, l: 55 },
};

const defaultAccent = { h: 28, s: 62, l: 56 };

function generateSVG(title: string, category: string, date: string, readingTime: number): string {
  const accent = categoryAccents[category] ?? defaultAccent;
  const lines: string[] = [];
  const words = title.split(/\s+/);
  let line = "";
  for (const w of words) {
    if ((line + " " + w).length > 45) {
      lines.push(line);
      line = w;
    } else {
      line = (line ? line + " " : "") + w;
    }
  }
  if (line) lines.push(line);

  const lineHeight = 58;
  const textY = 240 - ((lines.length - 1) * lineHeight) / 2;

  const titleLines = lines
    .map(
      (l, i) =>
        `<text x="240" y="${textY + i * lineHeight}" font-family="Inter, system-ui, sans-serif" font-size="36" font-weight="700" fill="white" letter-spacing="-0.5">${l.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</text>`,
    )
    .join("\n      ");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${accent.h} ${accent.s}% ${Math.max(accent.l - 15, 5)}%)" />
      <stop offset="100%" stop-color="hsl(${accent.h} ${accent.s}% ${Math.max(accent.l - 35, 5)}%)" />
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${accent.h} ${accent.s}% ${accent.l + 10}% / 0.15)" />
      <stop offset="100%" stop-color="transparent" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" rx="0" />
  <circle cx="100" cy="100" r="300" fill="url(#glow)" />
  <circle cx="1100" cy="500" r="250" fill="url(#glow)" />
  <rect x="0" y="0" width="1200" height="630" fill="url(#grid)" opacity="0.05" />
  <line x1="0" y1="80" x2="400" y2="80" stroke="hsl(${accent.h} ${accent.s}% ${accent.l + 20}% / 0.4)" stroke-width="3" />
  <text x="240" y="140" font-family="Inter, system-ui, sans-serif" font-size="18" font-weight="600" fill="hsl(${accent.h} ${accent.s}% ${accent.l + 25}%)" letter-spacing="3" text-transform="uppercase">${category.toUpperCase()}</text>
  ${titleLines}
  <text x="240" y="460" font-family="Inter, system-ui, sans-serif" font-size="16" fill="hsl(0 0% 100% / 0.6)">
    ${new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · ${readingTime} min read
  </text>
  <rect x="240" y="500" width="180" height="32" rx="16" fill="hsl(0 0% 100% / 0.1)" />
  <text x="330" y="521" font-family="Inter, system-ui, sans-serif" font-size="13" font-weight="600" fill="hsl(0 0% 100% / 0.7)" text-anchor="middle">InsightNerd</text>
</svg>`;
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return new NextResponse("Missing slug parameter", { status: 400 });
  }

  const post = getPostMeta(slug);
  if (!post) {
    return new NextResponse("Post not found", { status: 404 });
  }

  const svg = generateSVG(post.title, post.categories[0] || "", post.date, post.reading_time);

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
