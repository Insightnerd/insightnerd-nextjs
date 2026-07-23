# InsightNerd Design System

> Generated from full codebase audit — `globals.css`, `tailwind.config.ts`, and all component files.
> Last updated: 2026-07-23

---

## 1. Color System

### Brand Audit

Before proposing a new palette, I audited every current brand touchpoint for existing color commitment:

| Touchpoint | Status |
|---|---|
| Nav logo (`Navigation.tsx` line 23) | Plain `text-xl font-bold` — **no color** |
| Footer logo (`Footer.tsx` lines 35–40) | Purple accent on `</>` tag + "Nerd" (`hsl(260 100% 65%)`) |
| `favicon.ico` | Default Next.js binary — **no brand color** |
| OG image (`/og-image.png`) | Undetermined (binary) |

**Verdict**: No strong brand color commitment. The nav logo — the most visible brand element — is completely uncolored. Only the footer carries a purple accent, and that appears once per page below the fold. The tagline "Decode the signal. Skip the noise." reinforces a **signal/clarity** motif.

### Proposed Replacement Palette — "Signal Amber"

**Why amber?**
1. **Thematic fit** — "Decode the signal" pairs naturally with amber (amber light, signal fire, radar ping). It's a literal *signal* color.
2. **Warm anchor in cool-neutral context** — the dark theme uses cool greys (`--background: #0A0A0B`). A warm amber accent creates deliberate temperature contrast — the eye naturally lands on it.
3. **Editorial warmth** — amber feels curated and inviting for a blog, unlike blue (corporate) or purple (fantasy/gaming).
4. **Distinctive** — most tech blogs use blue or purple. Amber carves a visual niche.
5. **Accessible** — amber on dark backgrounds achieves strong contrast ratios. The light theme uses a deeper burnt-orange variant to maintain readability on white.

### Dark Theme (default)

| Token | Hex | HSL | Usage | Rationale |
|---|---|---|---|---|
| `--background` | `#0A0A0B` | `hsl(240 5% 4%)` | Page background | Near-black with a micro hint of warmth (240° blue, but 5% saturation keeps it effectively neutral). Deeper than plain `#111` for a premium dark-field feel. |
| `--foreground` | `#EDEDED` | `hsl(0 0% 93%)` | Body text, headings | High-contrast off-white, softer than pure `#FFF` to reduce eye strain on long reads. |
| `--primary` | `#D4874A` | `hsl(28 62% 56%)` | Buttons, links, accents, interactive states | The ONE accent. Warm amber — high saturation at medium luminance pops against the dark background. "Signal" color. |
| `--primary-foreground` | `#FFFFFF` | `hsl(0 0% 100%)` | Text on primary backgrounds | Pure white guarantees legibility on amber buttons/badges. |
| `--muted` | `#18181B` | `hsl(240 6% 10%)` | Code blocks, card backgrounds, subtle surfaces | One step up from background. Subtle surface distinction without harsh borders. |
| `--muted-foreground` | `#A1A1AA` | `hsl(240 4% 65%)` | Secondary text, descriptions, meta info | Soft mid-grey — secondary info is present but receded. |
| `--border` | `#27272A` | `hsl(240 5% 16%)` | Borders, dividers, card outlines | Visible but quiet border. Enough contrast to define edges without competing with content. |
| `--accent` | `#E8A066` | `hsl(28 72% 65%)` | Hover states, secondary highlights | Lighter, more saturated amber for hover/focus — draws the eye without being garish. |

### Light Theme (`.light` on `<html>`)

