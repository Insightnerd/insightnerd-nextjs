/**
 * Shared selectors, data attributes, and configuration constants
 * for scroll / interaction animations on both the landing and article pages.
 *
 * 🔧 ALL animation timing lives here — animation files import these tokens
 *    instead of using one-off values. Tune globally from this file.
 */

/* ── Section / element selectors ── */

export const SELECTORS = {
  /* Landing */
  heroSection: ".hero-section",
  heroH1: ".hero-section h1",
  heroP: ".hero-section p",
  heroCta: ".hero-cta",
  statsSection: ".stats-section",
  statItems: ".stat-item",
  topicSection: "#browse-topics",
  topicCards: ".topic-card",
  topicIcons: ".topic-icon",
  articleSection: "#latest-articles",
  articleCards: ".article-card",
  footerSection: "footer",

  /* Article */
  articleHeader: "article header",
  articleCategory: ".article-category",
  articleTitle: "article h1",
  articleMeta: "article header .meta-line",
  prose: ".prose",
  proseChildren: ".prose > *",
  coverImage: ".cover-image-wrapper",
  readingProgress: ".reading-progress-bar",
  tableOfContents: ".toc-list",
  tocLinks: ".toc-list a",
  tocActive: ".toc-list a.active",
  codeBlocks: ".prose pre",
  copyButton: ".copy-button",
  relatedSection: "#related-articles",
  relatedCarousel: ".related-carousel",
} as const;

/* ── Data attributes used by smooothy ── */
export const SLIDER_DATA = "data-slider";

/* ── StringTune attribute names ── */
export const STRING = {
  parallax: "parallax",
  magnetic: "magnetic",
  tilt: "tilt",
  split: "split",
  progress: "progress",
} as const;

/* ── GSAP easing — used across ALL animation wrappers ── */
export const EASE = "power2.out";

/* ── Animation duration tokens ── */
export const DURATION = {
  fast: 0.3,
  normal: 0.45,
  slow: 0.6,
  heroWord: 0.55,
  heroWordStagger: 0.06,
  heroParagraph: 0.5,
  heroParagraphDelay: 0.6,
  statsCard: 0.45,
  topicCard: 0.5,
  cardStagger: 0.08,
  articleStagger: 0.1,
  headerCategory: 0.4,
  headerTitle: 0.5,
  headerMeta: 0.5,
  headerMetaDelay: 0.15,
  proseBlock: 0.4,
  proseStagger: 0.05,
  pageTitle: 0.5,
  pageDescDelay: 0.15,
  contentBlock: 0.4,
  contentBlockStagger: 0.07,
} as const;

/* ── Scroll trigger defaults ── */
export const SCROLL_TRIGGER = {
  start: "top 85%",
  toggleActions: "play none none none",
} as const;
