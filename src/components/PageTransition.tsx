"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * Wraps page content with a fade + slight slide transition on route change.
 *
 * - Exit (old page) fades/slides out, then Enter (new page) fades/slides in.
 * - Uses AnimatePresence mode="wait" so content never overlaps.
 * - Respects prefers-reduced-motion: skips animation entirely.
 * - Does NOT wrap Navigation/Footer — only the <main> content area.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={reduced ? {} : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduced ? {} : { opacity: 0, y: -8 }}
        transition={{ duration: reduced ? 0 : 0.25, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
