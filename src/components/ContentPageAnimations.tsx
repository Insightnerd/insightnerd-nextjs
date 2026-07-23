"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type gsap from "gsap";
import { DURATION, EASE, SCROLL_TRIGGER } from "@/lib/animations/constants";

/**
 * Entry animations for utility pages (About, Contact).
 *
 * - Page heading (h1): fade + slide up on load.
 * - Prose paragraphs, headings + card blocks: staggered reveal on scroll.
 * - GSAP is lazy-loaded so it does NOT block first paint.
 */
export function ContentPageAnimations({
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

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      ctx = gsapModule.default.context(() => {
        /* ---------- 1. Page heading — entrance on page load ---------- */
        if (!prefersReduced) {
          const h1 = scope.querySelector<HTMLElement>("h1");
          if (h1) {
            gsapModule.default.from(h1, {
              y: 30,
              opacity: 0,
              duration: DURATION.pageTitle,
              ease: EASE,
            });
          }
        }

        /* ---------- 2. Content blocks — staggered scroll reveal ---------- */
        if (!prefersReduced) {
          const contentBlocks = scope.querySelectorAll<HTMLElement>(
            ".prose > *, .bg-card"
          );
          if (contentBlocks.length) {
            gsapModule.default.set(contentBlocks, { opacity: 0, y: 20 });

            gsapModule.default.to(contentBlocks, {
              y: 0,
              opacity: 1,
              duration: DURATION.contentBlock,
              stagger: DURATION.contentBlockStagger,
              ease: EASE,
              scrollTrigger: {
                trigger: contentBlocks[0].parentElement,
                start: SCROLL_TRIGGER.start,
                toggleActions: SCROLL_TRIGGER.toggleActions,
              },
            });
          }
        } else {
          const contentBlocks = scope.querySelectorAll<HTMLElement>(
            ".prose > *, .bg-card"
          );
          contentBlocks.forEach((el) => {
            el.style.setProperty("opacity", "1");
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