| Token | Hex | HSL | Usage | Rationale |
|---|---|---|---|---|
| `--background` | `#FAFAF9` | `hsl(60 9% 98%)` | Page background | Warm off-white (natural paper tone) — cooler whites feel sterile for long-form reading. |
| `--foreground` | `#1C1917` | `hsl(30 9% 10%)` | Body text, headings | Warm near-black (stone-900). Less harsh than pure black on white. |
| `--primary` | `#C77A3E` | `hsl(26 55% 51%)` | Buttons, links, accents | Deeper burnt-orange variant of the amber accent — needs lower lightness to maintain WCAG AA against white backgrounds. |
| `--primary-foreground` | `#FFFFFF` | `hsl(0 0% 100%)` | Text on primary (non‑link) backgrounds | White text on the deeper amber button bg stays legible. |
| `--muted` | `#F5F5F4` | `hsl(60 6% 96%)` | Code blocks, card backgrounds | Soft warm grey — cards visually recede just enough. |
| `--muted-foreground` | `#78716C` | `hsl(34 6% 45%)` | Secondary text, descriptions | Warm mid-grey — readable but clearly secondary. |
| `--border` | `#E7E5E4` | `hsl(24 6% 90%)` | Borders, dividers | Soft warm border — present but polite. |
| `--accent` | `#D4884A` | `hsl(28 62% 56%)` | Hover states, secondary highlights | Matches the dark theme primary — a consistent brand color appearing in both modes. |

### Semantic Variables (via `@theme inline`)

```css
@theme inline {
  --background, --foreground, --primary, --primary-foreground,
  --muted, --muted-foreground, --border, --accent, --radius
}
```

These CSS variables are available as Tailwind utilities: `bg-background`, `text-foreground`, `border-border`, etc.

### Contextual Colors (Adjusted for Amber)

| Usage | Dark | Light |
|---|---|---|
| **Gradient hero text** | `linear-gradient(135deg, hsl(28 72% 60%) 0%, hsl(38 80% 55%) 100%)` — warm amber→gold | Same gradient (light theme hero is dark-first; gradient works the same way) |
| **Radial hero glow** | `radial-gradient(circle, hsl(28 62% 56% / 0.08) 0%, transparent 70%)` | — |
| **Stat count text** | `hsl(28 72% 65%)` (bright amber) | `hsl(26 55% 43%)` (burnt orange) |
| **Card hover border** | `hsl(28 62% 56% / 0.3)` | `hsl(26 55% 43% / 0.35)` |
| **Category badge** | bg `hsl(28 62% 56% / 0.12)`, text `hsl(28 72% 65%)`, border `hsl(28 62% 56% / 0.2)` | bg `hsl(26 55% 43% / 0.12)`, text `hsl(26 55% 43%)`, border `hsl(26 55% 43% / 0.2)` |
| **Article card hover title** | `hsl(28 72% 65%)` (amber) | `hsl(26 55% 43%)` (burnt orange) |
| **Footer logo accent** | `hsl(28 62% 56%)` — the amber primary | `hsl(26 55% 51%)` — the light-mode primary |
| **Copy button success** | `hsl(142 70% 35%)` (green — functional, not brand) | Same |
| **Random Particles** | `hsla(28–45, 60–80%, 50–60%, 0.1–0.5)` — amber to gold range | — |
| **Spline fallback particles** | idem | — |

### Category Banner Gradients (per topic — shifted to amber family)

| Category | Gradient | Accent Hue |
|---|---|---|
| AI | `linear-gradient(135deg, hsl(28 72% 60% / 0.2), hsl(220 85% 60% / 0.1))` — amber → cool blue | The amber brand is the hero; other hues are subordinate complements |
| Coding | `linear-gradient(135deg, hsl(38 80% 55% / 0.25), hsl(28 62% 56% / 0.1))` — gold → amber | Warm coding glow |
| Data Analytics | `linear-gradient(135deg, hsl(160 70% 50% / 0.2), hsl(28 62% 56% / 0.1))` — teal → amber | Data teal with amber undertone |
| Tutorials | `linear-gradient(135deg, hsl(190 80% 55% / 0.2), hsl(38 80% 55% / 0.1))` — cyan → gold | Learning clarity |
| Career | `linear-gradient(135deg, hsl(330 75% 55% / 0.2), hsl(28 62% 56% / 0.1))` — rose → amber | Warm ambition |

---

## 2. Typography

### Font Stack

