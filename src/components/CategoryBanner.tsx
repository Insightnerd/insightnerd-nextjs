"use client";

/* ─── Category metadata ─── */

interface CategoryMeta {
  gradient: string;
}

const categoryMeta: Record<string, CategoryMeta> = {
  AI: {
    gradient: "linear-gradient(135deg, hsl(28 62% 56% / 0.2), hsl(220 85% 60% / 0.1))",
  },
  Coding: {
    gradient: "linear-gradient(135deg, hsl(38 80% 55% / 0.25), hsl(28 62% 56% / 0.1))",
  },
  "Data Analytics": {
    gradient: "linear-gradient(135deg, hsl(160 70% 50% / 0.2), hsl(28 62% 56% / 0.1))",
  },
  Tutorials: {
    gradient: "linear-gradient(135deg, hsl(190 80% 55% / 0.2), hsl(38 80% 55% / 0.1))",
  },
  Career: {
    gradient: "linear-gradient(135deg, hsl(330 75% 55% / 0.2), hsl(28 62% 56% / 0.1))",
  },
};

const defaultMeta: CategoryMeta = {
  gradient: "linear-gradient(135deg, hsl(28 62% 56% / 0.15), hsl(38 80% 55% / 0.08))",
};

/* ─── Component ─── */

interface CategoryBannerProps {
  /** Category name used to look up icon + gradient (e.g. "AI", "Data Analytics") */
  category: string;
}

/**
 * Full-width gradient banner with a large category emoji.
 * Uses CSS animation instead of GSAP to avoid pulling in the full GSAP bundle
 * for a simple opacity fade.
 */
export function CategoryBanner({ category }: CategoryBannerProps) {
  const { gradient } = categoryMeta[category] ?? defaultMeta;

  return (
    <div
      className="relative h-40 rounded-xl overflow-hidden mb-8 flex items-center justify-center
                 animate-in fade-in slide-in-from-top-3 duration-500"
      style={{ background: gradient }}
      aria-hidden="true"
    />
  );
}
