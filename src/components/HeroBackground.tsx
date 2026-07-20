"use client";

import { useEffect, useRef } from "react";
import type { WebGLRenderer, Scene, PerspectiveCamera, Points, BufferGeometry } from "three";

/**
 * Lazy-loaded Three.js floating particle background for the hero section.
 *
 * - Initializes after a 200ms delay so main content paints first.
 * - Gracefully degrades: if Three.js fails or the user has reduced motion
 *   preference, renders nothing — no layout shift, no console noise.
 * - Uses alpha: true, low-power hint, and caps pixel ratio at 2 for perf.
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
    let renderer: WebGLRenderer | null = null;
    let scene: Scene | null = null;
    let camera: PerspectiveCamera | null = null;
    let particles: Points | null = null;
    let mounted = true;

    const init = async () => {
      try {
        const THREE = await import("three");

        // ---- Scene ----
        scene = new THREE.Scene();

        // ---- Camera ----
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
        camera.position.z = 14;

        // ---- Renderer ----
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
          powerPreference: "low-power",
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // ---- Particles ----
        const PARTICLE_COUNT = 80;
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const colors = new Float32Array(PARTICLE_COUNT * 3);

        const primary = new THREE.Color("hsl(260, 85%, 60%)"); // indigo
        const secondary = new THREE.Color("hsl(220, 85%, 60%)"); // blue

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          // Spread particles across a wide volume
          positions[i * 3] = (Math.random() - 0.5) * 24;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

          const c = primary.clone().lerp(secondary, Math.random());
          colors[i * 3] = c.r;
          colors[i * 3 + 1] = c.g;
          colors[i * 3 + 2] = c.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3)
        );
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
          size: 0.16,
          vertexColors: true,
          transparent: true,
          opacity: 0.5,
          sizeAttenuation: true,
          depthWrite: false,
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // ---- Animation loop ----
        const animate = (time: number) => {
          if (!mounted) return;
          animationId = requestAnimationFrame(animate);

          if (particles) {
            const pos = (
              particles.geometry as BufferGeometry
            ).attributes.position.array as Float32Array;

            for (let i = 0; i < PARTICLE_COUNT; i++) {
              const idx = i * 3;
              // Gentle orbital drift — each particle moves independently
              pos[idx] += Math.sin(time * 0.0003 + i) * 0.001;
              pos[idx + 1] += Math.cos(time * 0.0004 + i * 0.7) * 0.001;
              pos[idx + 2] += Math.sin(time * 0.0002 + i * 1.3) * 0.001;

              // Soft boundary wrap
              if (Math.abs(pos[idx]) > 14) pos[idx] *= -0.9;
              if (Math.abs(pos[idx + 1]) > 10) pos[idx + 1] *= -0.9;
              if (Math.abs(pos[idx + 2]) > 8) pos[idx + 2] *= -0.9;
            }
            (particles.geometry as BufferGeometry).attributes.position.needsUpdate =
              true;

            // Slow whole-field rotation
            particles.rotation.y = time * 0.00004;
            particles.rotation.x = Math.sin(time * 0.00002) * 0.05;
          }

          if (renderer && scene && camera) {
            renderer.render(scene, camera);
          }
        };

        animationId = requestAnimationFrame(animate);
      } catch (err) {
        console.warn("Hero 3D background unavailable:", err);
      }
    };

    // Small delay so main content renders before Three.js starts
    const timer = setTimeout(init, 200);

    const handleResize = () => {
      if (!camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      mounted = false;
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      renderer?.dispose();
      if (renderer?.domElement?.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
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
