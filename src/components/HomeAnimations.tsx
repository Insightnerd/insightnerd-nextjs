"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP scroll-triggered reveal animations for the homepage only.
 * Renders invisible wrapper divs whose refs act as trigger scopes.
 */
export function HomeAnimations({ children }: { children: ReactNode }) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const ctx = gsap.context(() => {
      // 1. Hero entrance on page load
      const heroH1 = scope.querySelector<HTMLElement>(".hero-section h1");
      const heroP = scope.querySelector<HTMLElement>(".hero-section p");

      if (heroH1) {
        gsap.from(heroH1, {
          y: 30,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      }
      if (heroP) {
        gsap.from(heroP, {
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
        gsap.from(statItems, {
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
        gsap.from(articleCards, {
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
    }, scope); // scope all queries to this wrapper

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <div ref={scopeRef} className="contents">
      {children}
    </div>
  );
}
