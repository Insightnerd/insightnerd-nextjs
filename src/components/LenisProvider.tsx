"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type Lenis from "lenis";

/**
 * Smooth-scroll provider using Lenis, synced with GSAP ScrollTrigger.
 *
 * Both Lenis and GSAP are lazy-loaded after first paint so they do NOT
 * block the initial render — smooth scrolling is a progressive enhancement.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    let lenisInstance: Lenis | null = null;

    const init = async () => {
      const [LenisModule, gsapModule] = await Promise.all([
        import("lenis"),
        import("gsap"),
      ]);
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      const Lenis = LenisModule.default;
      const gsap = gsapModule.default;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis();
      lenisInstance = lenis;

      // Sync ScrollTrigger with Lenis scroll position
      lenis.on("scroll", ScrollTrigger.update);

      // Tell ScrollTrigger to read scroll from Lenis, not window
      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value) {
          if (arguments.length) {
            lenis.scrollTo(value as number, { immediate: true });
          }
          return lenis.scroll;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        pinType: document.body.style.transform ? "transform" : "fixed",
      });

      // Drive Lenis rAF from GSAP's ticker so they stay in sync
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      initialized.current = true;
    };

    // Defer init until after first paint so Lenis + GSAP don't block
    const timer = setTimeout(init, 200);

    return () => {
      clearTimeout(timer);
      if (lenisInstance) {
        lenisInstance.destroy();
        initialized.current = false;
      }
    };
  }, []);

  return <>{children}</>;
}
