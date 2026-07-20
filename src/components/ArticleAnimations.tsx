"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type gsap from "gsap";

/**
 * Subtle entry animations + reading-progress bar for article pages.
 *
 * Animates the header (category badge, title, meta) on load, then attaches
 * a thin scroll-linked progress bar — no body-content animations.
 * GSAP is lazy-loaded so it does NOT block first paint.
 */
export function ArticleAnimations({ children }: { children: ReactNode }) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: gsap.Context | null = null;

    const init = async () => {
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsapModule.default.registerPlugin(ScrollTrigger);

      const scope = scopeRef.current;
      const progress = progressRef.current;
      if (!scope || !progress) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      ctx = gsapModule.default.context(() => {
        /* ---------- 1. Header entrance ---------- */
        if (!prefersReduced) {
          const header = scope.querySelector("header");
          if (header) {
            const category = header.querySelector<HTMLElement>(".article-category");
            const title = header.querySelector<HTMLElement>("h1");
            const meta = header.querySelector<HTMLElement>(".flex");

            if (category) {
              gsapModule.default.from(category, {
                y: 12,
                opacity: 0,
                duration: 0.4,
                ease: "power2.out",
              });
            }
            if (title) {
              gsapModule.default.from(title, {
                y: 30,
                opacity: 0,
                duration: 0.5,
                ease: "power2.out",
              });
            }
            if (meta) {
              gsapModule.default.from(meta, {
                y: 16,
                opacity: 0,
                duration: 0.5,
                delay: 0.15,
                ease: "power2.out",
              });
            }
          }
        } else {
          const header = scope.querySelector("header");
          if (header) {
            const category = header.querySelector<HTMLElement>(".article-category");
            const title = header.querySelector<HTMLElement>("h1");
            const meta = header.querySelector<HTMLElement>(".flex");
            category?.style.setProperty("opacity", "1");
            title?.style.setProperty("opacity", "1");
            meta?.style.setProperty("opacity", "1");
          }
        }

        /* ---------- 2. Reading progress bar ---------- */
        const article = scope.querySelector("article");
        if (article) {
          gsapModule.default.to(progress, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: article,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
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
    <>
      <div
        ref={progressRef}
        className="fixed top-0 left-0 w-full h-[3px] z-[60] scale-x-0 origin-left pointer-events-none"
        style={{ background: "var(--primary)", opacity: 0.5 }}
        aria-hidden="true"
      />
      <div ref={scopeRef} className="contents">
        {children}
      </div>
    </>
  );
}
