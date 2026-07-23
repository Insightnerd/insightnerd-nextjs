"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type gsap from "gsap";
import {
  prefersReducedMotion,
  flushInViewScrollTriggers,
} from "@/lib/animations/reduced-motion";
import { DURATION, EASE, SCROLL_TRIGGER } from "@/lib/animations/constants";

/* ─── Track StringTune init across component instances ─── */
const stringTuneModules = new Set<string>();

export function HomeAnimations({ children }: { children: ReactNode }) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: gsap.Context | null = null;

    const init = async () => {
      const scope = scopeRef.current;
      if (!scope) return;

      /* ── 1. StringTune: magnetic + tilt + parallax ── */
      if (!stringTuneModules.has("landing")) {
        const mod = await import("@fiddle-digital/string-tune");
        const st = mod.StringTune.getInstance();
        st.scrollDesktopMode = "default";
        st.scrollMobileMode = "default";
        st.use(mod.StringMagnetic);
        st.use(mod.StringTilt);
        st.use(mod.StringParallax);
        st.start(60);
        stringTuneModules.add("landing");
      }

      /* ── 1b. Set StringTune attributes programmatically ── */
      scope
        .querySelectorAll(".hero-cta")
        .forEach((el) => el.setAttribute("string", "magnetic"));
      scope
        .querySelectorAll(".stat-item")
        .forEach((el) => {
          el.setAttribute("string", "magnetic");
          el.setAttribute("string-cursor-target", "");
        });
      scope
        .querySelectorAll(".topic-card")
        .forEach((el) => {
          el.setAttribute("string", "tilt");
          el.setAttribute("string-factor", "8");
        });

      /* ── 1c. Trigger StringTune DOM re-scan ── */
      const { StringTune } = await import("@fiddle-digital/string-tune");
      StringTune.getInstance().onRebuild();

      /* ── 2. GSAP entrance animations ── */
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsapModule.default.registerPlugin(ScrollTrigger);

      const reduced = prefersReducedMotion();

      ctx = gsapModule.default.context(() => {
        /* ── Hero word‑split ── */
        if (!reduced) {
          const heroH1 = scope.querySelector<HTMLElement>(
            ".hero-section h1[data-split]",
          );
          if (heroH1) {
            const text = heroH1.textContent || "";
            const words = text.trim().split(/\s+/);

            heroH1.innerHTML = words
              .map(
                (w) =>
                  `<span class="max-h1-word" style="opacity:0">${w}</span>`,
              )
              .join("\u00A0");

            const children = heroH1.children;

            gsapModule.default.fromTo(
              children,
              { y: 28, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: DURATION.heroWord,
                stagger: DURATION.heroWordStagger,
                ease: EASE,
                onComplete: () => {
                  /* ── Safety net: ensure text stays above Spline canvas ── */
                  const textWrapper = scope.querySelector<HTMLElement>(
                    ".hero-text-wrapper",
                  );
                  if (textWrapper) {
                    textWrapper.style.setProperty("z-index", "20", "important");
                    textWrapper.style.pointerEvents = "auto";
                  }
                },
              },
            );
          }

          const heroP = scope.querySelector<HTMLElement>(".hero-section p");
          if (heroP) {
            gsapModule.default.from(heroP, {
              y: 16,
              opacity: 0,
              duration: DURATION.heroParagraph,
              delay: DURATION.heroParagraphDelay,
              ease: EASE,
            });
          }
        }

        /* ── Stats strip stagger ── */
        const statItems = scope.querySelectorAll<HTMLElement>(".stat-item");
        if (statItems.length) {
          gsapModule.default.from(statItems, {
            y: 24,
            opacity: 0,
            duration: DURATION.statsCard,
            stagger: DURATION.cardStagger,
            ease: EASE,
            scrollTrigger: {
              trigger: scope.querySelector(".stats-section"),
              start: SCROLL_TRIGGER.start,
              toggleActions: SCROLL_TRIGGER.toggleActions,
            },
          });
        }

        /* ── Topic cards reveal ── */
        const topicCards =
          scope.querySelectorAll<HTMLElement>(".topic-card");
        if (topicCards.length) {
          gsapModule.default.from(topicCards, {
            y: 30,
            opacity: 0,
            duration: DURATION.topicCard,
            stagger: DURATION.cardStagger,
            ease: EASE,
            scrollTrigger: {
              trigger: scope.querySelector("#browse-topics"),
              start: SCROLL_TRIGGER.start,
              toggleActions: SCROLL_TRIGGER.toggleActions,
            },
          });
        }

        /* ── Latest articles stagger ── */
        const articleSection = scope.querySelector("#latest-articles");
        if (articleSection) {
          const cards =
            articleSection.querySelectorAll<HTMLElement>(".article-card");
          if (cards.length) {
            gsapModule.default.from(cards, {
              y: 24,
              opacity: 0,
              duration: DURATION.normal,
              stagger: DURATION.articleStagger,
              ease: EASE,
              scrollTrigger: {
                trigger: articleSection,
                start: SCROLL_TRIGGER.start,
                toggleActions: SCROLL_TRIGGER.toggleActions,
              },
            });
          }
        }
      }, scope);

      ScrollTrigger.refresh();
      flushInViewScrollTriggers(ScrollTrigger);
    };

    init();

    return () => {
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={scopeRef} className="contents">
      {children}
    </div>
  );
}