```css
font-family: "Inter", system-ui, sans-serif;          /* body */
font-family: "JetBrains Mono", "Geist Mono", monospace; /* code */
```

Declared in `globals.css` body + `@layer base` code/pre, and in `tailwind.config.ts`:

```ts
fontFamily: {
  sans: ["Inter", "system-ui", "sans-serif"],
  mono: ["JetBrains Mono", "Geist Mono", "monospace"],
}
```

Imported via `@fontsource/inter` and `@fontsource/jetbrains-mono` (npm).

### Scale

| Element | Size | Weight | Letter-spacing | Notes |
|---|---|---|---|---|
| `.max-h1` (hero) | `clamp(2.5rem, 6vw, 4.5rem)` | 800 | `-0.03em` | Gradient text |
| `.section-title` | `clamp(1.75rem, 4vw, 2.5rem)` | 700 | `-0.02em` | Section headings |
| Article page h1 | `text-4xl md:text-5xl` (2.25rem / 3rem) | 700 | — | Bold + leading-tight |
| `.prose h1` | `2.25rem` | 800 | `-0.03em` | In-article |
| `.prose h2` | `1.65rem` | 700 | `-0.02em` | + border-bottom |
| `.prose h3` | `1.3rem` | 600 | — | |
| `.prose h4` | `1.1rem` | 600 | — | |
| `.max-p` (hero) | `clamp(1.05rem, 2vw, 1.35rem)` | 400 | — | |
| `.section-desc` | `1.05rem` | 400 | — | |
| `.article-title` | `1.1rem` | 600 | — | Card title |
| `.article-desc` | `0.88rem` | 400 | — | Card excerpt |
| `.article-category` | `0.72rem` | 600 | `0.06em` | Uppercase pill badge |
| `.stat-count` | `1.35rem` | 700 | — | Animated number |
| `.stat-name` | `0.8rem` | 500 | `0.08em` | Uppercase label |
| Body (.prose p) | ~1rem | 400 | — | line-height: 1.75 |
| Nav links | `text-sm` (0.875rem) | 500 | — | |
| Code (inline) | `0.85em` | 500 | — | |
| Code (blocks) | `0.875em` | 400 | — | |

### Prose Overrides

All `--tw-prose-*` variables are mapped to CSS variables (see `globals.css` lines 132–167) so typography plugin output respects dark/light mode automatically.

---

## 3. Spacing & Layout

### Page Container

```css
.max-c {
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: 1.5rem;
}
```

Article page uses `max-w-4xl mx-auto px-4 sm:px-6 lg:px-8` for `div.article-root` wrapper.

### Section Vertical Rhythm

| Section | Padding |
|---|---|
| Hero | `padding-block: 5rem 3rem` |
| Stats | `padding-block: 3rem` |
| Topics | `padding-block: 5rem 4rem` |
| Latest Articles | `padding-block: 4rem 5rem` |
| Article page wrapper | `py-12` |
| Related Articles | `mt-16 pt-12` |

### Gap System

- **Section inner**: `flex flex-col gap: 1.25rem`
- **Cards in list**: `1.25rem` (articles), `1.25rem` (topics grid), `1rem` (stats grid)
- **Grid min-column**: stats `140px`, topics `180px`, carousel slides `360px` (280px mobile)

### Border Radius

```css
--radius: 10px;                    /* lg */
calc(var(--radius) - 4px)          /* md:   6px */
calc(var(--radius) - 6px)          /* sm:   4px */
```

Used for: cards, buttons, code blocks, sheet, modal, cover image, category banner.

---

## 4. Navigation & Layout

### Header

- `sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur`
- Desktop: centered `container mx-auto px-4`, `h-16` flex row
- Links: `nav-link` with underline animation (`scaleX(0)` → `scaleX(1)` on hover)
- Theme toggle: stacked Sun/Moon icons with opacity + rotate transition
- Mobile: Sheet (shadcn/ui) with right slide animation

### Footer

