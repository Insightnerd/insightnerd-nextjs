"use client";

import { Bot, Code2, BarChart3, BookOpen, Target } from "lucide-react";

interface CategoryMeta {
  icon: React.ElementType;
  gradient: string;
}

const categoryMeta: Record<string, CategoryMeta> = {
  AI: {
    icon: Bot,
    gradient: "linear-gradient(135deg, hsl(260 85% 60% / 0.2), hsl(220 85% 60% / 0.1))",
  },
  Coding: {
    icon: Code2,
    gradient: "linear-gradient(135deg, hsl(40 85% 55% / 0.2), hsl(30 85% 50% / 0.1))",
  },
  "Data Analytics": {
    icon: BarChart3,
    gradient: "linear-gradient(135deg, hsl(160 70% 50% / 0.2), hsl(180 70% 50% / 0.1))",
  },
  Tutorials: {
    icon: BookOpen,
    gradient: "linear-gradient(135deg, hsl(190 80% 55% / 0.2), hsl(200 80% 50% / 0.1))",
  },
  Career: {
    icon: Target,
    gradient: "linear-gradient(135deg, hsl(330 75% 55% / 0.2), hsl(20 80% 55% / 0.1))",
  },
};

const defaultMeta: CategoryMeta = {
  icon: Target,
  gradient: "linear-gradient(135deg, hsl(260 85% 60% / 0.15), hsl(220 85% 60% / 0.08))",
};

interface CategoryBannerProps {
  category: string;
}

export function CategoryBanner({ category }: CategoryBannerProps) {
  const { icon: Icon, gradient } = categoryMeta[category] ?? defaultMeta;

  return (
    <div
      className="relative h-40 rounded-xl overflow-hidden mb-8 flex items-center justify-center
                 animate-in fade-in slide-in-from-top-3 duration-500"
      style={{ background: gradient }}
      aria-hidden="true"
    >
      <Icon size={48} strokeWidth={1.2} className="opacity-60" />
    </div>
  );
}
