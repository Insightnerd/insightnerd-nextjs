"use client"

import { useEffect, useRef } from "react";
import { animate } from "animejs";

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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const offsetY = direction === "up" ? 30 : direction === "down" ? -30 : 0;
            const offsetX = direction === "left" ? -30 : direction === "right" ? 30 : 0;

            animate(element, {
              opacity: [0, 1],
              translateY: [offsetY, 0],
              translateX: [offsetX, 0],
              easing: "easeOutQuad",
              duration: 600,
              delay: delay * 100,
              complete: () => {
                observer.disconnect();
              },
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [delay, direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
