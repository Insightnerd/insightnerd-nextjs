"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Entry animations for utility pages (About, Contact).
 *
 * - Page heading (h1): fade + slide up on load.
 * - Prose paragraphs, headings + card blocks: staggered reveal on scroll.
 * - No individual text-line animations — body content stays readable.
 */
export function ContentPageAnimations({
  children,
}: {
  children: ReactNode;
}) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      /* ---------- 1. Page heading — entrance on page load ---------- */
      if (!prefersReduced) {
        const h1 = scope.querySelector<HTMLElement>("h1");
        if (h1) {
          gsap.from(h1, {
            y: 30,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      }

      /* ---------- 2. Content blocks — staggered scroll reveal ---------- */
      if (!prefersReduced) {
        const contentBlocks = scope.querySelectorAll<HTMLElement>(
          ".prose > *, .bg-card"
        );
        if (contentBlocks.length) {
          // Set initial state so content starts hidden
          gsap.set(contentBlocks, { opacity: 0, y: 20 });

          gsap.to(contentBlocks, {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.07,
            ease: "power2.out",
            scrollTrigger: {
              trigger: contentBlocks[0].parentElement,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        }
      } else {
        // Reduced motion: ensure everything is fully visible
        const contentBlocks = scope.querySelectorAll<HTMLElement>(
          ".prose > *, .bg-card"
        );
        contentBlocks.forEach((el) => {
          el.style.setProperty("opacity", "1");
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
