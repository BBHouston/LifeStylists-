import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  "#fdf8e7",
          100: "#f9eebc",
          200: "#f4e08a",
          300: "#edcc55",
          400: "#e6bb30",
          500: "#d4a017",
          600: "#b8850f",
          700: "#93670d",
          800: "#6e4e10",
          900: "#4a3410",
        },
        navy: {
          900: "#060d1a",
          800: "#0a1628",
          700: "#0f1f38",
          600: "#162844",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #d4a017 0%, #f4e08a 50%, #d4a017 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
