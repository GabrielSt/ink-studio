/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ink: {
          bg: "#0a0a0a",
          card: "#111111",
          bar: "#141414",
          border: "#1f1f1f",
          "border-warm": "#2a2310",
          green: "#22c55e",
          "green-dark": "#16a34a",
          "green-glow": "#4ade80",
          muted: "#a1a1aa",
          dim: "#52525b",
          surface: "#1a1a1a",
          gold: "#D4AF37",
          "gold-dim": "#b8972e",
        },
      },
    },
  },
  plugins: [],
};
