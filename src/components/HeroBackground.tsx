"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  hue: number;
}

/**
 * Lightweight 2D Canvas particle background for the hero section.
 *
 * - Zero dependencies — no Three.js, no WebGL.
 * - Initializes after a 200ms delay so main content paints first.
 * - Gracefully degrades: if reduced motion is preferred, renders nothing.
 * - The container is aria-hidden="true" and pointer-events: none.
 */
export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let animationId = 0;
    let mounted = true;

    const init = () => {
      const canvas = document.createElement("canvas");
      canvas.style.cssText = "display:block;width:100%;height:100%";
      container.appendChild(canvas);

      const ctx = canvas.getContext("2d")!;
      let width = 0;
      let height = 0;

      const PARTICLE_COUNT = 80;
      const particles: Particle[] = [];

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio, 2);
        width = container.clientWidth;
        height = container.clientHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      const createParticles = () => {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 2.5 + 0.5,
            alpha: Math.random() * 0.4 + 0.1,
            hue: 28 + Math.random() * 17, // 28–45 (amber → gold)
          });
        }
      };

      const draw = (time: number) => {
        if (!mounted) {
          cancelAnimationFrame(animationId);
          return;
        }
        animationId = requestAnimationFrame(draw);

        ctx.clearRect(0, 0, width, height);

        for (const p of particles) {
          // Gentle drift
          p.x += p.vx + Math.sin(time * 0.0005 + p.hue) * 0.1;
          p.y += p.vy + Math.cos(time * 0.0006 + p.hue * 0.7) * 0.1;

          // Soft boundary wrap
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 85%, 60%, ${p.alpha})`;
          ctx.fill();
        }
      };

      resize();
      createParticles();
      animationId = requestAnimationFrame(draw);

      window.addEventListener("resize", resize);
      return () => {
        window.removeEventListener("resize", resize);
      };
    };

    // Small delay so main content renders before canvas starts
    const timer = setTimeout(init, 200);

    return () => {
      mounted = false;
      clearTimeout(timer);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-three-bg"
      aria-hidden="true"
    />
  );
}