- `bg-[#0F0F11]/10 relative h-fit rounded-3xl overflow-hidden`
- 4-column grid on desktop, collapses to 2 then 1
- Contains `TextHoverEffect` SVG (large "InsightNerd" text, gradient stroke + mouse reveal mask)
- `FooterBackgroundGradient` — soft radial glow + bottom fade
- Social icons inline SVG (Github, LinkedIn), Mail link

### Layout Hierarchy (layout.tsx)

```
<html>
  <body className="flex flex-col min-h-full">
    <LenisProvider>
      <Navigation />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <SubscribeModal />
    </LenisProvider>
  </body>
</html>
```

---

## 5. Components Catalog

### UI Primitives (in `src/components/ui/`)

| Component | Tech | Variants / Props |
|---|---|---|
| `Button` | Radix Slot + CVA | variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`; sizes: `default`, `sm`, `lg`, `icon` |
| `Sheet` | Radix Dialog + CVA | sides: `top`, `bottom`, `left`, `right` (default); subcomponents: `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription` |
| `TextHoverEffect` | Custom SVG | props: `text`, `duration`; gradient stroke + radial reveal mask on mouse move |
| `FooterBackgroundGradient` | Custom div | Soft primary glow + bottom fade |

### Page-Level Animation Wrappers

| Component | GSAP | StringTune | Smooothy | Used By |
|---|---|---|---|---|
| `HomeAnimations` | Hero split, stats/topics/cards reveal | magnetic (CTA, stats), tilt (topic cards), parallax (article cards) | Article carousel (when >4) | Landing page |
| `ArticleAnimations` | Header entrance, prose reveal | parallax (cover image), progress (reading bar) | Related articles carousel | Article pages |
| `CategoryPageAnimations` | Title + cards reveal | — | — | Category pages |
| `ContentPageAnimations` | Heading + prose/card reveal | — | — | About, Contact pages |
| `PageTransition` | CSS opacity fade on route change | — | — | Wraps `<main>` in layout |

### Feature Components

| Component | Description |
|---|---|
| `SplineHeroBackground` | Spline 3D scene with 300ms load delay, SplineErrorBoundary, reduced-motion guard; falls back to `HeroBackground` (Canvas particles) |
| `HeroBackground` | Zero-dep Canvas particle system (80 particles, blue–indigo hue range, 200ms init delay) |
| `LenisProvider` | Smooth scroll via Lenis, synced with GSAP ticker + ScrollTrigger scrollerProxy |
| `CategoryBanner` | Gradient banner per category with large emoji, CSS fade animation |
| `JsonLd` | Injects JSON-LD structured data for SEO |
| `SubscribeModal` | Delayed (3s) email capture modal, localStorage dismiss |
| `ScrollReveal` | IntersectionObserver-based reveal with direction (up/down/left/right) and delay |

---

## 6. Animation System

### Philosophy

- **Lazy-loaded**: GSAP, Lenis, StringTune, Smooothy are all dynamic `import()` — never block first paint.
- **Reduced-motion**: Every animation component respects `prefers-reduced-motion: reduce`. Some degrade gracefully (CSS fallbacks), others skip entirely (Spline, particles).
- **Performance-first**: Canvas > Three.js for fallback; CSS > JS where possible; progressive enhancement.

### Tech Stack

| Library | Purpose | Load Strategy |
|---|---|---|
| GSAP 3.15 + ScrollTrigger | Scroll-triggered entrance animations, hero word split | Dynamic `import()` in `useEffect` |
| Lenis 1.3 | Smooth scrolling | Dynamic `import()` with 200ms defer |
| StringTune (`@fiddle-digital/string-tune`) | Magnetic, tilt, parallax, reading progress | Dynamic `import()`, `getInstance()` singleton |
| Smooothy (`smooothy`) | Article/slide carousel | Dynamic `import()`, manual RAF loop with `slider.update()` |

### GSAP Pattern (all animation components)

```ts
"use client";
import { useEffect, useRef, type ReactNode } from "react";

