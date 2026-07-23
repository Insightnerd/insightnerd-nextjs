"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type gsap from "gsap";
import {
  prefersReducedMotion,
  flushInViewScrollTriggers,
} from "@/lib/animations/reduced-motion";
import { DURATION, EASE, SCROLL_TRIGGER } from "@/lib/animations/constants";

const stringTuneModules = new Set<string>();

export function ArticleAnimations({ children }: { children: ReactNode }) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: gsap.Context | null = null;
    let rafId = 0;
    let slider: any = null;
    let tocObserver: IntersectionObserver | null = null;
    let active = true;

    const init = async () => {
      const scope = scopeRef.current;
      if (!scope) return;

      /* ── 1. StringTune: parallax + progress ── */
      if (!stringTuneModules.has("article")) {
        const mod = await import("@fiddle-digital/string-tune");
        const st = mod.StringTune.getInstance();
        st.scrollDesktopMode = "default";
        st.scrollMobileMode = "default";
        st.use(mod.StringParallax);
        st.use(mod.StringProgress);
        st.start(60);
        stringTuneModules.add("article");
      }

      /* ── 1b. Set StringTune attributes programmatically ── */
      scope
        .querySelectorAll(".cover-image-wrapper")
        .forEach((el) => {
          el.setAttribute("string", "parallax");
          el.setAttribute("string-factor", "0.25");
        });

      /* ── 1c. Trigger StringTune DOM re-scan ── */
      const { StringTune } = await import("@fiddle-digital/string-tune");
      StringTune.getInstance().onRebuild();

      /* ── 2. GSAP entrance + content reveal + carousel ── */
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsapModule.default.registerPlugin(ScrollTrigger);

      const reduced = prefersReducedMotion();

      ctx = gsapModule.default.context(() => {
        /* ── 2a. Header entrance ── */
        const header = scope.querySelector("header");
        if (header) {
          const category = header.querySelector<HTMLElement>(
            ".article-category",
          );
          const title = header.querySelector<HTMLElement>("h1");
          const meta = header.querySelector<HTMLElement>(".meta-line");

          if (!reduced) {
            if (category) {
              gsapModule.default.from(category, {
                y: 12,
                opacity: 0,
                duration: DURATION.headerCategory,
                ease: EASE,
              });
            }
            if (title) {
              gsapModule.default.from(title, {
                y: 30,
                opacity: 0,
                duration: DURATION.headerTitle,
                ease: EASE,
              });
            }
            if (meta) {
              gsapModule.default.from(meta, {
                y: 16,
                opacity: 0,
                duration: DURATION.headerMeta,
                delay: DURATION.headerMetaDelay,
                ease: EASE,
              });
            }
          } else {
            category?.style.setProperty("opacity", "1");
            title?.style.setProperty("opacity", "1");
            meta?.style.setProperty("opacity", "1");
          }
        }

        /* ── 2b. Content reveal scroll‑triggered ── */
        if (!reduced) {
          const prose = scope.querySelector<HTMLElement>(".prose");
          if (prose) {
            const els = prose.querySelectorAll<HTMLElement>(
              "h2, h3, p, pre, ul, ol, blockquote, img, table, hr",
            );
            if (els.length) {
              gsapModule.default.from(els, {
                y: 20,
                opacity: 0,
                duration: DURATION.proseBlock,
                stagger: DURATION.proseStagger,
                ease: EASE,
                scrollTrigger: {
                  trigger: prose,
                  start: "top 88%",
                  toggleActions: SCROLL_TRIGGER.toggleActions,
                },
              });
            }
          }
        }
      }, scope);

      ScrollTrigger.refresh();
      flushInViewScrollTriggers(ScrollTrigger);

      /* ── 2b‑bis. Re‑refresh after all images finish loading ── */
      {
        const imgs = scope.querySelectorAll<HTMLImageElement>("img");
        if (imgs.length > 0) {
          let loaded = 0;
          const onImageDone = () => {
            if (!active) return;
            loaded++;
            if (loaded >= imgs.length) {
              requestAnimationFrame(() => {
                if (!active) return;
                ScrollTrigger.refresh();
                requestAnimationFrame(() => {
                  if (!active) return;
                  ScrollTrigger.refresh();
                  flushInViewScrollTriggers(ScrollTrigger);
                  import("@fiddle-digital/string-tune").then(
                    ({ StringTune }) => {
                      if (!active) return;
                      StringTune.getInstance().onRebuild();
                    },
                  );
                });
              });
            }
          };
          imgs.forEach((img) => {
            if (img.complete) {
              onImageDone();
            } else {
              img.addEventListener("load", onImageDone, { once: true });
              img.addEventListener("error", onImageDone, { once: true });
            }
          });
        }
      }

      /* ── 2c. TOC generation + scroll‑spy ── */
      const prose = scope.querySelector(".prose");
      const tocList = scope.querySelector<HTMLElement>("[data-toc-list]");
      if (prose && tocList) {
        const headings = prose.querySelectorAll<HTMLElement>("h2, h3");
        if (headings.length > 0) {
          const items: HTMLElement[] = [];
          headings.forEach((h) => {
            const id = h.textContent
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "");
            if (id && !h.id) {
              h.id = id;
            }

            const tag = h.tagName.toLowerCase();
            const li = document.createElement("a");
            li.href = `#${h.id || ""}`;
            li.textContent = h.textContent || "";
            li.className = `toc-link ${tag === "h3" ? "toc-h3" : "toc-h2"}`;
            tocList.appendChild(li);
            items.push(li);
          });

          if (items.length > 0 && !reduced) {
            tocObserver = new IntersectionObserver(
              (entries) => {
                let active = "";
                for (const e of entries) {
                  if (e.isIntersecting) {
                    active = e.target.getAttribute("id") || "";
                  }
                }
                items.forEach((a) => {
                  const href = a.getAttribute("href")?.slice(1) || "";
                  a.classList.toggle("active", href === active);
                });
              },
              {
                rootMargin: "-80px 0px -60% 0px",
                threshold: 0,
              },
            );
            headings.forEach((h) => tocObserver?.observe(h));
          }
        } else {
          /* ── No headings — hide the TOC wrapper ── */
          const tocWrapper = scope.querySelector<HTMLElement>("[data-toc]");
          tocWrapper?.style.setProperty("display", "none");
        }
      }

      /* ── 2d. Code‑block copy buttons ── */
      const pres = scope.querySelectorAll<HTMLElement>(".prose pre");
      pres.forEach((pre) => {
        pre.style.position = "relative";
        const btn = document.createElement("button");
        btn.className = "copy-button";
        btn.textContent = "Copy";
        btn.setAttribute("aria-label", "Copy code to clipboard");
        pre.appendChild(btn);

        btn.addEventListener("click", async () => {
          const code = pre.querySelector("code");
          const text = code?.textContent || pre.textContent || "";
          try {
            await navigator.clipboard.writeText(text);
            btn.textContent = "Copied!";
            btn.classList.add("copied");
            setTimeout(() => {
              btn.textContent = "Copy";
              btn.classList.remove("copied");
            }, 2000);
          } catch {
            btn.textContent = "Failed";
            setTimeout(() => {
              btn.textContent = "Copy";
            }, 2000);
          }
        });
      });

      /* ── 2e. Related‑articles carousel ── */
      const carouselEl = scope.querySelector<HTMLElement>(
        '[data-slider="related"]',
      );
      if (carouselEl) {
        const { default: Core } = await import("smooothy");
        slider = new Core(carouselEl, {
          infinite: false,
          snap: true,
          dragSensitivity: 0.005,
          scrollSensitivity: 1,
          lerpFactor: 0.25,
        });
        const loop = () => {
          if (!slider) return;
          slider.update();
          rafId = requestAnimationFrame(loop);
        };
        rafId = requestAnimationFrame(loop);
      }
    };

    init();

    return () => {
      active = false;
      ctx?.revert();
      tocObserver?.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      slider?.destroy();
    };
  }, []);

  return (
    <div ref={scopeRef} className="contents">
      {children}
    </div>
  );
}
