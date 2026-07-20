"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * CSS-only page transition wrapper.
 *
 * Replaces framer-motion AnimatePresence with a lightweight opacity
 * transition, eliminating ~30KB+ of JS from the critical bundle
 * while preserving the same fade-in behavior on route change.
 *
 * - Fades in new page content on route change.
 * - Respects prefers-reduced-motion.
 * - Does NOT wrap Navigation/Footer — only the <main> content area.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [reduced, setReduced] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      // Brief flash-out then fade-in on route change
      setIsVisible(false);
      const timer = setTimeout(() => setIsVisible(true), reduced ? 0 : 40);
      return () => clearTimeout(timer);
    }
  }, [pathname, reduced]);

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: reduced
          ? "none"
          : "opacity 0.25s ease-out",
      }}
    >
      {children}
    </div>
  );
}