export function SomeAnimations({ children }: { children: ReactNode }) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const gsapModule = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsapModule.default.registerPlugin(ScrollTrigger);

      const ctx = gsapModule.default.context(() => {
        // GSAP animations here — scoped to ref
      }, scopeRef.current);

      ScrollTrigger.refresh();
      flushInViewScrollTriggers(ScrollTrigger);
    };
    init();
    return () => ctx?.revert();
  }, []);

  return <div ref={scopeRef}>{children}</div>;
}
```

### StringTune Pattern

```ts
// 1. Singleton setup
const st = StringTune.getInstance();
st.scrollDesktopMode = "default";     // No smooth-scroll conflict with Lenis
st.use(StringMagnetic);               // Register effects
st.start(60);                         // 60fps

// 2. Set attributes programmatically (NOT in JSX — React/Next Link rejects non-standard props)
el.setAttribute("string", "magnetic");
el.setAttribute("string-factor", "8");

// 3. Re-scan DOM after attribute changes
StringTune.getInstance().onRebuild();
```

### Smooothy Pattern

```ts
const slider = new Core(carouselElement, {
  infinite: false,
  snap: true,
  dragSensitivity: 0.005,
  scrollSensitivity: 1,
  lerpFactor: 0.25,
});
// Manual RAF loop
const loop = () => { slider.update(); rafId = requestAnimationFrame(loop); };
rafId = requestAnimationFrame(loop);
```

### Shared Module: `src/lib/animations/`

| File | Exports |
|---|---|
| `constants.ts` | `SELECTORS`, `SLIDER_DATA`, `STRING`, `DURATION`, `SCROLL_TRIGGER` |
| `reduced-motion.ts` | `prefersReducedMotion()`, `onReducedMotionChange()`, `motionValue()`, `flushInViewScrollTriggers()` |

### Key Timing Values

| Animation | Duration | Easing |
|---|---|---|
| Hero word stagger (per word) | 0.55s | `power2.out` |
| Hero stagger offset | 0.06s | — |
| Hero paragraph | 0.5s (delay 0.6s) | `power2.out` |
| Stats cards | 0.45s (stagger 0.08s) | `power2.out` |
| Topic cards | 0.5s (stagger 0.08s) | `power2.out` |
| Article cards (list) | 0.45s (stagger 0.1s) | `power2.out` |
| Article header | 0.4–0.5s per element | `power2.out` |
| Prose content blocks | 0.4s (stagger 0.05s) | `power2.out` |
| Category page title | 0.5s | `power2.out` |
| Category page cards | 0.45s (stagger 0.1s) | `power2.out` |
| Scroll reveal (ScrollReveal) | 0.6s | CSS ease-out |
| Nav underline | 200ms | CSS ease |
| Theme icon swap | 200ms | CSS ease |
| Sheet slide | 250ms in / 200ms out | CSS ease-in-out |
| Page transition | 250ms | CSS ease-out |

---

## 7. Theme System

### Dark-first strategy

- **Default**: dark theme (no class on `<html>`)
- **Light**: `.light` class applied to `<html>`
- **Persistence**: `localStorage` key `insightnerd-theme` (`"dark"` or `"light"`)
- **Initial load**: Inline `<script>` in `layout.tsx` reads localStorage/prefers-color-scheme and sets `.light` class before paint — prevents flash.

### Theme Toggle (in Navigation.tsx)

```ts
<Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
  <div className="theme-icon-wrapper">
    <Sun className="theme-icon" style={{ opacity, transform }} />
    <Moon className="theme-icon" style={{ opacity, transform }} />
  </div>
