"use client"

import { useEffect, useRef } from "react";

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
      return;
    }

    const offsetY = direction === "up" ? 30 : direction === "down" ? -30 : 0;
    const offsetX = direction === "left" ? -30 : direction === "right" ? 30 : 0;

    element.style.opacity = "0";
    element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    element.style.transition = `opacity 600ms ease-out, transform 600ms ease-out`;
    element.style.transitionDelay = `${delay * 100}ms`;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.style.opacity = "1";
            element.style.transform = "translate(0, 0)";
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay, direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
