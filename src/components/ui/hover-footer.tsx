"use client";

import React, { useEffect, useRef, useState } from "react";

/* ─── TextHoverEffect ─── */

export const TextHoverEffect = ({
  text,
  duration,
}: {
  text: string;
  duration?: number;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setMaskPosition({ cx: "50%", cy: "50%" });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    if (svgRect.width === 0 || svgRect.height === 0) {
      setMaskPosition({ cx: "50%", cy: "50%" });
      return;
    }

    if (cursor.x === 0 && cursor.y === 0) return;

    const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
    const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;

    if (!Number.isFinite(cxPercentage) || !Number.isFinite(cyPercentage)) {
      setMaskPosition({ cx: "50%", cy: "50%" });
      return;
    }

    const clampedCx = Math.min(100, Math.max(0, cxPercentage));
    const clampedCy = Math.min(100, Math.max(0, cyPercentage));

    setMaskPosition({
      cx: `${clampedCx}%`,
      cy: `${clampedCy}%`,
    });
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className="select-none"
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#D4874A" />
              <stop offset="50%" stopColor="#E8A066" />
              <stop offset="100%" stopColor="#C77A3E" />
            </>
          )}
        </linearGradient>

        <radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          cx={maskPosition.cx}
          cy={maskPosition.cy}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-neutral-200 font-[helvetica] text-7xl font-bold dark:stroke-neutral-800"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-neutral-200 font-[helvetica] text-7xl font-bold dark:stroke-neutral-800"
        style={{
          strokeDasharray: 1000,
          strokeDashoffset: mounted ? 0 : 1000,
          transition: `stroke-dashoffset ${duration ?? 4}s ease-in-out`,
        }}
      >
        {text}
      </text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        mask="url(#textMask)"
        className="fill-transparent font-[helvetica] text-7xl font-bold footer-wordmark-gradient"
      >
        {text}
      </text>
    </svg>
  );
};

/* ─── FooterBackgroundGradient ─── */

export function FooterBackgroundGradient() {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Soft radial glow from center-top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(28 62% 56% / 0.25), transparent 70%)",
        }}
      />
      {/* Subtle bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0F0F11]/60 to-transparent" />
    </div>
  );
}
