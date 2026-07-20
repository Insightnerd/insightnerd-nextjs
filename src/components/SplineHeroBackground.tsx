"use client";

import { Component, useState, useEffect, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { HeroBackground } from "@/components/HeroBackground";

// ─── Error boundary — catches dynamic-import / render errors ───

class SplineErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// ─── Dynamic Spline background (ssr: false) ───

const DynamicedSpline = dynamic(
  () =>
    import("@/components/blocks/3d-hero-section-boxes").then(
      (m) => ({ default: m.HeroSplineBackground })
    ),
  { ssr: false, loading: () => null }
);

// ─── Wrapper with load delay, reduced-motion guard, and fallback ───

export function SplineHeroBackground() {
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [splineErrored, setSplineErrored] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    // 300 ms delay — hero text paints before Spline chunk starts loading
    const timer = setTimeout(() => setShouldLoad(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Reduced motion → nothing (zero load cost)
  if (prefersReduced) return null;

  // Before delay fires or if Spline errored → fall back to Three.js particles
  if (!shouldLoad || splineErrored) {
    return (
      <div className="hero-three-bg" aria-hidden="true">
        <HeroBackground />
      </div>
    );
  }

  return (
    <div className="hero-three-bg" aria-hidden="true">
      <SplineErrorBoundary onError={() => setSplineErrored(true)}>
        <DynamicedSpline />
      </SplineErrorBoundary>
    </div>
  );
}
