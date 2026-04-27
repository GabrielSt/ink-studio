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
          border: "#1f1f1f",
          green: "#22c55e",
          "green-dark": "#16a34a",
          "green-glow": "#4ade80",
          muted: "#a1a1aa",
          surface: "#1a1a1a",
        },
      },
    },
  },
  plugins: [],
};
