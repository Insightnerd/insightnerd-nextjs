/**
 * Reduced‑motion detection — shared across all client animation wrappers.
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function onReducedMotionChange(
  callback: (reduced: boolean) => void,
): () => void {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handler = (e: MediaQueryListEvent) => callback(e.matches);
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}

/**
 * Resolves a condition while respecting reduced motion.
 * Pass the "normal" value and the "reduced" fallback.
 */
export function motionValue<T>(reduced: boolean, normal: T, fallback: T): T {
  return reduced ? fallback : normal;
}

/**
 * After all ScrollTriggers are created and refreshed, some trigger
 * elements may already be in the viewport on initial page load but
 * never receive their "enter" event. This forces those animations to
 * complete immediately so elements don't stay permanently invisible.
 *
 * Call this AFTER `ScrollTrigger.refresh()` in every page-level
 * animation component, passing the ScrollTrigger instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function flushInViewScrollTriggers(ScrollTrigger: any): void {
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();

    // Second frame ensures all positions are settled
    requestAnimationFrame(() => {
      const triggers = ScrollTrigger.getAll();
      for (const st of triggers) {
        if (
          st.animation &&
          st.progress === 0 &&
          st.trigger &&
          st.trigger.getBoundingClientRect().top < window.innerHeight
        ) {
          st.animation.progress(1);
        }
      }
    });
  });
}
