"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

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
 * Sits above the article/category-page title.
 */
export function CategoryBanner({ category }: CategoryBannerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { icon, gradient } = categoryMeta[category] ?? defaultMeta;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    gsap.from(el, {
      opacity: 0,
      y: -12,
      duration: 0.5,
      ease: "power2.out",
    });
  }, []);

  return (
    <div
      ref={ref}
      className="relative h-40 rounded-xl overflow-hidden mb-8 flex items-center justify-center"
      style={{ background: gradient }}
      aria-hidden="true"
    >
      <span className="text-5xl md:text-6xl select-none">{icon}</span>
    </div>
  );
}
