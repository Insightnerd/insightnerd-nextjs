"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type gsap from "gsap";

/**
 * GSAP scroll-triggered reveal animations for the homepage only.
 * GSAP is lazy-loaded dynamically so it does NOT block first paint.
 */
export function HomeAnimations({ children }: { children: ReactNode }) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: gsap.Context | null = null;

    const init = async () => {
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsapModule.default.registerPlugin(ScrollTrigger);

      const scope = scopeRef.current;
      if (!scope) return;

      ctx = gsapModule.default.context(() => {
        // 1. Hero entrance on page load
        const heroH1 = scope.querySelector<HTMLElement>(".hero-section h1");
        const heroP = scope.querySelector<HTMLElement>(".hero-section p");

        if (heroH1) {
          gsapModule.default.from(heroH1, {
            y: 30,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        }
        if (heroP) {
          gsapModule.default.from(heroP, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            delay: 0.15,
            ease: "power2.out",
          });
        }

        // 2. Stats cards — staggered fade+slide up on scroll
        const statItems = scope.querySelectorAll<HTMLElement>(".stat-item");
        if (statItems.length) {
          gsapModule.default.from(statItems, {
            y: 24,
            opacity: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: scope.querySelector(".stats-section"),
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        }

        // 3. Article cards — staggered fade+slide up on scroll
        const articleCards = scope.querySelectorAll<HTMLElement>(".article-card");
        if (articleCards.length) {
          gsapModule.default.from(articleCards, {
            y: 24,
            opacity: 0,
            duration: 0.45,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: scope.querySelector("#latest-articles"),
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        }
      }, scope);

      ScrollTrigger.refresh();
    };

    init();

    return () => ctx?.revert();
  }, []);

  return (
    <div ref={scopeRef} className="contents">
      {children}
    </div>
  );
}
