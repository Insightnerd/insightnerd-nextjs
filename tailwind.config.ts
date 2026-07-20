import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Declare CSS variables that will be available for Tailwind utilities
    // Colors can be referenced directly in @theme blocks in globals.css
    colors: {
      background: "var(--background)",
      foreground: "var(--foreground)",
      // Electric indigo/violet accent
      primary: {
        DEFAULT: "var(--primary)",
        foreground: "var(--primary-foreground)",
      },
      // Near-black background
      "near-black": "#0B0B10",
    },
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      mono: ["JetBrains Mono", "Geist Mono", "monospace"],
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 4px)",
      sm: "calc(var(--radius) - 6px)",
    },
  },
  plugins: [animate],
} satisfies Config;