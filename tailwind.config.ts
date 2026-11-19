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
        ivory: {
          50: "#FCFAF6",
          100: "#F8F4EC",
          200: "#F3EDE1",
          300: "#EDE2CF",
          400: "#DFCDB0",
        },
        champagne: {
          DEFAULT: "#EDE2CF",
          light: "#F7F2E9",
          dark: "#D6C3A3",
        },
        gold: {
          light: "#F3E7CA",
          DEFAULT: "#A77B35",
          soft: "#D7B875",
          hover: "#8F672B",
          dark: "#725321",
        },
        brown: {
          DEFAULT: "#49341F",
          dark: "#332415",
          light: "#695034",
          muted: "#8C7359",
        },
        navy: {
          DEFAULT: "#14213D",
          deep: "#0B1323",
          card: "#121E35",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "'Cormorant Garamond'", "Georgia", "Cambria", "serif"],
        cormorant: ["'Cormorant Garamond'", "Georgia", "serif"],
        cinzel: ["'Cinzel'", "serif"],
        manrope: ["'Manrope'", "'Inter'", "sans-serif"],
        script: ["'Alex Brush'", "'Great Vibes'", "'Brush Script MT'", "'Snell Roundhand'", "cursive"],
        sans: ["'Inter'", "'DM Sans'", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(73, 52, 31, 0.08), 0 4px 6px -2px rgba(73, 52, 31, 0.04)",
        "luxury-lg": "0 20px 40px -15px rgba(73, 52, 31, 0.12), 0 8px 16px -4px rgba(73, 52, 31, 0.06)",
        gold: "0 4px 20px -2px rgba(167, 123, 53, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;

