"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type gsap from "gsap";

/**
 * GSAP scroll-triggered reveal animations for ALL category pages.
 *
 * Mirrors the homepage's HomeAnimations timing/easing so the site feels cohesive.
 * GSAP is lazy-loaded dynamically so it does NOT block first paint.
 */
export function CategoryPageAnimations({
  children,
}: {
  children: ReactNode;
}) {
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
        // 1. Category title + description — entrance on page load
        const title = scope.querySelector<HTMLElement>("h1");
        const desc = scope.querySelector<HTMLElement>("p");

        if (title) {
          gsapModule.default.from(title, {
            y: 30,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        }
        if (desc) {
          gsapModule.default.from(desc, {
            y: 20,
            opacity: 0,
            duration: 0.5,
            delay: 0.15,
            ease: "power2.out",
          });
        }

        // 2. Article cards — staggered reveal on scroll
        const cards = scope.querySelectorAll<HTMLElement>("article.group");
        if (cards.length) {
          gsapModule.default.from(cards, {
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
