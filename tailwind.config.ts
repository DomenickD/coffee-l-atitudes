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
        espresso: {
          950: "#120D0A",
          900: "#1B1410",
          800: "#2A1F19",
          700: "#3D2D24",
          600: "#543E32",
        },
        crema: {
          50: "#FBF8F3",
          100: "#F4EDE1",
          200: "#E8DAC4",
          300: "#D5BC96",
          400: "#C29B63",
          500: "#A87C41",
        },
        canopy: {
          900: "#0F241B",
          800: "#18382A",
          700: "#234E3B",
          600: "#2F664E",
          500: "#4A8569",
        },
        terracotta: {
          600: "#A84A2F",
          500: "#C35B3D",
          400: "#D97A5D",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "radial-vignette":
          "radial-gradient(ellipse at center, rgba(18,13,10,0.18) 0%, rgba(18,13,10,0.72) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
