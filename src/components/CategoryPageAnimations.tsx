"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP scroll-triggered reveal animations for ALL category pages.
 *
 * Mirrors the homepage's HomeAnimations timing/easing so the site feels cohesive:
 *  - Title + description: fade+slide up on page load
 *  - Article cards: staggered fade+slide up via ScrollTrigger
 */
export function CategoryPageAnimations({
  children,
}: {
  children: ReactNode;
}) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const ctx = gsap.context(() => {
      // 1. Category title + description — entrance on page load
      const title = scope.querySelector<HTMLElement>("h1");
      const desc = scope.querySelector<HTMLElement>("p");

      if (title) {
        gsap.from(title, {
          y: 30,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      }
      if (desc) {
        gsap.from(desc, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          delay: 0.15,
          ease: "power2.out",
        });
      }

      // 2. Article cards — staggered reveal on scroll
      const cards =
        scope.querySelectorAll<HTMLElement>("article.group");
      if (cards.length) {
        gsap.from(cards, {
          y: 24,
          opacity: 0,
          duration: 0.45,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cards[0].parentElement,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      }
    }, scope);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <div ref={scopeRef} className="contents">
      {children}
    </div>
  );
}