</Button>
```

All theme-specific styles are nested under `html.light .selector` in `globals.css`.

---

## 8. Responsive Breakpoints

### Standard Tailwind breakpoints (used throughout)

| Breakpoint | Min-width | Notes |
|---|---|---|
| `sm` | 640px | 2-col footer grids, mobile carousel width |
| `md` | 768px | Show desktop nav, article h1 size bump |
| `lg` | 1024px | 4-col footer, show TextHoverEffect, article wrapper padding |
| `xl` | 1280px | — |

### Fluid sizing via clamp()

- `.max-h1`: `clamp(2.5rem, 6vw, 4.5rem)`
- `.section-title`: `clamp(1.75rem, 4vw, 2.5rem)`
- `.max-p`: `clamp(1.05rem, 2vw, 1.35rem)`

### Carousel slide width

```css
[data-slider] > * {
  width: 360px;
}
@media (max-width: 640px) {
  [data-slider] > * { width: 280px; }
}
```

---

## 9. Reduced Motion

Every animation component checks `prefers-reduced-motion: reduce`:

| Strategy | Where |
|---|---|
| Skip entirely (return null) | `SplineHeroBackground`, `HeroBackground` |
| Apply final state directly | `ArticleAnimations` (header `opacity: 1`), `ContentPageAnimations` |
| CSS `@media` overrides | Nav underline, theme icons, sheet slide, carousel (`overflow-x: auto` + scroll-snap) |
| `motionValue()` helper | Animated stat counts etc. (via `reduced-motion.ts`) |

---

## 10. Transitions & Hover Effects

### Card Stacks

| Element | Normal | Hover | Transition |
|---|---|---|---|
| `.stat-item` | bg `--muted` +1, border `--border` | bg `--muted` +2, border `primary/0.3`, translate `0 -2px` | 0.25s |
| `.topic-card` | bg `--muted`, border `--border` | bg +2, border `primary/0.35`, box-shadow with primary tint | 0.3s |
| `.article-card` | bg `--muted`, border `--border` | bg +2, border `primary/0.35`, translate `0 -2px`, title → primary | 0.25s |
| `.topic-icon` | scale 1 | scale 1.15 | 0.3s |

### Navigation

- Link underline: `transform: scaleX(0)` → `scaleX(1)` over 200ms, `origin: left`
- Social links in footer: text → `hsl(260 100% 65%)` (vivid indigo)
- Newsletter/Subscribe button: hover `bg-primary/90` via tailwind

### Code Copy Button

- Hidden by default (`opacity: 0`)
- Appears on `pre:hover` / `pre:focus-within` (0.2s transition)
- Copied state: green background `hsl(142 70% 35%)`, text "Copied!" for 2 seconds

---

## 11. Easing Patterns

| Context | Easing |
|---|---|
| GSAP entrances (all) | `power2.out` |
| Nav link underline | `ease` (CSS) |
| Theme icon swap | `ease` (CSS) |
| Sheet slide | `ease-in-out` (CSS) |
| Copy button | `ease` (CSS) |
| ScrollReveal component | `ease-out` (CSS) |
| Page transition | `ease-out` (CSS) |

---

## 12. Utility Patterns

### `cn()` function

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Used by: `Button`, `Sheet` — resolves Tailwind class conflicts.

### Data Attributes

- `data-split="hero"` — marks hero h1 for word-split
- `data-slider="latest"` / `data-slider="related"` — mounts smooothy carousel
- `data-toc` / `data-toc-list` — TOC container and nav list
- `string`, `string-factor`, `string-cursor-target` — StringTune effect attributes (set programmatically via JS, not JSX)

---

## 13. Future Considerations

- **Spacing tokens are not centralized** — many component-specific values are scattered in `globals.css` as hardcoded values (e.g., `padding: 2.5rem 1.5rem` for topic cards). Could benefit from a spacing scale.
- **No design-token JSON** — CSS variables exist but are not exported to a shareable format (Figma, Storybook).
- **Several inaccessible color ratios** — light theme primary (`hsl(25 65% 45%)` on white) may have insufficient contrast in some states. Should be audited with a11y tools.
- **No icon system** — uses emoji for topic icons, lucide-react for nav/modal, inline SVG for footer socials. Mix of approaches.
- **No component library** beyond the 4 UI primitives. Components are mostly page-specific with duplicated patterns (e.g., article card markup repeated in `page.tsx` and `posts/[slug]/page.tsx`).
