"use client";

/* ─── Category metadata ─── */

interface CategoryMeta {
  icon: string;
  gradient: string;
}

const categoryMeta: Record<string, CategoryMeta> = {
  AI: {
    icon: "🤖",
    gradient: "linear-gradient(135deg, hsl(260 85% 60% / 0.2), hsl(220 85% 60% / 0.1))",
  },
  Coding: {
    icon: "💻",
    gradient: "linear-gradient(135deg, hsl(40 85% 55% / 0.2), hsl(30 85% 50% / 0.1))",
  },
  "Data Analytics": {
    icon: "📊",
    gradient: "linear-gradient(135deg, hsl(160 70% 50% / 0.2), hsl(180 70% 50% / 0.1))",
  },
  Tutorials: {
    icon: "📚",
    gradient: "linear-gradient(135deg, hsl(190 80% 55% / 0.2), hsl(200 80% 50% / 0.1))",
  },
  Career: {
    icon: "🎯",
    gradient: "linear-gradient(135deg, hsl(330 75% 55% / 0.2), hsl(20 80% 55% / 0.1))",
  },
};

const defaultMeta: CategoryMeta = {
  icon: "📄",
  gradient: "linear-gradient(135deg, hsl(260 85% 60% / 0.15), hsl(220 85% 60% / 0.08))",
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
  const { icon, gradient } = categoryMeta[category] ?? defaultMeta;

  return (
    <div
      className="relative h-40 rounded-xl overflow-hidden mb-8 flex items-center justify-center
                 animate-in fade-in slide-in-from-top-3 duration-500"
      style={{ background: gradient }}
      aria-hidden="true"
    >
      <span className="text-5xl md:text-6xl select-none">{icon}</span>
    </div>
  );
}
