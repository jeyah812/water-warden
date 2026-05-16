/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Syne", "system-ui", "sans-serif"],
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "ripple-expand": "ripple-expand 4.2s ease-out infinite",
        "float-slow": "float-slow 18s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "skeleton-shine": "skeleton-shine 1.8s ease-in-out infinite",
      },
      keyframes: {
        "ripple-expand": {
          "0%": { transform: "scale(0.35)", opacity: "0.55" },
          "100%": { transform: "scale(1)", opacity: "0" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "33%": { transform: "translate(2%, -1.5%)" },
          "66%": { transform: "translate(-1.5%, 1%)" },
        },
        "glow-pulse": {
          "0%, 100%": {
            opacity: "0.5",
            boxShadow:
              "0 0 20px rgba(34, 211, 238, 0.25), 0 0 60px rgba(6, 182, 212, 0.15)",
          },
          "50%": {
            opacity: "1",
            boxShadow:
              "0 0 32px rgba(34, 211, 238, 0.45), 0 0 90px rgba(14, 165, 233, 0.25)",
          },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        "skeleton-shine": {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(rgba(34, 211, 238, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
}
